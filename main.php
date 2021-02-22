<?php
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
    $buttonString .= '<button class="btn btn-outline-light m-1 border border-dark" style="background-color: '.$cat["color"].'" data-color="'.$cat["color"].'" data-status="enabled" data-category="'.$cat["categoryID"].'" onclick="categoryButtonClick(this)">'.$cat["name"].'</button>';
}

$submissionID = $_GET["sid"] // FIXME How is submission ID handed over?
?>
<html lang="en">
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" charset="UTF-8">
    <title>Feedback Generator</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css">
    <link href="fontawesome-free-5.15.1-web/css/all.css" rel="stylesheet">
    <link rel="stylesheet" href="css/html5sortable.css">
    <script src="https://code.jquery.com/jquery-3.5.1.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.js"></script>
    <script type="text/javascript" src="https://unpkg.com/sortablejs@1.7.0/Sortable.js"></script>
    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@shopify/draggable@1.0.0-beta.12/lib/sortable.js"></script>
    <script type="text/javascript" src="html5sortable-0.9.17/dist/html5sortable.min.js"></script>
    <script type="text/javascript" src="draggrid.js"></script>
    <script type="text/javascript" src="config.js"></script>
    <script type="text/javascript" src="main.js"></script>

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
    </style>
</head>
<body style="background-color: #fafafa;">
<?php include("navbar.html");?>

<div class="row">
    <div class="col-sm-2">
        <h5 class="text-center">Submissions</h5>
        <div class="list-group">
            <a id="sub1" class="list-group-item list-group-item-action"><i class="far fa-circle mr-2" style="color: Tomato;"></i>Troy Partridge<i class="fas fa-envelope-open-text ml-2"></i></a>
            <a id="sub2" class="list-group-item list-group-item-action bg-light"><i class="far fa-check-circle mr-2" style="color: Forestgreen;"></i>Dane Villalobos</a>
            <a href="#" class="list-group-item list-group-item-action">Margot Bean</a>
            <a href="#" class="list-group-item list-group-item-action">Chanice Edge</a>
            <a href="#" class="list-group-item list-group-item-action">Chanice Edge</a>
            <a href="#" class="list-group-item list-group-item-action">Chanice Edge</a>
            <a href="#" class="list-group-item list-group-item-action">Chanice Edge</a>
            <a href="#" class="list-group-item list-group-item-action">Chanice Edge</a>
            <a href="#" class="list-group-item list-group-item-action">Chanice Edge</a>
            <a href="#" class="list-group-item list-group-item-action">Chanice Edge</a>
            <a href="#" class="list-group-item list-group-item-action">Chanice Edge</a>
            <a href="#" class="list-group-item list-group-item-action">Chanice Edge</a>
            <a href="#" class="list-group-item list-group-item-action">Chanice Edge</a>
            <a href="#" class="list-group-item list-group-item-action">Chanice Edge</a>
            <a href="#" class="list-group-item list-group-item-action">Chanice Edge</a>
            <a href="#" class="list-group-item list-group-item-action">Chanice Edge</a>
            <a href="#" class="list-group-item list-group-item-action">Chanice Edge</a>
            <a href="#" class="list-group-item list-group-item-action">Chanice Edge</a>
            <a href="#" class="list-group-item list-group-item-action">Chanice Edge</a>
            <a href="#" class="list-group-item list-group-item-action">Chanice Edge</a>
            <a href="#" class="list-group-item list-group-item-action">Chanice Edge</a>
            <a href="#" class="list-group-item list-group-item-action">Chanice Edge</a>
            <a href="#" class="list-group-item list-group-item-action">Chanice Edge</a>
        </div>
    </div>
    <div class="col-sm-10">
        <div class="container-fluid text-center mt-3 mb-3">
            <p class="h2 d-block">Feedback Editor</p>
            <p>Filter by Category</p>
            <div class="container-fluid text-center mt-3 mb-3 d-flex justify-content-center">
                <?php echo $buttonString;?>
            </div>
            <p><input id="tickFilter" type="checkbox" onchange="filterSwitch()" checked> <label for="tickFilter">Filter by Performance</label> (<span id="performanceValue">3</span>)</p>
            <div class="slidecontainer">
                <input type="range" min="1" max="4" value="3" class="slider" id="performanceSlider" oninput="performanceChange(this)">
            </div>
        </div>
        <hr>
        <p class="text-lead text-center">Click on <span style="color: Tomato;"><i class="fas fa-trash-alt"></i></span> to remove text block from feedback text</p>
        <div class="container-fluid mt-5">
            <div id="activeFeedbackItems" class="list-group">
                <ul id="sortable" class="sortable grid w-100">
                    <li draggable="true" data-category="1" data-performance="5"><span style="color: Tomato;" onclick="activeFeedbackClick(this)"><i class="fas fa-trash-alt mr-2"></i></span><br>More Illustration recommended</li>
                    <li draggable="true">Item 2</li>
                    <li draggable="true">Item 3</li>
                    <li draggable="true">Item 4</li>
                    <li draggable="true">Item 5</li>
                    <li draggable="true">Item 6</li>
                </ul>
            </div>
        </div>
        <div class="d-flex justify-content-center mt-3">
            <button class="btn btn-green">Generate Feedback Text</button>
        </div>
        <hr>
        <p class="text-lead text-center"><i class="fas fa-arrow-down"></i>Click anywhere on an entry below to add it to feedback text<i class="fas fa-arrow-down"></i></p>
        <div id="passiveFeedbackItems" class="container-fluid">
            <ul id="sortable" class="sortable grid w-100">
                <li draggable="true" data-category="1" data-performance="5"><span style="color: forestgreen;" onclick="passiveFeedbackClick(this)"><i class="fas fa-plus mr-2"></i></span><br>Check spelling</li>
                <li draggable="true" data-category="2" data-performance="2">Item 2</li>
                <li draggable="true" data-category="1" data-performance="6">Item 3</li>
                <li draggable="true" data-category="1" data-performance="9">Item 4</li>
                <li draggable="true" data-category="1" data-performance="3">Item 5</li>
                <li draggable="true" data-category="1" data-performance="1">Item 6</li>
            </ul>
        </div>
    </div>
</div>

</body>
<script type="text/javascript">document.getElementById("nav-home-tab").classList.add("active")</script>
</html>
