<?php
include_once "config.php";
if (!(isset($_POST["UserID"]) && isset($_POST["Password"]))){
    die("Invalid login parameters");
}
$db = connectDB();
$userID = $_POST["UserID"];
$password = $_POST["Password"];

// FIXME Dev stage login via user name hash
if ($password == hash("sha256", $userID))
{
    $result = $db->query("SELECT userID, token, timeout FROM users WHERE timeout < NOW() AND userID = '".$userID."'");
    if ($result->num_rows == 1) {
        // Token in cookie is still valid
        $r = $result->fetch_assoc();
        $newToken = $r["token"];
    }
    else {
        $newToken = rand(1000000000000000, 10000000000000000);
    }
    makeCookie($userID, $newToken);
    redirect("main.php");
    die();
}
else{
    redirect("index.php");
}
$db->close();