import { app as firebase } from './firebase-config.js';

console.log(firebase);

const emailLinks = document.querySelectorAll('#email');
emailLinks.forEach((link) => {
    link.addEventListener('click', () => {
        window.location.href = "mailto:readonblink@gmail.com?subject=Policy%20Concerns&body=";
    })
})