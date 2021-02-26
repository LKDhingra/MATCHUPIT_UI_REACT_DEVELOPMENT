import React from 'react';
import './Templates.css';

const ResumeTemplate3 = (props) => {
    const { basicInfo, profile } = props.data
    const { education, certifications, work_experience, personal_details } = profile
    let workExpRows = []
    for (let i = 0; i < work_experience.orgNames.length; i++) {
        workExpRows.push(
        <div key={`work_experience-${i}`} className="table-blocks">
            <p className="time-line">{`${work_experience.startM[i]},${work_experience.startY[i]} to ${work_experience.endM[i]},${work_experience.endY[i]}`}</p>
            <p className="job-title">{work_experience.jobTitles&&work_experience.jobTitles?work_experience.jobTitles[i]:null}</p>
            <p className="orgs-name">{`@ ${work_experience.orgNames[i]} (${work_experience.designations[i]})`}</p>
            <span>Roles &amp; Responsibilities and Technologies</span>
            <ul className="skills">
                {work_experience.industry&&work_experience.industry.length ? <li>Belong to {work_experience.industry[i]} industry</li> : null}
                {work_experience.role&&work_experience.role.length ? <li>Working as {work_experience.role[i]}</li> : null}
                {work_experience.rnrs&&work_experience.rnrs.length ?<li>{work_experience.rnrs[i]}</li>:null}
                {work_experience.skillsP&&work_experience.skillsP.length ? <li>Primary Skills: {work_experience.skillsP[i].toString().replace(/,/g, ', ')}</li> : null}
                {work_experience.skillsO&&work_experience.skillsO.length ? <li>Other Skills: {work_experience.skillsO[i].toString().replace(/,/g, ', ')}</li> : null}
            </ul>
        </div>)
    }
    let educationRows = []
    for (let i = 0; i < education.degree.length; i++) {
        educationRows.push(
        <div key={`education-${i}`} className="table-blocks">
            <p className="time-line">{`${education.startM[i]},${education.startY[i]} to ${education.endM[i]},${education.endY[i]}`}</p>
            <p className="job-title">{`${education.degree[i]} in ${education.special[i]}, from ${education.institute[i]}`}</p>
        </div>)
    }
    let certificationRows = []
    for (let i = 0; i < certifications.name.length; i++) {
        certificationRows.push(
        <div key={`certification-${i}`} className="table-blocks">
            <p className="time-line">{certifications.endM[i]==="Select"?'':certifications.endM[i].substring(0, 3)} {certifications.endY[i]==="Select"?'':certifications.endY[i]}</p>
            <p className="job-title">{certifications.name[i]}</p>
        </div>)
    }
    return (
        <div id="ResumeTemplate3" className="text-left ResumeTemplate">
            <div className="water-mark"><img src={require('../../../images/icons/logo.png')} className="fit-layout" alt="" /></div>
            <div className="row">
                <div className="col-xs-3">
                    <div className="profile-pic-resume">
                        <img src={basicInfo.profile_pic} className="fit-layout rounded" alt=""/>
                    </div>
                    <ul className="contacts">
                        <li><i className="fa fa-envelope"></i> {basicInfo.email}</li>
                        <li><i className="fa fa-phone"></i> {basicInfo.phone}</li>
                        <li><i className="fa fa-map-marker"></i> {`${basicInfo.address_line}, ${basicInfo.city}, ${basicInfo.state}, ${basicInfo.country_name}, ${basicInfo.zipcode}`}</li>
                    </ul>
                    <h4 className="headers">SKILLS</h4><hr className="head-underliner"/>
                    {work_experience.skillsP&&work_experience.skillsP.length&&
                    <ul className="skills-list">
                        {work_experience.skillsP.join().replace(/ /g,'').split(',').filter((v, i, a) => a.indexOf(v) === i).map(i=>(<li key={i}>{i}</li>))}
                    </ul>}
                    {work_experience.skillsO&&work_experience.skillsO.length&&
                    <ul className="skills-list">
                        {work_experience.skillsO.join().replace(/ /g,'').split(',').filter((v, i, a) => a.indexOf(v) === i).map(i=>(<li key={i}>{i}</li>))}
                    </ul>}
                </div>
                <div className="col-xs-9">
                    <div className="main-intro">
                        <h3>{`${basicInfo.first_name} ${basicInfo.last_name}`}</h3>
                        <h6>{work_experience.jobTitles[0]}</h6>
                        <h5>{personal_details.aboutMe}</h5>
                    </div>
                    <div className="work-exps">
                        <h4 className="headers">WORK EXPERIENCES</h4><hr className="head-underliner"/>
                        {workExpRows}
                    </div>
                    <div className="work-exps">
                        <h4 className="headers">EDUCATION</h4><hr className="head-underliner"/>
                        {educationRows}
                    </div>
                    <div className="work-exps">
                        <h4 className="headers">CERTIFICATIONS</h4><hr className="head-underliner"/>
                        {certificationRows}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ResumeTemplate3