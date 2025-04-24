import Player from './Player';

function populateBoard(board) {
  board.placeShip(['B', 1], ['F', 1]);
  board.placeShip(['C', 4], ['C', 7]);
  board.placeShip(['E', 3], ['E', 5]);
  board.placeShip(['G', 6], ['H', 6]);
  board.placeShip(['J', 4]);
}

export default class Game {
  constructor(name1 = 'Player1', name2 = 'Player2') {
    this.playerOne = new Player(name1);
    this.playerTwo = new Player(name2);
    populateBoard(this.playerOne.gameboard);
    populateBoard(this.playerTwo.gameboard);
    this.whoseTurn = this.playerOne;
    this.winner = null;
  }

  attackPlayerOne = (row, col) => this.playerOne.receiveAttack(row, col);

  attackPlayerTwo = (row, col) => this.playerTwo.receiveAttack(row, col);

  makeTurn = (row, col) => {
    if (this.winner === null) {
      // if miss, it's null, if hit a ship, it's the ship object
      const hitResult = this.whoseTurn.attack(row, col);
      if (this.whoseTurn === this.playerOne) {
        if (this.playerTwo.hasLost()) {
          this.winner = this.playerOne;
        } else {
          this.whoseTurn = this.playerTwo;
        }
      } else if (this.whoseTurn === this.playerTwo) {
        if (this.playerOne.hasLost()) {
          this.winner = this.playerTwo;
        } else {
          this.whoseTurn = this.playerOne;
        }
      }
      return hitResult;
    }
    return this.winner !== null;
  };

  isP1SqOccupied = (row, col) => this.playerOne.isOccupied(row, col);

  isP2SqOccupied = (row, col) => this.playerTwo.isOccupied(row, col);

  get P1Name() {
    return this.playerOne.name;
  }

  get P2Name() {
    return this.playerTwo.name;
  }

  get isP1FleetFull() {
    return this.playerOne.isFleetFull();
  }

  get isP2FleetFull() {
    return this.playerTwo.isFleetFull();
  }
}
