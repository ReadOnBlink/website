import { app as firebase } from '../firebase-config.js';

console.log(firebase);

let url;
let urlArray;

window.addEventListener('load', () => {

    url = location.href;
    urlArray = url.split('/')
    console.log(urlArray)

    if (urlArray[4] === 'welcome.html' || urlArray[4] === 'welcome') {
        const gnewsBtn = document.getElementById('gnews');
        const privacyBtn = document.getElementById('privacy');
        gnewsBtn.addEventListener('click', () => {
            location.href = '/resources/gnews.html';
        }) 
        privacyBtn.addEventListener('click', () => {
            location.href = '/privacy.html'
        })
    }

})

const loginBtn = document.getElementById('login-btn-nav');
const getStartedBtn = document.getElementById('get-started-btn-nav');
loginBtn.addEventListener('click', () => {

    location.href = '/auth/login.html';

})

getStartedBtn.addEventListener('click', () => {

    location.href = '/auth/getstarted.html';

})

const mobileMenuBtn = document.getElementById('mobile-menu');
const mobileMenu = document.getElementById('menu');
const closeMenuBtn = document.getElementById('close-menu-btn');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.style.display = 'flex';
    setTimeout(() => {
        mobileMenuBtn.style.transform = 'scale(0.8)';
        mobileMenu.style.left = '0';
        mobileMenuBtn.style.transform = 'rotate(-90deg)';
        closeMenuBtn.style.transform = 'rotate(-90deg)';
    }, 50)
})

closeMenuBtn.addEventListener('click', () => {
    mobileMenu.style.left = '100%';
    setTimeout(() => {
        mobileMenuBtn.style.transform = 'rotate(0deg)';
        closeMenuBtn.style.transform = 'rotate(0deg)';
        mobileMenuBtn.style.transform = 'scale(1)';
        mobileMenu.style.display = 'none';
    }, 250)
})

const loginBtnMobile = document.getElementById('login-btn-mobile');
const getStartedBtnMobile = document.getElementById('get-started-btn-mobile');

loginBtnMobile.addEventListener('click', () => {
    location.href = '/auth/login.html';
});

getStartedBtnMobile.addEventListener('click', () => {
    location.href = '/auth/getstarted.html';
});