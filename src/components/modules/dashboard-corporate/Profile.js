import React from 'react';
import '../Dashboard.css'
import { connect } from "react-redux";
import ProfileEditCorp from '../profileEditCorp/ProfileEditCorp';
import { showFlatForm, setCurrentlyHiring } from '../../../redux/actions';
import store from '../../../redux/store';
import { DUMMY_LOGO, PROFILE } from '../../../utils/constants';
import ToggleSwitch from '../../shared/ToggleSwitch';
import { putCall } from '../../../utils/api.config';
import MoreToggle from '../../shared/MoreToggle';
import ReactPlayer from 'react-player';

const mapBasicInfoToProps = state => {
    return state
};

const ConnectedProfile = (state) => {
    const showForm = () => {
        store.dispatch(showFlatForm(true))
    }

    const { name, email, telephone, logo, video_intro, website, ticker,
        culture, employee_count, type, dial_code, city, country_name,
        current_road_map, future_road_map } = state.basicInfo
    const { address_details } = state.profile;
    
    
    let coverPicStatus = false;

    if ("media" in state.profile === true && "coverPic" in state.profile.media === true) {
      coverPicStatus = true;
    } else {
      coverPicStatus = false;
    }

    const { stockValue, stockChange, stockCurrency } = state
    if (email && !name) {
        showForm.call()
    }
    let otherAddresses = []
    let oaLength = address_details.countryO.length
    for (let i = 0; i < oaLength; i++) {
        otherAddresses.push({
            countryO: address_details.countryO[i],
            stateO: address_details.stateO[i],
            cityO: address_details.cityO[i],
            addressO: address_details.addressO[i],
            zipcodeO: address_details.zipcodeO[i]
        })
    }
    const toggleHiring = () => {
        let changedState = !state.basicInfo.currently_hiring
        store.dispatch(setCurrentlyHiring(changedState))
        putCall(PROFILE, { basic_details: { currently_hiring: changedState } })
    }
    return (
        <div id="Profile">
            {state.editingProfile && <ProfileEditCorp state={state} />}
            <div className="row">
                <div className="col-md-12">
                    {coverPicStatus === true ?
                        <img src={state.profile.media.coverPic} className="coverphoto" />
                        :
                        <img src={require("../../../images/banners/cover-photo.png")} className="coverphoto" />
                    }
                </div>
            </div>
            <div className="profile-gen b-y-radius-0">
                <div className="row">
                    <div className="col-md-12 pb-3">
                        <div className="profile-pic-holder-corp corp-logo-margin">
                            <img src={logo ? logo : DUMMY_LOGO} className="fit-layout" alt="" />
                        </div>
                    </div>
                    <div className="col-sm-9">
                        <div className="row pb-3">
                            <div className="col-sm-8">
                                <ul className="profile-pic-text-holder">
                                    <li>
                                        <div className="profile-text-holder p-0">
                                            <p className="user-name">{`${name}` || 'Guest'}</p>
                                            <p className="org-name"><a rel="noopener noreferrer" href={`http://${website}`} target="_blank">{website}</a></p>
                                            <p>
                                                <span className="sub-text">{dial_code} {telephone}</span>
                                            </p>
                                            <p>
                                                <span className="sub-text"><strong>{`${city}, ${country_name}`}</strong></span>
                                            </p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="col-sm-4">
                                <p>
                                    <span className="sub-text">No of Employees: </span><span className="followers">{employee_count}</span>
                                </p>
                                <p>
                                    <span className="sub-text">{type} Organization</span>
                                </p>
                                {ticker ?
                                <span>
                                    <p>
                                        <span className="sub-text"><strong>{ticker}</strong></span>
                                    </p>
                                    <p>
                                        <span className="sub-text">{Number(stockValue).toFixed(3)} {stockCurrency} <span>{Number(stockChange)<0?<span style={{color:"#FF0000"}}><span className="fa fa-caret-down"></span> ({Number(stockChange).toFixed(3)})</span>:<span style={{color:"#27C400"}}><span className="fa fa-caret-up"></span> ({Number(stockChange).toFixed(3)})</span>}</span></span>
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
                                {culture?<MoreToggle text={culture}/>:"Not Available"}
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-3">
                        <div className="quick-links">
                            <ul>
                                <li><button type="button" disabled={state.accountHolder && !state.accountHolder.is_master} className="btn-quick-links" onClick={showForm.bind()}><span className="fa fa-pencil"></span> Edit/Update Profile</button></li>
                            </ul>
                            {!state.basicInfo.is_active&&<p style={{fontSize:'0.9em',color:'#C40223'}}>Note* Your account was deactivated. To gain full access go to settings and reactivate.</p>}
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12" style={{ minHeight: '75px' }}>
                        <hr className="custom-line" />
                        {(state.profile.social_links.facebook !== '' || state.profile.social_links.twitter !== '' || state.profile.social_links.linkedin !== '' || state.profile.social_links.instagram !== '' || state.profile.social_links.pinterest !== '' || state.profile.social_links.github !== '') &&
                            <span className="bold">Social Handles</span>}
                        <ul className="social-block">
                            {state.profile.social_links.facebook !== '' && <li><a rel="noopener noreferrer" href={`https://facebook.com/${state.profile.social_links.facebook}`} target="_blank"><span className="fa fa-facebook"></span></a></li>}
                            {state.profile.social_links.twitter !== '' && <li><a rel="noopener noreferrer" href={`https://twitter.com/${state.profile.social_links.twitter}`} target="_blank"><span className="fa fa-twitter"></span></a></li>}
                            {state.profile.social_links.linkedin !== '' && <li><a rel="noopener noreferrer" href={`https://linkedin.com/in/${state.profile.social_links.linkedin}`} target="_blank"><span className="fa fa-linkedin"></span></a></li>}
                            {state.profile.social_links.instagram !== '' && <li><a rel="noopener noreferrer" href={`https://instagram.com/${state.profile.social_links.instagram}`} target="_blank"><span className="fa fa-instagram"></span></a></li>}
                            {state.profile.social_links.pinterest !== '' && <li><a rel="noopener noreferrer" href={`https://pinterest.com/${state.profile.social_links.pinterest}`} target="_blank"><span className="fa fa-pinterest"></span></a></li>}
                            {state.profile.social_links.github !== '' && <li><a rel="noopener noreferrer" href={`https://github.com/${state.profile.social_links.github}`} target="_blank"><span className="fa fa-github"></span></a></li>}
                        </ul>
                    </div>
                </div>
                {state.basicInfo.is_active&&
                <div className="hire-switch">
                    <ToggleSwitch checked={state.basicInfo.currently_hiring===undefined?true:state.basicInfo.currently_hiring} title={state.basicInfo.currently_hiring===undefined?"Currently Hiring":state.basicInfo.currently_hiring?"Currently Hiring":"Currently Not Hiring"} onClicked={toggleHiring} />
                </div>
                }
            </div>
            <div className="profile-status">
                <div className="row">
                    <div className="col-sm-4">
                        <div className="matchup-secs">
                            <p className="bold">Company Introduction</p>
                            {video_intro ? video_intro.substring(video_intro.length-3).toLowerCase()==='pdf'?<embed height={258} scrolling={0} className="fit-layout" src={video_intro}></embed> : <ReactPlayer url={video_intro} width='100%' height={270} controls/> : <img style={{ height: '87%' }} src={require('../../../images/banners/no_video.png')} alt="" className="fit-layout" />}
                        </div>
                    </div>
                    <div className="col-sm-4">
                        <div className="matchup-secs">
                            <p className="bold">Tools / Technologies / Methods Used</p>
                            <p className="sub-text">{current_road_map && current_road_map !== '' ? current_road_map : "Not Available"}</p>
                        </div>
                    </div>
                    <div className="col-sm-4">
                        <div className="matchup-secs">
                            <p className="bold">Latest News</p>
                            <p className="sub-text">{future_road_map && future_road_map !== '' ? future_road_map : "Not Available"}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const Profile = connect(mapBasicInfoToProps)(ConnectedProfile);

export default Profile;
