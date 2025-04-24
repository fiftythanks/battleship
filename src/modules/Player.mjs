/* 
  3. Create a Player class/factory.

    1. There will be two types of players in the game, ‘real’ players and ‘computer’ players.
    
    2. Each player object should contain its own gameboard.
*/

import Gameboard from './Gameboard';

export default class Player {
  constructor(name) {
    this.gameboard = new Gameboard();
    this.hasLost = this.gameboard.areAllSunk;
    this.placeShip = this.gameboard.placeShip;
    this.isOccupied = this.gameboard.isOccupied;
    this.receiveAttack = this.gameboard.receiveAttack;
    this.name = name;
  }
}
