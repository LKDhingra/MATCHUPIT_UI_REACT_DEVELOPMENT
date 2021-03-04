import React from 'react';
import './Templates.css';
import parse from 'html-react-parser'

const ResumeTemplate2 = (props) => {
    const { basicInfo, profile } = props.data
    const { education, certifications, work_experience, personal_details, social_links, board_experience } = profile
    let workExpRows = []
    for (let i = 0; i < work_experience.orgNames.length; i++) {
        workExpRows.push(
        <tr key={`work_experience-${i}`} style={{verticalAlign:'top', paddingBottom:'15px'}}>
            {work_experience.tillDate[i]?
            <td style={{width:'200px'}}>{`${work_experience.startM[i].substring(0, 3)} ${work_experience.startY[i]} - Present`}</td>
            :
            <td style={{width:'200px'}}>{`${work_experience.startM[i].substring(0, 3)} ${work_experience.startY[i]} - `}{work_experience.endM[i]==='Currently Working'||work_experience.endY[i]==='Currently Working'?'Present':<span>{work_experience.endM[i].substring(0, 3)} {work_experience.endY[i]}</span>}</td>
            }
            <td>
                <p className="job-title"><b>{work_experience.role&&work_experience.role?work_experience.role[i]:null}</b></p>
                <p className="orgs-name">{`${work_experience.orgNames[i]}`}</p>
                <span className="quills">{work_experience.rnrs&&work_experience.rnrs.length&&work_experience.rnrs[i]&&work_experience.rnrs[i].length?
                    parse(work_experience.rnrs[i]):null}
                </span>
            </td>
        </tr>)
    }
    let educationRows = []
    for (let i = 0; i < education.degree.length; i++) {
        educationRows.push(
            <tr key={`education-${i}`}>
                <td style={{width:'200px'}}>{`${education.startM[i].substring(0, 3)} ${education.startY[i]} - ${education.endM[i].substring(0, 3)} ${education.endY[i]}`}</td>
                <td>
                    <p className="job-title"><b>{`${education.degree[i]}, ${education.special[i]}, ${education.institute[i]}`}</b></p>
                </td>
            </tr>)
    }
    let certificationRows = []
    for (let i = 0; i < certifications.name.length; i++) {
        certificationRows.push(
            <tr key={`certification-${i}`}>
                <td style={{width:'200px'}}>{certifications.endM[i]==="Skip"?'':certifications.endM[i].substring(0, 3)} {certifications.endY[i]==="Skip"?'':certifications.endY[i]}</td>
                <td>
                    <p className="job-title"><b>{certifications.name[i]}</b></p>
                </td>
            </tr>)
    }
    let  Pskills = [], Oskills = []
    for(let i=0; i < work_experience.orgNames.length; i++){
        work_experience.skillsP&&work_experience.skillsP.length ? Pskills = [...new Set([...work_experience.skillsP[i], ...Pskills])] : Pskills = [...Pskills]
        work_experience.skillsO&&work_experience.skillsO.length ? Oskills = [...new Set([...work_experience.skillsO[i], ...Oskills])] : Oskills = [...Oskills]
    }
    let skillRows = []
    skillRows.push(
        <tr key="skills">
            <td>
                {Pskills&&Pskills.length ? <p><b>Primary Skills:</b> {Pskills.toString().replace(/,/g, ', ')}</p> : null}
                {Oskills&&Oskills.length ? <p><b>Other Skills:</b> {Oskills.toString().replace(/,/g, ', ')}</p> : null}
            </td>
        </tr>
    )
    let boardExpRows = []
    for(let i=0; i<board_experience.boardName.length; i++){
        boardExpRows.push(
            <tr key={`board_experience-${i}`}>
                {board_experience.stillMember[i]?
                board_experience.boardStartM.length && board_experience.boardStartY.length && board_experience.boardEndM.length && board_experience.boardEndY.length &&<td style={{width:'200px'}}>{`${board_experience.boardStartM[i].substring(0, 3)} ${board_experience.boardStartY[i]} - Present`}</td>
                :
                board_experience.boardStartM.length && board_experience.boardStartY.length && board_experience.boardEndM.length && board_experience.boardEndY.length &&<td style={{width:'200px'}}>{`${board_experience.boardStartM[i].substring(0, 3)} ${board_experience.boardStartY[i]} - ${board_experience.boardEndM[i].substring(0, 3)} ${board_experience.boardEndY[i]}`}</td>
                }
                <td>
                    <b>{board_experience && board_experience.boardType.length && board_experience.boardName.length &&`${board_experience.boardName[i]}, ${board_experience.boardType[i]}`}</b>
                </td>
            </tr>
        )
    }
    return (
        <div id="TempHolder" style={{padding:0}}>
            <div id="ResumeTemplate2" className="text-justify ResumeTemplate">
                <div className="top-wrap" style={{background: '#232329',color:'#FFFFFF',padding: '10px 30px'}}>
                    <h3 className="name">{`${basicInfo.first_name} ${basicInfo.last_name}`}</h3>
                    <p className="job-title">{work_experience.designations&&work_experience.designations.length?work_experience.designations[0]:null}</p>
                    <div className="col-sm-5">
                            <p className="icon-info"><span className="fa fa-phone"> {` ${basicInfo.dial_code||''} ${basicInfo.phone||''}`}</span></p>
                            <p className="icon-info"><span className="fa fa-envelope"> {` ${basicInfo.email}`}</span></p>
                        </div>
                         <div className="col-sm-5">
                            {social_links&&social_links.linkedin ? <p className="icon-info"><span className="fa fa-linkedin"> {` ${social_links.linkedin}`}</span></p> : null}
                            {social_links&&social_links.twitter ? <p className="icon-info"><span className="fa fa-twitter"> {` ${social_links.twitter}`}</span></p> : null}
                        </div>
                    <div className="row clearfix">
                        {/* <div className="col-sm-5">
                            <p className="icon-info"><span className="fa fa-phone"> {` ${basicInfo.dial_code||''} ${basicInfo.phone||''}`}</span></p>
                            <p className="icon-info"><span className="fa fa-envelope"> {` ${basicInfo.email}`}</span></p>
                        </div>
                        <div className="col-sm-5">
                            {social_links&&social_links.linkedin ? <p className="icon-info"><span className="fa fa-linkedin"> {` ${social_links.linkedin}`}</span></p> : null}
                            {social_links&&social_links.twitter ? <p className="icon-info"><span className="fa fa-twitter"> {` ${social_links.twitter}`}</span></p> : null}
                        </div> */}
                    </div>
                </div>
                <div className="bottom-wrap" style={{padding:'15px 30px'}}>
                    <div className="work-exp">
                        <table style={{width:'100%'}}>
                            <tbody>
                                <tr>
                                    <td>
                                        {personal_details && personal_details.aboutMe ? <span className="quills"> {parse(personal_details.aboutMe)}</span> : <span></span>}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="work-exp">
                        <p style={{marginTop:'30px',fontWeight:'bold'}}><span className="fa fa-briefcase"></span> EXPERIENCE</p>
                        <div className="table-holder" style={{marginBottom: '30px'}}>
                            <table style={{width:'100%'}}>
                                <tbody>
                                    {workExpRows}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {board_experience && board_experience.boardType.length && board_experience.boardName.length?
                    <div className="work-exp">
                        <p style={{marginTop:'30px',fontWeight:'bold'}}><span className="fa fa-users"></span> BOARD EXPERIENCE</p>
                        <div className="table-holder" style={{marginBottom: '30px'}}>
                            <table style={{width:'100%'}}>
                                <tbody>
                                    {boardExpRows}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    :
                    null
                    }
                    <div className="work-exp">
                        <p style={{marginTop:'30px',fontWeight:'bold'}}><span className="fa fa-graduation-cap"></span> EDUCATION</p>
                        <div className="table-holder" style={{marginBottom: '30px'}}>
                            <table style={{width:'100%'}}>
                                <tbody>
                                    {educationRows}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="work-exp">
                        <p style={{marginTop:'30px',fontWeight:'bold'}}><span className="fa fa-book"></span> CERTIFICATIONS</p>
                        <div className="table-holder" style={{marginBottom: '30px'}}>
                            <table style={{width:'100%'}}>
                                <tbody>
                                    {certificationRows}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="work-exp">
                        <p style={{marginTop:'30px',fontWeight:'bold'}}><span className="fa fa-puzzle-piece"></span> SKILLS</p>
                        <div className="table-holder" style={{marginBottom: '30px'}}>
                            <table style={{width:'100%'}}>
                                <tbody>
                                    {skillRows}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ResumeTemplate2