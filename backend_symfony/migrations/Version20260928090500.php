<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260928090500 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Align category and size indexes with Doctrine metadata';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE produit_taille RENAME INDEX IDX_E29545A6F347EFB TO IDX_81024002F347EFB');
        $this->addSql('ALTER TABLE produit_taille RENAME INDEX IDX_E29545A6A0E2C321 TO IDX_81024002FF25611A');
        $this->addSql('ALTER TABLE rayon CHANGE position position INT NOT NULL');
        $this->addSql('ALTER TABLE rayon RENAME INDEX UNIQ_4B4DD8B477153098 TO UNIQ_D5E5BC3C77153098');
        $this->addSql('ALTER TABLE taille RENAME INDEX UNIQ_6D43E1B77153098 TO UNIQ_76508B3877153098');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE produit_taille RENAME INDEX IDX_81024002F347EFB TO IDX_E29545A6F347EFB');
        $this->addSql('ALTER TABLE produit_taille RENAME INDEX IDX_81024002FF25611A TO IDX_E29545A6A0E2C321');
        $this->addSql('ALTER TABLE rayon CHANGE position position INT DEFAULT 0 NOT NULL');
        $this->addSql('ALTER TABLE rayon RENAME INDEX UNIQ_D5E5BC3C77153098 TO UNIQ_4B4DD8B477153098');
        $this->addSql('ALTER TABLE taille RENAME INDEX UNIQ_76508B3877153098 TO UNIQ_6D43E1B77153098');
    }
}
