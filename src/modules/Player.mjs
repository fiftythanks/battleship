/* 
  3. Create a Player class/factory.

    1. There will be two types of players in the game, ‘real’ players and ‘computer’ players.
    
    2. Each player object should contain its own gameboard.
*/

import Gameboard from './Gameboard';

export default class Player {
  constructor() {
    this.gameboard = new Gameboard();
  }
}
