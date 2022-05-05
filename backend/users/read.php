<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/database.php';
include_once '../objects/user.php';
 
$database = new Database();
$db = $database->getConnection();
 
$user = new User($db);

$stmt = $user->read();
$num = $stmt->rowCount();
 
if($num>0){
 
    $users_arr=array();
 
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        extract($row);
 
        $user_item=array(
            "id" => (int)$id,
            "firstName" => html_entity_decode($firstName),
            "lastName" => html_entity_decode($lastName),
            "login" => html_entity_decode($login),
            "password" => html_entity_decode($password),
            "cost" => $cost,
            "isAdmin" => (int)$isAdmin
        );
 
        array_push($users_arr, $user_item);
    }
 
    http_response_code(200);
 
    echo json_encode($users_arr);
} else{
    http_response_code(404);
 
    echo json_encode(
        array("message" => "No users found.")
    );
}
