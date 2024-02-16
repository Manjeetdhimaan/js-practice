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
    if (tempSearchValue && tempSearchValue !== null) {
        localStorage.setItem('search-value', tempSearchValue);
    }

    if (suggestions && suggestions[0] !== null) {
        localStorage.setItem('suggestions', JSON.stringify(suggestions));
    }
    localStorage.setItem('color-scheme', document.querySelector('html').style.colorScheme || 'dark');
});

const getLocalStorageData = () => {

    const colorScheme = localStorage.getItem('color-scheme');
    if (colorScheme) {
        document.querySelector('html').style.colorScheme = colorScheme;
    }

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


const numbers = [1, 4, 1, 5, 2, 3, 6];
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

const checkTwoNumbers = (numArr, targetValue) => {
    const obj = {};
    for (let i = 0; i < numArr.length; i++) {
        const complement = targetValue - numArr[i];
        if (complement in obj) {
            console.log({
                ['index=' + i]: numArr[i],
                ['index=' + obj[complement]]: complement
            });
            // return
        }
        obj[numArr[i]] = i;
    }
    console.log(obj);
}

checkSum(numbers, 9);
checkTwoNumbers(numbers, 9);
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

function RegularFunction() {
    this.value = 1;
    console.log("Regular Function:", this);
    setTimeout(function () {
        // In non-strict mode, 'this' refers to the global object (window)
        // Using 'this.value++' here may result in unexpected behavior
        this.value++;
        console.log("Regular Function:", this);
    }, 1000);
}

// Usage
const regularObj = new RegularFunction();

const duplicateArr = [
    {
        id: 1,
        name: "Manjeet Singh"
    },
    {
        id: 1,
        name: "Manjeet Singh"
    },
    {
        id: 2,
        name: "Test Singh"
    },
];

//   function removeDuplicates(arr, key) {
//     return arr.filter((item, index) =>
//       key ? arr.findIndex(obj => obj[key] === item[key]) === index : arr.indexOf(item) === index
//     );
//   }

//   const uniqueArr = removeDuplicates(duplicateArr, 'id');
//   console.log(uniqueArr);

// const uniqueIds = duplicateArr.map(item => item.id);
// for(let item of duplicateArr) {
// const result = [];
// }
// console.log(uniqueArr);

function removeDuplicates(arr, key) {
    const result = [];
    const keys = [];
    for (let item of arr) {
        const keyValue = item[key];
        if (!keys.includes(keyValue)) {
            keys.push(keyValue);
            result.push(item);
        }
    }
    return result;
}

const uniqueValues = removeDuplicates(duplicateArr, 'id');

const uniqueArr = [...new Map(duplicateArr.map(obj => [obj.id, obj])).values()];

console.log(uniqueValues);

let ad = 10;
ad = "Test";
console.log(ad);


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
// In constructor function this keyword refers to the function itself


(function () {
    const arr = new Array('1000', 'test');
    console.log(arr);
    console.log(arr.length)
})();

function toggleMode() {
    const html = document.querySelector('html');
    const theme = document.querySelector('html').style.colorScheme;
    if (theme === 'dark' || theme === '') {
        html.style.colorScheme = 'light';
    }
    else {
        html.style.colorScheme = 'dark';
    }
}

const numersArray = [1, 3, 5, 15, 10, 13, 70, 20];

function secondLargest(arr) {
    let secondLargestNum = 0;
    let largerNumber = 0;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] > largerNumber) {
            secondLargestNum = largerNumber;
            largerNumber = arr[i];
        }
        else if (arr[i] > secondLargestNum && arr[i] !== largerNumber) {
            secondLargestNum = arr[i];
        }
    }
    return secondLargestNum;
}

console.log("secondLargest ==>", secondLargest(numersArray));


const getSum = (a, b) => {
    const promise = new Promise((resolve, reject) => {
        if(typeof a === 'number' && typeof b === 'number') {
            resolve(a+b)
        }
    });
    return promise;
}


async function getResult() {
    const res = await getSum(2, 3);
    return res;
}

console.log(getResult());


function outerFunction () {
    let a = 10;
    return function () {
        return 2 + a;
    }
}

const resultOfClosure = outerFunction();

console.log(resultOfClosure());


const arrayNumbers = [4, 6, 2, 1, 10, 9];

function sortArray(arr) {
    const length = arr.length
    for(let i = 0; i<length; i++) {
        for(let j=0; j<arr.length; j++) {
            if(arr[j] > arr[j + 1]) {
                const temp = arr[j];
                arr[j] = arr[j+1];
                arr[j+1] = temp;
            }
        }
    }
    return arr;
}

console.log(sortArray(arrayNumbers));

// let a = [1,2,3];
// let b = Array.from(a);
// a.push(4);
// console.log(a);
// console.log(b);

// let a = 7;
// let b = a;
// a = 10;
// console.log(a);
// console.log(b);

// function checkToken(req, res, next) {

//     const userToken = "token1";
//     const token  = req.headers['Authorization'].split;
//     if(token === userToken) {
//         next();
//     }
//     else {
//         return res.status(404).json({
            
//         });
//     }
// }

// app.get('api/get-user', checkToken, function());


// db.collection.find({
//     "$gt": 1000,
// }).sort({salary: -1}).limit(3).skip(2);