<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260928090000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add ordered product categories and normalized product sizes';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE rayon ADD position INT DEFAULT 0 NOT NULL');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_4B4DD8B477153098 ON rayon (code)');
        $this->addSql('CREATE TABLE taille (id INT AUTO_INCREMENT NOT NULL, code VARCHAR(20) NOT NULL, libelle VARCHAR(50) NOT NULL, position INT NOT NULL, UNIQUE INDEX UNIQ_6D43E1B77153098 (code), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE produit_taille (produit_id INT NOT NULL, taille_id INT NOT NULL, INDEX IDX_E29545A6F347EFB (produit_id), INDEX IDX_E29545A6A0E2C321 (taille_id), PRIMARY KEY (produit_id, taille_id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('ALTER TABLE produit_taille ADD CONSTRAINT FK_E29545A6F347EFB FOREIGN KEY (produit_id) REFERENCES produit (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE produit_taille ADD CONSTRAINT FK_E29545A6A0E2C321 FOREIGN KEY (taille_id) REFERENCES taille (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE produit_taille DROP FOREIGN KEY FK_E29545A6F347EFB');
        $this->addSql('ALTER TABLE produit_taille DROP FOREIGN KEY FK_E29545A6A0E2C321');
        $this->addSql('DROP TABLE produit_taille');
        $this->addSql('DROP TABLE taille');
        $this->addSql('DROP INDEX UNIQ_4B4DD8B477153098 ON rayon');
        $this->addSql('ALTER TABLE rayon DROP position');
    }
}
