/*
  2. Create a Gameboard class/factory.

    1. Note that we have not yet created any User Interface. We should know our code is coming together by running the tests. You shouldn’t be relying on console.log or DOM methods to make sure your code is doing what you expect it to.
    
    2. Gameboards should be able to place ships at specific coordinates by calling the ship factory or class.
    
    3. Gameboards should have a receiveAttack function that takes a pair of coordinates, determines whether or not the attack hit a ship and then sends the ‘hit’ function to the correct ship, or records the coordinates of the missed shot.
    
    4. Gameboards should keep track of missed attacks so they can display them properly.
    
    5. Gameboards should be able to report whether or not all of their ships have been sunk.
*/

import Battleship from './Battleship';

/* 
    1 2 3 4 5 6 7 8 9 10
  A • • • • • • • • • •
  B • • • • • • • • • •
  C • • • • • • • • • • 
  D • • • • • • • • • •
  E • • • • • • • • • •
  F • • • • • • • • • •
  G • • • • • • • • • •
  H • • • • • • • • • •
  I • • • • • • • • • •
  J • • • • • • • • • •
*/

const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

export default class Gameboard {
  constructor() {
    this.rows = {};

    for (let i = 0; i < 10; i += 1) {
      const row = [];
      for (let j = 0; j < 10; j += 1) {
        row.push({ occupiedBy: null });
      }
      this.rows[`${letters[i]}`] = row;
    }

    this.misses = [];
    this.hits = [];

    // 5 squares
    this.carrier = {
      instance: null,
      coords: [
        [null, null],
        [null, null],
        [null, null],
        [null, null],
        [null, null],
      ],
    };
    // 4 squares
    this.battleship = {
      instance: null,
      coords: [
        [null, null],
        [null, null],
        [null, null],
        [null, null],
      ],
    };
    // 3 squares
    this.destroyer = {
      instance: null,
      coords: [
        [null, null],
        [null, null],
        [null, null],
      ],
    };
    // 2 squares
    this.submarine = {
      instance: null,
      coords: [
        [null, null],
        [null, null],
      ],
    };
    // 1 square
    this.patrolBoat = {
      instance: null,
      coords: [[null, null]],
    };
  }

  // coord = [row, col]; col parameters are not indices of elements in rows, they are column indices on the board as pictured above; row parameters are letters from A to J.
  placeShip = (coord1, coord2) => {
    if (!Array.isArray(coord1) || coord1.length !== 2) {
      throw new TypeError(
        'Incorrect coordinates! Input must be in the form (coord1, coord2), where coord1 is an array of two elements, first of which is a capital English alphabet letter from A to J, and second is a number from 1 to 10. coord2 is either an array abiding by the same rules or undefine.',
      );
    }
    const [row1, col1] = coord1;
    let row2;
    let col2;

    if (Array.isArray(coord2) && coord2.length === 2) {
      [row2, col2] = coord2;
    } else if (coord2 === undefined) {
      row2 = undefined;
      col2 = undefined;
    } else {
      throw new TypeError(
        'Incorrect coordinates! Input must be in the form (coord1, coord2), where coord1 is an array of two elements, first of which is a capital English alphabet letter from A to J, and second is a number from 1 to 10. coord2 is either an array abiding by the same rules or undefine.',
      );
    }

    if (
      !letters.includes(row1) ||
      typeof col1 !== 'number' ||
      !Number.isInteger(col1) ||
      col1 < 1 ||
      col1 > 10 ||
      ((row2 !== undefined || col2 !== undefined) &&
        (!letters.includes(row2) ||
          typeof col2 !== 'number' ||
          !Number.isInteger(col2) ||
          col2 < 1 ||
          col2 > 10 ||
          (row1 !== row2 && col1 !== col2)))
    ) {
      throw new Error(
        "Incorrect coordinates. Input must be in the form ([row1, col1], [row2, col2]), where row1, row2 are letters from A to J and col1, col2 are integers from 1 to 10. Ships must be places in one row or in one column, therefore if col1 isn't equal to col2, then row1 = row2, and if row1 isn't equal to row2, then col1 = col2.",
      );
    }

    let ship;

    if (row2 === undefined && col2 === undefined) {
      const row = this.rows[`${row1}`];
      const col = col1;

      if (row[col - 1].occupiedBy !== null) return null;

      const type = 'patrolBoat';
      if (this[`${type}`].instance !== null) {
        throw new Error(
          `A ship of type ${type} is already present on the board.`,
        );
      }

      const length = 1;
      ship = new Battleship(length);
      row[col - 1].occupiedBy = ship;
      this[`${type}`].instance = ship;
      this[`${type}`].coords[0][0] = row1;
      this[`${type}`].coords[0][1] = col;
    } else if (row1 === row2) {
      const row = this.rows[`${row1}`];

      // Check if the squares are already occupied
      for (let col = col1; col <= col2; col += 1) {
        if (row[col - 1].occupiedBy !== null) return null;
      }

      const length = col2 - col1 + 1;

      let type;
      switch (length) {
        case 5:
          type = 'carrier';
          break;
        case 4:
          type = 'battleship';
          break;
        case 3:
          type = 'destroyer';
          break;
        case 2:
          type = 'submarine';
          break;
        case 1:
          type = 'patrolBoat';
          break;
        default:
        // do nothing
      }

      if (this[`${type}`].instance !== null) {
        throw new Error(
          `A ship of type ${type} is already present on the board.`,
        );
      }

      ship = new Battleship(length);
      this[`${type}`].instance = ship;

      for (let col = col1, i = 0; col <= col2; col += 1) {
        row[col - 1].occupiedBy = ship;
        this[`${type}`].coords[i][0] = row1;
        this[`${type}`].coords[i][1] = col;
        i += 1;
      }
    } else {
      const col = col1;

      // Check if the squares are already occupied
      for (
        let row = letters.indexOf(row1);
        row <= letters.indexOf(row2);
        row += 1
      ) {
        if (this.rows[`${letters[row]}`][col - 1].occupiedBy !== null)
          return null;
      }

      const length = letters.indexOf(row2) - letters.indexOf(row1) + 1;

      let type;
      switch (length) {
        case 5:
          type = 'carrier';
          break;
        case 4:
          type = 'battleship';
          break;
        case 3:
          type = 'destroyer';
          break;
        case 2:
          type = 'submarine';
          break;
        case 1:
          type = 'patrolBoat';
          break;
        default:
        // do nothing
      }

      if (this[`${type}`].instance !== null) {
        throw new Error(
          `A ship of type ${type} is already present on the board.`,
        );
      }

      ship = new Battleship(length);
      this[`${type}`].instance = ship;

      for (
        let row = letters.indexOf(row1), i = 0;
        row <= letters.indexOf(row2);
        row += 1
      ) {
        this.rows[`${letters[row]}`][col - 1].occupiedBy = ship;
        this[`${type}`].coords[i][0] = letters[row];
        this[`${type}`].coords[i][1] = col;
        i += 1;
      }
    }

    return ship;
  };

  isOccupied = (row, col) => {
    if (
      !letters.includes(row) ||
      typeof col !== 'number' ||
      !Number.isInteger(col) ||
      col < 1 ||
      col > 10
    ) {
      throw new Error(
        'Incorrect arguments. The arguments must be in the form (row, col), where row is a letter from A to J and col is a number from 1 to 10.',
      );
    }

    return this.rows[`${row}`][col - 1].occupiedBy;
  };

  receiveAttack = (row, col) => {
    if (
      !letters.includes(row) ||
      typeof col !== 'number' ||
      !Number.isInteger(col) ||
      col < 1 ||
      col > 10
    ) {
      throw new Error(
        'Incorrect arguments. The arguments must be in the form (row, col), where row is a letter from A to J and col is a number from 1 to 10.',
      );
    }

    // Check if the square has already been hit. You can't hit the same square multiple times.
    if (
      this.hits.filter((coord) => coord[0] === row && coord[1] === col).length >
        0 ||
      this.misses.filter((coord) => coord[0] === row && coord[1] === col)
        .length > 0
    ) {
      throw new Error(`Square (${row}, ${col}) has already been attacked.`);
    }

    const occupation = this.isOccupied(row, col);
    if (occupation !== null) {
      occupation.hit();
      this.hits.push([row, col]);
    } else {
      this.misses.push([row, col]);
    }

    return occupation;
  };

  get areAllSunk() {
    if (this.carrier.instance !== null && !this.carrier.instance.isSunk)
      return false;
    if (this.battleship.instance !== null && !this.battleship.instance.isSunk)
      return false;
    if (this.destroyer.instance !== null && !this.destroyer.instance.isSunk)
      return false;
    if (this.submarine.instance !== null && !this.submarine.instance.isSunk)
      return false;
    if (this.patrolBoat.instance !== null && !this.patrolBoat.instance.isSunk)
      return false;
    return true;
  }

  get isFleetFull() {
    if (this.carrier.instance === null) return false;
    if (this.battleship.instance === null) return false;
    if (this.destroyer.instance === null) return false;
    if (this.submarine.instance === null) return false;
    if (this.patrolBoat.instance === null) return false;
    return true;
  }

  wasAttacked = (row, col) => {
    if (
      this.isOccupied(row, col) &&
      this.hits.filter((coord) => coord[0] === row && coord[1] === col).length >
        0
    ) {
      return true;
    }
    if (
      !this.isOccupied(row, col) &&
      this.misses.filter((coord) => coord[0] === row && coord[1] === col)
        .length > 0
    ) {
      return true;
    }
    return false;
  };

  get isPatrolBoatSunk() {
    return this.patrolBoat.instance.isSunk;
  }

  get wasPatrolBoatHit() {
    return this.patrolBoat.instance.wasHit;
  }

  get isSubmarineSunk() {
    return this.submarine.instance.isSunk;
  }

  get wasSubmarineHit() {
    return this.submarine.instance.wasHit;
  }

  get isDestroyerSunk() {
    return this.destroyer.instance.isSunk;
  }

  get wasDestroyerHit() {
    return this.destroyer.instance.wasHit;
  }

  get isBattleshipSunk() {
    return this.battleship.instance.isSunk;
  }

  get wasBattleshipHit() {
    return this.battleship.instance.wasHit;
  }

  get isCarrierSunk() {
    return this.carrier.instance.isSunk;
  }

  get wasCarrierHit() {
    return this.carrier.instance.wasHit;
  }

  get patrolBoatCoords() {
    return this.patrolBoat.coords;
  }

  get submarineCoords() {
    return this.submarine.coords;
  }

  get destroyerCoords() {
    return this.destroyer.coords;
  }

  get battleshipCoords() {
    return this.battleship.coords;
  }

  get carrierCoords() {
    return this.carrier.coords;
  }
}
