import React from 'react';
import './Authenticate.css';
import { postCall, getCall, putCall } from '../../../utils/api.config';
import { LOGIN, LOGIN_SOCIAL, ACCOUNT, FORGOT_PASSWORD_OTP, FORGOT_PASSWORD_CHANGE } from '../../../utils/constants';
import { isInputEmpty, emailInFormat, passwordInFormat } from '../../../utils/validators';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import Loader from '../../shared/Loader';
import GoogleLogin from 'react-google-login';
import ReactFacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import Radio from '../../shared/Radio';

class SignIn extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            userEmail: { value: '', err: '' },
            userPassword: { value: '', err: '' },
            formReady: true,
            isLoading: false,
            code: '',
            errorMessage: '',
            forgotPassView: false,
            changePassView: false,
            loginView: true,
            newPassView: false,
            membership: "individual",
            confirmPassword: { value: '', err: '' },
            otp: { value: '', err: '' },
            autoAuth: false,
        }
    }
    componentDidMount() {
        if (window.location.href.includes('authorization=')) {
            let code = window.location.href.split('authorization=')[1]
            this.setState({
                autoAuth: true,
                subCode: code
            })
        }
        else if (sessionStorage.getItem('account')) {
            window.location.href = ACCOUNT === 'individual' ? './dashboard-individual' : './dashboard-corporate'
        }
    }
    updateInputState = (e) => {
        switch (e.target.name) {
            case "userEmail": this.setState({ userEmail: { value: e.target.value, err: '' }, userPassword: { value: this.state.userPassword.value, err: '' }, formReady: true }); break;
            case "userPassword": this.setState({ userEmail: { value: this.state.userEmail.value, err: '' }, userPassword: { value: e.target.value, err: '' }, formReady: true }); break;
            case "confirmPassword": this.setState({ confirmPassword: { value: e.target.value, err: '' }, formReady: true }); break;
            case "otp": this.setState({ otp: { value: e.target.value, err: '' }, formReady: true }); break;
            case "account": this.setState({ membership: document.querySelector('input[name = "account"]:checked').value, formReady: true }); break;
            default: break
        }
    }

    loginSubmit = () => {
        let email = this.state.userEmail.value
        let password = this.state.userPassword.value
        let subCode = this.state.subCode
        let account_type = this.state.membership
        if (!this.state.autoAuth && isInputEmpty(email)) {
            this.setState({
                userEmail: { value: this.state.userEmail.value, err: 'Email Id Cannot Be Empty' },
                formReady: false
            })
        }
        if (!this.state.autoAuth && isInputEmpty(password)) {
            this.setState({
                userPassword: { value: this.state.userPassword.value, err: 'Password Cannot Be Empty' },
                formReady: false
            })
        }
        setTimeout(() => {
            if (this.state.formReady) {
                let payload = this.state.autoAuth ? {
                    authorization: subCode
                } : {
                        email: email,
                        password: password,
                        account_type: account_type
                    }
                postCall(LOGIN, payload, { sfn: this.successLogin, efn: this.loginError })
            }
        }, 0)
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
        setTimeout(() => { window.location.href = account === 'individual' ? './dashboard-individual' : './dashboard-corporate' }, 500)
    }

    loginError = (errorCode) => {
        if (errorCode === 401) {
            this.setState({
                userEmail: { value: this.state.userEmail.value, err: 'Either Email Id is Incorrect' },
                userPassword: { value: this.state.userPassword.value, err: 'Or Password is Incorrect' },
                formReady: false
            })
        }
        if (errorCode === 503) {
            toast.error("Server failed to respond. Please try again later.")
        }
        if (errorCode === 400) {
            toast.error("Company's limit for adding members is full. Kindly contact your admin.")
            // this.setState({
            //     otp: { value: this.state.otp.value, err: "Company's limit for adding members is full. Kindly contact your admin" },
            //     formReady: false
            // })
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

    enterPressed = (e) => {
        if (e.which === 13 || e.keyCode === 13) {
            this.loginSubmit.call()
        }
    }

    forgotPassword = () => {
        if (isInputEmpty(this.state.userEmail.value.trim())) {
            this.setState({ userEmail: { value: this.state.userEmail.value.trim(), err: 'email cannot be empty' } })
        }
        else if (!emailInFormat(this.state.userEmail.value.trim())) {
            this.setState({ userEmail: { value: this.state.userEmail.value.trim(), err: 'invalid email format' } })
        }
        else {
            let payload = {
                email: this.state.userEmail.value.trim()
            }
            getCall(FORGOT_PASSWORD_OTP, { params: payload }, { sfn: this.onOTPsent, efn: this.loginError })
        }
    }

    onOTPsent = () => {
        toast.success('An OTP has been sent to your registered email. Use it to reset password')
        this.setState({ newPassView: true, forgotPassView: false })
    }

    resetPassword = () => {
        if (!passwordInFormat(this.state.userPassword.value)) {
            this.setState({ userPassword: { value: this.state.userPassword.value, err: 'invalid password format' } })
        } else if (this.state.userPassword.value !== this.state.confirmPassword.value) {
            this.setState({ confirmPassword: { value: this.state.confirmPassword.value, err: 'passwords donot match' } })
        } else if (isInputEmpty(this.state.otp.value)) {
            this.setState({ otp: { value: this.state.otp.value, err: 'OTP cannot be empty' } })
        }
        else {
            let payload = {
                email: this.state.userEmail.value.trim(),
                account_type: this.state.membership,
                new_password: this.state.userPassword.value,
                otp: this.state.otp.value
            }
            putCall(FORGOT_PASSWORD_CHANGE, payload, { sfn: this.passwordUpdated, efn: this.loginError })
        }
    }

    passwordUpdated = () => {
        toast.success('Password reset successfull. Kindly login again')
        this.setState({ newPassView: false, loginView: true, userPassword: '' })
    }

    render() {
        return (
            <div className="auth-BG">
                {this.state.isLoading && <Loader />}
                <div className="auth-box text-center">
                    <Link to='/'><img src={require("../../../images/icons/logo.png")} alt="" /></Link><hr />
                    {this.state.loginView && <form>
                        {!this.state.autoAuth && this.state.membership === 'individual' &&
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
                            </>
                        }
                        {!this.state.autoAuth && <div className="form-unit">
                            <Radio name="account" content="Individual" value="individual" selected={this.state.membership === 'individual'} onChange={this.updateInputState} />
                            <Radio name="account" content="Corporate" value="corporate" selected={this.state.membership === 'corporate'} onChange={this.updateInputState} />
                        </div>}
                        {!this.state.autoAuth && <div className="form-unit">
                            <input type="text" name="userEmail" className={this.state.userEmail.err === '' ? "" : "error-input"} onChange={this.updateInputState} onKeyPress={this.enterPressed} value={this.state.userEmail.value} placeholder="Enter your email id" />
                            {this.state.userEmail.err !== '' && <div className="error-info">{this.state.userEmail.err}</div>}
                        </div>}
                        {!this.state.autoAuth && <div className="form-unit">
                            <input type="password" name="userPassword" className={this.state.userPassword.err === '' ? "" : "error-input"} onChange={this.updateInputState} onKeyPress={this.enterPressed} value={this.state.userPassword.value} placeholder="********" />
                            {this.state.userPassword.err !== '' && <div className="error-info">{this.state.userPassword.err}</div>}
                        </div>}
                        <div className="form-unit">
                            <button className="btn-submit" type="button" name="login" onClick={this.loginSubmit}>{this.state.autoAuth ? "P R O C E E D" : "S U B M I T"}</button>
                        </div>
                        <div className="form-unit">
                            <Link to="/signup"><p className="sub-links">Not yet registered? <span>SignUp</span></p></Link>
                            <p className="sub-links">Forgot password? <span onClick={() => this.setState({ forgotPassView: true, loginView: false })}>Reset</span></p>
                        </div>
                    </form>}
                    {this.state.forgotPassView && <form>
                        <div className="form-unit">
                            <input onKeyPress={(e) => { if (e.which === 13 || e.keyCode === 13) { this.forgotPassword.call() } }} type="text" name="userEmail" className={this.state.userEmail.err === '' ? "" : "error-input"} onChange={this.updateInputState} value={this.state.userEmail.value} placeholder="Enter registered email id" />
                            {this.state.userEmail.err !== '' && <div className="error-info">{this.state.userEmail.err}</div>}
                        </div>
                        <div className="form-unit">
                            <button className="btn-submit" type="button" name="login" onClick={this.forgotPassword}>S U B M I T</button>
                        </div>
                    </form>}
                    {this.state.newPassView && <form>
                        <div className="form-unit">
                            <input onKeyPress={(e) => { if (e.which === 13 || e.keyCode === 13) { this.resetPassword.call() } }} type="text" name="otp" className={this.state.otp.err === '' ? "" : "error-input"} onChange={this.updateInputState} value={this.state.otp.value} placeholder="OTP sent to your email" autoComplete="off"/>
                            {this.state.otp.err !== '' && <div className="error-info">{this.state.otp.err} </div>}
                        </div>
                        <div className="form-unit">
                            <input onKeyPress={(e) => { if (e.which === 13 || e.keyCode === 13) { this.resetPassword.call() } }} type="password" name="userPassword" className={this.state.userPassword.err === '' ? "" : "error-input"} onChange={this.updateInputState} value={this.state.userPassword.value} placeholder="Choose Password" />
                            {this.state.userPassword.err !== '' && <div className="error-info">{this.state.userPassword.err} </div>}
                        </div>
                        <div className="form-unit">
                            <input onKeyPress={(e) => { if (e.which === 13 || e.keyCode === 13) { this.resetPassword.call() } }} type="password" name="confirmPassword" className={this.state.confirmPassword.err === '' ? "" : "error-input"} onChange={this.updateInputState} value={this.state.confirmPassword.value} placeholder="Confirm Password" />
                            {this.state.confirmPassword.err !== '' && <div className="error-info">{this.state.confirmPassword.err}</div>}
                        </div>
                        <div className="password-rules">
                            <p className={(/[a-z]/).test(this.state.userPassword.value) ? 'success' : ''}><span className="fa fa-check"></span> At-least one Alphabet in Lowercase</p>
                            <p className={(/[A-Z]/).test(this.state.userPassword.value) ? 'success' : ''}><span className="fa fa-check"></span> At-least one Alphabet in Uppercase</p>
                            <p className={(/[0-9]/).test(this.state.userPassword.value) ? 'success' : ''}><span className="fa fa-check"></span> At-least one Number (0 - 9)</p>
                            <p className={(/[!@#$%^&*()_+]/).test(this.state.userPassword.value) ? 'success' : ''}><span className="fa fa-check"></span> At-least one Special character</p>
                            <p className={(this.state.userPassword.value.length > 7) ? 'success' : ''}><span className="fa fa-check"></span> Minimum length of 8 character</p>
                        </div>
                        <div className="form-unit">
                            <button className="btn-submit" type="button" name="login" onClick={this.resetPassword}>S U B M I T</button>
                        </div>
                    </form>}
                </div>
            </div>
        )
    }
}

export default SignIn