<?php

namespace App\Tests\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class SecurityControllerTest extends WebTestCase
{
    private KernelBrowser $client;
    private EntityManagerInterface $entityManager;
    private UserPasswordHasherInterface $passwordHasher;

    protected function setUp(): void
    {
        $this->client = static::createClient();
        $this->entityManager = static::getContainer()->get(EntityManagerInterface::class);
        $this->passwordHasher = static::getContainer()->get(UserPasswordHasherInterface::class);
    }

    public function testUserCanRegister(): void
    {
        $email = sprintf('inscription-%s@example.com', bin2hex(random_bytes(4)));
        $crawler = $this->client->request('GET', '/inscription');

        self::assertResponseIsSuccessful();
        $this->client->submit($crawler->selectButton('Créer mon compte')->form([
            'registration_form[prenom]' => 'Nouveau',
            'registration_form[nom]' => 'Membre',
            'registration_form[email]' => $email,
            'registration_form[telephone]' => '',
            'registration_form[plainPassword][first]' => 'secret123',
            'registration_form[plainPassword][second]' => 'secret123',
        ]));

        self::assertResponseRedirects('/login');

        $user = static::getContainer()->get(UserRepository::class)->findOneBy(['email' => $email]);
        self::assertInstanceOf(User::class, $user);
        self::assertTrue($this->passwordHasher->isPasswordValid($user, 'secret123'));

        $this->entityManager->remove($user);
        $this->entityManager->flush();
    }

    public function testUserCanLogInAndLogOut(): void
    {
        $user = $this->createUser('connexion@example.com', 'password');
        $crawler = $this->client->request('GET', '/login');

        $this->client->submit($crawler->selectButton('Se connecter')->form([
            '_username' => $user->getEmail(),
            '_password' => 'password',
        ]));

        self::assertResponseRedirects('/compte');
        $crawler = $this->client->followRedirect();
        self::assertSelectorTextContains('h1', 'Bonjour Test');

        $logoutUrl = $crawler->selectLink('Se déconnecter')->link()->getUri();
        $this->client->request('GET', $logoutUrl);
        self::assertResponseRedirects('/login');

        $this->deleteUser($user);
    }

    public function testUserCanChangePassword(): void
    {
        $user = $this->createUser('mot-de-passe@example.com', 'ancien123');
        $this->client->loginUser($user);
        $crawler = $this->client->request('GET', '/compte/mot-de-passe');

        self::assertResponseIsSuccessful();
        $this->client->submit($crawler->selectButton('Enregistrer')->form([
            'change_password_form[currentPassword]' => 'ancien123',
            'change_password_form[newPassword][first]' => 'nouveau123',
            'change_password_form[newPassword][second]' => 'nouveau123',
        ]));

        self::assertResponseRedirects('/compte');
        $this->entityManager->refresh($user);
        self::assertTrue($this->passwordHasher->isPasswordValid($user, 'nouveau123'));
        self::assertFalse($this->passwordHasher->isPasswordValid($user, 'ancien123'));

        $this->deleteUser($user);
    }

    public function testAccountRequiresAuthentication(): void
    {
        $this->client->request('GET', '/compte');

        self::assertResponseRedirects('http://localhost/login');
    }

    private function createUser(string $email, string $password): User
    {
        $repository = static::getContainer()->get(UserRepository::class);
        $existingUser = $repository->findOneBy(['email' => $email]);
        if ($existingUser instanceof User) {
            $this->deleteUser($existingUser);
        }

        $user = (new User())
            ->setEmail($email)
            ->setPrenom('Test')
            ->setNom('All4Sport')
            ->setCode('TEST-'.strtoupper(bin2hex(random_bytes(4))))
        ;
        $user->setPassword($this->passwordHasher->hashPassword($user, $password));

        $this->entityManager->persist($user);
        $this->entityManager->flush();

        return $user;
    }

    private function deleteUser(User $user): void
    {
        $this->entityManager->remove($user);
        $this->entityManager->flush();
    }
}
