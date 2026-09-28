<?php

namespace App\Controller;

use App\Entity\Produit;
use App\Repository\ProduitRepository;
use App\Repository\SportRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/catalogue')]
class CatalogController extends AbstractController
{
    #[Route('/produits', name: 'api_catalog_products', methods: ['GET'])]
    public function products(Request $request, ProduitRepository $products): JsonResponse
    {
        $universe = $this->cleanParameter($request->query->get('univers'));
        $sport = $this->cleanParameter($request->query->get('sport'));
        $query = $this->cleanParameter($request->query->get('q'));

        if (null !== $universe && !in_array($universe, ['homme', 'femme', 'enfant'], true)) {
            return $this->json(['message' => 'Univers inconnu.'], JsonResponse::HTTP_BAD_REQUEST);
        }

        return $this->json([
            'products' => array_map($this->normalizeProduct(...), $products->findForCatalog($universe, $sport, $query)),
        ]);
    }

    #[Route('/sports', name: 'api_catalog_sports', methods: ['GET'])]
    public function sports(SportRepository $sports): JsonResponse
    {
        return $this->json([
            'sports' => array_map(
                static fn ($sport): array => [
                    'code' => $sport->getCode(),
                    'name' => $sport->getLibelle(),
                    'image' => $sport->getImage(),
                    'productCount' => $sport->getProduits()->count(),
                ],
                $sports->findBy([], ['position' => 'ASC']),
            ),
        ]);
    }

    private function normalizeProduct(Produit $product): array
    {
        $image = $product->getImages()->first();

        return [
            'id' => $product->getId(),
            'reference' => $product->getReference(),
            'name' => $product->getDesignation(),
            'description' => $product->getDescription(),
            'brand' => $product->getMarque(),
            'universe' => $product->getUnivers(),
            'department' => $product->getRayon()?->getLibelle(),
            'sport' => [
                'code' => $product->getSport()?->getCode(),
                'name' => $product->getSport()?->getLibelle(),
            ],
            'price' => (float) $product->getPrixVente(),
            'previousPrice' => null === $product->getPrixBarre() ? null : (float) $product->getPrixBarre(),
            'rating' => $product->getNote() / 10,
            'reviewCount' => $product->getNombreAvis(),
            'image' => false === $image ? null : $image->getLibelle(),
        ];
    }

    private function cleanParameter(mixed $value): ?string
    {
        if (!is_string($value) || '' === trim($value)) {
            return null;
        }

        return strtolower(trim($value));
    }
}
