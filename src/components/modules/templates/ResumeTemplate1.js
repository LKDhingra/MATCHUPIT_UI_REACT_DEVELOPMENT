import React from 'react';
import './Templates.css';
import parse from 'html-react-parser'

const ResumeTemplate1 = (props) => {
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
                <p><b>{work_experience.role&&work_experience.role?work_experience.role[i]:null}</b></p>
                <p>{`${work_experience.orgNames[i]}`}</p>
                <span>{work_experience.rnrs&&work_experience.rnrs.length&&work_experience.rnrs[i]&&work_experience.rnrs[i].length?
                    parse(work_experience.rnrs[i]):null}
                </span>
            </td>
        </tr>)
    }
    let educationRows = []
    for (let i = 0; i < education.degree.length; i++) {
        educationRows.push(
        <tr key={`education-${i}`} style={{verticalAlign:'top', paddingBottom:'15px'}}>
            <td style={{width:'200px'}}>{`${education.startM[i].substring(0, 3)} ${education.startY[i]} - ${education.endM[i].substring(0, 3)} ${education.endY[i]}`}</td>
            <td>
                <p><b>{`${education.degree[i]}, ${education.special[i]}, ${education.institute[i]}`}</b></p>
            </td>
        </tr>)
    }
    let certificationRows = []
    for (let i = 0; i < certifications.name.length; i++) {
        certificationRows.push(
            <tr key={`certification-${i}`} style={{verticalAlign:'top', paddingBottom:'15px'}}>
                <td style={{width:'200px'}}>{certifications.endM[i]==="Skip"?'':certifications.endM[i].substring(0, 3)} {certifications.endY[i]==="Skip"?'':certifications.endY[i]}</td>
                <td>
                    <p><b>{certifications.name[i]}</b></p>
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
        <tr key="skills" style={{verticalAlign:'top', paddingBottom:'15px'}}>
            <td>
                {Pskills&&Pskills.length ? <p><b>Primary Skills:</b> {Pskills.toString().replace(/,/g, ', ')}</p> : null}
                {Oskills&&Oskills.length ? <p><b>Other Skills:</b> {Oskills.toString().replace(/,/g, ', ')}</p> : null}
            </td>
        </tr>
    )
    let boardExpRows = []
    for(let i=0; i<board_experience.boardName.length; i++){
        boardExpRows.push(
            <tr key={`board_experience-${i}`} style={{verticalAlign:'top', paddingBottom:'15px'}}>
                {board_experience.stillMember[i]?
                board_experience.boardStartM.length && board_experience.boardStartY.length && board_experience.boardEndM.length && board_experience.boardEndY.length &&<td style={{width:'200px'}}>{`${board_experience.boardStartM[i].substring(0, 3)} ${board_experience.boardStartY[i]} - Present`}</td>
                :
                board_experience.boardStartM.length && board_experience.boardStartY.length && board_experience.boardEndM.length && board_experience.boardEndY.length &&<td style={{width:'200px'}}>{`${board_experience.boardStartM[i].substring(0, 3)} ${board_experience.boardStartY[i]} - ${board_experience.boardEndM[i].substring(0, 3)} ${board_experience.boardEndY[i]}`}</td>
                }
                <td>
                    <b>{board_experience && board_experience.boardType.length && board_experience.boardName.length && `${board_experience.boardName[i]}, ${board_experience.boardType[i]}`}</b>
                </td>
            </tr>
        )
    }
    return (
        <div id="TempHolder">
            <div id="ResumeTemplate1" className="text-left ResumeTemplate">
                <div style={{fontSize:'24px', fontWeight:500, marginBottom:'10px'}}>{`${basicInfo.first_name} ${basicInfo.last_name}`}</div>
                <p style={{fontWeight:'bold'}}>{work_experience.designations&&work_experience.designations.length?work_experience.designations[0]:null}</p>
                <table style={{width:"100%"}}>
                    <tbody>
                        <tr style={{verticalAlign:'top', paddingBottom:'15px'}}>
                            <td><p><span className="fa fa-phone"> </span>{` ${basicInfo.dial_code||''} ${basicInfo.phone||''}`}</p></td>
                            <td>{social_links&&social_links.linkedin ? <p><span className="fa fa-linkedin"> </span>{` ${social_links.linkedin}`}</p> : null}</td>
                        </tr>
                        <tr style={{verticalAlign:'top', paddingBottom:'15px'}}>
                            <td><p><span className="fa fa-envelope"> </span>{` ${basicInfo.email}`}</p></td>
                            <td>{social_links&&social_links.twitter ? <p><span className="fa fa-twitter"> </span>{` ${social_links.twitter}`}</p> : null}</td>
                        </tr>
                    </tbody>
                </table>
                <div className="row">
                    <div className="col-sm-12">
                        {personal_details && personal_details.aboutMe ? <span style={{textAlign:'justify'}}> {parse(personal_details.aboutMe)}</span> : <span></span>}
                    </div>
                </div>
                <div>
                    <p style={{marginTop:'30px',fontWeight:'bold',borderBottom: '1px solid #AAAAAA'}}><span className="fa fa-briefcase"></span> EXPERIENCE</p>
                    <table style={{width:"100%"}}>
                        <tbody>
                            {workExpRows}
                        </tbody>
                    </table>
                </div>
                {board_experience && board_experience.boardType.length && board_experience.boardName.length?
                <div>
                    <p style={{marginTop:'30px',fontWeight:'bold',borderBottom: '1px solid #AAAAAA'}}><span className="fa fa-users"></span> BOARD EXPERIENCE</p>
                    <table style={{width:"100%"}}>
                        <tbody>
                            {boardExpRows}
                        </tbody>
                    </table>
                </div>
                :
                null
                }
                <div>
                    <p style={{marginTop:'30px',fontWeight:'bold',borderBottom: '1px solid #AAAAAA'}}><span className="fa fa-graduation-cap"></span> EDUCATION</p>
                    <table style={{width:"100%"}}>
                        <tbody>
                            {educationRows}
                        </tbody>
                    </table>
                </div>
                <div>
                    <p style={{marginTop:'30px',fontWeight:'bold',borderBottom: '1px solid #AAAAAA'}}><span className="fa fa-certificate"></span> CERTIFICATIONS</p>
                    <table style={{width:"100%"}}>
                        <tbody>
                            {certificationRows}
                        </tbody>
                    </table>
                </div>
                <div>
                    <p style={{marginTop:'30px',fontWeight:'bold',borderBottom: '1px solid #AAAAAA'}}><span className="fa fa-puzzle-piece"></span> SKILLS</p>
                    <table style={{width:"100%"}}>
                        <tbody>
                            {skillRows}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default ResumeTemplate1