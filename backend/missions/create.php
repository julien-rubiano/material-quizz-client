<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
include_once '../config/database.php';
include_once '../objects/mission.php';
 
$database = new Database();
$db = $database->getConnection();
 
$mission = new Mission($db);
 
// get posted data
$data = json_decode(file_get_contents("php://input"));
 
// make sure data is not empty
if(
    !empty($data->name) &&
    !empty($data->code)
){
    $mission->name = $data->name;
    $mission->code = $data->code;
    $mission->startDate = $data->startDate;
    $mission->technologies = $data->technologies;
 
    if($mission->create()){
        http_response_code(201);
        echo json_encode(array("message" => "Mission was created."));
    } else{
        http_response_code(503);
        echo json_encode(array("message" => "Unable to create mission."));
    }
} else{
    http_response_code(400);
    echo json_encode(array("message" => "Unable to create mission. Data is incomplete."));
}
?>