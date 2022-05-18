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

$stmt = $answer->read();
$num = $stmt->rowCount();
$answer_arr = array();

if ($num > 0) {
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        extract($row);

        $answer_item = array(
            "id" => (int)$id,
            "title" => $title,
            "questionId" => (int)$questionId,
            "quizzId" => (int)$quizzId,
            "isValid" => (bool)$isValid
        );

        array_push($answer_arr, $answer_item);
    }
}

http_response_code(200);
echo json_encode($answer_arr);
