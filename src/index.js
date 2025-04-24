import './style.css';
import Game from './modules/Game';

function initialize() {
  const game = new Game();

  game.P1PlaceShip(['B', 1], ['F', 1]);
  game.P1PlaceShip(['C', 4], ['C', 7]);
  game.P1PlaceShip(['E', 3], ['E', 5]);
  game.P1PlaceShip(['G', 6], ['H', 6]);
  game.P1PlaceShip(['J', 4]);

  game.P2PlaceShip(['B', 1], ['F', 1]);
  game.P2PlaceShip(['C', 4], ['C', 7]);
  game.P2PlaceShip(['E', 3], ['E', 5]);
  game.P2PlaceShip(['G', 6], ['H', 6]);
  game.P2PlaceShip(['J', 4]);

  const playerOneBoard = document.querySelector('.player1 .board');
  const playerOneBoardEnemy = document.querySelector('.player1 .board-enemy');
  const playerOneRows = document.querySelectorAll('.player1 .board .row');
  const playerOneRowsEnemy = document.querySelectorAll(
    '.player1 .board-enemy .row',
  );
  const playerTwoBoard = document.querySelector('.player2 .board');
  const playerTwoBoardEnemy = document.querySelector('.player2 .board-enemy');
  const playerTwoRows = document.querySelectorAll('.player2 .board .row');
  const playerTwoRowsEnemy = document.querySelectorAll(
    '.player2 .board-enemy .row',
  );

  const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const whoseTurnWrapper = document.querySelector('p:has(.turn)');
  const whoseTurnDOM = document.querySelector('.turn');

  for (let i = 0; i < 10; i += 1) {
    const letter = letters[i];
    const playerOneRow = playerOneRows[i].querySelectorAll('.square');
    const playerOneRowEnemy = playerOneRowsEnemy[i].querySelectorAll('.square');
    const playerTwoRow = playerTwoRows[i].querySelectorAll('.square');
    const playerTwoRowEnemy = playerTwoRowsEnemy[i].querySelectorAll('.square');

    for (let j = 0; j < 10; j += 1) {
      if (game.isP1SqOccupied(letter, j + 1)) {
        playerOneRow[j].classList.add('occupied');
      }

      playerOneRowEnemy[j].addEventListener('click', () => {
        if (game.whoseTurn === game.playerTwo && game.winner === null) {
          try {
            const output = game.makeTurn(letter, j + 1);
            if (output === null) {
              playerOneRow[j].classList.add('missed');
              playerOneRowEnemy[j].classList.add('missed');
            } else if (typeof output === 'object') {
              playerOneRow[j].classList.add('hit');
              playerOneRowEnemy[j].classList.add('hit');
            }

            playerOneBoardEnemy.style.display = 'none';

            if (game.winner === null) {
              whoseTurnDOM.textContent = game.P1Name;
              playerTwoBoard.style.display = 'none';
              playerTwoBoardEnemy.style.display = 'flex';
            } else {
              whoseTurnWrapper.textContent = `${game.P2Name} wins!`;
            }

            playerOneBoard.style.display = 'flex';
          } catch (error) {
            // Implement some kind of logic to explain to the user that you can't hit twice the same square, if he/she tries to click more than one time, like 5 times or more.
          }
        }
      });

      if (game.isP2SqOccupied(letter, j + 1)) {
        playerTwoRow[j].classList.add('occupied');
      }

      playerTwoRowEnemy[j].addEventListener('click', () => {
        if (game.whoseTurn === game.playerOne && game.winner === null) {
          try {
            const output = game.makeTurn(letter, j + 1);
            if (output === null) {
              playerTwoRow[j].classList.add('missed');
              playerTwoRowEnemy[j].classList.add('missed');
            } else if (typeof output === 'object') {
              playerTwoRow[j].classList.add('hit');
              playerTwoRowEnemy[j].classList.add('hit');
            }

            playerTwoBoardEnemy.style.display = 'none';

            if (game.winner === null) {
              whoseTurnDOM.textContent = game.P2Name;
              playerOneBoard.style.display = 'none';
              playerOneBoardEnemy.style.display = 'flex';
            } else {
              whoseTurnWrapper.textContent = `${game.P1Name} wins!`;
            }

            playerTwoBoard.style.display = 'flex';
          } catch (error) {
            // Implement some kind of logic to explain to the user that you can't hit twice the same square, if he/she tries to click more than one time, like 5 times or more.
          }
        }
      });
    }
  }
}

initialize();
