// USERNAME
let username = document.getElementById("username");
username.addEventListener("input", () => {
    username.style.borderColor = "lightGreen";
})

// PASSWORD
let password = document.getElementById("password");
password.addEventListener("input", () => {
    password.style.borderColor = "lightGreen";
})


// SUBMIT LOGIN DETAILS
let submit = document.getElementById("submit");
submit.addEventListener("click", () => {
    if (username.value.length > 4 && password.value.length > 5) {

        console.log("done");


        $.ajax({
            type: "POST",
            url: "php/backend-login.php",
            data: {
                login_userName: username.value,
                login_pass: password.value,
            },
            success: function (response) {
                console.log(response);
                const data = JSON.parse(response);

                if (data.status === "loginSuccess") {
                    location.assign("/index.php");
                } else {
                    username.style.borderColor = "red";
                    password.style.borderColor = "red";
                    alert("Login Failed! Incorrect Username and password!");
                }
            },
        });










    } else {
        if (username.value.length <= 4) {
            username.style.borderColor = "red";
        }
        if (password.value.length <= 5) {
            password.style.borderColor = "red";
        }
    }
})