<?php
session_start();

// Verifica se o usuário está logado
function isLoggedIn() {
    return isset($_SESSION['user_id']) && !empty($_SESSION['user_id']);
}

// Se for uma chamada AJAX ou requisição direta para API, retorna o status em JSON
if(isset($_SERVER['HTTP_X_REQUESTED_WITH']) && $_SERVER['HTTP_X_REQUESTED_WITH'] === 'XMLHttpRequest' || 
   isset($_GET['api']) || 
   strpos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false) {
    header('Content-Type: application/json');
    echo json_encode(['logged_in' => isLoggedIn()]);
    exit;
}

// Se não estiver logado e não for a página de login ou cadastro, redireciona
if(!isLoggedIn()) {
    $current_page = basename($_SERVER['PHP_SELF']);
    $allowed_pages = ['login.html', 'cadastro.html', 'home.html', 'index.html'];
    
    if(!in_array($current_page, $allowed_pages)) {
        header('Location: login.html');
        exit;
    }
}
?>
