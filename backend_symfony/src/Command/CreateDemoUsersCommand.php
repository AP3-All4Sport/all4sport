<?php

namespace App\Command;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[AsCommand(
    name: 'app:create-demo-users',
    description: 'Crée les comptes locaux Alexis, Tomy et Julian.',
)]
class CreateDemoUsersCommand extends Command
{
    public function __construct(
        private readonly UserRepository $userRepository,
        private readonly EntityManagerInterface $entityManager,
        private readonly UserPasswordHasherInterface $passwordHasher,
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $password = $io->askHidden('Mot de passe commun (6 caractères minimum)');

        if (!is_string($password) || mb_strlen($password) < 6) {
            $io->error('Le mot de passe doit contenir au moins 6 caractères.');

            return Command::INVALID;
        }

        $accounts = [
            ['prenom' => 'Alexis', 'email' => 'alexis@all4sport.local'],
            ['prenom' => 'Tomy', 'email' => 'tomy@all4sport.local'],
            ['prenom' => 'Julian', 'email' => 'julian@all4sport.local'],
        ];
        $created = 0;

        foreach ($accounts as $account) {
            if (null !== $this->userRepository->findOneBy(['email' => $account['email']])) {
                $io->note(sprintf('Le compte %s existe déjà.', $account['email']));
                continue;
            }

            $user = (new User())
                ->setEmail($account['email'])
                ->setPrenom($account['prenom'])
                ->setNom('All4Sport')
                ->setCode('USR-'.strtoupper($account['prenom']))
            ;
            $user->setPassword($this->passwordHasher->hashPassword($user, $password));

            $this->entityManager->persist($user);
            ++$created;
        }

        $this->entityManager->flush();
        $io->success(sprintf('%d compte(s) créé(s).', $created));

        return Command::SUCCESS;
    }
}
