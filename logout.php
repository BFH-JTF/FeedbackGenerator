<?php
include_once "config.php";
unset($_SESSION["userID"]);
redirect("index.php");
    die();