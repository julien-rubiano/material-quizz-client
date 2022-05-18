<?php
class Answer
{
    private $conn;
    private $table_name = "answers";

    public $id;
    public $title;
    public $questionId;
    public $quizzId;
    public $isValid;

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

    function readByQuestion()
    {
        $query = "SELECT * FROM " . $this->table_name . " WHERE questionId = :questionId";

        // prepare query statement
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->questionId = htmlspecialchars(strip_tags($this->questionId));

        // bind new values
        $stmt->bindParam(":questionId", $this->questionId);

        // execute the query
        $stmt->execute();
        return $stmt;
    }

    function readByQuizz()
    {
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
                    title=:title, questionId=:questionId, quizzId=:quizzId, isValid=:isValid";
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->title = htmlspecialchars(strip_tags($this->title));
        $this->questionId = htmlspecialchars(strip_tags($this->questionId));
        $this->quizzId = htmlspecialchars(strip_tags($this->quizzId));
        $this->isValid = htmlspecialchars(strip_tags($this->isValid));

        // bind values
        $stmt->bindParam(":title", $this->title);
        $stmt->bindParam(":questionId", $this->questionId);
        $stmt->bindParam(":quizzId", $this->quizzId);
        $stmt->bindParam(":isValid", $this->isValid);

        // execute query
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
                    questionId=:questionId,
                    quizzId=:quizzId,
                    isValid=:isValid
                WHERE
                    id = :id";

        // prepare query statement
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->id = htmlspecialchars(strip_tags($this->id));
        $this->title = htmlspecialchars(strip_tags($this->title));
        $this->questionId = htmlspecialchars(strip_tags($this->questionId));
        $this->quizzId = htmlspecialchars(strip_tags($this->quizzId));
        $this->isValid = htmlspecialchars(strip_tags($this->isValid));

        // bind new values
        $stmt->bindParam(':id', $this->id);
        $stmt->bindParam(':title', $this->title);
        $stmt->bindParam(':questionId', $this->questionId);
        $stmt->bindParam(':quizzId', $this->quizzId);
        $stmt->bindParam(":isValid", $this->isValid);

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
