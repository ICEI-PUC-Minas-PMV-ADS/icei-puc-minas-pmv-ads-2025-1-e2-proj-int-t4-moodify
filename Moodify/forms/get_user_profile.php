<?php
session_start();
require_once 'db.php';

// Adiciona headers para CORS e JSON
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Debug: Log de todas as variáveis de sessão
error_log("DEBUG: Dados da sessão: " . json_encode($_SESSION));

// Verifica se o usuário está logado
if (!isset($_SESSION['user_id'])) {
    error_log("DEBUG: Usuário não logado - sessão não contém user_id");
    echo json_encode(['status' => 'error', 'message' => 'Usuário não logado', 'debug' => 'Session: ' . json_encode($_SESSION)]);
    exit;
}

try {
    $user_id = $_SESSION['user_id'];
    
    // Debug: Log do user_id
    error_log("DEBUG: Buscando dados do usuário ID: " . $user_id);
    
    // Teste a conexão com o banco
    if (!$pdo) {
        error_log("DEBUG: Erro na conexão PDO");
        echo json_encode(['status' => 'error', 'message' => 'Erro na conexão com banco de dados']);
        exit;
    }
    
    // Busca os dados do usuário
    $stmt = $pdo->prepare("SELECT nome, email, cpf, telefone, data_nascimento, data_cadastro FROM usuarios WHERE id = ?");
    $stmt->execute([$user_id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // Debug: Log dos dados encontrados
    error_log("DEBUG: Dados encontrados: " . json_encode($user));
    
    if ($user) {
        $response = [
            'status' => 'success',
            'data' => [
                'name' => $user['nome'],
                'email' => $user['email'],
                'cpf' => $user['cpf'],
                'phone' => $user['telefone'],
                'birth_date' => $user['data_nascimento'],
                'register_date' => $user['data_cadastro']
            ],
            'debug' => [
                'user_id' => $user_id,
                'raw_data' => $user
            ]
        ];
        
        error_log("DEBUG: Resposta enviada: " . json_encode($response));
        echo json_encode($response);
    } else {
        error_log("DEBUG: Nenhum usuário encontrado com ID: " . $user_id);
        echo json_encode([
            'status' => 'error', 
            'message' => 'Usuário não encontrado',
            'debug' => [
                'user_id' => $user_id,
                'query_executed' => 'SELECT nome, email, cpf, telefone, data_nascimento, data_cadastro FROM usuarios WHERE id = ' . $user_id
            ]
        ]);
    }
    
} catch(PDOException $e) {
    error_log("Erro ao carregar perfil: " . $e->getMessage());
    echo json_encode([
        'status' => 'error', 
        'message' => 'Erro ao carregar dados do perfil',
        'debug' => [
            'pdo_error' => $e->getMessage(),
            'user_id' => isset($user_id) ? $user_id : 'não definido'
        ]
    ]);
}
?> 