import Player from './Player';

function populateBoard(board) {
  board.placeShip(['B', 1], ['F', 1]);
  board.placeShip(['C', 4], ['C', 7]);
  board.placeShip(['E', 3], ['E', 5]);
  board.placeShip(['G', 6], ['H', 6]);
  board.placeShip(['J', 4]);
}

export const player1 = new Player();
export const board1 = player1.gameboard;
populateBoard(board1);

export const player2 = new Player();
export const board2 = player2.gameboard;
populateBoard(board2);

player1.attack = board2.receiveAttack;
player2.attack = board1.receiveAttack;
