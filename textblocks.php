<?php
include_once "config.php";
if (!userAuthenticated()){
    redirect("index.php");
    die();
}
$db = connectDB();
$userID = getActiveUserID($db);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" charset="UTF-8">
    <title>Feedback Generator Categories</title>
    <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-slider/11.0.2/bootstrap-slider.min.js" integrity="sha512-f0VlzJbcEB6KiW8ZVtL+5HWPDyW1+nJEjguZ5IVnSQkvZbwBt2RfCBY0CBO1PsMAqxxrG4Di6TfsCPP3ZRwKpA==" crossorigin="anonymous"></script>
    <script type="text/javascript" src="textblocks.js"></script>
</head>
<body style="background-color: #fafafa;" onload="pageLoaded()">
<?php include ("navbar.html")?>

<div class="container text-center mt-3 mb-3">
    <p class="h2 d-block">Text Block Editor</p>
    <p>Filter by Category</p>
    <div class="container-fluid text-center mt-3 mb-3 d-flex justify-content-center">
        <button class="btn btn-outline-light m-1" style="background-color: #66cdaa" data-color="#66cdaa" data-status="enabled" data-category="0" onclick="categoryButtonClick(this)">
            Language
        </button>
        <button class="btn btn-outline-light m-1" style="background-color: #6F8CFF" data-color="#6F8CFF" data-status="enabled" data-category="1" onclick="categoryButtonClick(this)">
            Management Summary
        </button>
    </div>
    <p><input id="tickFilter" type="checkbox" onchange="filterSwitch()" checked> <label for="tickFilter">Filter by Performance</label> (<span id="performanceValue">5</span>)</p>
    <div class="slidecontainer">
        <input type="range" min="1" max="10" value="5" class="slider" id="performanceSlider" oninput="performanceChange(this)">
    </div>
    <button type="button" class="btn btn-success btn-sm" data-toggle="modal" data-target="#AddTextBlockModal">New Text Block</button>
</div>
<hr>

<div class="container d-flex justify-content-around flex-wrap" id="cardContainer">
    <div class="card mt-3 mb-3 text-block" style="width: 20em;" id="23">
        <div class="card-body">
            <h5 class="card-title">More illustrations</h5>
            <p class="card-text">Your submission is well done, a few more illustrations would have improved its approachability, though.</p>
            <div class="card-footer bg-transparent border-primary">
                <div class="container-fluid d-flex justify-content-between">
                    <a href="#" class="btn btn-outline-primary" data-toggle="modal" data-target="#EditTextBlockModal" onclick="fillEditModal(this)">Open</a>
                    <a href="#" class="btn btn-outline-danger" onclick="removeBlock(this)">Remove</a>
                </div>
            </div>
            <div class="container">
                <small class="p-2" style="background-color: #66cdaa" data-category="0" data-performance="3"></small>
            </div>
        </div>
    </div>

    <div class="card mt-3 mb-3 text-block" style="width: 20em;" id="22">
        <div class="card-body">
            <h5 class="card-title">Something Else</h5>
            <p class="card-text">Lorem ipsum etc.</p>
            <div class="card-footer bg-transparent border-primary">
                <div class="container-fluid d-flex justify-content-between">
                    <a href="#" class="btn btn-outline-primary" data-toggle="modal" data-target="#EditTextBlockModal" onclick="fillEditModal(this)">Open</a>
                    <a href="#" class="btn btn-outline-danger" onclick="removeBlock(this)">Remove</a>
                </div>
            </div>
            <div class="container">
                <small class="p-2" style="background-color: #6F8CFF" data-category="1" data-performance="7"></small>
            </div>
        </div>
    </div>
</div>

<div class="modal" id="EditTextBlockModal" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Textblock Editor</h5>
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
                        <input id="editTextBlockTitle" type="text" class="form-control" placeholder="textblock title" aria-label="name of category" aria-describedby="textTitle0">
                    </div>

                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text" id="catColor0">Category Category</span>
                        </div>
                        <select id="editCategorySelect" size="1">
                            <option value="0">Language</option>
                            <option value="1">Management Summary</option>
                        </select>
                    </div>

                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text">Performance Level&nbsp;<span id="modalPerformanceValue">4</span></span>
                        </div>
                        <input type="range" min="1" max="10" value="5" class="slider" id="modalPerformanceSlider" oninput="modalPerformanceChange(this)">
                    </div>

                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text" id="catName1">Textblock Text</span>
                        </div>
                        <textarea id="editTextBlockText" class="form-control" rows="5" style="min-width: 100%"></textarea>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary">Save Entry</button>
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
</body>
<script type="text/javascript">document.getElementById("nav-textblocks-tab").classList.add("active")</script>
</html>