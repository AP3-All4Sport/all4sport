<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260928071217 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add sports and catalog metadata to products';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE sport (id INT AUTO_INCREMENT NOT NULL, code VARCHAR(50) NOT NULL, libelle VARCHAR(100) NOT NULL, image VARCHAR(255) NOT NULL, position INT NOT NULL, UNIQUE INDEX UNIQ_1A85EFD277153098 (code), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql("INSERT INTO sport (code, libelle, image, position) VALUES ('football', 'Football', '/uploads/catalogue/sport-football.png', 0)");
        $this->addSql("ALTER TABLE produit ADD marque VARCHAR(100) DEFAULT 'All4Sport' NOT NULL, ADD univers VARCHAR(20) DEFAULT 'homme' NOT NULL, ADD prix_barre NUMERIC(10, 2) DEFAULT NULL, ADD note INT DEFAULT 0 NOT NULL, ADD nombre_avis INT DEFAULT 0 NOT NULL, ADD sport_id INT DEFAULT NULL");
        $this->addSql("UPDATE produit SET sport_id = (SELECT id FROM sport WHERE code = 'football')");
        $this->addSql('ALTER TABLE produit MODIFY sport_id INT NOT NULL');
        $this->addSql('ALTER TABLE produit ADD CONSTRAINT FK_29A5EC27AC78BCF8 FOREIGN KEY (sport_id) REFERENCES sport (id)');
        $this->addSql('CREATE INDEX IDX_29A5EC27AC78BCF8 ON produit (sport_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE produit DROP FOREIGN KEY FK_29A5EC27AC78BCF8');
        $this->addSql('DROP INDEX IDX_29A5EC27AC78BCF8 ON produit');
        $this->addSql('ALTER TABLE produit DROP marque, DROP univers, DROP prix_barre, DROP note, DROP nombre_avis, DROP sport_id');
        $this->addSql('DROP TABLE sport');
    }
}
