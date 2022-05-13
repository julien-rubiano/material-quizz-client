<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/database.php';
include_once '../objects/question.php';

$database = new Database();
$db = $database->getConnection();

$question = new Question($db);

$id = $_GET['id'];
$question->quizzId = $id;

$stmt = $question->readByQuizz();
$num = $stmt->rowCount();
$question_arr = array();

if ($num > 0) {
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        extract($row);

        $question_item = array(
            "id" => (int)$id,
            "title" => $title,
            "quizzId" => (int)$quizzId,
            "isRandomAnswers" => (bool)$isRandomAnswers
        );

        array_push($question_arr, $question_item);
    }
}

http_response_code(200);
echo json_encode($question_arr);
