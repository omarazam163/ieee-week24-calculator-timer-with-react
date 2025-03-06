import React from 'react'
import { Action } from './App'
export default function DigitalButton({value,dispatch}) {
  return (
    <button onClick={() => dispatch({ type: Action.ADD_DEGIT, payload: { digit: value } })}>
      {value}
    </button>
  )
}
