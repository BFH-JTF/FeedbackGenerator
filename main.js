let clickLoop = false;
let currentCategories = [];
let currentPerformance = 5;
let performanceFilterActive = true;

$(document).ready(function(){
    $('.sortable').sortable();
});

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

function updateFeedbackOptions(){
    let options = $("#passiveFeedbackItems")[0].children;
    for(let option of options){
        option.hidden = !(currentCategories.includes(Number(option.getAttribute("data-category"))) &&
            (performanceFilterActive === false || currentPerformance === Number(option.getAttribute("data-performance"))));
    }
}

function filterSwitch(){
    performanceFilterActive = !!document.getElementById("tickFilter").checked;
    updateCards();
}

function performanceChange(element){
    document.getElementById("performanceValue").innerHTML = element.value;
    currentPerformance = Number(element.value);
    updateFeedbackOptions();
}

function categoryFilterButtonClick(element){
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

function getAssignmentData(aID, webserviceToken){
    const settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://z3learning.com/moodle/webservice/restful/server.php/local_feedback_list_submissions",
        "method": "POST",
        "headers": {
            "Content-Type": "application/json",
            "Authorization": webserviceToken,
            "HTTP_ACCEPT": "application/json",
            "HTTP_CONTENT_TYPE": "application/json",
            "Accept": "application/json"
        },
        "processData": false,
        "data": "{\"request\": {\"assignid\": " + aID + "}}"
    };

    $.ajax(settings).done(function (response) {
        console.log(response);
    });
}