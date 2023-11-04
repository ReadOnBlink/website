import { app as firebase} from './firebase-config.js';

console.log(firebase);

const mobileMenuBtn = document.getElementById('mobile-menu');
const mobileMenu = document.getElementById('menu');
const closeMenuBtn = document.getElementById('close-menu-btn');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenuBtn.style.transform = 'scale(0.8)';
    mobileMenu.style.left = '0';
    mobileMenuBtn.style.transform = 'rotate(-90deg)';
    closeMenuBtn.style.transform = 'rotate(-90deg)';
})

closeMenuBtn.addEventListener('click', () => {
    mobileMenu.style.left = '100%';
    mobileMenuBtn.style.transform = 'rotate(0deg)';
    closeMenuBtn.style.transform = 'rotate(0deg)';
    mobileMenuBtn.style.transform = 'scale(1)';
})

const loginBtnMobile = document.getElementById('login-btn-mobile');
const getStartedBtnMobile = document.getElementById('get-started-btn-mobile');

loginBtnMobile.addEventListener('click', () => {
    location.href = '/auth/login.html';
});

getStartedBtnMobile.addEventListener('click', () => {
    location.href = '/auth/getstarted.html';
});

const loginBtnNav = document.getElementById('login-btn-nav');
const getStartedBtnNav = document.getElementById('get-started-btn-nav');

loginBtnNav.addEventListener('click', () => {
    location.href = '/auth/login.html';
});

getStartedBtnNav.addEventListener('click', () => {
    location.href = '/auth/getstarted.html';
});

const getStartedBtnHero = document.getElementById('get-started-btn-hero');

getStartedBtnHero.addEventListener('click', () => {
    location.href = '/auth/getstarted.html';
});

const getStartedBtnCTA = document.getElementById('get-started-btn-cta');

getStartedBtnCTA.addEventListener('click', () => {
    location.href = '/auth/getstarted.html';
});

const getStartedBtnFooter = document.getElementById('get-started-btn-footer');

getStartedBtnFooter.addEventListener('click', () => {
    location.href = '/auth/getstarted.html';
});
