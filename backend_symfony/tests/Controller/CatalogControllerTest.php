<?php

namespace App\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class CatalogControllerTest extends WebTestCase
{
    public function testCatalogPagesAreAvailable(): void
    {
        $client = static::createClient();

        $client->request('GET', '/sports');
        self::assertResponseIsSuccessful();

        $client->request('GET', '/catalogue?univers=femme');
        self::assertResponseIsSuccessful();
    }

    public function testProductsCanBeFilteredByUniverse(): void
    {
        $client = static::createClient();
        $client->jsonRequest('GET', '/api/catalogue/produits?univers=enfant');

        self::assertResponseIsSuccessful();
        self::assertResponseHeaderSame('content-type', 'application/json');
        self::assertArrayHasKey('products', $client->getResponse()->toArray());
    }

    public function testSportsEndpointReturnsACollection(): void
    {
        $client = static::createClient();
        $client->jsonRequest('GET', '/api/catalogue/sports');

        self::assertResponseIsSuccessful();
        self::assertArrayHasKey('sports', $client->getResponse()->toArray());
    }

    public function testUnknownUniverseIsRejected(): void
    {
        $client = static::createClient();
        $client->jsonRequest('GET', '/api/catalogue/produits?univers=inconnu');

        self::assertResponseStatusCodeSame(400);
    }
}
