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

  #attackPlayerOne = (row, col) => this.playerOne.receiveAttack(row, col);

  #attackPlayerTwo = (row, col) => this.playerTwo.receiveAttack(row, col);

  makeTurn = (row, col) => {
    if (this.winner === null) {
      // if miss, it's null, if hit a ship, it's the ship object
      let hitResult;

      if (this.whoseTurn === this.playerOne) {
        hitResult = this.#attackPlayerTwo(row, col);

        if (this.playerTwo.hasLost) {
          this.winner = this.playerOne;
        } else if (hitResult === null) {
          this.whoseTurn = this.playerTwo;
        }
      } else if (this.whoseTurn === this.playerTwo) {
        hitResult = this.#attackPlayerOne(row, col);

        if (this.playerOne.hasLost) {
          this.winner = this.playerTwo;
        } else if (hitResult === null) {
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
    return this.playerOne.isFleetFull;
  }

  get isP2FleetFull() {
    return this.playerTwo.isFleetFull;
  }

  P1WasAttacked = (row, col) => this.playerOne.wasAttacked(row, col);

  P2WasAttacked = (row, col) => this.playerTwo.wasAttacked(row, col);

  get isP1PatrolBoatSunk() {
    return this.playerOne.isPatrolBoatSunk;
  }

  get wasP1PatrolBoatHit() {
    return this.playerOne.wasPatrolBoatHit;
  }

  get P1PatrolBoatCoords() {
    return this.playerOne.patrolBoatCoords;
  }

  get isP2PatrolBoatSunk() {
    return this.playerTwo.isPatrolBoatSunk;
  }

  get wasP2PatrolBoatHit() {
    return this.playerTwo.wasPatrolBoatHit;
  }

  get P2PatrolBoatCoords() {
    return this.playerTwo.patrolBoatCoords;
  }

  get isP1SubmarineSunk() {
    return this.playerOne.isSubmarineSunk;
  }

  get wasP1SubmarineHit() {
    return this.playerOne.wasSubmarineHit;
  }

  get P1SubmarineCoords() {
    return this.playerOne.submarineCoords;
  }

  get isP2SubmarineSunk() {
    return this.playerTwo.isSubmarineSunk;
  }

  get wasP2SubmarineHit() {
    return this.playerTwo.wasSubmarineHit;
  }

  get P2SubmarineCoords() {
    return this.playerTwo.submarineCoords;
  }

  get isP1DestroyerSunk() {
    return this.playerOne.isDestroyerSunk;
  }

  get wasP1DestroyerHit() {
    return this.playerOne.wasDestroyerHit;
  }

  get P1DestroyerCoords() {
    return this.playerOne.destroyerCoords;
  }

  get isP2DestroyerSunk() {
    return this.playerTwo.isDestroyerSunk;
  }

  get wasP2DestroyerHit() {
    return this.playerTwo.wasDestroyerHit;
  }

  get P2DestroyerCoords() {
    return this.playerTwo.destroyerCoords;
  }

  get isP1BattleshipSunk() {
    return this.playerOne.isBattleshipSunk;
  }

  get wasP1BattleshipHit() {
    return this.playerOne.wasBattleshipHit;
  }

  get P1BattleshipCoords() {
    return this.playerOne.battleshipCoords;
  }

  get isP2BattleshipSunk() {
    return this.playerTwo.isBattleshipSunk;
  }

  get wasP2BattleshipHit() {
    return this.playerTwo.wasBattleshipHit;
  }

  get P2BattleshipCoords() {
    return this.playerTwo.battleshipCoords;
  }

  get isP1CarrierSunk() {
    return this.playerOne.isCarrierSunk;
  }

  get wasP1CarrierHit() {
    return this.playerOne.wasCarrierHit;
  }

  get P1CarrierCoords() {
    return this.playerOne.carrierCoords;
  }

  get isP2CarrierSunk() {
    return this.playerTwo.isCarrierSunk;
  }

  get wasP2CarrierHit() {
    return this.playerTwo.wasCarrierHit;
  }

  get P2CarrierCoords() {
    return this.playerTwo.carrierCoords;
  }
}
