import {
  $,
  arrEqual,
  filter,
  findIndex,
  flatten,
  int,
  ints,
  is,
  join,
  lines,
  map,
  match,
  pipe,
  readInput,
  reduce,
  slice,
  some,
  split
} from '../../common'

import aStar = require('a-star')

type Server = { name: string; size: number; used: number; avail: number }
const servers: Server[] = $(
  readInput(),
  lines,
  slice(2),
  map(
    pipe(split(/\/|T?\s+/), slice(3), ([name, size, used, avail]) => ({
      name,
      size: int(size),
      used: int(used),
      avail: int(avail)
    }))
  )
)

const allPairs = $(
  servers,
  map(a =>
    $(
      servers,
      filter(b => a.name != b.name && a.used > 0 && a.used <= b.avail),
      map(b => [a.name, b.name])
    )
  ),
  flatten()
)

console.log('Part 1:', allPairs.length)

type Grid = string[][]

const grid: Grid = $(
  servers,
  reduce((g, s) => {
    const [x, y] = $(s.name, match(/x(\d+)-y(\d+)/), slice(1, 3), ints)
    if (!g[y]) {
      g[y] = []
    }
    g[y][x] = x == 29 && y == 0 ? 'G' : s.size > 200 ? '#' : s.used == 0 ? '_' : '.'
    return g
  }, [])
)

const startY = $(grid, findIndex(some(is('_'))))
const startX = $(grid[startY], findIndex(is('_')))

const distanceToMoveTheEmptyOneUpToTheDataWeWant = aStar({
  start: [startY, startX],
  isEnd: arrEqual([0, 29]),
  neighbor: ([y, x]) =>
    $(
      [
        [y + 1, x],
        [y, x + 1],
        [y - 1, x],
        [y, x - 1]
      ],
      filter(([y, x]) => grid[y]?.[x] == '.')
    ),
  distance: () => 1,
  heuristic: ([y, x]) => y + (29 - x),
  hash: join(',')
}).cost

console.log('Part 2:', distanceToMoveTheEmptyOneUpToTheDataWeWant + 1 + 28 * 5)
