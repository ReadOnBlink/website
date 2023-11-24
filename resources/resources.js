import { app as firebase } from '../firebase-config.js';

console.log(firebase);

let url;
let urlArray;

window.addEventListener('load', () => {

    url = location.href;
    urlArray = url.split('/')
    console.log(urlArray)

    if (urlArray[4] === 'welcome.html' || urlArray[4] === 'welcome') {
        const gnewsBtn = document.getElementById('gnews');
        const openaiBtn = document.getElementById('openai');
        const privacyBtn = document.getElementById('privacy');
        gnewsBtn.addEventListener('click', () => {
            location.href = '/resources/gnews.html';
        }) 
        openaiBtn.addEventListener('click', () => {
            location.href = '/resources/openai.html'
        })
        privacyBtn.addEventListener('click', () => {
            location.href = '/privacy.html'
        })
    }

})