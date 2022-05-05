<?php
class NonWorkingDay{
    private $conn;
    private $table_name = "nonWorkingDays";
 
    public $id;
    public $date;
 
    public function __construct($db){
        $this->conn = $db;
    }

    function read(){
        $query = "SELECT * FROM " . $this->table_name;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }
}
?>