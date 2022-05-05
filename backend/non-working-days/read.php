<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/database.php';
include_once '../objects/non-working-day.php';
 
$database = new Database();
$db = $database->getConnection();
 
$day = new NonWorkingDay($db);

$stmt = $day->read();
$num = $stmt->rowCount();
 
if($num>0){
 
    $days_arr=array();
 
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        extract($row);
 
        $day_item=array(
            "id" => $id,
            "date" => $date
        );
 
        array_push($days_arr, $day_item);
    }
 
    http_response_code(200);
    echo json_encode($days_arr);
} else{
    http_response_code(404);
    echo json_encode(
        array("message" => "No days found.")
    );
}
