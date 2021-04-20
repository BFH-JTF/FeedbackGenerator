function APIsend(action, data){
    let callbackFunction;
    switch (action){
        case "addCategory":
            callbackFunction = addCategoryCallback;
            break;

        case "saveCategory":
            callbackFunction = saveCategoryCallback;
            break;

        case "getCategories":
            callbackFunction = getCategoriesCallback;
            break;

        case "removeCategory":
            callbackFunction = null;
            break

        case "addTextBlock":
            callbackFunction = addTextBlockCallback;
            break;

        case "getTextBlocks":
            callbackFunction = getTextBlocksCallback;
            break;

        case "saveTextBlock":
            callbackFunction = saveTextBlockCallback;
            break;

        case "getAssignmentData":
            callbackFunction = getAssignmentDataCallback;
            break;

        case "getSubmissionData":
            callbackFunction = getSubmissionDataCallback
            break;

        case "giveFeedback":
            callbackFunction = giveFeedbackCallback;
            break;

        case "getLocal":
            callbackFunction = getLocalCallback;
            break;

        case "generateOverview":
            callbackFunction = generateOverviewCallback;
            break;

        default:
            callbackFunction = undefined;
    }
    $.post("api.php", {action: action, data: data}, callbackFunction);
}
