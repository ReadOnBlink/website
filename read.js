import { app as firebase } from './firebase-config.js';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, getDocs, getDoc } from 'firebase/firestore'; 
import { GoogleGenerativeAI } from "@google/generative-ai";

// check if firebase is connected
console.log(firebase);

// init auth and db
const auth = getAuth(firebase);
const db = getFirestore(firebase);

var GNewsAPIKey;

let latestNewsLoaded;

var aiParam;

async function getParam() {
    const aiDocRef = doc(db, 'tooling', 'kR19VTNHvTxVw9FgxZYB');
    const aiDocSnap = await getDoc(aiDocRef);

    if (aiDocSnap.exists()) {
        aiParam = aiDocSnap.data().key;
    } else {
        console.log('no doc found!');
    }
}

getParam();

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

var userUID;

// check if user is allowed on page and if they have completed onboarding
onAuthStateChanged(auth, async user => {

    if (user) {
        console.log('welcome user!')
        const docRef = doc(db, "users", auth.currentUser.uid)
        const docSnap = await getDoc(docRef);
        userUID = user.uid;
        console.log('ln 41: ', userUID);
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
    const GNewsView = document.getElementById('gnews');

    if (onboardingUserInterests.length === 0) {
        alert('Please add in interests!')
    } else {
        interestsView.style.display = 'none';
        GNewsView.style.display = 'flex';
    }

});

const onboardingGNewsForm = document.getElementById('gnews-form-onboarding');
onboardingGNewsForm.addEventListener('submit', async e => {

    e.preventDefault();

    const gnewsView = document.getElementById('gnews');

    let value = onboardingGNewsForm.gnews_api_key.value;
    if (!value || value === '') {
        alert('Please Enter A GNews API Key!');
    } else {
        sessionStorage.setItem('gnewsOnboardingKey', value);
        await setDoc(doc(db, 'users', auth.currentUser.uid), {
            gnews: sessionStorage.getItem('gnewsOnboardingKey'),
            preferences: onboardingUserInterests,
            uid: auth.currentUser.uid,
            username: auth.currentUser.displayName
        });
        gnewsView.style.display = 'none';
        location.reload();
    }

})

const menuBtn = document.getElementById('menu-btn');
const menu = document.querySelector('aside');
const closeMenuBtn = document.getElementById('close-menu');

menu.style.display = 'none';

menuBtn.addEventListener('click', () => {
    menu.style.display = 'flex';
    setTimeout(() => {
        menu.style.right = '0';
    }, 50);
});

closeMenuBtn.addEventListener('click', () => {
    let width = screen.width;
    if (width <= 430) {
        menu.style.right = '-100%';
        setTimeout(() => {
            menu.style.display = 'none';
        }, 500);
    } else if (width >= 431 && width <= 767) {
        menu.style.right = '-50%';
    } else {
        menu.style.right = '-30%';
    }
});

const latestNewsBtn = document.getElementById('switch-to-latest-btn');
const latestNewsContainer = document.getElementById('latest-container');
latestNewsBtn.addEventListener('click', async e => {

    const menu = document.querySelector('aside');

    // let datakey;

    // const docRef = doc(db, 'tooling', 'kR19VTNHvTxVw9FgxZYB');
    // const docSnap = await getDoc(docRef);
    // if (docSnap.exists()) {
    //     datakey = docSnap.data().key;
    // } else {
    //     console.log('document does not exist!');
    // }

    const newsfeed = document.getElementById('news-container');
    const articleWindow = document.getElementById('article-container');

    const headText = document.getElementById('label');

    if (latestNewsBtn.innerText === 'Latest Stories') {

        if (latestNewsLoaded === true) {
            console.log('latest news already loaded!');
        } else {
            await getLatestNews(GNewsAPIKey);
        }

        latestNewsContainer.style.display = 'flex';
        newsfeed.style.display = 'none';
        articleWindow.style.display = 'none';

        latestNewsBtn.innerText = 'For You';
        document.title = 'Blink - Latest News'

        headText.innerText = 'Latest Stories';

        sessionStorage.setItem('backTo', 'latest');

    } else {

        latestNewsContainer.style.display = 'none';
        newsfeed.style.display = 'flex';
        articleWindow.style.display = 'none';

        latestNewsBtn.innerText = 'Latest Stories';
        document.title = 'Blink - For You';

        headText.innerText = 'Picks For You';

        sessionStorage.setItem('backTo', 'foryou');

    }

    menu.style.right = '-100%';
    setTimeout(() => {
        menu.style.display = 'none';
    }, 500);

});

const backToNewsBtn = document.getElementById('back-to-news-btn');
backToNewsBtn.addEventListener('click', () => {

    const newsfeed = document.getElementById('news-container');
    const articleWindow = document.getElementById('article-container');
    const searchContainer = document.getElementById('search-container');

    if (sessionStorage.getItem('backTo') === 'latest') {
        latestNewsContainer.style.display = 'flex';
        newsfeed.style.display = 'none';
        searchContainer.style.display = 'none';
        articleWindow.style.display = 'none';
    
        const UIHeader = document.querySelector('header');
        UIHeader.style.display = 'flex';
    
        document.title = 'Blink - Latest News';
    } else if (sessionStorage.getItem('backTo') === 'search') {
        latestNewsContainer.style.display = 'none';
        newsfeed.style.display = 'none';
        searchContainer.style.display = 'flex';
        articleWindow.style.display = 'none';
    
        const UIHeader = document.querySelector('header');
        UIHeader.style.display = 'flex';
    
        document.title = 'Blink - For You';
    } else if (sessionStorage.getItem('backTo') === 'foryou') {
        latestNewsContainer.style.display = 'none';
        newsfeed.style.display = 'flex';
        articleWindow.style.display = 'none';
        searchContainer.style.display = 'none';

        const UIHeader = document.querySelector('header');
        UIHeader.style.display = 'flex';
    
        document.title = 'Blink - For You';
    } else {
        latestNewsContainer.style.display = 'none';
        newsfeed.style.display = 'flex';
        articleWindow.style.display = 'none';
        searchContainer.style.display = 'none';

        const UIHeader = document.querySelector('header');
        UIHeader.style.display = 'flex';
    
        document.title = 'Blink - For You';
    }

});

// App functionality
// console.log('this is the one from onAuthChanged:', userUID);
setTimeout(async () => {
    const newDocRef = doc(db, 'users', auth.currentUser.uid);
    const newDocSnap = await getDoc(newDocRef);
    if (newDocSnap.exists()) {
        console.log('GNews API Key:', newDocSnap.data().gnews);
        GNewsAPIKey = newDocSnap.data().gnews;
        console.log('this is the gnews variable', GNewsAPIKey)
        await getNews(GNewsAPIKey, await getPreferences(auth.currentUser.uid));
    } else {
        console.log('document does not exist!');
        const text = document.createElement('p');
        text.innerText = "Oops, looks like you don't have a GNews API key!";
        const parent = document.getElementById('news-container');
        parent.appendChild(text);
    }
}, 500)

async function getPreferences(user) {
    const userDocRef = doc(db, 'users', user);
    const userDocSnap = await getDoc(userDocRef);
    let userPreferences = userDocSnap.data().preferences;
    return userPreferences
}

async function searchNews(key, query) {
    let url = 'https://gnews.io/api/v4/search?q=' + query + '&lang=en&country=us&max=10&apikey=' + key;
    await fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            for (let i = 0; i < data.articles.length; i++) {
                const container = document.getElementById('search-container');
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
                    document.title = data.articles[i]['title'];
                })
            };
        })
}

async function getLatestNews(key) {
    let url = 'https://gnews.io/api/v4/top-headlines?catergory=' + 'general' + '&lang=en&country=us&max=10&apikey=' + key;
    await fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            for (let i = 0; i < data.articles.length; i++) {
                const container = document.getElementById('latest-container');
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
                    sessionStorage.setItem('currentlyOn', 'article');
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
                    document.title = data.articles[i]['title'];
                })
            };
            latestNewsLoaded = true;
        })
};

async function getNews(key, preferences) {
    for (let x = 0; x < preferences.length; x++) {
        let url = 'https://gnews.io/api/v4/top-headlines?category=' + preferences[x] + '&lang=en&country=us&max=10&apikey=' + key;
        await fetch(url)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
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
                        sessionStorage.setItem('currentlyOn', 'article');
                        const UIHeader = document.querySelector('header');
                        UIHeader.style.display = 'none';
                        const articleHeadImg = document.getElementById('article-head-image');
                        articleHeadImg.src = data.articles[i]['image'];
                        const articleTitle = document.getElementById('article-title');
                        articleTitle.innerText = data.articles[i]['title'];
                        const publishDate = document.getElementById('publishDate');
                        let dateToDisplay = new Date(data.articles[i]['publishedAt']);
                        console.log('This is the formatted date: ', dateToDisplay);
                        publishDate.innerText = dateToDisplay;
                        const sourceText = document.getElementById('sourceText');
                        sourceText.href = data.articles[i]['url'];
                        const articleDescription = document.getElementById('article-description');
                        articleDescription.innerHTML = `${data.articles[i]['description']}<br>${data.articles[i]['content']}`;
                        const articleContainer = document.getElementById('article-container');
                        container.style.display = 'none';
                        articleContainer.style.display = 'flex';
                        document.title = data.articles[i]['title']
                    })
                };
            });
    }
    
}

const moreInfoBtn = document.getElementById('openai-info-btn');
moreInfoBtn.addEventListener('click', async e => {

    let ui = document.getElementById('ai-info-card');
    ui.style.display = 'flex';

    const genAI = new GoogleGenerativeAI(aiParam);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    let descriptionToPass = document.getElementById('article-description').innerText;
    
    const prompt = `Can you provide some additional context about the overall topic of this description: ${descriptionToPass}`;
    const result = await model.generateContentStream(prompt);

    let text = '';

    for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        text += chunkText;
        document.getElementById('ai-info-text').innerText = text;
    }

})

// Search functions
const searchbar = document.getElementById('search');
const searchBtn = document.getElementById('search-btn');
searchBtn.addEventListener('click', async e => {

    console.log('Query: ', searchbar.value);

    // let newskey = docSnap.data().key;

    const searchFeed = document.getElementById('search-container');
    searchFeed.innerHTML = '';

    await searchNews(GNewsAPIKey, searchbar.value);

    const latestNewsView = document.getElementById('latest-container');
    const forYouView = document.getElementById('news-container');
    const searchView = document.getElementById('search-container');
    const articleView = document.getElementById('article-container');

    searchView.style.display = 'flex';
    latestNewsView.style.display = 'none';
    forYouView.style.display = 'none';
    articleView.style.display = 'none';

    const header = document.getElementById('label');
    header.innerText = `Results For ${searchbar.value}`;

    if (sessionStorage.getItem('currentlyOn') === 'article') {
        const fullHeader = document.querySelector('header');
        fullHeader.style.display = 'flex';
    }

    sessionStorage.setItem('backTo', 'search');

});

searchbar.addEventListener('keypress', (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        searchBtn.click();
    }
})

searchbar.addEventListener('search', (e) => {
    const latestNewsView = document.getElementById('latest-container');
    const forYouView = document.getElementById('news-container');
    const searchView = document.getElementById('search-container');
    const articleView = document.getElementById('article-container');

    const text = document.querySelector('#label');
    
    if (sessionStorage.getItem('backTo') === 'latest') {
        searchView.style.display = 'none';
        latestNewsView.style.display = 'flex';
        forYouView.style.display = 'none';
        articleView.style.display = 'none';
        text.innerText = 'Latest Stories';
    } else {
        searchView.style.display = 'none';
        latestNewsView.style.display = 'none';
        forYouView.style.display = 'flex';
        articleView.style.display = 'none';
        text.innerText = 'Picks For You';
    }

    const searchFeed = document.getElementById('search-container');
    searchFeed.innerHTML = '';

})

// mobile searchbar functions
const mobileSearchbar = document.getElementById('search-mobile');
const mobileSearchBtn = document.getElementById('search-btn-mobile');

mobileSearchBtn.addEventListener('click', async e => {

    const menu = document.querySelector('aside');

    console.log('Query: ', mobileSearchbar.value);

    // let newskey = docSnap.data().key;

    const searchFeed = document.getElementById('search-container');
    searchFeed.innerHTML = '';

    await searchNews(GNewsAPIKey, mobileSearchbar.value);

    const latestNewsView = document.getElementById('latest-container');
    const forYouView = document.getElementById('news-container');
    const searchView = document.getElementById('search-container');
    const articleView = document.getElementById('article-container');

    searchView.style.display = 'flex';
    latestNewsView.style.display = 'none';
    forYouView.style.display = 'none';
    articleView.style.display = 'none';

    const header = document.getElementById('label');
    header.innerText = `Results For ${mobileSearchbar.value}`;

    if (sessionStorage.getItem('currentlyOn') === 'article') {
        const fullHeader = document.querySelector('header');
        fullHeader.style.display = 'flex';
    }

    menu.style.right = '-100%';
    setTimeout(() => {
        menu.style.display = 'none';
    }, 500);
    sessionStorage.setItem('backTo', 'search');

});

mobileSearchbar.addEventListener('keypress', (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        mobileSearchBtn.click();
    }
})

mobileSearchbar.addEventListener('search', (e) => {
    const latestNewsView = document.getElementById('latest-container');
    const forYouView = document.getElementById('news-container');
    const searchView = document.getElementById('search-container');
    const articleView = document.getElementById('article-container');

    const text = document.querySelector('#label');
    
    if (sessionStorage.getItem('backTo') === 'latest') {
        searchView.style.display = 'none';
        latestNewsView.style.display = 'flex';
        forYouView.style.display = 'none';
        articleView.style.display = 'none';
        text.innerText = 'Latest Stories';
    } else {
        searchView.style.display = 'none';
        latestNewsView.style.display = 'none';
        forYouView.style.display = 'flex';
        articleView.style.display = 'none';
        text.innerText = 'Picks For You';
    }

    const searchFeed = document.getElementById('search-container');
    searchFeed.innerHTML = '';

})

const blinkBtn = document.querySelector('.blink');
blinkBtn.addEventListener('click', () => {

    const latestNewsView = document.getElementById('latest-container');
    const forYouView = document.getElementById('news-container');
    const searchView = document.getElementById('search-container');

    latestNewsView.style.display = 'none';
    forYouView.style.display = 'flex';
    searchView.style.display = 'none';

    const header = document.getElementById('label');
    header.innerText = 'Picks For You';

    const fullHeader = document.querySelector('header');
    fullHeader.style.display = 'flex';

    const switchBtn = document.getElementById('switch-to-latest-btn');
    switchBtn.innerText = 'Latest Stories';

    sessionStorage.setItem('backTo', 'foryou');

})

const goToSettingsBtn = document.getElementById('settings-btn');
goToSettingsBtn.addEventListener('click', () => {
    location.href = '/account.html';
})

const helpGNewsBtn = document.getElementById('help-gnews-btn');
helpGNewsBtn.addEventListener('click', () => {
    window.open('/resources/gnews.html', '_blank')
    // location.href = '/resources/gnews.html';
});

const shareBtn = document.getElementById('shareBtn');
shareBtn.addEventListener('click', async (e) => {

    e.preventDefault();

    console.log('starting share!');

    try {
        const title = document.querySelector('#article-title').innerText;
        const date = document.querySelector('#publishDate').innerText;
        const description = document.querySelector('#article-description').innerText;
        await navigator.share({ title: `${title} - Blink`, url: `https://blink-20403.web.app/share?title=${title}&date=${date}&description=${description}`});
        console.log('data was shared!');
    } catch (err) {
        console.log(err)
    }

})