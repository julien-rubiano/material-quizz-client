<?php
class Quizz
{
    private $conn;
    private $table_name = "quizz";

    public $id;
    public $title;
    public $description;
    public $isRandomQuestions;
    public $duration;

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

    function create()
    {
        $query = "INSERT INTO
                    " . $this->table_name . "
                SET
                    title=:title";
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->title = htmlspecialchars(strip_tags($this->title));

        // bind values
        $stmt->bindParam(":title", $this->title);

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
                    description=:description,
                    isRandomQuestions=:isRandomQuestions,
                    duration=:duration
                WHERE
                    id = :id";

        // prepare query statement
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->id = htmlspecialchars(strip_tags($this->id));
        $this->title = htmlspecialchars(strip_tags($this->title));
        $this->description = htmlspecialchars(strip_tags($this->description));
        $this->isRandomQuestions = htmlspecialchars(strip_tags($this->isRandomQuestions));
        $this->duration = htmlspecialchars(strip_tags($this->duration));

        // bind new values
        $stmt->bindParam(':id', $this->id);
        $stmt->bindParam(':title', $this->title);
        $stmt->bindParam(':description', $this->description);
        $stmt->bindParam(':isRandomQuestions', $this->isRandomQuestions);
        $stmt->bindParam(':duration', $this->duration);

        // execute query
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
