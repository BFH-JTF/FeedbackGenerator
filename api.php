<?php
include_once "config.php";
if (userAuthenticated() && isset($_POST["action"]) && isset($_POST["data"])){
    $db = connectDB();
    $data = json_decode($_POST["data"]);
    $userID = getActiveUserID($db);

    switch ($_POST["action"]){
        case "addCategory":
            // data.name / data.color / data.desc
            if ($db->query("INSERT INTO categories (owner, name, color, `desc`) VALUES ('".$db->real_escape_string($userID)."', '".$db->real_escape_string($data->name)."', '".$db->real_escape_string($data->color)."', '".$db->real_escape_string($data->desc)."')") === true){
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
            $test = "UPDATE categories SET name='".$db->real_escape_string($data->name)."', color='".$db->real_escape_string($data->color)."', categories.desc='".$db->real_escape_string($data->desc)."' WHERE categoryID=" . $db->real_escape_string($data->id);
            $db->query("UPDATE categories SET name='".$db->real_escape_string($data->name)."', color='".$db->real_escape_string($data->color)."', categories.desc='".$db->real_escape_string($data->desc)."' WHERE categoryID=" . $db->real_escape_string($data->id));
            echo json_encode($data);
            break;

        case "removeCategory":
            $db->query("DELETE FROM categories WHERE categoryID=" . $db->real_escape_string($data));
            break;

        case "getTextBlocks":
            $result = $db->query("SELECT t.categoryID , t.textblock, t.title, t.blockID, t.performance, c.name as catName, c.color FROM textblocks t INNER JOIN categories c  ON t.categoryID  = c.categoryID WHERE t.owner='".$db->real_escape_string($userID)."'");
            if($result){
                $r = $result->fetch_all(MYSQLI_ASSOC);
                echo json_encode($r);
            }
            break;

        case "addTextBlock":
            // data.categoryID / data.textBlock / data.title / data.performance
            $sql = "INSERT INTO textblocks (owner, categoryID, textblock, title, performance) VALUES ('".$db->real_escape_string($userID)."', '".$db->real_escape_string($data->category)."', '".$db->real_escape_string($data->textBlock)."', '".$db->real_escape_string($data->title)."', '".$db->real_escape_string($data->performance)."')";
            if ($db->query("INSERT INTO textblocks (owner, categoryID, textblock, title, performance) VALUES ('".$db->real_escape_string($userID)."', '".$db->real_escape_string($data->category)."', '".$db->real_escape_string($data->textBlock)."', '".$db->real_escape_string($data->title)."', '".$db->real_escape_string($data->performance)."')") === true){
                $data->textBlockID = $db->insert_id;
                echo json_encode($data);
            }
            else{
                echo -1;
            }
            break;

        case "saveTextBlock":
            $test = "UPDATE textblocks SET categoryID='".$db->real_escape_string($data->categoryID)."', textblock='".$db->real_escape_string($data->textblock)."', title='".$db->real_escape_string($data->performance)."', title='".$db->real_escape_string($data->title)."' WHERE blockID=".$db->real_escape_string($data->blockTextID);
            $db->query("UPDATE textblocks SET categoryID='".$db->real_escape_string($data->categoryID)."', textblock='".$db->real_escape_string($data->textblock)."', title='".$db->real_escape_string($data->performance)."', title='".$db->real_escape_string($data->title)."' WHERE blockID=".$db->real_escape_string($data->blockTextID));
            break;
    }
}
else{
    die();
}