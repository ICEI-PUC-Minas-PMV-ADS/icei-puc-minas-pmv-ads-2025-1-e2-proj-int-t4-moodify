<?php
$host = 'moodify.mysql.database.azure.com';
$dbname = 'moodifydb';
$username = 'moodifyadmin';
$password = '@Rtsa20042001';

try {
    $pdo = new PDO(
        "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
        $username,
        $password,
        array(
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_PERSISTENT => false,
            PDO::MYSQL_ATTR_SSL_CA => __DIR__ . '/DigiCertGlobalRootCA.crt.pem'
        )
    );
} catch(PDOException $e) {
    error_log("Erro de conexão: " . $e->getMessage());
    echo "error";
    exit();
}
?> 