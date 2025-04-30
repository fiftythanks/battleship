/* eslint-disable no-loop-func */
import './style.css';
import Game from './modules/Game';

const initialForm = document.querySelector('form');
const boards = document.querySelector('.boards');
const playerOneLabel = document.querySelector('.player-one h2');
const playerTwoLabel = document.querySelector('.player-two h2');

const whoseTurnWrapper = document.querySelector('.turn-wrapper');
const whoseTurnDOM = document.querySelector('.turn');
const handoverDialogOne = document.querySelector('#hand-over-one');
const handoverDialogOneEnemy = document.querySelector('#hand-over-one-enemy');
const handoverDialogTwo = document.querySelector('#hand-over-two');
const handoverDialogTwoEnemy = document.querySelector('#hand-over-two-enemy');
const playerOneBoard = document.querySelector('.player-one .board');
const playerOneBoardEnemy = document.querySelector('.player-one .board-enemy');
const playerOneRows = document.querySelectorAll('.player-one .board .row');
const playerOneRowsEnemy = document.querySelectorAll(
  '.player-one .board-enemy .row',
);
const playerTwoBoard = document.querySelector('.player-two .board');
const playerTwoBoardEnemy = document.querySelector('.player-two .board-enemy');
const playerTwoRows = document.querySelectorAll('.player-two .board .row');
const playerTwoRowsEnemy = document.querySelectorAll(
  '.player-two .board-enemy .row',
);

const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

// Logic for hiding player boards correctly when they place their ships before the game begins
let P1Ready = false;
let P2Ready = false;

const P1ReadyDialog = document.querySelector('#ready-two');
const P2ReadyDialog = document.querySelector('#ready-one');
P1ReadyDialog.addEventListener('close', () => {
  P1Ready = true;
  playerTwoBoardEnemy.style.display = 'none';
  handoverDialogTwo.show();
  playerTwoBoard.style.display = 'flex';
  P2ReadyDialog.show();
  for (let i = 0; i < 10; i += 1) {
    const row = playerOneRows[i].querySelectorAll('.square');

    for (let j = 0; j < 10; j += 1) {
      row[j].removeAttribute('draggable');
    }
  }
});
P2ReadyDialog.addEventListener('close', () => {
  P2Ready = true;
  playerTwoBoard.style.display = 'none';
  playerTwoBoardEnemy.style.display = 'flex';
  handoverDialogOne.show();

  for (let i = 0; i < 10; i += 1) {
    const row = playerTwoRows[i].querySelectorAll('.square');

    for (let j = 0; j < 10; j += 1) {
      row[j].removeAttribute('draggable');
    }
  }
});

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

  // A workaround for a `dragenter` event handler below. It's necessary because you can't read the `dataTransfer` object data in anything but `dragstart` and `drop` event handlers.
  let currentlyDragged = null;
  let currentlyDraggedOver = [];

  // row and col like on the board
  function addP1DragEventListener(element, row, col) {
    function dragHandler(e) {
      if (!P1Ready) {
        const dataList = e.dataTransfer;

        const { type, length } = game.isP1SqOccupied(row, col);

        const coords =
          game[`P1${type.replace(/^./, type.at(0).toUpperCase())}Coords`];

        // If letters are the same for the squares, the ship's positioned horizontally; otherwise, vertically. Patrol boats (one square long) are treated as horizontal by convention.
        const orientation =
          coords.length === 1 || coords[0][0] === coords[1][0]
            ? 'horizontal'
            : 'vertical';

        // Part of data to be sent
        const data = [length, orientation];

        // Create drag image
        const dragClone = document.createElement('div');
        const sizeKey = orientation === 'horizontal' ? 'height' : 'width';
        dragClone.style.display = 'flex';
        dragClone.style.flexDirection =
          orientation === 'horizontal' ? 'row' : 'column';
        dragClone.style[sizeKey] = '3rem';
        dragClone.style.marginLeft = '150vw';

        // Clone the ship's squares and append the created clones to the parent dragClone, then remove the 'occupied' class from the original squares to represent visually that the ship is moved from the squares. The count and index are for calculating the offsets below. originalSquares is to be transferred.
        let count = 0;
        let index = 0;

        const originalSquares = [];

        coords.forEach((coord) => {
          const i = letters.indexOf(coord[0]);
          const j = coord[1] - 1;
          const squares = playerOneRows[i].querySelectorAll('.square');
          const square = squares[j];
          originalSquares.push([i, j]);
          if (square === e.target) index = count;
          const squareClone = square.cloneNode(true);
          dragClone.appendChild(squareClone);
          square.setAttribute('class', 'square');
          count += 1;
        });

        data.push(index, originalSquares);
        dataList.setData('text/plain', JSON.stringify(data));
        currentlyDragged = data;

        // Calculate offsets for drag image
        const rect = e.target.getBoundingClientRect();
        let offsetX = e.clientX - rect.left;
        let offsetY = e.clientY - rect.top;
        const rem = getComputedStyle(e.target)
          .getPropertyValue('font-size')
          .replace('px', '');
        if (orientation === 'horizontal') {
          offsetX += index * 3 * rem;
        } else {
          offsetY += index * 3 * rem;
        }

        document.body.appendChild(dragClone);
        dataList.setDragImage(dragClone, offsetX, offsetY);
      }
    }
    // eslint-disable-next-line no-param-reassign
    element.ondragstart = dragHandler;
  }

  // row and col like on the board
  function addP2DragEventListener(element, row, col) {
    function dragHandler(e) {
      if (!P2Ready) {
        const dataList = e.dataTransfer;

        const { type, length } = game.isP2SqOccupied(row, col);

        const coords =
          game[`P2${type.replace(/^./, type.at(0).toUpperCase())}Coords`];

        // If letters are the same for the squares, the ship's positioned horizontally; otherwise, vertically. Patrol boats (one square long) are treated as horizontal by convention.
        const orientation =
          coords.length === 1 || coords[0][0] === coords[1][0]
            ? 'horizontal'
            : 'vertical';

        // Part of data to be sent
        const data = [length, orientation];

        // Create drag image
        const dragClone = document.createElement('div');
        const sizeKey = orientation === 'horizontal' ? 'height' : 'width';
        dragClone.style.display = 'flex';
        dragClone.style.flexDirection =
          orientation === 'horizontal' ? 'row' : 'column';
        dragClone.style[sizeKey] = '3rem';
        dragClone.style.marginLeft = '150vw';

        // Clone the ship's squares and append the created clones to the parent dragClone, then remove the 'occupied' class from the original squares to represent visually that the ship is moved from the squares. The count and index are for calculating the offsets below. originalSquares is to be transferred.
        let count = 0;
        let index = 0;

        const originalSquares = [];

        coords.forEach((coord) => {
          const i = letters.indexOf(coord[0]);
          const j = coord[1] - 1;
          const squares = playerTwoRows[i].querySelectorAll('.square');
          const square = squares[j];
          originalSquares.push([i, j]);
          if (square === e.target) index = count;
          const squareClone = square.cloneNode(true);
          dragClone.appendChild(squareClone);
          square.setAttribute('class', 'square');
          count += 1;
        });

        data.push(index, originalSquares);
        dataList.setData('text/plain', JSON.stringify(data));
        currentlyDragged = data;

        // Calculate offsets for drag image
        const rect = e.target.getBoundingClientRect();
        let offsetX = e.clientX - rect.left;
        let offsetY = e.clientY - rect.top;
        const rem = getComputedStyle(e.target)
          .getPropertyValue('font-size')
          .replace('px', '');
        if (orientation === 'horizontal') {
          offsetX += index * 3 * rem;
        } else {
          offsetY += index * 3 * rem;
        }

        document.body.appendChild(dragClone);
        dataList.setDragImage(dragClone, offsetX, offsetY);
      }
    }
    // eslint-disable-next-line no-param-reassign
    element.ondragstart = dragHandler;
  }

  for (let i = 0; i < 10; i += 1) {
    const letter = letters[i];
    const playerOneRow = playerOneRows[i].querySelectorAll('.square');
    const playerOneRowEnemy = playerOneRowsEnemy[i].querySelectorAll('.square');
    const playerTwoRow = playerTwoRows[i].querySelectorAll('.square');
    const playerTwoRowEnemy = playerTwoRowsEnemy[i].querySelectorAll('.square');

    for (let j = 0; j < 10; j += 1) {
      // Drag-and-drop functionality
      playerOneRow[j].addEventListener('dragover', (e) => {
        if (!P1Ready) {
          e.preventDefault();
        }
      });

      playerOneRow[j].addEventListener('dragenter', (e) => {
        if (!P1Ready) {
          e.preventDefault();

          // currentlyDragged = [length, orientation, index in the array of ship squares, [...original squares' IDs]]
          const [shipLength, orientation, index] = currentlyDragged;

          const newSquares = [];
          // As on the board ('A', 3; 'B', 1 etc.)
          const newCoords = [];

          if (orientation === 'horizontal') {
            // Check for not sticking out of the board's boundaries
            for (let k = j - index; k < j - index + shipLength; k += 1) {
              if (k > 9 || k < 0) return;
            }

            for (let k = j - index; k < j - index + shipLength; k += 1) {
              newSquares.push(playerOneRow[k]);
              newCoords.push([letter, k + 1]);
            }
          } else {
            // Check for not sticking out of the board's boundaries
            for (let l = i - index; l < i - index + shipLength; l += 1) {
              if (l > 9 || l < 0) return;
            }

            for (let l = i - index; l < i - index + shipLength; l += 1) {
              newSquares.push(playerOneRows[l].querySelectorAll('.square')[j]);
              newCoords.push([letters[l], j + 1]);
            }
          }

          currentlyDraggedOver = [[...newSquares], [...newCoords]];

          if (game.P1OpenForPlacement(newCoords[0], newCoords.at(-1))) {
            newSquares.forEach((square, k) => {
              const coordOnBoard = newCoords[k];
              square.classList.add('available');
              addP1DragEventListener(square, coordOnBoard[0], coordOnBoard[1]);
            });
          }
        }
      });

      playerOneRow[j].addEventListener('dragleave', (e) => {
        e.preventDefault();

        // currentlyDragged = [length, orientation, index in the array of ship squares, [...original squares' IDs]]
        const [shipLength, orientation, index] = currentlyDragged;

        const leftSquares = [];

        if (orientation === 'horizontal') {
          // Check for not sticking out of the board's boundaries
          for (let k = j - index; k < j - index + shipLength; k += 1) {
            if (k > 9 || k < 0) return;
          }

          for (let k = j - index; k < j - index + shipLength; k += 1) {
            leftSquares.push(playerOneRow[k]);
          }
        } else {
          // Check for not sticking out of the board's boundaries
          for (let l = i - index; l < i - index + shipLength; l += 1) {
            if (l > 9 || l < 0) return;
          }

          for (let l = i - index; l < i - index + shipLength; l += 1) {
            leftSquares.push(playerOneRows[l].querySelectorAll('.square')[j]);
          }
        }

        const sqsCurDraggedOver = currentlyDraggedOver[0];
        const curDraggedOverCoords = currentlyDraggedOver[1];

        // This is for the case when a dragged ship has just met a boundary
        let boundary = true;

        // eslint-disable-next-line no-restricted-syntax
        for (const square of leftSquares) {
          if (!sqsCurDraggedOver.includes(square)) {
            boundary = false;
            break;
          }
        }

        if (boundary) {
          leftSquares.forEach((square) => square.classList.remove('available'));
        } else if (
          !game.P1OpenForPlacement(
            curDraggedOverCoords[0],
            curDraggedOverCoords.at(-1),
          )
        ) {
          // eslint-disable-next-line no-shadow
          for (let i = 0; i < leftSquares.length; i += 1) {
            leftSquares[i].classList.remove('available');
            if (!leftSquares.includes(sqsCurDraggedOver[i])) {
              sqsCurDraggedOver[i].classList.remove('available');
            }
          }
        } else {
          leftSquares.forEach((square) => {
            if (!sqsCurDraggedOver.includes(square)) {
              square.classList.remove('available');
            }
          });
        }
      });

      playerOneRow[j].addEventListener('drop', (e) => {
        if (!P1Ready) {
          e.preventDefault();
          // [length, orientation, index in the array of ship squares, [...original squares' IDs]]
          const [shipLength, orientation, index, originalSquareCoords] =
            JSON.parse(e.dataTransfer.getData('text/plain'));
          const originalSquares = originalSquareCoords.map(
            (coord) =>
              playerOneRows[coord[0]].querySelectorAll('.square')[coord[1]],
          );

          try {
            const newSquares = [];
            // As on the board ('A', 3; 'B', 1 etc.)
            const newCoords = [];

            if (orientation === 'horizontal') {
              for (let k = j - index; k < j - index + shipLength; k += 1) {
                newSquares.push(playerOneRow[k]);
                newCoords.push([letter, k + 1]);
              }
            } else {
              for (let l = i - index; l < i - index + shipLength; l += 1) {
                newSquares.push(
                  playerOneRows[l].querySelectorAll('.square')[j],
                );
                newCoords.push([letters[l], j + 1]);
              }
            }

            // If this method throws, the dragging should be reversed
            const output = game.P1ChangeShipPosition(
              newCoords[0],
              newCoords.at(-1),
            );

            originalSquares.forEach((square) => {
              // eslint-disable-next-line no-param-reassign
              square.ondragstart = null;
              square.setAttribute('draggable', 'false');
            });

            // eslint-disable-next-line no-shadow
            newSquares.forEach((square, index) => {
              const coordOnBoard = newCoords[index];
              square.classList.add('occupied');
              square.setAttribute('draggable', 'true');
              addP1DragEventListener(square, coordOnBoard[0], coordOnBoard[1]);
            });
          } catch {
            originalSquares.forEach((square) =>
              square.classList.add('occupied'),
            );
          }
        }
      });

      if (game.isP1SqOccupied(letter, j + 1)) {
        playerOneRow[j].setAttribute('draggable', 'true');
        addP1DragEventListener(playerOneRow[j], letter, j + 1);
      }

      // The rest of logic (not drag and drop)
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

            if (game.winner !== null) {
              whoseTurnWrapper.textContent = `${playerTwoName} wins!`;
            }

            if (game.whoseTurn !== game.playerTwo) {
              playerOneBoardEnemy.style.display = 'none';

              if (game.winner === null) {
                handoverDialogOne.show();
                whoseTurnDOM.textContent = playerOneName;
                playerTwoBoard.style.display = 'none';
                playerTwoBoardEnemy.style.display = 'flex';
              }

              playerOneBoard.style.display = 'flex';
            }
          } catch (error) {
            // Implement some kind of logic to explain to the user that you can't hit twice the same square, if he/she tries to click more than one time, like 5 times or more.
          }
        }
      });

      // Drag-and-drop functionality
      playerTwoRow[j].addEventListener('dragover', (e) => {
        if (!P2Ready) {
          e.preventDefault();
        }
      });

      playerTwoRow[j].addEventListener('dragenter', (e) => {
        if (!P2Ready) {
          e.preventDefault();

          // currentlyDragged = [length, orientation, index in the array of ship squares, [...original squares' IDs]]
          const [shipLength, orientation, index] = currentlyDragged;

          const newSquares = [];
          // As on the board ('A', 3; 'B', 1 etc.)
          const newCoords = [];

          if (orientation === 'horizontal') {
            // Check for not sticking out of the board's boundaries
            for (let k = j - index; k < j - index + shipLength; k += 1) {
              if (k > 9 || k < 0) return;
            }

            for (let k = j - index; k < j - index + shipLength; k += 1) {
              newSquares.push(playerTwoRow[k]);
              newCoords.push([letter, k + 1]);
            }
          } else {
            // Check for not sticking out of the board's boundaries
            for (let l = i - index; l < i - index + shipLength; l += 1) {
              if (l > 9 || l < 0) return;
            }

            for (let l = i - index; l < i - index + shipLength; l += 1) {
              newSquares.push(playerTwoRows[l].querySelectorAll('.square')[j]);
              newCoords.push([letters[l], j + 1]);
            }
          }

          currentlyDraggedOver = [[...newSquares], [...newCoords]];

          if (game.P2OpenForPlacement(newCoords[0], newCoords.at(-1))) {
            newSquares.forEach((square, k) => {
              const coordOnBoard = newCoords[k];
              square.classList.add('available');
              addP2DragEventListener(square, coordOnBoard[0], coordOnBoard[1]);
            });
          }
        }
      });

      playerTwoRow[j].addEventListener('dragleave', (e) => {
        e.preventDefault();

        // currentlyDragged = [length, orientation, index in the array of ship squares, [...original squares' IDs]]
        const [shipLength, orientation, index] = currentlyDragged;

        const leftSquares = [];

        if (orientation === 'horizontal') {
          // Check for not sticking out of the board's boundaries
          for (let k = j - index; k < j - index + shipLength; k += 1) {
            if (k > 9 || k < 0) return;
          }

          for (let k = j - index; k < j - index + shipLength; k += 1) {
            leftSquares.push(playerTwoRow[k]);
          }
        } else {
          // Check for not sticking out of the board's boundaries
          for (let l = i - index; l < i - index + shipLength; l += 1) {
            if (l > 9 || l < 0) return;
          }

          for (let l = i - index; l < i - index + shipLength; l += 1) {
            leftSquares.push(playerTwoRows[l].querySelectorAll('.square')[j]);
          }
        }

        const sqsCurDraggedOver = currentlyDraggedOver[0];
        const curDraggedOverCoords = currentlyDraggedOver[1];

        // This is for the case when a dragged ship has just met a boundary
        let boundary = true;

        // eslint-disable-next-line no-restricted-syntax
        for (const square of leftSquares) {
          if (!sqsCurDraggedOver.includes(square)) {
            boundary = false;
            break;
          }
        }

        if (boundary) {
          leftSquares.forEach((square) => square.classList.remove('available'));
        } else if (
          !game.P2OpenForPlacement(
            curDraggedOverCoords[0],
            curDraggedOverCoords.at(-1),
          )
        ) {
          // eslint-disable-next-line no-shadow
          for (let i = 0; i < leftSquares.length; i += 1) {
            leftSquares[i].classList.remove('available');
            if (!leftSquares.includes(sqsCurDraggedOver[i])) {
              sqsCurDraggedOver[i].classList.remove('available');
            }
          }
        } else {
          leftSquares.forEach((square) => {
            if (!sqsCurDraggedOver.includes(square)) {
              square.classList.remove('available');
            }
          });
        }
      });

      playerTwoRow[j].addEventListener('drop', (e) => {
        if (!P2Ready) {
          e.preventDefault();
          // [length, orientation, index in the array of ship squares, [...original squares' IDs]]
          const [shipLength, orientation, index, originalSquareCoords] =
            JSON.parse(e.dataTransfer.getData('text/plain'));
          const originalSquares = originalSquareCoords.map(
            (coord) =>
              playerTwoRows[coord[0]].querySelectorAll('.square')[coord[1]],
          );

          try {
            const newSquares = [];
            // As on the board ('A', 3; 'B', 1 etc.)
            const newCoords = [];

            if (orientation === 'horizontal') {
              for (let k = j - index; k < j - index + shipLength; k += 1) {
                newSquares.push(playerTwoRow[k]);
                newCoords.push([letter, k + 1]);
              }
            } else {
              for (let l = i - index; l < i - index + shipLength; l += 1) {
                newSquares.push(
                  playerTwoRows[l].querySelectorAll('.square')[j],
                );
                newCoords.push([letters[l], j + 1]);
              }
            }

            // If this method throws, the dragging should be reversed
            game.P2ChangeShipPosition(newCoords[0], newCoords.at(-1));

            originalSquares.forEach((square) => {
              // eslint-disable-next-line no-param-reassign
              square.ondragstart = null;
            });

            // eslint-disable-next-line no-shadow
            newSquares.forEach((square, index) => {
              const coordOnBoard = newCoords[index];
              square.classList.add('occupied');
              addP2DragEventListener(square, coordOnBoard[0], coordOnBoard[1]);
            });
          } catch {
            originalSquares.forEach((square) =>
              square.classList.add('occupied'),
            );
          }
        }
      });

      if (game.isP2SqOccupied(letter, j + 1)) {
        playerTwoRow[j].setAttribute('draggable', 'true');
        addP2DragEventListener(playerTwoRow[j], letter, j + 1);
      }

      // The rest of logic (not drag and drop)
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

            if (game.winner !== null) {
              whoseTurnWrapper.textContent = `${playerOneName} wins!`;
            }

            if (game.whoseTurn !== game.playerOne) {
              playerTwoBoardEnemy.style.display = 'none';

              if (game.winner === null) {
                handoverDialogTwo.show();
                whoseTurnDOM.textContent = playerTwoName;
                playerOneBoard.style.display = 'none';
                playerOneBoardEnemy.style.display = 'flex';
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
  P1ReadyDialog.show();
});
