import React from 'react'
import classes from './Order.css'

const order = (props) => {
  const ingredients = [];
  for (let ingredientName in props.ingredients) {
    ingredients.push({name: ingredientName, amount:props.ingredients[ingredientName]})
  }
  const ingredientOutput = ingredients.map(ingredient => {
    return <span
    style = {{
      textTransform: 'capitalize',
      display: 'inline-box',
      margin: '0 8px',
      padding: '5px',
      border: '1px solid #ccc'}}

    key = {ingredient.name}>{ingredient.name} ({ingredient.amount})</span>
  })
  return (
    <div className = {classes.Order}>
    <p>Ingredients: {ingredientOutput}</p>
    <p>Price: <strong>{Number.parseFloat(props.price).toFixed(2)}</strong></p>
    </div>

  )

};

export default order;
