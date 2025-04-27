import './style.css';
import Game from './modules/Game';

const initialForm = document.querySelector('form');
const boards = document.querySelector('.boards');
const playerOneLabel = document.querySelector('.player-one h2');
const playerTwoLabel = document.querySelector('.player-two h2');

const whoseTurnWrapper = document.querySelector('p:has(.turn)');
const whoseTurnDOM = document.querySelector('.turn');

function initialize(playerOneName, playerTwoName) {
  const game = new Game(playerOneName, playerTwoName);

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

  const playerOneBoard = document.querySelector('.player-one .board');
  const playerOneBoardEnemy = document.querySelector(
    '.player-one .board-enemy',
  );
  const playerOneRows = document.querySelectorAll('.player-one .board .row');
  const playerOneRowsEnemy = document.querySelectorAll(
    '.player-one .board-enemy .row',
  );
  const playerTwoBoard = document.querySelector('.player-two .board');
  const playerTwoBoardEnemy = document.querySelector(
    '.player-two .board-enemy',
  );
  const playerTwoRows = document.querySelectorAll('.player-two .board .row');
  const playerTwoRowsEnemy = document.querySelectorAll(
    '.player-two .board-enemy .row',
  );

  const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

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
              // If a ship was hit, the output of makeTurn is the ship that was hit
              if (output.isSunk) {
                // submarine => P2SubmarineCoords
                const coords =
                  game[
                    `P1${output.type.replace(/^./, output.type.at(0).toUpperCase())}Coords`
                  ];
                coords.forEach((coord) => {
                  playerOneRows[letters.indexOf(coord[0])].children[
                    coord[1]
                  ].classList.add('sunk');
                  playerOneRowsEnemy[letters.indexOf(coord[0])].children[
                    coord[1]
                  ].classList.add('sunk');
                });
              }
            }

            if (game.whoseTurn !== game.playerTwo) {
              playerOneBoardEnemy.style.display = 'none';

              if (game.winner === null) {
                whoseTurnDOM.textContent = playerOneName;
                playerTwoBoard.style.display = 'none';
                playerTwoBoardEnemy.style.display = 'flex';
              } else {
                whoseTurnWrapper.textContent = `${playerTwoName} wins!`;
              }

              playerOneBoard.style.display = 'flex';
            }
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
              // If a ship was hit, the output of makeTurn is the ship that was hit
              if (output.isSunk) {
                // submarine => P2SubmarineCoords
                const coords =
                  game[
                    `P2${output.type.replace(/^./, output.type.at(0).toUpperCase())}Coords`
                  ];
                coords.forEach((coord) => {
                  playerTwoRows[letters.indexOf(coord[0])].children[
                    coord[1]
                  ].classList.add('sunk');
                  playerTwoRowsEnemy[letters.indexOf(coord[0])].children[
                    coord[1]
                  ].classList.add('sunk');
                });
              }
            }

            if (game.whoseTurn !== game.playerOne) {
              playerTwoBoardEnemy.style.display = 'none';

              if (game.winner === null) {
                whoseTurnDOM.textContent = playerTwoName;
                playerOneBoard.style.display = 'none';
                playerOneBoardEnemy.style.display = 'flex';
              } else {
                whoseTurnWrapper.textContent = `${playerOneName} wins!`;
              }

              playerTwoBoard.style.display = 'flex';
            }
          } catch (error) {
            // Implement some kind of logic to explain to the user that you can't hit twice the same square, if he/she tries to click more than one time, like 5 times or more.
          }
        }
      });
    }
  }
}

initialForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const playerOneNameInput = initialForm.querySelector('#name-one');
  const playerOneName = playerOneNameInput.value;
  const playerTwoNameInput = initialForm.querySelector('#name-two');
  const playerTwoName = playerTwoNameInput.value;
  initialForm.style.display = 'none';
  playerOneLabel.textContent = playerOneName;
  playerTwoLabel.textContent = playerTwoName;
  boards.style = null;
  whoseTurnWrapper.style = null;
  whoseTurnDOM.textContent = playerOneName;
  initialize(playerOneName, playerTwoName);
});
