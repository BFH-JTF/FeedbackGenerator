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
    Not logged in
</div>
</body>
</html>