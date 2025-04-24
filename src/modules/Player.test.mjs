import Player from './Player';
import Battleship from './Battleship';

describe('Player class', () => {
  it("has name even if you don't specify it on instantiation", () => {
    const player = new Player();
    expect(player.name).toBeDefined();
  });

  it('can place ships on gameboard', () => {
    const player = new Player();

    expect(player.placeShip).toBeDefined();
    expect(player.placeShip(['B', 4], ['B', 7])).toBeInstanceOf(Battleship);
  });

  it('can tell if a square is occupied', () => {
    const player = new Player();
    expect(player.isOccupied('B', 4)).toBe(null);

    player.placeShip(['B', 4], ['B', 7]);
    expect(player.isOccupied('B', 4)).toBeInstanceOf(Battleship);
  });

  it('can receive attacks', () => {
    const player = new Player();

    expect(player.receiveAttack).toBeDefined();
    expect(player.wasAttacked('B', 4)).toBe(false);

    player.receiveAttack('B', 4);
    expect(player.wasAttacked('B', 4)).toBe(true);
  });

  it('can tell if the player lost', () => {
    const player = new Player();
    player.placeShip(['B', 4]);

    expect(player.hasLost).toBeDefined();
    expect(player.hasLost()).toBe(false);

    player.receiveAttack('B', 4);
    expect(player.hasLost()).toBe(true);
  });

  it('can tell if the fleet on the board has all five types of ships', () => {
    const player = new Player();

    expect(player.isFleetFull).toBeDefined();
    expect(player.isFleetFull()).toBe(false);

    player.placeShip(['B', 1], ['F', 1]);
    player.placeShip(['C', 4], ['C', 7]);
    player.placeShip(['E', 3], ['E', 5]);
    player.placeShip(['G', 6], ['H', 6]);
    player.placeShip(['J', 4]);

    expect(player.isFleetFull()).toBe(true);
  });
});
