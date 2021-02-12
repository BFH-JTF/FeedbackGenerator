<?php
include_once "config.php";
if (userAuthenticated() && isset($_POST["action"]) && isset($_POST["data"])){
    $db = connectDB();
    $data = json_decode($_POST["data"]);
    $userID = getActiveUserID($db);

    switch ($_POST["action"]){
        case "addCategory":
            // data.name / data.color / data.desc

            if ($db->query(mysqli_real_escape_string("INSERT INTO categories (owner, name, color, `desc`) VALUES ('".$userID."', '".$data->name."', '".$data->color."', '".$data->desc."')")) === true){
                $data->categoryID = $db->insert_id;
                echo json_encode($data);
            }
            else{
                echo -1;
            }
            break;

        case "getCategories":
            $result = $db->query("SELECT name, color, `desc`, categoryID FROM categories WHERE owner='".$db->real_escape_string($userID)."'");
            if($result){
                $r = $result->fetch_all(MYSQLI_ASSOC);
                echo json_encode($r);
            }
            break;

        case "saveCategory":
            if($db->query("UPDATE categories SET name='".$db->real_escape_string($data->name)."', color='".$db->real_escape_string($data->color)."', categories.desc='".$db->real_escape_string($data->desc)."' WHERE categoryID=" . $db->real_escape_string($data->id))){
                echo json_encode($data);
            }
            break;

        case "removeCategory":
            $db->query("DELETE FROM categories WHERE categoryID=" . $db->real_escape_string($data));
            break;
    }
}
else{
    die();
}