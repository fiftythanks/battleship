/* 
  3. Create a Player class/factory.

    1. There will be two types of players in the game, ‘real’ players and ‘computer’ players.
    
    2. Each player object should contain its own gameboard.
*/

import Gameboard from './Gameboard';

export default class Player {
  constructor(name = 'Player') {
    this.gameboard = new Gameboard();
    this.name = name;
  }

  get hasLost() {
    return this.gameboard.areAllSunk;
  }

  placeShip = (coord1, coord2) => this.gameboard.placeShip(coord1, coord2);

  isOccupied = (row, col) => this.gameboard.isOccupied(row, col);

  receiveAttack = (row, col) => this.gameboard.receiveAttack(row, col);

  get isFleetFull() {
    return this.gameboard.isFleetFull;
  }

  wasAttacked = (row, col) => this.gameboard.wasAttacked(row, col);

  get isPatrolBoatSunk() {
    return this.gameboard.isPatrolBoatSunk;
  }

  get wasPatrolBoatHit() {
    return this.gameboard.wasPatrolBoatHit;
  }

  get isSubmarineSunk() {
    return this.gameboard.isSubmarineSunk;
  }

  get wasSubmarineHit() {
    return this.gameboard.wasSubmarineHit;
  }

  get isDestroyerSunk() {
    return this.gameboard.isDestroyerSunk;
  }

  get wasDestroyerHit() {
    return this.gameboard.wasDestroyerHit;
  }

  get isBattleshipSunk() {
    return this.gameboard.isBattleshipSunk;
  }

  get wasBattleshipHit() {
    return this.gameboard.wasBattleshipHit;
  }

  get isCarrierSunk() {
    return this.gameboard.isCarrierSunk;
  }

  get wasCarrierHit() {
    return this.gameboard.wasCarrierHit;
  }
}
