let currentCategories = [];
let currentPerformance = 3;
let performanceFilterActive = false;
let submissionDataRecord = {};
let gradeMax;
let gradeMin;
const wstoken = "ee52935ffe6b9c9c7e2bce047891b1c3";

function pageInit() {
    $("#submissionList").html("");
    $("#activeFeedbackItems" ).sortable();
    $("#activeFeedbackItems" ).disableSelection();
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
    let cNoFeedback = 0;
    let cUnsavedInput = 0;
    let cMoodleMatch = 0;
    let submissionList = document.getElementById("submissionList");
    for (let c=0; c < data["submissions"].length; c++){
        let subEntry = document.createElement("a");
        subEntry.setAttribute("class", "list-group-item list-group-item-action");
        subEntry.setAttribute("id", "submission" + data["submissions"][c]["submissionid"]);
        subEntry.setAttribute("onclick", "submissionClick(this, " + data["submissions"][c]["submissionid"] + ")");
        if (data["submissions"][c]["feedbackcomments"] === "" || data["submissions"][c]["feedbackcomments"] === null){
            // No feedback saved in Moodle
            if (data["submissions"][c]["localFeedback"] === "") {
                subEntry.innerHTML = "<i class=\"fas fa-circle mr-2\" style=\"color: Tomato;\"></i><span class='sortname'>" + data["submissions"][c]["lastname"] + " " + data["submissions"][c]["firstname"] + "</span>";
                cNoFeedback++;
            }
            else{
                subEntry.innerHTML = "<i class=\"far fa-circle mr-2\" style=\"color: #4775ff;\"></i><span class='sortname'>" + data["submissions"][c]["lastname"] + " " + data["submissions"][c]["firstname"] + "</span>";
                cUnsavedInput++;
            }
        }
        else if (data["submissions"][c]["feedbackcomments"] === data["submissions"][c]["localFeedback"] &&
                String(data["submissions"][c]["grade"]) === String(data["submissions"][c]["localGrade"])){
            // Feedback on Moodle matches local feedback
            subEntry.innerHTML = "<i class=\"far fa-check-circle mr-2\" style=\"color: Forestgreen\"></i>" + data["submissions"][c]["lastname"] + " " + data["submissions"][c]["firstname"];
            cMoodleMatch++;
        }
        else{
            // Unsaved feedback in FBG
            subEntry.innerHTML = "<i class=\"far fa-circle mr-2\" style=\"color: #4775ff;\"></i><span class='sortname'>" + data["submissions"][c]["lastname"] + " " + data["submissions"][c]["firstname"] + "</span>";
            cUnsavedInput++;
        }
        submissionList.appendChild(subEntry);
    }
    $("#cNoFeedback").text(cNoFeedback.toString());
    $("#cUnsavedFeedback").text(cUnsavedInput.toString());
    $("#cMoodleMatch").text(cMoodleMatch.toString());

    tinysort(submissionList.childNodes);
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
    getLocal(submissionID);
    window.scrollTo(0, 0);
}

function getSubmissionData(submissionID, webserviceToken){
    APIsend("getSubmissionData", "{\"submissionid\": \""+submissionID+"\", \"wstoken\": \""+webserviceToken+"\"}");
    $("#loadSpinner").show();
}

function setSubmissionData(submissionData){
    submissionDataRecord = submissionData;
    if ("exception" in submissionData){
        alert(submissionData);
    }
    else{
        $("#moodletext").val(submissionData.feedbackcomments);
        $("#moodle_grade").val(submissionData.grade);
        $("#status").val(submissionData.status);
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
}

function getAssignmentDataCallback(data, status){
    $("#loadSpinner").hide();
    let d = JSON.parse(data).response;
    let e = JSON.parse(data);
     if ("exception" in e){
         alert(data);
     }
     else{
         setAssignmentData(d);
         gradeMax = String(d.grademodel.grademax);
         gradeMin = String(d.grademodel.grademin);
         $(".gradescheme").text("(" + gradeMin + " - " + gradeMax + ")");
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
        listItem.innerHTML = "<span class='clickField' style=\"color: forestgreen;\" onClick=\"passiveFeedbackClick(this)\">" +
            "<span class='textblocktitle'>" + c.title + "</span><br>" +
            "<span class='textblocktext'>" + c.textblock + "</span>" +
            "<i\n class=\"fas fa-plus mr-2\"></i></span><br>";
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
    saveLocal();
}

function save2Moodle(){
    let rows = $("#tableContainer").find(".row");
    let err = 0;
    for (let row of rows){
        if ($(row).data("grade") !== "" && $(row).data("feedback") !== "") {
            APIsend("giveFeedback", "{" +
                "\"submissionid\": \"" + ($(row).data("submissionid")) + "\"," +
                "\"grade\": \"" + $(row).data("grade") + "\"," +
                "\"feedback\": \"" + $(row).data("feedback") + "\"," +
                "\"wstoken\": \"" + wstoken + "\"" +
                "}");
        }
        else{
            err++;
        }
    }
    if (err > 0){
        alert(err + " feedback(s) not saved due to missing values.")
    }
    setTimeout(function (){pageInit()}, 500);
}

function saveLocal(){
    APIsend("saveLocal", "{" +
        "\"submissionid\": \""+ submissionDataRecord.submissionid +"\"," +
        "\"grade\": \"" + $("#grade").val() + "\"," +
        "\"feedback\": \"" + $("#finaltext").val() + "\"" +
        "}");
    submissionDataRecord.submissionid.localGrade = $("#grade").val();
    submissionDataRecord.submissionid.localFeedback = $("#finaltext").val();
    if ($("#finaltext").val() === ($("#moodletext").val()) && $("#grade").val() === ($("#moodle_grade").val()) && $("#moodletext").val() !== ""){
        $("#submission" + submissionDataRecord.submissionid).html("<i class=\"far fa-check-circle mr-2\" style=\"color: Forestgreen\"></i><span class='sortname'>" + submissionDataRecord.lastname + " " + submissionDataRecord.firstname + "</span>");
    }
    else if($("#finaltext").val() !== ($("#moodletext").val()) || $("#grade").val() !== ($("#moodle_grade").val())){
        $("#submission" + submissionDataRecord.submissionid).html("<i class=\"far fa-circle mr-2\" style=\"color: #4775ff;\"></i><span class='sortname'>" + submissionDataRecord.lastname + " " + submissionDataRecord.firstname + "</span>");
    }
    else{
        $("#submission" + submissionDataRecord.submissionid).html("<i class=\"fas fa-circle mr-2\" style=\"color: Tomato;\"></i><span class='sortname'>" + submissionDataRecord.lastname + " " + submissionDataRecord.firstname + "</span>");
    }
    updateCounters();
    checkMandatoryFields();
}

function getLocal(id){
    APIsend("getLocal", "{\"submissionid\": \""+ id +"\"}");
}

function getLocalCallback(data, status){
    let d = JSON.parse(data);
    if ("error" in d){
        $("#finaltext").text("");
        $("#grade").val("");
    } else {
        $("#finaltext").text(d[0].feedback);
        $("#grade").val(d[0].grade);
    }
    checkMandatoryFields();
}

function giveFeedbackCallback(data, status){
    let d = JSON.parse(data);
    if (!d.response){
        alert("Error while saving to Moodle:\n" + data);
    }
}

function generateOverview() {
    let submissions = [];
    let elementArray = $("#submissionList").find(".far.fa-circle").get();
    for (let element of elementArray) {
        let main = element.parentNode;
        let name = $(main).find(".sortname")[0].innerText;
        let submissionid = main.id.slice(10, main.id.length);
        submissions.push({submissionid: submissionid, name: name});
    }
    APIsend("generateOverview", JSON.stringify(submissions));
}

function generateOverviewCallback(data, status){
    let d = JSON.parse(data);
    let string = "";
    for (let sub of d){
        let shownFeedback, shownGrade, shownName, feedbackClass, gradeClass;
        if (sub.feedback === ""){
            shownFeedback = "<mark>N/A</mark>";
            feedbackClass = "text-danger";
            shownName = "<del>"+ sub.name +"</del>"
        }
        else{
            shownFeedback = sub.feedback.slice(0, 50);
            feedbackClass = "";
            shownName = sub.name;
        }
        if (sub.grade === ""){
            shownGrade = "<mark>N/A</mark>";
            gradeClass = "text-danger";
            shownName = "<del>"+ sub.name +"</del>"
        }
        else{
            shownGrade = sub.grade;
            gradeClass = "";
            shownName = sub.name;
        }
        string += "<div class=\"row\" style=\"font-size: 0.8em\" data-submissionid='" + sub.submissionid + "' data-grade='" + sub.grade + "' data-feedback='" + sub.feedback + "'>\n" +
            "<div class=\"col-sm-3\">" + shownName + "</div>\n" +
            "<div class=\"col-sm-8 "+ feedbackClass +"\">" + shownFeedback + "</div>\n" +
            "<div class=\"col-sm-1 "+ gradeClass + "\">" + shownGrade + "</div>\n" +
            "</div>";
    }
    $("#tableContainer").html(string);
}

function updateCounters(){
    let reds = $("#submissionList").find(".fas.fa-circle");
    let blues = $("#submissionList").find(".far.fa-circle");
    let greens = $("#submissionList").find(".far.fa-check-circle");
    $("#cNoFeedback").text(reds.length);
    $("#cUnsavedFeedback").text(blues.length);
    $("#cMoodleMatch").text(greens.length);
}

function copyMoodle2Local(){
    $("#finaltext").val($("#moodletext").val());
    saveLocal();
}

function checkMandatoryFields(){
    // TODO Input fields colored unreliably
    return;
    let jGrade = $("#grade");
    let jFeedback = $("#finaltext");
    if (jGrade.val() === ""){
        jGrade.css("background-color","red");
    }
    else{
        jGrade.css("background-color","white");
    }

    if (jFeedback.text() === ""){
        jFeedback.css("background-color","red");
    }
    else{
        jFeedback.css("background-color","white");
    }
}