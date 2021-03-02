import React from 'react';
import '../Dashboard.css';
import { connect } from "react-redux";
import ProfileEdit from '../profileEdit/ProfileEdit';
import { showFlatForm, setAvailableHire } from '../../../redux/actions';
import store from '../../../redux/store';
import ToggleSwitch from '../../shared/ToggleSwitch';
import { putCall } from '../../../utils/api.config';
import { PROFILE } from '../../../utils/constants';
import parse from 'html-react-parser';
import ReactPlayer from 'react-player';

const mapBasicInfoToProps = state => {
    return state
};

const ConnectedProfile = (state) => {
    const {
        profile_pic,
        first_name,
        last_name,
        email,
        available_hire,
        is_student,
        dial_code,
        phone,
        citizenship,
        other_country_authorization,
    } = state.basicInfo;
    const {
        work_experience,
        education,
        media,
        social_links,
        board_experience,
        certifications,
        personal_details,
    } = state.profile;
    const showForm = () => {
        store.dispatch(showFlatForm(true))
    }
    let range = 'value not specified'
    let meanPos = 50
    if (state.salary_mean) {
        let minSal = 0
        switch (state.salary_mean.salary_range) {
            case 'r1': minSal = 0; break
            case 'r2': minSal = 500000; break
            case 'r3': minSal = 1000000; break
            case 'r4': minSal = 1500000; break
            case 'r5': minSal = 2000000; break
            case 'r6': minSal = 2500000; break
            default: break
        }
        if (state.salary_mean.meanSalary > state.salary_mean.mySalary) {
            meanPos = meanPos + ((state.salary_mean.meanSalary - state.salary_mean.mySalary) / 20000)
            range = `${(state.salary_mean.mySalary / 1000000).toString().slice(0, 3)}M - ${((state.salary_mean.mySalary / 1000000) + 0.1).toString().slice(0, 3)}M`
        } else if (state.salary_mean.mySalary > state.salary_mean.meanSalary) {
            meanPos = meanPos - (2 * (state.salary_mean.mySalary - state.salary_mean.meanSalary) / 20000)
            range = `${(state.salary_mean.mySalary / 1000000).toString().slice(0, 3)}M - ${((state.salary_mean.mySalary / 1000000) + 0.1).toString().slice(0, 3)}M`
        }
        if (meanPos < 0) {
            meanPos = 0
        } else if (meanPos > 100) {
            meanPos = 100
        }
    }
    const toggleHiring = () => {
        let changedState = !available_hire
        store.dispatch(setAvailableHire(changedState))
        putCall(PROFILE, { basic_details: { available_hire: changedState } })
    }
    let skillsPShow = []
    if (state.profile && state.profile.work_experience && state.profile.work_experience.skillsP && state.profile.work_experience.skillsP.length) {
        let ski = []
        for (let i = 0; i < state.profile.work_experience.skillsP.length; i++) {
            ski = [...new Set([...ski, ...state.profile.work_experience.skillsP[i]])]
        }
        if (ski.length > 5) {
            skillsPShow = ski.splice(0, 5)
        }
        else {
            skillsPShow = ski
        }
    }
    let skillsOShow = []
    if (state.profile && state.profile.work_experience && state.profile.work_experience.skillsO && state.profile.work_experience.skillsO.length) {
        let ski = []
        for (let i = 0; i < state.profile.work_experience.skillsO.length; i++) {
            ski = [...new Set([...ski, ...state.profile.work_experience.skillsO[i]])]
        }
        if (ski.length > 10) {
            skillsOShow = ski.splice(0, 10)
        }
        else {
            skillsOShow = ski
        }
    }
    return (
        <div id="Profile">
            {state.editingProfile && <ProfileEdit state={state} />}
            <div className="profile-gen">
                <div className="row">
                    <div className="col-sm-9">
                        <div className="row">
                            <div className="col-sm-8">
                                <ul>
                                    <li>
                                        <div className="profile-pic-holder rounded">
                                            <img src={profile_pic || require('../../../images/icons/placeholder-profile.jpg')} className="fit-layout rounded" alt="" />
                                        </div>
                                    </li>
                                    <li>
                                        <div className="profile-text-holder">
                                            <p className="user-name">{`${first_name || 'Guest User'} ${last_name || ''}`}</p>
                                            <p className="org-name">{email}<br />{dial_code} {phone}</p>
                                            <p>
                                                <span className="sub-text">{(state.profile && state.profile.work_experience && state.profile.work_experience.designations && state.profile.work_experience.designations.length && state.profile.work_experience.designations[0]) || 'Role '}</span>{is_student === "YES" && <span> (Student)</span>}
                                            </p>
                                            <p>
                                                <span className="sub-text">{(state.profile && state.profile.work_experience && state.profile.work_experience.orgNames && state.profile.work_experience.orgNames.length && state.profile.work_experience.orgNames[0]) || 'Organization Name '}</span>
                                            </p><br />
                                            <p style={{ marginBottom: "6px" }}>
                                                <span className="sub-text">{(skillsPShow && skillsPShow.length && skillsPShow.toString().replace(/,/g, ', ')) || 'Skills '}</span>
                                            </p>
                                            <p>
                                                <span className="sub-text">{(skillsOShow && skillsOShow.length && skillsOShow.toString().replace(/,/g, ', ')) || ''}</span>
                                            </p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="col-sm-4">
                                <span className="bold">Profile Completion</span>
                                <div className="progress custom-progress">
                                    <div className="progress-bar progress-bar-success progress-bar-striped" role="progressbar"
                                        aria-valuenow={state.profileCompletionPercentage} aria-valuemin="0" aria-valuemax="100" style={{ width: `${state.profileCompletionPercentage}%` }}>
                                        {`${state.profileCompletionPercentage}%`}
                                    </div>
                                </div>
                                <span className="bold">Compensation: Yours &amp; <span style={{ color: '#C40223' }}>Median</span></span>
                                <div className='salary-bar'>
                                    <span className="fa fa-map-marker" style={{ left: `50%` }} data-toggle="tooltip" title={`Your stand between ${range} (${state.salary_mean.currency})`}></span>
                                    {state.salary_mean.meanSalary ? <span className="fa fa-map-marker inverted" style={{ left: `${meanPos}%` }} data-toggle="tooltip" title={`Region's mean salary is ${(state.salary_mean.meanSalary / 1000000).toFixed(2)}M (${state.salary_mean.currency})`}></span> : null}
                                </div>
                                <div className='exp-box'>
                                    <strong>Total Experience: </strong>{work_experience.total_experience || 0} years
                                </div>
                                <p className="value-text" style={{ marginTop: '15px' }}>Citizenship: {citizenship ? citizenship != "-1" ? citizenship : "N/A" : "N/A"} </p>
                                <p className="value-text" style={{ marginTop: '15px' }}>Visa Status: <span className="avail-hire" style={{ background: other_country_authorization == "YES" ? 'green' : '#C40223' }}>{other_country_authorization != "YES" ? "NO" : "YES"}</span></p>
                                {
                                    other_country_authorization != "YES" ? "" :
                                        <p className="value-text" style={{ marginTop: '15px' }}>
                                            <span>Countries: </span>
                                            {
                                                personal_details.countryList.map((data, index) =>
                                                    <span key={index}>
                                                        {data}
                                                        {personal_details.countryList.length == index + 1 ? "" : <span>, </span>}
                                                    </span>
                                                )
                                            }
                                        </p>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-3">
                        <div className="quick-links">
                            <ul>
                                <li><button type="button" disabled={!state.basicInfo.is_active} className="btn-quick-links" onClick={state.goToMessenger}><span className="fa fa-comment"></span> My Messages</button></li>
                                <li><button type="button" disabled={!state.basicInfo.is_active} className="btn-quick-links" onClick={state.joinCommunity}><span className="fa fa-user-plus"></span> Join Community</button></li>
                                <li><button type="button" className="btn-quick-links" onClick={showForm.bind()}><span className="fa fa-pencil"></span> Edit/Update Profile</button></li>
                            </ul>
                            {!state.basicInfo.is_active && <p style={{ fontSize: '0.9em', color: '#C40223' }}>Note* Your account was deactivated. To gain full access go to settings and reactivate.</p>}
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12" style={{ minHeight: '75px' }}>
                        <hr className="custom-line" />
                        {(social_links.facebook !== '' || social_links.twitter !== '' || social_links.linkedin !== '' || social_links.instagram !== '' || social_links.pinterest !== '' || social_links.github !== '') &&
                            <span className="bold">Social Handles</span>}
                        <ul className="social-block">
                            {social_links && social_links.facebook !== '' && <li><a rel="noopener noreferrer" href={`https://facebook.com/${social_links.facebook}`} target="_blank"><span className="fa fa-facebook"></span></a></li>}
                            {social_links && social_links.twitter !== '' && <li><a rel="noopener noreferrer" href={`https://twitter.com/${social_links.twitter}`} target="_blank"><span className="fa fa-twitter"></span></a></li>}
                            {social_links && social_links.linkedin !== '' && <li><a rel="noopener noreferrer" href={`https://linkedin.com/in/${social_links.linkedin}`} target="_blank"><span className="fa fa-linkedin"></span></a></li>}
                            {social_links && social_links.instagram !== '' && <li><a rel="noopener noreferrer" href={`https://instagram.com/${social_links.instagram}`} target="_blank"><span className="fa fa-instagram"></span></a></li>}
                            {social_links && social_links.pinterest !== '' && <li><a rel="noopener noreferrer" href={`https://pinterest.com/${social_links.pinterest}`} target="_blank"><span className="fa fa-pinterest"></span></a></li>}
                            {social_links && social_links.github !== '' && <li><a rel="noopener noreferrer" href={`https://github.com/${social_links.github}`} target="_blank"><span className="fa fa-github"></span></a></li>}
                        </ul>
                    </div>
                </div>
                {state.basicInfo.is_active &&
                    <div className="hire-switch">
                        <ToggleSwitch checked={available_hire === undefined ? true : available_hire} title={available_hire === undefined ? "Available for Hire" : available_hire ? "Available for Hire" : " Not Available for Hire"} onClicked={toggleHiring} />
                    </div>
                }
            </div>
            <div className="matchup-secs" style={{ height: "unset", marginBottom: "unset" }}>
                <div className="row">
                    <div className="col-sm-12">
                        <p><strong>About Me/Summary</strong></p>
                        <span className="styled-about">{state.profile && state.profile.personal_details && state.profile.personal_details.aboutMe ? parse(state.profile.personal_details.aboutMe) : 'No Summary Available'}</span>
                    </div>
                </div>
            </div>
            <div className="profile-status">
                <div className="row">
                    <div className="col-sm-4">
                        <div className="matchup-secs">
                            <p><strong>Video Introduction</strong></p>
                            {media.videoshot ?
                                <ReactPlayer url={media.videoshot} autoPlay playing={false} width={'100%'} height={270} controls muted volume={0} />
                                : <img src={require('../../../images/banners/no_video.png')} alt="" className="fit-layout" />}
                        </div>
                    </div>
                    <div className="col-sm-4">
                        <div className="matchup-secs">
                            <strong>Education and Certification</strong><br />
                            {education.institute && education.institute.length && education.institute[0] !== '' ?
                                <div id="boxCarousel" className="carousel slide" data-ride="carousel" data-interval="false">
                                    <div className="carousel-inner">
                                        {education.institute.map((i, index) =>
                                            <div key={index} className={`each-holder item ${index === 0 ? "active" : ''}`}>
                                                <div style={{ overflowY: "auto", height: "280px" }}>
                                                    <br /><strong>{education.degree && education.degree.length ? education.degree[index] : ''} @ {education.institute && education.institute.length ? education.institute[index] : ''}</strong><br />
                                                    <span>Major in {education.startM && education.startM.length ? education.special[index] : ''}</span><br />
                                                    <span>Started in {education.startM && education.startM.length ? education.startM[index] : ''}, {education.startY && education.startY.length ? education.startY[index] : ''} and completed in {education.endM && education.endM.length ? education.endM[index] : ''}, {education.endY && education.endY.length ? education.endY[index] : ''}</span><br />
                                                    {education.activities && education.activities.length && education.activities[index] && education.activities[index].length ?
                                                        <span>
                                                            <br /><strong>Activities/Societies:</strong><br />
                                                            <span>{education.activities && education.activities.length && education.activities[index] && education.activities[index].length ? education.activities[index] : ''}</span><br />
                                                        </span>
                                                        :
                                                        <span></span>
                                                    }
                                                    {education.societies && education.societies.length && education.societies[index] && education.societies[index].length ?
                                                        <span>
                                                            <br /><strong>Accomplishments:</strong><br />
                                                            <span>{education.societies && education.societies.length && education.societies[index] && education.societies[index].length ? education.societies[index] : 'No Accomplishments Available'}</span>
                                                        </span>
                                                        :
                                                        <span></span>
                                                    }
                                                </div>
                                            </div>)}
                                        {certifications && certifications.name && certifications.name.length ?
                                            <div className="each-holder item">
                                                <div style={{ overflowY: "auto", height: "280px" }}>
                                                    <br /><strong>Certifications</strong>
                                                    {certifications.name.map((i, index) =>
                                                        <p key={index}>{certifications.name && certifications.name.length ? certifications.name[index] : ''} {certifications.endM[index] === 'Skip' || certifications.endY[index] === 'Skip' ? '' : `completed in ${certifications.endM && certifications.endM.length ? typeof (certifications.endM[index]) === "string" && certifications.endM[index].substring(0, 3) : ''} ${certifications.endY && certifications.endY.length ? certifications.endY[index] : ''}`}</p>
                                                    )
                                                    }
                                                </div>
                                            </div>
                                            :
                                            null
                                        }
                                    </div>
                                    {education.institute && education.institute.length ?
                                        <a className="left carousel-control" href="#boxCarousel" data-slide="prev">
                                            <span className="fa fa-chevron-left"></span>
                                        </a> : null}
                                    {education.institute && education.institute.length ?
                                        <a className="right carousel-control" href="#boxCarousel" data-slide="next">
                                            <span className="fa fa-chevron-right"></span>
                                        </a> : null}
                                </div> :
                                ""
                            }
                        </div>
                    </div>
                    <div className="col-sm-4">
                        <div className="matchup-secs">
                            <strong>Experience</strong><br />
                            <div id="boxCarousel2" className="carousel slide" data-ride="carousel" data-interval="false">
                                <div className="carousel-inner">
                                    {work_experience.orgNames && work_experience.orgNames.length && work_experience.orgNames[0] !== '' ?
                                        work_experience.orgNames.map((i, index) =>
                                            <div key={index} className={`each-holder item ${index === 0 ? "active" : ''}`}>
                                                <div style={{ overflowY: "auto", height: "280px" }}>
                                                    <br /><strong>{work_experience.designations && work_experience.designations.length ? work_experience.designations[index] : ''} @ {work_experience.orgNames && work_experience.orgNames.length ? work_experience.orgNames[index] : ''}</strong><br />
                                                    <span>Working in {work_experience.industry && work_experience.industry.length ? work_experience.industry[index] : ''} industry as a {work_experience.role && work_experience.role.length ? work_experience.role[index] : ''}</span><br />
                                                    <span>Started in {work_experience.startM && work_experience.startM.length ? work_experience.startM[index] : ''}, {work_experience.startY && work_experience.startY.length ? work_experience.startY[index] : ''} {work_experience.endM[index] === 'Currently Working' || work_experience.endM[index] === 'Currently Working' ? 'and still working' : `and worked till ${work_experience.endM && work_experience.endM.length ? work_experience.endM[index] : ''}, ${work_experience.endY && work_experience.endY.length ? work_experience.endY[index] : ''}`}</span><br />
                                                    <br />
                                                    {work_experience.skillsP && work_experience.skillsP[index] && work_experience.skillsP[index].length ?
                                                        <span>
                                                            <strong>Primary Skills:</strong><br />
                                                            <ul>{work_experience.skillsP && work_experience.skillsP[index] && work_experience.skillsP[index].length ? work_experience.skillsP[index].map((i, index) => <li className="skill-holder" key={index}>{i}</li>) : ''}</ul>
                                                        </span> : null}
                                                    {work_experience.skillsO && work_experience.skillsO[index] && work_experience.skillsO[index].length ?
                                                        <span>
                                                            <strong>Other Skills:</strong><br />
                                                            <span>{work_experience.skillsO && work_experience.skillsO[index] && work_experience.skillsO[index].length ? work_experience.skillsO[index].map((i, index) => <span className="skill-holder" key={index}>{i}</span>) : ''}</span><br />
                                                        </span>
                                                        :
                                                        null
                                                    }
                                                </div>
                                            </div>) :
                                        <div className="each-holder item active">
                                            <div style={{ overflowY: "auto", height: "280px", marginTop: "20px" }}>

                                            </div>
                                        </div>
                                    }
                                    {board_experience && board_experience.boardName && board_experience.boardName.length ?
                                        <div className="each-holder item">
                                            <div style={{ overflowY: "auto", height: "280px" }}>
                                                <br /><strong>Board Experience</strong>
                                                {board_experience.boardName.map((i, index) =>
                                                    <p key={index}>{board_experience.boardName && board_experience.boardName.length ? board_experience.boardName[index] : ''} ({board_experience.boardType && board_experience.boardType.length ? board_experience.boardType[index] : ''}) from {board_experience.boardStartM && board_experience.boardStartM.length ? typeof (board_experience.boardStartM[index]) === "string" && board_experience.boardStartM[index].substring(0, 3) : ''} {board_experience.boardStartY && board_experience.boardStartY.length ? board_experience.boardStartY[index] : ''} till {board_experience.stillMember[index] ? 'Present' : `${board_experience.boardEndM && board_experience.boardEndM.length ? typeof (board_experience.boardEndM[index]) === "string" && board_experience.boardEndM[index].substring(0, 3) : ''} ${board_experience.boardEndY && board_experience.boardEndY.length ? board_experience.boardEndY[index] : ''}`}</p>
                                                )
                                                }
                                            </div>
                                        </div>
                                        :
                                        null
                                    }
                                </div>
                                {work_experience.orgNames && work_experience.orgNames.length ?
                                    <a className="left carousel-control" href="#boxCarousel2" data-slide="prev">
                                        <span className="fa fa-chevron-left"></span>
                                    </a>
                                    : null
                                }
                                {work_experience.orgNames && work_experience.orgNames.length ?
                                    <a className="right carousel-control" href="#boxCarousel2" data-slide="next">
                                        <span className="fa fa-chevron-right"></span>
                                    </a>
                                    : null
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const Profile = connect(mapBasicInfoToProps)(ConnectedProfile);

export default Profile;
