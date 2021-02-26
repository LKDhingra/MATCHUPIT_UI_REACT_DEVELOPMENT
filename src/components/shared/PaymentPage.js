// import React from "react";
// import Card from "react-credit-cards";
// import {
//     formatCreditCardNumber,
//     formatCVC,
//     formatExpirationDate
// } from "./PayUtils";
// import "react-credit-cards/es/styles-compiled.css";
// import { Elements } from '@stripe/react-stripe-js';
// import { loadStripe } from '@stripe/stripe-js';

// const stripePromise = loadStripe('pk_test_PEwLdiEsqijIexnCdy4EP5he00YJ2QiZQH');

// export default class App extends React.Component {
//     state = {
//         number: "",
//         name: "",
//         expiry: "",
//         cvc: "",
//         issuer: "",
//         focused: "",
//         formData: null
//     };

//     handleCallback = ({ issuer }, isValid) => {
//         if (isValid) {
//             this.setState({ issuer });
//         }
//     };

//     handleInputFocus = ({ target }) => {
//         this.setState({
//             focused: target.name
//         });
//     };

//     handleInputChange = ({ target }) => {
//         if (target.name === "number") {
//             target.value = formatCreditCardNumber(target.value);
//         } else if (target.name === "expiry") {
//             target.value = formatExpirationDate(target.value);
//         } else if (target.name === "cvc") {
//             target.value = formatCVC(target.value);
//         }

//         this.setState({ [target.name]: target.value });
//     };

//     handleSubmit = e => {
//         e.preventDefault();
//         const { issuer } = this.state;
//         const formData = [...e.target.elements]
//             .filter(d => d.name)
//             .reduce((acc, d) => {
//                 acc[d.name] = d.value;
//                 return acc;
//             }, {});
//         this.setState({ formData });
//         this.form.reset();
//     };

//     render() {
//         const { name, number, expiry, cvc, focused, issuer } = this.state;
//         return (
//             <Elements stripe={stripePromise}>
//                 <div key="Payment">
//                     <div className="App-payment">
//                         <div className="row">
//                             <div className="col-sm-6">
//                                 <Card
//                                     number={number}
//                                     name={name}
//                                     expiry={expiry}
//                                     cvc={cvc}
//                                     focused={focused}
//                                     callback={this.handleCallback}
//                                 />
//                             </div>
//                             <div className="col-sm-6">
//                                 <form ref={c => (this.form = c)} onSubmit={this.handleSubmit}>
//                                     <div className="">
//                                         <input
//                                             type="tel"
//                                             name="number"
//                                             placeholder="Card Number*"
//                                             pattern="[\d| ]{16,22}"
//                                             required
//                                             onChange={this.handleInputChange}
//                                             onFocus={this.handleInputFocus}
//                                         />
//                                     </div>
//                                     <div className="">
//                                         <input
//                                             type="text"
//                                             name="name"
//                                             placeholder="Card Holder's Name*"
//                                             required
//                                             onChange={this.handleInputChange}
//                                             onFocus={this.handleInputFocus}
//                                         />
//                                     </div>
//                                     <div className="row">
//                                         <div className="col-sm-6">
//                                             <input
//                                                 type="tel"
//                                                 name="expiry"
//                                                 placeholder="Expiration*"
//                                                 pattern="\d\d/\d\d"
//                                                 required
//                                                 onChange={this.handleInputChange}
//                                                 onFocus={this.handleInputFocus}
//                                             />
//                                         </div>
//                                         <div className="col-sm-6">
//                                             <input
//                                                 type="tel"
//                                                 name="cvc"
//                                                 placeholder="CVC/CVV*"
//                                                 pattern="\d{3,4}"
//                                                 required
//                                                 onChange={this.handleInputChange}
//                                                 onFocus={this.handleInputFocus}
//                                             />
//                                         </div>
//                                     </div>
//                                     <input type="hidden" name="issuer" value={issuer} />
//                                     <div className="form-actions">
//                                         <button className="btn btn-primary btn-block" >MAKE PAYMENT</button>
//                                     </div>
//                                 </form>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </Elements>
//         );
//     }
// }
