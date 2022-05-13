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

// get posted data
$data = json_decode(file_get_contents("php://input"));

// make sure data is not empty
if (
    !empty($data->title)
) {
    $quizz->title = $data->title;
    $quizz->description = $data->description;
    $quizz->isRandomQuestions = $data->isRandomQuestions === true ? 1 : 0;
    $quizz->duration = $data->duration;

    $stmt = $quizz->create();
    $num = $stmt->rowCount();

    if ($num > 0) {
        $quizz_item = [];

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            extract($row);

            $quizz_item = array(
                "id" => (int)$id,
                "title" => $title,
                "description" => $description,
                "isRandomQuestions" => (bool)$isRandomQuestions,
                "duration" => (int)$duration
            );
        }

        http_response_code(200);
        echo json_encode($quizz_item);
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Unable to create quizz."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Unable to create quizz. Data is incomplete."));
}
