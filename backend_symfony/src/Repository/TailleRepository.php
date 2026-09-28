<?php

namespace App\Repository;

use App\Entity\Taille;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/** @extends ServiceEntityRepository<Taille> */
class TailleRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Taille::class);
    }

    /** @return list<array{code: string, name: string, productCount: int|string}> */
    public function findForCatalog(?string $universe, ?string $sport, ?string $category): array
    {
        $builder = $this->createQueryBuilder('taille')
            ->select('taille.code AS code', 'taille.libelle AS name', 'COUNT(DISTINCT produit.id) AS productCount')
            ->join('taille.produits', 'produit')
            ->join('produit.rayon', 'rayon')
            ->join('produit.sport', 'sportEntity')
            ->groupBy('taille.id')
            ->orderBy('taille.position', 'ASC');

        if (null !== $universe) {
            $builder->andWhere('produit.univers = :universe')->setParameter('universe', $universe);
        }
        if (null !== $sport) {
            $builder->andWhere('sportEntity.code = :sport')->setParameter('sport', $sport);
        }
        if (null !== $category) {
            $builder->andWhere('rayon.code = :category')->setParameter('category', $category);
        }

        return $builder->getQuery()->getArrayResult();
    }
}
