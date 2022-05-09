<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/database.php';
include_once '../objects/quizz.php';
 
$database = new Database();
$db = $database->getConnection();
 
$quizz = new Quizz($db);

$stmt = $quizz->read();
$num = $stmt->rowCount();
 
if($num>0){
 
    $quizz_arr=array();
 
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        extract($row);
 
        $quizz_item=array(
            "id" => (int)$id,
            "name" => $name,
            "description" => $description,
            "isRandomQuestions" => (int)$isRandomQuestions
        );
 
        array_push($quizz_arr, $quizz_item);
    }
 
    http_response_code(200);
    echo json_encode($quizz_arr);
} else{
    http_response_code(404);
    echo json_encode(
        array("message" => "No quizz found.")
    );
}
