import React from 'react';
import { connect } from 'react-redux';
import './ProfilePage.css'
import { DUMMY_LOGO } from '../../../utils/constants';
import ReactPlayer from 'react-player';
import MoreToggle from '../../shared/MoreToggle';

const axios = require("axios");
const mapStateToProps = state => {
    return state
};

class ConnectedProfilePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            stockValue: null,
            stockChange: null,
            stockCurrency: ''
        }
    }
    onOpenModal = () => {
        this.setState({ open: true });
    };
    onCloseModal = () => {
        this.setState({ open: false });
    };
    componentDidMount(){
        axios({
        "method":"GET",
        "url":`https://yahoo-finance15.p.rapidapi.com/api/yahoo/qu/quote/`+ this.props.user.basicDetails.ticker,
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
    render() {
        const { basicDetails,profile } = this.props.user;
        let coverPicStatus = false;

        if ('media' in profile === true && 'coverPic' in profile.media === true) {
            coverPicStatus = true;
        } else {
            coverPicStatus = false;
        }
        
        return (
                <div id="Profile">
                    <div className="row">
                    <div className="col-md-12">
                        {coverPicStatus === true ?
                            <img src={profile.media.coverPic} className="coverphoto" />
                            :
                            <img src={require("../../../images/banners/cover-photo.png")} className="coverphoto" />
                        }                        
                    </div>
                </div>
                <div className="profile-gen b-y-radius-0" style={{background:'#ccc'}}>
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="row">
                                <div className="col-md-12 pb-3">
                                    <div className="profile-pic-holder-corp corp-logo-margin">
                                        <img src={basicDetails.logo ? basicDetails.logo : DUMMY_LOGO} className="fit-layout" alt="" />
                                    </div>
                                </div>
                                <div className="col-sm-8 pb-3">
                                    <ul className="profile-pic-text-holder">
                                        <li>
                                            <div className="profile-text-holder p-0">
                                                <p className="user-name">{`${basicDetails.name}` || 'Guest'}</p>
                                                <p className="org-name"><a rel="noopener noreferrer" href={`http://${basicDetails.website}`} target="_blank">{basicDetails.website}</a></p>
                                                <p>
                                                    <span className="sub-text">{basicDetails.dial_code} {basicDetails.telephone}</span>
                                                </p>
                                                <p>
                                                    <span className="sub-text"><strong>{`${basicDetails.city}, ${basicDetails.country_name}`}</strong></span>
                                                </p>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                                <div className="col-sm-4">
                                    <p>
                                        <span className="sub-text">No of Employees: </span><span className="followers">{basicDetails.employee_count}</span>
                                    </p>
                                    <p>
                                        <span className="sub-text">{basicDetails.type} Organization</span>
                                    </p>
                                    <p>
                                        <span className="sub-text">Currently Hiring: <span className="avail-hire" style={{ background: basicDetails.currently_hiring ? 'green' : '#C40223' }}>{basicDetails.currently_hiring ? 'YES' : 'NO'}</span></span>
                                    </p>
                                    {basicDetails.ticker?
                                    <span>
                                        <p>
                                            <span className="sub-text"><strong>{basicDetails.ticker}</strong></span>
                                        </p>
                                        <p>
                                            <span className="sub-text">{Number(this.state.stockValue).toFixed(3)} {this.state.stockCurrency} <span>{Number(this.state.stockChange)<0?<span style={{color:"#FF0000"}}><span className="fa fa-caret-down"></span> ({Number(this.state.stockChange).toFixed(3)})</span>:<span style={{color:"#27C400"}}><span className="fa fa-caret-up"></span> ({Number(this.state.stockChange).toFixed(3)})</span>}</span></span>
                                        </p>
                                    </span>
                                    :
                                    null
                                    }
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="bold" style={{ marginTop: '10px' }}>About</div>
                                    {basicDetails.culture ? <MoreToggle text={basicDetails.culture} split={300} /> : "Not Available"}
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-xs-12" style={{ minHeight: '75px' }}>
                                    <hr className="custom-line" />
                                    {(profile.social_links&&profile.social_links.facebook !== '' || profile.social_links&&profile.social_links.twitter !== '' || profile.social_links&&profile.social_links.linkedin !== '' || profile.social_links&&profile.social_links.instagram !== '' || profile.social_links&&profile.social_links.pinterest !== '' || profile.social_links&&profile.social_links.github !== '') &&
                                        <span className="bold">Social Handles</span>}
                                    <ul className="social-block">
                                        {profile.social_links&&profile.social_links.facebook !== '' && <li><a rel="noopener noreferrer" href={`https://${profile.social_links&&profile.social_links.facebook}`} target="_blank"><span className="fa fa-facebook"></span></a></li>}
                                        {profile.social_links&&profile.social_links.twitter !== '' && <li><a rel="noopener noreferrer" href={`https://${profile.social_links&&profile.social_links.twitter}`} target="_blank"><span className="fa fa-twitter"></span></a></li>}
                                        {profile.social_links&&profile.social_links.linkedin !== '' && <li><a rel="noopener noreferrer" href={`https://${profile.social_links&&profile.social_links.linkedin}`} target="_blank"><span className="fa fa-linkedin"></span></a></li>}
                                        {profile.social_links&&profile.social_links.instagram !== '' && <li><a rel="noopener noreferrer" href={`https://${profile.social_links&&profile.social_links.instagram}`} target="_blank"><span className="fa fa-instagram"></span></a></li>}
                                        {profile.social_links&&profile.social_links.pinterest !== '' && <li><a rel="noopener noreferrer" href={`https://${profile.social_links&&profile.social_links.pinterest}`} target="_blank"><span className="fa fa-pinterest"></span></a></li>}
                                        {profile.social_links&&profile.social_links.github !== '' && <li><a rel="noopener noreferrer" href={`https://${profile.social_links&&profile.social_links.github}`} target="_blank"><span className="fa fa-github"></span></a></li>}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="profile-status">
                    <div className="row">
                        <div className="col-sm-4">
                            <div className="matchup-secs">
                                <p className="bold">Company Introduction</p>
                                {basicDetails.video_intro ? <ReactPlayer url={basicDetails.videoshot} width='100%' height={270} controls /> : <img style={{ height: '87%' }} src={require('../../../images/banners/no_video.png')} alt="" className="fit-layout" />}
                            </div>
                        </div>
                        <div className="col-sm-4">
                            <div className="matchup-secs">
                                <p className="bold">Tools / Technologies / Methods Used</p>
                                <p className="sub-text">{basicDetails.current_road_map && basicDetails.current_road_map !== '' ? basicDetails.current_road_map : "Not Available"}</p>
                            </div>
                        </div>
                        <div className="col-sm-4">
                            <div className="matchup-secs">
                                <p className="bold">Latest News</p>
                                <p className="sub-text">{basicDetails.future_road_map && basicDetails.future_road_map !== '' ? basicDetails.future_road_map : "Not Available"}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const ProfilePage = connect(mapStateToProps)(ConnectedProfilePage);
export default ProfilePage;