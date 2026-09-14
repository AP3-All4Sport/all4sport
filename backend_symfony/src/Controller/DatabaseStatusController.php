<?php

namespace App\Controller;

use Doctrine\DBAL\Connection;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class DatabaseStatusController extends AbstractController
{
    #[Route('/api/database/status', name: 'api_database_status', methods: ['GET'])]
    public function __invoke(Connection $connection): JsonResponse
    {
        try {
            // Cette requête vérifie uniquement la connexion et ne modifie aucune donnée.
            $connection->executeQuery('SELECT 1')->fetchOne();

            return $this->json([
                'connected' => true,
                'message' => 'Connexion à la base de données établie.',
            ]);
        } catch (\Throwable) {
            return $this->json([
                'connected' => false,
                'message' => 'La connexion à la base de données a échoué.',
            ], Response::HTTP_SERVICE_UNAVAILABLE);
        }
    }
}
