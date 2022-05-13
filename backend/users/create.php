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

// get posted data
$data = json_decode(file_get_contents("php://input"));

// make sure data is not empty
if (
    !empty($data->firstName) &&
    !empty($data->lastName) &&
    !empty($data->login) &&
    !empty($data->password)
) {
    $user->firstName = $data->firstName;
    $user->lastName = $data->lastName;
    $user->login = $data->login;
    $user->password = $data->password;
    $user->isAdmin = $data->isAdmin === true ? 1 : 0;

    $stmt = $user->create();
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
        echo json_encode(array("message" => "Unable to create user."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Unable to create user. Data is incomplete."));
}
