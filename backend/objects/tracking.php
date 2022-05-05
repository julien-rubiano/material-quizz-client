<?php
class Tracking{
    private $conn;
    private $table_name = "tracking";
    
    public $id;
    public $userId;
    public $missionId;
    public $date;
    public $month;
    public $year;
 
    public function __construct($db){
        $this->conn = $db;
    }

    function read(){
        $query = "SELECT 
                    t.id, 
                    t.missionId as missionId, 
                    m.name as missionName, 
                    t.userId as userId,
                    CONCAT(u.firstname, ' ', u.lastname) as userName,
                    ROUND(u.cost*1./2,2) as userCost,
                    t.date 
                FROM " . $this->table_name . " t 
                LEFT JOIN missions m ON t.missionId = m.id 
                LEFT JOIN users u ON t.userId = u.id 
                WHERE MONTH(t.date)=:month AND YEAR(t.date)=:year 
                ORDER BY missionId ASC";
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->month=htmlspecialchars(strip_tags($this->month)); 
        $this->year=htmlspecialchars(strip_tags($this->year));        

        // bind values
        $stmt->bindParam(":year", $this->year);
        $stmt->bindParam(":month", $this->month);

        // execute query
        $stmt->execute();
        return $stmt;
    }

    function read_by_user(){
        $query = "SELECT t.id, t.missionId as missionId, m.name as missionName, t.date 
                    FROM " . $this->table_name . " t 
                    LEFT JOIN missions m ON t.missionId = m.id 
                    WHERE t.userId=:userId";
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->userId=htmlspecialchars(strip_tags($this->userId));        

        // bind values
        $stmt->bindParam(":userId", $this->userId);

        // execute query
        $stmt->execute();
        return $stmt;
    }

    function read_absences(){
        $query = "SELECT 
                    u.id as userId,
                    CONCAT(u.firstname, ' ', u.lastname) as userName,
                    t.date 
                FROM " . $this->table_name . " t 
                LEFT JOIN users u ON t.userId = u.id 
                WHERE t.missionId = 1";
        $stmt = $this->conn->prepare($query);

        // execute query
        $stmt->execute();
        return $stmt;
    }

    function create(){
        $query = "INSERT INTO
                    " . $this->table_name . "
                SET
                    userId=:userId, missionId=:missionId, date=:date";
        $stmt = $this->conn->prepare($query);
     
        // sanitize
        $this->userId=htmlspecialchars(strip_tags($this->userId));
        $this->missionId=htmlspecialchars(strip_tags($this->missionId));
        $this->date=htmlspecialchars(strip_tags($this->date));
     
        // bind values
        $stmt->bindParam(":userId", $this->userId);
        $stmt->bindParam(":missionId", $this->missionId);
        $stmt->bindParam(":date", $this->date);

        // execute query
        $stmt->execute();
        return $this->conn->lastInsertId();
    }

    function delete(){
        $query = "DELETE FROM " . $this->table_name . " WHERE id=:id";
        $stmt = $this->conn->prepare($query);
        
        // sanitize
        $this->id=htmlspecialchars(strip_tags($this->id));
        
        // bind values
        $stmt->bindParam(":id", $this->id);
     
        if($stmt->execute()){
            return true;
        }
     
        return false;
    }
}
?>