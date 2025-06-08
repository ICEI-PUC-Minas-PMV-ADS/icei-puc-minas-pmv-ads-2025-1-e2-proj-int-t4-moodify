<?php
session_start();
require_once 'db.php';

// Configura o header para JSON
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $email = $_POST['email'];
    $senha = $_POST['password'];

    try {
        // Busca o usuário pelo email
        $stmt = $pdo->prepare("SELECT * FROM usuarios WHERE email = ?");
        $stmt->execute([$email]);
        $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($usuario && password_verify($senha, $usuario['senha'])) {
            // Login bem-sucedido
            $_SESSION['user_id'] = $usuario['id'];
            $_SESSION['user_name'] = $usuario['nome'];
            echo json_encode(['status' => 'success']);
        } else {
            // Login falhou
            echo json_encode(['status' => 'error', 'message' => 'Email ou senha incorretos']);
        }
    } catch(PDOException $e) {
        error_log("Erro no login: " . $e->getMessage());
        echo json_encode(['status' => 'error', 'message' => 'Erro ao fazer login']);
    }
}
?> 