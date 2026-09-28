<?php

namespace App\Command;

use App\Entity\Image;
use App\Entity\Produit;
use App\Entity\Rayon;
use App\Entity\Sport;
use App\Repository\ProduitRepository;
use App\Repository\RayonRepository;
use App\Repository\SportRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:seed-catalog',
    description: 'Crée ou met à jour le catalogue de démonstration All4Sport.',
)]
class SeedCatalogCommand extends Command
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly ProduitRepository $products,
        private readonly RayonRepository $departments,
        private readonly SportRepository $sports,
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $sports = $this->seedSports();
        $departments = $this->seedDepartments();
        $created = 0;

        foreach ($this->productData() as $data) {
            $product = $this->products->findOneBy(['reference' => $data['reference']]);
            if (null === $product) {
                $product = new Produit();
                $this->entityManager->persist($product);
                ++$created;
            }

            $product
                ->setReference($data['reference'])
                ->setDesignation($data['name'])
                ->setDescription($data['description'])
                ->setPrixVente($data['price'])
                ->setPrixBarre($data['previousPrice'])
                ->setMarque($data['brand'])
                ->setUnivers($data['universe'])
                ->setNote($data['rating'])
                ->setNombreAvis($data['reviews'])
                ->setRayon($departments[$data['department']])
                ->setSport($sports[$data['sport']]);

            $image = $product->getImages()->first();
            if (false === $image) {
                $image = (new Image())->setProduit($product);
                $this->entityManager->persist($image);
            }
            $image->setLibelle('/uploads/catalogue/'.$data['image']);
        }

        $this->entityManager->flush();
        $io->success(sprintf('Catalogue prêt : %d produit(s) créé(s), %d au total.', $created, $this->products->count([])));

        return Command::SUCCESS;
    }

    /** @return array<string, Sport> */
    private function seedSports(): array
    {
        $result = [];
        $data = [
            ['football', 'Football', 'sport-football.png'],
            ['running', 'Running', 'sport-running.png'],
            ['fitness', 'Fitness', 'sport-fitness.png'],
            ['randonnee', 'Randonnée', 'sport-randonnee.png'],
            ['basketball', 'Basketball', 'sport-basketball.png'],
            ['tennis', 'Tennis', 'sport-tennis.png'],
            ['natation', 'Natation', 'sport-natation.png'],
            ['cyclisme', 'Cyclisme', 'sport-cyclisme.png'],
        ];

        foreach ($data as $position => [$code, $label, $image]) {
            $sport = $this->sports->findOneBy(['code' => $code]) ?? new Sport();
            $sport->setCode($code)->setLibelle($label)->setImage('/uploads/catalogue/'.$image)->setPosition($position);
            $this->entityManager->persist($sport);
            $result[$code] = $sport;
        }

        return $result;
    }

    /** @return array<string, Rayon> */
    private function seedDepartments(): array
    {
        $result = [];
        foreach ([
            'chaussures' => 'Chaussures',
            'vetements' => 'Vêtements',
            'accessoires' => 'Accessoires',
        ] as $code => $label) {
            $department = $this->departments->findOneBy(['code' => $code]) ?? new Rayon();
            $department->setCode($code)->setLibelle($label);
            $this->entityManager->persist($department);
            $result[$code] = $department;
        }

        return $result;
    }

    /** @return list<array<string, int|string|null>> */
    private function productData(): array
    {
        return [
            ['reference' => 'HOM-FOOT-001', 'name' => 'Chaussures de football adulte Noir/Rouge', 'description' => 'Crampons polyvalents pour terrain sec.', 'price' => '49.99', 'previousPrice' => '69.99', 'brand' => 'All4Sport', 'universe' => 'homme', 'rating' => 46, 'reviews' => 128, 'department' => 'chaussures', 'sport' => 'football', 'image' => 'homme-crampon-noir.jpg'],
            ['reference' => 'HOM-FOOT-002', 'name' => 'Chaussures de football adulte Jaune/Bleu', 'description' => 'Chaussures légères pensées pour accélérer.', 'price' => '59.99', 'previousPrice' => '89.99', 'brand' => 'All4Sport', 'universe' => 'homme', 'rating' => 47, 'reviews' => 84, 'department' => 'chaussures', 'sport' => 'football', 'image' => 'homme-crampon-jaune.jpg'],
            ['reference' => 'FEM-RUN-001', 'name' => 'Chaussures de running femme Corail/Blanc', 'description' => 'Amorti souple pour les sorties quotidiennes.', 'price' => '69.99', 'previousPrice' => '89.99', 'brand' => 'Kiprun', 'universe' => 'femme', 'rating' => 48, 'reviews' => 216, 'department' => 'chaussures', 'sport' => 'running', 'image' => 'femme-running.png'],
            ['reference' => 'FEM-RUN-002', 'name' => 'Legging de running femme Noir', 'description' => 'Legging respirant taille haute avec maintien.', 'price' => '29.99', 'previousPrice' => null, 'brand' => 'Domyos', 'universe' => 'femme', 'rating' => 46, 'reviews' => 97, 'department' => 'vetements', 'sport' => 'running', 'image' => 'femme-legging.png'],
            ['reference' => 'FEM-HIK-001', 'name' => 'Sweat zippé de randonnée femme Lavande', 'description' => 'Couche intermédiaire douce et chaude.', 'price' => '44.99', 'previousPrice' => '54.99', 'brand' => 'Quechua', 'universe' => 'femme', 'rating' => 45, 'reviews' => 63, 'department' => 'vetements', 'sport' => 'randonnee', 'image' => 'femme-hoodie.png'],
            ['reference' => 'FEM-FIT-001', 'name' => 'Brassière de fitness femme Bleu canard', 'description' => 'Maintien intermédiaire et matière extensible.', 'price' => '24.99', 'previousPrice' => null, 'brand' => 'Domyos', 'universe' => 'femme', 'rating' => 47, 'reviews' => 151, 'department' => 'vetements', 'sport' => 'fitness', 'image' => 'femme-brassiere.png'],
            ['reference' => 'FEM-RUN-003', 'name' => 'Chaussures de running femme Confort 500', 'description' => 'Une foulée confortable sur route et chemin.', 'price' => '54.99', 'previousPrice' => '64.99', 'brand' => 'Kiprun', 'universe' => 'femme', 'rating' => 45, 'reviews' => 82, 'department' => 'chaussures', 'sport' => 'running', 'image' => 'femme-running.png'],
            ['reference' => 'FEM-FIT-002', 'name' => 'Legging de fitness femme Taille haute', 'description' => 'Matière opaque et extensible pour vos séances.', 'price' => '34.99', 'previousPrice' => null, 'brand' => 'Domyos', 'universe' => 'femme', 'rating' => 48, 'reviews' => 204, 'department' => 'vetements', 'sport' => 'fitness', 'image' => 'femme-legging.png'],
            ['reference' => 'FEM-HIK-002', 'name' => 'Veste polaire de randonnée femme Lavande', 'description' => 'Chaleur légère pour marcher par temps frais.', 'price' => '39.99', 'previousPrice' => '49.99', 'brand' => 'Quechua', 'universe' => 'femme', 'rating' => 46, 'reviews' => 119, 'department' => 'vetements', 'sport' => 'randonnee', 'image' => 'femme-hoodie.png'],
            ['reference' => 'FEM-FIT-003', 'name' => 'Brassière de fitness femme Maintien 500', 'description' => 'Maintien confortable pour les entraînements réguliers.', 'price' => '29.99', 'previousPrice' => null, 'brand' => 'Domyos', 'universe' => 'femme', 'rating' => 44, 'reviews' => 76, 'department' => 'vetements', 'sport' => 'fitness', 'image' => 'femme-brassiere.png'],
            ['reference' => 'FEM-RUN-004', 'name' => 'Chaussures de running femme Légères', 'description' => 'Dynamisme et respirabilité pour courir au quotidien.', 'price' => '79.99', 'previousPrice' => '99.99', 'brand' => 'Kiprun', 'universe' => 'femme', 'rating' => 49, 'reviews' => 167, 'department' => 'chaussures', 'sport' => 'running', 'image' => 'femme-running.png'],
            ['reference' => 'FEM-FIT-004', 'name' => 'Legging de fitness femme Sans coutures', 'description' => 'Coupe près du corps et liberté de mouvement.', 'price' => '27.99', 'previousPrice' => null, 'brand' => 'Domyos', 'universe' => 'femme', 'rating' => 46, 'reviews' => 134, 'department' => 'vetements', 'sport' => 'fitness', 'image' => 'femme-legging.png'],
            ['reference' => 'FEM-HIK-003', 'name' => 'Sweat de randonnée femme Doux', 'description' => 'Un sweat polyvalent à porter avant et après la marche.', 'price' => '49.99', 'previousPrice' => null, 'brand' => 'Quechua', 'universe' => 'femme', 'rating' => 47, 'reviews' => 58, 'department' => 'vetements', 'sport' => 'randonnee', 'image' => 'femme-hoodie.png'],
            ['reference' => 'FEM-FIT-005', 'name' => 'Brassière de sport femme Training', 'description' => 'Dos respirant et maintien intermédiaire.', 'price' => '19.99', 'previousPrice' => '24.99', 'brand' => 'Domyos', 'universe' => 'femme', 'rating' => 45, 'reviews' => 93, 'department' => 'vetements', 'sport' => 'fitness', 'image' => 'femme-brassiere.png'],
            ['reference' => 'ENF-BAS-001', 'name' => 'Chaussures de basketball enfant Bleu', 'description' => 'Maintien montant et semelle adhérente.', 'price' => '39.99', 'previousPrice' => '49.99', 'brand' => 'Tarmak', 'universe' => 'enfant', 'rating' => 48, 'reviews' => 72, 'department' => 'chaussures', 'sport' => 'basketball', 'image' => 'enfant-basket.png'],
            ['reference' => 'ENF-FOO-001', 'name' => 'Maillot de football enfant Orange/Marine', 'description' => 'Maillot léger pour jouer et s’entraîner.', 'price' => '14.99', 'previousPrice' => null, 'brand' => 'Kipsta', 'universe' => 'enfant', 'rating' => 45, 'reviews' => 54, 'department' => 'vetements', 'sport' => 'football', 'image' => 'enfant-maillot.png'],
            ['reference' => 'ENF-TEN-001', 'name' => 'Short de tennis enfant Noir/Vert', 'description' => 'Short extensible avec poches latérales.', 'price' => '16.99', 'previousPrice' => null, 'brand' => 'Artengo', 'universe' => 'enfant', 'rating' => 44, 'reviews' => 38, 'department' => 'vetements', 'sport' => 'tennis', 'image' => 'enfant-short.png'],
            ['reference' => 'ENF-HIK-001', 'name' => 'Veste de randonnée enfant Bleu', 'description' => 'Veste légère déperlante avec capuche.', 'price' => '34.99', 'previousPrice' => '44.99', 'brand' => 'Quechua', 'universe' => 'enfant', 'rating' => 47, 'reviews' => 91, 'department' => 'vetements', 'sport' => 'randonnee', 'image' => 'enfant-veste.png'],
            ['reference' => 'ENF-SWI-001', 'name' => 'Lunettes de natation enfant Turquoise/Orange', 'description' => 'Réglage simple et joints confortables.', 'price' => '12.99', 'previousPrice' => null, 'brand' => 'Nabaiji', 'universe' => 'enfant', 'rating' => 46, 'reviews' => 143, 'department' => 'accessoires', 'sport' => 'natation', 'image' => 'enfant-lunettes.png'],
            ['reference' => 'ENF-CYC-001', 'name' => 'Casque de vélo enfant Vert menthe', 'description' => 'Casque ventilé réglable pour les jeunes cyclistes.', 'price' => '24.99', 'previousPrice' => '29.99', 'brand' => 'Btwin', 'universe' => 'enfant', 'rating' => 49, 'reviews' => 117, 'department' => 'accessoires', 'sport' => 'cyclisme', 'image' => 'enfant-casque.png'],
            ['reference' => 'ENF-BAS-002', 'name' => 'Chaussures de basketball enfant Maintien 500', 'description' => 'Une chaussure montante confortable pour débuter.', 'price' => '44.99', 'previousPrice' => null, 'brand' => 'Tarmak', 'universe' => 'enfant', 'rating' => 45, 'reviews' => 61, 'department' => 'chaussures', 'sport' => 'basketball', 'image' => 'enfant-basket.png'],
            ['reference' => 'ENF-FOO-002', 'name' => 'Maillot de football enfant Respirant', 'description' => 'Séchage rapide pour les matchs et entraînements.', 'price' => '19.99', 'previousPrice' => '24.99', 'brand' => 'Kipsta', 'universe' => 'enfant', 'rating' => 47, 'reviews' => 88, 'department' => 'vetements', 'sport' => 'football', 'image' => 'enfant-maillot.png'],
            ['reference' => 'ENF-TEN-002', 'name' => 'Short de tennis enfant Confort', 'description' => 'Taille élastique et tissu léger.', 'price' => '12.99', 'previousPrice' => null, 'brand' => 'Artengo', 'universe' => 'enfant', 'rating' => 43, 'reviews' => 47, 'department' => 'vetements', 'sport' => 'tennis', 'image' => 'enfant-short.png'],
            ['reference' => 'ENF-HIK-002', 'name' => 'Veste imperméable de randonnée enfant', 'description' => 'Protection compacte contre la pluie et le vent.', 'price' => '39.99', 'previousPrice' => '49.99', 'brand' => 'Quechua', 'universe' => 'enfant', 'rating' => 48, 'reviews' => 126, 'department' => 'vetements', 'sport' => 'randonnee', 'image' => 'enfant-veste.png'],
            ['reference' => 'ENF-SWI-002', 'name' => 'Lunettes de natation enfant Réglables', 'description' => 'Pont de nez souple et vision panoramique.', 'price' => '9.99', 'previousPrice' => null, 'brand' => 'Nabaiji', 'universe' => 'enfant', 'rating' => 45, 'reviews' => 174, 'department' => 'accessoires', 'sport' => 'natation', 'image' => 'enfant-lunettes.png'],
            ['reference' => 'ENF-CYC-002', 'name' => 'Casque de vélo enfant Protection 500', 'description' => 'Réglage arrière précis et mousse confortable.', 'price' => '29.99', 'previousPrice' => null, 'brand' => 'Btwin', 'universe' => 'enfant', 'rating' => 47, 'reviews' => 102, 'department' => 'accessoires', 'sport' => 'cyclisme', 'image' => 'enfant-casque.png'],
        ];
    }
}
