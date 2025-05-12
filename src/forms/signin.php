<?php
require_once 'db.php';

$name = $_POST['name'];
$email = $_POST['email'];
$password = password_hash($_POST['password'], PASSWORD_DEFAULT);
$birthdate = $_POST['subject'];

$sql = "INSERT INTO usuarios (nome, data_nascimento, email, senha) VALUES (?, ?, ?, ?)";
try {
    $stmt = $conn->prepare($sql);
    $stmt->execute([$name, $birthdate, $email, $password]);
    echo "OK";
} catch (PDOException $e) {
    echo "Erro ao cadastrar: " . $e->getMessage();
}
exit();
?>