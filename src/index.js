import './style.css';
import { board1, board2, player1, player2 } from './modules/game';

function initialize() {
  const playerOneRows = document.querySelectorAll('.player1 .row');
  const playerTwoRows = document.querySelectorAll('.player2 .row');
  const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

  for (let i = 0; i < 10; i += 1) {
    const letter = letters[i];
    const playerOneRow = playerOneRows[i].querySelectorAll('.square');
    const playerTwoRow = playerTwoRows[i].querySelectorAll('.square');

    for (let j = 0; j < 10; j += 1) {
      if (board1.isOccupied(letter, j + 1)) {
        playerOneRow[j].classList.add('occupied');
      }

      playerOneRow[j].addEventListener('click', () => {
        try {
          const output = player2.attack(letter, j + 1);
          if (output === null) {
            playerOneRow[j].classList.add('missed');
          } else if (typeof output === 'object') {
            playerOneRow[j].classList.add('hit');
          }
        } catch (error) {
          // Implement some kind of logic to explain to the user that you can't hit twice the same square, if he/she tries to click more than one time, like 5 times or more.
        }
      });

      if (board2.isOccupied(`${letter}`, j + 1)) {
        playerTwoRow[j].classList.add('occupied');
      }

      playerTwoRow[j].addEventListener('click', () => {
        try {
          const output = player1.attack(letter, j + 1);
          if (output === null) {
            playerTwoRow[j].classList.add('missed');
          } else if (typeof output === 'object') {
            playerTwoRow[j].classList.add('hit');
          }
        } catch (error) {
          // Implement some kind of logic to explain to the user that you can't hit twice the same square, if he/she tries to click more than one time, like 5 times or more.
        }
      });
    }
  }
}

initialize();
