import { app as firebase } from '../firebase-config.js';
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

console.log(firebase);

const auth = getAuth(firebase);
const provider = new GoogleAuthProvider(auth);

let alert = document.getElementById('alert');

const form = document.querySelector('form');
form.addEventListener('submit', (e) => {

    e.preventDefault();

    const email = form.email.value;
    const password = form.password.value;

    signInWithEmailAndPassword(auth, email, password)
    .then((cred) => {
        console.log('user signed in with email!')
        location.href = '/read.html'
    }).catch((err) => {
        console.log(err.message)
        alert.innerText = err.message;
        alert.style.display = 'flex';
        setTimeout(() => {
            alert.style.display = 'none';
            alert.innerText = '';
        }, "7500")
    })

})

const googleBtn = document.getElementById('google-btn');
googleBtn.addEventListener('click', (e) => {

    e.preventDefault();

    signInWithPopup(auth, provider)
    .then((result) => {
        console.log('user signed in with google!')
        location.href = '/read.html'
    }).catch((err) => {
        console.log(err.message)
        alert.innerText = err.message;
        alert.style.display = 'flex';
        setTimeout(() => {
            alert.style.display = 'none';
            alert.innerText = '';
        }, "7500")
    })

})
