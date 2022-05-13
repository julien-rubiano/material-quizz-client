<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/database.php';
include_once '../objects/user.php';

$database = new Database();
$db = $database->getConnection();

$user = new User($db);

$data = json_decode(file_get_contents("php://input"));

$user->id = $data->id;
$user->lastName = $data->lastName;
$user->firstName = $data->firstName;
$user->login = $data->login;
$user->password = $data->password;
$user->isAdmin = $data->isAdmin === true ? 1 : 0;

$stmt = $user->update();
$num = $stmt->rowCount();

if ($num > 0) {

    $user_item = [];

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        extract($row);

        $user_item = array(
            "id" => (int)$id,
            "firstName" => html_entity_decode($firstName),
            "lastName" => html_entity_decode($lastName),
            "login" => html_entity_decode($login),
            "password" => html_entity_decode($password),
            "isAdmin" => (bool)$isAdmin
        );
    }

    http_response_code(200);
    echo json_encode($user_item);
} else {
    http_response_code(503);
    echo json_encode(array("message" => "Unable to update user."));
}
