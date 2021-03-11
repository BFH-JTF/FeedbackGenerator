let currentCategories = [];
let currentPerformance = 3;
let performanceFilterActive = false;
let submissionDataRecord = {};
const wstoken = "e79194eefde7be3e324203166576fc66";

function pageInit() {
    $( "#activeFeedbackItems" ).sortable();
    $( "#activeFeedbackItems" ).disableSelection();
    updateFeedbackOptions();
    getAssignmentData(assignmentID, wstoken)
    $("#assignmentID").text(assignmentID);
    APIsend("getTextBlocks", null);
}

function updateFeedbackOptions(){
    let options = $("#passiveFeedbackItems").children();
    for(let option of options){
        option.hidden = !((currentCategories.includes(Number(option.getAttribute("data-category"))) || currentCategories.length === 0) &&
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
    APIsend("getAssignmentData", "{\"assignid\": \""+aID+"\", \"wstoken\": \""+webserviceToken+"\"}");
    $("#loadSpinner").show();
}

function setAssignmentData(data){
    console.log(data["submissions"]);
    for (let c=0; c < data["submissions"].length; c++){
        let subEntry = document.createElement("a");
        subEntry.setAttribute("class", "list-group-item list-group-item-action");
        subEntry.setAttribute("id", "submission" + data["submissions"][c]["submissionid"]);
        subEntry.setAttribute("onclick", "submissionClick(this, " + data["submissions"][c]["submissionid"] + ")");
        if (data["submissions"][c]["status"] === "graded"){
            subEntry.innerHTML = "<i class=\"far fa-check-circle mr-2\" style=\"color: Forestgreen\"></i>" + data["submissions"][c]["firstname"] + " " + data["submissions"][c]["lastname"];
        }
        else{
            subEntry.innerHTML = "<i class=\"far fa-circle mr-2\" style=\"color: Tomato;\"></i>" + data["submissions"][c]["firstname"] + " " + data["submissions"][c]["lastname"];
        }
        document.getElementById("submissionList").appendChild(subEntry);
    }
    submissionData = data.submissions;
}

function submissionClick(element, submissionID){
    $("#activeFeedbackItems").children().each(function () {
        $(this).children("span.clickField").each(function (){
            activeFeedbackClick($(this)[0]);
        });
    })
    $("#submissionList").children().each(function() {
       $(this).css("background-color", "");
    });
    element.style.backgroundColor = "#8888"
    getSubmissionData(submissionID, wstoken);
}

function getSubmissionData(submissionID, webserviceToken){
    APIsend("getSubmissionData", "{\"submissionid\": \""+submissionID+"\", \"wstoken\": \""+webserviceToken+"\"}");
    $("#loadSpinner").show();
}

function setSubmissionData(submissionData){
    console.log(submissionData);
    submissionDataRecord = submissionData;
    $("#finaltext").val(submissionData.feedbackcomments);
    $("#grade").val(submissionData.grade);
    let date = new Date(submissionData.timesubmitted*1000);
    $("#submissionTimeString").text(date.getDate()+"."+(date.getMonth()+1)+"."+date.getFullYear()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds());
    document.getElementById("mainScreen").hidden = false;
    document.getElementById("currentScreen").hidden = false;
    document.getElementById("studName").innerText = submissionData.firstname + " " + submissionData.lastname;
    let linkString = "";
    if (submissionData.files.length > 0) {
        for (let file of submissionData.files) {
            linkString += "<a target='_blank' href='" + file + "'><i class=\"fas fa-envelope-open-text ml-1 mr-1\" data-toggle=\"tooltip\" title=\"Open " + file + "\"></i></a>";
        }
        $("#attachments").html(linkString);
    }
    else{
        $("#attachments").html("no files submitted");
    }
}

function getAssignmentDataCallback(data, status){
    $("#loadSpinner").hide();
    let d = JSON.parse(data).response;
     if ("exception" in d){
         alert(data);
     }
     else{
         setAssignmentData(d);
     }
}

function getSubmissionDataCallback(data, status){
    $("#loadSpinner").hide();
    let d = JSON.parse(data).response;
    if ("exception" in d){
        alert(data);
    }
    else{
        setSubmissionData(d);
    }
}

function getTextBlocksCallback(data, status){
    let d = JSON.parse(data);
    document.getElementById("passiveFeedbackItems").innerHTML = "";
    for (let c of d){
        let listItem = document.createElement("li");
        listItem.setAttribute("data-category", c.categoryID);
        listItem.setAttribute("data-performance", c.performance);
        listItem.setAttribute("class", "ui-state-default overflow-hidden");
        listItem.innerHTML = "<span class='clickField' style=\"color: forestgreen;\"\n" + "onClick=\"passiveFeedbackClick(this)\"><i\n class=\"fas fa-plus mr-2\"></i></span><br><span class='textblocktitle'>" + c.title + "</span><br><span class='textblocktext'>" + c.textblock + "</span>";
        document.getElementById("passiveFeedbackItems").appendChild(listItem);
    }
    updateFeedbackOptions();
}

function generateFeedbackText(){
    let feedbackText = "";
    $('#activeFeedbackItems').children().each(function () {
        $(this).children("span.textblocktext").each(function ()
        {
            if (feedbackText.length > 0) {
                feedbackText += " ";
            }
            feedbackText += $(this).text();
        });
    });
    feedbackText = feedbackText.replace("[FIRSTNAME]", submissionDataRecord.firstname);
    feedbackText = feedbackText.replace("[LASTNAME]", submissionDataRecord.lastname);
    $("#finaltext").val(feedbackText);
}

function saveMoodle(){
    APIsend("giveFeedback", "{" +
        "\"submissionid\": \""+ submissionDataRecord.submissionid +"\"," +
        "\"grade\": \"" + $("#grade").val() + "\"," +
        "\"feedback\": \"" + $("#finaltext").val() + "\"," +
        "\"wstoken\": \""+wstoken+"\"" +
        "}");
}

function giveFeedbackCallback(data, status){
    let d = JSON.parse(data);
    if (d.response){
        alert("Successfully saved to Moodle");
    }
    else{
        alert("Error while saving to Moodle:\n" + data);
    }
}