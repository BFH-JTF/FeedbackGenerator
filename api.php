<?php
$baseURL = "https://moodle.bfh.ch/webservice/restful/server.php/";

include_once "config.php";
if (userAuthenticated() && isset($_POST["action"]) && isset($_POST["data"])){
    $db = connectDB();
    $data = json_decode(addcslashes($_POST["data"], "\n"));
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
            $db->query("UPDATE textblocks SET categoryID='".$db->real_escape_string($data->categoryID)."', textblock='".$db->real_escape_string($data->textBlock)."', performance='".$db->real_escape_string($data->performance)."', title='".$db->real_escape_string($data->title)."' WHERE blockID=".$db->real_escape_string($data->textBlockID));
            $res = $db->query("SELECT color from categories WHERE categoryID='".$db->real_escape_string($data->categoryID)."'");
            $r = $res->fetch_row();
            $data->color = $r[0];
            echo json_encode($data);
            break;

        case "removeTextBlock":
            $db->query("DELETE FROM textblocks WHERE blockID=" . $db->real_escape_string($data));
            break;

        case "getAssignmentData":
            $curl = curl_init();
            curl_setopt_array($curl, [
                CURLOPT_URL => $baseURL."local_feedback_list_submissions",
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => "",
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 30,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => "POST",
                CURLOPT_POSTFIELDS => "{\n  \"request\": {\n    \"cmid\": ".$data->assignid."\n  }\n} ",
                CURLOPT_HTTPHEADER => [
                    "Accept: application/json",
                    "Authorization: ".$data->wstoken,
                    "Content-Type: application/json",
                    "HTTP_ACCEPT: application/json",
                    "HTTP_CONTENT_TYPE: application/json"
                ],
            ]);
            $d = json_decode(curl_exec($curl));
            foreach ($d->response->submissions as $sub)
            {
                $res = $db->query("SELECT grade, feedback from cache WHERE submissionid='".$sub->submissionid."'");
                $r = $res->fetch_array(MYSQLI_ASSOC);
                if ($r !== null){
                    $sub->localGrade = $r["grade"];
                    $sub->localFeedback = $r["feedback"];
                }
                else{
                    $sub->localGrade = "";
                    $sub->localFeedback = "";
                }

            }
            echo json_encode($d);
            break;

        case "getSubmissionData":
            $curl = curl_init();
            curl_setopt_array($curl, [
                CURLOPT_URL => $baseURL."local_feedback_get_submission",
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => "",
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 30,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => "POST",
                CURLOPT_POSTFIELDS => "{\n  \"request\": {\n    \"submissionid\": ".$data->submissionid."\n  }\n} ",
                CURLOPT_HTTPHEADER => [
                    "Accept: application/json",
                    "Authorization: ".$data->wstoken,
                    "Content-Type: application/json",
                    "HTTP_ACCEPT: application/json",
                    "HTTP_CONTENT_TYPE: application/json"
                ],
            ]);
            echo curl_exec($curl);
            break;

        case "giveFeedback":
            $curl = curl_init();
            curl_setopt_array($curl, [
                CURLOPT_URL => $baseURL."local_feedback_update_grade",
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => "",
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 30,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => "POST",
                CURLOPT_HTTPHEADER => [
                    "Accept: application/json",
                    "Authorization: ".$data->wstoken,
                    "Content-Type: application/json",
                    "HTTP_ACCEPT: application/json",
                    "HTTP_CONTENT_TYPE: application/json"
                ],
                CURLOPT_POSTFIELDS => "{\"request\": {\"submissionid\": ".$data->submissionid.", \"grade\": \"".$data->grade."\", \"feedback\": \"".$db->real_escape_string($data->feedback)."\"}} ",

            ]);
            echo curl_exec($curl);
            break;

        case "saveLocal":
            if ($db->query("INSERT INTO cache (submissionid, grade, feedback) VALUES (\"".$db->real_escape_string($data->submissionid)."\", \"".$db->real_escape_string($data->grade)."\", \"".$db->real_escape_string($data->feedback)."\") ON DUPLICATE KEY UPDATE grade=\"".$db->real_escape_string($data->grade)."\", feedback=\"".$db->real_escape_string($data->feedback)."\"")){
                echo "Data saved successfully";
            }
            else{
                echo "Error while saving data to DB";
            }
            break;

        case "getLocal":
            $result = $db->query("SELECT grade, feedback FROM cache WHERE submissionid='".$db->real_escape_string($data->submissionid)."'");
            if($result){
                $r = $result->fetch_all(MYSQLI_ASSOC);
                if (count($r) > 0) {
                    echo json_encode($r);
                }
                else{
                    echo "{\"error\": \"No data in DB\"}";
                }
            }
            break;

        case "generateOverview":
            foreach ($data as $submission){
                $result = $db->query("SELECT grade, feedback FROM cache WHERE submissionid='".$db->real_escape_string($submission->submissionid)."'");
                $r = $result->fetch_assoc();
                $submission->grade = $r["grade"];
                $submission->feedback = $r["feedback"];
            }
            echo json_encode($data);
            break;
    }
}
else{
    die();
}