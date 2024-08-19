# Built to Scale

## Defend trade

- The bases are cities.
- Trade automatically happens between the cities, via small spawns
- enemies spawn from outer map and try to attack both the city and the units.
- trade brings income and upgrades
- the player can click to shoot arrows to attach enemies

### implementation

#### Trade

- cities are a `Base` type
- cities keep track of trades and their grid position and color

- spawn `trade_units` at each city, up to a max
- `trade_units` are owned by a city
- `trade_units` `have_goods: boolean`.
  - Travelling to a city to will set `have_goods=true`.
  - When have_goods is `true`, return to "origin city", aka the city that owns the unit.
- returning to the origin city sets `have_goods` to `false`, and generates income.

### Upgrades

- Able to upgrade number of trade units active at once
- able to upgrade...

## Defense

- Enemies spawn at edge grid positions
- Enemies destroy trade units

## Ideas

- most miniature version of City building
  - tetris-esque?
- Amanda Idea: "expand a house to handle a large influx of cats"
- Train/road designer between cities?
