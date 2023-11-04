import { app as firebase } from './firebase-config.js';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, getDocs, getDoc } from 'firebase/firestore'; 

// check if firebase is connected
console.log(firebase);

// init auth and db
const auth = getAuth(firebase);
const db = getFirestore(firebase);

// signout functionality
const signOutBtn = document.querySelector('#sign-out-btn');
signOutBtn.addEventListener('click', () => {
    // signout function
    signOut(auth)
    .then(() => {
        console.log('user signed out!')
        location.href = '/index.html'
    }).catch((err) => {
        console.log(err.message)
    })
})

var dateText = document.getElementById('date');

// check if user is allowed on page and if they have completed onboarding
onAuthStateChanged(auth, async user => {

    if (user) {
        console.log('welcome user!')
        const docRef = doc(db, "users", auth.currentUser.uid)
        const docSnap = await getDoc(docRef);
        const appView = document.getElementById('app');
        const onboardingView = document.getElementById('onboarding');
        const navbar = document.querySelector('nav');
        if (docSnap.exists()) {
            console.log('user has finished onboarding!')
            navbar.setAttribute('data-m', 'bounce-up')
            appView.style.display = 'flex';
            onboardingView.style.display = 'none';
            navbar.style.display = 'flex';
        } else {
            console.log('user needs to onboard still!')
            onboardingView.style.display = 'flex';
            appView.style.display = 'none';
            navbar.style.display = 'none';
        }
        let date = new Date();
        let day = date.toLocaleDateString("en-US", { weekday: "long" });
        let month = date.toLocaleDateString("en-US", { month: "long" });
        let currDate = date.getDate();

        console.log(month);
        console.log(day);
        let ext = () => { if(currDate % 10 > 4) return "th"; else if(currDate % 10 == 1) return "st"; else if(currDate % 10 == 2) return "nd"; else if(currDate % 10 == 3) return "rd"; }

        dateText.innerText = `${day}, ${month} ${currDate}${ext(currDate)}`;

        
        
    } else {
        console.log('user needs to login!')
        location.href = '/auth/login.html';
    }

})

let onboardingUserInterests = [];

const businessBtn = document.getElementById('business');
const entertainmentBtn = document.getElementById('entertainment');
const technologyBtn = document.getElementById('technology');
const sportsBtn = document.getElementById('sports');
const politicsBtn = document.getElementById('politics');
const scienceBtn = document.getElementById('science');
const foodBtn = document.getElementById('food');
const healthBtn = document.getElementById('health');

const buttons = [businessBtn, entertainmentBtn, technologyBtn, sportsBtn, politicsBtn, scienceBtn, foodBtn, healthBtn];
buttons.forEach(btn => {
    btn.addEventListener('click', () => {
        const text = btn.querySelector('p');
        if (!onboardingUserInterests.includes(btn.id)) {
            text.style.opacity = '100%';
            btn.style.border = '1px solid rgba(140, 82, 255, 0.5)';
            onboardingUserInterests.push(btn.id)
            console.log(onboardingUserInterests)
        } else {
            text.style.opacity = '50%';
            let itemToRemove = onboardingUserInterests.indexOf(btn.id);
            onboardingUserInterests.splice(itemToRemove, 1)
            btn.style.border = '1px solid rgba(140, 82, 255, 0.1)';
            console.log(onboardingUserInterests)
        }
    })
})

const onboardingInterestsForm = document.getElementById('interests-form-onboarding');
onboardingInterestsForm.addEventListener('submit', (e) => {

    e.preventDefault();

    const interestsView = document.getElementById('interests');
    const openAIView = document.getElementById('openai');

    if (onboardingUserInterests.length === 0) {
        alert('Please add in interests!')
    } else {
        interestsView.style.display = 'none';
        openAIView.style.display = 'flex';
    }

});

const openaiForm = document.getElementById('openai-form-onboarding');
openaiForm.addEventListener('submit', async e => {

    e.preventDefault();

    const key = openaiForm.openai_api_key.value;

    await setDoc(doc(db, 'users', auth.currentUser.uid), {
        openai: key,
        preferences: onboardingUserInterests,
        uid: auth.currentUser.uid,
        username: auth.currentUser.displayName
    });

    console.log('document added!')

    location.reload();

})

const helpBtn = document.getElementById("help-btn");
helpBtn.addEventListener("click", function () {
    alert("Helep belep");
});

const skipBtn = document.getElementById('skip-btn');
skipBtn.addEventListener('click', async e => {
    e.preventDefault();

    const key = '';

    await setDoc(doc(db, 'users', auth.currentUser.uid), {
        openai: key,
        preferences: onboardingUserInterests,
        uid: auth.currentUser.uid,
        username: auth.currentUser.displayName
    });

    console.log('document added!')

    location.reload();
})

const menuBtn = document.getElementById('menu-btn');
const menu = document.querySelector('aside');
const closeMenuBtn = document.getElementById('close-menu');

menuBtn.addEventListener('click', () => {
    menu.style.right = '0';
});

closeMenuBtn.addEventListener('click', () => {
    let width = screen.width;
    if (width <= 400) {
        menu.style.right = '-100%';
    } else if (width >= 401 && width <= 767) {
        menu.style.right = '-50%';
    } else {
        menu.style.right = '-30%';
    }
});

// App functionality
const docRef = doc(db, 'tooling', 'kR19VTNHvTxVw9FgxZYB');
const docSnap = await getDoc(docRef);
if (docSnap.exists()) {
    var datakey = docSnap.data().key;
    console.log('newsdatakey:', datakey);
    // await getNews(datakey);
} else {
    console.log('document does not exist!')
}
/* 
async function getNews(key) {
    const response = await fetch(`https://newsdata.io/api/1/news?apikey=${key}&q=pizza`);
    const pizza = await response.json();
    console.log(pizza)
}
 */

async function getNews(key) {
	const apiKey = key; // Replace with your Bearer token
    const query = "pizza";

    const apiUrl = `https://newsdata.io/api/1/news?q=${query}`;

    const requestOptions = {
    method: "GET",
    headers: {
        "X-ACCESS-KEY": `Bearer ${apiKey}`,
    }
    };

    fetch(apiUrl, requestOptions)
    .then((response) => {
        if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then((data) => {
        // Process the JSON data returned by the API
        console.log(data);
    })
    .catch((error) => {
        console.error("Error:", error);
    });
}




