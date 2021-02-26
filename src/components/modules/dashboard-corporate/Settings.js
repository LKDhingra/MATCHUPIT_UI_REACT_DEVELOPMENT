import React from 'react';
import '../Dashboard.css'
import Radio from '../../shared/Radio';
import { toast } from 'react-toastify';
import { isInputEmpty, passwordInFormat, passwordsMatching, emailInFormat, numOnly } from '../../../utils/validators';
import { putCall, postCall, getCall } from '../../../utils/api.config';
import { PASS_UPDATE, ADD_MEMBER, DEACTIVATE_CORPORATE, PLAN_DETAIL, TOGGLE_ACC_ACCOUNT, SEND_OTP, VERIFY_EMAIL, UPDATE_EMAIL, VERIFY_RECOVERY } from '../../../utils/constants';
import store from '../../../redux/store';
import { updateMembers } from '../../../redux/actions';
import Modal from 'react-responsive-modal';
import Checkout from '../../shared/StripeCheckout';
import moment from 'moment';

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
const addMember = () => {
    let memberEmailEle = document.getElementById('add-mem-input')
    let memberEmail = memberEmailEle.value.trim()
    if (isInputEmpty(memberEmail)) {
        toast.error('Email cannot be empty')
    }
    else if (!emailInFormat(memberEmail)) {
        toast.error('Email format is invalid')
    } else {
        memberEmailEle.disable = true
        memberEmailEle.value = ''
        postCall(ADD_MEMBER, { email: memberEmail }, { sfn: memberAdded, efn: errorInAdd })
    }
}
const errorInAdd = (data) => {
    if (data) {
        toast.error("User is already a member of a company")
    }
}
const deactivateUser = (id) => {
    postCall(DEACTIVATE_CORPORATE, { userId: id, is_active: false }, { sfn: afterRemoving, efn: () => toast.error("Server failed to respond. Please try again later.") })
}
const afterRemoving = (data) => {
    toast.success("Member deactivated successfully.")
    store.dispatch(updateMembers(data.response))
}
const memberAdded = (data) => {
    let memberEmailEle = document.getElementById('add-mem-input')
    memberEmailEle.disable = false
    toast.success(`${data.response.email} has been added. You will be able to view once user has joined.`)
}
class Settings extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            openActAlert: false,
            openDactAlert: false,
            alertText: '',
            askOtp: false,
            askRecoveryOtp: false,
            emailVerified: this.props.basicInfo.email_verified,
            recoveryVerified: this.props.basicInfo.recovery_email_verified
        }
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
    }
    setPlanDetails = (data) => {
        this.setState({
            planDetails: data.plans.filter(i => i.plan_for === 'c')
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
    updateEmail = () => {
        this.setState({ isEditingEmail: false, isEditingEmailRec: false })
        putCall(UPDATE_EMAIL, { email: document.getElementById('email').value, type: 'email' }, { sfn: this.emailUpdateSuccess, efn: this.emailUpdateFailed })
    }
    emailUpdateSuccess = () => {
        toast.success("Email successfully updated. Kindly login again")
        setTimeout(()=>{
            sessionStorage.clear()
            window.location.href='/'
        },3000)
    }
    RecEmailUpdateSuccess = () => {
        toast.success("Email successfully updated.");
    }
    emailUpdateFailed = () => {
        toast.error("Failed to update. Please refresh and try again")
        this.setState({ isEditingEmail: false, isEditingEmailRec: false })
    }
    updateRecovery = () => {
        this.setState({ isEditingEmail: false, isEditingEmailRec: false })
        putCall(UPDATE_EMAIL, { email: document.getElementById('recovery_email').value, type: 'recovery' }, { sfn: this.RecEmailUpdateSuccess, efn: this.emailUpdateFailed })
    }
    updateInputState=(i)=>{
        this.setState({
            selectedPlanVal:i.amount,
            selectedPlanId:i.id
        })
    }
    render() {
        return (
            <div id="Settings">
                <div className="matchup-secs">
                    <p className="bold">Manage Members</p>
                    <span className="title-description">Just enter the email id of a member to add them to your account, an email will be sent to that id with the joining link. Later if required you can remove them from your list also.</span><br /><br />
                    <span>Add New Member</span><br />
                    <input className="add-mem-input" type='text' id='add-mem-input' placeholder="Enter Email Id" disabled={(this.props.accountHolder.members && this.props.accountHolder.members.length > 2) || (!this.props.accountHolder.is_master)} />
                    <button type="button" disabled={(this.props.accountHolder.members && this.props.accountHolder.members.length > 2) || (!this.props.accountHolder.is_master)} className="btn-add-mem" onClick={addMember}>Add Member</button>
                    {this.props.accountHolder.members && this.props.accountHolder.members.length ?
                        <div style={{ overflowX: "auto" }}>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Account</th>
                                        <th>Email Id</th>
                                        <th>Status</th>
                                        <th>Remove</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.props.accountHolder.members && this.props.accountHolder.members.map((i, index) =>
                                        <tr key={i.subId}>
                                            <td>{index + 1}</td>
                                            <td>{i.email}</td>
                                            <td>{i.is_active ? "Joined" : "Pending"}</td>
                                            <td><span onClick={() => deactivateUser(i.subId)} className="fa fa-trash-o"></span></td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        : null}
                </div>
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
                                        {this.state.emailVerified?
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
                                        {!this.state.isEditingEmailRec ?
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
                        <button type="button" className="passUpdate" onClick={() => this.setState({ isSubscribing: !this.state.isSubscribing })}>{this.state.isSubscribing ? "Subscribe Later" : "Subscribe Now"}</button>
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