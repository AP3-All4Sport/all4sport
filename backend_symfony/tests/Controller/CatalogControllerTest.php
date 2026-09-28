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
        self::assertArrayHasKey('products', $this->responseData($client));
    }

    public function testSportsEndpointReturnsACollection(): void
    {
        $client = static::createClient();
        $client->jsonRequest('GET', '/api/catalogue/sports');

        self::assertResponseIsSuccessful();
        self::assertArrayHasKey('sports', $this->responseData($client));
    }

    public function testCategoriesEndpointReturnsDatabaseCategories(): void
    {
        $client = static::createClient();
        $client->jsonRequest('GET', '/api/catalogue/categories?univers=homme');

        self::assertResponseIsSuccessful();
        $data = $this->responseData($client);
        self::assertArrayHasKey('categories', $data);
        self::assertNotEmpty($data['categories']);
        self::assertArrayHasKey('productCount', $data['categories'][0]);
    }

    public function testProductsCanBeFilteredByCategoryAndExposeSizes(): void
    {
        $client = static::createClient();
        $client->jsonRequest('GET', '/api/catalogue/produits?categorie=chaussures');

        self::assertResponseIsSuccessful();
        $products = $this->responseData($client)['products'];
        self::assertNotEmpty($products);
        self::assertSame('chaussures', $products[0]['category']['code']);
        self::assertNotEmpty($products[0]['sizes']);
    }

    public function testFiltersEndpointReturnsSizesAndPriceRange(): void
    {
        $client = static::createClient();
        $client->jsonRequest('GET', '/api/catalogue/filtres?univers=femme&categorie=chaussures');

        self::assertResponseIsSuccessful();
        $data = $this->responseData($client);
        self::assertArrayHasKey('categories', $data);
        self::assertNotEmpty($data['sizes']);
        self::assertNotEmpty($data['colors']);
        self::assertNotEmpty($data['brands']);
        self::assertArrayHasKey('minimumPrice', $data['priceRange']);
        self::assertArrayHasKey('maximumPrice', $data['priceRange']);
    }

    public function testProductsCanBeFilteredByColorAndBrand(): void
    {
        $client = static::createClient();
        $client->jsonRequest('GET', '/api/catalogue/produits?couleur=noir&marque=all4sport');

        self::assertResponseIsSuccessful();
        $products = $this->responseData($client)['products'];
        self::assertNotEmpty($products);
        foreach ($products as $product) {
            self::assertSame('Noir', $product['color']);
            self::assertSame('All4Sport', $product['brand']);
        }
    }

    public function testProductsCanBeFilteredBySizeAndPrice(): void
    {
        $client = static::createClient();
        $client->jsonRequest('GET', '/api/catalogue/produits?taille=39&prix_min=50&prix_max=80');

        self::assertResponseIsSuccessful();
        $products = $this->responseData($client)['products'];
        self::assertNotEmpty($products);
        foreach ($products as $product) {
            self::assertContains('39', $product['sizes']);
            self::assertGreaterThanOrEqual(50, $product['price']);
            self::assertLessThanOrEqual(80, $product['price']);
        }
    }

    public function testUnknownUniverseIsRejected(): void
    {
        $client = static::createClient();
        $client->jsonRequest('GET', '/api/catalogue/produits?univers=inconnu');

        self::assertResponseStatusCodeSame(400);
    }

    /** @return array<string, mixed> */
    private function responseData(object $client): array
    {
        $content = $client->getResponse()->getContent();
        self::assertIsString($content);

        return json_decode($content, true, flags: JSON_THROW_ON_ERROR);
    }
}
