<?php
session_start();
require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $nome = $_POST['name'];
    $data_nascimento = $_POST['subject']; // campo de data
$email = $_POST['email'];
    $cpf = $_POST['cpf'];
    $telefone = $_POST['telefone'];
    $senha = $_POST['password'];
    $confirma_senha = $_POST['confirm_password'];
    
    // Verifica se as senhas conferem
    if ($senha !== $confirma_senha) {
        echo json_encode(['status' => 'error', 'message' => 'As senhas não conferem']);
        exit;
    }

    try {
        // Verifica se o email já existe
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM usuarios WHERE email = ?");
        $stmt->execute([$email]);
        if ($stmt->fetchColumn() > 0) {
            echo json_encode(['status' => 'error', 'message' => 'Este email já está cadastrado']);
            exit;
        }

        // Hash da senha
        $senha_hash = password_hash($senha, PASSWORD_DEFAULT);
        
        // Insere o novo usuário
        $stmt = $pdo->prepare("INSERT INTO usuarios (nome, data_nascimento, email, cpf, telefone, senha, data_cadastro) VALUES (?, ?, ?, ?, ?, ?, NOW())");
        
        if ($stmt->execute([$nome, $data_nascimento, $email, $cpf, $telefone, $senha_hash])) {
            echo json_encode(['status' => 'success']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Erro ao cadastrar usuário']);
        }
        
    } catch(PDOException $e) {
        // Log do erro (não mostrar em produção)
        error_log("Erro no cadastro: " . $e->getMessage());
        echo json_encode(['status' => 'error', 'message' => 'Erro ao cadastrar usuário']);
    }
}
?>