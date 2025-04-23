import Battleship from './Battleship';

describe('Battleship class testing', () => {
  describe('Correct input handling testing', () => {
    it('throws if constructor receives something other than number as length', () => {
      expect(() => new Battleship('4')).toThrow();
      expect(() => new Battleship()).toThrow();
      expect(() => new Battleship(null)).toThrow();
      expect(() => new Battleship({ 1: 1 })).toThrow();
      expect(() => new Battleship([1])).toThrow();
      expect(() => new Battleship(Symbol(1))).toThrow();
    });
    it("throws if constructor receives a number that isn't an integer", () => {
      expect(() => new Battleship(4.5)).toThrow();
    });
    it('throws if constructor receives an integer that is either less than 1 or more than 5', () => {
      expect(() => new Battleship(0)).toThrow();
      expect(() => new Battleship(-3)).toThrow();
      expect(() => new Battleship(7)).toThrow();
    });
  });

  it('can be hit', () => {
    const carrier = new Battleship(5);

    expect(carrier.hits).toBe(0);

    carrier.hit();
    expect(carrier.hits).toBe(1);

    carrier.hit();
    carrier.hit();
    expect(carrier.hits).toBe(3);
  });

  it('can be sunk', () => {
    const carrier = new Battleship(5);

    expect(carrier.isSunk()).toBe(false);

    carrier.hit();
    carrier.hit();
    expect(carrier.hits).toBe(2);
    expect(carrier.isSunk()).toBe(false);

    carrier.hit();
    carrier.hit();
    carrier.hit();
    expect(carrier.isSunk()).toBe(true);
  });
});
