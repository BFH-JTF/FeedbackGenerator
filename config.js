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
    }
    $.post("api.php", {action: action, data: data}, callbackFunction);
}

function logout(){
    document.cookie = "FBG-ID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/fbg; domain=.smari.pantek.ch";
    document.cookie = "FBG-Token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/fbg; domain=.smari.pantek.ch";
    document.location.href = "https://smari.pantek.ch/fbg/index.php";
}