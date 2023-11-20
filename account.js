import { app as firebase } from './firebase-config.js';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

console.log(firebase);

const auth = getAuth(firebase);
let currentlyOn;

onAuthStateChanged(auth, async user => {

    if (user) {
        console.log('welcome')
        const username = document.getElementById('username');
        const email = document.getElementById('email');
        username.innerText = user.displayName;
        email.innerText = user.email;
    } else {
        location.href = '/auth/login.html'
    }

});

const backBtn = document.getElementById('back-btn');
backBtn.addEventListener('click', () => {
    location.href = '/read.html'
});

const settingBtns = document.querySelectorAll('.setting');
settingBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
        if (btn.id === 'resources') {
            location.href = '/resources.html';
        }
        const tab = document.getElementById(`${btn.id}-tab`);
        const mainTab = document.getElementById('app');
        mainTab.style.display = 'none';
        tab.style.display = 'flex';
        currentlyOn = `${btn.id}-tab`;
    });
});

const backToMainTabBtns = document.querySelectorAll('.back-to-main');
backToMainTabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
        const mainTab = document.getElementById('app');
        const currentTab = document.getElementById(currentlyOn);
        mainTab.style.display = 'flex';
        currentTab.style.display = 'none';
    })
})