import './style.css';
import Game from './modules/Game';

function initialize() {
  const game = new Game();

  const playerOneRows = document.querySelectorAll('.player1 .row');
  const playerTwoRows = document.querySelectorAll('.player2 .row');
  const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const whoseTurnWrapper = document.querySelector('p:has(.turn)');
  const whoseTurnDOM = document.querySelector('.turn');

  for (let i = 0; i < 10; i += 1) {
    const letter = letters[i];
    const playerOneRow = playerOneRows[i].querySelectorAll('.square');
    const playerTwoRow = playerTwoRows[i].querySelectorAll('.square');

    for (let j = 0; j < 10; j += 1) {
      if (game.isP1SqOccupied(letter, j + 1)) {
        playerOneRow[j].classList.add('occupied');
      }

      playerOneRow[j].addEventListener('click', () => {
        if (game.whoseTurn === game.playerTwo && game.winner === null) {
          try {
            const output = game.makeTurn(letter, j + 1);
            if (output === null) {
              playerOneRow[j].classList.add('missed');
            } else if (typeof output === 'object') {
              playerOneRow[j].classList.add('hit');
            }
            if (game.winner === null) {
              whoseTurnDOM.textContent = game.P1Name;
            } else {
              whoseTurnWrapper.textContent = `${game.P2Name} wins!`;
            }
          } catch (error) {
            // Implement some kind of logic to explain to the user that you can't hit twice the same square, if he/she tries to click more than one time, like 5 times or more.
          }
        }
      });

      if (game.isP2SqOccupied(letter, j + 1)) {
        playerTwoRow[j].classList.add('occupied');
      }

      playerTwoRow[j].addEventListener('click', () => {
        if (game.whoseTurn === game.playerOne && game.winner === null) {
          try {
            const output = game.makeTurn(letter, j + 1);
            if (output === null) {
              playerTwoRow[j].classList.add('missed');
            } else if (typeof output === 'object') {
              playerTwoRow[j].classList.add('hit');
            }
            if (game.winner === null) {
              whoseTurnDOM.textContent = game.P2Name;
            } else {
              whoseTurnWrapper.textContent = `${game.P1Name} wins!`;
            }
          } catch (error) {
            // Implement some kind of logic to explain to the user that you can't hit twice the same square, if he/she tries to click more than one time, like 5 times or more.
          }
        }
      });
    }
  }
}

initialize();
