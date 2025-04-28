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
    expect(player.hasLost).toBe(false);

    player.receiveAttack('B', 4);
    expect(player.hasLost).toBe(true);
  });

  it('can tell if the fleet on the board has all five types of ships', () => {
    const player = new Player();

    expect(player.isFleetFull).toBeDefined();
    expect(player.isFleetFull).toBe(false);

    player.placeShip(['B', 1], ['F', 1]);
    player.placeShip(['C', 4], ['C', 7]);
    player.placeShip(['E', 3], ['E', 5]);
    player.placeShip(['G', 6], ['H', 6]);
    player.placeShip(['J', 4]);

    expect(player.isFleetFull).toBe(true);
  });

  it('can tell if a ship wasHit or isSunk', () => {
    const player = new Player();

    player.placeShip(['B', 1], ['F', 1]);
    player.placeShip(['C', 4], ['C', 7]);
    player.placeShip(['E', 3], ['E', 5]);
    player.placeShip(['G', 6], ['H', 6]);
    player.placeShip(['J', 4]);

    expect(player.isPatrolBoatSunk).toBe(false);
    expect(player.wasPatrolBoatHit).toBe(false);

    // Hit patrol boat
    player.receiveAttack('J', 4);

    expect(player.wasPatrolBoatHit).toBe(true);
    expect(player.isPatrolBoatSunk).toBe(true);

    expect(player.isSubmarineSunk).toBe(false);
    expect(player.wasSubmarineHit).toBe(false);

    // Hit submarine
    player.receiveAttack('G', 6);

    expect(player.isSubmarineSunk).toBe(false);
    expect(player.wasSubmarineHit).toBe(true);

    player.receiveAttack('H', 6);

    expect(player.isSubmarineSunk).toBe(true);
    expect(player.wasSubmarineHit).toBe(true);

    expect(player.isDestroyerSunk).toBe(false);
    expect(player.wasDestroyerHit).toBe(false);

    // Hit destroyer
    player.receiveAttack('E', 3);

    expect(player.isDestroyerSunk).toBe(false);
    expect(player.wasDestroyerHit).toBe(true);

    player.receiveAttack('E', 4);
    player.receiveAttack('E', 5);

    expect(player.isDestroyerSunk).toBe(true);
    expect(player.wasDestroyerHit).toBe(true);

    expect(player.isBattleshipSunk).toBe(false);
    expect(player.wasBattleshipHit).toBe(false);

    // Hit battleship
    player.receiveAttack('C', 4);

    expect(player.isBattleshipSunk).toBe(false);
    expect(player.wasBattleshipHit).toBe(true);

    player.receiveAttack('C', 5);
    player.receiveAttack('C', 6);
    player.receiveAttack('C', 7);

    expect(player.isBattleshipSunk).toBe(true);
    expect(player.wasBattleshipHit).toBe(true);

    expect(player.isCarrierSunk).toBe(false);
    expect(player.wasCarrierHit).toBe(false);

    // Attack carrier
    player.receiveAttack('B', 1);

    expect(player.isCarrierSunk).toBe(false);
    expect(player.wasCarrierHit).toBe(true);

    player.receiveAttack('C', 1);
    player.receiveAttack('D', 1);
    player.receiveAttack('E', 1);
    player.receiveAttack('F', 1);

    expect(player.isCarrierSunk).toBe(true);
    expect(player.wasCarrierHit).toBe(true);
  });

  it('can give ship coordinates', () => {
    const player = new Player();

    player.placeShip(['B', 1], ['F', 1]);
    player.placeShip(['C', 4], ['C', 7]);
    player.placeShip(['E', 3], ['E', 5]);
    player.placeShip(['G', 6], ['H', 6]);
    player.placeShip(['J', 4]);

    expect(player.patrolBoatCoords).toMatchObject([['J', 4]]);
    expect(player.submarineCoords).toMatchObject([
      ['G', 6],
      ['H', 6],
    ]);
    expect(player.destroyerCoords).toMatchObject([
      ['E', 3],
      ['E', 4],
      ['E', 5],
    ]);
    expect(player.battleshipCoords).toMatchObject([
      ['C', 4],
      ['C', 5],
      ['C', 6],
      ['C', 7],
    ]);
    expect(player.carrierCoords).toMatchObject([
      ['B', 1],
      ['C', 1],
      ['D', 1],
      ['E', 1],
      ['F', 1],
    ]);
  });

  it('is possible to change the position of a ship', () => {
    const player = new Player();

    player.placeShip(['B', 1], ['F', 1]);
    player.placeShip(['C', 4], ['C', 7]);
    player.placeShip(['E', 3], ['E', 5]);
    player.placeShip(['G', 6], ['H', 6]);
    player.placeShip(['J', 4]);

    player.changeShipPosition(['B', 10], ['F', 10]);

    expect(player.carrierCoords).toStrictEqual([
      ['B', 10],
      ['C', 10],
      ['D', 10],
      ['E', 10],
      ['F', 10],
    ]);

    expect(player.isOccupied('B', 1)).toBeNull();

    player.changeShipPosition(['F', 6], ['F', 10]);

    expect(player.carrierCoords).toStrictEqual([
      ['F', 6],
      ['F', 7],
      ['F', 8],
      ['F', 9],
      ['F', 10],
    ]);
  });
});
