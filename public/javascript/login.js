const login = document.getElementById("login");
const account = document.getElementById("createAccount");


const createError = document.getElementById("createError");
const loginError = document.getElementById("loginError");

window.user = "Guest";


async function createAccount(event) {
    event.preventDefault();

    const CAUsername = document.getElementById("createUser");
    const CAPassword = document.getElementById("createPass");
    const CAPassCheck = document.getElementById("verifyPass");
    const CAEmail = document.getElementById("createUserEmail");

    if(CAUsername.value==='') {
        alert("Please enter a username");
        createError.innerText = "Enter a username";
        return false;
    }
    
    if(!((CAPassword.value === CAPassCheck.value))){
        alert("The passwords you have typed in do not match. Please try again.");
        createError.innerText = "The passwords you have typed in do not match. Please try again.";
        return false;
        
    }

    const user = {
        username: CAUsername.value,
        password: CAPassword.value,
        email:CAEmail.value
    };

    console.log(user);

    const response = await fetch("/api/user/create", {
        headers: {
            'Accept':'application/json',
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(user)
    })

    if(response.status===409) {
        createError.innerText ="The username you have chosen already exists, please choose another.";
        alert("The username you have chosen already exists, please choose another.");
        return false;
    }

    alert("Account Created Successfully");
}

async function loginAccount(event) {
    event.preventDefault();

    const LIUsername = document.getElementById("loginUser");
    const LIPassword = document.getElementById("loginPass");


    const user = {
        username: LIUsername.value,
        password: LIPassword.value
    }

    localStorage.setItem('username', user.username);


    const response = await fetch("/api/user/check", {
        headers: {
            'Accept':'application/json',
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(user)
    });

    console.log(localStorage.getItem('username'))
    

    if(response.status===404) {
        loginError.innerText = "This combination does not exist.";
        alert("This combination does not exist");
        localStorage.removeItem('username');
        return false;
    } 

    alert("Login Successful! Welcome " + user.username);

    
    
}

account.addEventListener("submit", createAccount)
login.addEventListener("submit", loginAccount)