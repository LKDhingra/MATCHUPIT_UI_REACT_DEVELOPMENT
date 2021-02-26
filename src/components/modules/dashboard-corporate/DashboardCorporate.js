import React from 'react';
import { PROFILE, SWITCH_ACCOUNT, GET_PAYMENT_DETAILS } from '../../../utils/constants';
import store from '../../../redux/store';
import { setCorporateInfo, setPaymentInfo, setProfileInfo, setAccountHolder } from '../../../redux/actions';
import { getCall } from '../../../utils/api.config';
import '../Dashboard.css'
import Profile from './Profile';
import Loader from '../../shared/Loader';
import SignIn from '../authenticate/SignIn'
import { toast } from 'react-toastify';
import Settings from './Settings';
import Search from './Search';
import SearchInd from "../dashboard-individual/Search";
import { connect } from 'react-redux';
import Communities from '../communities/Communities';
import Messenger from '../messenger/Messenger';
const axios = require("axios");

const mapStateToProps = state => {
  return state
};

class ConnectedDashboardCorporate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: "profile",
      isLoading: true,
      unAuthorized: false,
      stockValue: null,
      stockChange: null,
      stockCurrency: "",
      searchCategory: "individual",
    };
  }
  componentDidMount = () => {
    getCall(PROFILE, {}, { sfn: this.postProfileFetch, efn: this.errorProfileFetch })
    getCall(GET_PAYMENT_DETAILS, {}, { sfn: this.postPayDetailsFetch, efn: ()=>toast.error("Server failed to respond. Please try again later.") })
    this.setState({selectedTab:this.props.match.params.tab || 'profile'})
  }
  postPayDetailsFetch=(data)=>{
    store.dispatch(setPaymentInfo(data.response))
  }
  logingToggle = () => {
    this.setState({ showLogin: !this.state.showLogin })
  }
  postProfileFetch = (data) => {
    if (sessionStorage.getItem('account') === 'corporate') {
      store.dispatch(setCorporateInfo(data.response.basicDetails))
      store.dispatch(setProfileInfo(data.response.profile))
      store.dispatch(setAccountHolder(data.response.accountHolder))
      this.setState({ isLoading: false, unAuthorized: false })
    } else {
      this.setState({ unAuthorized: true })
    }
    axios({
      "method":"GET",
      "url":`https://yahoo-finance15.p.rapidapi.com/api/yahoo/qu/quote/`+ this.props.basicInfo.ticker,
      "headers":{
      "content-type":"application/octet-stream",
      "x-rapidapi-host":"yahoo-finance15.p.rapidapi.com",
      "x-rapidapi-key":"b83ce79a26mshacecbbc51423dcap1bc1d8jsn9f1747709316",
      "useQueryString":true
      }
      })
      .then((res)=>{
        this.setState({stockValue: res.data[0].ask, stockChange: res.data[0].regularMarketChange, stockCurrency: res.data[0].currency})
      })
      .catch((err)=>{
        console.log(err)
      })
  }
  errorProfileFetch = (errorCode) => {
    if (errorCode === 401) {
      this.setState({ isLoading: false, unAuthorized: true })
    }
    if (errorCode === 503) {
      this.setState({ isLoading: false, unAuthorized: true })
      toast.error("Server failed to respond. Please try again later.")
    }
  }
  switchTab = (e) => {
    window.location.href = '/dashboard-corporate/'+e.currentTarget.id
  }
  goHomePage = () => {
    sessionStorage.clear();
    window.location.href = '/'
  }
  joinCommunity = () => {
    window.location.href = '/dashboard-corporate/communities'
  }
  goToMessenger = () => {
    window.location.href = '/dashboard-corporate/messenger'
  }
  switchAccount=()=>{
    getCall(SWITCH_ACCOUNT,{},{sfn:this.afterSwitch, err: ()=>toast.error("Server failed to respond. Please try again later.")})
  }
  afterSwitch=(data)=>{
    sessionStorage.setItem('account','individual')
    sessionStorage.setItem('userToken',data.response.token)
    window.location.href="/dashboard-individual"
  }
  
  updateSeachCategory = (data) => {
    this.setState({ searchCategory: data })
  } 
  render() {
    return (
      <div id="Dashboard" className="container-fluid">
        {this.state.unAuthorized ? <div className="row"><SignIn close={this.goHomePage} /></div> :
          <span>
            {this.state.isLoading && <Loader />}
            <div id="Topnav" className="row">
              <div className="col-xs-6">
                <img onClick={()=>window.location.href = '/dashboard-corporate'} style={{cursor:'pointer'}} src={require('../../../images/icons/logo.png')} alt="" />
              </div>
              <div className="col-xs-6 text-right">
                {!this.props.accountHolder.is_master && <button className="btn-general" onClick={this.switchAccount}><span className="fa fa-sign-out"></span> Individual</button>}
                <button className="btn-general square" onClick={this.goHomePage}>Logout</button>
              </div>
            </div>
            <div id="MainContainer" className="row">
              <div id="DataContainer">
                <div className="icon-tabs">
                  <ul>
                    <li data-toggle="tooltip" title="Dashboard" id="profile" onClick={this.switchTab}><span className="fa fa-home fa-lg"></span>{this.state.selectedTab === "profile" && <span className="triangle-selected" style={{ right: '-1px' }}></span>}</li>
                    <li data-toggle="tooltip" title="Search" className={this.props.basicInfo.is_active?'':'noDropEvent'} id="search" onClick={this.switchTab}><span className="fa fa-search"></span>{this.state.selectedTab === "search" && <span className="triangle-selected" style={{ right: '-1px' }}></span>}</li>
                    <li data-toggle="tooltip" title="Communities" className={this.props.basicInfo.is_active?'':'noDropEvent'} id="communities" onClick={this.switchTab}><span className="fa fa-users"></span>{this.state.selectedTab === "communities" && <span className="triangle-selected" style={{ right: '-1px' }}></span>}</li>
                    <li data-toggle="tooltip" title="Message" className={this.props.basicInfo.is_active?'':'noDropEvent'} id="messenger" onClick={this.switchTab}><span className="fa fa-commenting"></span>{this.state.selectedTab === "messenger" && <span className="triangle-selected"></span>}</li>
                    {this.props.accountHolder.is_master?<li data-toggle="tooltip" title="Settings" id="settings" onClick={this.switchTab}><span className="fa fa-cogs"></span>{this.state.selectedTab === "settings" && <span className="triangle-selected" style={{ right: '-1px' }}></span>}</li>:null}
                  </ul>
                </div>
                <div className="data-tabs">
                  {this.state.selectedTab === "profile" && <Profile joinCommunity={this.joinCommunity} goToMessenger={this.goToMessenger} stockValue={this.state.stockValue} stockChange={this.state.stockChange} stockCurrency={this.state.stockCurrency}/>}
                  {this.state.selectedTab === "search" ? this.state.searchCategory === "individual" ? 
                  <Search categoryType = {this.state.searchCategory} itemSelected = {this.updateSeachCategory} /> : 
                  <SearchInd categoryType = {this.state.searchCategory} itemSelected = {this.updateSeachCategory} /> : ""}
                  {this.state.selectedTab === "communities" && <Communities type='corporate'/>}
                  {this.state.selectedTab === "messenger" && <Messenger />}
                  {this.state.selectedTab === "settings" && <Settings basicInfo={this.props.basicInfo} accountHolder={this.props.accountHolder} payment={this.props.payment}/>}
                </div>
              </div>
            </div>
          </span>
        }
      </div>
    )
  }
}

const DashboardCorporate = connect(mapStateToProps)(ConnectedDashboardCorporate);
export default DashboardCorporate;