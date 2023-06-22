var baseUrl = "http://api.login2explore.com:5577"
var imlEnd = "/api/iml"
var irlEnd = "/api/irl"

var token = "90933116|-31949318629178581|90951248"
var dbName = "SCHOOL-DB"
var relName = "STUDENT-TABLE"

var currentRecNo = ''
$("#rollno").focus();

function validation(){
    if($("#rollno").val() === ""){
        alert("Please enter roll number");
        $("#rollno").focus();
        return false;
    }
    else if($("#fullname").val() === ""){
        alert("Please enter full name");
        $("#fullname").focus();
        return false;
    }
    else if($("#_class").val() === ""){
        alert("Please enter class");
        $("#_class").focus();
        return false;
    }
    else if($("#dob").val() === ""){
        alert("Please enter date of birth");
        $("#dob").focus();
        return false;
    }
    else if($("#address").val() === ""){
        alert("Please enter address");
        $("#address").focus();
        return false;
    }
    else if($("#enrolldate").val() === ""){
        alert("Please enter enroll date");
        $("#enrolldate").focus();
        return false;
    }
    else{
        return true;
    }

}

function saveData(){
    if(!validation()){
        return;
    }
   var roll = $("#rollno").val();
    var fullname = $("#fullname").val();
    var _class = $("#_class").val();
    var dob = $("#dob").val();
    var address = $("#address").val();
    var enrolldate = $("#enrolldate").val();
    var jsonObjStr = {
        "rollno": roll,
        "fullName": fullname,
        "class": _class,
        "dob": dob,
        "address": address,
        "enrollDate": enrolldate
    }
    jsonObjStr = JSON.stringify(jsonObjStr);
    var putRequ = createPUTRequest(token, jsonObjStr, dbName, relName);
    jQuery.ajaxSetup({async:false});
    var result = executeCommandAtGivenBaseUrl(putRequ, baseUrl, imlEnd);
    jQuery.ajaxSetup({async:true});
    if(result.status === 400){
        alert("Error: " + result.body);
    }
    else if(result.status === 200){
        alert("Data saved successfully");
        resetData();
    }
}

function changeData(){
    $("#rollno").prop("disabled", false);
    var roll = $("#rollno").val();
    var fullname = $("#fullname").val();
    var _class = $("#_class").val();
    var dob = $("#dob").val();
    var address = $("#address").val();
    var enrolldate = $("#enrolldate").val();
    var jsonObjStr = {
        "rollno": roll,
        "fullName": fullname,
        "class": _class,
        "dob": dob,
        "address": address,
        "enrollDate": enrolldate
    }
    jsonObjStr = JSON.stringify(jsonObjStr);
    var putRequ = createUPDATERecordRequest(token, jsonObjStr, dbName, relName, currentRecNo);
    jQuery.ajaxSetup({async:false});
    var result = executeCommandAtGivenBaseUrl(putRequ, baseUrl, imlEnd);
    jQuery.ajaxSetup({async:true});
    if(result.status === 400){
        alert("Error: " + result.body);
    }
    else if(result.status === 200){
        alert("Data updated successfully");
        resetData();
    }
    else{
        alert("Error: " + result.body);
    }
}
function resetData(){
    $("#rollno").prop("disabled", false);
    $("#rollno").val("");
    $("#fullname").val("");
    $("#_class").val("");
    $("#dob").val("");
    $("#address").val("");
    $("#enrolldate").val("");
    $("#rollno").focus();
    $("#save").prop("disabled", true);
    $("#change").prop("disabled", true);
    $("#reset").prop("disabled", true);
}

function getRoll(){
    var roll = $("#rollno").val();
    var jsonObjStr = {
        "rollno": roll
    }
    jsonObjStr = JSON.stringify(jsonObjStr);
    var getReq = createGET_BY_KEYRequest(token, dbName, relName, jsonObjStr);
    jQuery.ajaxSetup({async:false});
    var result = executeCommandAtGivenBaseUrl(getReq, baseUrl, irlEnd);
    jQuery.ajaxSetup({async:true});
    if(result.status === 400){
        $("#save").prop("disabled", false);
        $("#change").prop("disabled", true);
        $("#reset").prop("disabled", false);
        $("#fullname").focus();
    }
    else if(result.status === 200){
        $("#save").prop("disabled", true);
        $("#change").prop("disabled", false);
        $("#reset").prop("disabled", false);

        //Fill columns with recieved data
        var recievedData = JSON.parse(result.data).record;
        $("#fullname").val(recievedData.fullName);
        $("#_class").val(recievedData.class);
        $("#dob").val(recievedData.dob);
        $("#address").val(recievedData.address);
        $("#enrolldate").val(recievedData.enrollDate);

        //Get the current record number matching with the roll number
        currentRecNo = JSON.parse(result.data).rec_no;
        $("#rollno").prop("disabled", true);
        $("#fullname").focus();
        
    }
    else{
        alert("Error: " + JSON.stringify(result));
    }
}