import { app as firebase } from '../firebase-config.js';
import { getAuth, updateProfile, createUserWithEmailAndPassword, sendEmailVerification, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

console.log(firebase);

const auth = getAuth(firebase);
const provider = new GoogleAuthProvider(auth);

let alert = document.getElementById('alert');

const form = document.querySelector('form');
form.addEventListener('submit', (e) => {

    e.preventDefault();

    const username = form.username.value;
    const email = form.email.value;
    const password = form.password.value;

    if (document.getElementById('policy-check').checked) {
        createUserWithEmailAndPassword(auth, email, password)
        .then((cred) => {
            console.log('user created with email!')
            sendEmailVerification(auth.currentUser)
            .then(() => {
                console.log('verification email sent!')
                updateProfile(auth.currentUser, {
                    displayName: username
                }).then(() => {
                    console.log('displayName set!')
                    location.href = '/read.html';
                }).catch((err) => {
                    console.log(err.message);
                    alert.innerText = err.message;
                    alert.style.display = 'flex';
                    setTimeout(() => {
                        alert.style.display = 'none';
                        alert.innerText = '';
                    }, "7500")
                })
            }).catch((err) => {
                console.log(err.message)
                alert.innerText = err.message;
                alert.style.display = 'flex';
                setTimeout(() => {
                    alert.style.display = 'none';
                    alert.innerText = '';
                }, "7500")
            })
        }).catch((err) => {
            console.log(err.message)
            alert.innerText = err.message;
            alert.style.display = 'flex';
            setTimeout(() => {
                alert.style.display = 'none';
                alert.innerText = '';
            }, "7500")
        })
    } else {
        alert.innerText = 'To use Blink, you must agree to our policies';
        alert.style.display = 'flex';
        setTimeout(() => {
            alert.style.display = 'none';
            alert.innerText = '';
        }, "7500")
    }

    

})

const googleBtn = document.getElementById('google');
googleBtn.addEventListener('click', (e) => {

    e.preventDefault();

    signInWithPopup(auth, provider)
    .then((result) => {
        console.log('user created with google!')
        sendEmailVerification(auth.currentUser)
        .then(() => {
            console.log('verification email sent!')
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
