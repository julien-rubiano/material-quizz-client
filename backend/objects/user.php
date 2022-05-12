<?php
class User{
    private $conn;
    private $table_name = "users";
 
    public $id;
    public $lastName;
    public $firstName;
    public $login;
    public $password;
    public $isAdmin;
 
    public function __construct($db){
        $this->conn = $db;
    }

    function read(){
        $query = "SELECT * FROM " . $this->table_name;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    function create(){
        $query = "INSERT INTO
                    " . $this->table_name . "
                SET
                    lastName=:lastName, firstName=:firstName, login=:login, password=:password, isAdmin=:isAdmin";
        $stmt = $this->conn->prepare($query);
     
        // sanitize
        $this->lastName=htmlspecialchars(strip_tags($this->lastName));
        $this->firstName=htmlspecialchars(strip_tags($this->firstName));
        $this->login=htmlspecialchars(strip_tags($this->login));
        $this->password=htmlspecialchars(strip_tags($this->password));
        $this->isAdmin=htmlspecialchars(strip_tags($this->isAdmin));
     
        // bind values
        $stmt->bindParam(":lastName", $this->lastName);
        $stmt->bindParam(":firstName", $this->firstName);
        $stmt->bindParam(":login", $this->login);
        $stmt->bindParam(":password", $this->password);
        $stmt->bindParam(":isAdmin", $this->isAdmin);
     
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
                    firstName = :firstName,
                    lastName = :lastName,
                    login = :login,
                    password = :password,
                    isAdmin = :isAdmin
                WHERE
                    id = :id";
     
        // prepare query statement
        $stmt = $this->conn->prepare($query);
     
        // sanitize
        $this->id=htmlspecialchars(strip_tags($this->id));
        $this->firstName=htmlspecialchars(strip_tags($this->firstName));
        $this->lastName=htmlspecialchars(strip_tags($this->lastName));
        $this->login=htmlspecialchars(strip_tags($this->login));
        $this->password=htmlspecialchars(strip_tags($this->password));
        $this->isAdmin=htmlspecialchars(strip_tags($this->isAdmin));
     
        // bind new values
        $stmt->bindParam(':id', $this->id);
        $stmt->bindParam(':firstName', $this->firstName);
        $stmt->bindParam(':lastName', $this->lastName);
        $stmt->bindParam(':login', $this->login);
        $stmt->bindParam(':password', $this->password);
        $stmt->bindParam(':isAdmin', $this->isAdmin);
     
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

    function isAdmin(){
        $query = "SELECT * FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare( $query );
     
        // bind
        $stmt->bindParam(1, $this->id);
     
        // execute query
        $stmt->execute();
     
        // get retrieved row
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
     
        // set values to object properties
        $this->id = (int)$row['id'];
        $this->login = $row['login'];
        $this->isAdmin = $row['isAdmin'];
    }

    function login(){
        $query = "SELECT * FROM " . $this->table_name . " WHERE login=:login AND password=:password";
        $stmt = $this->conn->prepare( $query );

        // sanitize
        $this->login=htmlspecialchars(strip_tags($this->login));
        $this->password=htmlspecialchars(strip_tags($this->password));
     
        // bind
        $stmt->bindParam(':login', $this->login);
        $stmt->bindParam(':password', $this->password);
     
        // execute query
        $stmt->execute();
     
        // get retrieved row
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
     
        // set values to object properties
        $this->id = (int)$row['id'];
        $this->login = $row['login'];
        $this->firstName = $row['firstName'];
        $this->lastName = $row['lastName'];
    }
}
?>