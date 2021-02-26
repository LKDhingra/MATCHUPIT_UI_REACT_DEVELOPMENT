import React from 'react';
import './Admin.css'
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Dashboard from './Dashboard';
import CommunityOperation from './CommunityOperation';
import { ADMIN_LOGIN } from '../../../utils/constants';
import { isInputEmpty } from '../../../utils/validators';
import { postCall } from '../../../utils/api.config';
import { toast } from 'react-toastify';
import ManagingOperation from './ManagingOperation'
import ExpiringUsers from './ExpiringUsers';

const mapStateToProps = state => {
    return state
};

class ConnectedAdmin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userEmail: { value: '', err: '' },
            userPassword: { value: '', err: '' },
            formReady: false,
            admin: sessionStorage.getItem('admin'),
            selectedTab: 'dashboard'
        }
    }
    componentDidMount = () => {
        this.setState({ selectedTab: this.props.match.params.tab || 'dashboard' })
    }

    loginSubmit = () => {
        let email = this.state.userEmail.value
        let password = this.state.userPassword.value
        if (isInputEmpty(email)) {
            this.setState({
                userEmail: { value: this.state.userEmail.value, err: 'Email Id Cannot Be Empty' },
                formReady: false
            })
        }
        if (isInputEmpty(password)) {
            this.setState({
                userPassword: { value: this.state.userPassword.value, err: 'Password Cannot Be Empty' },
                formReady: false
            })
        }
        setTimeout(() => {
            if (this.state.formReady) {
                let payload = {
                    email: email,
                    password: password
                }
                postCall(ADMIN_LOGIN, payload, { sfn: this.successLogin, efn: this.loginError })
            }
        }, 0)
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
    }

    successLogin = (data) => {
        sessionStorage.setItem("userToken", data.userObj.token)
        sessionStorage.setItem("userId", data.userObj.id)
        sessionStorage.setItem("account", data.userObj.account_type)
        sessionStorage.setItem("admin", true)
        this.setState({ admin: true })
    }

    updateInputState = (e) => {
        switch (e.target.name) {
            case "userEmail": this.setState({ userEmail: { value: e.target.value, err: '' }, userPassword: { value: this.state.userPassword.value, err: '' }, formReady: true }); break;
            case "userPassword": this.setState({ userEmail: { value: this.state.userEmail.value, err: '' }, userPassword: { value: e.target.value, err: '' }, formReady: true }); break;
            default: break
        }
    }

    enterPressed = (e) => {
        if (e.which === 13 || e.keyCode === 13) {
            this.loginSubmit.call()
        }
    }

    logoutAdmin = () => {
        sessionStorage.clear();
        window.location.href = '/'
    }

    switchTab = (e) => {
        window.location.href = '/admin/' + e.currentTarget.id
    }

    render() {
        return (
            <div id="Admin">
                {this.state.admin ? <div>
                    <div id="Topnav" className="">
                        <div className="col-xs-6">
                            <Link to="/"><img src={require('../../../images/icons/logo.png')} alt="" /></Link>
                        </div>
                        <div className="col-xs-6 text-right">
                            <button className="btn-general square" onClick={this.logoutAdmin}>Logout</button>
                        </div>
                    </div>
                    <div id="MainContainer" className="">
                        <div id="DataContainer">
                            <div className="icon-tabs">
                                <ul>
                                    <li id="dashboard" onClick={this.switchTab}><span className="fa fa-dashboard"></span>{this.state.selectedTab === "dashboard" && <span className="triangle-selected" style={{ right: '-1px' }}></span>}</li>
                                    <li id="community" onClick={this.switchTab}><span className="fa fa-users"></span>{this.state.selectedTab === "community" && <span className="triangle-selected" style={{ right: '-1px' }}></span>}</li>
                                    <li id="managing" onClick={this.switchTab}><span className="fa fa-pencil-square-o"></span>{this.state.selectedTab === "managing" && <span className="triangle-selected" style={{ right: '-1px' }}></span>}</li>
                                    <li id="expiringusers" onClick={this.switchTab}><span className="fa fa-calendar-minus-o"></span>{this.state.selectedTab === "expiringusers" && <span className="triangle-selected" style={{ right: '-1px' }}></span>}</li>
                                </ul>
                            </div>
                            <div className="data-tabs">
                                {this.state.selectedTab === "dashboard" && <Dashboard />}
                                {this.state.selectedTab === "community" && <CommunityOperation />}
                                {this.state.selectedTab === "managing" && <ManagingOperation />}
                                {this.state.selectedTab === "expiringusers" && <ExpiringUsers />}
                            </div>
                        </div>
                    </div>
                </div> :
                    <div className="auth-BG">
                        <div className="auth-box text-center">
                            <Link to='/'><img src={require("../../../images/icons/logo.png")} alt="" /></Link><hr />
                            <form>
                                <div className="divider">Admin Login</div>
                                <div className="form-unit">
                                    <input type="text" name="userEmail" className={this.state.userEmail.err === '' ? "" : "error-input"} onChange={this.updateInputState} onKeyPress={this.enterPressed} value={this.state.userEmail.value} placeholder="Enter your email id" />
                                    {this.state.userEmail.err !== '' && <div className="error-info">{this.state.userEmail.err}</div>}
                                </div>
                                <div className="form-unit">
                                    <input type="password" name="userPassword" className={this.state.userPassword.err === '' ? "" : "error-input"} onChange={this.updateInputState} onKeyPress={this.enterPressed} value={this.state.userPassword.value} placeholder="********" />
                                    {this.state.userPassword.err !== '' && <div className="error-info">{this.state.userPassword.err}</div>}
                                </div>
                                <div className="form-unit">
                                    <button className="btn-submit" type="button" name="login" onClick={this.loginSubmit}>S U B M I T</button>
                                </div>
                            </form>
                        </div>
                    </div>
                }
            </div>
        )
    }
}

const Admin = connect(mapStateToProps)(ConnectedAdmin);
export default Admin;
