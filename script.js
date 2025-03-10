//1.
// There will be only two players. One human and one computer (for the Base solution).
// 2.
// The computer will always be the dealer.
// 3.
// Each player gets dealt two cards to start.
// 4.
// The player goes first, and decides if they want to hit (draw a card) or stand (end their turn).
// 5.
// The dealer has to hit if their hand is below 17.
// 6.
// Each players' score is the total of their card ranks. Jacks/Queen/Kings are 10. Aces can be 1 or 11.
// 7.
// The player who is closer to, but not above 21 wins the hand.


var makeDeck = function () {
  // create the empty deck 
  var deck = [];

  var suits = ['hearts', 'diamonds', 'clubs', 'spades'];

  var suitIndex = 0;
  while (suitIndex < suits.length) {
    // make a variable of the current suit
    var currentSuit = suits[suitIndex];

    // loop to create all cards in this suit
    // rank 1-13
    var counter = 1;
    while (counter <= 13) {
      var rankCounter = counter;
      var cardName = rankCounter;

     
      // for BlackJack only, change the card rank for the face cards to 10.
      if (cardName == 1) {
        cardName = 'ACE';
      } else if (cardName == 11) {
        rankCounter = 10;
        cardName = 'JACK';
      } else if (cardName == 12) {
        rankCounter = 10;
        cardName = 'QUEEN';
      } else if (cardName == 13) {
        rankCounter = 10;
        cardName = 'KING';
      }

      
      var card = {
        name: cardName,
        suit: currentSuit,
        rank: rankCounter,
      };

      // add the card to the deck
      deck.push(card);

      counter = counter + 1;
    }
    suitIndex = suitIndex + 1;
  }

  return deck;
};

var getRandomIndex = function (size) {
  return Math.floor(Math.random() * size);
};

var shuffleCards = function (cards) {
  var index = 0;

  while (index < cards.length) {
    var randomIndex = getRandomIndex(cards.length);

    var currentItem = cards[index];

    var randomItem = cards[randomIndex];

    cards[index] = randomItem;
    cards[randomIndex] = currentItem;

    index = index + 1;
  }

  return cards;
};

var deck = shuffleCards(makeDeck());

// The maximum valid sum in Blackjack is 21.
// the threshold is 15 
var TWENTY_ONE = 21;
// Dealer always hits until she reaches a sum greater than 15.
var dealerHitThreshold = 15;
// If player has chosen to stand, then player can no longer hit until game is over
var playerHasChosenToStand = false;

// Keep track of when the game ends to prevent further moves
var gameOver = false;

// Store player's cards and computer's cards in separate arrays
var playerHand = [];
var computerHand = [];

// Deal a card to the given hand
var dealCardToHand = function (hand) {
  hand.push(deck.pop());
};

// Get sum of cards in hand
var getHandSum = function (hand) {
  var numAcesInHand = 0;
  var sum = 0;
  var counter = 0;
  while( counter < hand.length ){
    var currCard = hand[counter];
    // If card is Ace, value is 11 by default
    if (currCard.rank === 1) {
      numAcesInHand += 1;
      sum += 11;
    }else{
      sum += currCard.rank;
    }

    counter = counter + 1;
  }
  // If sum is greater than sum limit and hand contains Aces, convert Aces from value of 11
  // to value of 1, until sum is less than or equal to sum limit or there are no more Aces.
  if (sum > TWENTY_ONE && numAcesInHand > 0) {
    var aceCounter = 0;
    while( aceCounter < numAcesInHand){
      sum -= 10;
      // If the sum is less than TWENTY_ONE before converting all Ace values from
      // 11 to 1, break out of the loop and return the current sum.
      if (sum <= TWENTY_ONE) {
        break; // break keyword causes the loop to finish
      }
      aceCounter = aceCounter + 1;
    }
  }
  return sum;
};

// Return whether the hand contains a Blackjack combi
var isBlackjack = function (hand) {
  return hand.length === 2 && getHandSum(hand) === TWENTY_ONE;
};

// Convert hand to a string
var convertHandToString = function (hand) {

  var cards = '';
  var handIndex = 0;

  while (handIndex < hand.length) {
    cards = cards + '==> ' +  hand[handIndex].name;
    handIndex = handIndex + 1;
  }

  return cards;
};

var getDefaultOutput = function () {
  return `Player's hands: ${convertHandToString(playerHand)} with a total of ${getHandSum(playerHand)}! <br>
    Computer's hands: ${convertHandToString(computerHand)} with a total of ${getHandSum(computerHand)}!`;
};

var main = function (input) {
  if (gameOver) {
    return 'The game is over. Please refresh to play again.';
  }

  
  if (playerHand.length === 0) {
    // User clicks submit button to deal cards.
    // Deal first card for player then computer
    dealCardToHand(playerHand);
    dealCardToHand(computerHand);

    // Deal second card for player then computer
    dealCardToHand(playerHand);
    dealCardToHand(computerHand);

    // The cards are analyzed for any game winning conditions. (Blackjack)
    // If computer has Blackjack, computer auto wins because computer is dealer
    if (isBlackjack(computerHand)) {
      gameOver = true;
      // Computer wins, return
      return `${getDefaultOutput()} <br>
        Computer has Blackjack. Try again next time...refresh to play again`;
    }

    // If player has Blackjack and computer does not, player wins
    if (isBlackjack(playerHand)) {
      gameOver = true;
      // Player wins, return
      return `${getDefaultOutput()} <br>
        Player has Blackjack! Well done, refresh to play again? (:`;
    }

    // The cards are displayed to the user.
    return `${getDefaultOutput()} <br>
      Please enter "hit" or "stay", then press Submit`;
  }

  // Then begins a new mode
  if (!playerHasChosenToStand) {
    // If user input is neither "hit" nor "stay" prompt user
    if (input !== 'hit' && input !== 'stay') {
      return 'Please input either "hit" or "stay" as possible moves in Blackjack';
    }

    if (input === 'hit') {
      dealCardToHand(playerHand);
      // If bust, show player that she busts
      if (getHandSum(playerHand) > TWENTY_ONE) {
        gameOver = true;
        return `${getDefaultOutput()} <br>
          Player bust O.O Press refresh to play again.`;
      }
    }

    if (input === 'stay') {
      playerHasChosenToStand = true;
    }
  }

  // The computer also decides to hit or stand.
  // Computer hits if sum less than or equal to dealer hit threshold
  // Otherwise, computer stays
  var computerHandSum = getHandSum(computerHand);
  if (computerHandSum <= dealerHitThreshold) {
    dealCardToHand(computerHand);
    // Update computer hand sum after dealing new card
    computerHandSum = getHandSum(computerHand);
    // If bust, show computer that she busts
    if (computerHandSum > TWENTY_ONE) {
      gameOver = true;
      return `${getDefaultOutput()} <br>
      Computer busted! You Win! Please refresh to play again.`;
    }
  }

  // If player and computer have both not busted and chosen to stand, decide who wins
  if (playerHasChosenToStand && computerHandSum > dealerHitThreshold) {
    // The game is always over after this point
    gameOver = true;
    // If player hand sum is greater than computer hand sum, player wins!
    if (getHandSum(playerHand) > computerHandSum) {
      return `${getDefaultOutput()} <br>
        Player wins! Please refresh to play again.`;
    }
    // Else, computer wins
    return `${getDefaultOutput()} <br>
      Computer wins! Please refresh to play again.`;
  }

  // If game is not yet over, show current game status
  return `${getDefaultOutput()} <br>
    You may choose to draw another card. Please enter "hit" or "stay". <br>
    If not, press Submit to see Computer's next move.`;
};
