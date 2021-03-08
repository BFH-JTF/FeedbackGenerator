let currentCategories = [];
let currentPerformance = 3;
let performanceFilterActive = false;

function pageLoaded(){
    APIsend("getTextBlocks", null);
}

function categoryButtonClick(element){
    if (element.getAttribute("data-status") === "enabled"){
        // Disable category nodes
        let index = currentCategories.indexOf(Number(element.getAttribute("data-category")));
        if (index > -1) {
            currentCategories.splice(index, 1);
        }
        element.setAttribute("data-status", "disabled");
        element.setAttribute("class", "btn btn-outline-secondary");
        element.setAttribute("style", "");
    }
    else{
        // Enable category nodes
        currentCategories.push(Number(element.getAttribute("data-category")));
        element.setAttribute("data-status", "enabled");
        element.setAttribute("class", "btn btn-outline-light m-1");
        element.setAttribute("style", "background-color: " + element.getAttribute("data-color"));
    }
    updateCards();
}

function updateCards(){
    let cards = $("#cardContainer")[0].children;
    for(let card of cards){
        let smallNode = $(card).find("small")[0];
        smallNode.innerText = smallNode.getAttribute("data-performance");
        let test = Number(smallNode.getAttribute("data-category"));
        card.hidden = !((currentCategories.includes(test) || currentCategories.length === 0) &&
            (performanceFilterActive === false || currentPerformance === Number(smallNode.getAttribute("data-performance"))));
    }
}

function performanceChange(element){
    document.getElementById("performanceValue").innerHTML = element.value;
    currentPerformance = Number(element.value);
    updateCards();
}

function modalPerformanceChange(element){
    document.getElementById("modalPerformanceValue").innerHTML = element.value;
}

function filterSwitch(){
    performanceFilterActive = !!document.getElementById("tickFilter").checked;
    updateCards();
}

function addBlock(){
    let data = {
        title: document.getElementById("TextBlockModalTitle").value,
        performance: document.getElementById("TextBlockModalPerformanceSlider").value,
        category: document.getElementById("TextBlockModalCategorySelect").value,
        textBlock: document.getElementById("TextBlockModalText").value,
    }
    APIsend("addTextBlock", JSON.stringify(data));
}

function removeBlock(e){
    if(confirm("Are you sure you would like to remove this text block?")){
        let id = e.parentNode.parentNode.parentNode.parentNode.dataset.id;
        APIsend("removeTextBlock", id);
        e.parentNode.parentNode.parentNode.parentNode.remove();
    }
}

function saveBlock(){
    let data = {
        textBlock: document.getElementById("TextBlockModalText").value,
        title: document.getElementById("TextBlockModalTitle").value,
        categoryID: document.getElementById("TextBlockModalCategorySelect").value,
        performance: document.getElementById("TextBlockModalPerformanceSlider").value,
        textBlockID: document.getElementById("TextBlockModalID").value
    }
    APIsend("saveTextBlock", JSON.stringify(data));
}

function fillTextBlockModal(e){
    if (e === null){
        document.getElementById("TextBlockModalHeading").innerText = "New Textblock"
        document.getElementById("TextBlockModalNewButton").innerText = "Create Textblock"
        document.getElementById("TextBlockModalTitle").value = "";
        document.getElementById("TextBlockModalPerformanceSlider").value = 5;
        document.getElementById("TextBlockModalText").innerText = "";
        document.getElementById("TextBlockModalNewButton").setAttribute("onclick", "addBlock()");
    }
    else {
        document.getElementById("TextBlockModalHeading").innerText = "Edit Textblock";
        document.getElementById("TextBlockModalNewButton").innerText = "Save Textblock";
        document.getElementById("TextBlockModalNewButton").setAttribute("onclick", "saveBlock()");
        document.getElementById("TextBlockModalNewButton").disabled = false;

        let cardTitleNode = $(e.parentNode.parentNode.parentNode).find(".card-title")[0];
        let cardTextNode = $(e.parentNode.parentNode.parentNode).find(".card-text")[0];
        let smallNode = $(e.parentNode.parentNode.parentNode).find("small")[0];
        document.getElementById("TextBlockModalTitle").value = cardTitleNode.innerText;
        document.getElementById("TextBlockModalPerformanceSlider").value = Number(smallNode.innerText);
        modalPerformanceChange(document.getElementById("TextBlockModalPerformanceSlider"));
        document.getElementById("TextBlockModalText").innerText = cardTextNode.innerText;
        $('#TextBlockModalCategorySelect').val(smallNode.getAttribute("data-category"));
        $("#TextBlockModalID").val(smallNode.getAttribute("data-id"))
    }
}

function addTextBlockTile(data) {
    let parentElement = document.getElementById("cardContainer");
    let cardMain = document.createElement("div",);
    let id = data.blockID;
    cardMain.setAttribute("class", "card mt-3 mb-3");
    cardMain.setAttribute("style", "width: 20em;");
    cardMain.setAttribute("data-type", "categoryCard");
    cardMain.setAttribute("data-id", data.blockID);
    parentElement.appendChild(cardMain);
    cardMain.innerHTML="<div class=\"card-body\">\n" +
        "<h5 class=\"card-title\">" + data.title + "</h5>\n" +
        "<p class=\"card-text\">" + data.textblock + "</p>\n" +
        "<div class=\"card-footer bg-transparent border-primary\">\n" +
        "<div class=\"container-fluid d-flex justify-content-between\">\n" +
        "<a href=\"#\" class=\"btn btn-outline-primary\" data-toggle=\"modal\" data-target=\"#TextBlockModal\" onclick=\"fillTextBlockModal(this)\">Open</a>\n" +
        "<a href=\"#\" class=\"btn btn-outline-danger\" onclick=\"removeBlock(this)\">Remove</a>\n" +
        "</div>\n" +
        "</div>\n" +
        "<div class=\"container\">\n" +
        "<small class=\"p-2\" style=\"background-color: " + data.color + "\" data-category=\"" + data.categoryID + "\" data-performance=\"" + data.performance + "\" data-id=\"" + id + "\">" + data.blockID + "</small>\n" +
        "</div>\n" +
        "</div>";
    updateCards();
}

function getTextBlocksCallback(data, status){
    let d = JSON.parse(data);
    for (let c of d){
        addTextBlockTile(c);
    }
    updateCards();
}

function addTextBlockCallback(data, status){
    if (data === -1){
        alert("Could not save text block in database");
    }
    else{
        addTextBlockTile(JSON.parse(data));
    }
}

function saveTextBlockCallback(data, status){
    let d = JSON.parse(data);
    let element = document.querySelector('[data-id="' + d.textBlockID +'"]');
    let cardTitle = element.getElementsByClassName("card-title")[0];
    cardTitle.innerText = d.title;
    element.getElementsByClassName("card-text")[0].innerText = d.textBlock;
    element.getElementsByTagName("small")[0].style.backgroundColor = d.color;
    element.getElementsByTagName("small")[0].innerText = d.performance;

}

function checkModalAddData(){
    document.getElementById("TextBlockModalNewButton").disabled = document.getElementById("TextBlockModalTitle").value.length <= 0;
}