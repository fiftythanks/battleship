import Gameboard from './Gameboard';
import Battleship from './Battleship';

describe('Gameboard class', () => {
  const gameboard = new Gameboard();

  it('throws if given incorrect input', () => {
    expect(() => gameboard.placeShip('C', 1, 'C', '4')).toThrow();
    expect(() => gameboard.placeShip({ C: 1 }, { C: 4 })).toThrow();
    expect(() => gameboard.placeShip([1, 'C'], [4, 'C'])).toThrow();
    expect(() => gameboard.placeShip(['C', 1], ['c', 4])).toThrow();
    expect(() => gameboard.placeShip(['C', 4], ['C', '7'])).toThrow();
  });

  it('is able to place ships at specific coordinates by calling the ship class', () => {
    expect(() => gameboard.placeShip(['C', 4], ['C', 7])).not.toThrow();
    expect(gameboard.isOccupied('C', 1)).toBeNull();
    expect(gameboard.isOccupied('C', 2)).toBeNull();
    expect(gameboard.isOccupied('C', 3)).toBeNull();
    expect(gameboard.isOccupied('C', 4)).toBeInstanceOf(Battleship);
    expect(gameboard.isOccupied('C', 5)).toBeInstanceOf(Battleship);
    expect(gameboard.isOccupied('C', 6)).toBeInstanceOf(Battleship);
    expect(gameboard.isOccupied('C', 7)).toBeInstanceOf(Battleship);
    expect(gameboard.isOccupied('C', 8)).toBeNull();
    expect(gameboard.isOccupied('C', 9)).toBeNull();
    expect(gameboard.isOccupied('C', 10)).toBeNull();

    expect(() => gameboard.placeShip(['B', 1], ['F', 1])).not.toThrow();
    expect(gameboard.isOccupied('A', 1)).toBeNull();
    expect(gameboard.isOccupied('B', 1)).toBeInstanceOf(Battleship);
    expect(gameboard.isOccupied('C', 1)).toBeInstanceOf(Battleship);
    expect(gameboard.isOccupied('D', 1)).toBeInstanceOf(Battleship);
    expect(gameboard.isOccupied('E', 1)).toBeInstanceOf(Battleship);
    expect(gameboard.isOccupied('F', 1)).toBeInstanceOf(Battleship);
    expect(gameboard.isOccupied('G', 1)).toBeNull();
    expect(gameboard.isOccupied('H', 1)).toBeNull();
    expect(gameboard.isOccupied('I', 1)).toBeNull();
    expect(gameboard.isOccupied('J', 1)).toBeNull();

    // Patrol boats
    expect(() => gameboard.placeShip(['J', 4])).not.toThrow();
  });

  test('when placing a ship, it checks if the specified squares are already occupied, and if so, the placeShip() method returns null. Otherwise, the method returns a reference to the instance of Battleship that was placed.', () => {
    expect(gameboard.placeShip(['E', 3], ['E', 5])).toBeInstanceOf(Battleship);
    expect(gameboard.placeShip(['A', 4], ['E', 4])).toBeNull();
  });

  it("doesn't let a user place a ship of a type that is already present on the board", () => {
    expect(() => gameboard.placeShip(['G', 4], ['G', 6])).toThrow();
  });

  describe('`receiveAttack` method', () => {
    it('takes only coordinates in the form (i, j) as input, where i is a letter from A to J and j is an integer from 1 to 10. Otherwise, it throws.', () => {
      expect(() => gameboard.receiveAttack('G', 4)).not.toThrow();
      expect(() => gameboard.receiveAttack('K', 4)).toThrow();
      expect(() => gameboard.receiveAttack(5, 4)).toThrow();
      expect(() => gameboard.receiveAttack('d', 4)).toThrow();
      expect(() => gameboard.receiveAttack(['G'], 4)).toThrow();
      expect(() => gameboard.receiveAttack(Symbol('G'), 4)).toThrow();
      expect(() => gameboard.receiveAttack('D', '4')).toThrow();
      expect(() => gameboard.receiveAttack('D', 4.5)).toThrow();
      expect(() => gameboard.receiveAttack('D', -4)).toThrow();
      expect(() => gameboard.receiveAttack('D', 0)).toThrow();
      expect(() => gameboard.receiveAttack('D', 11)).toThrow();
    });

    it('throws if the square has already been hit', () => {
      gameboard.receiveAttack('D', 6);
      expect(() => gameboard.receiveAttack('D', 6)).toThrow();
    });

    it('returns a reference to the Battleship instance that was hit or null otherwise', () => {
      expect(gameboard.receiveAttack('C', 4)).toBeInstanceOf(Battleship);
      expect(gameboard.receiveAttack('D', 4)).toBeNull();
    });
  });

  test('method `allSunk` returns true if all ships on the board are sunk and false otherwise', () => {
    expect(gameboard.areAllSunk).toBe(false);

    gameboard.receiveAttack('B', 1);
    gameboard.receiveAttack('C', 1);
    gameboard.receiveAttack('D', 1);
    gameboard.receiveAttack('E', 1);
    gameboard.receiveAttack('F', 1);
    gameboard.receiveAttack('C', 5);
    gameboard.receiveAttack('C', 6);
    gameboard.receiveAttack('C', 7);
    gameboard.receiveAttack('E', 3);
    gameboard.receiveAttack('E', 4);
    gameboard.receiveAttack('E', 5);
    gameboard.receiveAttack('J', 4);

    expect(gameboard.areAllSunk).toBe(true);
  });

  it('can tell if a square has been hit/missed', () => {
    const board = new Gameboard();

    expect(board.wasAttacked).toBeDefined();
    expect(board.wasAttacked('B', 4)).toBe(false);

    board.receiveAttack('B', 4);
    expect(board.wasAttacked('B', 4)).toBe(true);
  });

  it('can tell if it has all the five types of ships', () => {
    const board = new Gameboard();

    expect(board.isFleetFull).toBe(false);
    board.placeShip(['B', 1], ['F', 1]);
    board.placeShip(['C', 4], ['C', 7]);
    board.placeShip(['E', 3], ['E', 5]);
    board.placeShip(['G', 6], ['H', 6]);
    board.placeShip(['J', 4]);
    expect(board.isFleetFull).toBe(true);
  });

  it('can tell if a ship was hit or if a ship was sunk', () => {
    const board = new Gameboard();

    board.placeShip(['B', 1], ['F', 1]);
    board.placeShip(['C', 4], ['C', 7]);
    board.placeShip(['E', 3], ['E', 5]);
    board.placeShip(['G', 6], ['H', 6]);
    board.placeShip(['J', 4]);

    expect(board.isPatrolBoatSunk).toBe(false);
    expect(board.wasPatrolBoatHit).toBe(false);

    // Hit patrol boat
    board.receiveAttack('J', 4);

    expect(board.wasPatrolBoatHit).toBe(true);
    expect(board.isPatrolBoatSunk).toBe(true);

    expect(board.isSubmarineSunk).toBe(false);
    expect(board.wasSubmarineHit).toBe(false);

    // Hit submarine
    board.receiveAttack('G', 6);

    expect(board.isSubmarineSunk).toBe(false);
    expect(board.wasSubmarineHit).toBe(true);

    board.receiveAttack('H', 6);

    expect(board.isSubmarineSunk).toBe(true);
    expect(board.wasSubmarineHit).toBe(true);

    expect(board.isDestroyerSunk).toBe(false);
    expect(board.wasDestroyerHit).toBe(false);

    // Hit destroyer
    board.receiveAttack('E', 3);

    expect(board.isDestroyerSunk).toBe(false);
    expect(board.wasDestroyerHit).toBe(true);

    board.receiveAttack('E', 4);
    board.receiveAttack('E', 5);

    expect(board.isDestroyerSunk).toBe(true);
    expect(board.wasDestroyerHit).toBe(true);

    expect(board.isBattleshipSunk).toBe(false);
    expect(board.wasBattleshipHit).toBe(false);

    // Hit battleship
    board.receiveAttack('C', 4);

    expect(board.isBattleshipSunk).toBe(false);
    expect(board.wasBattleshipHit).toBe(true);

    board.receiveAttack('C', 5);
    board.receiveAttack('C', 6);
    board.receiveAttack('C', 7);

    expect(board.isBattleshipSunk).toBe(true);
    expect(board.wasBattleshipHit).toBe(true);

    expect(board.isCarrierSunk).toBe(false);
    expect(board.wasCarrierHit).toBe(false);

    // Attack carrier
    board.receiveAttack('B', 1);

    expect(board.isCarrierSunk).toBe(false);
    expect(board.wasCarrierHit).toBe(true);

    board.receiveAttack('C', 1);
    board.receiveAttack('D', 1);
    board.receiveAttack('E', 1);
    board.receiveAttack('F', 1);

    expect(board.isCarrierSunk).toBe(true);
    expect(board.wasCarrierHit).toBe(true);
  });

  it('can give ship coordinates', () => {
    const board = new Gameboard();

    board.placeShip(['B', 1], ['F', 1]);
    board.placeShip(['C', 4], ['C', 7]);
    board.placeShip(['E', 3], ['E', 5]);
    board.placeShip(['G', 6], ['H', 6]);
    board.placeShip(['J', 4]);

    expect(board.patrolBoatCoords).toMatchObject([['J', 4]]);
    expect(board.submarineCoords).toMatchObject([
      ['G', 6],
      ['H', 6],
    ]);
    expect(board.destroyerCoords).toMatchObject([
      ['E', 3],
      ['E', 4],
      ['E', 5],
    ]);
    expect(board.battleshipCoords).toMatchObject([
      ['C', 4],
      ['C', 5],
      ['C', 6],
      ['C', 7],
    ]);
    expect(board.carrierCoords).toMatchObject([
      ['B', 1],
      ['C', 1],
      ['D', 1],
      ['E', 1],
      ['F', 1],
    ]);
  });

  it('is possible to change the position of a ship', () => {
    const board = new Gameboard();

    board.placeShip(['B', 1], ['F', 1]);
    board.placeShip(['C', 4], ['C', 7]);
    board.placeShip(['E', 3], ['E', 5]);
    board.placeShip(['G', 6], ['H', 6]);
    board.placeShip(['J', 4]);

    board.changeShipPosition(['B', 10], ['F', 10]);

    expect(board.carrierCoords).toStrictEqual([
      ['B', 10],
      ['C', 10],
      ['D', 10],
      ['E', 10],
      ['F', 10],
    ]);

    expect(board.isOccupied('B', 1)).toBeNull();

    board.changeShipPosition(['D', 9], ['H', 9]);

    expect(board.carrierCoords).toStrictEqual([
      ['D', 9],
      ['E', 9],
      ['F', 9],
      ['G', 9],
      ['H', 9],
    ]);

    expect(board.changeShipPosition(['I', 6], ['J', 6])).not.toBeNull();
  });

  it('is impossible to change the position of a ship to a position that is already occupied at least partially by another ship', () => {
    const board = new Gameboard();

    board.placeShip(['B', 1], ['F', 1]);
    board.placeShip(['C', 4], ['C', 7]);
    board.placeShip(['E', 3], ['E', 5]);
    board.placeShip(['G', 6], ['H', 6]);
    board.placeShip(['J', 4]);

    expect(() => board.changeShipPosition(['D', 3], ['H', 3])).toThrow();
  });

  it('is impossible to change the position of a ship to a position that is less than one square far from any other ship', () => {
    const board = new Gameboard();

    board.placeShip(['B', 1], ['F', 1]);
    board.placeShip(['C', 4], ['C', 7]);
    board.placeShip(['E', 3], ['E', 5]);
    board.placeShip(['G', 6], ['H', 6]);
    board.placeShip(['J', 4]);

    expect(() => board.changeShipPosition(['B', 2], ['F', 2])).toThrow();
    expect(() => board.changeShipPosition(['D', 4], ['D', 7])).toThrow();
  });

  it('should be able to tell which squares are available for placement', () => {
    const board = new Gameboard();

    board.placeShip(['B', 1], ['F', 1]);
    board.placeShip(['C', 4], ['C', 7]);
    board.placeShip(['E', 3], ['E', 5]);
    board.placeShip(['G', 6], ['H', 6]);
    board.placeShip(['J', 4]);

    /* expect(board.openForPlacement(['B', 1])).toBe(false);
    expect(board.openForPlacement(['A', 1])).toBe(false); */
    expect(board.openForPlacement(['E', 9])).toBe(true);
  });

  it('should be able to tell whether each square is avalable for placement in an array of squares that has the length of one of the ships; if the provided squares surround the ship, then, in case no other ship obstructs, the board should still tell that the squares are available; input must be either one pair of coordinates or the first and the last pair of coordinates', () => {
    const board = new Gameboard();

    board.placeShip(['B', 1], ['F', 1]);
    board.placeShip(['C', 4], ['C', 7]);
    board.placeShip(['E', 3], ['E', 5]);
    board.placeShip(['G', 6], ['H', 6]);
    board.placeShip(['J', 4]);

    // Wrong format (no more than two arguments allowed)
    expect(() =>
      board.openForPlacement(['A', 1], ['B', 3], ['C', 4]),
    ).toThrow();
    // These squares can't match any ship
    expect(() => board.openForPlacement(['B', 1], ['E', 9])).toThrow();

    expect(board.openForPlacement(['A', 1], ['E', 1])).toBe(true);
    expect(board.openForPlacement(['J', 6], ['J', 10])).toBe(true);
    expect(board.openForPlacement(['I', 6], ['I', 10])).toBe(false);
    expect(board.openForPlacement(['D', 7], ['E', 7])).toBe(false);
    expect(board.openForPlacement(['G', 1])).toBe(false);
    expect(board.openForPlacement(['B', 1])).toBe(false);
  });

  it("is possible to change a ship's orientation without specifying the coordinates", () => {
    const board = new Gameboard();

    board.placeShip(['B', 1], ['F', 1]);
    board.placeShip(['C', 4], ['C', 7]);
    board.placeShip(['E', 3], ['E', 5]);
    board.placeShip(['G', 6], ['H', 6]);
    board.placeShip(['J', 4]);

    board.changeOrientation('G', 6);
    expect(board.submarineCoords).toStrictEqual([
      ['G', 6],
      ['G', 7],
    ]);
  });
});
