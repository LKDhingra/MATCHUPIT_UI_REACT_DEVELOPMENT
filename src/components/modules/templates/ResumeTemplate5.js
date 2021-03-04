import React from 'react';
import './Templates.css';
import parse from 'html-react-parser'

const ResumeTemplate5 = (props) => {
    const { basicInfo, profile } = props.data
    const { education, certifications, work_experience, personal_details, social_links, board_experience } = profile
    let workExpRows = []
    for (let i = 0; i < work_experience.orgNames.length; i++) {
        workExpRows.push(
            <tr key={`work_experience-${i}`}>
                <td>
                    <p className="orgs-name">{`${work_experience.orgNames[i]}`}</p>
                    <p className="job-title">{work_experience.role && work_experience.role ? work_experience.role[i] : null}</p>
                    {work_experience.rnrs[i].length ?
                        <span className="quills">{work_experience.rnrs && work_experience.rnrs.length && work_experience.rnrs[i] && work_experience.rnrs[i].length ?
                            parse(work_experience.rnrs[i]) : null}
                        </span>
                        :
                        null
                    }
                </td>
                {work_experience.tillDate[i] ?
                    <td className="time-line" style={{ width: '200px' }}>{`${work_experience.startM[i].substring(0, 3)} ${work_experience.startY[i]} - Present`}</td>
                    :
                    <td className="time-line" style={{ width: '200px' }}>{`${work_experience.startM[i].substring(0, 3)} ${work_experience.startY[i]} - `}{work_experience.endM[i] === 'Currently Working' || work_experience.endY[i] === 'Currently Working' ? 'Present' : <span>{work_experience.endM[i].substring(0, 3)} {work_experience.endY[i]}</span>}</td>
                }
            </tr>)
    }
    let educationRows = []
    for (let i = 0; i < education.degree.length; i++) {
        educationRows.push(
            <tr key={`education-${i}`}>
                <td>
                    <p className="job-title">{`${education.degree[i]}, ${education.special[i]}, ${education.institute[i]}`}</p>
                </td>
                <td className="time-line" style={{ width: '200px' }}>{`${education.startM[i].substring(0, 3)} ${education.startY[i]} - ${education.endM[i].substring(0, 3)} ${education.endY[i]}`}</td>
            </tr>)
    }
    let certificationRows = []
    for (let i = 0; i < certifications.name.length; i++) {
        certificationRows.push(
            <tr key={`certification-${i}`}>
                <td>
                    <p className="job-title">{certifications.name[i]}</p>
                </td>
                <td className="time-line" style={{ width: '200px' }}>{certifications.endM[i] === "Skip" ? '' : certifications.endM[i].substring(0, 3)} {certifications.endY[i] === "Skip" ? '' : certifications.endY[i]}</td>
            </tr>)
    }
    let careerSnapshot = []
    for (let i = 0; i < work_experience.orgNames.length; i++) {
        careerSnapshot.push(
            <p key={`careersnapshot-${i}`}>
                {work_experience.role && work_experience.role.length ? <span>{work_experience.role[i]}, </span> : null}
                {`${work_experience.orgNames[i]}, ${work_experience.designations[i]}`}
                {work_experience.tillDate[i] ?
                    <span>{`: ${work_experience.startM[i].substring(0, 3)} ${work_experience.startY[i]} - Present`}</span>
                    :
                    <span>{`: ${work_experience.startM[i].substring(0, 3)} ${work_experience.startY[i]} - `}{work_experience.endM[i] === 'Currently Working' || work_experience.endY[i] === 'Currently Working' ? 'Present' : <span>{work_experience.endM[i].substring(0, 3)} {work_experience.endY[i]}</span>}</span>
                }

            </p>
        )
    }
    let Pskills = [], Oskills = []
    for (let i = 0; i < work_experience.orgNames.length; i++) {
        work_experience.skillsP && work_experience.skillsP.length ? Pskills = [...new Set([...work_experience.skillsP[i], ...Pskills])] : Pskills = [...Pskills]
        work_experience.skillsO && work_experience.skillsO.length ? Oskills = [...new Set([...work_experience.skillsO[i], ...Oskills])] : Oskills = [...Oskills]
    }
    let coreCompetencies = []
    coreCompetencies.push(
        <span key={"corecompetencies"}>
            <p>{Pskills && Pskills.length ? <span><strong>Primary Skills:</strong> {Pskills.toString().replace(/,/g, ' | ')}</span> : null}</p>
            <p>{Oskills && Oskills.length ? <span><strong>Other/Technical Skills:</strong> {Oskills.toString().replace(/,/g, ' | ')}</span> : null}</p>
        </span>
    )
    let boardExpRows = []
    for (let i = 0; i < board_experience.boardName.length; i++) {
        boardExpRows.push(
            <tr key={`board_experience-${i}`}>
                <td>
                    <p>{board_experience && board_experience.boardType.length && board_experience.boardName.length && board_experience.boardStartM.length && board_experience.boardStartY.length && board_experience.boardEndM.length && board_experience.boardEndY.length && `${board_experience.boardType[i]} in ${board_experience.boardName[i]}`}</p>
                </td>
                {board_experience.stillMember[i] ?
                    board_experience.boardStartM.length && board_experience.boardStartY.length && board_experience.boardEndM.length && board_experience.boardEndY.length && <td className="time-line" style={{ width: '200px' }}>{`${board_experience.boardStartM[i].substring(0, 3)} ${board_experience.boardStartY[i]} - Present`}</td>
                    :
                    board_experience.boardStartM.length && board_experience.boardStartY.length && board_experience.boardEndM.length && board_experience.boardEndY.length && <td className="time-line" style={{ width: '200px' }}>{`${board_experience.boardStartM[i].substring(0, 3)} ${board_experience.boardStartY[i]} - ${board_experience.boardEndM[i].substring(0, 3)} ${board_experience.boardEndY[i]}`}</td>
                }
            </tr>
        )
    }
    return (
        <div id="TempHolder">
            <div id="ResumeTemplate5" className="text-left ResumeTemplate">
                <div style={{ borderBottom: '1px solid #AAAAAA' }}>
                    <div style={{ textAlign: 'center', fontSize: '24px', fontWeight: 500, marginBottom: '10px' }}>{`${basicInfo.first_name} ${basicInfo.last_name}`}</div>
                    <div className="row clearfix" >
                        <div className="col-sm-4">{basicInfo.city ? basicInfo.city : ''}, {basicInfo.state !== '' ? basicInfo.state : ''} {basicInfo.zipcode ? basicInfo.zipcode : ''}, {basicInfo.country_name !== '-1' ? basicInfo.country_name : ''}</div>
                        <div className="col-sm-4">{basicInfo.email ? `${basicInfo.email}` : ''}</div>
                        <div className="col-sm-4">{`${basicInfo.dial_code || ''} ${basicInfo.phone || ''}`}</div>
                    </div>
                    <div className="row clearfix text-center" style={{ textAlign: 'center' }}>
                        <div className="col-sm-12">{social_links && social_links.linkedin ? `${social_links.linkedin}` : null} | {social_links && social_links.twitter ? `${social_links.twitter}` : null}</div>
                    </div>
                </div>
                <div className="borderbottom" style={{ borderBottom: '1px solid #AAAAAA' }}>
                    <p style={{ textAlign: 'center', marginTop: '10px' }}><b style={{ textTransform: 'uppercase' }}>{work_experience.designations && work_experience.designations.length ? work_experience.designations[0] : null}</b></p>
                    <div className="row clearfix" style={{ textAlign: 'justify', fontSize: '1.em', lineHeight: '1.4' }}>
                        <div className="col-sm-12" style={{ fontSize: '15px' }}>
                            {personal_details && personal_details.aboutMe ? <span className="quills"> {parse(personal_details.aboutMe)}</span> : <span></span>}
                        </div>
                    </div>
                </div>
                <div style={{ borderBottom: '1px solid #AAAAAA' }}>
                    <p style={{ textAlign: 'center', fontWeight: 'bold', textTransform: 'uppercase', marginTop: '10px' }}>CAREER SNAPSHOT</p>
                    {careerSnapshot}
                </div>
                <div style={{ borderBottom: '1px solid #AAAAAA' }}>
                    <p style={{ textAlign: 'center', fontWeight: 'bold', textTransform: 'uppercase', marginTop: '10px' }}>CORE COMPETENCIES</p>
                    {coreCompetencies}
                </div>
                <div style={{ borderBottom: '1px solid #AAAAAA' }}>
                    <p style={{ textAlign: 'center', fontWeight: 'bold', textTransform: 'uppercase', marginTop: '10px' }}>PROFESSIONAL EXPERIENCE</p>
                    <table style={{ width: '100%' }}>
                        <tbody>
                            {workExpRows}
                        </tbody>
                    </table>
                </div>
                {board_experience && board_experience.boardType.length && board_experience.boardName.length ?
                    <div style={{ borderBottom: '1px solid #AAAAAA' }}>
                        <p style={{ textAlign: 'center', fontWeight: 'bold', textTransform: 'uppercase', marginTop: '10px' }}>BOARD EXPERIENCE</p>
                        <table style={{ width: '100%' }}>
                            <tbody>
                                {boardExpRows}
                            </tbody>
                        </table>
                    </div>
                    :
                    null
                }
                <div style={{ borderBottom: '1px solid #AAAAAA' }}>
                    <p style={{ textAlign: 'center', fontWeight: 'bold', textTransform: 'uppercase', marginTop: '10px' }}>EDUCATION</p>
                    <table style={{ width: '100%' }}>
                        <tbody>
                            {educationRows}
                        </tbody>
                    </table>
                </div>
                <div>
                    <p style={{ textAlign: 'center', fontWeight: 'bold', textTransform: 'uppercase', marginTop: '10px' }}>CERTIFICATIONS</p>
                    <table style={{ width: '100%' }}>
                        <tbody>
                            {certificationRows}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default ResumeTemplate5