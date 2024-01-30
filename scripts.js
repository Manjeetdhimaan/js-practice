"use strict";

let isSuggestionAdded = false;
let suggestions = [];
const ele = document.getElementById('search-suggesstions');
const backdrop = document.getElementById('backdrop');
const inputSearch = document.getElementById('input-search');
let tempSearchValue = '';

let init = true;

let selectedIndex;

const worker = new Worker('./worker.js');

// Listen for messages from the worker
worker.onmessage = function (event) {
    // Handle the message received from the worker
    console.log('Received message from worker:', event.data);
};

// Start the loop in the worker
// worker.postMessage('startLoop');

window.addEventListener('unload', () => {
    localStorage.setItem('search-value', tempSearchValue);
    localStorage.setItem('suggestions', JSON.stringify(suggestions));
});

const getLocalStorageData = () => {
    const searchValue = localStorage.getItem('search-value');
    if (searchValue) {
        tempSearchValue = searchValue;
    }

    const localSuggestions = localStorage.getItem('suggestions');
    if (localSuggestions) {
        suggestions = JSON.parse(localSuggestions);
    }
}

getLocalStorageData();

const getData = (value) => {
    if (value && value.trim() !== '' && !selectedIndex && (!isSuggestionAdded || !suggestions || suggestions.length <= 0)) {
        suggestions.push(value);
        tempSearchValue = value;
        renderSuggestions();
        isSuggestionAdded = true;
    }
    if ((value && value.trim() !== '') && isSuggestionAdded || selectedIndex && selectedIndex >= 0) {
        if (selectedIndex && selectedIndex >= 0) {
            suggestions[selectedIndex] = value;
        }
        else {
            suggestions[suggestions.length - 1] = value;
        }
        tempSearchValue = value;
        renderSuggestions();
    }
}

const debounce = (fn, delay) => {
    let timer;
    return (...args) => {
        if (timer) clearTimeout(timer);

        timer = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    }
}

const throttle = (fn, limit) => {
    let flag = true;
    return function (...args) {
        if (flag) {
            fn.apply(this, args);
            flag = false;
            setTimeout(() => {
                flag = true;
            }, limit);
        }
    }
}

const getDataByDebouncing = debounce(getData, 300);
// const getDataByDebouncing = throttle(getData, 1000);

const showSuggestions = () => {
    if (!suggestions || suggestions.length <= 0) {
        ele.classList.remove('show');
        backdrop.classList.remove('show');
        isSuggestionAdded = false;
        return;
    }
    if (ele) {
        ele.classList.add('show');
        backdrop.classList.add('show');
        inputSearch.value = tempSearchValue;
    }
}

const hideSuggestions = () => {
    if (ele && backdrop) {
        ele.classList.remove('show');
        backdrop.classList.remove('show');
        isSuggestionAdded = false;
        inputSearch.value = '';
    }
}

function animateHeight(element, targetHeight, duration) {
    const startHeight = element.offsetHeight;
    const startTime = performance.now();

    function step(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        const newHeight = startHeight + progress * (targetHeight - startHeight);

        element.style.maxHeight = newHeight + 'px';
        element.style.overflow = 'hidden';

        if (progress < 1) {
            requestAnimationFrame(step);
        }
    }
    requestAnimationFrame(step);
}

const renderSuggestions = () => {
    const uElement = document.getElementById('search-suggesstions-ul');
    uElement.innerHTML = '';
    if (!suggestions || suggestions.length <= 0) {
        ele.classList.remove('show');
        backdrop.classList.remove('show');
        isSuggestionAdded = false;
        tempSearchValue = '';
        inputSearch.value = '';
        return;
    }
    if (ele && !init) {
        ele.classList.add('show');
        backdrop.classList.add('show');
    }
    suggestions.forEach((suggestion, i) => {
        const li = document.createElement('li');
        const icon = document.createElement('span');
        icon.innerHTML = '&#10005;';
        icon.classList.add('cross');
        const suggestionTextNode = document.createTextNode(suggestion);
        li.appendChild(suggestionTextNode);

        li.addEventListener('click', () => {
            inputSearch.value = suggestionTextNode.textContent;
            tempSearchValue = suggestionTextNode.textContent;
            selectedIndex = i;
            if (!suggestions || suggestions.length <= 0) {
                tempSearchValue = '';
                inputSearch.value = '';
            }
        });

        icon.addEventListener('click', () => {
            suggestions = suggestions.filter(suggestion => suggestion !== suggestionTextNode.textContent);
            renderSuggestions();
        })

        li.appendChild(icon);
        uElement.appendChild(li);

        li.offsetHeight;

        // Animate the height
        animateHeight(uElement, uElement.scrollHeight, 300); // Adjust duration as needed

    });
}

renderSuggestions();

// Logical questions;

// recursive functions

const user = {
    name: "Manjeet Singh",
    address: {
        personal: {
            city: "Samana",
            dist: "Patiala",
            area: "Kakrala"
        },
        office: {
            city: "Mohali",
            dist: "Mohali",
            area: {
                landmark: "Mohali tower",
                details: {
                    sector: "74",
                    phase: "8b"
                }
            }

        }
    },
    x: function () {
        console.log(this);
    }
}

user.x();

const result = {};
const recursive = (obj, parent) => {
    for (let key in obj) {
        if (typeof obj[key] === 'object') {
            recursive(obj[key], parent + '_' + key);
        }
        else {
            result[parent + '_' + key] = obj[key];
        }
    }

}

recursive(user, 'user');
console.log(result);
//  recursive ends


// array sorting

const timeArray = ['10:00AM', '12:00AM', '01:00PM', '01:00AM', '10:00PM'];

const convertTo24Hours = (time) => {
    const period = time.slice(-2);
    const hours = +(time.slice(0, 2));
    return period.toUpperCase() === 'PM' ? (hours + 12) : hours;
}

const sortedTImeArray = timeArray.sort((a, b) => {
    let time24hA = convertTo24Hours(a);
    let time24hB = convertTo24Hours(b);
    if (time24hA === 12) {
        time24hA = 0;
    }
    if (time24hB === 12) {
        time24hB = 0;
    }
    return time24hA - time24hB;
});
console.log(sortedTImeArray);
// sorted array ends


const numbers = [1, 4, 7, 5, 2, 3, 6];
// check if any two values in the have a sum of 9 without using nested

const checkSum = (numArr, sumTarget) => {
    const pairSumValues = [];
    const seenNumbers = new Set();
    for (let num of numArr) {
        const complement = sumTarget - num;
        if (seenNumbers.has(complement) && !seenNumbers.has(num)) {
            pairSumValues.push(
                {
                    first: num,
                    second: complement
                }
            );
        }
        seenNumbers.add(num);
    }
    console.log(pairSumValues);
}

checkSum(numbers, 9);
// finished

// promises

let isValid = true;
const promise = new Promise((resolve, reject) => {
    if (isValid) {
        resolve('Success!');
    }
    else {
        const error = new Error('Failed!');
        reject(error);
    }
});

promise.catch(err => {
    console.log(err.message)
}).then(res => {
    console.log(res, 'I will be called what so ever');
});

const p1 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('P1 is resolved');
    }, 3000);
});

handleCallback();

async function handlePromise() {
    const res = await p1;
    console.log(res);
}

function handleCallback() {
    setTimeout(() => {
        console.log('Callback finished');
    }, 3000);
}

function handleFn() {
    console.log('handleFn finished');
}

handlePromise();
handleFn();

init = false;

// function bluify(e) {
//     console.log(this === e.currentTarget);
//     console.log(this === e.target);
//     this.style.backgroundColor = "#A5D9F3";
//   }
  
//   const elements = document.getElementsByTagName("*");
//   for (const element of elements) {
//     element.addEventListener("click", bluify, false);
//   }

// this refers to globalObject in normal functions and if used globally in non-strict mode.
// In Strict mode - this keyword is undefined if used inside normal function.
// this substituion - when this keyword is undefined or null, it is replaced by global object.
// In objects- If normal function is used, it refers to the object in which this keyword is used and in arrow functions it referes to its lexical context (which may be global object if object is declared globally).
// In arrow functions, this keyword referes to lexical context.
// this keyword behaves how and where this keyword is used.