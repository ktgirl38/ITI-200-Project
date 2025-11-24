var out=document.getElementById("emailSignup");
var btn=document.getElementById("emailSubmitBtn");
var emailIn=document.getElementById("inputEmail")

function submitEmail() {
    let answer=emailIn.value;
    if(answer != ""){
        out.innerText = "Thank you for signing up for our email list! Keep an eye out for exclusive information coming your way!";
    }
}

