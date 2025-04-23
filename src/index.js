import './style.css';
import { player1, board1, player2, board2 } from './modules/game';

function initialize() {
  const playerOneRows = document.querySelectorAll('.player1 .row');
  const playerTwoRows = document.querySelectorAll('.player2 .row');
  const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

  for (let i = 0; i < 10; i += 1) {
    const letter = letters[i];
    const playerOneRow = playerOneRows[i].querySelectorAll('.square');
    const playerTwoRow = playerTwoRows[i].querySelectorAll('.square');

    for (let j = 0; j < 10; j += 1) {
      if (board1.isOccupied(`${letter}`, j + 1))
        playerOneRow[j].classList.add('occupied');
      if (board2.isOccupied(`${letter}`, j + 1))
        playerTwoRow[j].classList.add('occupied');
    }
  }
}

initialize();
