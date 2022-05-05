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
    !empty($data->login) &&
    !empty($data->password)
){
    $user->login = $data->login;
    $user->password = $data->password;
    $user->login();
 
    if($user->login!=null){
        $user_item = array(
            "id" =>  $user->id,
            "firstName" => $user->firstName,
            "lastName" => $user->lastName,
            "hasCompletedTutorial" => $user->hasCompletedTutorial
        );
     
        // set response code - 200 OK
        http_response_code(200);
     
        // make it json format
        echo json_encode($user_item);
    }
     
    else{
        http_response_code(401);
     
        // tell the user product does not exist
        echo json_encode(array("message" => "La connexion a échoué."));
    }
} else{
    http_response_code(400);
    echo json_encode(array("message" => "Unable to login. Data is incomplete."));
}
?>