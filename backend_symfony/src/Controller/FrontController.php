<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class FrontController extends AbstractController
{
    #[Route('/', name: 'app_react')]
    #[Route('/catalogue', name: 'app_catalog')]
    #[Route('/sports', name: 'app_sports')]
    #[Route('/produit/{id}', name: 'app_product', requirements: ['id' => '\d+'])]
    #[Route('/panier', name: 'app_cart')]
    public function index(): Response
    {
        return $this->render('front/index.html.twig');
    }
}
