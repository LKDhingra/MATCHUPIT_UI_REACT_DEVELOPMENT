import React from 'react';
import './Templates.css';
import parse from 'html-react-parser'

const ResumeTemplate4 = (props) => {
    const { basicInfo, profile } = props.data
    const { education, certifications, work_experience, personal_details, social_links, board_experience } = profile
    let workExpRows = []
    for (let i = 0; i < work_experience.orgNames.length; i++) {
        workExpRows.push(
            <tr key={`work_experience-${i}`}>
                <td>
                    <p className="orgs-name">{`${work_experience.orgNames[i]}`}</p>
                    <p className="job-title">{work_experience.role && work_experience.role ? work_experience.role[i] : null}{work_experience.designations && work_experience.designations.length ? `, ${work_experience.designations[i]}` : null}{work_experience.tillDate[i] ? `, ${work_experience.startM[i].substring(0, 3)} ${work_experience.startY[i]} - Present` : `, ${work_experience.startM[i].substring(0, 3)} ${work_experience.startY[i]} - `}{work_experience.endM[i]==='Currently Working'||work_experience.endY[i]==='Currently Working'?'Present':<span>{work_experience.endM[i].substring(0, 3)} {work_experience.endY[i]}</span>}</p>
                    {work_experience.rnrs[i].length ?
                        <span className="quills">{work_experience.rnrs && work_experience.rnrs.length && work_experience.rnrs[i] && work_experience.rnrs[i].length ?
                            parse(work_experience.rnrs[i]) : null}
                        </span>
                        :
                        null
                    }
                </td>
            </tr>)
    }
    let educationRows = []
    for (let i = 0; i < education.degree.length; i++) {
        educationRows.push(
            <tr key={`education-${i}`}>
                <td>
                    <p className="job-title">{`${education.degree[i]}, ${education.special[i]}, ${education.institute[i]}`}, {`${education.endY[i]}`}</p>
                </td>
            </tr>)
    }
    let certificationRows = []
    for (let i = 0; i < certifications.name.length; i++) {
        certificationRows.push(
            <tr key={`certification-${i}`}>
                <td>
                    <p className="job-title">{certifications.name[i]} : {certifications.endM[i] === "Skip" ? '' : certifications.endM[i].substring(0, 3)} {certifications.endY[i] === "Skip" ? '' : certifications.endY[i]}</p>
                </td>
            </tr>)
    }

    let Pskills = [], Oskills = []
    for (let i = 0; i < work_experience.orgNames.length; i++) {
        work_experience.skillsP && work_experience.skillsP.length ? Pskills = [...new Set([...work_experience.skillsP[i], ...Pskills])] : Pskills = [...Pskills]
        work_experience.skillsO && work_experience.skillsO.length ? Oskills = [...new Set([...work_experience.skillsO[i], ...Oskills])] : Oskills = [...Oskills]
    }

    let skillRows = []
    skillRows.push(
        <span className="skills" key="skills">
            <p style={{fontWeight:'bold', fontSize:'1.2em'}}>Primary Skills:</p>
            {Pskills && Pskills.length ? <p>{Pskills.toString().replace(/,/g, ' | ')}</p> : null}
            <p style={{fontWeight:'bold', fontSize:'1.2em'}}>Other/Technical Skills:</p>
            {Oskills && Oskills.length ? <p>{Oskills.toString().replace(/,/g, ' | ')}</p> : null}
        </span>
    )
    let boardExpRows = []
    for (let i = 0; i < board_experience.boardName.length; i++) {
        boardExpRows.push(
            <tr key={`board_experience-${i}`}>
                <td>
                    {board_experience && board_experience.boardType.length && board_experience.boardName.length && board_experience.boardStartM.length && board_experience.boardStartY.length && board_experience.boardEndM.length && board_experience.boardEndY.length && `${board_experience.boardName[i]}, ${board_experience.boardType[i]}, ${board_experience.boardStartY[i]} - ${board_experience.stillMember[i] ? 'Present' : `${board_experience.boardEndY[i]}`}`}
                </td>
            </tr>
        )
    }
    return (
        <div id="TempHolder">
            <div id="ResumeTemplate4" className="text-left ResumeTemplate">
                <div style={{textAlign:'center',fontSize:'24px', fontWeight:500, marginBottom:'10px'}}>{`${basicInfo.first_name} ${basicInfo.last_name}`}</div>
                <p style={{textAlign:'center'}}>
                    {`${basicInfo.city ? basicInfo.city : ''}, ${basicInfo.state !== '' ? basicInfo.state : ''} ${basicInfo.zipcode ? basicInfo.zipcode : ''}, ${basicInfo.country_name !== '-1' ? basicInfo.country_name : ''}`}
                    <br />
                    {`${basicInfo.dial_code||''} ${basicInfo.phone||''}`}
                    <br />
                    {`${basicInfo.email ? basicInfo.email : ''}`} {social_links && social_links.linkedin ? ` | ${social_links.linkedin}` : null} {social_links && social_links.twitter ? ` | ${social_links.twitter}` : null}
                </p>
                <p><b>{work_experience.designations && work_experience.designations.length ? work_experience.designations[0] : null}</b></p>
                <div className="row clearfix">
                    <div className="col-sm-12">
                        <p style={{fontWeight:'bold', fontSize:'1.2em'}}>Summary</p>
                        {personal_details && personal_details.aboutMe ? <span style={{textAlign:'justify'}}> {parse(personal_details.aboutMe)}</span> : <span></span>}
                    </div>
                </div>
                <div>
                    {skillRows}
                </div>
                <div>
                    <p style={{fontWeight:'bold', fontSize:'1.2em'}}>Professional Experience</p>
                    <table style={{width:"100%"}}>
                        <tbody>
                            {workExpRows}
                        </tbody>
                    </table>
                </div>
                {board_experience && board_experience.boardType.length && board_experience.boardName.length ?
                    <div>
                        <p style={{fontWeight:'bold', fontSize:'1.2em'}}>Board Experience</p>
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
                    <p style={{fontWeight:'bold', fontSize:'1.2em'}}>Education</p>
                    <table style={{width:"100%"}}>
                        <tbody>
                            {educationRows}
                        </tbody>
                    </table>
                </div>
                <div>
                    <p style={{fontWeight:'bold', fontSize:'1.2em'}}>Certifications</p>
                    <table style={{width:"100%"}}>
                        <tbody>
                            {certificationRows}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default ResumeTemplate4