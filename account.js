import { app as firebase } from './firebase-config.js';
import { getAuth, onAuthStateChanged, deleteUser, updateProfile, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, reauthenticateWithCredential, verifyBeforeUpdateEmail, updatePassword } from 'firebase/auth';
import { getFirestore, doc, updateDoc, deleteDoc } from 'firebase/firestore';

console.log(firebase);

const auth = getAuth(firebase);
const provider = new GoogleAuthProvider(auth);

const db = getFirestore(firebase);

let currentlyOn;

const alert = document.getElementById('alert');

onAuthStateChanged(auth, async user => {

    if (user) {
        console.log('welcome')
        const username = document.getElementById('username');
        const email = document.getElementById('email');
        username.innerText = user.displayName;
        email.innerText = user.email;
        const changeUsernameInput = document.getElementById('new_username');
        changeUsernameInput.placeholder = user.displayName;
        const changeEmailInput = document.getElementById('new_email');
        changeEmailInput.placeholder = user.email;
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
        } else if (btn.id === 'privacy') {
            location.href = '/privacy.html';
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

const changeUsernameForm = document.getElementById('change-username-form');
changeUsernameForm.addEventListener('submit', async e => {

    e.preventDefault();

    updateProfile(auth.currentUser, {
        displayName: changeUsernameForm.new_username.value
    }).then(() => {
        location.reload();
    }).catch((err) => {
        console.log(err.message);
        alert.innerText = err.message;
        alert.style.display = 'flex';
        setTimeout(() => {
            alert.style.display = 'none'
        }, 7500)
    })

});

const reauthModal = document.getElementById('reauth-popup');
const reauthForm = document.getElementById('reauth-form');

const reauthGoogleBtn = document.getElementById('google-btn');

const changeEmailForm = document.getElementById('change-email-form');
changeEmailForm.addEventListener('submit', async e => {

    e.preventDefault();
    reauthModal.showModal();

    sessionStorage.setItem('reauthFor', 'new_email');
    sessionStorage.setItem('newEmail', changeEmailForm.new_email.value);

});

const changePasswordForm = document.getElementById('change-password-form');
changePasswordForm.addEventListener('submit', async e => {

    e.preventDefault();
    reauthModal.showModal();

    sessionStorage.setItem('reauthFor', 'new_password');
    sessionStorage.setItem('newPassword', changePasswordForm.new_password.value);

});

const deleteAccountBtn = document.getElementById('delete-account-btn');
deleteAccountBtn.addEventListener('click', async e => {

    e.preventDefault();
    reauthModal.showModal();

    sessionStorage.setItem('reauthFor', 'delete_account');

})

reauthForm.addEventListener('submit', async e => {

    e.preventDefault();

    const email = reauthForm.email.value;
    const password = reauthForm.password.value;

    signInWithEmailAndPassword(auth, email, password)
    .then(async function() {
        console.log('reauthenticated user!')
        let itemToChange = sessionStorage.getItem('reauthFor')
        reauthModal.close()
        if (itemToChange === 'new_email') {
            let newEmail = sessionStorage.getItem('newEmail');
            verifyBeforeUpdateEmail(auth.currentUser, newEmail, null)
            .then(() => {
                alert('Please Verify Your New Email Address! (You Will Need To Sign In Again)')
                location.reload();
            }).catch((err) => {
                console.log(err.message);
                alert.innerText = err.message;
                alert.style.display = 'flex';
                setTimeout(() => {
                    alert.style.display = 'none'
                }, 7500)
            })
        } else if (itemToChange === 'new_password') {
            let newPassword = sessionStorage.getItem('newPassword');
            updatePassword(auth.currentUser, newPassword).then(() => {
                console.log('password updated!')
                location.reload();
            }).catch((err) => {
                console.log(err.message);
                alert.innerText = err.message;
                alert.style.display = 'flex';
                setTimeout(() => {
                    alert.style.display = 'none'
                }, 7500)
            })
        } else if (itemToChange === 'delete_account') {
            await deleteDoc(doc(db, 'users', auth.currentUser.uid)).then(() => {
                deleteUser(auth.currentUser).then(() => {
                    location.href = '/index.html';
                }).catch((err) => {
                    console.log(err.message)
                })
            })
        }
    }).catch((err) => {
        console.log(err.message);
        alert.innerText = err.message;
        alert.style.display = 'flex';
        setTimeout(() => {
            alert.style.display = 'none'
        }, 7500)
    })

}) 

reauthGoogleBtn.addEventListener('click', async e => {

    e.preventDefault();

    signInWithPopup(auth, provider)
    .then(async function() {
        console.log('user reauthed!')
        let itemToChange = sessionStorage.getItem('reauthFor')
        reauthModal.close()
        if (itemToChange === 'new_email') {
            let newEmail = sessionStorage.getItem('newEmail');
            verifyBeforeUpdateEmail(auth.currentUser, newEmail, null)
            .then(() => {
                alert('Please Verify Your New Email Address! (You Will Need To Sign In Again)')
                location.reload();
            }).catch((err) => {
                console.log(err.message);
                alert.innerText = err.message;
                alert.style.display = 'flex';
                setTimeout(() => {
                    alert.style.display = 'none'
                }, 7500)
            })
        } else if (itemToChange === 'new_password') {
            let newPassword = sessionStorage.getItem('newPassword');
            updatePassword(auth.currentUser, newPassword).then(() => {
                console.log('password updated!')
                location.reload();
            }).catch((err) => {
                console.log(err.message);
                alert.innerText = err.message;
                alert.style.display = 'flex';
                setTimeout(() => {
                    alert.style.display = 'none'
                }, 7500)
            })
        } else if (itemToChange === 'delete_account') {
            await deleteDoc(doc(db, 'users', auth.currentUser.uid)).then(() => {
                deleteUser(auth.currentUser).then(() => {
                    location.href = '/index.html';
                }).catch((err) => {
                    console.log(err.message)
                })
            })
        }
    }).catch((err) => {
        console.log(err.message);
        alert.innerText = err.message;
        alert.style.display = 'flex';
        setTimeout(() => {
            alert.style.display = 'none'
        }, 7500)
})

})

const editGNewsForm = document.getElementById('edit-gnews-form');
editGNewsForm.addEventListener('submit', async e => {

    e.preventDefault();

    const newKey = editGNewsForm.new_gnews_key.value;

    const docRef = doc(db, 'users', auth.currentUser.uid);

    await updateDoc(docRef, {
        gnews: newKey,
    }).then(() => {
        console.log('updated!')
        location.reload();
    }).catch((err) => {
        alert.innerText = err.message;
        alert.style.display = 'flex';
        setTimeout(() => {
            alert.style.display = 'none'
        }, 7500)
    })

})

const editOpenAIForm = document.getElementById('edit-openai-form');
editOpenAIForm.addEventListener('submit', async e => {

    e.preventDefault();

    const newKey = editOpenAIForm.new_openai_key.value;

    const docRef = doc(db, 'users', auth.currentUser.uid);

    await updateDoc(docRef, {
        openai: newKey,
    }).then(() => {
        console.log('updated!')
        location.reload();
    }).catch((err) => {
        alert.innerText = err.message;
        alert.style.display = 'flex';
        setTimeout(() => {
            alert.style.display = 'none'
        }, 7500)
    })

})