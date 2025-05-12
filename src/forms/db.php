<?php
$host = 'moodify.mysql.database.azure.com';
$db   = 'moodifydb';
$user = 'moodifyadmin';
$pass = '@Rtsa20042001';
$charset = 'utf8mb4';

$options = [
    PDO::MYSQL_ATTR_SSL_CA => 'C:/DigiCertGlobalRootCA.crt.pem',
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
];

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$conn = new PDO($dsn, $user, $pass, $options);
?> 