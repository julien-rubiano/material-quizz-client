<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/database.php';
include_once '../objects/mission.php';
 
$database = new Database();
$db = $database->getConnection();
 
$mission = new Mission($db);

$stmt = $mission->read();
$num = $stmt->rowCount();
 
if($num>0){
 
    $missions_arr=array();
 
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        extract($row);
 
        $mission_item=array(
            "id" => (int)$id,
            "name" => $name,
            "code" => $code,
            "startDate" => $startDate,
            "technologies" => $technologies
        );
 
        array_push($missions_arr, $mission_item);
    }
 
    http_response_code(200);
    echo json_encode($missions_arr);
} else{
    http_response_code(404);
    echo json_encode(
        array("message" => "No missions found.")
    );
}
