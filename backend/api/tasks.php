<?php
header('Content-Type: application/json'); 

$dsn = 'mysql:host=localhost;dbname=todo_app';
$username = 'root';
$password = '';
$options = [];

try {
    $pdo = new PDO($dsn, $username, $password, $options);
} catch (PDOException $e) {
    die('Connection failed: ' . $e->getMessage());
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $stmt = $pdo->query('SELECT * FROM tasks');
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        break;

    case 'POST':
        $task = $_POST['task'];
        $stmt = $pdo->prepare('INSERT INTO tasks (task) VALUES (?)');
        $stmt->execute([$task]);
        echo json_encode(['id' => $pdo->lastInsertId(), 'task' => $task, 'is_completed' => false]);
        break;

    case 'PUT':
        parse_str(file_get_contents("php://input"), $post_vars);
        $id = $post_vars['id'];
        $stmt = $pdo->prepare('UPDATE tasks SET is_completed = NOT is_completed WHERE id = ?');
        $stmt->execute([$id]);
        echo json_encode(['id' => $id]);
        break;

    case 'DELETE':
        parse_str(file_get_contents("php://input"), $post_vars);
        $id = $post_vars['id'];
        $stmt = $pdo->prepare('DELETE FROM tasks WHERE id = ?');
        $stmt->execute([$id]);
        echo json_encode(['id' => $id]);
        break;

    default:
        echo json_encode(['error' => 'Invalid Request Method']);
        break;
}
