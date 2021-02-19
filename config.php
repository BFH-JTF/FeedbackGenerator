<?php
// fej1@bfh.ch / hdd2@bfh.ch
// 31893d2f5069da41348c3586c76806c436ad1a6ccde8d5f69db95508b03f591a
// 3c9e486b750ea9de3da1c02d78e0359a6dc4bad867c635b9f0e6ab4891062c6d

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
    if (isset($_COOKIE["FBG-ID"]) && isset($_COOKIE["FBG-Token"])){
        $result = $db->query("SELECT userID FROM users WHERE token='".$db->real_escape_string($_COOKIE["FBG-Token"])."' AND SHA2(userID, 256) = '" .$db->real_escape_string($_COOKIE["FBG-ID"])."'");
        if ($result->num_rows == 1){
            $r = $result->fetch_assoc();
            return ($r["userID"]);
        }
        return null;
    }
    return null;
}

function makeCookie($userID, $token){
    if ($userID == null){
        setcookie("FBG-ID", "", time()-3600);
        setcookie("FBG-Token", "", time()-3600);
        // setcookie('NAME_OF_A_SESNSISITVE_COOKIE',   'cookie_value', ['samesite' => 'Lax']);
    }
    else{
        $expiry = time()+3600*72;
        setcookie("FBG-ID", hash("sha256",$userID), $expiry, "/fbg", "smari.pantek.ch");
        setcookie("FBG-Token", strval($token), $expiry, "/fbg", "smari.pantek.ch");
        $myDB = connectDB();
        $time = date('Y-m-d H:i:s',$expiry);
        $myDB->query("INSERT INTO users (userID, token, timeout) VALUES ('".$userID."', '".$token."', '". $time ."') ON DUPLICATE KEY UPDATE token='".$token."', timeout='". $time ."'");
    }

}

function userAuthenticated(): bool
{
    $db = connectDB();
    $userID = getActiveUserID($db);
    if ($userID == null){
        makeCookie(null, null);
        return false;
    }
    else{
        $time = date('Y-m-d H:i:s',time()+86400*10);
        $db->query("UPDATE users SET timeout=".$time." WHERE token='".$_COOKIE["FBG-Token"]."'");
        makeCookie($userID, $_COOKIE["FBG-Token"]);
        return true;
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