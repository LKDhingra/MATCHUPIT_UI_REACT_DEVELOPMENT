import React from 'react';
import { PROFILE, SALARY_MEAN, SWITCH_ACCOUNT, GET_PAYMENT_DETAILS } from '../../../utils/constants';
import store from '../../../redux/store';
import { setBasicInfo, setProfileInfo, setProfileCompletion, setSalaryMean, setPaymentInfo, setIsMember } from '../../../redux/actions';
import { getCall } from '../../../utils/api.config';
import '../Dashboard.css'
import Profile from './Profile';
import ResumeBuild from './ResumeBuild';
import Loader from '../../shared/Loader';
import SignIn from '../authenticate/SignIn'
import { toast } from 'react-toastify';
import Questionnaire from '../questionnaire/Questionnaire';
import Settings from './Settings';
import { connect } from 'react-redux';
import Messenger from '../messenger/Messenger'
import Communities from '../communities/Communities';
import Search from './Search';
import SearchInd from "../dashboard-corporate/Search";

const mapStateToProps = state => {
  return state
};

class ConnectedDashboardIndividual extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      unAuthorized: false,
      questionnaire: false,
      registeredEmail: "",
      selectedTab: this.props.match.params.tab || "profile",
      searchCategory: "individual",
    };
  }
  componentDidMount = () => {
    getCall(PROFILE, {}, { sfn: this.postProfileFetch, efn: this.errorProfileFetch })
    getCall(SALARY_MEAN, {}, { sfn: this.postSalaryFetch, efn: this.errorProfileFetch })
    getCall(GET_PAYMENT_DETAILS, {}, { sfn: this.postPayDetailsFetch, efn: ()=>toast.error("Server failed to respond. Please try again later.") })
    this.setState({selectedTab:this.props.match.params.tab||'profile'})
  }
  postPayDetailsFetch=(data)=>{
    store.dispatch(setPaymentInfo(data.response))
  }
  postSalaryFetch = (data) => {
    store.dispatch(setSalaryMean(data.msg))
  }
  logingToggle = () => {
    this.setState({ showLogin: !this.state.showLogin })
  }
  postProfileFetch = (data) => {
    if (data.response.basicDetails && data.response.basicDetails.account_type === 'individual') {
      store.dispatch(setBasicInfo(data.response.basicDetails))
      store.dispatch(setProfileInfo(data.response.profile))
      store.dispatch(setProfileCompletion(data.response.profileCompletionPercentage))
      store.dispatch(setIsMember(data.response.is_member))
      this.setState({ isLoading: false, unAuthorized: false, registeredEmail: data.response.basicDetails.email })
      setTimeout(() => {
        const profileBuilder = JSON.parse(
          sessionStorage.getItem("profileBuilder")
        );
        
        if (this.state.selectedTab === 'profile' && data.response.profileCompletionPercentage < 50 && profileBuilder.questionnaire === true) {
          this.setState({ questionnaire: true });
        }
      }, 2000)
    } else {
      this.setState({ unAuthorized: true })
    }
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
    window.location.href = '/dashboard-individual/'+e.currentTarget.id
  }
  goHomePage = () => {
    sessionStorage.clear();
    window.location.href = '/'
  }
  toggleChatBox = () => {
    const profileBuilder = JSON.parse(sessionStorage.getItem("profileBuilder"));
    if (profileBuilder.questionnaire) {
      profileBuilder["questionnaire"] = false;
    }
    sessionStorage.setItem("profileBuilder", JSON.stringify(profileBuilder));
    this.setState({ questionnaire: !this.state.questionnaire });
  }
  joinCommunity = () => {
    window.location.href = '/dashboard-individual/communities'
  }
  goToMessenger = () => {
    window.location.href = '/dashboard-individual/messenger'
  }
  switchAccount=()=>{
    getCall(SWITCH_ACCOUNT,{},{sfn:this.afterSwitch, efn: ()=>toast.error("Server failed to respond. Please try again later.")})
  }
  afterSwitch=(data)=>{
    sessionStorage.setItem('account','corporate')
    sessionStorage.setItem('userToken',data.response.token)
    window.location.href="/dashboard-corporate"
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
                <img onClick={()=>window.location.href = '/dashboard-individual'} style={{cursor:'pointer'}} src={require('../../../images/icons/logo.png')} alt="" />
              </div>
              <div className="col-xs-6 text-right">
                {this.props.is_member && <button className="btn-general" onClick={this.switchAccount}><span className="fa fa-sign-out"></span> Corporate</button>}
                <button className="btn-general square" onClick={this.goHomePage}>Logout</button>
              </div>
            </div>
            <div id="MainContainer" className="row">
              <div id="DataContainer">
                <div className="icon-tabs">
                  <ul>
                    <li data-toggle="tooltip" title="Dashboard" id="profile" onClick={this.switchTab}><span className="fa fa-home fa-lg"></span>{this.state.selectedTab === "profile" && <span className="triangle-selected"></span>}</li>
                    <li data-toggle="tooltip" title="Resume Builder" className={this.props.basicInfo.is_active?'':'noDropEvent'} id="resume" onClick={this.switchTab}><span className="fa fa-id-card-o"></span>{this.state.selectedTab === "resume" && <span className="triangle-selected"></span>}</li>
                    <li data-toggle="tooltip" title="Search" className={this.props.basicInfo.is_active?'':'noDropEvent'} id="search" onClick={this.switchTab}><span className="fa fa-search"></span>{this.state.selectedTab === "search" && <span className="triangle-selected" style={{ right: '-1px' }}></span>}</li>
                    <li data-toggle="tooltip" title="Communities" className={this.props.basicInfo.is_active?'':'noDropEvent'} id="communities" onClick={this.switchTab}><span className="fa fa-users"></span>{this.state.selectedTab === "communities" && <span className="triangle-selected"></span>}</li>
                    <li data-toggle="tooltip" title="Message" className={this.props.basicInfo.is_active?'':'noDropEvent'} id="messenger" onClick={this.switchTab}><span className="fa fa-commenting"></span>{this.state.selectedTab === "messenger" && <span className="triangle-selected"></span>}</li>
                    <li data-toggle="tooltip" title="Settings" id="settings" onClick={this.switchTab}><span className="fa fa-cogs"></span>{this.state.selectedTab === "settings" && <span className="triangle-selected"></span>}</li>
                  </ul>
                </div>
                <div className="data-tabs">
                  {this.state.selectedTab === "profile" && <Profile joinCommunity={this.joinCommunity} goToMessenger={this.goToMessenger} />}
                  {this.state.selectedTab === "resume" && <ResumeBuild />}
                  {this.state.selectedTab === "search" ? this.state.searchCategory === "individual" ? 
                  <SearchInd categoryType = {this.state.searchCategory} itemSelected = {this.updateSeachCategory} /> : 
                  <Search categoryType = {this.state.searchCategory} itemSelected = {this.updateSeachCategory} /> : ""}
                  {this.state.selectedTab === "communities" && <Communities type='individual' userPic={this.props.basicInfo.profile_pic} userName={this.props.basicInfo.first_name+' '+this.props.basicInfo.last_name}/>}
                  {this.state.selectedTab === "messenger" && <Messenger />}
                  {this.state.selectedTab === "settings" && <Settings basicInfo={this.props.basicInfo} payment={this.props.payment}/>}
                </div>
              </div>
            </div>
            {this.state.selectedTab==="profile"?
              this.state.questionnaire ?
                <Questionnaire toggleChatBox={this.toggleChatBox} registeredEmail={this.state.registeredEmail} />
                :
                <div className="ques-min" onClick={this.toggleChatBox}>
                  <span className="chat-head-title">Profile Builder</span><span className="fa fa-angle-up chat-close"></span>
                </div>
            :
            null}
          </span>
        }
      </div>
    )
  }

}

const DashboardIndividual = connect(mapStateToProps)(ConnectedDashboardIndividual);
export default DashboardIndividual;