import React, {Component} from 'react';
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';



const INGREDIENT_PRICES = {
  lettuce: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.7
}
class BurgerBuilder extends Component {

  state = {
    ingredients: null,
    totalPrice: 4,
    purchasable: false,
    purchasing: false,
    loading: false,
    error: false
  }
  updatePurchaseState(ingredients) {
    const sum = Object.keys(ingredients).map(igKey => {
      return ingredients[igKey]
    })
    .reduce((sum, el) => {
      return sum + el
    }, 0);
    this.setState({purchasable: sum > 0});
  }
  addIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    const updatedCounted = oldCount + 1;
    const updatedIngedients = {
      ...this.state.ingredients
    };
    updatedIngedients[type] = updatedCounted;
    const priceAddtion = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice + priceAddtion
    this.setState({totalPrice: newPrice, ingredients: updatedIngedients})
    this.updatePurchaseState(updatedIngedients);
  }
  removeIngredientHandler = (type) => {

    const oldCount = this.state.ingredients[type];
    if (oldCount <= 0) {
      return;
    }
    const updatedCounted = oldCount - 1;
    const updatedIngedients = {
      ...this.state.ingredients
    };
    updatedIngedients[type] = updatedCounted;
    const priceDeduction = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice - priceDeduction
    this.setState({totalPrice: newPrice, ingredients: updatedIngedients})
    this.updatePurchaseState(updatedIngedients);
  }
  purchaseHandler  = ()  => {
    this.setState({purchasing: true})
  }
  purchaseCancelHandler = () => {
    this.setState({purchasing: false})
  }
  purchaseContinueHandler = () => {

    const queryParams = []
    for (let i in this.state.ingredients) {
      queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]))
    }
    queryParams.push('price=' + this.state.totalPrice)
    const queryString = queryParams.join('&')
    this.props.history.push(
      {
        pathname: '/checkout',
        search: '?'+ queryString
      })
  }
  componentDidMount () {
    console.log(this.props.match)
    axios.get('https://band-manager-3dc9e.firebaseio.com/ingredients.json')
      .then(response => {
        this.setState({ingredients:response.data})
      }).catch(error => this.setState({error: true}))
  }


  render() {

    let burger = this.state.error ? <p>Ingredients cannot be loaded</p> : <Spinner/>
    let orderSummary = null
    const disabledInfo = {
      ...this.state.ingredients
    };
    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0
    }

    if (this.state.ingredients) {
      burger = (
        <Aux>
        <Burger ingredients = {this.state.ingredients}/>
        <BuildControls
        ingredientAdded = {this.addIngredientHandler}
        ingredientRemoved= {this.removeIngredientHandler}
        disabled = {disabledInfo}
        purchasable = {this.state.purchasable}
        ordered= {this.purchaseHandler}
        price = {this.state.totalPrice}/>

        </Aux>
      )

      orderSummary =
      <OrderSummary ingredients = {this.state.ingredients}
        purchaseCancelled = {this.purchaseCancelHandler}
        purchaseContinued = {this.purchaseContinueHandler}
        price = {this.state.totalPrice}/>
    }

    if (this.state.loading) {
      orderSummary = <Spinner />
    }

    return(
      <Aux>
        <Modal show = {this.state.purchasing}
          modalClosed = {this.purchaseCancelHandler}>
          {orderSummary}
        </Modal>
        {burger}

      </Aux>
    );

  }
}

export default withErrorHandler(BurgerBuilder, axios);
