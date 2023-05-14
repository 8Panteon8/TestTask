<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);



header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');


$servername = "localhost";
$username = "root";
$password = "root";
$dbname = "info";

$conn = new mysqli($servername, $username, $password, $dbname);

include "function.php";

if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

$method = $_SERVER['REQUEST_METHOD'];

$p = $_GET['p'] ;
$params = explode('/', $p);

$type = $params[0] ;
if(isset($params[2])){
  $id = $params[1];
  $id2 = $params[2];
} elseif(isset($params[1])){
  $id = $params[1];
}


switch ($method) {
  case 'POST':
    switch ($type) {
      case 'client':
        addClient($conn, $_POST);
        break;
      case 'employee':
        addEmployee($conn, $_POST);
        break;
      case 'contract':
        addContract($conn, $_POST);
        break;
    }
    break;
  case 'GET':
    switch ($type) {
      case 'client':
        if (isset($id2)) {
          getSortClient ($conn, $id, $id2);
        } elseif(isset($id)) {
          getClient($conn, $id);
        } else {
          getClients($conn);
        }
    }
    break;
  case 'DELETE':
    switch ($type) {
      case 'client':
        if(isset($id)){
          deletePost($conn,$id);
        }
        break;
      case 'contract':
        if(isset($id)){
          deleteContract($conn,$id);
        }
        break;
    }
    break;
  case 'PUT':
    switch ($type) {
      case 'client':
        if(isset($id)){
          parse_str(file_get_contents('php://input'), $data);
          $id = isset($data['id']) ? $data['id'] : null;
          $name = isset($data['name']) ? $data['name'] : null;
          $inn = isset($data['inn']) ? $data['inn'] : null;
          $phone = isset($data['phone']) ? $data['phone'] : null;

          if ($id && $name && $inn && $phone) {
            updatePost($conn, $id, $name, $inn, $phone);
          } else {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid data']);
          }
      }

    }
    break;
}


$conn->close();
?>



