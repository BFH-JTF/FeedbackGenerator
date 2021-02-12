let currentCategories = [];
let currentPerformance = 5;
let performanceFilterActive = true;

function pageLoaded(){
    // Load data
    let categoryArray = [
        {id: 0, name: "Language"},
        {id: 1, name: "Management Summary"}
    ];

    for (let i=0; i<categoryArray.length ; i++){
        currentCategories.push(categoryArray[i].id);
    }

    updateCards();
}

function categoryButtonClick(element){
    if (element.getAttribute("data-status") === "enabled"){
        // Disable category nodes
        let index = currentCategories.indexOf(Number(element.getAttribute("data-category")));
        currentCategories.splice(index, 1);
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
        if(currentCategories.includes(Number(smallNode.getAttribute("data-category"))) &&
            (performanceFilterActive === false || currentPerformance === Number(smallNode.getAttribute("data-performance")))){
            smallNode.parentNode.parentNode.parentNode.hidden = false;
        }
        else {
            smallNode.parentNode.parentNode.parentNode.hidden = true;
        }
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

function addBlock(title, text, performance, categoryId){

}

function removeBlock(e){
    if(confirm("Are you sure you would like to remove this text block?")){
        e.parentNode.parentNode.parentNode.parentNode.remove();
    }
}

function fillEditModal(e){
    let cardTitleNode = $(e.parentNode.parentNode.parentNode).find(".card-title")[0];
    let cardTextNode = $(e.parentNode.parentNode.parentNode).find(".card-text")[0];
    let smallNode = $(e.parentNode.parentNode.parentNode).find("small")[0];
    // Set title
    document.getElementById("editTextBlockTitle").value = cardTitleNode.innerText;
    // Set performance
    document.getElementById("modalPerformanceSlider").value = Number(smallNode.innerText);
    modalPerformanceChange(document.getElementById("modalPerformanceSlider"));
    // Set text
    document.getElementById("editTextBlockText").innerText = cardTextNode.innerText;
    // Set category
    $('#editCategorySelect').val(smallNode.getAttribute("data-category"));
}
