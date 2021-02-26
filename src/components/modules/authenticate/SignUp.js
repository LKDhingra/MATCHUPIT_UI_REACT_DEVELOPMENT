import React from 'react';
import './Authenticate.css';
import { postCall, getCall } from '../../../utils/api.config';
import { SIGN_UP, LOGIN_SOCIAL, SEND_OTP, VERIFY_EMAIL, ACCOUNT, CHECK_USER } from '../../../utils/constants';
import { passwordInFormat, passwordsMatching, isInputEmpty, emailInFormat } from '../../../utils/validators';
import Radio from '../../shared/Radio';
import Checkbox from '../../shared/Checkbox';
import { Link } from 'react-router-dom';
import GoogleLogin from 'react-google-login';
import ReactFacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { toast } from 'react-toastify';

class SignUp extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            modalPass: true,
            userEmail: { value: '', err: '' },
            userPassword: { value: '', err: '' },
            confirmPassword: { value: '', err: '' },
            otp: { value: '', err: '' },
            membership: "individual",
            formReady: true,
            tncAgreed: false,
            toggleWindow: 'email',
            autoAuth: false,
        }
        sessionStorage.clear()
    }

    componentDidMount(){
        if(window.location.href.includes('authorization=')){
            let code = window.location.href.split('authorization=')[1]
            this.setState({
                autoAuth: true,
                subCode:code,
                toggleWindow:'password'
            })
        }
        else if (sessionStorage.getItem('account')) {
            window.location.href = ACCOUNT === 'individual' ? './dashboard-individual' : './dashboard-corporate'
        }
    }

    toggRegister = (window) => {
        this.setState({ toggleWindow: window, userPassword: { value: '', err: '' },confirmPassword: { value: '', err: '' } })
    }

    updateInputState = (e) => {
        switch (e.target.name) {
            case "userEmail": this.setState({ userEmail: { value: e.target.value, err: '' }, formReady: true }); break
            case "userPassword": this.setState({ userPassword: { value: e.target.value, err: '' }, formReady: true }); break
            case "confirmPassword": this.setState({ confirmPassword: { value: e.target.value, err: '' }, formReady: true }); break
            case "subscription": this.setState({ subscription: { value: e.target.value, err: '' }, formReady: true }); break
            case "otp": this.setState({ otp: { value: e.target.value, err: '' }, formReady: true }); break
            case "account": this.setState({ membership: document.querySelector('input[name = "account"]:checked').value, formReady: true }); break;
            default: break
        }
    }

    successLogin = (data) => {
        sessionStorage.setItem("userToken", data.response.token)
        sessionStorage.setItem("userId", data.response.id)
        sessionStorage.setItem("account", data.response.account_type)
        sessionStorage.setItem(
          "profileBuilder",
          JSON.stringify({
            questionnaire: true,
          })
        );
        let account = data.response.account_type
        setTimeout(() => { window.location.href = account==='individual'?'./dashboard-individual':'./dashboard-corporate'}, 500)
    }

    skipForNow=()=>{
        this.successLogin.call()
    }

    loginError = (errorCode) => {
        if (errorCode === 401) {
            toast.error("There is an authentication error. Please signin again.")
        }
        if (errorCode === 503) {
            toast.error("Server failed to respond. Please try again later.")
        }
        if (errorCode === 400) {
            toast.error("User already registered. Try signing in.")
        }
    }

    otpError = (errorCode) => {
        if (errorCode === 503) {
            toast.error("Server failed to respond. Please try again later.")
        }
        if (errorCode === 400) {
            toast.error("OTP entered is incorrect.")
        }
    }

    registerUser = () => {
        let email = this.state.userEmail.value
        let password = this.state.userPassword.value
        let confirmPassword = this.state.confirmPassword.value
        let account_type = this.state.membership
        let subCode = this.state.subCode
        if (isInputEmpty(password)) {
            this.setState({
                userPassword: { value: this.state.userPassword.value, err: 'Password Cannot Be Empty' },
                formReady: false
            })
        }
        else if (!passwordInFormat(password)) {
            this.setState({
                userPassword: { value: this.state.userPassword.value, err: 'Invalid Password Format' },
                formReady: false
            })
        }
        if (!passwordsMatching(password, confirmPassword)) {
            this.setState({
                confirmPassword: { value: this.state.confirmPassword.value, err: 'Passwords Donot Match' },
                formReady: false
            })
        }
        if(!this.state.tncAgreed){
            this.setState({formReady: false})
            toast.error('Terms and conditions needs to be agreed')
        }
        setTimeout(() => {
            if (this.state.formReady) {
                let payload = this.state.autoAuth?{
                    authorization: subCode,
                    password: password
                }:{
                    email: email,
                    password: password,
                    account_type: account_type
                }
                postCall(SIGN_UP, payload, { sfn: this.successLogin, efn: this.loginError })
            }
        }, 0)
    }

    verifyOTPnow=()=>{
        getCall(VERIFY_EMAIL, {params:{email:this.state.userEmail.value, otp:this.state.otp.value}}, {sfn:this.emailVerified, efn:this.otpError})
    }
    emailVerified=()=>{
        this.setState({toggleWindow:'password'})
    }
    contRegister = () => {
        let email = this.state.userEmail.value;
        if (isInputEmpty(email)) {
            this.setState({
                userEmail: { value: this.state.userEmail.value, err: 'Email Id Cannot Be Empty' },
                formReady: false
            })
        }
        else if (!emailInFormat(email)) {
            this.setState({
                userEmail: { value: this.state.userEmail.value, err: 'Invalid Email Format' },
                formReady: false
            })
        } else{
            getCall(CHECK_USER,{params:{email:this.state.userEmail.value, account_type:this.state.membership}}, {sfn:this.ifEmailUnique, efn: this.errIfEmailUnique})
        }
    }

    errIfEmailUnique = () => {
        toast.error("Server failed to respond. Please try again later.")
    }

    ifEmailUnique=(data)=>{
        if(data.response.registered){
            toast.error('Email Id already registered')
        }else{
            getCall(SEND_OTP, {params:{email:this.state.userEmail.value}}, {  })
            this.setState({toggleWindow:'otp'})
        }
    }

    responseFacebook = (response) => {
        if (response.userID) {
            let fullName = response.name.split(' ').filter(i => (i !== ''))
            let first_name = fullName[0]
            let last_name = fullName.slice(1).join().replace(/,/g, ' ')
            let payload = {
                socialType: 'facebook',
                socialId: response.userID,
                email: response.email,
                profilePic: response.picture.data.url,
                firstName: first_name,
                lastName: last_name
            }
            postCall(LOGIN_SOCIAL, payload, { sfn: this.successLogin, efn: this.loginError })
        }
    }

    responseGoogle = (response) => {
        if (response.googleId) {
            let payload = {
                socialType: 'google',
                socialId: response.googleId,
                email: response.profileObj.email,
                profilePic: response.profileObj.imageUrl,
                firstName: response.profileObj.givenName,
                lastName: response.profileObj.familyName
            }
            postCall(LOGIN_SOCIAL, payload, { sfn: this.successLogin, efn: this.loginError })
        }
    }

    resendOtp = () => {
        this.contRegister.call()
        toast.success("OTP has been sent to your emailId. Kindly enter the recent OTP")
    }
    render() {
        return (
            <div className="auth-BG">
                <div className="auth-box text-center">
                    <Link to='/'><img src={require("../../../images/icons/logo.png")} alt="" /></Link><hr />
                    {this.state.toggleWindow==='email' &&
                        <div>
                            {this.state.membership === 'individual' &&
                            <>
                            <div className="social-auth">
                                <ul>
                                    <li>
                                        <ReactFacebookLogin
                                            appId="1818126351651392"
                                            appSecret="34e7cafc9d60200bcc7f421b985b8fa2"
                                            callback={this.responseFacebook}
                                            fields="name,email,picture"
                                            render={renderProps => (
                                                <button onClick={renderProps.onClick} className="btn-social" type="button"><img src={require('../../../images/icons/facebook.png')} alt="" /></button>
                                            )}
                                        />
                                    </li>
                                    <li>
                                        <GoogleLogin
                                            render={renderProps => (
                                                <button onClick={renderProps.onClick} className="btn-social" type="button"><img src={require('../../../images/icons/google.png')} alt="" /></button>
                                            )}
                                            clientId="372996913359-crf9ptpkt6ampu2g0iqk8io7e5tbrio5.apps.googleusercontent.com"
                                            clientSecret='6LdWDFspzSSWEKsidQ5aeKte'
                                            onSuccess={this.responseGoogle}
                                            onFailure={this.responseGoogle}
                                            cookiePolicy={'single_host_origin'}
                                        />
                                    </li>
                                </ul>
                            </div>
                            <div className="divider">- - - - - OR - - - - -</div>
                            </>}
                            {!this.state.autoAuth && <div className="form-unit">
                                <Radio name="account" content="Individual" value="individual" selected={this.state.membership==='individual'} onChange={this.updateInputState} />
                                <Radio name="account" content="Corporate" value="corporate" selected={this.state.membership==='corporate'} onChange={this.updateInputState} />
                            </div>}
                            <div className="form-unit">
                                <input disabled={this.state.autoAuth} onKeyPress={(e)=>{if(e.which === 13 || e.keyCode === 13){this.contRegister.call()}}} type="text" name="userEmail" className={this.state.userEmail.err === '' ? "" : "error-input"} onChange={this.updateInputState} value={this.state.userEmail.value} placeholder="Enter Email Address" autoComplete="off"/>
                                {this.state.userEmail.err !== '' && <div className="error-info">{this.state.userEmail.err}</div>}
                            </div>
                            <div className="form-unit">
                                <button className="btn-submit" type="button" onClick={this.contRegister}>C O N T I N U E</button>
                            </div>
                            <div className="form-unit">
                                <Link to="/signin"><p className="sub-links">Already registered? <span>Signin</span></p></Link>
                            </div>
                        </div>
                    }
                    {this.state.toggleWindow==='password' &&
                        <div>
                            <div className="form-unit">
                                <input onKeyPress={(e)=>{if(e.which === 13 || e.keyCode === 13){this.registerUser.call()}}} type="password" name="userPassword" className={this.state.userPassword.err === '' ? "" : "error-input"} onChange={this.updateInputState} value={this.state.userPassword.value} placeholder="Choose Password" />
                                {this.state.userPassword.err !== '' && <div className="error-info">{this.state.userPassword.err} <span className="fa fa-info-circle" data-toggle="tooltip" data-placement="bottom" title="Minimum 8 Characters, Use alphabets(atleast 1 in caps) numbers and special characters"></span></div>}
                            </div>
                            <div className="form-unit">
                                <input onKeyPress={(e)=>{if(e.which === 13 || e.keyCode === 13){this.registerUser.call()}}} type="password" name="confirmPassword" className={this.state.confirmPassword.err === '' ? "" : "error-input"} onChange={this.updateInputState} value={this.state.confirmPassword.value} placeholder="Confirm Password" />
                                {this.state.confirmPassword.err !== '' && <div className="error-info">{this.state.confirmPassword.err}</div>}
                            </div>
                            <div className="password-rules">
                                <p className={(/[a-z]/).test(this.state.userPassword.value)?'success':''}><span className="fa fa-check"></span> At-least one Alphabet in Lowercase</p>
                                <p className={(/[A-Z]/).test(this.state.userPassword.value)?'success':''}><span className="fa fa-check"></span> At-least one Alphabet in Uppercase</p>
                                <p className={(/[0-9]/).test(this.state.userPassword.value)?'success':''}><span className="fa fa-check"></span> At-least one Number (0 - 9)</p>
                                <p className={(/[!@#$%^&*()_+]/).test(this.state.userPassword.value)?'success':''}><span className="fa fa-check"></span> At-least one Special character</p>
                                <p className={(this.state.userPassword.value.length > 7)?'success':''}><span className="fa fa-check"></span> Minimum length of 8 character</p>
                            </div>
                            <div className="form-unit">
                                <Checkbox selected={this.state.tncAgreed} text={<label>I agree to <a href="/terms-conditions" target="_blank" style={{borderBottom:"1px solid #0000EE", color:"#0000EE"}}>terms &amp; conditions</a>  of MatchupIT</label>} onChange={()=>this.setState({tncAgreed: !this.state.tncAgreed})}/>
                            </div>
                            <div className="form-unit">
                                <button className="btn-submit" type="button" onClick={this.registerUser} disabled={!this.state.tncAgreed}>S U B M I T</button>
                            </div>
                            <div className="form-unit">
                                <button className="btn-submit back" disabled={this.state.autoAuth} type="button" onClick={this.toggRegister.bind(this,'email')}>B A C K</button>
                            </div>
                        </div>
                    }
                    {this.state.toggleWindow==='otp' &&
                        <div>
                            <p>An OTP has been sent to {this.state.userEmail.value} Kindly check your email and enter the 6 digit code here.</p>
                            <div className="form-unit">
                                <input maxLength="6" onKeyPress={(e)=>{if(e.which === 13 || e.keyCode === 13){this.verifyOTPnow.call()}}} type="text" name="otp" onChange={this.updateInputState} value={this.state.otp.value} placeholder="******"  autoComplete="off"/>
                            </div>
                            <button style={{color:"#035891", background:"none", border:"none", marginTop:"25px"}} type="button" onClick={this.resendOtp}>RESEND OTP</button>
                            <div className="form-unit">
                                <button className="btn-submit" type="button" onClick={this.verifyOTPnow}>S U B M I T</button>
                            </div>
                        </div>
                    }
                </div>
            </div>
        )
    }
}

export default SignUp
