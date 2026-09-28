<?php

namespace App\Repository;

use App\Entity\Produit;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Produit>
 */
class ProduitRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Produit::class);
    }

    /** @return Produit[] */
    public function findForCatalog(
        ?string $univers,
        ?string $sport,
        ?string $category,
        ?string $size,
        ?string $color,
        ?string $brand,
        ?float $minimumPrice,
        ?float $maximumPrice,
        ?string $query,
    ): array
    {
        $builder = $this->createQueryBuilder('produit')
            ->addSelect('rayon', 'sport', 'images', 'tailles')
            ->join('produit.rayon', 'rayon')
            ->join('produit.sport', 'sport')
            ->leftJoin('produit.images', 'images')
            ->leftJoin('produit.tailles', 'tailles')
            ->orderBy('produit.id', 'ASC');

        if (null !== $univers) {
            $builder->andWhere('produit.univers = :univers')->setParameter('univers', $univers);
        }

        if (null !== $sport) {
            $builder->andWhere('sport.code = :sport')->setParameter('sport', $sport);
        }

        if (null !== $category) {
            $builder->andWhere('rayon.code = :category')->setParameter('category', $category);
        }

        if (null !== $size) {
            $builder->andWhere('tailles.code = :size')->setParameter('size', $size);
        }

        if (null !== $color) {
            $builder->andWhere('LOWER(produit.couleur) = :color')->setParameter('color', $color);
        }

        if (null !== $brand) {
            $builder->andWhere('LOWER(produit.marque) = :brand')->setParameter('brand', $brand);
        }

        if (null !== $minimumPrice) {
            $builder->andWhere('produit.prixVente >= :minimumPrice')->setParameter('minimumPrice', $minimumPrice);
        }

        if (null !== $maximumPrice) {
            $builder->andWhere('produit.prixVente <= :maximumPrice')->setParameter('maximumPrice', $maximumPrice);
        }

        if (null !== $query) {
            $builder
                ->andWhere('LOWER(produit.designation) LIKE :query OR LOWER(produit.marque) LIKE :query OR LOWER(sport.libelle) LIKE :query OR LOWER(rayon.libelle) LIKE :query')
                ->setParameter('query', '%'.strtolower($query).'%');
        }

        return $builder->getQuery()->getResult();
    }

    /** @return array{minimumPrice: float, maximumPrice: float} */
    public function findPriceRange(?string $universe, ?string $sport, ?string $category): array
    {
        $builder = $this->createQueryBuilder('produit')
            ->select('MIN(produit.prixVente) AS minimumPrice', 'MAX(produit.prixVente) AS maximumPrice')
            ->join('produit.rayon', 'rayon')
            ->join('produit.sport', 'sport');

        if (null !== $universe) {
            $builder->andWhere('produit.univers = :universe')->setParameter('universe', $universe);
        }
        if (null !== $sport) {
            $builder->andWhere('sport.code = :sport')->setParameter('sport', $sport);
        }
        if (null !== $category) {
            $builder->andWhere('rayon.code = :category')->setParameter('category', $category);
        }

        $range = $builder->getQuery()->getSingleResult();

        return [
            'minimumPrice' => (float) ($range['minimumPrice'] ?? 0),
            'maximumPrice' => (float) ($range['maximumPrice'] ?? 0),
        ];
    }

    /** @return list<array{code: string, name: string, productCount: int|string}> */
    public function findAvailableColors(?string $universe, ?string $sport, ?string $category): array
    {
        return $this->findAvailableValues('couleur', $universe, $sport, $category);
    }

    /** @return list<array{code: string, name: string, productCount: int|string}> */
    public function findAvailableBrands(?string $universe, ?string $sport, ?string $category): array
    {
        return $this->findAvailableValues('marque', $universe, $sport, $category);
    }

    /** @return list<array{code: string, name: string, productCount: int|string}> */
    private function findAvailableValues(string $field, ?string $universe, ?string $sport, ?string $category): array
    {
        $builder = $this->createQueryBuilder('produit')
            ->select(sprintf('LOWER(produit.%s) AS code', $field), sprintf('produit.%s AS name', $field), 'COUNT(produit.id) AS productCount')
            ->join('produit.rayon', 'rayon')
            ->join('produit.sport', 'sport')
            ->groupBy(sprintf('produit.%s', $field))
            ->orderBy(sprintf('produit.%s', $field), 'ASC');

        if (null !== $universe) {
            $builder->andWhere('produit.univers = :universe')->setParameter('universe', $universe);
        }
        if (null !== $sport) {
            $builder->andWhere('sport.code = :sport')->setParameter('sport', $sport);
        }
        if (null !== $category) {
            $builder->andWhere('rayon.code = :category')->setParameter('category', $category);
        }

        return $builder->getQuery()->getArrayResult();
    }

//    /**
//     * @return Produit[] Returns an array of Produit objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('p')
//            ->andWhere('p.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('p.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?Produit
//    {
//        return $this->createQueryBuilder('p')
//            ->andWhere('p.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
