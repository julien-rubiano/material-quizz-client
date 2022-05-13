<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/database.php';
include_once '../objects/answer.php';

$database = new Database();
$db = $database->getConnection();

$answer = new Answer($db);

// get posted data
$data = json_decode(file_get_contents("php://input"));

// make sure data is not empty
if (
    !empty($data->position) &&
    !empty($data->questionId) &&
    !empty($data->quizzId)

) {
    $answer->title = $data->title;
    $answer->position = $data->position;
    $answer->questionId = $data->questionId;
    $answer->quizzId = $data->quizzId;

    $stmt = $answer->create();
    $num = $stmt->rowCount();

    if ($num > 0) {
        $answer_item = [];

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            extract($row);

            $answer_item = array(
                "id" => (int)$id,
                "title" => $title,
                "questionId" => (int)$questionId,
                "quizzId" => (int)$quizzId,
                "position" => (int)$position
            );
        }

        http_response_code(200);
        echo json_encode($answer_item);
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Unable to create answer."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Unable to create answer. Data is incomplete."));
}
