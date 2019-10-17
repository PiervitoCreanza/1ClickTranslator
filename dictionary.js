var fs = require('fs');
var jsonPath = 'dictionary.json';
var dictionary = JSON.parse(fs.readFileSync(jsonPath)).dictionary.words;
var pos = document.getElementById('pos');
var $ = require("jquery");

var word = []
var translation = []
for (let key in dictionary) {
    if (jsonPath.hasOwnProperty(key)) {
        word.push(dictionary[key].original)
        translation.push(dictionary[key].translation)
    }
    
}

console.log(word)
console.log(translation)
var html = []
for (let i = 0; i< word.length; i++) {
    var flipBox = `<div class="flip-box" oncontextmenu="rightClick(${word.length - i - 1})">
        <div class="flip-box-inner">
            <div class="flip-box-front">
            <h1 id="dcWord">${word[i]}</h1>
            </div>
            <div class="flip-box-back">
            <h1 id="dcTranslation">${translation[i]}</h1>
            </div>
        </div>
    </div>`
    html.push(flipBox);
}

for (let el in html) {
    pos.insertAdjacentHTML('afterend', html[el]);
}

function rightClick (elementNumber) {
    element = $(".flip-box")[elementNumber]
    console.log(element)
    fadeOutEffect(element)
} 

function fadeOutEffect(fadeTarget) {
    var fadeEffect = setInterval(function () {
        if (!fadeTarget.style.opacity) {
            fadeTarget.style.opacity = 1;
        }
        if (fadeTarget.style.opacity > 0) {
            fadeTarget.style.opacity -= 0.1;
            
        } else {
            clearInterval(fadeEffect);
        }        
    }, 20);
}