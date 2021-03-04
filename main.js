let clickLoop = false;
let currentCategories = [];
let currentPerformance = 3;
let performanceFilterActive = true;

function pageInit() {
    $( "#activeFeedbackItems" ).sortable();
    $( "#activeFeedbackItems" ).disableSelection();
    const assignmentID = 4; // FIXME For development only
    updateFeedbackOptions();
    getAssignmentData(assignmentID, "")
    $("#assignmentID").text(assignmentID);
    APIsend("getTextBlocks", null);
}

function updateFeedbackOptions(){
    let options = $("#passiveFeedbackItems").children();
    for(let option of options){
        option.hidden = !(currentCategories.includes(Number(option.getAttribute("data-category"))) &&
            (performanceFilterActive === false || currentPerformance === Number(option.getAttribute("data-performance"))));
    }
}

function filterSwitch(){
    performanceFilterActive = !!document.getElementById("tickFilter").checked;
    updateFeedbackOptions();
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

function passiveFeedbackClick(e) {
    console.log(e);
    document.getElementById("activeFeedbackItems").appendChild(e.parentNode);
    e.style = "color: Tomato;";
    e.setAttribute("onclick", "activeFeedbackClick(this)");
    for (let childElement of e.childNodes) {
        if (childElement.tagName === "I") {
            childElement.setAttribute("class", "fas fa-trash-alt");
        }
    }
}
function activeFeedbackClick(e) {
    console.log(e);
    document.getElementById("passiveFeedbackItems").appendChild(e.parentNode);
    e.setAttribute("onclick", "passiveFeedbackClick(this)");
    e.style = "color: forestgreen;";
    for(let childElement of e.childNodes){
        if (childElement.tagName === "I"){
            childElement.setAttribute("class", "fas fa-plus");
        }
    }
}

function getAssignmentData(aID, webserviceToken){
    let assignmentData = "{\n" +
        "        \"response\": {\n" +
        "            \"batch\": {\n" +
        "                \"totalpages\": 1,\n" +
        "                \"totalitems\": 1,\n" +
        "                \"page\": 1,\n" +
        "                \"perpage\": 100\n" +
        "            },\n" +
        "            \"grademodel\": {\n" +
        "                \"gradetype\": \"Value\",\n" +
        "                \"grademin\": 0,\n" +
        "                \"grademax\": 100,\n" +
        "                \"scalemenu\": []\n" +
        "            },\n" +
        "            \"submissions\":\n" +
        "            [\n" +
        "                {\n" +
        "                    \"studentid\": 4,\n" +
        "                    \"firstname\": \"Albert\",\n" +
        "                    \"lastname\": \"Einstein\",\n" +
        "                    \"email\": \"student1@sdas.com\",\n" +
        "                    \"status\": \"submitted\",\n" +
        "                    \"submissionid\": 2,\n" +
        "                    \"grade\": 76.599999999999994,\n" +
        "                    \"timesubmitted\": 1614079791,\n" +
        "                    \"timemarked\": 1613737171,\n" +
        "                    \"feedbackcomments\": \"Test123\",\n" +
        "                    \"files\":\n" +
        "                    [\n" +
        "                      \"https:\\/\\/z3learning.com\\/moodle\\/pluginfile.php?file=%2F50%2Fassignsubmission_file%2Fsubmission_files%2F2%2FLocal%20Feedback%20v2.postman_collection.json\"\n" +
        "                    ]\n" +
        "                }\n" +
        "            ]\n" +
        "        }\n" +
        "    }";
    setAssignmentData(JSON.parse(assignmentData).response);
    /*
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
            "data": "{\n  \"request\": {\n    \"assignid\": " + aID + "\n  }\n} "
        };
        $.ajax(settings).done(function (response) {
            setAssignmentData(JSON.parse(assignmentData).response);
        });
    */
}

function setAssignmentData(data){
    for (let c=0; c < data["submissions"].length; c++){
        let subEntry = document.createElement("a");
        subEntry.setAttribute("class", "list-group-item list-group-item-action");
        subEntry.setAttribute("id", "submission" + data["submissions"][c]["submissionid"]);
        subEntry.setAttribute("onclick", "submissionClick(" + data["submissions"][c]["submissionid"] + ")");
        if (data["submissions"][c]["status"] !== "submitted"){
            subEntry.innerHTML = "<i class=\"far fa-check-circle mr-2\" style=\"color: Forestgreen\"></i>" + data["submissions"][c]["firstname"] + " " + data["submissions"][c]["lastname"];
        }
        else{
            subEntry.innerHTML = "<i class=\"far fa-circle mr-2\" style=\"color: Tomato;\"></i>" + data["submissions"][c]["firstname"] + " " + data["submissions"][c]["lastname"];
        }
        document.getElementById("submissionList").appendChild(subEntry);
    }
    // <a id="sub1" class="list-group-item list-group-item-action"><i class="far fa-circle mr-2" style="color: Tomato;"></i>Troy Partridge<i class="fas fa-envelope-open-text ml-2"></i></a>
}

function submissionClick(submissionID){
    document.getElementById("activeFeedbackItems").innerHTML = "";
    getSubmissionData(submissionID);
}

function getSubmissionData(submissionID, webserviceToken){
    let submissionData = "{\n" +
        "  \"response\": {\n" +
        "    \"studentid\": 4,\n" +
        "    \"firstname\": \"Albert\",\n" +
        "    \"lastname\": \"Einstein\",\n" +
        "    \"email\": \"student1@sdas.com\",\n" +
        "    \"status\": \"submitted\",\n" +
        "    \"submissionid\": 2,\n" +
        "    \"grade\": 76.599999999999994,\n" +
        "    \"timesubmitted\": 1614079791,\n" +
        "    \"timemarked\": 1613737171,\n" +
        "    \"feedbackcomments\": \"Test123\",\n" +
        "    \"files\": [\n" +
        "      \"https:\\/\\/z3learning.com\\/moodle\\/pluginfile.php?file=%2F50%2Fassignsubmission_file%2Fsubmission_files%2F2%2FLocal%20Feedback%20v2.postman_collection.json\"\n" +
        "    ]\n" +
        "  }\n" +
        "}";
    /*
    const settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://z3learning.com/moodle/webservice/restful/server.php/webservice/restful/server.php/local_feedback_get_submission",
        "method": "POST",
        "headers": {
            "Content-Type": "application/json",
            "Authorization": webserviceToken,
            "HTTP_ACCEPT": "application/json",
            "HTTP_CONTENT_TYPE": "application/json",
            "Accept": "application/json"
        },
        "data": "{\n  \"request\": {\n    \"submissionid\": " + submissionID + "\n  }\n} "
    };
    $.ajax(settings).done(function (response) {
        setSubmissionData(JSON.parse(submissionData)["response"]);
    });
    */
    setSubmissionData(JSON.parse(submissionData)["response"]);
}

function setSubmissionData(submissionData){
    console.log(submissionData);
    document.getElementById("mainScreen").hidden = false;
    document.getElementById("studName").innerText = submissionData.firstname + " " + submissionData.lastname;
}

function getTextBlocksCallback(data, status){
    let d = JSON.parse(data);
    document.getElementById("passiveFeedbackItems").innerHTML = "";
    for (let c of d){
        let listItem = document.createElement("li");
        listItem.setAttribute("data-category", c.categoryID);
        listItem.setAttribute("data-performance", c.performance);
        listItem.setAttribute("class", "ui-state-default");
        listItem.innerHTML = "<span style=\"color: forestgreen;\"\n" + "onClick=\"passiveFeedbackClick(this)\"><i\n class=\"fas fa-plus mr-2\"></i></span><br><span class='textblocktext'>" + c.textblock + "</span>";
        document.getElementById("passiveFeedbackItems").appendChild(listItem);
        currentCategories.push(Number(c.categoryID));
    }
    currentCategories = currentCategories.filter((e, i) => currentCategories.indexOf(e) === i);
    updateFeedbackOptions();
}

function generateFeedbackText(){
    let feedbackText = "";
    for (let element in $("#activeFeedbackItems").children()){
        // TODO Look for elements containing text
        $(".textblocktext").each(function (index, object){
            if (feedbackText.length > 0){
                feedbackText += " " + $(this);
            }
            feedbackText += $(this);
        });
    }
    return feedbackText;
}