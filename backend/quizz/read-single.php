<?php
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

$id = $_GET['id'];
$quizz->id = $id;

$stmt = $quizz->readSingle();
$num = $stmt->rowCount();
$quizz_item = array();

if ($num > 0) {
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
}

http_response_code(200);
echo json_encode($quizz_item);
