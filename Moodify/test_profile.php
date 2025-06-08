<?php
require_once 'forms/db.php';

echo "<h2>🔍 TESTE DE ESTRUTURA DA TABELA E DADOS</h2>";

try {
    // 1. Verificar estrutura da tabela
    echo "<h3>📋 Estrutura da tabela 'usuarios':</h3>";
    $stmt = $pdo->query("DESCRIBE usuarios");
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo "<pre>";
    foreach ($columns as $column) {
        echo $column['Field'] . " - " . $column['Type'] . "\n";
    }
    echo "</pre>";
    
    // 2. Verificar todos os usuários
    echo "<h3>👥 Todos os usuários cadastrados:</h3>";
    $stmt = $pdo->query("SELECT * FROM usuarios");
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo "<pre>";
    print_r($users);
    echo "</pre>";
    
    // 3. Verificar se as colunas cpf e telefone existem
    $hasColumns = [];
    foreach ($columns as $column) {
        $hasColumns[] = $column['Field'];
    }
    
    echo "<h3>✅ Verificação de colunas necessárias:</h3>";
    echo "CPF: " . (in_array('cpf', $hasColumns) ? "✅ Existe" : "❌ Não existe") . "<br>";
    echo "Telefone: " . (in_array('telefone', $hasColumns) ? "✅ Existe" : "❌ Não existe") . "<br>";
    
} catch(PDOException $e) {
    echo "<h3>❌ Erro:</h3>";
    echo $e->getMessage();
}
?> 