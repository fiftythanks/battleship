import Game from './Game';
import Battleship from './Battleship';

describe('Game class', () => {
  const game = new Game();

  it("can place ships on players' boards", () => {
    expect(game.P1PlaceShip(['B', 1], ['F', 1])).toBeInstanceOf(Battleship);
    expect(game.P2PlaceShip(['B', 1], ['F', 1])).toBeInstanceOf(Battleship);
  });

  it('can attack players', () => {
    expect(game.attackPlayerOne('C', 4)).toBeNull();
    expect(game.attackPlayerOne('B', 1)).toBeInstanceOf(Battleship);

    expect(game.attackPlayerTwo('C', 4)).toBeNull();
    expect(game.attackPlayerTwo('B', 1)).toBeInstanceOf(Battleship);

    // Can't attack the same square twice
    expect(() => game.attackPlayerOne('C', 4)).toThrow();
    expect(() => game.attackPlayerTwo('C', 4)).toThrow();
  });

  /* 
    board.placeShip(['B', 1], ['F', 1]);
    board.placeShip(['C', 4], ['C', 7]);
    board.placeShip(['E', 3], ['E', 5]);
    board.placeShip(['G', 6], ['H', 6]);
    board.placeShip(['J', 4]); 
  */
});
