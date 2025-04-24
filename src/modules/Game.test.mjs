import Game from './Game';
import Battleship from './Battleship';

describe('Game class', () => {
  const game = new Game();

  it("can place ships on players' boards", () => {
    expect(game.P1PlaceShip(['B', 1], ['F', 1])).toBeInstanceOf(Battleship);
    expect(game.P2PlaceShip(['B', 1], ['F', 1])).toBeInstanceOf(Battleship);
  });

  it('can check if a square has been attacked already', () => {
    expect(game.P1WasAttacked('C', 4)).toBe(true);
    expect(game.P1WasAttacked('F', 5)).toBe(false);
    expect(game.P2WasAttacked('C', 4)).toBe(true);
    expect(game.P2WasAttacked('F', 5)).toBe(false);
  });
  /* 
    board.placeShip(['B', 1], ['F', 1]);
    board.placeShip(['C', 4], ['C', 7]);
    board.placeShip(['E', 3], ['E', 5]);
    board.placeShip(['G', 6], ['H', 6]);
    board.placeShip(['J', 4]); 
  */
});
