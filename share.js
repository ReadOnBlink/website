import { app as firebase } from './firebase-config.js';

console.log(firebase);

window.addEventListener('load', () => {

    const searchParams = new URLSearchParams(window.location.search);
    const title = searchParams.get('title');
    const date = searchParams.get('date');
    const description = searchParams.get('description');

    document.querySelector('.title').innerText = title;
    document.querySelector('.date').innerText = date;
    document.querySelector('.description').innerText = description;

    document.title = `Blink - ${title}`;

})

const menuBtn = document.querySelector('#mobile-menu');
menuBtn.addEventListener('click', () => {
    
    const menu = document.querySelector('#menu');

    menu.style.display = 'flex';
    setTimeout(() => {
        menu.style.left = '0%';
    }, 10);

})

const closeMenuBtn = document.querySelector('#close-menu-btn');
closeMenuBtn.addEventListener('click', () => {

    const menu = document.querySelector('#menu');

    menu.style.left = '100%';
    setTimeout(() => {
        menu.style.display = 'none'
    }, 500);

})

const loginMenuBtn = document.querySelector('#login-btn-mobile');
const getStartedMenuBtn = document.querySelector('#get-started-btn-mobile');

loginMenuBtn.addEventListener('click', () => {

    location.href = '/auth/login.html';

});

getStartedMenuBtn.addEventListener('click', () => {

    location.href = '/auth/getstarted.html';

})

const startReadingBtn = document.querySelector('#cta-join-btn');
startReadingBtn.addEventListener('click', () => {

    location.href = '/auth/getstarted.html';

})