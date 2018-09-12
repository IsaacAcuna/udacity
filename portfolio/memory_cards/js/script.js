"use strict";

const cardData = [{
        file: '1.svg',
        name: 'Donut of Partial Integrity',
        msg: 'Someone already bit this donut?! It\'s mine now!',
        points: 100,
        effect: '-5',
    },
    {
        file: '2.svg',
        name: 'Jar of Questionable Expiration',
        msg: 'You\'ll be fine, just... fine...',
        points: 250,
        effect: '+30',
    },
    {
        file: '3.svg',
        name: 'Orange of Enlightenment',
        msg: 'You feel a surge of pure intellectual power.',
        points: 250,
        effect: '-30',
    },
    {
        file: '4.svg',
        name: 'Pear of Unending Woe',
        msg: 'You are weary after dealing with such an exhausting foe!',
        points: 175,
        effect: '+25'
    },
    {
        file: '5.svg',
        name: 'Honeycomb of Fortified Resolve',
        msg: 'The honey comb begins to glow as your resolve strengthens.',
        points: 175,
        effect: '-25',
    },
    {
        file: '6.svg',
        name: 'Oven Mitt of Smiting',
        msg: 'Bake this, punk!',
        points: 125,
        effect: '-10',
    },
    {
        file: '7.svg',
        name: 'Steak of Gluttony',
        msg: 'You have been struck by a servere case of the itis.',
        points: 125,
        effect: '+10',
    },
    {
        file: '8.svg',
        name: 'Mushrooms of Nostalgia',
        msg: 'Hrmm, I don\'t feel like I\'ve grown significantly...',
        points: 100,
        effect: '+5',
    }
];

function Player(name) { // Player constructor
    this.name = name;
    this.time = 0;
    this.matchCount = 0;
    this.flipCount = 0;
    this.playerRatio = 0;
    this.timeBonus = [];
    this.points = [];
}

Player.prototype = { // Player methods
    constructor: Player,
    addTime: function(time) {
        this.timeBonus.push(time);
    },
    addPoints: function(pointsAddition) {
        this.points.push(pointsAddition);
    },
    getEffects: function() {
        let bonus = this.timeBonus.length > 0 ? this.timeBonus.join(",") : "No bonuses";
        return bonus;
    },
    getPoints: function() {
        let points = this.points.length > 0 ? this.points.join(",") : "No points";
        return points;
    },
    getTime: function() {
        return this.time;
    },
    getRatio: function() {
        return this.playerRatio;
    },
    getFlips: function() {
        return this.flipCount;
    }
}

function getUserData() { // Get user's cookie and parse it into an object
    let userData = getCookie('GroceryList');
    if (userData) {
        return JSON.parse(userData);
    }
    return false;
}

function setUserData(userObj) { // store user object as JSON string in cookie
    let userPayload = JSON.stringify(userObj);
    if (userPayload) {
        setCookie('GroceryList', userPayload, 7);
        return true;
    }
    return false;
}

function setCookie(name, value, days) { // Set a cookie
    console.log("setCookie called");
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
    return true;
}

function getCookie(name) { // Get a cookie
    var name = name + "=";
    var ca = document.cookie.split(';'); 
    for (var i = 0; i < ca.length; i++) { // Iterate through list of cookies
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length); // if named cookie exists return it's content
    }
    return null;
}

function eraseCookie(name) { // Expire a cookie
    document.cookie = name + '=; Path=/; Max-Age=-99999999;';
    return true;
}

function popUp(content, dismissable) { // Create a modal with content, that may be dismissable.
    let modal = document.getElementById('modal');
    let msg = document.getElementById('modal-msg')
    msg.innerHTML = content;
    modal.style.display = "block";
    if (dismissable !== undefined) { // If we need to create a listener for a dismissal button.
        let modalBtn = document.getElementById('dismiss-modal');
        modalBtn.onclick = function() {
            modal.style.display = "none";
        }
    }
    return true;
}

function shuffle(cardData) { // clone input array and return new array with random order. 
    const cardDeck = cardData.slice(0);
    const shuffledCards = [];
    while (cardDeck.length) { // While there are still any values in the cloned array, do things.
        let cardNum = Math.floor(Math.random() * cardDeck.length);
        shuffledCards.push(cardDeck[cardNum]);
        cardDeck.splice(cardNum, 1);
    }
    return shuffledCards;
}

function buildCards(cardData) { // Parse a cardSet and apply the HTML content to the cards.
    for (let [card, data] of Object.entries(cardData)) {
        const cardDiv = document.getElementById("card" + card);
        cardDiv.style.backgroundImage = "url('./img/" + data.file + "')";
        cardDiv.setAttribute('card-name', data.name);
        cardDiv.setAttribute('card-msg', data.msg);
        cardDiv.setAttribute('points', data.points);
        cardDiv.setAttribute('effect', data.effect);
    }
    return true;
}

function parseTime(secs) { // convert time from seconds to HTML content
    let minutes = Math.floor(secs / 60);
    let seconds = secs - minutes * 60;
    if (seconds < 10 && seconds >= 0) {
        seconds = "0" + seconds
    };
    if (secs >= 0 && minutes > 0) {
        return '<span id="time"> ' + minutes + ' : ' + seconds + '</span>';
    } else if (secs >= 0 && minutes <= 0) {
        return '<span id="time">' + seconds + ' Seconds</span>';
    } else {
        return '<span id="time">Time Traveler!</span>'; // A user can get a match bonus that will give them negative time, this is a small added feature.
    }
}

function welcome() { // Get player name and create player object
    let name = prompt("Welcome to your foodie-memory nightmare! \n\nPlease enter player name", "");
    let user;
    if (name != null) {
        user = new Player(name);
    } else {
        user = new Player("Goofus"); // If a name is not provided, give them a silly name
    }
    return user;
}

function scoreBoard(user) { // Launch game timer and display stats on the scoreboard.
    let curTime = user.getTime();
    let timerSpan = document.getElementById("timer");
    let pointsSpan = document.getElementById("points");
    let movesSpan = document.getElementById("moves");
    let playTime = setInterval(function() { // Run every second until stopped
        let playerMoves = user.getFlips();
        let effectsSum = user.timeBonus.length > 0 ? user.timeBonus.reduce((a, b) => a + b, 0) : 0; // Get the sum of the time bonus array
        let pointsSum = user.points.length > 0 ? user.points.reduce((a, b) => a + b, 0) : 0; // Get the sum of the points array
        let timerInterval = effectsSum + curTime++;
        let gameTime = parseTime(timerInterval);
        pointsSpan.innerHTML = parseInt(pointsSum, 10);
        timerSpan.innerHTML = gameTime;
        movesSpan.innerText = playerMoves;
        user.time = timerInterval;
        setStars(user);
        if (user.matchCount === 8) { // Game is complete, clear the timer and initiate game end.
            clearInterval(playTime);
            gameOver(user);
        }
    }, 1000);
}

function setStars(user) { // Handles the calculation of a users rating
    let ratio = user.getRatio();
    if (ratio) { // If the user has a ratio do things.
        let stars;
        let starMsg;
        if (ratio >= 0 && ratio <= 0.05) {
            stars = 1;
            starMsg = 'You\'re stuck behind an old lady paying with a check.';
        }
        if (ratio > 0.05 && ratio <= 0.15) {
            stars = 2;
            starMsg = 'You fumble to gather exact change.';
        }
        if (ratio > 0.15 && ratio <= 0.20) {
            stars = 3;
            starMsg = 'The cashier has a glint of hope in their eyes.';
        }
        if (ratio > 0.20 && ratio <= 0.35) {
            stars = 4;
            starMsg = 'The bagger is pretty impressed!';
        }
        if (ratio > 0.35) {
            stars = 5;
            starMsg = 'You\'re a grocery store legend!';
        }

        let starDisplay = document.getElementsByClassName("fa-star");
        for (let i = 0; i < starDisplay.length; i++) { // Clear any previous ratings
            starDisplay[i].classList.remove("enabled");
        }
        for (let i = 0; i < stars; i++) { // Apply the appropriate new star ratings
            starDisplay[i].classList.add("enabled");
        }
        user.starMsg = starMsg; // Store the message associated with the star rating.
    }

}

function resetGame(user) { // Try again or new game
    if (user !== undefined) {
        setUserData(user); // write user's data to cookie
    } else {
        eraseCookie("GroceryList"); // If there is no user it's a new game
    }
    location.reload(); // reload the page.
}

function gameOver(user) { // Handle game completion
    const finalTime = user.getTime();
    const pointsSum = user.points.length > 0 ? user.points.reduce((a, b) => a + b, 0) : 0;
    let timeBonus;
    let bonusDesc;
    // Logic to apply a 'time bonus' for expeditious player
    if (finalTime <= 40) {
        bonusDesc = "40 seconds or less!";
        timeBonus = Math.floor(pointsSum * 2);
    } else if (finalTime > 40 && finalTime <= 60) {
        bonusDesc = "A minute or under!";
        timeBonus = Math.floor(pointsSum + pointsSum);
    } else if (finalTime > 60 && finalTime <= 120) {
        bonusDesc = "Within two minutes"
        timeBonus = Math.floor(pointsSum + (pointsSum / 2));
    } else if (finalTime > 120) {
        bonusDesc = "Over two minutes"
        timeBonus = 0;
    }
    const finalScore = pointsSum + timeBonus;
    const stars = document.getElementById("stars");
    const buttons = document.getElementById("game-controls");
    const starHTML = stars.innerHTML;
    const buttonHTML = '<div id="game-controls"><button id="try-again-over">Try Again</button><button id="new-game-over">New Game</button></div>';
    const html = '<div id="popup-container"><h1> Congratulations! </h1><p>' + user.starMsg + '</p><p>' + starHTML + '</p><ul class="score-card"><li>Matched Card Bonus: <span class="bold">' + pointsSum + '</span></li><li>Resolution Time: <span class="bold">' + parseTime(user.time) + '</span></li><li>Time Bonus: <span class="bold">' + timeBonus + ' (' + bonusDesc + ')</span></li><li>Final Score: <span class="bold">' + finalScore + '</span></ul>' + buttonHTML + '</div>'; 
    popUp(html)
    const tryAgain = document.getElementById("try-again-over");
    const newGame = document.getElementById("new-game-over");
    tryAgain.addEventListener("click", function() {
        resetGame(user);
    });
    newGame.addEventListener("click", function() {
        resetGame();
    });
}

function startGame() { // Initiate game and build the cards
    let user; 
    let userData = getUserData();
    if (!userData) { // if we have no cookie, start a fresh game
        user = welcome(); // Get new player name/object
        const deckOne = cardData.slice(0);
        const deckTwo = cardData.slice(0); 
        const cardSet = shuffle(deckOne.concat(deckTwo)); // shuffle decks
        user.cardSet = cardSet;
        buildCards(cardSet); // Build from decks and add content to page.
    } else { // populate the user's name and cardSet from the previous game.
        user = new Player(userData.name); // Create new user object
        user.cardSet = userData.cardSet; 
        buildCards(user.cardSet); // build from cookie and add content to page
    }
    setBoard(user); // Create listeners for dealt cards
    scoreBoard(user); // start game time
}

function setBoard(user) { // create listeners and pass clicks to cardControl
    const nameDiv = document.getElementById("user-name");
    const myCards = document.getElementsByClassName("card-container");
    const tryAgain = document.getElementById("try-again");
    const newGame = document.getElementById("new-game");
    const modal = document.getElementById('modal');
    const closeModal = document.getElementsByClassName("close-modal")[0];
    nameDiv.innerText = user.name + '\'s Rating:';
    
    for (let i = 0; i < myCards.length; i++) { // Create listeners
        myCards[i].style.display = "block"; // show cards
        myCards[i].addEventListener("click", function() {
            let cardCover = this.children; 
            cardControl(cardCover, user); // Pass children to cardControl
        });
    }

    tryAgain.addEventListener("click", function() {
        resetGame(user);
    });
    
    newGame.addEventListener("click", function() {
        resetGame();
    });

    closeModal.addEventListener("click", function() {
        modal.style.display = "none";
    });
    
    
    window.onclick = function(e) { // clicks 'outside' modal will close it
        if (e.target == modal) {
            modal.style.display = "none";
        }
    }

}

function cardControl(clickedElements, user) { // control flip action of cards
    let myFlippedCards = document.querySelectorAll('.flipped:not(.matched-card)');
    if (myFlippedCards.length <= 2) { // try not to flip more than 2 cards at once.
        for (let i = 0; i < clickedElements.length; i++) {
            if (clickedElements[i].classList.contains("cover")) { // Hide covers
                clickedElements[i].classList.add("hidden");
            }
            if (clickedElements[i].classList.contains("cards")) { 
                processCards(clickedElements[i], user); // Process the clicked card
            }

        }
    }
}

function processCards(cardElement, user) {
    cardElement.classList.add("flipped"); // Flip the card
    cardElement.classList.remove("hidden"); // Show the card
    let matchedCard = matchCheck(); // Check if there is a valid match
    let flipCount = user.flipCount; 
    let matchCount = user.matchCount;
    flipCount++;
    if (matchedCard) { // Matched pair of cards found
        matchCount++;
        let points = parseInt(matchedCard.getAttribute("points"), 10);
        let effect = parseInt(matchedCard.getAttribute("effect"), 10);
        let name = matchedCard.getAttribute("card-name");
        let message = matchedCard.getAttribute("card-msg");
        let html = '<div id="popup-container"><h1>' + name + '</h1><p>' + message + '</p><p>Time Warp: <span class="bold">' + effect + ' Seconds</span></p><BR><button id="dismiss-modal">Okay</button></div>'; // populate modal with matched card information.
        user.addPoints(points);
        user.addTime(effect);
        popUp(html, 1); // Launch modal
    }
    let flipMatch = matchCount / flipCount;
    user.playerRatio = Number(Math.round(flipMatch + 'e2') + 'e-2'); // Calculate the flip to match ratio.
    user.flipCount = flipCount; 
    user.matchCount = matchCount; 
}

function matchCheck() { // Check if there is a match on the board
    let myFlippedCards = document.querySelectorAll('.flipped:not(.matched-card)');
    if (myFlippedCards.length == 2) { // Only run if a match is possible
        if (myFlippedCards[0].getAttribute("card-name") === myFlippedCards[1].getAttribute("card-name")) { // If the card names match
            myFlippedCards[0].classList.add('matched-card');
            myFlippedCards[0].nextElementSibling.classList.add('matched-card');
            myFlippedCards[1].classList.add('matched-card');
            myFlippedCards[1].nextElementSibling.classList.add('matched-card');

            setTimeout(function() {
                flipFlop(); // flip unmatched cards over again.
            }, 500);
            return myFlippedCards[0];
        } else { // not a match
            setTimeout(function() {
                flipFlop(); // flip unmatched cards over again.
            }, 500);
            return false;
        }
    }
}

function flipFlop() { // Scan the board and flip any unmatched cards over
    let myCards = document.getElementsByClassName("cards");
    let myCovers = document.getElementsByClassName("cover");
    for (let i = 0; i < myCards.length; i++) {
        if (!myCards[i].classList.contains("matched-card")) {// If it's not already matched
            if (myCards[i].classList.contains("flipped")) {
                myCards[i].classList.add('hidden');
                myCards[i].classList.remove("flipped");
            } else {
                myCards[i].classList.remove("flipped");
            }
        }
    }
    for (let i = 0; i < myCovers.length; i++) {
        if (!myCovers[i].classList.contains("matched-card")) { // If it's not already matched
            myCovers[i].classList.remove('hidden');
        }
    }
}

document.addEventListener('DOMContentLoaded', function() { // Document is ready
    let userData = getUserData(); // Check for existing user cookie
    const startDiv = document.getElementById("start");
    const startBtn = document.getElementById("start-game");
    if ( !userData ) { // if there is no cookie, create listener for start button
        startBtn.addEventListener("click", function() {
            startDiv.style.display = "none";
            startDiv.parentElement.style.display = "none";
            startGame(); // Game initialization
        });
    } else { // cookie exists so we don't need the listener
        startDiv.style.display = "none";
        startDiv.parentElement.style.display = "none";
        setTimeout(function() {
            startGame(); // Game initialization
        }, 100);
    }
});