<?php

namespace App\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class SecurityControllerTest extends WebTestCase
{
    public function testUserCanLogInWithEmailAndPassword(): void
    {
        $client = static::createClient();
        $crawler = $client->request('GET', '/login');

        self::assertResponseIsSuccessful();

        $client->submit($crawler->selectButton('Sign in')->form([
            '_username' => 'test@example.com',
            '_password' => 'password',
        ]));

        self::assertResponseRedirects('/');

        $client->request('GET', '/login');
        self::assertResponseIsSuccessful();
        self::assertSelectorTextContains('body', 'You are logged in as test@example.com');
    }
}
