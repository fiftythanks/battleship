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
    expect(gameboard.areAllSunk()).toBe(false);

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

    expect(gameboard.areAllSunk()).toBe(true);
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

    expect(board.isFleetFull()).toBe(false);
    board.placeShip(['B', 1], ['F', 1]);
    board.placeShip(['C', 4], ['C', 7]);
    board.placeShip(['E', 3], ['E', 5]);
    board.placeShip(['G', 6], ['H', 6]);
    board.placeShip(['J', 4]);
    expect(board.isFleetFull()).toBe(true);
  });
});
