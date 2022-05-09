<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
include_once '../config/database.php';
include_once '../objects/quizz.php';
 
$database = new Database();
$db = $database->getConnection();
 
$quizz = new Quizz($db);
 
$data = json_decode(file_get_contents("php://input"));

$quizz->id = $data->id;
$quizz->name = $data->name;
$quizz->description = $data->description;
$quizz->isRandomQuestions = $data->isRandomQuestions;
 
if($quizz->update()){
    http_response_code(200);
    echo json_encode(array("message" => "Quizz was updated."));
} else{
    http_response_code(503);
    echo json_encode(array("message" => "Unable to update quizz."));
}
?>