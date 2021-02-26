import React from 'react';
import '../Dashboard.css';
import { connect } from "react-redux";
import store from '../../../redux/store';
import { updateCurrentResume } from '../../../redux/actions';
import ResumeTemplate1 from '../templates/ResumeTemplate1';
import ResumeTemplate2 from '../templates/ResumeTemplate2';
import ResumeTemplate4 from '../templates/ResumeTemplate4';
import ResumeTemplate5 from '../templates/ResumeTemplate5';
import { postCall } from '../../../utils/api.config';
import { GENERATE_PDF } from '../../../utils/constants';
import { toast } from 'react-toastify';

const mapStateToProps = state => {
    return state
};

const ConnectedResumeBuild = (state) => {
    const { selectedResume } = state.resumeBuilder
    const resumeArray = ['resume-template1', 'resume-template2', 'resume-template4', 'resume-template5']
    return (
        <div id="ResumeBuild">
            <div className="row">
                <div className="col-sm-3 text-center">
                    <h3>Choose Resume</h3>
                    <ul className="resume-selector">
                        {resumeArray.map(i =>
                            <li id={i} key={i} onClick={showThisResume.bind(this, i)} className={selectedResume === i ? 'this-resume' : ''}>
                                <img className="fit-layout" src={require(`../../../images/banners/${i}.jpg`)} alt="" />
                            </li>
                        )}
                    </ul>
                </div>
                <div className="col-sm-9">
                    <div className="text-center">
                        {selectedResume.toUpperCase() === "RESUME-TEMPLATE1" && <ResumeTemplate1 data={state} />}
                        {selectedResume.toUpperCase() === "RESUME-TEMPLATE2" && <ResumeTemplate2 data={state} />}
                        {selectedResume.toUpperCase() === "RESUME-TEMPLATE4" && <ResumeTemplate4 data={state} />}
                        {selectedResume.toUpperCase() === "RESUME-TEMPLATE5" && <ResumeTemplate5 data={state} />}
                        <button className="btn-general" onClick={generatePDF.bind()}>Create PDF</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
const showThisResume = (resume) => {
    store.dispatch(updateCurrentResume(resume))
}
const generatePDF = () => {
    let eles = document.getElementById('TempHolder').innerHTML
    let content=`<html><head><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"><style>body{font-size:0.6em;font-family:Arial,Halvetica,sans-serif}table{font-size:1em}</style></head><body>${eles}</body></html>`
    postCall(GENERATE_PDF, {content}, { sfn: pdfGenerated, efn: pdfGenFailed })
}
const pdfGenerated=(data)=>{
    window.open(data.response, "_blank");
}
const pdfGenFailed=()=>{
    toast.error('Server failed to generate PDF')
}

const ResumeBuild = connect(mapStateToProps)(ConnectedResumeBuild);

export default ResumeBuild;