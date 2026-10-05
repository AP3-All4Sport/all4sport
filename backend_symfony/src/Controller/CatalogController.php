<?php

namespace App\Controller;

use App\Entity\Produit;
use App\Repository\ProduitRepository;
use App\Repository\RayonRepository;
use App\Repository\SportRepository;
use App\Repository\TailleRepository;
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
        $category = $this->cleanParameter($request->query->get('categorie'));
        $size = $this->cleanParameter($request->query->get('taille'));
        $color = $this->cleanParameter($request->query->get('couleur'));
        $brand = $this->cleanParameter($request->query->get('marque'));
        $minimumPrice = $this->cleanPrice($request->query->get('prix_min'));
        $maximumPrice = $this->cleanPrice($request->query->get('prix_max'));
        $query = $this->cleanParameter($request->query->get('q'));

        if (null !== $universe && !in_array($universe, ['homme', 'femme', 'enfant'], true)) {
            return $this->json(['message' => 'Univers inconnu.'], JsonResponse::HTTP_BAD_REQUEST);
        }

        if (false === $minimumPrice || false === $maximumPrice || (is_float($minimumPrice) && is_float($maximumPrice) && $minimumPrice > $maximumPrice)) {
            return $this->json(['message' => 'Fourchette de prix invalide.'], JsonResponse::HTTP_BAD_REQUEST);
        }

        return $this->json([
            'products' => array_map($this->normalizeProduct(...), $products->findForCatalog($universe, $sport, $category, $size, $color, $brand, $minimumPrice, $maximumPrice, $query)),
        ]);
    }

    #[Route('/produits/{id}', name: 'api_catalog_product', requirements: ['id' => '\d+'], methods: ['GET'])]
    public function product(int $id, ProduitRepository $products): JsonResponse
    {
        $product = $products->find($id);
        if (null === $product) {
            return $this->json(['message' => 'Produit introuvable.'], JsonResponse::HTTP_NOT_FOUND);
        }

        return $this->json(['product' => $this->normalizeProduct($product)]);
    }

    #[Route('/filtres', name: 'api_catalog_filters', methods: ['GET'])]
    public function filters(
        Request $request,
        RayonRepository $categories,
        TailleRepository $sizes,
        ProduitRepository $products,
    ): JsonResponse {
        $universe = $this->cleanParameter($request->query->get('univers'));
        $sport = $this->cleanParameter($request->query->get('sport'));
        $category = $this->cleanParameter($request->query->get('categorie'));

        if (null !== $universe && !in_array($universe, ['homme', 'femme', 'enfant'], true)) {
            return $this->json(['message' => 'Univers inconnu.'], JsonResponse::HTTP_BAD_REQUEST);
        }

        return $this->json([
            'categories' => array_map(
                static fn (array $item): array => [
                    'code' => $item['code'],
                    'name' => $item['name'],
                    'productCount' => (int) $item['productCount'],
                ],
                $categories->findForCatalog($universe),
            ),
            'sizes' => array_map(
                static fn (array $item): array => [
                    'code' => $item['code'],
                    'name' => $item['name'],
                    'productCount' => (int) $item['productCount'],
                ],
                $sizes->findForCatalog($universe, $sport, $category),
            ),
            'colors' => array_map($this->normalizeFilterValue(...), $products->findAvailableColors($universe, $sport, $category)),
            'brands' => array_map($this->normalizeFilterValue(...), $products->findAvailableBrands($universe, $sport, $category)),
            'priceRange' => $products->findPriceRange($universe, $sport, $category),
        ]);
    }

    #[Route('/categories', name: 'api_catalog_categories', methods: ['GET'])]
    public function categories(Request $request, RayonRepository $categories): JsonResponse
    {
        $universe = $this->cleanParameter($request->query->get('univers'));

        if (null !== $universe && !in_array($universe, ['homme', 'femme', 'enfant'], true)) {
            return $this->json(['message' => 'Univers inconnu.'], JsonResponse::HTTP_BAD_REQUEST);
        }

        return $this->json([
            'categories' => array_map(
                static fn (array $category): array => [
                    'code' => $category['code'],
                    'name' => $category['name'],
                    'productCount' => (int) $category['productCount'],
                ],
                $categories->findForCatalog($universe),
            ),
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
        $images = array_values($product->getImages()->map(static fn ($image): ?string => $image->getLibelle())->toArray());
        $image = $images[0] ?? null;
        $sizes = $product->getTailles()->toArray();
        usort($sizes, static fn ($left, $right): int => $left->getPosition() <=> $right->getPosition());

        return [
            'id' => $product->getId(),
            'reference' => $product->getReference(),
            'name' => $product->getDesignation(),
            'description' => $product->getDescription(),
            'brand' => $product->getMarque(),
            'universe' => $product->getUnivers(),
            'color' => $product->getCouleur(),
            'department' => $product->getRayon()?->getLibelle(),
            'category' => [
                'code' => $product->getRayon()?->getCode(),
                'name' => $product->getRayon()?->getLibelle(),
            ],
            'sizes' => array_map(static fn ($size): string => $size->getLibelle(), $sizes),
            'sport' => [
                'code' => $product->getSport()?->getCode(),
                'name' => $product->getSport()?->getLibelle(),
            ],
            'price' => (float) $product->getPrixVente(),
            'previousPrice' => null === $product->getPrixBarre() ? null : (float) $product->getPrixBarre(),
            'rating' => $product->getNote() / 10,
            'reviewCount' => $product->getNombreAvis(),
            'image' => $image,
            'images' => $images,
        ];
    }

    private function cleanParameter(mixed $value): ?string
    {
        if (!is_string($value) || '' === trim($value)) {
            return null;
        }

        return strtolower(trim($value));
    }

    private function cleanPrice(mixed $value): float|false|null
    {
        if (!is_string($value) || '' === trim($value)) {
            return null;
        }

        $price = filter_var(str_replace(',', '.', trim($value)), FILTER_VALIDATE_FLOAT);

        return false === $price || $price < 0 ? false : (float) $price;
    }

    /** @param array{code: string, name: string, productCount: int|string} $item */
    private function normalizeFilterValue(array $item): array
    {
        return [
            'code' => $item['code'],
            'name' => $item['name'],
            'productCount' => (int) $item['productCount'],
        ];
    }
}
