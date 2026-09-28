<?php

namespace App\Repository;

use App\Entity\Rayon;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\Query\Expr\Join;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Rayon>
 */
class RayonRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Rayon::class);
    }

    /** @return list<array{code: string, name: string, productCount: int|string}> */
    public function findForCatalog(?string $universe): array
    {
        $builder = $this->createQueryBuilder('rayon')
            ->select('rayon.code AS code', 'rayon.libelle AS name', 'COUNT(produit.id) AS productCount')
            ->andWhere('rayon.position > 0')
            ->groupBy('rayon.id')
            ->orderBy('rayon.position', 'ASC')
            ->addOrderBy('rayon.libelle', 'ASC');

        if (null === $universe) {
            $builder->leftJoin('rayon.produits', 'produit');
        } else {
            $builder
                ->leftJoin('rayon.produits', 'produit', Join::WITH, 'produit.univers = :universe')
                ->setParameter('universe', $universe);
        }

        return $builder->getQuery()->getArrayResult();
    }

//    /**
//     * @return Rayon[] Returns an array of Rayon objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('r')
//            ->andWhere('r.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('r.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?Rayon
//    {
//        return $this->createQueryBuilder('r')
//            ->andWhere('r.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
