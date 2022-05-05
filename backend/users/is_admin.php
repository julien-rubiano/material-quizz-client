<?php
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
$user->id = isset($_GET['id']) ? $_GET['id'] : die();
$user->isAdmin();

if($user->login!=null){
    // set response code - 200 OK
    http_response_code(200);

    if((int)$user->isAdmin === 1) {
        echo json_encode(true);
    } else {
        echo json_encode(false);
    }
}

else{
    // set response code - 404 Not found
    http_response_code(404);
 
    // tell the user product does not exist
    echo json_encode(array("message" => "User does not exist."));
}
?>