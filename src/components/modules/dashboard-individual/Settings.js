import React from 'react';
import '../Dashboard.css'
import { toast } from 'react-toastify';
import { isInputEmpty, passwordInFormat, passwordsMatching, numOnly } from '../../../utils/validators';
import { postCall, getCall, putCall } from '../../../utils/api.config';
import { PASS_UPDATE, TOGGLE_ACC_ACCOUNT, PLAN_DETAIL, GETJOBTYPES, CREATEJOBDETAILS, UPDATEJOBDETAILS, GETJOBDETAILSBYID, SEND_OTP, VERIFY_EMAIL, UPDATE_EMAIL, VERIFY_RECOVERY } from '../../../utils/constants';
import moment from 'moment';
import Modal from 'react-responsive-modal';
import Radio from '../../shared/Radio';
import Checkout from '../../shared/StripeCheckout';
import { CURRENCYCODE } from "./currencyCode";

const updatePassword = () => {
    let oldPass = document.getElementsByName('oldPass')[0].value
    let newPass = document.getElementsByName('newPass')[0].value
    let confPass = document.getElementsByName('confPass')[0].value
    if (isInputEmpty(oldPass) || isInputEmpty(newPass) || isInputEmpty(confPass)) {
        toast.error('Passwords cannot be empty.')
    }
    else if (!passwordInFormat(oldPass) || !passwordInFormat(newPass)) {
        toast.error('Passwords format is incorrect. Minimum 8 Characters, Use alphabets(atleast 1 in caps) numbers and special characters')
    }
    else if (passwordsMatching(oldPass, newPass)) {
        toast.error('Old Passwords and New Password cannot be same')
    }
    else if (!passwordsMatching(newPass, confPass)) {
        toast.error('Passwords are not matching')
    }
    else {
        let payload = {
            oldPassword: oldPass,
            newPassword: newPass
        }
        putCall(PASS_UPDATE, payload, { sfn: postPassUpdate, efn: errPassUpdate })
    }
}

const postPassUpdate = () => {
    toast.success('Password Successfully Updated')
    document.getElementsByName('oldPass')[0].value = ''
    document.getElementsByName('newPass')[0].value = ''
    document.getElementsByName('confPass')[0].value = ''
}

const errPassUpdate = () => {
    toast.error('Old Password is incorrect')
}

class Settings extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
          openActAlert: false,
          openDactAlert: false,
          alertText: "",
          askOtp: false,
          askRecoveryOtp: false,
          emailVerified: this.props.basicInfo.email_verified,
          recoveryVerified: this.props.basicInfo.recovery_email_verified,
          jobTypes: [],
          jobDetails: [],
          pricePlaceholder: "Enter Price",
          jobId: "",
          jobTypeValue: "",
          currencyValue: "",
          compensationPriceValue: "",
          pricePlaceholderType: ""
        };
    }
    componentDidUpdate(prevProps) {
        if(this.props.basicInfo !== prevProps.basicInfo)
        this.setState({
            emailVerified: this.props.basicInfo.email_verified,
            recoveryVerified: this.props.basicInfo.recovery_email_verified
        })
    }
    componentDidMount() {
        getCall(PLAN_DETAIL, {}, { sfn: this.setPlanDetails, efn: () => toast.error("Server failed to respond. Please try again later.") })
        getCall(GETJOBTYPES, {}, { sfn: this.setJobTypes, efn: () => toast.error("Server failed to respond. Please try again later.") })
        getCall(GETJOBDETAILSBYID, {}, { sfn: this.setJobDetails, efn: () => toast.error("Server failed to respond. Please try again later.") })
    }

    setJobDetails = (data) => {
        this.setState({ jobDetails: data.response });

        if (this.state.jobDetails.length > 0) {            
            this.setState({
              jobId: data.response[this.state.jobDetails.length-1].Id,
              jobTypeValue: data.response[this.state.jobDetails.length-1].JobTypeId,
              currencyValue: data.response[this.state.jobDetails.length-1].CompensationCurrency,
              compensationPriceValue: Math.round(data.response[this.state.jobDetails.length-1].CompensationValue * 100) / 100,
            });
        }
    }

    setJobTypes = (data) => {
        this.setState({ jobTypes: data.response });
    }

    updateCompensation = () => {
        let jobType = document.getElementsByName("jobType")[0].value;
        let currencyCode = document.getElementsByName('currencyCode')[0].value
        let compensationPrice = document.getElementsByName("compensationPrice")[0].value;
        if (isInputEmpty(jobType) || isInputEmpty(currencyCode) || isInputEmpty(compensationPrice)) {
            toast.error("Compensation data cannot be empty.");
        } else {
            let payload = {
                jobTypeId: jobType,
                compensationCurrency: currencyCode,
                compensationValue: compensationPrice,
            };

            if (this.state.jobDetails.length > 0) {
                payload["jobId"] = this.state.jobId;
                putCall(UPDATEJOBDETAILS, payload, {
                  sfn: this.postCompensationUpdate,
                  efn: this.errCompensationpdate,
                });
            } else {
                postCall(CREATEJOBDETAILS, payload, {
                  sfn: this.postCompensationUpdate,
                  efn: this.errCompensationpdate,
                });
            }
            
        }
    }

    postCompensationUpdate = () => {
        toast.success("Compensation Data Successfully Updated");
    }

    errCompensationpdate = () => {
        toast.error("Server failed to respond. Please try again later.");
    };

    setPlanDetails = (data) => {
        this.setState({
            planDetails: data.plans.filter(i => i.plan_for === 'i')
        }, () => this.setState({
            selectedPlanVal: this.state.planDetails[0].amount,
            selectedPlanId: this.state.planDetails[0].id
        }))
    }
    alertDeactication = () => {
        this.setState({ openDactAlert: true })
    }
    alertReactication = () => {
        this.setState({ openActAlert: true })
    }
    onCloseAlertModal = () => {
        this.setState({
            openDactAlert: false,
            openActAlert: false
        })
    }
    toggleActivation = () => {
        postCall(TOGGLE_ACC_ACCOUNT, {}, { sfn: this.accountToggled, efn: this.onCloseAlertModal })
    }
    accountToggled = () => {
        this.props.basicInfo.is_active ? toast.success("Account has been deactivated") : toast.success("Account has been Activated")
        this.onCloseAlertModal.call()
        setTimeout(() => {
            sessionStorage.clear();
            window.location.href = '/'
        }, 2000)
    }
    verifyRecovery = () => {
        let emailid = document.getElementById('recovery_email').value.trim();
        getCall(SEND_OTP, { params: { email: emailid } }, { sfn: this.otpRecSent, efn: this.otpFailed })
    }
    otpRecSent = () => {
        toast.success("OTP sent to your recovery email id")
        this.setState({ askRecoveryOtp: true })
    }
    verifyEmail = () => {
        let emailid = document.getElementById('email').value.trim();
        getCall(SEND_OTP, { params: { email: emailid } }, { sfn: this.otpSent, efn: this.otpFailed })
    }
    otpSent = () => {
        toast.success("OTP sent to your email id")
        this.setState({ askOtp: true })
    }
    updateOTP = (e) => {
        switch (e.target.name) {
            case "emailOTP": this.setState({ otpEntered: e.target.value }, () => this.otpForEmail.call()); break;
            case "recoveryOTP": this.setState({ otpRentered: e.target.value }, () => this.otpForRecEmail.call()); break;
            default: break;
        }
    }
    otpForEmail = () => {
        let emailid = document.getElementById('email').value.trim()
        let otp = this.state.otpEntered
        if(otp.length===6) {
            if (!numOnly(otp)) {
                toast.error("OTP should be 6 digut number only")
            }else {
                getCall(VERIFY_EMAIL, { params: { email: emailid, otp: otp } }, {sfn:this.emailVerified, efn:this.verificationError})
            }
        }
    }
    emailVerified=()=>{
        toast.success('Email Successfully Verified')
        this.setState({askRecoveryOtp:false,askOtp:false,emailVerified:true})
    }
    recoveryVerified=()=>{
        toast.success('Recovery Email Successfully Verified')
        this.setState({askRecoveryOtp:false,askOtp:false,recoveryVerified:true})
    }
    verificationError=()=>{
        toast.error('Email Verification Failed')
    }
    otpForRecEmail = () => {
        let emailid = document.getElementById('recovery_email').value.trim()
        let otp = this.state.otpRentered
        if(otp.length===6) {
            if (!numOnly(otp)) {
                toast.error("Invalid email input")
            } else{
                getCall(VERIFY_RECOVERY, { params: { email: emailid, otp: otp, r: true } }, {sfn:this.recoveryVerified, efn:this.verificationError})
            }
        }
    }
    editRecovery = () => {
        document.getElementById('recovery_email').disabled = false;
        document.getElementById('email').disabled = true;
        document.getElementById('recovery_email').focus()
        document.getElementById('recovery_email').select()
        this.setState({ isEditingEmail: false, isEditingEmailRec: true })
    }
    editEmail = () => {
        document.getElementById('email').disabled = false;
        document.getElementById('recovery_email').disabled = true;
        document.getElementById('email').focus()
        document.getElementById('email').select()
        this.setState({ isEditingEmail: true, isEditingEmailRec: false })
    }
    updateEmail=()=>{
        this.setState({ isEditingEmail: false, isEditingEmailRec: false })
        putCall(UPDATE_EMAIL,{email:document.getElementById('email').value,type:'email'},{sfn:this.emailUpdateSuccess, efn:this.emailUpdateFailed})
    }
    emailUpdateSuccess=()=>{
        toast.success("Email successfully updated. Kindly login again")
        setTimeout(()=>{
            sessionStorage.clear()
            window.location.href='/'
        },3000)
    }
    RecEmailUpdateSuccess = () => {
        toast.success("Email successfully updated.");
    }
    emailUpdateFailed=()=>{
        toast.error("Failed to update. Please refresh and try again")
        this.setState({ isEditingEmail: false, isEditingEmailRec: false })
    }
    updateRecovery=()=>{
        this.setState({ isEditingEmail: false, isEditingEmailRec: false })
        putCall(UPDATE_EMAIL,{email:document.getElementById('recovery_email').value,type:'recovery'},{sfn:this.RecEmailUpdateSuccess, efn:this.emailUpdateFailed})
    }
    updateInputState=(i)=>{
        this.setState({
            selectedPlanVal:i.amount,
            selectedPlanId:i.id
        })
    }
    onPriceChange(value){
        this.setState({
             compensationPriceValue: value
        });
    }
    onJobTypeChange(value){
        this.setState({
          compensationPriceValue: "",
        });
        

        if (value == 3) {
            this.setState({
              pricePlaceholderType: "(Hourly)",
            });
        } else {
            this.setState({
              pricePlaceholderType: "(Yearly)",
            });
        }        
    }
    
    render() {
        return (
            <div id="Settings">
                <div className="matchup-secs">
                    <p className="bold">Manage Credentials</p>
                    <span className="title-description">You can manage your user credentials here. You are allowed to edit your email recovery email and you can change your password.</span>
                    <div style={{ overflowX: "auto" }}>
                        <table className="table">
                            <tbody>
                                <tr>
                                    <td>Your primary email id</td>
                                    <td>
                                        <input id="email" disabled defaultValue={this.props.basicInfo.email} type="text" />
                                    </td>
                                    <td>
                                        {!this.state.isEditingEmail ?
                                            <button type="button" onClick={this.editEmail} style={{ background: 'none', border: 'none' }}><span className="fa fa-pencil-square-o"></span></button>
                                            :
                                            <button type="button" className="btn-done" onClick={this.updateEmail}>Done</button>
                                        }
                                    </td>
                                    <td>
                                        {this.state.emailVerified ?
                                            <span className="fa fa-check"> Verified</span>
                                            :
                                            <>
                                                <span className="fa fa-times"> Not Verified</span>
                                                {!this.state.askOtp ? <button onClick={this.verifyEmail} className="link-like">verify now</button>
                                                    : <input placeholder="OTP***" maxLength={6} className="otp-taker" value={this.state.otpEntered} name="emailOTP" onChange={this.updateOTP} autoComplete="off"/>}
                                            </>
                                        }
                                    </td>
                                </tr>
                                <tr>
                                    <td>Your recovery email id</td>
                                    <td>
                                        <input id="recovery_email" disabled defaultValue={this.props.basicInfo.recovery_email} type="text" />
                                    </td>
                                    <td>
                                        {!this.state.isEditingEmailRec?
                                            <button type="button" onClick={this.editRecovery} style={{ background: 'none', border: 'none' }}><span className="fa fa-pencil-square-o"></span></button>
                                            :
                                            <button type="button" className="btn-done" onClick={this.updateRecovery}>Done</button>
                                        }
                                    </td>
                                    <td>
                                        {this.state.recoveryVerified ?
                                            <span className="fa fa-check"> Verified</span>
                                            :
                                            <>
                                                <span className="fa fa-times"> Not Verified</span>
                                                {!this.state.askRecoveryOtp ? <button onClick={this.verifyRecovery} className="link-like">verify now</button>
                                                    : <input placeholder="OTP***" maxLength={6} className="otp-taker" value={this.state.otpRentered} name="recoveryOTP" onChange={this.updateOTP} autoComplete="off"/>}
                                            </>
                                        }
                                    </td>
                                </tr>
                                <tr>
                                    <td>Change your password</td>
                                    <td>
                                        <input name="oldPass" type="password" placeholder="Old Password" />
                                    </td>
                                    <td>
                                        <input name="newPass" type="password" placeholder="New Password" />
                                    </td>
                                    <td>
                                        <input name="confPass" type="password" placeholder="Confirm Password" />
                                    </td>
                                    <td>
                                        <button type="button" className="passUpdate" onClick={updatePassword}>Update</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="matchup-secs">
                    <p className="bold">Payment History</p>
                    <span className="title-description">You can view your transaction's history with the order numbers value and expiry information. You can also buy a subscription by clicking the subcribe now button.</span>
                    {this.props.payment && this.props.payment.length ?
                        <div style={{ overflowX: "auto" }}>
                            <table className="table table-bordered" style={{ marginBottom: '20px' }}>
                                <thead>
                                    <tr>
                                        <th>Order Number</th>
                                        <th>Amount Paid</th>
                                        <th>Subscription Start Date</th>
                                        <th>Current Status</th>
                                        <th>Subscription End Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.props.payment.map(i =>
                                        <tr key={i.payment_response_id}>
                                            <td>{i.order_number}</td>
                                            <td>$ {i.order_total}</td>
                                            <td>{moment(i.subscription.start_date).format('MMMM Do YYYY')}</td>
                                            <td>{moment(i.subscription.end_date).isAfter(moment()) ? 'Active' : 'Expired'}</td>
                                            <td>{moment(i.subscription.end_date).format('MMMM Do YYYY')}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>:null
                    }
                    <div className="text-right">
                        <button type="button" className="passUpdate" onClick={() => this.setState({ isSubscribing: !this.state.isSubscribing })}>{this.state.isSubscribing ? "Sunscribe Later" : "Subscribe Now"}</button>
                    </div>
                    {this.state.isSubscribing &&
                        <div className="text-center in-payment">
                            {this.state.planDetails.map((i, ind) =>
                                <Radio key={ind} id={i.id} name="plan" content={`$ ${i.amount}, ${i.plan_name} Plan, validity ${i.period_in_months} days`} value={i.amount} selected={ind === 0} onChange={this.updateInputState.bind(this,i)} />
                            )}
                            <div style={{ marginTop: '30px' }}><Checkout price={this.state.selectedPlanVal} id={this.state.selectedPlanId} /></div>
                        </div>
                    }
                </div>
                
                <div className="matchup-secs">
                    <p className="bold">Manage Compensation</p>
                    <span className="title-description">You can manage your compensation price here.</span>
                    <br /><br />
                    <div className="row">
                        <div className="col-md-2">
                            <label>Select Job Type</label>
                            <div className="form-group">
                                <select className="form-control" name="jobType" onChange={e => this.onJobTypeChange(e.target.value)} required>
                                    <option value="" selected>Select</option>
                                    {this.state.jobTypes.map((item, key) => (
                                        <>
                                            {this.state.jobTypeValue === item.id ? 
                                                <option key={key} value={item.id} selected>{item.Name}</option> : 
                                                <option key={key} value={item.id}>{item.Name}</option>
                                            }                                            
                                        </>                                        
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="col-md-2">
                            <label>Select Currency Code</label>
                            <div className="form-group">
                                <select className="form-control" name="currencyCode" required>
                                    <option value="" selected>Select</option>
                                    {CURRENCYCODE.map((item, key) => (
                                        <>
                                            {this.state.currencyValue === item ? 
                                                <option key={key} value={item} selected>{item}</option> : 
                                                <option key={key} value={item}>{item}</option>
                                            }                                            
                                        </>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="col-md-2">
                            <label>{this.state.pricePlaceholder} <span className="text-danger">{this.state.pricePlaceholderType}</span></label>
                            <div className="form-group">
                                <input type="number" className="form-control" name="compensationPrice" value={this.state.compensationPriceValue} onChange={e => this.onPriceChange(e.target.value)} placeholder={this.state.pricePlaceholder} required />
                            </div>
                        </div>
                        <div className="col-md-2">
                            <br />
                            <div className="form-group">
                                <button type="button" className="passUpdate" onClick={this.updateCompensation}>Update</button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="matchup-secs">
                    <p className="bold">Manage Account</p>
                    <span className="title-description">You can activate or deactivate your account. Note in case your subscription expires your account will be deactivated automatically.</span>
                    {this.props.basicInfo.is_active ? <div><button type="button" className="btn-deactivate" onClick={this.alertDeactication}>Click Here</button><span> to deactivate your account*</span></div> :
                        <div><button type="button" className="btn-deactivate" onClick={this.alertReactication}>Click Here</button><span> to reactivate your account*</span></div>}
                </div>

                <Modal
                    open={this.state.openDactAlert}
                    onClose={this.onCloseAlertModal}
                    center
                    classNames="alert-modal">
                    <div className="alert-modal">
                        <h3>Account Deactivation Alert</h3>
                        <p style={{ fontSize: '0.9em' }}>You are trying to deactivate your account. The means your subscription will be lost and you will be logged out automatically. If you are sure please write <strong>confirm</strong> in the below input and press the confirm button.</p>
                        <input type="text" className="general-input" onChange={(e) => this.setState({ alertText: e.target.value })} value={this.state.alertText} />
                        <div className="text-right" style={{ marginTop: '10px' }}>
                            <button type="button" disabled={this.state.alertText.toLowerCase() !== 'confirm'} className="passUpdate" onClick={this.toggleActivation}>CONFIRM</button>
                        </div>
                    </div>
                </Modal>
                <Modal
                    open={this.state.openActAlert}
                    onClose={this.onCloseAlertModal}
                    center
                    classNames="alert-modal">
                    <div className="alert-modal">
                        <h3>Account Activation Alert</h3>
                        <p style={{ fontSize: '0.9em' }}>You are trying to reactivate your account. If you are sure please write <strong>confirm</strong> in the below input and press the confirm button.<br />For Security reasons you will be logged out kindly log in again.</p>
                        <input type="text" className="general-input" onChange={(e) => this.setState({ alertText: e.target.value })} value={this.state.alertText} />
                        <div className="text-right" style={{ marginTop: '10px' }}>
                            <button type="button" disabled={this.state.alertText.toLowerCase() !== 'confirm'} className="passUpdate" onClick={this.toggleActivation}>CONFIRM</button>
                        </div>
                    </div>
                </Modal>
            </div>
        )
    }

}

export default Settings;