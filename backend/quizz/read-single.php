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
 
// $data = json_decode(file_get_contents("php://input"));
// $quizz->id = $data->id;

$id = $_GET['id'];
$quizz->id = $id;

$stmt = $quizz->readSingle();
$num = $stmt->rowCount();
 
if($num>0){
 
    $quizz_item=[];
 
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        extract($row);
 
        $quizz_item=array(
            "id" => (int)$id,
            "name" => $name,
            "description" => $description,
            "isRandomQuestions" => (int)$isRandomQuestions
        );
    }
 
    http_response_code(200);
    echo json_encode($quizz_item);
} else{
    http_response_code(404);
    echo json_encode(
        array("message" => "No quizz with this ID found.")
    );
}
?>