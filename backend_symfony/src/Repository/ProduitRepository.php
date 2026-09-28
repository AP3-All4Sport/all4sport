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
    public function findForCatalog(?string $univers, ?string $sport, ?string $query): array
    {
        $builder = $this->createQueryBuilder('produit')
            ->addSelect('rayon', 'sport', 'images')
            ->join('produit.rayon', 'rayon')
            ->join('produit.sport', 'sport')
            ->leftJoin('produit.images', 'images')
            ->orderBy('produit.id', 'ASC');

        if (null !== $univers) {
            $builder->andWhere('produit.univers = :univers')->setParameter('univers', $univers);
        }

        if (null !== $sport) {
            $builder->andWhere('sport.code = :sport')->setParameter('sport', $sport);
        }

        if (null !== $query) {
            $builder
                ->andWhere('LOWER(produit.designation) LIKE :query OR LOWER(produit.marque) LIKE :query OR LOWER(sport.libelle) LIKE :query')
                ->setParameter('query', '%'.strtolower($query).'%');
        }

        return $builder->getQuery()->getResult();
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
