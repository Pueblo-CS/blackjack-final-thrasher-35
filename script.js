/* 
Each card is a two character string like "Ac" 
where the first char is the face and second is the suit
*/

// Global variables
let deck = [];
const cardSuits = ["c", "s", "d", "h"];
const cardFaces = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K"];
let playerHand = [];
let dealerHand = [];

// Hides popup window
function hidePopup() {
    let popup = document.getElementById("play-popup");
    popup.style.visibility = "hidden";
}

// Deals cards and starts a new round of play
function deal() {
    // Reset or start the game
    hidePopup();
    showPlayerControls();
    clearBoard();
    fillDeck();
    shuffle();

    // Add two cards to player's hand
    playerHand.push(getCard());
    addPlayerCard(playerHand[0]);
    playerHand.push(getCard()); 
    addPlayerCard(playerHand[1]);

    // Add two cards to dealer hand    
    dealerHand.push(getCard());
    dealerHand.push(getCard());
    // First card is hidden
    addHiddenCard();
    // Second card is visible
    addDealerCard(dealerHand[1]);

    // Check if player has 21
    checkPlayer21OrBust();
    // Check if dealer has 21
    checkDealer21OrBust();
}

// Fills deck array with card strings
function fillDeck() {
    for (let i = 0; i < cardSuits.length; i++){
        let suit = cardSuits[i];
        for (let j = 0; j < cardFaces.length; j++) {
            let face = cardFaces[j];
            let card = face + suit;
            deck.push(card);
        }
    }
}

// Shuffles deck array
function shuffle() {
    for (let i = 0; i < deck.length; i++){
        let randNum = Math.floor(Math.random() * deck.length);
        let temp = deck[i];
        deck[i] = deck[randNum];
        deck[randNum] = temp;
    }
}

// Returns a single card string from the deck
function getCard() {
    let lastCard = deck.pop();
    return lastCard;
}

// Adds a div representing the given card to the player's area
function addPlayerCard(card) {
    let playerArea = document.getElementById("player-area");
    let cardDiv = document.createElement("div");
    cardDiv.setAttribute("class", "card");
    let faceP = document.createElement("p");
    let face = card.charAt(0);
    if (face == "T"){
        faceP.innerHTML = "10";
    }
    else {
        faceP.innerHTML = face;
    }
    
    cardDiv.appendChild(faceP);

    let suitImg = document.createElement("img");
    let suit = card.charAt(1);
    if (suit == "c"){
        suitImg.src = "club.png";
    }
    else if (suit == "d") {
        suitImg.src = "diamond.png";
    }
    else if (suit == "s") {
        suitImg.src = "spade.png";
    }
    else {
        suitImg.src = "heart.png";
    }
    cardDiv.appendChild(suitImg);
    playerArea.appendChild(cardDiv);
}


// Adds a div representing the given card to the dealer's area
function addDealerCard(card) {
    let playerArea = document.getElementById("dealer-area");
    let cardDiv = document.createElement("div");
    cardDiv.setAttribute("class", "card");
    let faceP = document.createElement("p");
    let face = card.charAt(0);
    if (face == "T"){
        faceP.innerHTML = "10";
    }
    else {
        faceP.innerHTML = face;
    }
    
    cardDiv.appendChild(faceP);

    let suitImg = document.createElement("img");
    let suit = card.charAt(1);
    if (suit == "c"){
        suitImg.src = "club.png";
    }
    else if (suit == "d") {
        suitImg.src = "diamond.png";
    }
    else if (suit == "s") {
        suitImg.src = "spade.png";
    }
    else {
        suitImg.src = "heart.png";
    }
    cardDiv.appendChild(suitImg);
    playerArea.appendChild(cardDiv);
}

// Adds a div representing the hidden card to the dealer's area
function addHiddenCard() {
    let cardDiv = document.createElement("div");
    cardDiv.setAttribute("id", "hidden-card");
    cardDiv.setAttribute("class", "card");
    cardDiv.style.backgroundColor = "cornflowerblue";

    document.getElementById("dealer-area").appendChild(cardDiv);
}

// Reveals the hidden card (1st card) from the dealer's hand
function showHiddenCard() {
    let div = document.getElementById("hidden-card");
    if (div.style.backgroundColor != "white") {
        div.style.backgroundColor = "white";
        let card = dealerHand[0];
        let p = document.createElement("p");
        if (card.charAt(0) == "T") {
            p.innerHTML = "10";
        }
        else {
            p.innerHTML = card.charAt(0);
        }
        if (card.charAt(1) == "s" || card.charAt(1) == "c") {
            div.setAttribute("class", "card black");
        }
        else {
            div.setAttribute("class", "card red");
        }
        div.appendChild(p);

        let suitImg = document.createElement("img");
        let suit = card.charAt(1);
        if (suit == "c"){
            suitImg.src = "club.png";
        }
        else if (suit == "d") {
            suitImg.src = "diamond.png";
        }
        else if (suit == "s") {
            suitImg.src = "spade.png";
        }
        else {
            suitImg.src = "heart.png";
        }
        div.appendChild(suitImg);
    }
}

// Checks if the player's hand is 21 or over
// Called from deal and after each time the player hits
function checkPlayer21OrBust() {
    let playerTotal = getHandTotal(playerHand);
    if (playerTotal == 21) {
        setTimeout(gameOver, 500, "You got 21!", "win");
    }
    else if (playerTotal > 21) {
        setTimeout(gameOver, 500, "Bust. " + playerTotal, "lose");
    }
}

// Checks if the dealer's hand is 21 or over
// Called from deal and after each time the dealer hits
function checkDealer21OrBust() {
    let dealerTotal = getHandTotal(dealerHand);
    if (dealerTotal == 21) {
        setTimeout(gameOver, 500, "Dealer got 21!", "lose");
    }
    else if (dealerTotal > 21) {
        setTimeout(gameOver, 500, "Dealer bust. " + dealerTotal, "win");
    }
}

// Logic and animation for the dealer's turn
// Called from stay button click event
function dealerTurn() {
    // Hide hit button
    // Hide stay button
    hidePlayerControls();

    // Show hidden card
    setTimeout(function () {
        showHiddenCard();
        // Calc dealer hand total
        let dealerTotal = getHandTotal(dealerHand);
        // Calc player hand total
        let playerTotal = getHandTotal(playerHand);
        // Decide what happens next
        if (dealerTotal < 17) {
            // if less than 17, hit
            setTimeout(function () {
                dealerHit();
                checkDealerBustOr21();
                dealerTurn();
            }, 750);
        }
        else if (dealerTotal < 21 && dealerTotal < playerTotal) {
            // else if less than player hand and less than 21, hit
            setTimeout(function () {
                dealerHit();
                checkDealerBustOr21();
                dealerTurn();
            }, 750);
        }
        else {
            checkForWinner();
        }
    }, 750);
}

// Checks for the winner
// Called from dealerTurn()
function checkForWinner() {
    let playerTotal = getHandTotal(playerHand);
    let dealerTotal = getHandTotal(dealerHand);

    if (dealerTotal > 21) {
        setTimeout(gameOver, 500, "Dealer bust. " + dealerTotal, "win");
    }
    else if (dealerTotal > playerTotal) {
        // else if greater than player hand, dealer wins
        setTimeout(gameOver, 500, dealerTotal + " beats " + playerTotal, "lose");
    }
    else if (playerTotal > dealerTotal) {
        // else if less than player hand, player wins
        setTimeout(gameOver, 500, playerTotal + " beats " + dealerTotal, "win");
    }
    else if (playerTotal == dealerTotal) {
        // else if equal to player hand, push
        setTimeout(gameOver, 500, "with " + playerTotal, "push");
    }
}

// Displays a popup with a message
// message: the string to be displayed
// status: a string "win" or "lose" representing the state of the game for the player
function gameOver(message, status) {
    let popup = document.getElementById("play-popup");
    popup.style.visibility = "visible";

    if (status == "win") {
        document.getElementById("window-title").innerHTML = "Winner!";
    }
    else if (status == "lose") {
        document.getElementById("window-title").innerHTML = "You lost";
    }
    else {
        document.getElementById("window-title").innerHTML = "Push";
    }

    let messageP = document.getElementById("message-p");
    messageP.innerHTML = message;

    let button = document.getElementById("play-button");
    button.innerHTML = "Play again";
}

// Resets everything to start a new game
// Called from deal()
function clearBoard() {
    playerHand = [];
    dealerHand = [];
    let dealerArea = document.getElementById("dealer-area");
    let divs = dealerArea.getElementsByTagName("div");
    for (let i = 0; i < divs.length; i++) {
        divs[i].remove();
        i--;
    }

    let playerArea = document.getElementById("player-area");
    divs = playerArea.getElementsByTagName("div");
    for (let i = 0; i < divs.length; i++) {
        divs[i].remove();
        i--;
    }
}


// ************************ ASSIGNMENT *********************************
// Complete the functions below to make this a fully functional Blackjack game
// You should not need to modify any of the code above this section


// Calculates and returns the numerical total of the given array of cards
// hand: an array of strings representing the cards in either the player's or dealer's hand
// Called from checkPlayer21OrBust(), checkDealer21OrBust(), dealerTurn(), and checkForWinner()
// TODO: Implement this function. Assume Aces are 1 at first. 
// Once you get rest of the rest of the assignment completed, work on making this function
// calculate the best hand total between A = 1 and A = 11. Hint: there can only be one high ace in a hand
function getHandTotal(hand) {

}

// Adds a card to the player's hand array and updates UI with the card
// TODO: Call this function from Hit button click
// TODO: Implement this function
function playerHit() {

}

// Adds a card to the dealer's hand array and updates UI with the card
// TODO: Implement this function
function dealerHit() {

}

// Hides hit and stay buttons during dealer's turn
// Called from dealerTurn()
// TODO: Implement this function
function hidePlayerControls() {
    
}

// Shows hit and stay buttons
// Called from deal()
// TODO: Implement this function
function showPlayerControls() {
    
}