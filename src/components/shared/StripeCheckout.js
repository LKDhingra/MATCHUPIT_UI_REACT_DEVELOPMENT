import React from 'react'
import StripeCheckout from 'react-stripe-checkout';
import { postCall } from '../../utils/api.config';
import {MAKE_PAYMENT} from '../../utils/constants';
import { addPaymentInfo } from '../../redux/actions/index'
import { toast } from 'react-toastify';
import store from '../../redux/store';

export default function Checkout(props){
  
  async function onToken(token){
    let payload={
      planId: props.id,
      token: token.id,
      sessionId: 0,
      ipAddress: token.client_ip
    }
    await postCall(MAKE_PAYMENT, payload, {sfn:paymentSuccess,efn:paymentFailure})
  }
  const paymentSuccess=(data)=>{
    toast.success('Payment Successful!')
    store.dispatch(addPaymentInfo(data.response))
  }
  const paymentFailure=()=>{
    toast.error('Payment Failed!')
  }
  return (
    <StripeCheckout
      token={onToken}
      stripeKey="pk_test_PEwLdiEsqijIexnCdy4EP5he00YJ2QiZQH"
      amount={props.price * 100}
    >
      <button id="stripe-button" className="btn btn-primary">Pay</button>
    </StripeCheckout>
  )
}