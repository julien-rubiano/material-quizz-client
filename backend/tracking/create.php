<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
include_once '../config/database.php';
include_once '../objects/tracking.php';
 
$database = new Database();
$db = $database->getConnection();
 
$tracking = new Tracking($db);
 
// get posted data
$data = json_decode(file_get_contents("php://input"));
 
// make sure data is not empty
if(!empty($data->userId) && !empty($data->missionId) && !empty($data->date)){
    $tracking->userId = $data->userId;
    $tracking->missionId = $data->missionId;
    $tracking->date = $data->date;

    $lastId = $tracking->create();

    if($lastId>0){

        $tracking_item=array(
            "id" => (int)$lastId,
            "userId" => (int)$data->userId,
            "missionId" => (int)$data->missionId,
            "date" => $data->date
        );

        http_response_code(201);
        echo json_encode($tracking_item);
    }
 
    else{
        http_response_code(503);
        echo json_encode(array("message" => "Unable to create tracking."));
    }
} 

else{
    http_response_code(400);
    echo json_encode(array("message" => "Unable to create tracking. Data is incomplete."));
}
?>