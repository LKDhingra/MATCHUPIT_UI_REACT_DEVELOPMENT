import React from 'react';
import { PayPalButton } from "react-paypal-button-v2";
import {PAYPAL_SANDBOX, SAVE_PAYMENT} from "../../utils/constants"
import { postCall } from '../../utils/api.config';
import { toast } from 'react-toastify';
import store from '../../redux/store';
import {setPaymentStatus} from '../../redux/actions/index'
 
export default class PaypalButton extends React.Component {
    constructor(props){
        super(props)
      this.state={}
    }
  render() {
    return (
      <PayPalButton
        amount={this.props.amount}
        onSuccess={(details, data) => {
            let payload={
                details:{
                    status: 1,
                    transaction:data,
                    info: details
                }
            }
          postCall(SAVE_PAYMENT, payload)
          toast.success("Transaction completed by " + details.payer.name.given_name)
          store.dispatch(setPaymentStatus(true))
        }}
        options={{
            clientId: PAYPAL_SANDBOX
        }}
      />
    );
  }
}