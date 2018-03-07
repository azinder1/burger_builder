import React, {Component} from 'react';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.css';
import axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';

class ContactData extends Component {
  state = {
    orderForm: {
          name: {
            elementType: 'input',
            elementConfig: {
              type: 'text',
              placeholder: 'Your Name',
            },
            value: '',
            validation: {
              required: true
            },
            valid: false,
            touched: false
          },
          address: {
                  elementType: 'input',
                  elementConfig: {
                    type: 'text',
                    placeholder: 'Your Address',
                  },
                  value: '',
                  validation: {
                    required: true
                  },
                  valid: false,
                  touched: false
          },
          zip: {
                  elementType: 'input',
                  elementConfig: {
                    type: 'text',
                    placeholder: 'Your Zip Code',
                  },
                  value: '',
                  validation: {
                    required: true,
                    minLength: 5,
                    maxLength: 5
                  },
                  valid: false,
                  touched: false
          },
          country: {
                  elementType: 'input',
                  elementConfig: {
                    type: 'text',
                    placeholder: 'Your Country',
                  },
                  value: '',
                  validation: {
                    required: true
                  },
                  valid: false,
                  touched: false
          },
          emailAddress: {
                  elementType: 'input',
                  elementConfig: {
                    type: 'email',
                    placeholder: 'Your Email Address',
                  },
                  value: '',
                  validation: {
                    required: true
                  },
                  valid: false,
                  touched: false
          },
          deliveryMethod: {
                  elementType: 'select',
                  elementConfig: {
                    options: [{value: 'fastest', displayValue: 'Fastest'},
                              {value: 'cheapest', displayValue: 'Cheapest'}]
                  },
                  validation: {

                  },
                  value: '',
                  valid: true
          },
    },
    loading: false
  }
  checkValidity = (value, rules) => {
    let isValid = true;
    if (rules.required) {
      isValid = value.trim() !== '' && isValid;
    }
    if (rules.minLength) {
      isValid = value.length >= rules.minLength && isValid
    }
    if (rules.maxLength) {
      isValid = value.length <= rules.maxLength && isValid
    }
    return isValid
  }
  orderHandler = (event) =>  {
    event.preventDefault();
    const formData = {};
    for (let formElementIdentifier in this.state.orderForm) {
      formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value
    }
    this.setState({loading: true});
    const order = {
      ingredients: this.props.ingredients,
      price: this.props.price,
      orderData: formData

    }
    axios.post('/orders.json', order)
      .then (response =>  {
        this.setState({loading: false});
        this.props.history.push('/')
      })
      .catch(error => {
        this.setState({loading: false});
      })
  }

  inputChangedHandler = (event, inputIdentifier) => {
    const updatedOrderForm = {...this.state.orderForm}
    const updatedFormElement = {...updatedOrderForm[inputIdentifier]}
    updatedFormElement.value = event.target.value
    updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
    updatedFormElement.touched = true
    updatedOrderForm[inputIdentifier] = updatedFormElement
    this.setState({orderForm: updatedOrderForm})
  }

  render() {
    const formElementArray = []
    for (let key in this.state.orderForm) {
      formElementArray.push({
        id: key,
        config: this.state.orderForm[key]
      })
    }

    let form =<form onSubmit = {this.orderHandler}>
              {formElementArray.map(formElement => (
                <Input
                  key = {formElement.id}
                  inputtype = {formElement.config.elementType}
                  elementConfig= {formElement.config.elementConfig}
                  value = {formElement.config.value}
                  changed = {(event) => this.inputChangedHandler(event, formElement.id)}
                  invalid = {!formElement.config.valid}
                  touched = {formElement.config.touched}
                  shouldValidate = {formElement.config.validation}/>
              ))}
              <Button btnType = 'Success' >ORDER</Button>
            </form>
    if (this.state.loading) {
      form = <Spinner />
    }
    return (
      <div className = {classes.ContactData}>
        <h4>Enter Your Contact Data</h4>
          {form}
      </div>
    )
  }
}

export default ContactData
