<?php

namespace App\Controller;

use App\Entity\User;
use App\Form\ForgotPasswordFormType;
use App\Form\ResetPasswordFormType;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Address;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;

class ResetPasswordController extends AbstractController
{
    #[Route('/mot-de-passe-oublie', name: 'app_forgot_password', methods: ['GET', 'POST'])]
    public function request(
        Request $request,
        UserRepository $userRepository,
        EntityManagerInterface $entityManager,
        MailerInterface $mailer,
    ): Response {
        if (null !== $this->getUser()) {
            return $this->redirectToRoute('app_account');
        }

        $form = $this->createForm(ForgotPasswordFormType::class);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $emailAddress = mb_strtolower(trim((string) $form->get('email')->getData()));
            $user = $userRepository->findOneBy(['email' => $emailAddress]);

            if ($user instanceof User) {
                $plainToken = bin2hex(random_bytes(32));
                $user
                    ->setResetPasswordToken(hash('sha256', $plainToken))
                    ->setResetPasswordExpiresAt(new \DateTimeImmutable('+1 hour'))
                ;
                $entityManager->flush();

                $mailer->send(
                    (new TemplatedEmail())
                        ->from(new Address('no-reply@all4sport.local', 'All4Sport'))
                        ->to((string) $user->getEmail())
                        ->subject('Réinitialisez votre mot de passe All4Sport')
                        ->htmlTemplate('emails/reset_password.html.twig')
                        ->context([
                            'first_name' => $user->getPrenom(),
                            'reset_url' => $this->generateUrl('app_reset_password', ['token' => $plainToken], 0),
                        ])
                );
            }

            $this->addFlash('success', 'Si un compte correspond à cette adresse, un lien de réinitialisation vient d’être envoyé.');

            return $this->redirectToRoute('app_forgot_password');
        }

        return $this->render('security/forgot_password.html.twig', [
            'forgot_password_form' => $form,
        ]);
    }

    #[Route('/reinitialiser-mot-de-passe/{token}', name: 'app_reset_password', methods: ['GET', 'POST'])]
    public function reset(
        string $token,
        Request $request,
        UserRepository $userRepository,
        UserPasswordHasherInterface $passwordHasher,
        EntityManagerInterface $entityManager,
    ): Response {
        if (null !== $this->getUser()) {
            return $this->redirectToRoute('app_account');
        }

        $user = $userRepository->findOneBy(['resetPasswordToken' => hash('sha256', $token)]);
        if (!$user instanceof User || null === $user->getResetPasswordExpiresAt() || $user->getResetPasswordExpiresAt() <= new \DateTimeImmutable()) {
            $this->addFlash('error', 'Ce lien de réinitialisation est invalide ou a expiré.');

            return $this->redirectToRoute('app_forgot_password');
        }

        $form = $this->createForm(ResetPasswordFormType::class);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $plainPassword = (string) $form->get('plainPassword')->getData();
            $user
                ->setPassword($passwordHasher->hashPassword($user, $plainPassword))
                ->setResetPasswordToken(null)
                ->setResetPasswordExpiresAt(null)
            ;
            $entityManager->flush();

            $this->addFlash('success', 'Votre mot de passe a été réinitialisé. Vous pouvez maintenant vous connecter.');

            return $this->redirectToRoute('app_login');
        }

        return $this->render('security/reset_password.html.twig', [
            'reset_password_form' => $form,
        ]);
    }
}
