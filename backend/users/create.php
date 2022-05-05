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
if(
    !empty($data->firstName) &&
    !empty($data->lastName) &&
    !empty($data->login) &&
    !empty($data->password) &&
    !empty($data->cost)
){
    $user->firstName = $data->firstName;
    $user->lastName = $data->lastName;
    $user->login = $data->login;
    $user->password = $data->password;
    $user->cost = $data->cost;
    $user->isAdmin = $data->isAdmin === true ? 1 : 0;
 
    if($user->create()){
        http_response_code(201);
        echo json_encode(array("message" => "User was created."));
    } else{
        http_response_code(503);
        echo json_encode(array("message" => "Unable to create user."));
    }
} else{
    http_response_code(400);
    echo json_encode(array("message" => "Unable to create user. Data is incomplete."));
}
?>