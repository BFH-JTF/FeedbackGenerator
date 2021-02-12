<?php
include_once "config.php";
if (!userAuthenticated()){
    header("Location: index.php");
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
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.js "></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
    <script type="text/javascript" src="config.js"></script>
    <script type="text/javascript" src="catlist.js"></script>
</head>
<body style="background-color: #fafafa;" onload="loadInitData()">
<?php include("navbar.html");?>

<div class=" container text-center mt-3 mb-3">
    <p class="h2">Your feedback categories</p>
    <button type="button" class="btn btn-success btn-sm" data-toggle="modal" data-target="#addCategoryModal">Add</button>
</div>

<div class="container d-flex justify-content-around flex-wrap" id="catCardContainer"></div>

<div class="modal" id="addCategoryModal" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">New Category</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="container d-flex justify-content-around flex-wrap" id="formContainer">
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text" id="catName0">Category Name</span>
                        </div>
                        <input id="addCategoryName" type="text" class="form-control" onkeyup="checkModalAddData()" placeholder="category name" aria-label="name of category" aria-describedby="catName0">
                    </div>

                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text" id="catColor0">Category Color</span>
                        </div>
                        <input id="addCategoryColor" type="color" class="form-control" aria-label="color of category" aria-describedby="catColor0">
                    </div>

                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text" id="catName1">Category Description</span>
                        </div>
                        <textarea id="addCategoryDesc" class="form-control" rows="5" style="min-width: 100%"></textarea>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" id="AddCategoryButton" class="btn btn-primary" data-dismiss="modal" onclick="addCategory()" disabled>Add Category</button>
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>

<div class="modal" id="editCategoryModal" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Category Editor</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="container d-flex justify-content-around flex-wrap" id="editFormContainer">
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text">Category Name</span>
                        </div>
                        <input id="editCategoryName" type="text" class="form-control" placeholder="category name" aria-label="name of category" aria-describedby="catName0" onkeydown="checkModalAddData()">
                    </div>

                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text">Category Color</span>
                        </div>
                        <input id="editCategoryColor" type="color" class="form-control" aria-label="color of category" aria-describedby="catColor0">
                    </div>

                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text">Category Description</span>
                        </div>
                        <textarea id="editCategoryDesc" class="form-control" rows="5" style="min-width: 100%"></textarea>
                    </div>
                    <input type="hidden" id="editID">
                </div>
            </div>
            <div class="modal-footer">
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" data-dismiss="modal" onclick="saveCategory()">Save Entry</button>
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>
</body>
<script type="text/javascript">document.getElementById("nav-categories-tab").classList.add("active")</script>
</html>