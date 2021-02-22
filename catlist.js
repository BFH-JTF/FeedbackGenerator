function removeCategory(e){
    if(confirm("Are you sure you would like to remove this category?")){
        APIsend("removeCategory", e.parentNode.parentNode.parentNode.parentNode.dataset.id);
        e.parentNode.parentNode.parentNode.parentNode.remove();
    }
}

function fillEditModal(e){
    let cardTitleNode = $(e.parentNode.parentNode.parentNode).find(".card-title")[0];
    let cardTextNode = $(e.parentNode.parentNode.parentNode).find(".card-text")[0];
    let cardMain = cardTextNode.parentNode.parentNode;
    document.getElementById("editCategoryName").value = cardTitleNode.innerText;
    document.getElementById("editCategoryColor").value = rgb2hex(cardTitleNode.style.backgroundColor);
    document.getElementById("editCategoryDesc").innerText = cardTextNode.innerText;
    document.getElementById("editID").value = cardMain.dataset.id;
}

function rgb2hex(rgb) {
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

function hex2rgb(hex) {
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function hex(x) {
    let hexDigits = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"];
    return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
}

function addCategory(){
    let data = {};
    data["name"] = document.getElementById("addCategoryName").value;
    data["color"] = document.getElementById("addCategoryColor").value;
    data["desc"] = document.getElementById("addCategoryDesc").value;
    APIsend("addCategory", JSON.stringify(data));
}

function loadInitData(){
    APIsend("getCategories", null);
}

function saveCategory(){
    let data = {};
    data["name"] = document.getElementById("editCategoryName").value;
    data["color"] = document.getElementById("editCategoryColor").value;
    data["desc"] = document.getElementById("editCategoryDesc").value;
    data["id"] = document.getElementById("editID").value;
    APIsend("saveCategory", JSON.stringify(data));
}

function addCategoryTile(data) {
    // TODO Remove proxy call if no further functionality is added
    createCategoryTile(data["categoryID"], data["name"], data["color"], data["desc"]);
}

function createCategoryTile(newID, catName, catColor, catDesc){
    let parentElement = document.getElementById("catCardContainer");
    let cardMain = document.createElement("div",);
    cardMain.setAttribute("class", "card mt-3 mb-3");
    cardMain.setAttribute("style", "width: 20em;");
    cardMain.setAttribute("data-type", "categoryCard");
    cardMain.setAttribute("data-id", newID);

    let cardBody = document.createElement("div",);
    cardBody.setAttribute("class", "card-body");

    let cardTitle = document.createElement("h5");
    cardTitle.setAttribute("class", "card-title");
    cardTitle.setAttribute("style", "background-color:" + catColor);
    cardTitle.innerText = catName;

    let cardText = document.createElement("p");
    cardText.setAttribute("class", "card-text");
    cardText.innerText = catDesc;

    let cardFooter = document.createElement("div");
    cardFooter.setAttribute("class", "card-footer bg-transparent border-primary");

    let linkContainer = document.createElement("div");
    linkContainer.setAttribute("class", "container-fluid d-flex justify-content-between");

    let openLink = document.createElement("a");
    openLink.setAttribute("href", "#");
    openLink.setAttribute("class", "btn btn-outline-primary");
    openLink.setAttribute("data-toggle", "modal");
    openLink.setAttribute("data-target", "#editCategoryModal");
    openLink.setAttribute("onClick", "fillEditModal(this)");
    openLink.innerText = "Open";

    let closeLink = document.createElement("a");
    closeLink.setAttribute("href", "#");
    closeLink.setAttribute("class", "btn btn-outline-danger");
    closeLink.setAttribute("onClick", "removeCategory(this)");
    closeLink.innerText = "Remove";

    parentElement.appendChild(cardMain);
    cardMain.appendChild(cardBody);
    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardText);
    cardBody.appendChild(cardFooter);
    cardFooter.appendChild(linkContainer);
    linkContainer.appendChild(openLink);
    linkContainer.appendChild(closeLink);
}

function setCategoryTile(data) {
    let element = document.querySelector("[data-id='"+ data["id"] + "']");
    let cardTextNode = element.find(".card-text")[0];
    let cardTitleNode = element.find(".card-title")[0];
    let cardMain = cardTextNode.parentNode.parentNode;

    cardTitleNode.innerText = data["title"];

    cardTitleNode.style.backgroundColor = hex2rgb(document.getElementById("editCategoryColor").value);
    cardTextNode.innerText =document.getElementById("editCategoryDesc").innerText;
    cardMain.setAttribute("data-id", document.getElementById("editID").value);
}

function checkModalAddData(){
    document.getElementById("AddCategoryButton").disabled = document.getElementById("addCategoryName").value.length <= 0;
}

function addCategoryCallback(data, status){
    if (data === -1){
        alert("Could not save category in database");
    }
    else{
        addCategoryTile(JSON.parse(data));
    }
}

function saveCategoryCallback(data, status){
    let d = JSON.parse(data);
    let element = document.querySelector('[data-id="' + d.id +'"]');
    let cardTitle = element.getElementsByClassName("card-title")[0];
    cardTitle.innerText = d.name;
    cardTitle.style.backgroundColor = d.color;
    element.getElementsByClassName("card-text")[0].innerText = d.desc;
}

function getCategoriesCallback(data, status){
    let d = JSON.parse(data);
    for (let c of d){
        addCategoryTile(c);
    }
}