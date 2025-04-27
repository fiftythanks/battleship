/* 
  1. Begin your app by creating the Ship class/factory (your choice).

    1. Your ‘ships’ will be objects that include their length, the number of times they’ve been hit and whether or not they’ve been sunk.

    2. REMEMBER you only have to test your object’s public interface. Only methods or properties that are used outside of your ‘ship’ object need unit tests.
    
    3. Ships should have a hit() function that increases the number of ‘hits’ in your ship.
    
    4. isSunk() should be a function that calculates whether a ship is considered sunk based on its length and the number of hits it has received.
*/

export default class Battleship {
  constructor(length) {
    if (
      typeof length !== 'number' ||
      !Number.isInteger(length) ||
      length < 1 ||
      length > 5
    )
      throw new TypeError(
        'Incorrect length! Length must be an integer number from 1 to 5. Any other value will result in an error.',
      );
    this.length = length;
    this.hits = 0;
  }

  hit() {
    this.hits += 1;
  }

  get isSunk() {
    return this.hits >= this.length;
  }

  get wasHit() {
    return this.hits > 0;
  }

  get type() {
    let type;
    switch (this.length) {
      case 1:
        type = 'patrolBoat';
        break;
      case 2:
        type = 'submarine';
        break;
      case 3:
        type = 'destroyer';
        break;
      case 4:
        type = 'battleship';
        break;
      case 5:
        type = 'carrier';
        break;
      default:
      // do nothing
    }
    return type;
  }
}
