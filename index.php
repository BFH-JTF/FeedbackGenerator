<?php
include_once "config.php";
$db = connectDB();
$userID = getActiveUserID($db);
if ($userID !== null){
    $db->close();
    redirect("main.php");
    die();
}
$db->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Feedback Generator</title>
    <script src="https://unpkg.com/jquery"></script>
    <link href="./bootstrap-4.3.1/css/bootstrap.min.css" rel="stylesheet">
    <script type="text/javascript" src="./bootstrap-4.3.1/js/bootstrap.bundle.min.js"></script>
</head>
<body>
<div class="container-fluid m-4 text-center">
    <h2>Feedback Generator</h2>
    <p class="text-body font-italic m-5">[Add login instructions here]</p>
    <div class="container d-flex justify-content-around flex-wrap w-25" id="LoginFormContainer" style="min-width: 480px">
        <form method="post" action="login.php">
            <div class="input-group mb-3 form-group-lg">
                <div class="input-group-prepend">
                    <span class="input-group-text">UserID</span>
                </div>
                <input id="UserID" name="UserID" type="text" class="form-control input-lg" placeholder="user name" aria-label="user name">
            </div>
            <div class="input-group mb-3 form-group-lg">
                <div class="input-group-prepend">
                    <span class="input-group-text">Password</span>
                </div>
                <input id="Password" name="Password" type="password" class="form-control input-lg" placeholder="password" aria-label="user password" size="3">
            </div>
            <input type="submit" class="btn btn-success" value="Login">
        </form>
    </div>
</div>
</body>
</html>