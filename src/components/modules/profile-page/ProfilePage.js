import React from 'react';
import { connect } from 'react-redux';
import './ProfilePage.css';
import 'react-responsive-modal/styles.css';
import { TAG_IT, GENERATE_PDF, ACCOUNT } from "../../../utils/constants";
import { postCall, getCall } from "../../../utils/api.config";
import { toast } from 'react-toastify';
import parse from 'html-react-parser';
import ReactPlayer from 'react-player';
import Modal from 'react-responsive-modal';
import moment from 'moment';

const mapStateToProps = state => {
    return state
};

const CreateTempelate = (props) => {
    const { basicDetails, profile } = props.user
    const { personal_details, work_experience, education, social_links, board_experience, certifications } = profile
    let workExpRows = []
    if(work_experience && work_experience.orgNames && work_experience.orgNames.length){
        for (let i = 0; i < work_experience.orgNames.length; i++) {
            workExpRows.push(
                <tr key={`work_experience-${i}`} style={{ verticalAlign: 'top', paddingBottom: '15px' }}>
                    {work_experience && work_experience.tillDate && work_experience.tillDate[i] ?
                        <td style={{ width: '200px' }}>{`${work_experience.startM[i].substring(0, 3)} ${work_experience.startY[i]} - Present`}</td>
                        :
                        <td style={{ width: '200px' }}>{`${work_experience && work_experience.startM && work_experience.startM[i].substring(0, 3)} ${work_experience && work_experience.startY && work_experience.startY[i]} - ${work_experience && work_experience.endM && work_experience.endM[i].substring(0, 3)} ${work_experience && work_experience.endY && work_experience.endY[i]}`}</td>
                    }
                    <td>
                        <p><b>{work_experience && work_experience.role ? work_experience.role[i] : null}</b></p>
                        <p>{`${work_experience && work_experience.orgNames[i]}`}</p>
                        <span>{work_experience && work_experience.rnrs && work_experience.rnrs.length && work_experience.rnrs[i] && work_experience.rnrs[i].length ?
                            parse(work_experience.rnrs[i]) : null}
                        </span>
                    </td>
                </tr>)
        }
    }
    let educationRows = []
    if(education && education.degree && education.degree.length){
        for (let i = 0; i < education.degree.length; i++) {
            educationRows.push(
                <tr key={`education-${i}`} style={{ verticalAlign: 'top', paddingBottom: '15px' }}>
                    <td style={{ width: '200px' }}>{`${education && education.startM && education.startM[i].substring(0, 3)} ${education && education.startY && education.startY[i]} - ${education && education.endM && education.endM[i].substring(0, 3)} ${education && education.endY && education.endY[i]}`}</td>
                    <td>
                        <p><b>{`${education && education.degree && education.degree[i]}, ${education && education.special[i] && education.special[i]}, ${education && education.institute && education.institute[i]}`}</b></p>
                    </td>
                </tr>
            )
        }
    }
    let certificationRows = []
    if(certifications && certifications.name && certifications.name.length){
        for (let i = 0; i < certifications && certifications.name ? certifications.name.length : 0; i++) {
            certificationRows.push(
                <tr key={`certification-${i}`} style={{ verticalAlign: 'top', paddingBottom: '15px' }}>
                    <td style={{ width: '200px' }}>{certifications && certifications.endM ? certifications.endM[i] === "Skip" ? '' : certifications.endM && certifications.endM[i].substring(0, 3) : ''} {certifications && certifications.endY ? certifications.endY[i] === "Skip" ? '' : certifications.endY[i] : ''}</td>
                    <td>
                        <p>{certifications.name[i]}</p>
                    </td>
                </tr>
            )
        }
    }
    
    let Pskills = [], Oskills = []
    if(work_experience && work_experience.orgNames && work_experience.orgNames.length){
        for (let i = 0; i < work_experience.orgNames.length; i++) {
            work_experience.skillsP && work_experience.skillsP.length ? Pskills = [...new Set([...work_experience.skillsP[i], ...Pskills])] : Pskills = [...Pskills]
            work_experience.skillsO && work_experience.skillsO.length ? Oskills = [...new Set([...work_experience.skillsO[i], ...Oskills])] : Oskills = [...Oskills]
        }
    }
    let skillRows = []
    skillRows.push(
        <tr key="skills" style={{ verticalAlign: 'top', paddingBottom: '15px' }}>
            <td>
                {Pskills && Pskills.length ? <p><b>Primary Skills:</b> {Pskills.toString().replace(/,/g, ', ')}</p> : null}
                {Oskills && Oskills.length ? <p><b>Other Skills:</b> {Oskills.toString().replace(/,/g, ', ')}</p> : null}
            </td>
        </tr>
    )
    let boardExpRows = []
    if (board_experience && board_experience.boardName && board_experience.boardName.length) {
        for (let i = 0; i < board_experience.boardName.length; i++) {
            boardExpRows.push(
                <tr key={`board_experience-${i}`} style={{ verticalAlign: 'top', paddingBottom: '15px' }}>
                    {board_experience.stillMember[i] ?
                        board_experience.boardStartM.length && board_experience.boardStartY.length && board_experience.boardEndM.length && board_experience.boardEndY.length && <td style={{ width: '200px' }}>{`${board_experience.boardStartM[i].substring(0, 3)} ${board_experience.boardStartY[i]} - Present`}</td>
                        :
                        board_experience.boardStartM.length && board_experience.boardStartY.length && board_experience.boardEndM.length && board_experience.boardEndY.length && <td style={{ width: '200px' }}>{`${board_experience.boardStartM[i].substring(0, 3)} ${board_experience.boardStartY[i]} - ${board_experience.boardEndM[i].substring(0, 3)} ${board_experience.boardEndY[i]}`}</td>
                    }
                    <td>
                        <strong>{board_experience && board_experience.boardType.length && board_experience.boardName.length && `${board_experience.boardName[i]}, ${board_experience.boardType[i]}`}</strong>
                    </td>
                </tr>
            )
        }
    }
    return (
        <div id="ResumeTemplate1" className="text-left ResumeTemplate">
            <h3 style={{ fontSize: '24px', fontWeight: 500, marginBottom: '10px' }}>{`${basicDetails.first_name} ${basicDetails.last_name}`}</h3>
            <p style={{ fontWeight: 'bold' }}>{work_experience&&work_experience.designations && work_experience.designations.length ? work_experience.designations[0] : null}</p>
            <table style={{ width: "100%" }}>
                <tbody>
                    <tr style={{ verticalAlign: 'top', paddingBottom: '15px' }}>
                        <td><p><span className="fa fa-phone"> </span>{` ${basicDetails.dial_code||''} ${basicDetails.phone||''}`}</p></td>
                        <td>{social_links && social_links.linkedin ? <p><span className="fa fa-linkedin"> </span>{` ${social_links.linkedin}`}</p> : null}</td>
                    </tr>
                    <tr style={{ verticalAlign: 'top', paddingBottom: '15px' }}>
                        <td><p><span className="fa fa-envelope"> </span>{` ${basicDetails.email}`}</p></td>
                        <td>{social_links && social_links.twitter ? <p><span className="fa fa-twitter"> </span>{` ${social_links.twitter}`}</p> : null}</td>
                    </tr>
                </tbody>
            </table>
            <div className="row">
                <div className="col-sm-12">
                    {personal_details && personal_details.aboutMe ? <span style={{ textAlign: 'justify' }}> {parse(personal_details.aboutMe)}</span> : <span></span>}
                </div>
            </div>
            <div>
                <p style={{ marginTop: '30px', fontWeight: 'bold', borderBottom: '1px solid #AAAAAA' }}><span className="fa fa-briefcase"></span> EXPERIENCE</p>
                <table style={{ width: "100%" }}>
                    <tbody>
                        {workExpRows}
                    </tbody>
                </table>
            </div>
            {board_experience && board_experience.boardType.length && board_experience.boardName.length ?
                <div>
                    <p style={{ marginTop: '30px', fontWeight: 'bold', borderBottom: '1px solid #AAAAAA' }}><span className="fa fa-users"></span> BOARD EXPERIENCE</p>
                    <table style={{ width: "100%" }}>
                        <tbody>
                            {boardExpRows}
                        </tbody>
                    </table>
                </div>
                :
                null
            }
            <div>
                <p style={{ marginTop: '30px', fontWeight: 'bold', borderBottom: '1px solid #AAAAAA' }}><span className="fa fa-graduation-cap"></span> EDUCATION</p>
                <table style={{ width: "100%" }}>
                    <tbody>
                        {educationRows}
                    </tbody>
                </table>
            </div>
            <div>
                <p style={{ marginTop: '30px', fontWeight: 'bold', borderBottom: '1px solid #AAAAAA' }}><span className="fa fa-certificate"></span> CERTIFICATIONS</p>
                <table style={{ width: "100%" }}>
                    <tbody>
                        {certificationRows}
                    </tbody>
                </table>
            </div>
            <div>
                <p style={{ marginTop: '30px', fontWeight: 'bold', borderBottom: '1px solid #AAAAAA' }}><span className="fa fa-puzzle-piece"></span> SKILLS</p>
                <table style={{ width: "100%" }}>
                    <tbody>
                        {skillRows}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

class ConnectedProfilePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          open: false,
          showTagComment: false,
          tagComment: "",
          individualId: props.user.basicDetails.id,
          shortlisted: props.user.taggedDetails.shortlisted,
          favourite: props.user.taggedDetails.favourite,
          taggedComments: props.user.taggedDetails.comments || [],
          JobDetailStatus: false,
          JobTypeId: null,
          jobTypeValue: null,
          currencyValue: null,
          compensationPriceValue: null,
        };
    }
    onOpenModal = () => {
        this.setState({ open: true });
    };
    onCloseModal = () => {
        this.setState({ open: false });
    };
    cancelTagging = () => {
        this.setState({ showTagComment: false, tagComment: '' });
    }
    openTagComment = () => {
        this.setState({ showTagComment: true })
    }
    changeTagComment = (e) => {
        this.setState({ tagComment: e.target.value })
    }
    submitTagComment = () => {
        let payload = {
            individualId: this.state.individualId,
            comments: this.state.tagComment
        }
        postCall(TAG_IT, payload, { sfn: this.successfullyTagged, efn: () => toast.error("Server failed to respond. Please try again later.") })
    }
    successfullyTagged = (data) => {
        toast.success("Successfully tagged with a comment");
        let allComments = this.state.taggedComments
        allComments.push(data.response)
        this.setState({ taggedComments: allComments })

        this.cancelTagging.call()
    }
    toggleFavorite = () => {
        this.setState({ favourite: !this.state.favourite }, () => {
            let payload = {
                individualId: this.state.individualId,
                favourite: this.state.favourite
            }
            postCall(TAG_IT, payload, { sfn: toast.success(this.state.favourite ? "Marked as favorite" : "Marked as not favorite"), efn: () => toast.error("Server failed to respond. Please try again later.") })
        })
    }
    toggleShortlist = () => {
        this.setState({ shortlisted: !this.state.shortlisted }, () => {
            let payload = {
                individualId: this.state.individualId,
                shortlisted: this.state.shortlisted
            }
            postCall(TAG_IT, payload, { sfn: toast.success(this.state.shortlisted ? "Marked as shortlisted" : "Marked as not shortlisted"), efn: () => toast.error("Server failed to respond. Please try again later.") })
        })
    }
    generatePDF = () => {
        let eles = document.getElementById('templateDL').innerHTML
        let content = `<html><head><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"><style>body{font-size:0.6em;font-family:Arial,Halvetica,sans-serif}table{font-size:1em}</style></head><body>${eles}</body></html>`
        postCall(GENERATE_PDF, { content }, { sfn: this.pdfGenerated, efn: this.pdfGenFailed })
    }
    pdfGenerated = (data) => {
        window.open(data.response, "_blank");
    }
    pdfGenFailed = () => {
        toast.error('Server failed to generate PDF')
    }
    componentDidMount() {
        const userID = this.props.user.basicDetails.id;
        
        getCall("/user/getUserJobDetails?userId="+userID, {}, { sfn: this.setJobDetails, efn: () => toast.error("Server failed to respond. Please try again later.") })
    }

    setJobDetails = (data) => {
        if (data.response.length > 0) {          
            this.setState({
              JobDetailStatus: true,
              JobTypeId: data.response[data.response.length-1].JobTypeId,
              jobTypeValue: data.response[data.response.length-1]["jobtype.Name"],
              currencyValue: data.response[data.response.length-1].CompensationCurrency,
              compensationPriceValue: Math.round(data.response[data.response.length-1].CompensationValue * 100) / 100,
            });
        }
    }
    render() {
        const { basicDetails, profile, communities } = this.props.user
        const {
          profile_pic,
          first_name,
          last_name,
          email,
          available_hire,
          is_student,
          citizenship,
          other_country_authorization,
        } = basicDetails;
        const {
          work_experience,
          education,
          media,
          social_links,
          board_experience,
          certifications,
          personal_details,
        } = profile;
        let skillsPShow = []
        if (profile && profile.work_experience && profile.work_experience.skillsP && profile.work_experience.skillsP.length) {
            let ski = []
            for (let i = 0; i < profile.work_experience.skillsP.length; i++) {
                ski = [...new Set([...ski, ...profile.work_experience.skillsP[i]])]
            }
            if (ski.length > 5) {
                skillsPShow = ski.splice(0, 5)
            }
            else {
                skillsPShow = ski
            }
        }
        let skillsOShow = []
        if (profile && profile.work_experience && profile.work_experience.skillsO && profile.work_experience.skillsO.length) {
            let ski = []
            for (let i = 0; i < profile.work_experience.skillsO.length; i++) {
                ski = [...new Set([...ski, ...profile.work_experience.skillsO[i]])]
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
                <div className="profile-gen" style={{ background: '#ccc' }}>
                    <div className="row">
                        <div className="col-sm-12">
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
                                                <p className="org-name">{email}</p>
                                                <p>
                                                    <span className="sub-text">{(profile && profile.work_experience && profile.work_experience.designations && profile.work_experience.designations.length && profile.work_experience.designations[0]) || 'Role Not Available'}</span>{is_student === "YES" && <span> (Student)</span>}
                                                </p>
                                                <p>
                                                    <span className="sub-text">{(profile && profile.work_experience && profile.work_experience.orgNames && profile.work_experience.orgNames.length && profile.work_experience.orgNames[0]) || 'Organization Name Not Available'}</span>
                                                </p><br />
                                                <p style={{ marginBottom: "6px" }}>
                                                    <span className="sub-text">{(skillsPShow && skillsPShow.length && skillsPShow.toString().replace(/,/g, ', ')) || 'Skills Not Available'}</span>
                                                </p>
                                                <p>
                                                    <span className="sub-text">{(skillsOShow && skillsOShow.length && skillsOShow.toString().replace(/,/g, ', ')) || ''}</span>
                                                </p>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                                <div className="col-sm-4">
                                    {/* <div className='exp-box'>
                                        <strong>Total Experience: </strong>{work_experience && work_experience.total_experience ? work_experience.total_experience : 0} years
                                    </div> */}
                                    <div className="">
                                        {/* <p className="value-text" style={{ marginTop: '15px' }}>Available for hire: <span className="avail-hire" style={{ background: available_hire ? 'green' : '#C40223' }}>{available_hire ? 'YES' : 'NO'}</span></p> */}
                                        <p className="value-text" style={{ marginTop: '15px' }}>
                                            {/* <span className="avail-hire" style={{ background: available_hire ? 'green' : '#C40223' }}>{available_hire ? 'Available for Hire' : 'Not Available for Hire'}</span>
                                            {
                                                available_hire && this.state.JobDetailStatus && ACCOUNT=="corporate" ?
                                                <span> {this.state.jobTypeValue} ({this.state.currencyValue} {this.state.compensationPriceValue} {this.state.JobTypeId == 3 ? <small><i>Hourly</i></small> : <small><i>Yearly</i></small>})</span> : ""
                                            } */}
                                        </p>
                                    </div>
                                    {/* <p className="value-text" style={{ marginTop: '15px' }}>Citizenship: {citizenship ? citizenship!="-1" ? citizenship : "N/A" : "N/A"} </p>
                                    <p className="value-text" style={{ marginTop: '15px' }}>Visa Status: <span className="avail-hire" style={{ background: other_country_authorization=="YES" ? 'green' : '#C40223' }}>{other_country_authorization != "YES" ? "NO" : "YES"}</span></p>
                                    {
                                        other_country_authorization != "YES" ? "" :
                                        <p className="value-text" style={{ marginTop: '15px' }}>
                                            <span>Countries: </span>   
                                            {
                                                personal_details.countryList.map((data, index)=>
                                                    <span key={index}>
                                                        {data}
                                                        {personal_details.countryList.length == index+1 ? "" : <span>, </span> }
                                                    </span>
                                                )
                                            }
                                        </p>
                                    }
                                    
                                    <div className="tagging-holder">
                                        <span className="fa fa-tag" onClick={this.openTagComment} data-toggle="tooltip" title="Comments Tagged"></span>
                                        <span className="fa fa-star" data-toggle="tooltip" title="Favourite" onClick={this.toggleFavorite} style={this.state.favourite ? { color: "#C40223" } : { color: "inherit" }}></span>
                                        <span className="fa fa-check-circle-o" onClick={this.toggleShortlist} data-toggle="tooltip" title="Shortlist" style={this.state.shortlisted ? { color: "#C40223" } : { color: "inherit" }}></span>
                                    </div>
                                    <div className="btn-download">
                                        <button onClick={this.generatePDF.bind(this)}><span className="fa fa-download"></span> Download Resume</button>
                                        <div style={{ display: 'none' }} id='templateDL'><CreateTempelate user={this.props.user} /></div>
                                    </div> */}
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12" style={{ minHeight: '75px' }}>
                                    <hr className="custom-line" />
                                </div>
                                <div className="col-sm-6" style={{ minHeight: '75px' }}>
                                    {((social_links && social_links.facebook !== '') || (social_links && social_links.twitter !== '') || (social_links && social_links.linkedin !== '') || (social_links && social_links.instagram !== '') || (social_links && social_links.pinterest !== '') || (social_links && social_links.github !== '')) &&
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
                                {communities && communities.length ? <div className="col-sm-6" style={{ minHeight: '75px' }}>
                                    <p className="bold text-center" style={{ marginBottom: '0' }}>Communities Joined</p>
                                    <div id="boxCarousel3" className="carousel slide" data-ride="carousel" data-interval="false">
                                        <div className="carousel-inner text-center">
                                            {communities.map((i, index) =>
                                                <div key={index} className={`each-holder item ${index === 0 ? "active" : ''}`}>
                                                    <p>{i.title}, ({i.posts} posts)</p>
                                                </div>
                                            )}
                                        </div>
                                        {communities.length > 1 &&
                                            <a className="left carousel-control comm" href="#boxCarousel3" data-slide="prev">
                                                <span className="fa fa-chevron-left"></span>
                                            </a>}
                                        {communities.length > 1 &&
                                            <a className="right carousel-control comm" href="#boxCarousel3" data-slide="next">
                                                <span className="fa fa-chevron-right"></span>
                                            </a>}
                                    </div>
                                </div> : null}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="matchup-secs" style={{ height: "unset", marginBottom: "unset" }}>
                    <div className="row">
                        <div className="col-sm-12">
                            <p><strong>Summary</strong></p>
                            <span className="styled-about">{profile && profile.personal_details && profile.personal_details.aboutMe ? parse(profile.personal_details.aboutMe) : 'No Summary Available'}</span>
                        </div>
                    </div>
                </div>
                <div className="profile-status">
                    <div className="row">
                        <div className="col-sm-4">
                            <div className="matchup-secs">
                                <p><strong>Video Introduction</strong></p>
                                {media && media.videoshot ? <ReactPlayer url={media.videoshot} width='100%' height={270} controls /> : <img src={require('../../../images/banners/no_video.png')} alt="" className="fit-layout" />}
                            </div>
                        </div>
                        <div className="col-sm-4">
                            <div className="matchup-secs">
                                <strong>Education and Certification</strong><br />
                                {education && education.institute && education.institute.length && education.institute[0] !== '' ?
                                    <div id="boxCarousel" className="carousel slide" data-ride="carousel" data-interval="false">
                                        <div className="carousel-inner">
                                            {education.institute.map((i, index) =>
                                                <div key={index} className={`each-holder item ${index === 0 ? "active" : ''}`}>
                                                    <div style={{ overflowY: "auto", height: "280px" }}>
                                                        <br /><strong>{education.degree && education.degree.length ? education.degree[index] : 'Not Available'} @ {education.institute && education.institute.length ? education.institute[index] : 'Not Available'}</strong><br />
                                                        <span>Major in {education.startM && education.startM.length ? education.special[index] : 'Not Available'}</span><br />
                                                        <span>Started in {education.startM && education.startM.length ? education.startM[index] : 'Not Available'}, {education.startY && education.startY.length ? education.startY[index] : 'Not Available'} and completed in {education.endM && education.endM.length ? education.endM[index] : 'Not Available'}, {education.endY && education.endY.length ? education.endY[index] : 'Not Available'}</span><br />
                                                        <br /><strong>Activities/Societies:</strong><br />
                                                        <span>{education.activities && education.activities.length && education.activities[index] && education.activities[index].length ? education.activities[index] : 'No Activities/Societies Available'}</span><br />
                                                        <br /><strong>Accomplishments:</strong><br />
                                                        <span>{education.societies && education.societies.length && education.societies[index] && education.societies[index].length ? education.societies[index] : 'No Accomplishments Available'}</span>
                                                    </div>
                                                </div>
                                            )}
                                            {console.log(certifications)}
                                            {certifications && certifications.name && certifications.name.length ?
                                                <div className="each-holder item">
                                                    <div style={{ overflowY: "auto", height: "280px" }}>
                                                        <br /><strong>Certifications</strong>
                                                        {certifications.name.map((i, index) =>
                                                            <p key={index}>{certifications.name&&certifications.name.length?certifications.name[index] : ''} {certifications.endM[index]==='Skip'||certifications.endY[index]==='Skip'?'': `completed in ${certifications.endM&&certifications.endM.length?typeof(certifications.endM[index])==="string"&&certifications.endM[index].substring(0, 3):''} ${certifications.endY&&certifications.endY.length?certifications.endY[index]:''}`}</p>
                                                        )
                                                        }
                                                    </div>
                                                </div>
                                                :
                                                null
                                            }
                                        </div>
                                        {education.institute && education.institute.length &&
                                            <a className="left carousel-control" href="#boxCarousel" data-slide="prev">
                                                <span className="fa fa-chevron-left"></span>
                                            </a>}
                                        {education.institute && education.institute.length &&
                                            <a className="right carousel-control" href="#boxCarousel" data-slide="next">
                                                <span className="fa fa-chevron-right"></span>
                                            </a>}
                                    </div> :
                                    "Not Available"
                                }
                            </div>
                        </div>
                        <div className="col-sm-4">
                            <div className="matchup-secs">
                                <strong>Experience</strong><br />
                                <div id="boxCarousel2" className="carousel slide" data-ride="carousel" data-interval="false">
                                    <div className="carousel-inner">
                                        {work_experience && work_experience.orgNames && work_experience.orgNames.length && work_experience.orgNames[0] !== '' ?
                                            work_experience.orgNames.map((i, index) =>
                                                <div key={index} className={`each-holder item ${index === 0 ? "active" : ''}`}>
                                                    <div style={{ overflowY: "auto", height: "280px" }}>
                                                        <br /><strong>{work_experience.designations && work_experience.designations.length ? work_experience.designations[index] : 'Not Available'} @ {work_experience.orgNames && work_experience.orgNames.length ? work_experience.orgNames[index] : 'Not Available'}</strong><br />
                                                        <span>Working in {work_experience.industry && work_experience.industry.length ? work_experience.industry[index] : 'Not Available'} industry as a {work_experience.role && work_experience.role.length ? work_experience.role[index] : 'Not Available'}</span><br />
                                                        <span>Started in {work_experience.startM && work_experience.startM.length ? work_experience.startM[index] : 'Not Available'}, {work_experience.startY && work_experience.startY.length ? work_experience.startY[index] : 'Not Available'} and worked till {work_experience.endM && work_experience.endM.length ? work_experience.endM[index] : 'Not Available'}, {work_experience.endY && work_experience.endY.length ? work_experience.endY[index] : 'Not Available'}</span><br />
                                                        <br /><strong>Primary Skills:</strong><br />
                                                        <ul>{work_experience.skillsP && work_experience.skillsP[index] && work_experience.skillsP[index].length ? work_experience.skillsP[index].map((i, index) => <li className="skill-holder" key={index}>{i}</li>) : 'Not Available'}</ul>
                                                        <strong>Other Skills:</strong><br />
                                                        <span>{work_experience.skillsO && work_experience.skillsO[index] && work_experience.skillsP[index].length ? work_experience.skillsO[index].map((i, index) => <span className="skill-holder" key={index}>{i}</span>) : 'Not Available'}</span><br />
                                                    </div>
                                                </div>) :
                                            <div className="each-holder item active">
                                                <div style={{ overflowY: "auto", height: "280px", marginTop: "20px" }}>
                                                    Not Available
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
                                    {work_experience && work_experience.orgNames && work_experience.orgNames.length > 1 &&
                                        <a className="left carousel-control" href="#boxCarousel2" data-slide="prev">
                                            <span className="fa fa-chevron-left"></span>
                                        </a>
                                    }
                                    {work_experience && work_experience.orgNames && work_experience.orgNames.length > 1 &&
                                        <a className="right carousel-control" href="#boxCarousel2" data-slide="next">
                                            <span className="fa fa-chevron-right"></span>
                                        </a>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Modal open={this.state.showTagComment} center onClose={this.cancelTagging}>
                    <div className="contact-modal">
                        <h3>Comments Tagged</h3>
                        <div className="comments-form">
                            {this.state.taggedComments.length ? this.state.taggedComments.map((i, index) => <p style={{ position: 'relative' }} key={index}><span style={{ position: 'absolute', right: 0, fontSize: '0.8em', top: '8px' }}>{moment(i.createdOn).format("MMM Do YYYY, h:mm:ss a")}</span><span>{i.name}:</span><br />{i.comment}</p>) : <p>No Tags yet..<br />Be the first one to comment.</p>}
                        </div>
                        <div className="comments-input">Write a Comment<br />
                            <textarea onChange={this.changeTagComment} rows="3" value={this.state.tagComment} />
                            <div className="text-right">
                                <button type="button" onClick={this.cancelTagging}><span className="fa fa-times-circle"></span></button>
                                <button type="button" disabled={this.state.tagComment.trim() === ''} onClick={this.submitTagComment}><span className="fa fa-check-circle"></span></button>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        )
    }
}

const ProfilePage = connect(mapStateToProps)(ConnectedProfilePage);
export default ProfilePage;