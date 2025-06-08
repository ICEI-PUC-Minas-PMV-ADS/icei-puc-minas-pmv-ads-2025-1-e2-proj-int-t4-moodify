<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Configurações do Spotify
$client_id = 'fd5faf9f3fdd4c4d95aaf3fc9c35ae3c'; // Mesmo Client ID do JS
$client_secret = '24ddb2c1bf194158b244f2dc4482b8c8'; // Você precisa pegar isso no Spotify Dashboard
$redirect_uri = 'https://moodify-acf8fzcfdffxece2.brazilsouth-01.azurewebsites.net/callback.html';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método não permitido']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$code = $input['code'] ?? null;

if (!$code) {
    http_response_code(400);
    echo json_encode(['error' => 'Código de autorização não fornecido']);
    exit;
}

// Troca o código por um token de acesso
$token_url = 'https://accounts.spotify.com/api/token';

$post_data = [
    'grant_type' => 'authorization_code',
    'code' => $code,
    'redirect_uri' => $redirect_uri,
    'client_id' => $client_id,
    'client_secret' => $client_secret
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $token_url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($post_data));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/x-www-form-urlencoded'
]);

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($response === false || $http_code !== 200) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro ao trocar código por token']);
    exit;
}

$token_data = json_decode($response, true);

if (isset($token_data['access_token'])) {
    echo json_encode([
        'access_token' => $token_data['access_token'],
        'expires_in' => $token_data['expires_in'] ?? 3600
    ]);
} else {
    http_response_code(400);
    echo json_encode(['error' => $token_data['error_description'] ?? 'Erro desconhecido']);
}
?> 