<?php
require 'db.php';

$email = $_POST['email'];
$password = $_POST['password'];

$sql = "SELECT * FROM Users WHERE Email = ?";
$stmt = $conn->prepare($sql);
$stmt->execute([$email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user && password_verify($password, $user['Password'])) {
    // Login bem-sucedido
    session_start();
    $_SESSION['user'] = $user;
    header("Location: ../perfil.html");
    exit();
} else {
    // Falha no login
    header("Location: ../login.html?erro=1");
    exit();
}
?> 