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

  get patrolBoatCoords() {
    return this.gameboard.patrolBoatCoords;
  }

  get isSubmarineSunk() {
    return this.gameboard.isSubmarineSunk;
  }

  get wasSubmarineHit() {
    return this.gameboard.wasSubmarineHit;
  }

  get submarineCoords() {
    return this.gameboard.submarineCoords;
  }

  get isDestroyerSunk() {
    return this.gameboard.isDestroyerSunk;
  }

  get wasDestroyerHit() {
    return this.gameboard.wasDestroyerHit;
  }

  get destroyerCoords() {
    return this.gameboard.destroyerCoords;
  }

  get isBattleshipSunk() {
    return this.gameboard.isBattleshipSunk;
  }

  get wasBattleshipHit() {
    return this.gameboard.wasBattleshipHit;
  }

  get battleshipCoords() {
    return this.gameboard.battleshipCoords;
  }

  get isCarrierSunk() {
    return this.gameboard.isCarrierSunk;
  }

  get wasCarrierHit() {
    return this.gameboard.wasCarrierHit;
  }

  get carrierCoords() {
    return this.gameboard.carrierCoords;
  }

  changeShipPosition = (coord1, coord2) =>
    this.gameboard.changeShipPosition(coord1, coord2);

  openForPlacement = (coord1, coord2) =>
    this.gameboard.openForPlacement(coord1, coord2);

  changeOrientation = (row, col) => this.gameboard.changeOrientation(row, col);
}
