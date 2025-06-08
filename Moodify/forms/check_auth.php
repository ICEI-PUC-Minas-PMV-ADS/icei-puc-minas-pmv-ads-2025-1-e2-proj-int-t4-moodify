<?php
session_start();

// Se o usuário estiver logado e estiver tentando acessar home.html, redireciona para vibe.html
if (isset($_SESSION['user_id']) && !empty($_SESSION['user_id'])) {
    $current_page = basename($_SERVER['PHP_SELF']);
    if ($current_page === 'home.html') {
        header('Location: vibe.html');
        exit;
    }
}

// Resposta JSON para verificação AJAX
if (isset($_GET['api'])) {
    header('Content-Type: application/json');
    echo json_encode(['logged_in' => isset($_SESSION['user_id']) && !empty($_SESSION['user_id'])]);
    exit;
}
?> 