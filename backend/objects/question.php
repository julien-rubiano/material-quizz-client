<?php
class Question
{
    private $conn;
    private $table_name = "questions";

    public $id;
    public $title;
    public $isRandomAnswers;
    public $quizzId;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    function read()
    {
        $query = "SELECT * FROM " . $this->table_name;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    function readSingle()
    {
        // update query
        $query = "SELECT * FROM " . $this->table_name . " WHERE id = ?";

        // prepare query statement
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->id = htmlspecialchars(strip_tags($this->id));

        // bind new values
        $stmt->bindParam(1, $this->id);

        // execute the query
        $stmt->execute();
        return $stmt;
    }

    function readByQuizz()
    {
        // update query
        $query = "SELECT * FROM " . $this->table_name . " WHERE quizzId = :quizzId";

        // prepare query statement
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->quizzId = htmlspecialchars(strip_tags($this->quizzId));

        // bind new values
        $stmt->bindParam(":quizzId", $this->quizzId);

        // execute the query
        $stmt->execute();
        return $stmt;
    }

    function create()
    {
        $query = "INSERT INTO
                    " . $this->table_name . "
                SET
                    title=:title, isRandomAnswers=:isRandomAnswers, quizzId=:quizzId";
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->title = htmlspecialchars(strip_tags($this->title));
        $this->isRandomAnswers = htmlspecialchars(strip_tags($this->isRandomAnswers));
        $this->quizzId = htmlspecialchars(strip_tags($this->quizzId));

        // bind values
        $stmt->bindParam(":title", $this->title);
        $stmt->bindParam(":isRandomAnswers", $this->isRandomAnswers);
        $stmt->bindParam(":quizzId", $this->quizzId);

        // execute the query
        if ($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return $this->readSingle();
        }

        return null;
    }

    function update()
    {
        // update query
        $query = "UPDATE
                    " . $this->table_name . "
                SET
                    title=:title,
                    isRandomAnswers=:isRandomAnswers,
                    quizzId=:quizzId
                WHERE
                    id = :id";

        // prepare query statement
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->id = htmlspecialchars(strip_tags($this->id));
        $this->title = htmlspecialchars(strip_tags($this->title));
        $this->isRandomAnswers = htmlspecialchars(strip_tags($this->isRandomAnswers));
        $this->quizzId = htmlspecialchars(strip_tags($this->quizzId));


        // bind new values
        $stmt->bindParam(':id', $this->id);
        $stmt->bindParam(':title', $this->title);
        $stmt->bindParam(':isRandomAnswers', $this->isRandomAnswers);
        $stmt->bindParam(':quizzId', $this->quizzId);

        // execute the query
        if ($stmt->execute()) {
            return $this->readSingle();
        }

        return null;
    }

    function delete()
    {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";

        $stmt = $this->conn->prepare($query);

        $this->id = htmlspecialchars(strip_tags($this->id));

        $stmt->bindParam(1, $this->id);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }
}
