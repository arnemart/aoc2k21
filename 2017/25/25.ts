import {
  $,
  first,
  int,
  map,
  match,
  nth,
  pipe,
  readInput,
  reduce,
  repeat,
  slice,
  split,
  sum,
  tee,
  values
} from '../../common'

type State = {
  name: string
  0: {
    v: number
    d: number
    s: string
  }
  1: {
    v: number
    d: number
    s: string
  }
}

const [[startState, steps], states] = $(
  readInput(),
  split('\n\n'),
  tee(
    pipe(first, tee(pipe(match(/state (\w)/), nth(1)), pipe(match(/(\d+)/), nth(1), int))),
    pipe(
      slice(1),
      map(
        pipe(
          match(/In state (\w).+value (\d).+the (right|left).+state (\w).+value (\d).+the (right|left).+state (\w)/ms),
          ([_, name, v0, d0, s0, v1, d1, s1]) =>
            ({
              name,
              0: {
                v: int(v0),
                d: d0 == 'left' ? -1 : 1,
                s: s0
              },
              1: {
                v: int(v1),
                d: d1 == 'left' ? -1 : 1,
                s: s1
              }
            } as State)
        )
      ),
      reduce((states, state) => {
        states[state.name] = state
        return states
      }, {} as Record<string, State>)
    )
  )
)

type Machine = {
  tape: Map<number, number>
  pos: number
  state: string
}

const step = ({ tape, pos, state }: Machine): Machine =>
  $(tape.get(pos) || 0, val => ({
    tape: tape.set(pos, states[state][val].v),
    pos: pos + states[state][val].d,
    state: states[state][val].s
  }))

const initialState: Machine = {
  tape: new Map(),
  pos: 0,
  state: startState
}

const finalState = $(initialState, repeat(steps, step))

console.log('Part 1:', $(finalState.tape, values, sum))
