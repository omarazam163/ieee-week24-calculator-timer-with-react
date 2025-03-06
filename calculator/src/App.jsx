import React, { useReducer } from 'react'
import "./App.css"
import DigitalButton from './DigitalButton';
import OperationButton from './OperationButton';

export let Action = {
  ADD_DEGIT: "add-digit",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  CHOOSE_OPERATION: "choose-operation",
  EVALUATE: "evaluate",
};
function reducer(state,{type,payload})
{
  switch(type)
  {
    case Action.ADD_DEGIT:
      {
        if(state.override==true) return {
          ...state,
          currentOperand: payload.digit,
          override: false
        };
        if(payload.digit==0&&state.currentOperand==0) return state;
        if(payload.digit=="."&& state.currentOperand.includes(".")) return state;
        return { ...state, currentOperand: (state.currentOperand|| "") + payload.digit };
      }
    case Action.CHOOSE_OPERATION:
      {
        if(state.currentOperand==null&&state.prevOperand==null) return state;
        if(state.prevOperand==null)
        {
                  return {
                    prevOperand: state.currentOperand,
                    currentOperand: null,
                    opertion: payload.operation,
                  }; 
        }
        if(state.currentOperand==null)
        {
          return {
            prevOperand: state.prevOperand,
            currentOperand: null,
            opertion: payload.operation,
          };
        }
        return {
          prevOperand: evaluate(state),
          currentOperand: null,
          opertion: payload.operation,
        };
      }
    case Action.CLEAR:
      {
        return {};
      }
    case Action.DELETE_DIGIT:
      {
        if(state.override==true) return { ...state, currentOperand:null, override: false };
        if(state.currentOperand.length==1)  return { ...state, currentOperand: null } ;
        return {...state,currentOperand:state.currentOperand.slice(0,-1)};
      }  
    case Action.EVALUATE:
      {
        if(state.opertion==null||state.currentOperand==null||state.prevOperand==null) return state;
        return {
          prevOperand: null,
          currentOperand: evaluate(state),
          opertion: null,
          override: true
        };
      }
    default:
      return state;
  }
}

function evaluate({prevOperand,opertion,currentOperand})
{
  const prev = parseFloat(prevOperand);
  const current = parseFloat(currentOperand);
  if(isNaN(prev)||isNaN(current)) return "";
  let result;
  switch(opertion)
  {
    case "+":
      result=prev+current;
      break;
    case "-":
      result=prev-current;
      break;
    case "*":
      result=prev*current;
      break;
    case "/":
      result=prev/current;
      break;
    default:
      return "";
  }
  return result.toString();
}


export default function App() {
  const[{currentOperand,prevOperand,opertion,override},dispatch]= useReducer(reducer,{})
  return (
    <div className="calc-grid">
      <div className="output">
        <div className="prev-operand">
          {prevOperand} {opertion}
        </div>
        <div className="current-operand">{currentOperand}</div>
      </div>
      <button
        className="span-2"
        onClick={() => dispatch({ type: Action.CLEAR })}
      >
        AC
      </button>
      <button onClick={() => dispatch({ type: Action.DELETE_DIGIT })}>DEL</button>

      <OperationButton operation={"+"} dispatch={dispatch}></OperationButton>
      <DigitalButton value={1} dispatch={dispatch}></DigitalButton>
      <DigitalButton value={2} dispatch={dispatch}></DigitalButton>
      <DigitalButton value={3} dispatch={dispatch}></DigitalButton>
      <OperationButton operation={"*"} dispatch={dispatch}></OperationButton>

      <DigitalButton value={4} dispatch={dispatch}></DigitalButton>
      <DigitalButton value={5} dispatch={dispatch}></DigitalButton>
      <DigitalButton value={6} dispatch={dispatch}></DigitalButton>
      <OperationButton operation={"/"} dispatch={dispatch}></OperationButton>

      <DigitalButton value={7} dispatch={dispatch}></DigitalButton>
      <DigitalButton value={8} dispatch={dispatch}></DigitalButton>
      <DigitalButton value={9} dispatch={dispatch}></DigitalButton>
      <OperationButton operation={"-"} dispatch={dispatch}></OperationButton>

      <DigitalButton value={0} dispatch={dispatch}></DigitalButton>

      <DigitalButton value={"."} dispatch={dispatch}></DigitalButton>
      <button className="span-2" onClick={() => dispatch({ type: Action.EVALUATE })}>=</button>
    </div>
  );
}
