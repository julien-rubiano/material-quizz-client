<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/database.php';
include_once '../objects/question.php';

$database = new Database();
$db = $database->getConnection();

$question = new Question($db);

// get posted data
$data = json_decode(file_get_contents("php://input"));

// make sure data is not empty
if (
    !empty($data->title) &&
    !empty($data->quizzId)
) {
    $question->title = $data->title;
    $question->quizzId = $data->quizzId;
    $question->isRandomAnswers = $data->isRandomAnswers === true ? 1 : 0;

    $stmt = $question->create();
    $num = $stmt->rowCount();

    if ($num > 0) {
        $question_item = [];

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            extract($row);

            $question_item = array(
                "id" => (int)$id,
                "title" => $title,
                "quizzId" => (int)$quizzId,
                "isRandomAnswers" => (bool)$isRandomAnswers
            );
        }

        http_response_code(200);
        echo json_encode($question_item);
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Unable to create question."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Unable to create question. Data is incomplete."));
}
