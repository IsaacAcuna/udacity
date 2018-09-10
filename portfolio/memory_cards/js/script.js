const cardData = [{
        file: '1.svg',
        name: 'Donut of Partial Integrity',
        msg: 'Someone already bit this donut?! It\'s mine now!',
        flipped: 0,
        matched: 0,
        points: 100,
        effect: '+5',
    },
    {
        file: '2.svg',
        name: 'Jar of Questionable Expiration',
        msg: 'You\'ll be fine, just... fine...',
        flipped: 0,
        matched: 0,
        points: 250,
        effect: '-30',
    },
    {
        file: '3.svg',
        name: 'Orange of Enlightenment',
        msg: 'You feel a surge of pure intellectual power.',
        flipped: 0,
        matched: 0,
        points: 250,
        effect: '+30',
    },
    {
        file: '4.svg',
        name: 'Pear of Unending Woe',
        msg: 'You are weary after dealing with such an exhausting foe!',
        flipped: 0,
        matched: 0,
        points: 175,
        effect: '-25'
    },
    {
        file: '5.svg',
        name: 'Honeycomb of Fortified Resolve',
        msg: 'The honey comb begins to glow as your resolve strengthens.',
        flipped: 0,
        matched: 0,
        points: 175,
        effect: '+25',
    },
    {
        file: '6.svg',
        name: 'Oven Mitt of Smiting',
        msg: 'Bake this, punk!',
        flipped: 0,
        matched: 0,
        points: 125,
        effect: '+10',
    },
    {
        file: '7.svg',
        name: 'Steak of Gluttony',
        msg: 'You have been struck by a servere case of the itis.',
        flipped: 0,
        matched: 0,
        points: 125,
        effect: '-10',
    },
    {
        file: '8.svg',
        name: 'Mushrooms of Nostalgia',
        msg: 'Hrmm, I don\'t feel like I\'ve grown significantly...',
        flipped: 0,
        matched: 0,
        points: 100,
        effect: '-5',
    }
];

function getUserData() {
    let userData = getCookie('ThoughtNotData');
    if (userData) {
        return JSON.parse(userData);
    } else {
        return 0;
    }
}

function setUserData(userObj) {
    let userPayload = JSON.stringify(userObj);
    if (userPayload) {
        setCookie('ThoughtNotData', userPayload, 7);
        return 1;
    }
}

function setCookie(name, value, days) {
    console.log("setCookie called");
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    var name = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return null;
}

function eraseCookie(name) {
    document.cookie = name + '=; Path=/; Max-Age=-99999999;';
}

function shuffle(cardData) {
    const cardDeck = cardData.slice(0);
    const shuffledCards = [];
    while (cardDeck.length) {
        let cardNum = Math.floor(Math.random() * cardDeck.length);
        shuffledCards.push(cardDeck[cardNum]);
        cardDeck.splice(cardNum, 1);
    }
    return shuffledCards;
}

function welcome() {
    let user = new Object();
    user.name = prompt("Welcome to thought not! \n\nPlease enter player name", "");
    if (user != null) {
        return user;
    } else {
        welcome();
    }
}

function buildCards(cardData) {
    for (let [card, data] of Object.entries(cardData)) {
        const cardDiv = document.getElementById("card" + card);
        cardDiv.style.backgroundImage = "url('./img/" + data.file + "')";
        cardDiv.setAttribute('card-name', data.name);
        cardDiv.setAttribute('card-msg', data.msg);
        cardDiv.setAttribute('points', data.points);
        cardDiv.setAttribute('effect', data.effect);
        cardDiv.setAttribute('flipped', data.msg);
        cardDiv.setAttribute('matched', data.msg);
        if (data.flipped) {
            cardDiv.classList.add('flipped');
            cardDiv.classList.remove('hidden');
        }
        if (data.matched) {
            cardDiv.classList.add('matched-card')
        }
    }
}

function flipFlop() {
    let myFlippedCards = document.getElementsByClassName("cards");
    for (let i = 0; i < myFlippedCards.length; i++) {
        if (!myFlippedCards[i].classList.contains("matched-card")) {
            if (myFlippedCards[i].classList.contains("flipped")) {
                myFlippedCards[i].classList.add('hidden');
                myFlippedCards[i].classList.remove("flipped");
            } else {
                myFlippedCards[i].classList.remove("flipped");
            }
        }
    }

    let myHiddenCovers = document.getElementsByClassName("cover");
    for (let i = 0; i < myHiddenCovers.length; i++) {
        if (!myHiddenCovers[i].classList.contains("matched-card")) {
            myHiddenCovers[i].classList.remove('hidden');
        }
    }
}

function parseStrTime(strTime) {
    return Math.floor(parseInt(strTime, 10) * 1000);
}

function gameOver() {
    console.log("TODO: Game Is Over");
}

function gameTime( strTime ) {
    let gameTime = new Date().getTime() + parseStrTime('+120');
    if ( strTime ) {
        gameTime = Math.abs(gameTime + parseStrTime(strTime));   
    }
    
    return gameTime
}

function matchCheck() {

    let myFlippedCards = document.querySelectorAll('.flipped:not(.matched-card)');

    if (myFlippedCards.length == 2) {
        if (myFlippedCards[0].getAttribute("card-name") === myFlippedCards[1].getAttribute("card-name")) { // It's a match

            let cardName = myFlippedCards[0].getAttribute("card-name");
            let cardMsg = myFlippedCards[0].getAttribute("card-msg");

            myFlippedCards[0].setAttribute('flipped', '1');
            myFlippedCards[0].classList.add('matched-card');
            myFlippedCards[0].nextElementSibling.classList.add('matched-card');

            myFlippedCards[1].setAttribute('flipped', '1');
            myFlippedCards[1].classList.add('matched-card');
            myFlippedCards[1].nextElementSibling.classList.add('matched-card');

            setTimeout(function() {
                flipFlop();
            }, 500);
            return myFlippedCards[0];
        } else { // not a match
            setTimeout(function() {
                flipFlop();
            }, 500);
            return false;
        }
    }
}

function processCards(cardElement) {
    cardElement.classList.add("flipped"); // Flip the card
    cardElement.classList.remove("hidden"); // Do not hide it
    let user = getUserData();
    let matchedCard = matchCheck();
    let matchCount = 0;
    if (!user.matchCount) {
        user.matchCount = 1;
    } else {
        matchCount = user.matchCount;
    }
    let flipCount = 0; // Card flip counter
    if (!user.flipCount) {
        user.flipCount = 1;
    } else {
        flipCount = user.flipCount;
    }
    flipCount++;
    if (matchedCard) {
        matchCount++;
        user.score = userScore(matchedCard);
        user.time = getAttribute(matchedCard, "points")
        //timer(getAttribute(points));
        timer('+120');
    }
    user.flipCount = flipCount;
    user.matchCount = matchCount;
    setUserData(user);
}

function cardControl(clickedElements) {
    let myFlippedCards = document.querySelectorAll('.flipped:not(.matched-card)');
    if (myFlippedCards.length <= 2) {
        for (let i = 0; i < clickedElements.length; i++) {
            if (clickedElements[i].classList.contains("cards")) {
                processCards(clickedElements[i]);
            }
            if (clickedElements[i].classList.contains("cover")) {
                if (clickedElements[i].classList.contains("cover")) {
                    clickedElements[i].classList.add("hidden");
                }
            }
        }
    }
}



function timer() {
    let timerDisplay = document.getElementById("timer");
    let currentTime  = new Date().getTime();
    const playTime = setInterval(function() {
        
        let timeRemainder = Math.abs( gameTime - currentTime );
        let minutes = Math.floor((timeRemainder % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((timeRemainder % (1000 * 60)) / 1000)
        timerDisplay.innerHTML = minutes + ":" + seconds;
        
        if (timeRemainder < 0) {
            console.log("Time is up!");
            clearInterval(playTime);
            gameOver();
        }
    }, 1000 );
}

function startGame() {
    let user = getUserData();
    if (!user) {
        user = welcome();
        const deckOne = cardData.slice(0); // Get first deck of random cards
        const deckTwo = cardData.slice(0); // Get second deck of random cards
        const cardSet = shuffle(deckOne.concat(deckTwo)); // combine them into a single array
        user.cardSet  = cardSet;
        user.score = 0;
        user.time = 0;
        setUserData(user);
        buildCards(cardSet); // Build complete set from decks and add content to HTML.
    } else {
        buildCards(user.cardSet);
    }
    setBoard();
    timer();
}

function setBoard() {
    const myCards = document.getElementsByClassName("card-container"); // Get all card-container elements
    for (let i = 0; i < myCards.length; i++) { // Loop through cards
        myCards[i].style.display = "block"; // deal our hand
        myCards[i].addEventListener("click", function() { // set listeners for each card element
            let cardCover = this.children; // Get list of children of card-container
            cardControl(cardCover); // Pass child list to cardControl function
        });
    }
}

function userScore(matchedCard) {
    let user = getUserData();
    let matchScore = matchedCard.getAttribute("points")
    user.score = parseInt(user.score, 10) + parseInt(matchScore, 10);
    return user.score;
}

document.addEventListener('DOMContentLoaded', function() { // Document ready
    let user = getUserData();
    const startDiv = document.getElementById("start");
    const startBtn = document.getElementById("start-game");
    if (!user.cardSet) {
        startBtn.addEventListener("click", function() {
            startDiv.style.display = "none";
            startDiv.parentElement.style.display = "none";
            startGame();
        });
    } else if (user.cardSet) {
        startDiv.style.display = "none";
        startDiv.parentElement.style.display = "none";
        setTimeout(function() {
            startGame();
        }, 500);
    }

});