<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
include_once '../config/database.php';
include_once '../objects/answer.php';
 
$database = new Database();
$db = $database->getConnection();
 
$answer = new Answer($db);

$id = $_GET['id'];
$answer->questionId = $id;

$stmt = $answer->readByQuestion();
$num = $stmt->rowCount();
 
if($num>0){
    $answer_arr=array();
 
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        extract($row);
 
        $answer_item=array(
            "id" => (int)$id,
            "title" => $title,
            "questionId" => (int)$questionId,
            "quizzId" => (int)$quizzId,
            "position" => (int)$position
        );
 
        array_push($answer_arr, $answer_item);
    }
 
    http_response_code(200);
    echo json_encode($answer_arr);
} else{
    http_response_code(404);
    echo json_encode(
        array("message" => "No answer with this ID found.")
    );
}
?>