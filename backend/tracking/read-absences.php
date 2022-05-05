<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/database.php';
include_once '../objects/tracking.php';
 
$database = new Database();
$db = $database->getConnection();
 
$tracking = new Tracking($db);

$stmt = $tracking->read_absences();
$num = $stmt->rowCount();
 
if($num>0){
 
    $tracking_arr=array();
 
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        extract($row);
 
        $tracking_item=array(
            "userId" => $userId,
            "userName" => $userName,
            "date" => $date
        );
 
        array_push($tracking_arr, $tracking_item);
    }
 
    http_response_code(200);
    echo json_encode($tracking_arr);
} else{
    http_response_code(404);
    echo json_encode(
        array("message" => "No tracking found.")
    );
}
