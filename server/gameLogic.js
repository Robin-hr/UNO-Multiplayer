// UNO Game Logic Helpers

export const createDeck = () => {
  const colors = ['red', 'blue', 'green', 'yellow'];
  // 19 cards each color: one 0, two of each 1-9
  const numbers = [0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9];
  // 8 each of Skip, Reverse, Draw Two (2 each color)
  const specials = ['skip', 'skip', 'reverse', 'reverse', 'draw2', 'draw2'];
  
  let deck = [];

  // Add colored cards
  colors.forEach(color => {
    numbers.forEach(num => {
      deck.push({ color, value: num.toString(), type: 'number', id: Math.random().toString(36).substr(2, 9) });
    });
    specials.forEach(spec => {
      deck.push({ color, value: spec, type: 'special', id: Math.random().toString(36).substr(2, 9) });
    });
  });

  // 4 Wild cards
  for (let i = 0; i < 4; i++) {
    deck.push({ color: 'any', value: 'wild', type: 'wild', id: Math.random().toString(36).substr(2, 9) });
  }
  // 4 Wild Draw Four cards
  for (let i = 0; i < 4; i++) {
    deck.push({ color: 'any', value: 'wild4', type: 'wild', id: Math.random().toString(36).substr(2, 9) });
  }
  // 1 Wild Shuffle Hands card
  deck.push({ color: 'any', value: 'wildShuffle', type: 'wild', id: Math.random().toString(36).substr(2, 9) });
  // 3 Wild Customizable cards
  for (let i = 0; i < 3; i++) {
    deck.push({ color: 'any', value: 'wildCustom', type: 'wild', id: Math.random().toString(36).substr(2, 9) });
  }

  return shuffle(deck);
};

export const shuffle = (deck) => {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
};


export const dealCards = (deck, players) => {
  const hands = {};
  players.forEach(player => {
    hands[player.id] = deck.splice(0, 7);
  });
  return { hands, remainingDeck: deck };
};

export const isValidMove = (card, topCard) => {
  // Wild cards can be played on anything
  const wildTypes = ['wild', 'wild4', 'wildShuffle', 'wildCustom'];
  if (wildTypes.includes(card.value)) return true;
  
  // If top card is wild and hasn't had a color picked (e.g. first card of game)
  if (topCard.color === 'any') return true;

  // Normal cards must match color or value
  if (card.color === topCard.color) return true;
  if (card.value === topCard.value) return true;
  
  return false;
};

