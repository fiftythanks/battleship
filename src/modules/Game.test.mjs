import Game from './Game';
import Battleship from './Battleship';

describe('Game class', () => {
  const game = new Game();

  it("can place ships on players' boards", () => {
    expect(game.P1PlaceShip(['B', 1], ['F', 1])).toBeInstanceOf(Battleship);
    expect(game.P2PlaceShip(['B', 1], ['F', 1])).toBeInstanceOf(Battleship);
  });
});
