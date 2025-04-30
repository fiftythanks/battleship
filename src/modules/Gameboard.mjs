/* eslint-disable no-labels */
/* eslint-disable no-continue */
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

function arrIncludes(array, coord) {
  return (
    array.filter(
      (arrCoord) => arrCoord[0] === coord[0] && arrCoord[1] === coord[1],
    ).length > 0
  );
}

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
        'Incorrect coordinates! Input must be in the form (coord1, coord2), where coord1 is an array of two elements, the first of which is a capital English letter from A to J, and the second is a number from 1 to 10. coord2 is either an array abiding by the same rules or undefine.',
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
        'Incorrect coordinates! Input must be in the form (coord1, coord2), where coord1 is an array of two elements, the first of which is a capital English letter from A to J, and the second is a number from 1 to 10. coord2 is either an array abiding by the same rules or undefine.',
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

  changeShipPosition = (coord1, coord2) => {
    if (!Array.isArray(coord1) || coord1.length !== 2) {
      throw new TypeError(
        'Incorrect coordinates! Input must be in the form (coord1, coord2), where coord1 is an array of two elements, the first of which is a capital English letter from A to J, and the second a number from 1 to 10. coord2 is either an array abiding by the same rules or undefined.',
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
        'Incorrect coordinates! Input must be in the form (coord1, coord2), where coord1 is an array of two elements, the first of which is a capital English letter from A to J, and the second is a number from 1 to 10. coord2 is either an array abiding by the same rules or undefine.',
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

      const type = 'patrolBoat';

      // Check if the square or the surrounding squares are occupied
      for (let i = row1 - 1; i <= row1 + 1; i += 1) {
        for (let j = col - 1; j <= col + 1; j += 1) {
          if (
            (this.rows[letters[i]] === undefined ||
              this.rows[letters[i]][j - 1] === undefined) &&
            j !== col1 - 1 &&
            j !== col2 + 1 &&
            i !== letters.indexOf(row1) - 1 &&
            i !== letters.indexOf(row1) + 1
          ) {
            throw new Error('Incorrect positioning!');
          }
          if (
            this.rows[letters[i]] !== undefined &&
            this.rows[letters[i]][j - 1] !== undefined &&
            this.rows[letters[i]][j - 1].occupiedBy !== null &&
            this.rows[letters[i]][j - 1].occupiedBy.type !== type
          ) {
            throw new Error('Occupied!');
          }
        }
      }

      ship = this[type].instance;
      const prevCoord = this[type].coords[0];
      this.rows[prevCoord[0]][prevCoord[1] - 1].occupiedBy = null;
      row[col - 1].occupiedBy = ship;
      this[type].coords[0][0] = row1;
      this[type].coords[0][1] = col;
    } else if (row1 === row2) {
      const row = this.rows[`${row1}`];

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

      // Check if the squares are already occupied
      for (let j = col1 - 1; j <= col2 + 1; j += 1) {
        for (
          let i = letters.indexOf(row1) - 1;
          i <= letters.indexOf(row1) + 1;
          i += 1
        ) {
          if (
            (this.rows[letters[i]] === undefined ||
              this.rows[letters[i]][j - 1] === undefined) &&
            j !== col1 - 1 &&
            j !== col2 + 1 &&
            i !== letters.indexOf(row1) - 1 &&
            i !== letters.indexOf(row1) + 1
          ) {
            throw new Error('Incorrect positioning!');
          }
          if (
            this.rows[letters[i]] !== undefined &&
            this.rows[letters[i]][j - 1] !== undefined &&
            this.rows[letters[i]][j - 1].occupiedBy !== null &&
            this.rows[letters[i]][j - 1].occupiedBy.type !== type
          )
            throw new Error('Occupied!');
        }
      }

      const prevCoords = this[type].coords;
      prevCoords.forEach((coord) => {
        // eslint-disable-next-line no-shadow
        const row = coord[0];
        const col = coord[1] - 1;
        this.rows[row][col].occupiedBy = null;
      });

      ship = this[type].instance;

      for (let col = col1, i = 0; col <= col2; col += 1) {
        row[col - 1].occupiedBy = ship;
        this[type].coords[i][0] = row1;
        this[type].coords[i][1] = col;
        i += 1;
      }
    } else {
      const col = col1;

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

      // Check if the squares are already occupied
      for (
        let i = letters.indexOf(row1) - 1;
        i <= letters.indexOf(row2) + 1;
        i += 1
      ) {
        for (let j = col - 1; j <= col + 1; j += 1) {
          if (
            (this.rows[letters[i]] === undefined ||
              this.rows[letters[i]][j - 1] === undefined) &&
            j !== col1 - 1 &&
            j !== col2 + 1 &&
            i !== letters.indexOf(row1) - 1 &&
            i !== letters.indexOf(row1) + 1
          ) {
            throw new Error('Incorrect positioning!');
          }
          if (
            this.rows[letters[i]] !== undefined &&
            this.rows[letters[i]][j - 1] !== undefined &&
            this.rows[letters[i]][j - 1].occupiedBy !== null &&
            this.rows[letters[i]][j - 1].occupiedBy.type !== type
          ) {
            throw new Error('Occupied!');
          }
        }
      }

      const prevCoords = this[type].coords;
      prevCoords.forEach((coord) => {
        const row = coord[0];
        // eslint-disable-next-line no-shadow
        const col = coord[1] - 1;
        this.rows[row][col].occupiedBy = null;
      });

      ship = this[type].instance;

      for (
        let row = letters.indexOf(row1), i = 0;
        row <= letters.indexOf(row2);
        row += 1
      ) {
        this.rows[letters[row]][col - 1].occupiedBy = ship;
        this[type].coords[i][0] = letters[row];
        this[type].coords[i][1] = col;
        i += 1;
      }
    }

    return ship;
  };

  #availableSquares = () => {
    const allSquares = [];
    let i = 0;
    Object.values(this.rows).forEach((row) => {
      for (let j = 0; j < row.length; j += 1) {
        allSquares.push([letters[i], j + 1]);
      }
      i += 1;
    });

    const directlyUnavailableSquares = allSquares.filter(
      (coord) =>
        arrIncludes(this.carrierCoords, coord) ||
        arrIncludes(this.battleshipCoords, coord) ||
        arrIncludes(this.destroyerCoords, coord) ||
        arrIncludes(this.submarineCoords, coord) ||
        arrIncludes(this.patrolBoatCoords, coord),
    );

    const unavailableSquares = [];

    directlyUnavailableSquares.forEach(([row, col]) => {
      unavailableSquares.push([row, col]);

      // eslint-disable-next-line no-shadow
      const i = letters.indexOf(row);
      const j = col;

      if (i - 1 >= 0 && j - 1 >= 1) {
        unavailableSquares.push([letters[i - 1], j - 1]);
      }

      if (i - 1 >= 0) {
        unavailableSquares.push([letters[i - 1], j]);
      }

      if (i - 1 >= 0 && j + 1 <= 10) {
        unavailableSquares.push([letters[i - 1], j + 1]);
      }

      if (j - 1 >= 1) {
        unavailableSquares.push([letters[i], j - 1]);
      }

      if (j + 1 <= 10) {
        unavailableSquares.push([letters[i], j + 1]);
      }

      if (i + 1 < 10 && j - 1 >= 1) {
        unavailableSquares.push([letters[i + 1], j - 1]);
      }

      if (i + 1 < 10) {
        unavailableSquares.push([letters[i + 1], j]);
      }

      if (i + 1 < 10 && j + 1 <= 10) {
        unavailableSquares.push([letters[i + 1], j + 1]);
      }
    });

    const availableSquares = allSquares.filter(
      (coord) => !arrIncludes(unavailableSquares, coord),
    );

    return availableSquares;
  };

  openForPlacement = (coord1, coord2) => {
    if (
      coord2 !== undefined &&
      !(coord1[0] === coord2[0] || coord1[1] === coord2[1])
    ) {
      throw new Error(
        'Incorrect input! Arguments must be either one pair of coordinates or the first and the last pair of coordinates.',
      );
    }

    let length;
    if (coord2 !== undefined) {
      length =
        coord1[0] !== coord2[0]
          ? letters.indexOf(coord2[0]) - letters.indexOf(coord1[0]) + 1
          : coord2[1] - coord1[1] + 1;
    } else {
      length = 1;
    }

    let type;
    switch (length) {
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

    const contiguousAvailSqs = [];

    const shipCoords = this[`${type}Coords`];
    shipCoords.forEach((coord) => {
      // eslint-disable-next-line no-shadow
      const i = letters.indexOf(coord[0]);
      const j = coord[1];

      /* 
        Let's say we have this board:

          1 2 3 4 5 6 7 8 9 10
        A • • • • • • • • • +
        B + • • • • • • • • •
        C + • • + + + + • • • 
        D + • • • • • • • • •
        E + • • • • • • • • •
        F + • • • + • • • • •
        G • • • • + • • + + •
        H • • • • + • • • • •
        I • • • • • • • • • •
        J • • • • • • • • • •

        shipCords = [['C', 4], ['C', 5], ['C', 6], ['C', 7]].

        And we are currently on ['C', 4], i.e. coord = ['C', 4].

        Then, the loop below will check all squares in the area (('A', 2), ('A', 6), ('E', 2), ('E', 6)):
        
          1 2 3 4 5 6 7 8 9 10
        A • + + + + + • • • •
        B • + + + + + • • • •
        C • + + + + + • • • • 
        D • + + + + + • • • •
        E • + + + + + • • • •
        F • • • • • • • • • •
        G • • • • • • • • • •
        H • • • • • • • • • •
        I • • • • • • • • • •
        J • • • • • • • • • •

        This is done to make sure that the method gives all available squares, including the squares surrounding the ship when there's no other ship close to it. 

        I fully realize the inefficiency of this algorithm. I'm planning on replacing it to something better in the future.
      */
      for (let row = i - 1; row <= i + 1; row += 1) {
        if (row >= 0 && row <= 9) {
          // eslint-disable-next-line no-restricted-syntax
          target: for (let col = j - 1; col <= j + 1; col += 1) {
            if (col >= 1 && col <= 10) {
              for (let k = row - 1; k <= row + 1; k += 1) {
                if (k < 0 || k > 9) continue;
                for (let m = col - 1; m <= col + 1; m += 1) {
                  if (m < 1 || m > 10 || (k === i && m === j)) continue;
                  const letter = letters[k];
                  const output = this.isOccupied(letter, m);

                  if (output !== null && output !== this[type].instance) {
                    // We are interested only in the surrounding the ship squares.
                    continue target;
                  }
                }
              }

              contiguousAvailSqs.push([letters[row], col]);
            }
          }
        }
      }
    });

    const contigAvailSqsUnique = [];
    contiguousAvailSqs.forEach((square) => {
      if (!arrIncludes(contigAvailSqsUnique, square)) {
        contigAvailSqsUnique.push(square);
      }
    });

    const availableSquares = [
      ...this.#availableSquares(),
      ...contigAvailSqsUnique,
    ];

    if (coord2 !== undefined) {
      for (
        let i = letters.indexOf(coord1[0]);
        i <= letters.indexOf(coord2[0]);
        i += 1
      ) {
        for (let j = coord1[1]; j <= coord2[1]; j += 1) {
          if (!arrIncludes(availableSquares, [letters[i], j])) {
            return false;
          }
        }
      }
    } else if (!arrIncludes(availableSquares, [coord1[0], coord1[1]])) {
      return false;
    }

    return true;
  };
}
