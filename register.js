// SELECT AVATAR


let selectedAvatar = "";

let selectAvatar1 = document.getElementById("selectAvatar1");
let selectAvatar2 = document.getElementById("selectAvatar2");
let selectAvatar3 = document.getElementById("selectAvatar3");
let selectAvatar4 = document.getElementById("selectAvatar4");
let selectAvatar5 = document.getElementById("selectAvatar5");
let selectAvatar6 = document.getElementById("selectAvatar6");


selectAvatar1.addEventListener("click", () => {
    selectAvatar1.style.borderColor = "black";
    selectedAvatar = "boy.png";
    selectAvatar2.style.borderColor = "transparent";
    selectAvatar3.style.borderColor = "transparent";
    selectAvatar4.style.borderColor = "transparent";
    selectAvatar5.style.borderColor = "transparent";
    selectAvatar6.style.borderColor = "transparent";
})
selectAvatar2.addEventListener("click", () => {
    selectAvatar2.style.borderColor = "black";
    selectedAvatar = "boy2.png";
    selectAvatar1.style.borderColor = "transparent";
    selectAvatar3.style.borderColor = "transparent";
    selectAvatar4.style.borderColor = "transparent";
    selectAvatar5.style.borderColor = "transparent";
    selectAvatar6.style.borderColor = "transparent";
})
selectAvatar3.addEventListener("click", () => {
    selectAvatar3.style.borderColor = "black";
    selectedAvatar = "koala.png";
    selectAvatar1.style.borderColor = "transparent";
    selectAvatar2.style.borderColor = "transparent";
    selectAvatar4.style.borderColor = "transparent";
    selectAvatar5.style.borderColor = "transparent";
    selectAvatar6.style.borderColor = "transparent";
})
selectAvatar4.addEventListener("click", () => {
    selectAvatar4.style.borderColor = "black";
    selectedAvatar = "robot.png";
    selectAvatar1.style.borderColor = "transparent";
    selectAvatar2.style.borderColor = "transparent";
    selectAvatar3.style.borderColor = "transparent";
    selectAvatar5.style.borderColor = "transparent";
    selectAvatar6.style.borderColor = "transparent";
})
selectAvatar5.addEventListener("click", () => {
    selectAvatar5.style.borderColor = "black";
    selectedAvatar = "girl.png";
    selectAvatar1.style.borderColor = "transparent";
    selectAvatar2.style.borderColor = "transparent";
    selectAvatar3.style.borderColor = "transparent";
    selectAvatar4.style.borderColor = "transparent";
    selectAvatar6.style.borderColor = "transparent";
})
selectAvatar6.addEventListener("click", () => {
    selectAvatar6.style.borderColor = "black";
    selectedAvatar = "girl2.png";
    selectAvatar1.style.borderColor = "transparent";
    selectAvatar2.style.borderColor = "transparent";
    selectAvatar3.style.borderColor = "transparent";
    selectAvatar4.style.borderColor = "transparent";
    selectAvatar5.style.borderColor = "transparent";
})








// FILL DETAILS


// -- FIRST NAME
let firstName = document.getElementById("firstName");
firstName.addEventListener("input", () => {
    if (firstName.value.length > 2) {
        firstName.style.borderColor = "lightGreen";
    } else {
        firstName.style.borderColor = "red";
    }
})




// -- LAST NAME 

let lastName = document.getElementById("lastName");
lastName.addEventListener("input", () => {
    if (lastName.value.length > 2) {
        lastName.style.borderColor = "lightGreen";
    } else {
        lastName.style.borderColor = "red";
    }
})



// -- PASSWORD
let password = document.getElementById("password");
password.addEventListener("input", () => {
    if (password.value.length > 5) {
        password.style.borderColor = "lightGreen";
    } else {
        password.style.borderColor = "red";
    }
})




// -- CONFIRM PASSWORD

let confirmPassword = document.getElementById("confirmPassword");
confirmPassword.addEventListener("input", () => {
    if (confirmPassword.value.length > 5) {
        confirmPassword.style.borderColor = "lightGreen";
    } else {
        confirmPassword.style.borderColor = "red";
    }
})



// SUBMIT REGISTRATION FROM

let submit = document.getElementById("submit");
let alert = document.getElementById("alert");

submit.addEventListener("click", () => {
    if (selectedAvatar.length > 0 && firstName.value.length > 2 && lastName.value.length > 2 && password.value.length > 5 && confirmPassword.value.length > 5) {


        if (password.value === confirmPassword.value) {
            alert.style.display = "none";
            confirmPassword.style.borderColor = "lightGreen";
            console.log("all ok");


            firstName.setAttribute("disabled", "");
            lastName.setAttribute("disabled", "");
            gender.setAttribute("disabled", "");
            password.setAttribute("disabled", "");
            confirmPassword.setAttribute("disabled", "");
            submit.setAttribute("disabled", "");

            const formData = new FormData();
            formData.append("firstName", document.getElementById("firstName").value);
            formData.append("lastName", document.getElementById("lastName").value);
            formData.append("gender", document.getElementById("gender").value);
            formData.append('password', document.getElementById('password').value);
            formData.append('confirmPassword', document.getElementById('confirmPassword').value);
            formData.append('selectedAvatar', selectedAvatar);

            console.log([...formData.entries()]);

            console.log("run");
            $.ajax({
                type: "POST",
                url: "php/backend-register.php",
                data: formData,
                processData: false,
                contentType: false,
                success: function (response) {
                    console.log(response);

                    const data = JSON.parse(response);

                    if (data.status === 'success') {
                        location.assign("/index.php");
                    } else {
                        firstName.removeAttribute("disabled");
                        lastName.removeAttribute("disabled");
                        gender.removeAttribute("disabled");
                        password.removeAttribute("disabled");
                        confirmPassword.removeAttribute("disabled");
                        submit.removeAttribute("disabled");

                        if (data.status === "PasswordNotMatch") {
                            alert.innerText = "Password and Confirm Password do not match";
                        } else if (data.status === "serverOverload") {
                            alert("Registration Failed: High Traffic Detected, please try again later");
                        } else {
                            alert("Registration Failed: try again later");
                        }
                    }
                },
                error: function (xhr, status, error) {
                    // Handle AJAX errors here
                    console.error(xhr, status, error);
                }
            });
        } else {
            confirmPassword.style.borderColor = "red";
            alert.style.display = "block";
            alert.innerText = "Password and Confirm Password is not Match";
        }

    } else {
        if (confirmPassword.value.length <= 5) {
            confirmPassword.style.borderColor = "red";
            alert.style.display = "block";
            alert.innerText = "Please fill your confirm password";
        }
        if (password.value.length <= 5) {
            password.style.borderColor = "red";
            alert.style.display = "block";
            alert.innerText = "Please Enter your password";
        }
        if (lastName.value.length <= 2) {
            lastName.style.borderColor = "red";
            alert.style.display = "block";
            alert.innerText = "Please Enter your last name";
        }
        if (firstName.value.length <= 2) {
            firstName.style.borderColor = "red";
            alert.style.display = "block";
            alert.innerText = "Please Enter your first name";
        }

        if (selectedAvatar.length == 0) {
            selectAvatar1.style.borderColor = "red";
            selectAvatar2.style.borderColor = "red";
            selectAvatar3.style.borderColor = "red";
            selectAvatar4.style.borderColor = "red";
            selectAvatar5.style.borderColor = "red";
            selectAvatar6.style.borderColor = "red";
            alert.style.display = "block";
            alert.innerText = "Please select Avatar";
        }
    }
})