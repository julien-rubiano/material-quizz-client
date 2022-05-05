<?php
class Mission{
    private $conn;
    private $table_name = "missions";
 
    public $id;
    public $name;
    public $code;
    public $startDate;
    public $technologies;
 
    public function __construct($db){
        $this->conn = $db;
    }

    function read(){
        $query = "SELECT * FROM " . $this->table_name . " WHERE id > 1";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    function create(){
        $query = "INSERT INTO
                    " . $this->table_name . "
                SET
                    name=:name, 
                    code=:code,
                    startDate=:startDate,
                    technologies=:technologies";
        $stmt = $this->conn->prepare($query);
     
        // sanitize
        $this->name=htmlspecialchars(strip_tags($this->name));
        $this->code=htmlspecialchars(strip_tags($this->code));
        $this->startDate=htmlspecialchars(strip_tags($this->startDate));
        $this->technologies=htmlspecialchars(strip_tags($this->technologies));
     
        // bind values
        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":code", $this->code);
        $stmt->bindParam(":startDate", $this->startDate);
        $stmt->bindParam(":technologies", $this->technologies);
     
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
                    name = :name,
                    code = :code,
                    startDate=:startDate,
                    technologies=:technologies
                WHERE
                    id = :id";
     
        // prepare query statement
        $stmt = $this->conn->prepare($query);
     
        // sanitize
        $this->name=htmlspecialchars(strip_tags($this->name));
        $this->code=htmlspecialchars(strip_tags($this->code));
        $this->startDate=htmlspecialchars(strip_tags($this->startDate));
        $this->technologies=htmlspecialchars(strip_tags($this->technologies));
        $this->id=htmlspecialchars(strip_tags($this->id));
     
        // bind new values
        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':code', $this->code);
        $stmt->bindParam(":startDate", $this->startDate);
        $stmt->bindParam(":technologies", $this->technologies);
        $stmt->bindParam(':id', $this->id);
     
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