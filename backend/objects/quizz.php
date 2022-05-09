<?php
class Quizz{
    private $conn;
    private $table_name = "quizz";
 
    public $id;
    public $name;
    public $description;
    public $isRandomQuestions;
 
    public function __construct($db){
        $this->conn = $db;
    }

    function read(){
        $query = "SELECT * FROM " . $this->table_name;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    function readSingle(){
        // update query
        $query = "SELECT * FROM " . $this->table_name . " WHERE id = ?";
     
        // prepare query statement
        $stmt = $this->conn->prepare($query);
     
        // sanitize
        $this->id=htmlspecialchars(strip_tags($this->id));
     
        // bind new values
        $stmt->bindParam(1, $this->id);  
     
        // execute the query
        $stmt->execute();
        return $stmt;
    }

    function create(){
        $query = "INSERT INTO
                    " . $this->table_name . "
                SET
                    name=:name, description=:description, isRandomQuestions=:isRandomQuestions";
        $stmt = $this->conn->prepare($query);
     
        // sanitize
        $this->name=htmlspecialchars(strip_tags($this->name));
        $this->description=htmlspecialchars(strip_tags($this->description));
        $this->isRandomQuestions=htmlspecialchars(strip_tags($this->isRandomQuestions));
     
        // bind values
        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":description", $this->description);
        $stmt->bindParam(":isRandomQuestions", $this->isRandomQuestions);
     
        // execute query
        if($stmt->execute()){
            return true;
        }
     
        return false;
    }

    function update(){
        // update query
        $query = "UPDATE
                    " . $this->table_name . "
                SET
                    name=:name,
                    description=:description,
                    isRandomQuestions=:isRandomQuestions
                WHERE
                    id = :id";
     
        // prepare query statement
        $stmt = $this->conn->prepare($query);
     
        // sanitize
        $this->name=htmlspecialchars(strip_tags($this->name));
        $this->id=htmlspecialchars(strip_tags($this->id));
     
        // bind new values
        $stmt->bindParam(':id', $this->id);
        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':description', $this->description);  
        $stmt->bindParam(':isRandomQuestions', $this->isRandomQuestions);      
     
        // execute the query
        if($stmt->execute()){
            return true;
        }
     
        return false;
    }

    function delete(){
        $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
        
        $stmt = $this->conn->prepare($query);
     
        $this->id=htmlspecialchars(strip_tags($this->id));
     
        $stmt->bindParam(1, $this->id);
     
        if($stmt->execute()){
            return true;
        }
     
        return false;
    }
}
?>