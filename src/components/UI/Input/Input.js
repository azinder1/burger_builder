import React from 'react';
import classes from './Input.css'

const input = (props) => {
  let inputElement = null;
  const inputClasses = [classes.InputElement];

  let validationError = null;

  if (props.invalid && props.touched) {
    validationError = <p>Please enter a valid value!</p>;
  }

  if (props.invalid && props.shouldValidate && props.touched) {
    inputClasses.push(classes.Invalid)
  }

  switch(props.inputtype) {
    case('input'):
      inputElement = <input onChange = {props.changed} className = {inputClasses.join(' ')} {...props.elementConfig} value = {props.value}/>
      break;
    case('textarea'):
      inputElement = <textarea onChange = {props.changed} {...props.elementConfig} className = {inputClasses.join(' ')} value = {props.value}/>
      break;
    case('select'):
      inputElement = (
      <select
        className = {inputClasses.join(' ')}
        value = {props.value}
        onChange = {props.changed}
        >
        {props.elementConfig.options.map(option => (
          <option
            key = {option.value}
            value = {option.value}>
            {option.displayValue}
          </option>
        ))}
      </select>
      )
      break;
    default:
      inputElement = <input {...props.elementConfig} className = {classes.InputElement} value = {props.value}/>
  }
  return (
    <div className = {classes.Input}>
      <label className = {classes.Label}>{props.label}</label>
      {validationError}
      {inputElement}
    </div>
  )
};

export default input
