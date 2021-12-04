import { readFileSync } from 'fs'

process.chdir(require.main.path)

export const readInput = (testInput: string = null) => testInput ?? readFileSync('input.txt').toString()

export const id = <T>(v: T) => v

export const xor = (a: boolean, b: boolean) => (a && !b) || (!a && b)
export const fillArray = <T>(n: number, v: T = null): T[] => Array.from(Array(n)).map(_ => v)
export const range = (n1: number, n2?: number) =>
  n2 == undefined ? fillArray(n1).map((_, i) => i) : fillArray(n2 - n1).map((_, i) => i + n1)

export const memoize = <A, B>(fn: (v: A) => B) => {
  const memos = new Map<A, B>()
  return (v: A): B => {
    if (!memos.has(v)) {
      memos.set(v, fn(v))
    }
    return memos.get(v)
  }
}

export const loopUntil = <T>(
  fn: (i: number, result: T) => T | null,
  cond = (v: T) => v != null,
  initialValue: T = null
): T => {
  let result: T
  let prevResult: T = initialValue
  let i = 0
  do {
    result = fn(i++, prevResult)
    prevResult = result
  } while (!cond(result))
  return result
}

type CF<A, B> = (a: A) => B
export function $<A>(v: A): A
export function $<A, B>(v: A, fn1: CF<A, B>): B
export function $<A, B, C>(v: A, fn1: CF<A, B>, fn2: CF<B, C>): C
export function $<A, B, C, D>(v: A, fn1: CF<A, B>, fn2: CF<B, C>, fn3: CF<C, D>): D
export function $<A, B, C, D, E>(v: A, fn1: CF<A, B>, fn2: CF<B, C>, fn3: CF<C, D>, fn4: CF<D, E>): E
export function $<A, B, C, D, E, F>(v: A, fn1: CF<A, B>, fn2: CF<B, C>, fn3: CF<C, D>, fn4: CF<D, E>, fn5: CF<E, F>): F
export function $<A, B, C, D, E, F, G>(
  v: A,
  fn1: CF<A, B>,
  fn2: CF<B, C>,
  fn3: CF<C, D>,
  fn4: CF<D, E>,
  fn5: CF<E, F>,
  fn6: CF<F, G>
): G
export function $<A, B, C, D, E, F, G, H>(
  v: A,
  fn1: CF<A, B>,
  fn2: CF<B, C>,
  fn3: CF<C, D>,
  fn4: CF<D, E>,
  fn5: CF<E, F>,
  fn6: CF<F, G>,
  fn7: CF<G, H>
): H
export function $(v: any, ...fns: CF<any, any>[]) {
  return fns.filter(fn => fn != null).reduce((v, fn) => fn(v), v)
}

export function pipe<A, B>(fn1: CF<A, B>): (v: A) => B
export function pipe<A, B, C>(fn1: CF<A, B>, fn2: CF<B, C>): (v: A) => C
export function pipe<A, B, C, D>(fn1: CF<A, B>, fn2: CF<B, C>, fn3: CF<C, D>): (v: A) => D
export function pipe<A, B, C, D, E>(fn1: CF<A, B>, fn2: CF<B, C>, fn3: CF<C, D>, fn4: CF<D, E>): (v: A) => E
export function pipe<A, B, C, D, E, F>(
  fn1: CF<A, B>,
  fn2: CF<B, C>,
  fn3: CF<C, D>,
  fn4: CF<D, E>,
  fn5: CF<E, F>
): (v: A) => F
export function pipe<A, B, C, D, E, F, G>(
  fn1: CF<A, B>,
  fn2: CF<B, C>,
  fn3: CF<C, D>,
  fn4: CF<D, E>,
  fn5: CF<E, F>,
  fn6: CF<F, G>
): (v: A) => G
export function pipe<A, B, C, D, E, F, G, H>(
  fn1: CF<A, B>,
  fn2: CF<B, C>,
  fn3: CF<C, D>,
  fn4: CF<D, E>,
  fn5: CF<E, F>,
  fn6: CF<F, G>,
  fn7: CF<G, H>
): (v: A) => H
export function pipe<A>(...fns: CF<any, any>[]) {
  return (v: A) => fns.filter(fn => fn != null).reduce((v, fn) => fn(v), v)
}

export function tee<T, A, B>(fn1: CF<T, A>, fn2: CF<T, B>): (v: T) => [A, B]
export function tee<T, A, B, C>(fn1: CF<T, A>, fn2: CF<T, B>, fn3: CF<T, C>): (v: T) => [A, B, C]
export function tee<T, A, B, C, D>(fn1: CF<T, A>, fn2: CF<T, B>, fn3: CF<T, C>, fn4: CF<T, D>): (v: T) => [A, B, C, D]
export function tee<T, U>(...cmds: ((v: T) => U)[]): (v: T) => U[]
export function tee<T>(...cmds: ((v: T) => unknown)[]): (v: T) => unknown[] {
  return (v: T) =>
    $(
      cmds,
      map(cmd => cmd(v))
    )
}

export const isNull = <T>(v: T): boolean => v == null
export const not =
  <T>(fn: (v: T) => boolean) =>
  (v: T): boolean =>
    !fn(v)

// ARRAY STUFF
type MapFn<T, U> = (v: T, i: number, arr: T[]) => U
export const map =
  <T, U>(fn: MapFn<T, U>) =>
  (arr: T[]): U[] =>
    arr.map(fn)
export const reduce =
  <T, U>(fn: (agg: U, val: T, i: number, arr: T[]) => U, init: U) =>
  (arr: T[]): U =>
    arr.reduce(fn, init)
export const forEach =
  <T>(fn: MapFn<T, void>) =>
  (arr: T[]): void =>
    arr.forEach(fn)
export const filter =
  <T>(fn: MapFn<T, boolean>) =>
  (arr: T[]): T[] =>
    arr.filter(fn)
export const some =
  <T>(fn: MapFn<T, boolean>) =>
  (arr: T[]): boolean =>
    arr.some(fn)
export const every =
  <T>(fn: MapFn<T, boolean>) =>
  (arr: T[]): boolean =>
    arr.every(fn)
export const find =
  <T>(fn: MapFn<T, boolean>) =>
  (arr: T[]): T =>
    arr.find(fn)
export const findWithContext =
  <T, U>(callback: (value: T, i: number) => [found: boolean, context: U]) =>
  (arr: T[]): [value: T, context: U] | undefined => {
    for (const { v, i } of $(
      arr,
      map((v, i) => ({ v, i }))
    )) {
      const [found, context] = callback(v, i)
      if (found) {
        return [v, context]
      }
    }
  }
export const includes =
  <T>(v: T) =>
  (arr: T[]): boolean =>
    arr.includes(v)
export const slice =
  <T>(start: number, end?: number) =>
  (arr: T[]): T[] =>
    arr.slice(start, end)
export const indexOf =
  <T>(v: T) =>
  (arr: T[]): number =>
    arr.indexOf(v)
export const shift =
  <T>(distance: number) =>
  (arr: T[]) =>
    distance > 0
      ? [...$(arr, slice(-distance)), ...$(arr, slice(0, arr.length - distance))]
      : [...$(arr, slice(-distance)), ...$(arr, slice(0, -distance))]
export const concat =
  <T>(other: T[]) =>
  (arr: T[]): T[] =>
    arr.concat(other)

export function zipWith<A, B>(o1: B[]): (a: A[]) => [A, B][]
export function zipWith<A, B, C>(o1: B[], o2: C[]): (a: A[]) => [A, B, C][]
export function zipWith<A, B, C, D>(o1: B[], o2: C[], o3: D[]): (a: A[]) => [A, B, C, D][]
export function zipWith<T>(...others: T[][]): (a: T[]) => T[][]
export function zipWith<T>(...others: unknown[]) {
  return (arr: T[]) =>
    $(
      arr,
      map((v, i) => [
        v,
        ...$(
          others,
          map(o => o[i])
        )
      ])
    )
}

export function zip<A, B>(arrs: [A[], B[]]): [A, B][]
export function zip<A, B, C>(arrs: [A[], B[], C[]]): [A, B, C][]
export function zip<A, B, C, D>(arrs: [A[], B[], C[], D[]]): [A, B, C, D][]
export function zip<T>(arrs: T[][]): T[][]
export function zip<T>([first, ...rest]: unknown[][]): unknown[][] {
  return $(first, zipWith(...rest))
}

export const first = <T>(arr: T[]): T => arr[0]
export const last = <T>(arr: T[]): T => arr[arr.length - 1]
export const length = <T>(arr: T[] | string): number => arr.length
export const count =
  <T>(fn: (v: T) => boolean) =>
  (arr: T[]) =>
    arr.filter(fn).length

export const frequencies = <T>(arr: T[]): Map<T, number> =>
  $(
    arr,
    reduce((freqs: Map<T, number>, e: T) => freqs.set(e, (freqs.get(e) || 0) + 1), new Map<T, number>())
  )

export const sort =
  <T>(fn?: (a: T, b: T) => number) =>
  (arr: T[]): T[] =>
    fn ? arr.sort(fn) : arr.sort()
export const sortNumeric =
  ({ reverse }: { reverse: boolean } = { reverse: false }) =>
  (arr: number[]): number[] =>
    arr.sort((a: number, b: number) => (reverse ? b - a : a - b))

export const reverse = <T>(a: T[]): T[] => a.slice().reverse()

export const flatten =
  <T, A extends Array<T>, D extends number = 1>(depth?: D) =>
  (arr: A): FlatArray<A, D>[] =>
    arr.flat(depth)

export const without =
  <T>(vs: T | T[]) =>
  (arr: T[]): T[] =>
    $(
      vs instanceof Array ? vs : [vs],
      reduce(
        (arr, v) =>
          $(arr, includes(v)) ? [...$(arr, slice(0, arr.indexOf(v))), ...$(arr, slice(arr.indexOf(v) + 1))] : arr,
        arr
      )
    )

export const permutations =
  <T>(n: number = null) =>
  (arr: T[]): T[][] => {
    if (n == null) {
      n = arr.length
    }
    return n == 1
      ? $(
          arr,
          map(a => [a])
        )
      : $(
          arr.map(v =>
            $(
              arr,
              without(v),
              permutations(n - 1),
              map(a => [v, ...a])
            )
          ),
          flatten()
        )
  }

export const uniquePermutations =
  <T>(n: number) =>
  (arr: T[]): T[][] =>
    n == 1
      ? $(
          arr,
          map(a => [a])
        )
      : $(
          arr,
          first,
          v => [
            $(
              arr,
              slice(1),
              uniquePermutations(n - 1),
              map(a => [v, ...a])
            ),
            arr.length <= n ? [] : $(arr, slice(1), uniquePermutations(n))
          ],
          flatten()
        )

export const combinations =
  <T>(k: number) =>
  (a: T[]): T[][] =>
    k > 1
      ? $(
          a,
          combinations(k - 1),
          map(l =>
            $(
              a,
              map(n => [...l, n])
            )
          ),
          flatten()
        )
      : $(
          a,
          map(n => [n])
        )

export const uniqueCombinations =
  <T>(count: number) =>
  (vals: T[]): T[][] =>
    vals.length == 1
      ? [fillArray(count, vals[0])]
      : $(
          range(count),
          map(n =>
            $(
              $(vals, slice(1)),
              uniqueCombinations(count - n),
              map(comb => [...fillArray(n, vals[0]), ...comb])
            )
          ),
          flatten(),
          concat([fillArray(count, vals[0])])
        )

// NUMBER STUFF
export const sum = (nums: number[]): number => nums.reduce((s, n) => s + n, 0)
export const product = (nums: number[]): number => nums.reduce((p, n) => p * n, 1)
export const floor = (num: number): number => Math.floor(num)
export const max: (nums: number[]) => number = pipe(sortNumeric(), last)
export const min = (nums: number[]): number => Math.min(...nums)
export const add =
  (n1: number) =>
  (n2: number): number =>
    n1 + n2
export const mod =
  (n1: number) =>
  (n2: number): number =>
    n2 % n1
export const clamp =
  (min: number, max: number) =>
  (n: number): number =>
    Math.max(Math.min(n, max), min)
export const within =
  (min: number, max: number) =>
  (n: number): boolean =>
    n != null && n >= min && n <= max

// OBJECT STUFF
export function pluck<T, K extends keyof T>(key: K): (o: T) => T[K]
export function pluck<T, K extends keyof T>(keys: K[]): (o: T) => T[K][]
export function pluck<T, K extends keyof T>(keys: K | K[]) {
  if (keys instanceof Array) {
    return (o: T) =>
      $(
        keys as K[],
        map(key => o[key])
      )
  } else {
    return (o: T) => o[keys as K]
  }
}

export const getIn =
  (...keys: (string | number)[]) =>
  (val: any[] | { [key: string]: any }): any =>
    keys.reduce((o, key) => (o && o[key] != null ? o[key] : null), val)

export const setIn =
  (keys: (string | number)[], val: any) =>
  (o: any[] | { [key: string]: any }): any => {
    o[keys[0]] = $(keys, length, is(1)) ? val : $(o[keys[0]], setIn($(keys, slice(1)), val))
    return o
  }

export function values<K, V>(m: { [key: string]: V } | Map<K, V> | Set<V>) {
  if (m instanceof Map || m instanceof Set) return Array.from(m.values())
  return Object.values(m)
}

export function keys<K, V>(m: Map<K, V>): K[]
export function keys<V>(m: { [key: string]: V }): string[]
export function keys(m: any): any {
  if (m instanceof Array) return range(m.length)
  if (m instanceof Map) return Array.from(m.keys())
  return Object.keys(m)
}

export function entries<K, V>(m: Map<K, V>): [K, V][]
export function entries<V>(m: { [key: string]: V }): [string, V][]
export function entries(m: any): any {
  if (m instanceof Map) return Array.from(m.entries())
  return Object.entries(m)
}

// STRING STUFF
export const number =
  (radix: number = 10) =>
  (s: string): number =>
    parseInt(s, radix)
export const int = (s: string): number => parseInt(s, 10)
export const ints = map(int)
export const float = (s: string): number => parseFloat(s)
export const floats = map(float)
export const split =
  (sep: RegExp | string = '') =>
  (s: string): string[] =>
    s.split(sep)
export const join =
  <T>(joinWith: string = '') =>
  (arr: T[]): string =>
    arr.join(joinWith)
export const lines = split('\n')
export const match =
  (reg: RegExp) =>
  (s: string): RegExpMatchArray =>
    s.match(reg)
export const test =
  (reg: RegExp) =>
  (s: string): boolean =>
    reg.test(s)
export const charAt =
  (n: number) =>
  (s: string): string =>
    s.charAt(n)
export const chars = (s: string) => s.replace(/\n/g, '').split('')
export function replace(fnd: RegExp | string, rep: string): (s: string) => string
export function replace(fnd: RegExp | string, rep: (substring: string, ...args: any[]) => string): (s: string) => string
export function replace(fnd: RegExp | string, rep: any = '') {
  return (s: string): string => s.replace(fnd, rep)
}
export const trim = (s: string) => s.trim()
export const leftPad =
  (length: number, padWith: string) =>
  (s: string): string =>
    Array.from(Array(Math.max(0, length - s.length + 1))).join(padWith) + s

// OTHER STUFF
export const parse =
  <T>(reg: RegExp, parser: (matches: RegExpMatchArray) => T) =>
  (input: string): T[] =>
    $(
      input,
      lines,
      map(line => {
        const matches = $(line, match(reg))
        if (!matches) {
          throw new Error(`No match for input: ${line}`)
        }
        return parser(matches)
      })
    )

export const next =
  <T>(i: number, amt: number = 1) =>
  (arr: T[]): T =>
    arr[(i + arr.length + (amt % arr.length)) % arr.length]

export const intoSet = <T>(val: T[]): Set<T> => new Set(val)
export const union = <T>(sets: Set<T>[]): Set<T> =>
  $(
    sets,
    map(set => Array.from(set)),
    flatten(),
    intoSet
  )

export const cond =
  <T, U>(o: [T | T[] | ((v: T) => boolean), U | ((v: T) => U)][], def?: U) =>
  (v: T): U => {
    const hit = o.find(e =>
      e[0] instanceof Array ? e[0].some(ee => ee == v) : e[0] instanceof Function ? e[0](v) : e[0] == v
    )
    if (!hit && def !== undefined) {
      return def
    } else if (!hit && def === undefined) {
      throw new Error(`Missing condition: ${v}`)
    }
    if (hit[1] instanceof Function) {
      return hit[1](v)
    } else {
      return hit[1]
    }
  }
export const is = <T>(...v: T[]) => cond([[v, true]], false)

export const repeat =
  <T>(n: number, fn: (v: T) => T) =>
  (v: T): T =>
    $(
      range(n),
      reduce(v => fn(v), v)
    )

export const spyWith =
  <T>(fn: (v: T) => unknown) =>
  (v: T): T => {
    fn(v)
    return v
  }
export const spy: <T>(v: T) => T = spyWith(console.log)
