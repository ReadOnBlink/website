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
        let ext = () => { if(currDate % 10 >= 3) return "th"; else if(currDate % 10 == 1) return "st"; else if(currDate % 10 == 2) return "nd"; else if(currDate % 10 == 3) return "rd"; }

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
const politicsBtn = document.getElementById('nation');
const scienceBtn = document.getElementById('science');
const healthBtn = document.getElementById('health');

const buttons = [businessBtn, entertainmentBtn, technologyBtn, sportsBtn, politicsBtn, scienceBtn, healthBtn];
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
    await getNews(datakey, await getPreferences(auth.currentUser.uid));
} else {
    console.log('document does not exist!');
}

async function getPreferences(user) {
    const userDocRef = doc(db, 'users', user);
    const userDocSnap = await getDoc(userDocRef);
    let userPreferences = userDocSnap.data().preferences;
    return userPreferences
}

async function getNews(key, preferences) {
    for (let x = 0; x < preferences.length; x++) {
        let url = 'https://gnews.io/api/v4/top-headlines?category=' + preferences[x] + '&lang=en&country=us&max=10&apikey=' + key;
        await fetch(url)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log('artiawdi', data.articles);
                console.log(data.articles.length);

                for (let i = 0; i < data.articles.length; i++) {
                    const container = document.getElementById('news-container');
                    const article = document.createElement('article');
                    article.id = data.articles[i]['url'];
                    const img = document.createElement('img');
                    img.src = data.articles[i]['image'];
                    img.setAttribute('class', 'article-img');
                    const contentContainer = document.createElement('div');
                    contentContainer.setAttribute('class', 'content-container');
                    const title = document.createElement('h2');
                    title.setAttribute('class', 'article-title');
                    title.innerText  = data.articles[i]['title']
                    const description = document.createElement('p');
                    description.setAttribute('class', 'article-description');
                    description.innerText = data.articles[i]['description'];
                    contentContainer.appendChild(title);
                    contentContainer.appendChild(description);
                    article.appendChild(img);
                    article.appendChild(contentContainer)
                    container.appendChild(article);
                    article.addEventListener('click', () => {
                        const UIHeader = document.querySelector('header');
                        UIHeader.style.display = 'none';
                        const articleHeadImg = document.getElementById('article-head-image');
                        articleHeadImg.src = data.articles[i]['image'];
                        const articleTitle = document.getElementById('article-title');
                        articleTitle.innerText = data.articles[i]['title'];
                        const publishDate = document.getElementById('publishDate');
                        publishDate.innerText = data.articles[i]['publishedAt'];
                        const sourceText = document.getElementById('sourceText');
                        sourceText.href = data.articles[i]['url'];
                        const articleDescription = document.getElementById('article-description');
                        articleDescription.innerHTML = `${data.articles[i]['description']}<br>${data.articles[i]['content']}`;
                        const articleContainer = document.getElementById('article-container');
                        container.style.display = 'none';
                        articleContainer.style.display = 'flex';
                        document.title = data.articles[i]['title']
                    })
                    // articles[i].title
                    console.log("Title: " + data.articles[i]['title']);
                    // articles[i].description
                    console.log("Description: " + data.articles[i]['description']);
                    // You can replace {property} below with any of the article properties returned by the API.
                    // articles[i].{property}
                    // console.log(articles[i]['{property}']);

                    // Delete this line to display all the articles returned by the request. Currently only the first article is displayed.

                };
            });
    }
    
}

const backToNewsBtn = document.getElementById('back-to-news-btn');
backToNewsBtn.addEventListener('click', () => {

    const newsfeed = document.getElementById('news-container');
    const articleWindow = document.getElementById('article-container');

    newsfeed.style.display = 'flex';
    articleWindow.style.display = 'none';

    const UIHeader = document.querySelector('header');
    UIHeader.style.display = 'flex';

    document.title = 'Blink - For You';

})
