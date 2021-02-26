import React from 'react';
import './Questionnaire.css';
import "react-datepicker/dist/react-datepicker.css";
import { alphaOnly, emailInFormat, numOnly, alphaNumOnlyWithSpace } from '../../../utils/validators';
import { getCall, putCall, postCall } from '../../../utils/api.config';
import { QUESTIONS, PROFILE, HEAD_SHOT, FILE_UPLOAD } from '../../../utils/constants';
import { updateUserName, updatePhoneNo, updateRecoveryEmail, setAboutMe, updateCountryName, updateStateName, updateCityName, updateZipcode, updateAddressLine, updateCitizenship, updateDateOfBirth, setProfileCompletion, newWorkAuth, updateLiveVideo, updateDialCode, setEducationObj, setCertificationObj, setWorkExpObj } from '../../../redux/actions';
import store from '../../../redux/store';
import update from "immutability-helper";
import Webcam from 'react-webcam';
import ChatLoader from '../../shared/ChatLoader';
import { toast } from 'react-toastify';

class Questionnaire extends React.Component {
    constructor(props) {
        super(props)
        this.responseRef = React.createRef();
        this.preResRef = React.createRef();
        this.chatWindow = React.createRef();
        this.webcamRef = React.createRef();
        this.state = {
            currQues: 0,
            conversation: [],
            isRecording: false,
            videoCameraOn: false,
            countdown: 60,
            inputType: 'NA',
            allAnswered: false,
            errInResponse: false,
            errorInfo: "",
            questionsList: [],
            aboutMe: '',
            workAuthObj: { countryList: [], authType: [], sponsor: [], authExp: [] },
            educationObj: { degree: [], institute: [], special: [], startM: [], startY: [], endM: [], endY: [], activities: [], societies: [] },
            certificationObj: { name: [], endY: [], endM: [], copy: [] },
            workExpObj: { currentlyWorking: '',industry: [], orgNames: [], designations: [], jobTitles: [], skillsP: [], skillsO: [], rnrs: [], startM: [], endM: [], startY: [], endY: [], tillDate: [], empType: [] },
            mediaObj: { headshot: {}, videoshot: {} },
            isLoading: false
        }

        this.videoConstraints = {
            width: 300,
            height: 200,
            facingMode: "user"
        };
    }
    componentDidMount() {
        getCall(QUESTIONS, {}, { sfn: this.postQuestionsFetch, efn: this.errQuestionsFetch })
    }
    turnCameraOn = () => {
        this.setState({ videoCameraOn: true })
        let constraintObj = {
            audio: true,
            video: {
                facingMode: "user",
                width: 400,
                height: 300
            }
        };
        if (navigator.mediaDevices === undefined) {
            navigator.mediaDevices = {};
            navigator.mediaDevices.getUserMedia = function (constraintObj) {
                let getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
                if (!getUserMedia) {
                    return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
                }
                return new Promise(function (resolve, reject) {
                    getUserMedia.call(navigator, constraintObj, resolve, reject);
                });
            }
        }
        let localstream;
        navigator.mediaDevices.getUserMedia(constraintObj)
            .then((mediaStreamObj) => {
                let video = document.querySelector('video');
                if ("srcObject" in video) {
                    video.srcObject = mediaStreamObj;
                    video.muted = true
                    localstream = video.srcObject
                } else {
                    video.src = window.URL.createObjectURL(mediaStreamObj);
                }
                video.onloadedmetadata = function (ev) {
                    video.play();
                };
                let start = document.getElementById('btnStart');
                let stop = document.getElementById('btnStop');
                let mediaRecorder = new MediaRecorder(mediaStreamObj, { mimeType: 'video/webm;codecs=vp8,opus' });
                let chunks = [];
                start.addEventListener('click', (ev) => {
                    mediaRecorder.start();
                    this.setState({ isRecording: true })
                    const myTimer = () => {
                        if (this.state.isRecording) {
                            if (this.state.countdown > 0) {
                                this.setState({ countdown: this.state.countdown - 1 })
                            } else {
                                mediaRecorder.stop()
                                clearInterval(newInterval)
                                let x = navigator.mediaDevices
                            }
                        } else {
                            clearInterval(newInterval)
                        }
                    }
                    let newInterval = setInterval(myTimer, 1000);
                })
                stop.addEventListener('click', (ev) => {
                    mediaRecorder.stop();
                    let x = navigator.mediaDevices
                });
                mediaRecorder.ondataavailable = (ev) => {
                    chunks.push(ev.data);
                }
                mediaRecorder.onstop = (ev) => {
                    this.setState({ isRecording: false, countdown: 60, videoCameraOn: false })
                    let blob = new Blob(chunks, { 'type': 'video/webm;' });
                    chunks = [];
                    const formData = new FormData()
                    blob.lastModifiedDate = new Date();
                    blob.name = 'videoshot';
                    formData.append('file', blob)
                    const stream = video.srcObject;
                    const tracks = stream.getTracks();
                    tracks.forEach(function (track) {
                        track.stop();
                    });
                    video.srcObject = null;
                    this.setState({ isLoading: true })
                    postCall(FILE_UPLOAD, formData, { sfn: this.postVideoUpload, efn: this.postVideoUploadFail }, 'video')
                }
            })
            .catch(function (err) {
                console.log(err.name, err.message);
            });
    }
    postVideoUpload = (data) => {
        this.setState({ mediaObj: { ...{ ...this.state.mediaObj, videoshot: data.fileUrl } }, isLoading: false });
        store.dispatch(updateLiveVideo(data.fileUrl))
        setTimeout(() => {
            this.updateConversation.call()
            putCall(PROFILE, { media: this.state.mediaObj }, {})
        }, 0)
    }
    postVideoUploadFail = () => {
        this.setState({ isLoading: false })
    }
    capture = () => {
        const imageSrc = { file: this.webcamRef.current.getScreenshot(), filename: 'headshot' };
        this.setState({ isLoading: true })
        postCall(HEAD_SHOT, imageSrc, { sfn: this.headshotSuccess, efn: this.headshotFailed })
    }
    headshotSuccess = (data) => {
        this.setState({ mediaObj: { ...{ ...this.state.mediaObj, headshot: data.response.location } }, isLoading: false })
        setTimeout(() => {
            this.updateConversation.call()
        }, 0)
    }
    headshotFailed = () => {toast.error("Server failed to respond. Please try again later.")}
    postQuestionsFetch = (data) => {
        this.setState({ questionsList: data.response.filter(i => (!i.isAnswered)) })
        setTimeout(() => {
            if (this.state.questionsList.length) {
                this.setState({
                    inputType: this.state.questionsList[this.state.currQues].response_type,
                    conversation: [{ q: this.state.questionsList[this.state.currQues].question }]
                })
            } else {
                this.setState({ allAnswered: true })
            }
        }, 1000)
    }

    errQuestionsFetch = () => {
        toast.error("Server failed to respond. Please try again later.")
    }

    scrollChatWindow = () => {
        let element = this.chatWindow.current;
        element.scrollTop = element.scrollHeight;
    }

    updateConversation = () => {
        let responseValid = false;
        let userResponse
        if (this.state.questionsList[this.state.currQues].response_type === 'FU') {
            userResponse = this.state.uploadedFile?'File Uploaded':"No Files Selected"
        } else if (this.state.questionsList[this.state.currQues].response_type === 'RB') {
            userResponse = document.querySelector(`input[name="${this.state.questionsList[this.state.currQues].name}"]:checked`).value;
        } else if (this.state.questionsList[this.state.currQues].response_type === 'IC') {
            userResponse = <img className="head-shot-display" src={this.state.mediaObj.headshot} alt="" />
        } else if (this.state.questionsList[this.state.currQues].response_type === 'VC') {
            userResponse = <video id="vid2" controls key={this.state.videoshot}>
                <source src={this.state.videoshot} type="video/webm" />
            </video>
        } else {
            userResponse = this.responseRef.current.value.trim()
        }
        if(this.state.questionsList[this.state.currQues].name==="dateOfBirth"){
            if (userResponse === "") {
                userResponse = "Not Disclosing Now"
            }
        }
        if (userResponse === "") {
            this.setState({
                errInResponse: true,
                errorInfo: "Looks like you have not given the required input."
            })
            return
        }
        switch (this.state.questionsList[this.state.currQues].name) {
            case "fullName":
            case "locationCountry":
            case "workAuthCountry":
            case "citizenship": {
                responseValid = alphaOnly(userResponse)
                break;
            }
            case "phoneNo": {
                responseValid = numOnly(userResponse) && (userResponse.length > 7 && userResponse.length < 13)
                break;
            }
            case "emailId": {
                responseValid = emailInFormat(userResponse) && userResponse !== this.props.registeredEmail
                break;
            }
            case "eduSpecialization":
            case "workExpOrgName":
            case "workExpDesignation":
            case "locationState":
            case "locationCity":
            case "workExpJobTitle": {
                responseValid = alphaNumOnlyWithSpace(userResponse)
                break;
            }
            case "locationZip": {
                responseValid = (userResponse.length > 3 && userResponse.length < 12)
                break;
            }
            case "location":
            case "decision1":
            case "decision2":
            case "decision3":
            case "locationAddress":
            case "dateOfBirth":
            case "eduStartDateY":
            case "eduStartDateM":
            case "eduEndDateY":
            case "eduEndDateM":
            case "education":
            case "certiStartDateY":
            case "certiEndDateY":
            case "certiStartDateM":
            case "certiEndDateM":
            case "workExperience":
            case "workExpStartDateY":
            case "workExpStartDateM":
            case "workExpStart":
            case "workExpTechSoft":
            case "workExpEndDateY":
            case "workExpEndDateM":
            case "workExpRnR":
            case "aboutMe":
            case "imageCapture":
            case "videoCapture":
            case "eduDegree":
            case "certificationUpload":
            case "certiName":
            case "certiUpload":
            case "eduInstituteName":
            case "workAuthType": {
                responseValid = true
                break;
            }
            case "workAuthExpiry": {
                responseValid = true
                this.setState({ currQues: this.state.currQues - 4, inputType: 'NA' })
                break;
            }
            case "workAuth": {
                responseValid = true
                if (userResponse.toUpperCase() === 'NO') {
                    this.setState({ currQues: this.state.currQues + 3, inputType: 'NA' })
                }
                break;
            }
            case "eduAddAnother": {
                responseValid = true
                this.setState({ currQues: userResponse.toUpperCase() === 'NO' ? this.state.currQues : this.state.currQues - 8, inputType: 'NA' })
                break;
            }
            case "certification": {
                responseValid = true
                this.setState({ currQues: userResponse.toUpperCase() === 'NO' ? this.state.currQues + 7 : this.state.currQues, inputType: 'NA' })
                break;
            }
            case "certiAddAnother": {
                responseValid = true
                this.setState({ currQues: userResponse.toUpperCase() === 'NO' ? this.state.currQues : this.state.currQues -5, inputType: 'NA' })
                break;
            }
            case "workExpCurrWork": {
                responseValid = true
                this.setState({ currQues: userResponse.toUpperCase() === 'NO' ? this.state.currQues + 9 : this.state.currQues, inputType: 'NA' })
                break;
            }
            case "workExpAddAnother": {
                responseValid = true
                this.setState({ currQues: userResponse.toUpperCase() === 'NO' ? this.state.currQues : this.state.currQues - 10, inputType: 'NA' })
                break;
            }
            default: break;
        }
        let allConversations = this.state.conversation
        if (responseValid) {
            allConversations.pop()
            allConversations.push({ q: this.state.questionsList[this.state.currQues].question, a: this.preResRef.current ? `${this.preResRef.current.value} ${userResponse}` : userResponse })
            this.setState({
                conversation: allConversations
            })
            if (this.state.inputType === 'IC') {
                this.buildPayload(this.state.questionsList[this.state.currQues].category_name, this.state.questionsList[this.state.currQues].name, this.state.headshot)
            } if (this.state.inputType === 'VC') {
                this.buildPayload(this.state.questionsList[this.state.currQues].category_name, this.state.questionsList[this.state.currQues].name, this.state.videoshot)
            } else if (this.state.inputType === 'FU') {
                this.buildPayload(this.state.questionsList[this.state.currQues].category_name, this.state.questionsList[this.state.currQues].name, this.state.uploadedFile)
            } else {
                this.buildPayload(this.state.questionsList[this.state.currQues].category_name, this.state.questionsList[this.state.currQues].name, this.preResRef.current ? `${this.preResRef.current.value} ${userResponse}` : userResponse)
            }
            setTimeout(() => {
                this.scrollChatWindow.call()
                this.askNextQuestion.call()
            }, 0)
        } else {
            this.setState({
                errInResponse: true,
                errorInfo: this.state.questionsList[this.state.currQues].instructions
            })
        }
    }

    buildPayload = (category, key, value) => {
        switch (key) {
            case "fullName": {
                let fullName = value.split(' ').filter(i => (i !== ''))
                let first_name = fullName[0]
                let last_name = fullName.slice(1).join().replace(/,/g, ' ')
                store.dispatch(updateUserName(first_name, last_name))
                this.saveResponse({
                    first_name: first_name,
                    last_name: last_name
                }, category)
                break;
            }
            case "phoneNo": {
                let phone = value.split(' ')
                let dialCode = phone[0]
                let number = phone.slice(1).join().replace(/,/g, ' ')
                store.dispatch(updateDialCode(dialCode))
                store.dispatch(updatePhoneNo(number))
                this.saveResponse({
                    phone: number,
                    dial_code: dialCode
                }, category)
                break;
            }
            case "emailId": {
                store.dispatch(updateRecoveryEmail(value))
                this.saveResponse({
                    recovery_email: value
                }, category)
                break;
            }
            case "decision": {
                this.saveResponse({
                    recovery_email: value
                }, category)
                break;
            }
            case "locationCountry": {
                store.dispatch(updateCountryName(value))
                this.saveResponse({
                    country_name: value
                }, category)
                break;
            }
            case "locationState": {
                store.dispatch(updateStateName(value))
                this.saveResponse({
                    state: value
                }, category)
                break;
            }
            case "locationCity": {
                store.dispatch(updateCityName(value))
                this.saveResponse({
                    city: value
                }, category)
                break;
            }
            case "locationZip": {
                store.dispatch(updateZipcode(value))
                this.saveResponse({
                    zipcode: value
                }, category)
                break;
            }
            case "locationAddress": {
                store.dispatch(updateAddressLine(value))
                this.saveResponse({
                    address_line: value
                }, category)
                break;
            }
            case "citizenship": {
                store.dispatch(updateCitizenship(value))
                this.saveResponse({
                    citizenship: value
                }, category)
                break;
            }
            case "dateOfBirth": {
                let desVal = value
                if(desVal==="Not Disclosing Now"){
                    desVal = ''
                }
                store.dispatch(updateDateOfBirth(desVal))
                this.saveResponse({
                    dob: desVal
                }, category)
                break;
            }
            case "workAuth": {
                if (value.toUpperCase() === 'NO') {
                    this.state.workAuthObj.countryList.length ?
                        this.saveResponse({
                            other_country_authorization: 'YES'
                        }, category)
                        :
                        this.saveResponse({
                            other_country_authorization: 'NO'
                        }, category)
                    setTimeout(() => {
                        this.saveResponse(this.state.workAuthObj, 'personalDetails');
                        store.dispatch(newWorkAuth(this.state.workAuthObj))
                    }, 10)
                }
                break;
            }
            case "workAuthCountry": {
                let newCountryList = this.state.workAuthObj.countryList.push(value)
                update(this.state, { workAuthObj: { countryList: { $set: newCountryList } } })
                break;
            }
            case "workAuthType": {
                let newTypeList = this.state.workAuthObj.authType.push(value)
                update(this.state, { workAuthObj: { authType: { $set: newTypeList } } })
                break;
            }
            case "workAuthExpiry": {
                let newExpiryList = this.state.workAuthObj.authExp.push(value)
                update(this.state, { workAuthObj: { authExp: { $set: newExpiryList } } })
                break;
            }
            case "eduAddAnother": {
                if (value.toUpperCase() === 'NO') {
                    store.dispatch(setEducationObj(this.state.educationObj))
                    this.saveResponse(this.state.educationObj, category)
                }
                break;
            }
            case "eduDegree": {
                let newEduDegree = this.state.educationObj.degree.push(value)
                update(this.state, { educationObj: { degree: { $set: newEduDegree } } })
                break;
            }
            case "eduInstituteName": {
                let newInstitute = this.state.educationObj.institute.push(value)
                update(this.state, { educationObj: { institute: { $set: newInstitute } } })
                break;
            }
            case "eduSpecialization": {
                let newSpecial = this.state.educationObj.special.push(value)
                update(this.state, { educationObj: { special: { $set: newSpecial } } })
                break;
            }
            case "eduStartDateY": {
                let newStartDate = this.state.educationObj.startY.push(value)
                update(this.state, { educationObj: { startY: { $set: newStartDate } } })
                break;
            }
            case "eduStartDateM": {
                let newStartDate = this.state.educationObj.startM.push(value)
                update(this.state, { educationObj: { startM: { $set: newStartDate } } })
                break;
            }
            case "eduEndDateY": {
                let newEndDate = this.state.educationObj.endY.push(value)
                update(this.state, { educationObj: { endY: { $set: newEndDate } } })
                break;
            }
            case "eduEndDateM": {
                let newEndDate = this.state.educationObj.endM.push(value)
                update(this.state, { educationObj: { endM: { $set: newEndDate } } })
                break;
            }
            case "certification":
            case "certiAddAnother": {
                if (value.toUpperCase() === 'NO') {
                    store.dispatch(setCertificationObj(this.state.certificationObj))
                    this.saveResponse(this.state.certificationObj, category)
                }
                break;
            }
            case "certiName": {
                let newName = this.state.certificationObj.name.push(value)
                update(this.state, { certificationObj: { name: { $set: newName } } })
                break;
            }
            case "certiStartDateY": {
                let newStartDate = this.state.certificationObj.startY.push(value)
                update(this.state, { certificationObj: { startY: { $set: newStartDate } } })
                break;
            }
            case "certiStartDateM": {
                let newStartDate = this.state.certificationObj.startM.push(value)
                update(this.state, { certificationObj: { startM: { $set: newStartDate } } })
                break;
            }
            case "certiEndDateY": {
                let newEndDate = this.state.certificationObj.endY.push(value)
                update(this.state, { certificationObj: { endY: { $set: newEndDate } } })
                break;
            }
            case "certiEndDateM": {
                let newEndDate = this.state.certificationObj.endM.push(value)
                update(this.state, { certificationObj: { endM: { $set: newEndDate } } })
                break;
            }
            case "certiUpload": {
                let newCertis = this.state.certificationObj.copy.push(value)
                update(this.state, { certificationObj: { copy: { $set: newCertis } } })
                break;
            }
            case "workExpCurrWork": {
                this.setState({ workExpObj: { ...{ ...this.state.workExpObj, currentlyWorking: value } } })
                break;
            }
            case "workExpOrgName": {
                let newOrgNames = this.state.workExpObj.orgNames.push(value)
                update(this.state, { workExpObj: { orgNames: { $set: newOrgNames } } })
                break;
            }
            case "workExpDesignation": {
                let newDesignations = this.state.workExpObj.designations.push(value)
                update(this.state, { workExpObj: { designations: { $set: newDesignations } } })
                break;
            }
            case "workExpJobTitle": {
                let newJobTitles = this.state.workExpObj.jobTitles.push(value)
                update(this.state, { workExpObj: { jobTitles: { $set: newJobTitles } } })
                break;
            }
            case "workExpStartDateY": {
                let newStartDate = this.state.workExpObj.startY.push(value)
                update(this.state, { workExpObj: { startY: { $set: newStartDate } } })
                break;
            }
            case "workExpEndDateY": {
                let newEndDate = this.state.workExpObj.endY.push(value)
                update(this.state, { workExpObj: { endY: { $set: newEndDate } } })
                break;
            }
            case "workExpStartDateM": {
                let newStartDate = this.state.workExpObj.startM.push(value)
                update(this.state, { workExpObj: { startM: { $set: newStartDate } } })
                break;
            }
            case "workExpEndDateM": {
                let newEndDate = this.state.workExpObj.endM.push(value)
                update(this.state, { workExpObj: { endM: { $set: newEndDate } } })
                break;
            }
            case "workExpRnR": {
                let newRnrs = this.state.workExpObj.rnrs.push(value)
                update(this.state, { workExpObj: { rnrs: { $set: newRnrs } } })
                break;
            }
            case "workExpTechSoft": {
                let newTillDate = this.state.workExpObj.tillDate.push(false)
                update(this.state, { workExpObj: { rnrs: { $set: newTillDate } } })
                break;
            }
            case "aboutMe": {
                this.setState({ aboutMe: value })
                setTimeout(() => {
                    this.saveResponse({ ...{ ...this.state.workAuthObj, aboutMe: this.state.aboutMe } }, category)
                    store.dispatch(setAboutMe(this.state.aboutMe))
                }, 10)
                setTimeout(() => {
                    this.saveResponse(this.state.workExpObj, 'workExpInfo')
                    store.dispatch(setWorkExpObj(this.state.workExpObj))
                }, 20)
                break;
            }
            case "videoCapture":
            case "imageCapture": {
                this.saveResponse(this.state.mediaObj, category)
                break;
            }
            default: break;
        }
    }

    saveResponse = (payload, category) => {
        let dataPayload
        if (category === 'basicInformation') {
            dataPayload = { basic_details: payload }
        } else if (category === 'personalDetails') {
            dataPayload = { personal_details: payload }
        } else if (category === 'educationInfo') {
            dataPayload = { education: payload }
        } else if (category === 'certification') {
            dataPayload = { certifications: payload }
        } else if (category === 'workExpInfo') {
            dataPayload = { work_experience: payload }
        } else if (category === 'mediaInfo') {
            dataPayload = { media: payload }
        }
        putCall(PROFILE, dataPayload, { sfn: this.postProfileUpdate, efn: this.errProfileUpdate })
    }
    errProfileUpdate = () => {
        toast.error("Server failed to respond. Please try again later.")
    }
    postProfileUpdate = (data) => {
        store.dispatch(setProfileCompletion(data.response.profileCompletionPercentage))
    }

    askNextQuestion = () => {
        this.setState({
            currQues: this.state.currQues + 1,
            inputType: 'NA'
        })
        setTimeout(() => {
            if (this.state.currQues < this.state.questionsList.length) {
                if (this.state.questionsList[this.state.currQues].response_type === "VC") {
                    this.turnCameraOn.call()
                }
                this.setState({
                    inputType: this.state.questionsList[this.state.currQues].response_type,
                    conversation: [...this.state.conversation, { q: this.state.questionsList[this.state.currQues].question }]
                })
                this.scrollChatWindow.call()
            } else {
                this.setState({
                    allAnswered: true
                })
                setTimeout(() => this.props.toggleChatBox.call(), 3000)
            }
        }, 500)
    }
    enterPressed = (e) => {
        this.setState({ errInResponse: false, errorInfo: "" })
        if (e.keyCode === 13 || e.which === 13) {
            this.updateConversation.call();
        }
    }
    uploadFile = (input) => {
        if (input.target.files && input.target.files[0]) {
            const formData = new FormData()
            formData.append('file', input.target.files[0])
            this.setState({ isLoading: true })
            postCall(FILE_UPLOAD, formData, { sfn: this.postCertCopyUpload, efn: ()=> toast.error("Server failed to respond. Please try again later.") }, 'attachment')
        }
    }
    postCertCopyUpload = (data) => {
        this.setState({ uploadedFile: data.fileUrl, isLoading: false })
        this.updateConversation.call()
    }

    render() {
        return (
            <div id="Questionnaire">
                <div className="chat-head" onClick={this.props.toggleChatBox} >
                    <span className="chat-head-title">Profile Builder</span><span className="fa fa-angle-down chat-close"></span>
                </div>
                {this.state.errInResponse && <div className="chatError">{this.state.errorInfo}</div>}
                <div className="chat-window" ref={this.chatWindow}>
                    {this.state.inputType === 'IC' &&
                        <div className="live-feed-holder">
                            <Webcam
                                audio={false}
                                height={200}
                                ref={this.webcamRef}
                                screenshotFormat="image/jpeg"
                                width={300}
                                videoConstraints={this.videoConstraints}
                            />
                            <button onClick={this.capture}>CAPTURE</button>
                        </div>
                    }
                    {this.state.inputType === 'VC' &&
                        <div style={{ position: "absolute", top: '38px', left: 0 }}>
                            <video style={{ width: '100%', background: '#aaa' }}></video>
                            <p className="countdown-clock">{this.state.countdown}</p>
                            <div className="rec-btn-holder">
                                <button id="btnStop" type="button" className={this.state.isRecording ? "" : "hidden-btn"}><span className="fa fa-stop-circle"></span></button>
                                <button id="btnStart" type="button" className={this.state.isRecording ? "hidden-btn" : ""}><span className="fa fa-play-circle"></span></button>
                            </div>
                        </div>
                    }
                    <div className="sys-response"><span style={{verticalAlign:'sub'}}>Welcome to</span><img src={require('../../../images/icons/logo.png')} className="logo-in-ques" alt=""/></div>
                    {this.state.allAnswered ?
                        <div className="sys-response">We have recieved the required responses from you. To complete your profile or to edit your responses you can click [ Edit/Update My Profile ] button.</div>
                        :
                        <>
                            <div className="sys-response">We would like to know more about you. This will also help us build your profile.</div>
                            <div className="sys-response">You can now provide your information by clicking Edit/update Profile above or we can help you build your profile in an interactive manner.</div>
                            <div className="sys-response">Press continue if you want us to help build your profile (you can click edit/profile anytime you want to move away from interactive profile builder.</div>
                        </>
                    }
                    {this.state.conversation.map((i, index) => (
                        <div key={`qaGroup${index}`}>
                            <div className="sys-response">{i.q}</div>
                            {i.a ? <div className="user-response">{i.a}</div> : null}
                        </div>
                    ))}
                </div>
                {this.state.allAnswered ?
                    <div className="completion text-center">
                        <strong>Thank You!</strong>
                    </div>
                    :
                    <div className="input-window">
                        {this.state.questionsList.length &&
                            this.state.isLoading ? <div style={{position:'absolute',bottom:0, width:'100%'}}><ChatLoader /></div> :
                            <span>
                                {this.state.inputType === 'ST' && <span><input list={this.state.questionsList[this.state.currQues].name} className='combo-suggest' ref={this.preResRef} defaultValue={this.state.questionsList[this.state.currQues].options[0]} /><datalist id={this.state.questionsList[this.state.currQues].name}>{this.state.questionsList[this.state.currQues].options.map((opt) => <option key={opt} value={opt} />)}</datalist><input onKeyDown={this.enterPressed} className={this.state.errInResponse ? 'combo-input error-input' : 'combo-input'} autoFocus type="text" ref={this.responseRef} /></span>}
                                {this.state.inputType === 'TI' && <input onKeyDown={this.enterPressed} type="text" autoFocus ref={this.responseRef} className={this.state.errInResponse ? 'error-input' : ''} />}
                                {this.state.inputType === 'NR' && <input onKeyDown={this.enterPressed} disabled type="text" ref={this.responseRef} value="Continue" />}
                                {this.state.inputType === 'SL' && <select onKeyDown={this.enterPressed} ref={this.responseRef} defaultValue={this.state.questionsList[this.state.currQues].options[0]} >{this.state.questionsList[this.state.currQues].options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}</select>}
                                {this.state.inputType === 'AS' && <span><input className={this.state.errInResponse ? 'error-input' : ''} onKeyDown={this.enterPressed} autoFocus list={this.state.questionsList[this.state.currQues].name} ref={this.responseRef} defaultValue={this.state.questionsList[this.state.currQues].options[0]} /><datalist id={this.state.questionsList[this.state.currQues].name}>{this.state.questionsList[this.state.currQues].options.map((opt) => <option key={opt} value={opt} />)}</datalist></span>}
                                {this.state.inputType === 'DT' && <input className={this.state.errInResponse ? 'error-input' : ''} onKeyDown={this.enterPressed} onChange={() => this.setState({ errInResponse: false, errorInfo: "" })} type="date" ref={this.responseRef} />}
                                {this.state.inputType === 'FU' && <input onChange={this.uploadFile} name={this.state.questionsList[this.state.currQues].name} type="file" autoFocus ref={this.responseRef} className={this.state.errInResponse ? 'error-input' : ''} accept="application/pdf, image/*" />}
                                {this.state.inputType === 'RB' && <div style={{paddingTop: '18px'}}>{this.state.questionsList[this.state.currQues].options.map((opt, i) => <label className="input-container" key={opt}>{opt} <input type="radio" defaultChecked={!i} name={this.state.questionsList[this.state.currQues].name} value={opt} ref={this.responseRef} /><span className="checkmark"></span></label>)}</div>}
                                {this.state.inputType === 'NA' && <input disabled type="text" ref={this.responseRef} />}
                                <button type="button" className="btn-chat-send" onClick={this.updateConversation} disabled={this.state.inputType === 'IC'||this.state.inputType === 'VC'}><span className="fa fa-paper-plane"></span></button>
                            </span>
                        }
                    </div>
                }
            </div>
        )
    }
}

export default Questionnaire;