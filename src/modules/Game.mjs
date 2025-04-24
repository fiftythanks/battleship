import Player from './Player';

export default class Game {
  constructor(name1 = 'Player1', name2 = 'Player2') {
    this.playerOne = new Player(name1);
    this.playerTwo = new Player(name2);
    this.whoseTurn = this.playerOne;
    this.winner = null;
  }

  P1PlaceShip = (coord1, coord2) => this.playerOne.placeShip(coord1, coord2);

  P2PlaceShip = (coord1, coord2) => this.playerTwo.placeShip(coord1, coord2);

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
