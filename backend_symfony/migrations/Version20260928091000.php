<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260928091000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add a filterable product color';
    }

    public function up(Schema $schema): void
    {
        $this->addSql("ALTER TABLE produit ADD couleur VARCHAR(30) DEFAULT 'Multicolore' NOT NULL");
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE produit DROP couleur');
    }
}
