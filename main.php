<?php
// https://jqueryui.com/sortable/
include_once "config.php";
if (!userAuthenticated()){
    redirect("index.php");
    die();
}
$db = connectDB();
$userID = getActiveUserID($db);
$result = $db->query("SELECT categoryID, name, color from categories WHERE owner='".$userID."' ORDER BY name");
$r = $result->fetch_all(MYSQLI_ASSOC);
$buttonString = "";
foreach ($r as $cat){
    $buttonString .= '<button class="btn btn-outline-secondary" data-color="'.$cat["color"].'" data-status="disabled" data-category="'.$cat["categoryID"].'" onclick="categoryFilterButtonClick(this)">'.$cat["name"].'</button>';
}
$assignmentID = $_SESSION["assignmentID"];
?>

<html lang="en">
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" charset="UTF-8">
    <title>Feedback Generator</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css">
    <link href="fontawesome-free-5.15.1-web/css/all.css" rel="stylesheet">
    <link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
    <script src="https://code.jquery.com/jquery-3.5.1.js"></script>
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.js"></script>
    <script type="text/javascript" src="config.js"></script>
    <script type="text/javascript" src="main.js"></script>
    <script type="text/javascript">const assignmentID = <?php echo $_SESSION["assignmentID"];?></script>
    <style type='text/css'>
        .btn-green {
            background-color: #1ab394;
            color: #fff;
            border-radius: 3px;
        }
        .btn-green:hover, .btn-green:focus {
            background-color: #18a689;
            color: #fff;
        }
        .textblocktext {
            font-size: 80%;
        }
        .textblocktitle {
            font-weight: bold;
        }
        #activeFeedbackItems { list-style-type: none; margin: 0; padding: 0; width: 450px; }
        #activeFeedbackItems li { margin: 3px 3px 3px 0; padding: 1px; float: left; width: 150px; height: 90px; font-size: 1em; text-align: center; }
        #passiveFeedbackItems { list-style-type: none; margin: 0; padding: 0; width: 450px; }
        #passiveFeedbackItems li { margin: 3px 3px 3px 0; padding: 1px; float: left; width: 150px; height: 90px; font-size: 1em; text-align: center; }
    </style>
</head>
<body style="background-color: #fafafa;" onload="pageInit()">
<?php include("navbar.html");?>

<div class="row">
    <div class="col-sm-2">
        <h5 class="text-center">Assignment ID: <span id="assignmentID"></span> </h5>
        <div class="list-group" id="submissionList"></div>
    </div>
    <div id="mainScreen" class="col-sm-6" hidden>
        <div class="container-fluid text-center mt-3 mb-3">
            <p class="h2 d-block">Feedback Editor </p>
<!--            TODO Read file URL and create icon for each-->
            <u>Submission at <span id="submissionTimeString"></span> by <span id="studName"></span> (<span id="attachments"><i class="fas fa-envelope-open-text" data-toggle="tooltip" title="Open submission"></i></span>)</u>
            <p>Filter by Category</p>
            <div class="container-fluid text-center mt-3 mb-3 d-flex justify-content-center">
                <?php echo $buttonString;?>
            </div>
            <p><input id="tickFilter" type="checkbox" onchange="filterSwitch()"> <label for="tickFilter">Filter by Performance</label> (<span id="performanceValue">3</span>)</p>
            <div class="slidecontainer">
                <input type="range" min="1" max="4" value="3" class="slider" id="performanceSlider" oninput="performanceChange(this)">
            </div>
        </div>
        <hr>
        <p class="text-lead text-center">Click on <span style="color: Tomato;"><i class="fas fa-trash-alt"></i></span> to remove text block from feedback text</p>
        <div class="container-fluid mt-5">
            <div class="list-group">
                <ul id="activeFeedbackItems" class="sortable grid w-100">
                </ul>
            </div>
        </div>
        <div class="d-flex justify-content-center mt-3">
            <button class="btn btn-green" onclick="generateFeedbackText()">Generate Feedback Text</button>
        </div>
        <hr>
        <p class="text-lead text-center"><i class="fas fa-arrow-down"></i>Click on the plus icon of an entry below to add it to feedback text<i class="fas fa-arrow-down"></i></p>
        <div class="container-fluid">
            <ul id="passiveFeedbackItems" class="sortable grid w-100"></ul>
        </div>
    </div>
    <div id="currentScreen" class="col-sm-4" hidden>
        <div class="container-fluid mt-3 mb-3 form-group">
            <p class="h3 d-block">Feedback Entry </p>
            <div class="input-group mb-3">
                <div class="input-group-prepend">
                    <span class="input-group-text">Grade</span>
                </div>
                <input id="grade" type="text" class="form-control">
            </div>
            <textarea id="finaltext" class="form-control">This is the current feedback text</textarea>
            <button class="btn btn-success mt-3">Save to Moodle</button>
        </div>
    </div>
</div>

</body>
<script type="text/javascript">document.getElementById("nav-home-tab").classList.add("active")</script>
</html>
