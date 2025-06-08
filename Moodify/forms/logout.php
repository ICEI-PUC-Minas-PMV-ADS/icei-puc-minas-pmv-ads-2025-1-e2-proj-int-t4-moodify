<?php
session_start();

try {
    // Destroi todas as variáveis de sessão
    $_SESSION = array();
    
    // Destroi a sessão
    session_destroy();
    
    echo json_encode(['status' => 'success', 'message' => 'Logout realizado com sucesso']);
    
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => 'Erro ao fazer logout']);
}
?>
