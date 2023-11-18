import { app as firebase } from './firebase-config.js';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

console.log(firebase);

const auth = getAuth(firebase);

onAuthStateChanged(auth, async user => {

    if (user) {
        console.log('welcome')
    } else {
        location.href = '/auth/login.html'
    }

})

const backBtn = document.getElementById('back-btn');
backBtn.addEventListener('click', () => {
    location.href = '/read.html'
})