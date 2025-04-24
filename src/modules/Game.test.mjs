import Game from './Game';
import Battleship from './Battleship';

describe('Game class', () => {
  const game = new Game();

  it("can place ships on players' boards", () => {
    expect(game.P1PlaceShip(['B', 1], ['F', 1])).toBeInstanceOf(Battleship);
    expect(game.P2PlaceShip(['B', 1], ['F', 1])).toBeInstanceOf(Battleship);
  });

  it('can attack players by turn without getting input on which player to attack', () => {
    // Expected behavior: if hit, return a Battleship instance, if miss, return null, if attack a square that has already been attacked, throw

    // First turn, player1
    expect(game.makeTurn('C', 4)).toBeNull();

    // Player2
    expect(game.makeTurn('C', 4)).toBeNull();

    // Player1 (already hit this square)
    expect(() => game.makeTurn('C', 4)).toThrow();

    // Still player1, since he didn't make his turn. Player2 has a ship on B:1
    expect(game.makeTurn('B', 1)).toBeInstanceOf(Battleship);
  });

  it('can check if a square has been attacked already', () => {
    expect(game.P1WasAttacked('C', 4)).toBe(true);
    expect(game.P1WasAttacked('F', 5)).toBe(false);
    expect(game.P2WasAttacked('C', 4)).toBe(true);
    expect(game.P2WasAttacked('F', 5)).toBe(false);
  });

  it('can check if a square is occupied', () => {
    expect(game.isP1SqOccupied('B', 1)).toBeInstanceOf(Battleship);
    expect(game.isP1SqOccupied('F', 10)).toBeNull();

    expect(game.isP2SqOccupied('B', 1)).toBeInstanceOf(Battleship);
    expect(game.isP2SqOccupied('F', 10)).toBeNull();
  });

  it("gives players' names", () => {
    // Names are Player1 and Player2 by default, when you don't specify names
    expect(game.P1Name).toBe('Player1');
    expect(game.P2Name).toBe('Player2');
  });

  it("can check if players' fleets are full", () => {
    // eslint-disable-next-line no-shadow
    const game = new Game();

    expect(game.isP1FleetFull).toBe(false);
    expect(game.isP2FleetFull).toBe(false);

    game.P1PlaceShip(['B', 1], ['F', 1]);
    game.P1PlaceShip(['C', 4], ['C', 7]);
    game.P1PlaceShip(['E', 3], ['E', 5]);
    game.P1PlaceShip(['G', 6], ['H', 6]);
    game.P1PlaceShip(['J', 4]);

    game.P2PlaceShip(['B', 1], ['F', 1]);
    game.P2PlaceShip(['C', 4], ['C', 7]);
    game.P2PlaceShip(['E', 3], ['E', 5]);
    game.P2PlaceShip(['G', 6], ['H', 6]);
    game.P2PlaceShip(['J', 4]);

    expect(game.isP1FleetFull).toBe(true);
    expect(game.isP2FleetFull).toBe(true);
  });
});
