let myForm = document.getElementsByClassName('contact-form');
let checkBox = document.getElementById('checkbox-input');
let submitButton = document.getElementById('submit-button');

let userName = document.getElementById('name-input');
let nameError = document.getElementById('name-error');
let email = document.getElementById('email-input');
let emailError = document.getElementById('email-error');
let checkboxError = document.getElementById('checkbox-error');

const nameRegex = /^[a-zA-Z]+$/;
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

checkBox.addEventListener('change', function() {
    if (checkBox.checked) {
        submitButton.disabled = false;
        submitButton.style.cursor = 'pointer';
    }
    else {
        submitButton.disabled = true;
        submitButton.style.cursor = 'not-allowed';
    }
});


myForm[0].addEventListener('submit', function(e) {
    e.preventDefault();
    if (checkBox.checked && nameRegex.test(userName.value) && emailRegex.test(email.value)) {
        myForm[0].submit();
    }
    else if (!nameRegex.test(userName.value) && !emailRegex.test(email.value)) {
        nameError.innerHTML = 'Please enter a valid name';
        emailError.innerHTML = 'Please enter a valid email';
    }
    else if (emailRegex.test(email.value) && !nameRegex.test(userName.value)) {
        emailError.innerHTML = '';
        nameError.innerHTML = 'Please enter a valid name';
    }
    else if (nameRegex.test(userName.value) && !emailRegex.test(email.value)) {
        nameError.innerHTML = '';
        emailError.innerHTML = 'Please enter a valid email';
    }
});
console.log('Script loaded');
