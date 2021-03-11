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
$optionString = "";
$buttonString = "";
foreach ($r as $cat){
    $optionString .= "<option value='".$cat["categoryID"]."'>".$cat["name"]."</option>";
    $buttonString .= '<button class="btn btn-outline-secondary" data-color="'.$cat["color"].'" data-status="disabled" data-category="'.$cat["categoryID"].'" onclick="categoryButtonClick(this)">'.$cat["name"].'</button>';
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" charset="UTF-8">
    <title>Feedback Generator Categories</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.js "></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
    <script type="text/javascript" src="config.js"></script>
    <script type="text/javascript" src="textblocks.js"></script>
</head>
<body style="background-color: #fafafa;" onload="pageLoaded()">
<?php include ("navbar.html")?>

<div class="container text-center mt-3 mb-3">
    <p class="h2 d-block">Text Block Editor</p>
    <p>Filter by Category</p>
    <div class="container-fluid text-center mt-3 mb-3 d-flex justify-content-center">
        <?php echo $buttonString;?>
    </div>
    <p><input id="tickFilter" type="checkbox" onchange="filterSwitch()"> <label for="tickFilter">Filter by Performance</label> (<span id="performanceValue">3</span>)</p>
    <div class="slidecontainer">
        <input type="range" min="1" max="4" value="3" class="slider" id="performanceSlider" oninput="performanceChange(this)">
    </div>
    <button type="button" class="btn btn-success btn-sm" data-toggle="modal" data-target="#TextBlockModal" onclick="fillTextBlockModal(null)">New Text Block</button>
</div>
<hr>

<div class="container d-flex justify-content-around flex-wrap" id="cardContainer">

</div>

<div class="modal" id="TextBlockModal" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 id="TextBlockModalHeading" class="modal-title">New Textblock</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="container d-flex justify-content-around flex-wrap" id="formContainer">
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text">Textblock Title</span>
                        </div>
                        <input id="TextBlockModalTitle" type="text" class="form-control" onkeyup="checkModalAddData()" placeholder="textblock title">
                    </div>

                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text" id="catColor0">TextBlock Category</span>
                        </div>
                        <select id="TextBlockModalCategorySelect" size="1">
                            <?php echo $optionString;?>
                        </select>
                    </div>

                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text">Performance Level&nbsp;<span id="modalPerformanceValue">4</span></span>
                        </div>
                        <input type="range" min="1" max="4" value="3" class="slider" id="TextBlockModalPerformanceSlider" oninput="modalPerformanceChange(this)">
                    </div>

                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text" id="catName1">Textblock Text</span>
                        </div>
                        <textarea id="TextBlockModalText" class="form-control" rows="5" style="min-width: 100%"></textarea>
                        <small>Use <i>[FIRSTNAME]</i> or <i>[LASTNAME]</i> as variables</small>
                    </div>
                    <input type="hidden" id="TextBlockModalID">
                </div>
            </div>
            <div class="modal-footer">
                <button id="TextBlockModalNewButton" type="button" class="btn btn-primary" data-dismiss="modal" onclick="addBlock()" disabled>Create Text Block</button>
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
</body>
<script type="text/javascript">document.getElementById("nav-textblocks-tab").classList.add("active")</script>
</html>