<?php
require_once 'ims-blti/blti.php';
session_start();

function connectDB (): mysqli
{
    $sqlServername = "localhost";
    $sqlUsername = "fbg";
    $sqlPassword = "ncOydxNfdVyFlpU9BolE";
    $dbname = "feedbackGenerator";
    $db = new mysqli($sqlServername, $sqlUsername, $sqlPassword, $dbname);
    if ($db->connect_error) {
        die("Connection failed: " . $db->connect_error);
    }
    return($db);
}

function getActiveUserID($db): ?string  // returns userID if cookie is set and token is still valid
{   
    if (array_key_exists("oauth_consumer_key", $_REQUEST)) {
        $result = $db->query("SELECT shared_secret FROM consumers WHERE consumer_key = '" .$_REQUEST["oauth_consumer_key"]."'");
        if ($result->num_rows == 1) {
            $r = $result->fetch_assoc();
            $secret = ($r["shared_secret"]);
            $lti = new BLTI($secret, false, false);
            if ($lti->valid){
                $userID = $lti->getUserEmail();
                $result = $db->query("SELECT userID FROM users WHERE userID = '" .$userID."'");
                if ($result->num_rows <= 1){
                    if ($result->num_rows == 0) {
                        $db->query("INSERT INTO users (userID) VALUES ('".$userID."')");
                    }
                    $_SESSION['userID'] = $userID;
                    $_SESSION['assignmentID'] = $lti->getResourceLinkId();
                    return $userID;
                }  else {
                    return null;
                }
            } else {
                return null;
            }
        }
    } elseif (array_key_exists("userID", $_SESSION)){
        return $_SESSION['userID'];
    } else {
        return null;
    }
    
}

function userAuthenticated(): bool
{
    $db = connectDB();
    $userID = getActiveUserID($db);
    if ($userID != null){
        return true;
    } else {
        return false;
    }
}

function redirect($url){
    if (headers_sent()){
        die('<script type="text/javascript">window.location=\''.$url.'\';</script>');
    }else{
        header('Location: ' . $url);
        die();
    }
}