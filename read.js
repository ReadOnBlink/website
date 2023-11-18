import { app as firebase } from './firebase-config.js';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, getDocs, getDoc } from 'firebase/firestore'; 

// check if firebase is connected
console.log(firebase);

// init auth and db
const auth = getAuth(firebase);
const db = getFirestore(firebase);

let latestNewsLoaded;
let hasOpenAI;
let openaiApiKey;

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
            if (!docSnap.data().openai || docSnap.data().openai === '') {
                hasOpenAI = false;
                console.log('openai status:', hasOpenAI)
            } else {
                hasOpenAI = true;
                console.log('openai status:', hasOpenAI)
                openaiApiKey = docSnap.data().openai;
            }
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

const latestNewsBtn = document.getElementById('switch-to-latest-btn');
const latestNewsContainer = document.getElementById('latest-container');
latestNewsBtn.addEventListener('click', async e => {

    const menu = document.querySelector('aside');

    let datakey;

    const docRef = doc(db, 'tooling', 'kR19VTNHvTxVw9FgxZYB');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        datakey = docSnap.data().key;
    } else {
        console.log('document does not exist!');
    }

    const newsfeed = document.getElementById('news-container');
    const articleWindow = document.getElementById('article-container');

    const headText = document.getElementById('label');

    if (latestNewsBtn.innerText === 'Latest Stories') {

        if (latestNewsLoaded === true) {
            console.log('latest news already loaded!');
        } else {
            await getLatestNews(datakey);
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
                };
            });
    }
    
}

const moreInfoBtn = document.getElementById('openai-info-btn');
moreInfoBtn.addEventListener('click', () => {

    if (hasOpenAI === true) {
        console.log('calling GPT3!');
        let contentToExplain = document.getElementById('article-title').innerText;
        const endpoint = 'https://api.openai.com/v1/chat/completions';
        const data = {
            "model": "gpt-3.5-turbo",
            "messages": [
              {
                "role": "system",
                "content": "You are a researcher and writer specializing in giving out context."
              },
              {
                "role": "user",
                "content": `Please give me extra context on this overall subject. It doesn't have to be current information: ${contentToExplain}`
              },
              {
                "role": "assistant",
                "content": "Don't say that you only have information up until 2022, just say the content"
              },
            ]
          }
          
          // Set up the fetch request
          fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${openaiApiKey}`,
            },
            body: JSON.stringify(data),
          })
            .then((response) => {
            //   if (!response.ok) {
            //     throw new Error('Network response was not ok');
            //   }
              return response.json();
            })
            .then((data) => {
              // Handle the response data here
              console.log(data.choices[0].text); // This will contain the generated text
              const card = document.getElementById('ai-info-card');
              card.innerText = data.choices[0].text;
              card.style.display = 'flex';
              moreInfoBtn.style.display = 'none';
            })
            .catch((error) => {
              // Handle any errors here
              console.error('Error:', error);
            });
    } else {
        console.log('user hasnt integrated openai!');
    }

})

// Search functions
const searchbar = document.getElementById('search');
const searchBtn = document.getElementById('search-btn');
searchBtn.addEventListener('click', async e => {

    console.log('Query: ', searchbar.value);

    let newskey = docSnap.data().key;

    const searchFeed = document.getElementById('search-container');
    searchFeed.innerHTML = '';

    await searchNews(newskey, searchbar.value);

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

    let newskey = docSnap.data().key;

    const searchFeed = document.getElementById('search-container');
    searchFeed.innerHTML = '';

    await searchNews(newskey, mobileSearchbar.value);

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

})

const goToSettingsBtn = document.getElementById('settings-btn');
goToSettingsBtn.addEventListener('click', () => {
    location.href = '/account.html';
})