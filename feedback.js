let clickLoop = false;
let currentCategories = [];
let currentPerformance = 5;
let performanceFilterActive = true;

function pageInit() {
    let sortable = Sortable.create(document.getElementById("activeFeedbackItems"));
    let categoryArray = [
        {id: 0, name: "Language"},
        {id: 1, name: "Management Summary"}
    ];

    for (let i=0; i<categoryArray.length ; i++){
        currentCategories.push(categoryArray[i].id);
    }
    updateFeedbackOptions();
}

function performanceChange(element){
    document.getElementById("performanceValue").innerHTML = element.value;
    currentPerformance = Number(element.value);
    updateFeedbackOptions();
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
    updateFeedbackOptions();
}

function updateFeedbackOptions(){
    let options = $("#passiveFeedbackItems")[0].children;
    for(let option of options){
        if(currentCategories.includes(Number(option.getAttribute("data-category"))) &&
            (performanceFilterActive === false || currentPerformance === Number(option.getAttribute("data-performance")))){
            option.hidden = false;
        }
        else {
            option.hidden = true;
        }
    }
}

function filterSwitch(){
    performanceFilterActive = !!document.getElementById("tickFilter").checked;
    updateCards();
}


function passiveFeedbackClick(e){
    if (clickLoop){
        clickLoop = false;
    }
    else {
        document.getElementById("activeFeedbackItems").appendChild(e);
        e.onclick = null;
        for (let childElement of e.childNodes) {
            if (childElement.tagName === "SPAN") {
                childElement.style = "color: Tomato;";
                childElement.setAttribute("onclick", "activeFeedbackClick(this)");
                for (let grandChildElement of childElement.childNodes) {
                    if (grandChildElement.tagName === "I") {
                        grandChildElement.setAttribute("class", "fas fa-trash-alt");
                    }
                }
            }
        }
    }
}

function activeFeedbackClick(e){
    document.getElementById("passiveFeedbackItems").appendChild(e.parentNode);
    e.parentNode.setAttribute("onclick", "passiveFeedbackClick(this)");
    clickLoop = true;
    e.style = "color: forestgreen;";
    e.onclick = null;
    for(let childElement of e.childNodes){
        if (childElement.tagName === "I"){
            childElement.setAttribute("class", "fas fa-plus");
        }
    }
}