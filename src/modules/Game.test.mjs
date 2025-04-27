/* eslint-disable no-shadow */
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

  it('can tell if a ship wasHit or isSunk', () => {
    const game = new Game();

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

    expect(game.isP1PatrolBoatSunk).toBe(false);
    expect(game.wasP1PatrolBoatHit).toBe(false);
    expect(game.isP2PatrolBoatSunk).toBe(false);
    expect(game.wasP2PatrolBoatHit).toBe(false);

    // Hit patrol boat
    game.makeTurn('J', 4);
    game.makeTurn('J', 4);

    expect(game.isP1PatrolBoatSunk).toBe(true);
    expect(game.wasP1PatrolBoatHit).toBe(true);
    expect(game.isP2PatrolBoatSunk).toBe(true);
    expect(game.wasP2PatrolBoatHit).toBe(true);

    expect(game.isP1SubmarineSunk).toBe(false);
    expect(game.wasP1SubmarineHit).toBe(false);
    expect(game.isP2SubmarineSunk).toBe(false);
    expect(game.wasP2SubmarineHit).toBe(false);

    // Hit submarine
    game.makeTurn('G', 6);
    game.makeTurn('G', 6);

    expect(game.isP1SubmarineSunk).toBe(false);
    expect(game.wasP1SubmarineHit).toBe(true);
    expect(game.isP2SubmarineSunk).toBe(false);
    expect(game.wasP2SubmarineHit).toBe(true);

    game.makeTurn('H', 6);
    game.makeTurn('H', 6);

    expect(game.isP1SubmarineSunk).toBe(true);
    expect(game.wasP1SubmarineHit).toBe(true);
    expect(game.isP2SubmarineSunk).toBe(true);
    expect(game.wasP2SubmarineHit).toBe(true);

    expect(game.isP1DestroyerSunk).toBe(false);
    expect(game.wasP1DestroyerHit).toBe(false);
    expect(game.isP2DestroyerSunk).toBe(false);
    expect(game.wasP2DestroyerHit).toBe(false);

    // Hit destroyer
    game.makeTurn('E', 3);
    game.makeTurn('E', 3);

    expect(game.isP1DestroyerSunk).toBe(false);
    expect(game.wasP1DestroyerHit).toBe(true);
    expect(game.isP2DestroyerSunk).toBe(false);
    expect(game.wasP2DestroyerHit).toBe(true);

    game.makeTurn('E', 4);
    game.makeTurn('E', 4);
    game.makeTurn('E', 5);
    game.makeTurn('E', 5);

    expect(game.isP1DestroyerSunk).toBe(true);
    expect(game.wasP1DestroyerHit).toBe(true);
    expect(game.isP2DestroyerSunk).toBe(true);
    expect(game.wasP2DestroyerHit).toBe(true);

    expect(game.isP1BattleshipSunk).toBe(false);
    expect(game.wasP1BattleshipHit).toBe(false);
    expect(game.isP2BattleshipSunk).toBe(false);
    expect(game.wasP2BattleshipHit).toBe(false);

    // Hit battleship
    game.makeTurn('C', 4);
    game.makeTurn('C', 4);

    expect(game.isP1BattleshipSunk).toBe(false);
    expect(game.wasP1BattleshipHit).toBe(true);
    expect(game.isP2BattleshipSunk).toBe(false);
    expect(game.wasP2BattleshipHit).toBe(true);

    game.makeTurn('C', 5);
    game.makeTurn('C', 5);
    game.makeTurn('C', 6);
    game.makeTurn('C', 6);
    game.makeTurn('C', 7);
    game.makeTurn('C', 7);

    expect(game.isP1BattleshipSunk).toBe(true);
    expect(game.wasP1BattleshipHit).toBe(true);
    expect(game.isP2BattleshipSunk).toBe(true);
    expect(game.wasP2BattleshipHit).toBe(true);

    expect(game.isP1CarrierSunk).toBe(false);
    expect(game.wasP1CarrierHit).toBe(false);
    expect(game.isP2CarrierSunk).toBe(false);
    expect(game.wasP2CarrierHit).toBe(false);

    // Attack carrier
    game.makeTurn('B', 1);
    game.makeTurn('B', 1);

    expect(game.isP1CarrierSunk).toBe(false);
    expect(game.wasP1CarrierHit).toBe(true);
    expect(game.isP2CarrierSunk).toBe(false);
    expect(game.wasP2CarrierHit).toBe(true);

    game.makeTurn('C', 1);
    game.makeTurn('C', 1);
    game.makeTurn('D', 1);
    game.makeTurn('D', 1);
    game.makeTurn('E', 1);
    game.makeTurn('E', 1);
    game.makeTurn('F', 1);
    game.makeTurn('F', 1);

    expect(game.isP2CarrierSunk).toBe(true);
    expect(game.wasP2CarrierHit).toBe(true);

    // Since the previous game is over, Player 1 won, I need to create a new game
    const gameOne = new Game();

    gameOne.P1PlaceShip(['B', 1], ['F', 1]);
    gameOne.P1PlaceShip(['C', 4], ['C', 7]);
    gameOne.P1PlaceShip(['E', 3], ['E', 5]);
    gameOne.P1PlaceShip(['G', 6], ['H', 6]);
    gameOne.P1PlaceShip(['J', 4]);

    gameOne.P2PlaceShip(['B', 1], ['F', 1]);
    gameOne.P2PlaceShip(['C', 4], ['C', 7]);
    gameOne.P2PlaceShip(['E', 3], ['E', 5]);
    gameOne.P2PlaceShip(['G', 6], ['H', 6]);
    gameOne.P2PlaceShip(['J', 4]);

    gameOne.makeTurn('B', 1);
    gameOne.makeTurn('B', 1);
    gameOne.makeTurn('C', 1);
    gameOne.makeTurn('C', 1);
    gameOne.makeTurn('D', 1);
    gameOne.makeTurn('D', 1);
    gameOne.makeTurn('E', 1);
    gameOne.makeTurn('E', 1);
    gameOne.makeTurn('F', 1);
    gameOne.makeTurn('F', 1);

    expect(gameOne.isP1CarrierSunk).toBe(true);
    expect(gameOne.wasP1CarrierHit).toBe(true);
  });

  it('can give ship coordinates', () => {
    const game = new Game();

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

    expect(game.P1PatrolBoatCoords).toMatchObject([['J', 4]]);
    expect(game.P2PatrolBoatCoords).toMatchObject([['J', 4]]);

    expect(game.P1SubmarineCoords).toMatchObject([
      ['G', 6],
      ['H', 6],
    ]);
    expect(game.P2SubmarineCoords).toMatchObject([
      ['G', 6],
      ['H', 6],
    ]);

    expect(game.P1DestroyerCoords).toMatchObject([
      ['E', 3],
      ['E', 4],
      ['E', 5],
    ]);
    expect(game.P2DestroyerCoords).toMatchObject([
      ['E', 3],
      ['E', 4],
      ['E', 5],
    ]);

    expect(game.P1BattleshipCoords).toMatchObject([
      ['C', 4],
      ['C', 5],
      ['C', 6],
      ['C', 7],
    ]);
    expect(game.P2BattleshipCoords).toMatchObject([
      ['C', 4],
      ['C', 5],
      ['C', 6],
      ['C', 7],
    ]);

    expect(game.P1CarrierCoords).toMatchObject([
      ['B', 1],
      ['C', 1],
      ['D', 1],
      ['E', 1],
      ['F', 1],
    ]);
    expect(game.P2CarrierCoords).toMatchObject([
      ['B', 1],
      ['C', 1],
      ['D', 1],
      ['E', 1],
      ['F', 1],
    ]);
  });
});
