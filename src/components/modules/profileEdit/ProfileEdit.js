import React from 'react';
import './ProfileEdit.css';
import "react-datepicker/dist/react-datepicker.css";
import store from '../../../redux/store';
import { updateProfilePic, setWorkExpObj, addBoardExpRow, setBoardExpObj, setSocialLinks, addWorkExpRow, setCertificationObj, setIsStudent, addCertificationRow, updateDialCode, deleteCertificationRow, setWorkAuthObj, setEducationObj, addEducationRow, deleteEducationRow, updateCitizenship, updateAddressLine, updateCityName, updateStateName, updatePhoneNo, showFlatForm, addWorkAuthRow, deleteWorkAuthRow, updateHeadshot, updateUserName, updateRecoveryEmail, updateCountryName, updateZipcode, updateDateOfBirth, updateAuthorizedCountry, deleteWorkExpRow, deleteBoardExpRow, setProfileCompletion, setSalaryMean, updateLiveVideo } from '../../../redux/actions';
import Radio from '../../shared/Radio';
import { postCall, putCall, getCall } from '../../../utils/api.config';
import { HEAD_SHOT, FILE_UPLOAD, PROFILE, SALARY_MEAN, COUNTRIES, INDUSTRY, PLAN_DETAIL } from '../../../utils/constants';
import CountryAuthBlock from './CountryAuthBlock';
import { toast } from 'react-toastify';
import EducationBlock from './EducationBlock';
import moment from 'moment';
import CertificationBlock from './CertificationBlock';
import WorkExpBlock from './WorkExpBlock';
import ImageCroper from '../../shared/ImageCroper';
import { isInputEmpty, alphaOnly, numOnly, emailInFormat, numOnlyDots, isZipcodeOk } from '../../../utils/validators';
import Draggable from 'react-draggable';
import DatepickerComponent from '../../shared/DatepickerComponent';
import MitAccordion from '../../shared/MitAccordion';
import ChatLoader from '../../shared/ChatLoader';
import Checkout from '../../shared/StripeCheckout';
import BoardExpBlock from './BoardExpBlock';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { dialcodes } from '../../../utils/dialcodes'
import Modal from 'react-responsive-modal';
import Bowser from "bowser"

class ProfileEdit extends React.Component {
  constructor(props) {
    super(props);
    const { payment } = props.state
    let { profile_pic, title, first_name, last_name, phone, email, dial_code, recovery_email, country_name, zipcode, gender, address_line, state, city, citizenship, dob, is_student } = props.state.basicInfo
    let { media, social_links, work_experience, education, personal_details, board_experience } = props.state.profile
    this.state = {
      triggerFrom: { type: 'back', val: null },
      unsaveAlert: false,
      inputUnsaved: false,
      selectedPlanVal: 0,
      selectedPlanId: 0,
      registeredEmail: email,
      isRecording: false,
      currPage: 1,
      pageProgress: [],
      cameraOn: false,
      profile_pic: profile_pic || require('../../../images/icons/placeholder-profile.jpg'),
      title: title || '',
      first_name: { value: first_name || '', err: '' },
      last_name: { value: last_name || '', err: '' },
      phone: { value: phone || '', err: '' },
      recovery_email: { value: recovery_email || '', err: '' },
      country_name: { value: country_name || '', err: '' },
      zipcode: { value: zipcode || '', err: '' },
      address_line: { value: address_line || '', err: '' },
      state: { value: state || '', err: '' },
      city: { value: city || '', err: '' },
      citizenship: { value: citizenship || '', err: '' },
      gender: { value: gender || 'Male', err: '' },
      is_student: is_student,
      dob: { value: dob, err: '' },
      other_country_authorization: personal_details && personal_details.countryList && personal_details.countryList.length ? 'YES' : 'NO',
      headshot: (media && media.headshot) ? media.headshot : require('../../../images/icons/headshot.jpg'),
      accomplishments: { value: education.accomplishments, err: '' },
      currentlyWorking: work_experience.currentlyWorking ? work_experience.currentlyWorking : false,
      aboutMe: { value: personal_details.aboutMe || '', err: '' },
      workCountry: { value: work_experience.current_salary ? work_experience.current_salary.workCountry : '-1', err: '' },
      amount: { value: work_experience.current_salary ? work_experience.current_salary.amount : '', err: '' },
      currency: { value: work_experience.current_salary ? work_experience.current_salary.currency : '-1', err: '' },
      salary_range: { value: work_experience.current_salary ? work_experience.current_salary.salary_range : '-1', err: '' },
      region: { value: work_experience.current_salary ? work_experience.current_salary.region : '', err: '' },
      total_experience: { value: work_experience.total_experience || 0, err: '' },
      facebook: social_links.facebook || '',
      twitter: social_links.twitter || '',
      linkedin: social_links.linkedin || '',
      instagram: social_links.instagram || '',
      pinterest: social_links.pinterest || '',
      github: social_links.github || '',
      showEditor: false,
      tnc: true,
      videoshot: (media && media.videoshot) ? media.videoshot : null,
      videoCameraOn: false,
      validPayload: true,
      useHeadshot: false,
      showEditorHeadShot: false,
      allCountries: [],
      partitions: ['0.1', '0.2', '0.3', '0.4'],
      countdown: 60,
      dropdowns: {},
      defaultSliderPos: 0,
      available: false,
      isLoadingSmall: false,
      planDetails: [],
      allCurrencies: [],
      errInAcc: false,
      addBoardExp: board_experience && board_experience.boardName && board_experience.boardName.length ? true : false,
      dial_code: { value: dial_code || '-1', err: '' },
      receivedOn: payment && payment.length ? moment(payment[payment.length - 1].time_stamp).format('MMMM Do YYYY, h:mm:ss a') : null,
      expiresOn: payment && payment.length ? moment(payment[payment.length - 1].time_stamp).add(30, 'days').format('MMMM Do YYYY, h:mm:ss a') : null
    }
    this.postVideoUpload = this.postVideoUpload.bind(this)
    this.postVideoUploadFail = this.postVideoUpload.bind(this)
    this.webcamRef = React.createRef();
    this.sliderRange = React.createRef();
    this.countryAuthList = React.createRef()
  }
  componentDidMount() {
    if (this.state.amount.value !== '') {
      let minSal = 0
      switch (this.state.salary_range.value) {
        case 'r1': { minSal = 0; this.setState({ partitions: ['0.1', '0.2', '0.3', '0.4'] }); break }
        case 'r2': minSal = 500000; this.setState({ partitions: ['0.6', '0.7', '0.8', '0.9'] }); break
        case 'r3': minSal = 1000000; this.setState({ partitions: ['1.1', '1.2', '1.3', '1.4'] }); break
        case 'r4': minSal = 1500000; this.setState({ partitions: ['1.6', '1.7', '1.8', '1.9'] }); break
        case 'r5': minSal = 2000000; this.setState({ partitions: ['2.1', '2.2', '2.3', '2.4'] }); break
        case 'r6': minSal = 2500000; this.setState({ partitions: ['2.6', '2.7', '2.8', '2.9'] }); break
        default: break
      }
      setTimeout(() => {
        this.setState({
          minSal: minSal,
          defaultSliderPos: Math.ceil((document.getElementsByClassName('col-sm-12')[0].offsetWidth - 30)) * ((this.state.amount.value - minSal) / 500000)
        })
      }, 0)
    }
    getCall(COUNTRIES, {}, { sfn: this.postCountriesFetch, efn: () => toast.error("Server failed to respond. Please try again later.") })
    getCall(INDUSTRY, {}, { sfn: this.postIndustriesFetch, efn: () => toast.error("Server failed to respond. Please try again later.") })
    getCall(PLAN_DETAIL, {}, { sfn: this.setPlanDetails, efn: () => toast.error("Server failed to respond. Please try again later.") })
  }
  setPlanDetails = (data) => {
    this.setState({
      planDetails: data.plans.filter(i => i.plan_for === 'i')
    }, () => this.setState({
      selectedPlanVal: this.state.planDetails[0].amount,
      selectedPlanId: this.state.planDetails[0].id
    }))
  }
  handleAboutChange = (value) => {
    this.setState({ aboutMe: { value: value, err: '' }, validPayload: true })
  }
  postIndustriesFetch = (data) => {
    this.setState({ dropdowns: data.response })
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
        let mediaRecorder = new MediaRecorder(mediaStreamObj,{ mimeType: 'video/webm;codecs=vp8,opus' });
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
          let blob = new Blob(chunks, { type: 'video/webm' });
          let url = URL.createObjectURL(blob);
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
          this.setState({ isLoadingSmall: true })
          postCall(FILE_UPLOAD, formData, { sfn: this.postVideoUpload, efn: this.postVideoUploadFail }, 'video')
        }
      })
      .catch(function (err) {
        console.log(err.name);
        console.log(err.message);
      });
  }
  postCountriesFetch = (data) => {
    this.setState({
      allCountries: data.response.countryResult,
      allCurrencies: data.response.currencyResult
    })
  }
  displayCapture = () => {
    this.setState({ showImageCampure: true })
  }
  postVideoUpload = (data) => {
    this.setState({ videoshot: data.fileUrl, isLoadingSmall: false });
    store.dispatch(updateLiveVideo(data.fileUrl))
    putCall(PROFILE, { media: { ...this.props.state.profile.media, videoshot: data.fileUrl } }, {})
  }
  postVideoUploadFail = () => {
    toast.error("Server failed to respond. Please try again later.")
  }
  imageEditorTogg = () => {
    this.setState({ showEditor: !this.state.showEditor })
  }
  imageEditorToggHS = () => {
    this.setState({ showEditorHeadShot: !this.state.showEditorHeadShot })
  }
  inputUnsaved = () => {
    this.setState({ inputUnsaved: true })
  }
  updateInputState = (e) => {
    this.setState({ validPayload: true })
    this.inputUnsaved.call()
    switch (e.target.name) {
      case "first_name": this.setState({ first_name: { value: e.target.value, err: '' } }); break
      case "last_name": this.setState({ last_name: { value: e.target.value, err: '' } }); break
      case "dial_code": this.setState({ dial_code: { value: e.target.value, err: '' }, phone: { ...this.state.phone, err: '' } }, () => document.getElementsByName('phone')[0].focus()); break
      case "phone": this.setState({ phone: { value: e.target.value, err: '' } }); break
      case "country_name": this.setState({ country_name: { value: e.target.value, err: '' } }); break
      case "zipcode": this.setState({ zipcode: { value: e.target.value, err: '' } }); break
      case "address_line": this.setState({ address_line: { value: e.target.value, err: '' } }); break
      case "state": this.setState({ state: { value: e.target.value, err: '' } }); break
      case "city": this.setState({ city: { value: e.target.value, err: '' } }); break
      case "citizenship": this.setState({ citizenship: { value: e.target.value, err: '' } }); break
      case "dob": this.setState({ dob: { value: e.target.value, err: '' } }); break
      case "gender": this.setState({ gender: { value: e.target.value, err: '' } }); break
      case "recovery_email": this.setState({ recovery_email: { value: e.target.value, err: '' } }); break
      case "accomplishments": this.setState({ accomplishments: { value: e.target.value, err: '' } }); break
      case "workAuth": this.setState({ other_country_authorization: document.querySelector('input[name = "workAuth"]:checked').value }); break
      case "is_student": this.setState({ is_student: document.querySelector('input[name = "is_student"]:checked').value }); break
      case "amount": this.setState({ amount: { value: e.target.value, err: '' } }); break
      case "currency": this.setState({ currency: { value: e.target.value !== '-1' ? e.target.value : this.state.currency.value, err: '' } }); break
      case "workCountry": this.setState({ workCountry: { value: e.target.value !== '-1' ? e.target.value : this.state.workCountry.value, err: '' } }); break
      case "salary_range": this.setState({ salary_range: { value: e.target.value, err: '' } }, () => this.updatePartitions.call()); break
      case "facebook-handle": this.setState({ facebook: e.target.value }); break
      case "twitter-handle": this.setState({ twitter: e.target.value }); break
      case "linkedin-handle": this.setState({ linkedin: e.target.value }); break
      case "instagram-handle": this.setState({ instagram: e.target.value }); break
      case "pinterest-handle": this.setState({ pinterest: e.target.value }); break
      case "github-handle": this.setState({ github: e.target.value }); break
      case "addBoardExp": this.setState({ addBoardExp: e.target.value }); break
      case "total_experience": this.setState({ total_experience: { value: e.target.value, err: '' } }); break
      case "plan": this.setState({
        selectedPlanVal: document.querySelector('input[name = "plan"]:checked').value,
        selectedPlanId: document.querySelector('input[name = "plan"]:checked').getAttribute('id'),
        inputUnsaved: true
      }); break;
      default: break
    }
  }
  updatePartitions = () => {
    this.inputUnsaved.call()
    switch (this.state.salary_range.value) {
      case 'r1': this.setState({ partitions: ['0.1', '0.2', '0.3', '0.4'], minSal: 0 }); break
      case 'r2': this.setState({ partitions: ['0.6', '0.7', '0.8', '0.9'], minSal: 500000 }); break
      case 'r3': this.setState({ partitions: ['1.1', '1.2', '1.3', '1.4'], minSal: 1000000 }); break
      case 'r4': this.setState({ partitions: ['1.6', '1.7', '1.8', '1.9'], minSal: 1500000 }); break
      case 'r5': this.setState({ partitions: ['2.1', '2.2', '2.3', '2.4'], minSal: 2000000 }); break
      case 'r6': this.setState({ partitions: ['2.6', '2.7', '2.8', '2.9'], minSal: 2500000 }); break
      default: break
    }
    setTimeout(() => {
      this.handleDrag.call(this, 'reset')
    }, 0)
  }
  readURL = (input) => {
    if (input.target.files && input.target.files[0]) {
      const formData = new FormData()
      formData.append('file', input.target.files[0])
      postCall(FILE_UPLOAD, formData, { sfn: this.profilePicUploaded, efn: () => toast.error("Server failed to respond. Please try again later.") }, 'image')
      var reader = new FileReader();
      reader.onload = (e) => {
        this.setState({ profile_pic: e.target.result });
      }
      reader.readAsDataURL(input.target.files[0]);
    }
  }
  profilePicUploaded = (data) => {
    this.setState({ profile_pic: data.fileUrl });
  }
  goBack = () => {
    this.setState({ triggerFrom: { type: 'back', val: null } })
    if (this.state.inputUnsaved) {
      this.unsaveAlert.call()
    } else {
      this.setState({ currPage: this.state.currPage - 1 })
    }
  }
  goNext = () => {
    this.setState({ currPage: this.state.currPage + 1 })
  }
  showForm = () => {
    this.setState({ display: true })
  }
  closeForm = () => {
    store.dispatch(showFlatForm(false))
    window.location.reload()
  }
  capture = () => {
    const imageSrc = { file: this.webcamRef.current.getScreenshot(), filename: 'headshot' };
    postCall(HEAD_SHOT, imageSrc, { sfn: this.headshotSuccess, efn: this.headshotFailed })
  }
  headshotSuccess = (data) => {
    this.setState({ headshot: data.response.location })
    store.dispatch(updateHeadshot(data.response.location))
    putCall(PROFILE, { media: { ...this.props.state.profile.media, headshot: data.response.location } }, {})
    this.setState({ showImageCampure: false })
  }
  headshotFailed = () => { toast.error("Server failed to respond. Please try again later.") }
  addAnotherAuth = () => {
    store.dispatch(addWorkAuthRow({ countryList: '', authType: '', sponsor: '', authExp: moment().format('MM/DD/YYYY') }))
    setTimeout(()=>{this.inputUnsaved.call()},10)
  }
  addAnotherEducation = () => {
    store.dispatch(addEducationRow({ degree: '', institute: '', special: '', startM: new Date().getMonth(), endM: new Date().getMonth(), startY: new Date().getFullYear(), endY: new Date().getFullYear(), activities: '', societies: '' }))
    setTimeout(()=>{this.inputUnsaved.call()},10)
  }
  addAnotherCertification = () => {
    this.inputUnsaved.call()
    store.dispatch(addCertificationRow({ name: '', endM: '', endY: '', copy: null }))
  }
  addAnotherWorkExp = () => {
    store.dispatch(addWorkExpRow({ orgNames: '', jobTitles: '', designations: '', startM: new Date().getMonth(), endM: new Date().getMonth(), startY: new Date().getFullYear(), endY: new Date().getFullYear(), rnrs: '', skillsP: [], skillsO: [], tillDate: false, empType: '-1' }))
    setTimeout(()=>{this.inputUnsaved.call()},10)
  }
  addAnotherBoardExp = () => {
    store.dispatch(addBoardExpRow({ boardName: '', boardType: '-1', boardStartM: new Date().getMonth(), boardEndM: new Date().getMonth(), boardStartY: new Date().getFullYear(), boardEndY: new Date().getFullYear(), rnrs: '', stillMember: false }))
    setTimeout(()=>{this.inputUnsaved.call()},10)
  }
  deleteCountryAuth = (index, e) => {
    store.dispatch(deleteWorkAuthRow(index))
    setTimeout(()=>{this.inputUnsaved.call()},10)
    e.stopPropagation()
  }
  deleteEdicationBlock = (index, e) => {
    store.dispatch(deleteEducationRow(index))
    setTimeout(()=>{this.inputUnsaved.call()},10)
    e.stopPropagation()
  }
  deleteCertification = (index, e) => {
    store.dispatch(deleteCertificationRow(index))
    setTimeout(()=>{this.inputUnsaved.call()},10)
    e.stopPropagation()
  }
  deleteWorkExpBlock = (index, e) => {
    store.dispatch(deleteWorkExpRow(index))
    setTimeout(()=>{this.inputUnsaved.call()},10)
    e.stopPropagation()
  }
  deleteBoardExpBlock = (index, e) => {
    store.dispatch(deleteBoardExpRow(index))
    setTimeout(()=>{this.inputUnsaved.call()},10)
    e.stopPropagation()
  }
  updateBIpage = () => {
    this.setState({ dob: { value: document.getElementsByName("dob")[0].value.toString(), err: "" } })
    const payload = {
      basic_details: {
        title: this.state.title,
        first_name: this.state.first_name.value,
        last_name: this.state.last_name.value,
        recovery_email: this.state.recovery_email.value,
        phone: this.state.phone.value,
        dial_code: this.state.dial_code.value,
        country_name: this.state.country_name.value,
        zipcode: this.state.zipcode.value,
        address_line: this.state.address_line.value,
        state: this.state.state.value,
        city: this.state.city.value,
        citizenship: this.state.citizenship.value,
        dob: document.getElementsByName("dob")[0].value,
        gender: this.state.gender.value,
        profile_pic: this.state.profile_pic,
        other_country_authorization: this.state.other_country_authorization,
        is_student: this.state.is_student
      },
      personal_details: {
        aboutMe: this.state.aboutMe.value,
        countryList: Array.from(document.getElementsByName("countryName")).map(c => c.value),
        authType: Array.from(document.getElementsByName("authType")).map(c => c.value),
        sponsor: Array.from(document.getElementsByName("sponsor")).map(c => c.value),
        authExp: Array.from(document.getElementsByName("authExp")).map(c => c.value)
      }
    }
    if (payload.personal_details.aboutMe === "<p><br></p>") {
      this.setState({ aboutMe: { value: this.state.aboutMe.value, err: '' }, validPayload: false })
      document.getElementsByClassName('ql-editor')[0].style.boxShadow = '0px 0px 3px #C40223'
      document.getElementsByClassName('ql-editor')[0].focus()
      toast.error("About Me / Summary cannot be empty")
    }
    if (isInputEmpty(payload.basic_details.first_name)) {
      this.setState({ first_name: { value: this.state.first_name.value, err: 'First Name cannot be empty' }, validPayload: false })
      document.getElementsByName('first_name')[0].focus()
    }
    if (!alphaOnly(payload.basic_details.first_name)) {
      this.setState({ first_name: { value: this.state.first_name.value, err: 'Only alphabets allowed here' }, validPayload: false })
      document.getElementsByName('first_name')[0].focus()
    }
    if (isInputEmpty(payload.basic_details.last_name)) {
      this.setState({ last_name: { value: this.state.last_name.value, err: 'Last Name cannot be empty' }, validPayload: false })
      document.getElementsByName('last_name')[0].focus()
    }
    if (!alphaOnly(payload.basic_details.last_name)) {
      this.setState({ last_name: { value: this.state.last_name.value, err: 'Only alphabets allowed here' }, validPayload: false })
      document.getElementsByName('last_name')[0].focus()
    }
    if (isInputEmpty(payload.basic_details.phone)) {
      this.setState({ phone: { value: this.state.phone.value, err: 'Phone Number cannot be empty' }, validPayload: false })
      document.getElementsByName('phone')[0].focus()
    }
    if (!numOnly(payload.basic_details.phone)) {
      this.setState({ phone: { value: this.state.phone.value, err: 'Only numbers allowed here' }, validPayload: false })
      document.getElementsByName('phone')[0].focus()
    }
    if (payload.basic_details.dial_code === '-1') {
      this.setState({ phone: { value: this.state.phone.value, err: 'Country Code cannot be empty' }, validPayload: false })
      document.getElementsByName('phone')[0].focus()
    }
    if (payload.basic_details.recovery_email && !emailInFormat(payload.basic_details.recovery_email)) {
      this.setState({ recovery_email: { value: this.state.recovery_email.value, err: 'Invalid Email format' }, validPayload: false })
      document.getElementsByName('recovery_email')[0].focus()
    }
    if (payload.basic_details.recovery_email === this.state.registeredEmail) {
      this.setState({ recovery_email: { value: this.state.recovery_email.value, err: 'Email & Recovery Email cannot be same' }, validPayload: false })
      document.getElementsByName('recovery_email')[0].focus()
    }
    if (isInputEmpty(payload.basic_details.zipcode)) {
      this.setState({ zipcode: { value: this.state.zipcode.value, err: 'Zipcode cannot be empty' }, validPayload: false })
      document.getElementsByName('zipcode')[0].focus()
    }
    if (isZipcodeOk(payload.basic_details.zipcode)) {
      this.setState({ zipcode: { value: this.state.zipcode.value, err: 'Invalid Zipcode format' }, validPayload: false })
      document.getElementsByName('zipcode')[0].focus()
    }
    if (payload.basic_details.country_name === '-1') {
      this.setState({ country_name: { value: this.state.country_name.value, err: 'Country name is required' }, validPayload: false })
      document.getElementsByName('country_name')[0].focus()
    }
    if (isInputEmpty(payload.basic_details.state)) {
      this.setState({ state: { value: this.state.state.value, err: 'State cannot be empty' }, validPayload: false })
      document.getElementsByName('state')[0].focus()
    }
    if (!alphaOnly(payload.basic_details.state)) {
      this.setState({ state: { value: this.state.state.value, err: 'Only alphabets allowed here' }, validPayload: false })
      document.getElementsByName('state')[0].focus()
    }
    if (isInputEmpty(payload.basic_details.city)) {
      this.setState({ city: { value: this.state.city.value, err: 'City cannot be empty' }, validPayload: false })
      document.getElementsByName('city')[0].focus()
    }
    if (payload.basic_details.citizenship === '-1') {
      this.setState({ citizenship: { value: this.state.citizenship.value, err: 'Citizenship name is required' }, validPayload: false })
      document.getElementsByName('citizenship')[0].focus()
    }
    if (payload.basic_details.other_country_authorization.toUpperCase() === 'YES') {
      for (let i = 0; i < payload.personal_details.countryList.length; i++) {
        if (payload.personal_details.countryList[i].trim() === '') {
          Array.from(document.getElementsByName("countryName"))[i].classList.add("error-input")
          toast.error('Work Authorization Country Name cannot be empty.')
          document.getElementsByName('countryName')[i].focus()
          document.getElementsByName('countryName')[i].closest('.accordion__item').classList.add('err-in-acc')
          return false
        } else if (!alphaOnly(payload.personal_details.countryList[i].trim())) {
          Array.from(document.getElementsByName("countryName"))[i].classList.add("error-input")
          toast.error('Work Authorization Country Name cannot have numbers.')
          document.getElementsByName('countryName')[i].focus()
          document.getElementsByName('countryName')[i].closest('.accordion__item').classList.add('err-in-acc')
          return false
        } else if (payload.personal_details.authType[i].trim() === '') {
          Array.from(document.getElementsByName("authType"))[i].classList.add("error-input")
          toast.error('Work Authorization Type cannot be empty.')
          document.getElementsByName('authType')[i].focus()
          document.getElementsByName('authType')[i].closest('.accordion__item').classList.add('err-in-acc')
          return false
        }
      }
    }
    setTimeout(() => {
      if (this.state.validPayload) {
        store.dispatch(updateUserName(this.state.first_name.value, this.state.last_name.value)); store.dispatch(updatePhoneNo(this.state.phone.value));
        store.dispatch(updateRecoveryEmail(this.state.recovery_email.value)); store.dispatch(updateCountryName(this.state.country_name.value)); store.dispatch(updateDialCode(this.state.dial_code.value));
        store.dispatch(updateStateName(this.state.state.value)); store.dispatch(updateCityName(this.state.city.value)); store.dispatch(updateZipcode(this.state.zipcode.value));
        store.dispatch(updateAddressLine(this.state.address_line.value)); store.dispatch(updateCitizenship(this.state.citizenship.value)); store.dispatch(updateDateOfBirth(this.state.dob.value));
        store.dispatch(updateProfilePic(this.state.profile_pic)); store.dispatch(updateAuthorizedCountry(this.state.other_country_authorization));
        store.dispatch(setWorkAuthObj(payload.personal_details))
        store.dispatch(setIsStudent(this.state.is_student))
        putCall(PROFILE, payload, { sfn: this.postUpdateBIpage, efn: this.errUpdateBIpage })
      }
    }, 100)
  }
  updateEduCertPage = () => {
    const payload = {
      education: {
        institute: Array.from(document.getElementsByName("institute")).map(c => c.value),
        degree: Array.from(document.getElementsByName("degree")).map(c => c.value),
        special: Array.from(document.getElementsByName("special")).map(c => c.value),
        startM: Array.from(document.getElementsByName("eduStartM")).map(c => c.value.toString()),
        endM: Array.from(document.getElementsByName("eduEndM")).map(c => c.value.toString()),
        startY: Array.from(document.getElementsByName("eduStartY")).map(c => c.value.toString()),
        endY: Array.from(document.getElementsByName("eduEndY")).map(c => c.value.toString()),
        activities: Array.from(document.getElementsByName("activities")).map(c => c.value),
        societies: Array.from(document.getElementsByName("societies")).map(c => c.value),
        accomplishments: this.state.accomplishments.value
      },
      certifications: {
        name: Array.from(document.getElementsByName("certiName")).map(c => c.value),
        endM: Array.from(document.getElementsByName("certiEndM")).map(c => c.value.toString()),
        endY: Array.from(document.getElementsByName("certiEndY")).map(c => c.value.toString()),
        copy: Array.from(document.getElementsByName("certiUpload")).map(c => c.value)
      }
    }
    for (let i = 0; i < payload.education.institute.length; i++) {
      if (payload.education.institute[i].trim() === '') {
        Array.from(document.getElementsByName("institute"))[i].classList.add("error-input")
        toast.error('School Name cannot be empty.')
        document.getElementsByName('institute')[i].focus()
        document.getElementsByName('institute')[i].closest('.accordion__item').classList.add('err-in-acc')
        return false
      } else if (payload.education.degree[i].trim() === '') {
        Array.from(document.getElementsByName("degree"))[i].classList.add("error-input")
        toast.error('Degree Name cannot be empty.')
        document.getElementsByName('degree')[i].focus()
        document.getElementsByName('degree')[i].closest('.accordion__item').classList.add('err-in-acc')
        return false
      } else if (payload.education.special[i].trim() === '') {
        Array.from(document.getElementsByName("special"))[i].classList.add("error-input")
        toast.error('Major cannot be empty.')
        document.getElementsByName('special')[i].focus()
        document.getElementsByName('special')[i].closest('.accordion__item').classList.add('err-in-acc')
        return false
      }
    }
    for (let i = 0; i < payload.certifications.name.length; i++) {
      if (payload.certifications.name[i].trim() === '') {
        Array.from(document.getElementsByName("certiName"))[i].classList.add("error-input")
        toast.error('Certification Name cannot be empty.')
        document.getElementsByName('certiName')[i].focus()
        document.getElementsByName('certiName')[i].closest('.accordion__item').classList.add('err-in-acc')
        return false
      }
    }
    if (document.getElementsByClassName('block-error').length) {
      toast.error('One or more Start & End Dates are incorrect. Please verify.')
      return false
    }
    setTimeout(() => {
      store.dispatch(setEducationObj(payload.education))
      store.dispatch(setCertificationObj(payload.certifications))
      putCall(PROFILE, payload, { sfn: this.postUpdateEduCertPage, efn: this.errUpdateEduCertPage })
    }, 100)
  }
  errUpdateEduCertPage = () => {
    toast.error("Server failed to respond. Please try again later.")
  }
  updateWorkExpPage = () => {
    let slillsListP = Array.from(document.getElementsByClassName("skillsP")).map(c => c.textContent).map(i => i.split(' ,'))
    let slillsListO = Array.from(document.getElementsByClassName("skillsO")).map(c => c.textContent).map(i => i.split(' ,'))
    slillsListP.map(i => i.pop())
    slillsListO.map(i => i.pop())
    const payload = {
      work_experience: {
        orgNames: Array.from(document.getElementsByName("orgNames")).map(c => c.value),
        designations: Array.from(document.getElementsByName("designations")).map(c => c.value),
        industry: Array.from(document.getElementsByName("industry")).map(c => c.value),
        empType: Array.from(document.getElementsByName("empType")).map(c => c.value),
        jobTitles: Array.from(document.getElementsByName("jobTitles")).map(c => c.value),
        role: Array.from(document.getElementsByName("role")).map(c => c.value),
        skillsP: slillsListP,
        skillsO: slillsListO,
        rnrs: Array.from(document.getElementsByClassName("rnrs")).map(i => i.lastChild.firstChild.innerHTML),
        startM: Array.from(document.getElementsByName("WEstartM")).map(c => c.value.toString()),
        endM: Array.from(document.getElementsByName("WEendM")).map(c => c.value.toString()),
        startY: Array.from(document.getElementsByName("WEstartY")).map(c => c.value.toString()),
        endY: Array.from(document.getElementsByName("WEendY")).map(c => c.value.toString()),
        currentlyWorking: this.state.currentlyWorking,
        total_experience: this.state.total_experience.value,
        tillDate: Array.from(document.getElementsByClassName("in-box-work")).map(c => c.attributes.datavalue.value === "true"),
        current_salary: {
          workCountry: this.state.workCountry.value,
          amount: this.state.amount.value,
          currency: this.state.currency.value,
          salary_range: this.state.salary_range.value
        }
      },
      board_experience: {
        boardName: Array.from(document.getElementsByName("boardName")).map(c => c.value),
        boardType: Array.from(document.getElementsByName("boardType")).map(c => c.value),
        boardStartM: Array.from(document.getElementsByName("boardStartM")).map(c => c.value.toString()),
        boardEndM: Array.from(document.getElementsByName("boardEndM")).map(c => c.value.toString()),
        boardStartY: Array.from(document.getElementsByName("boardStartY")).map(c => c.value.toString()),
        boardEndY: Array.from(document.getElementsByName("boardEndY")).map(c => c.value.toString()),
        stillMember: Array.from(document.getElementsByClassName("in-box-board")).map(c => c.attributes.datavalue.value === "true"),
      }
    }
    if (!numOnlyDots(payload.work_experience.total_experience)) {
      this.setState({ total_experience: { value: this.state.total_experience.value, err: 'Can be a number or decimal' }, validPayload: false })
      document.getElementsByName('total_experience')[0].focus()
    }
    if (payload.work_experience.current_salary.workCountry === '-1') {
      this.setState({ workCountry: { value: this.state.workCountry.value, err: 'Please make a selection' }, validPayload: false })
      document.getElementsByName('workCountry')[0].focus()
    }
    if (payload.work_experience.current_salary.currency === '-1') {
      this.setState({ currency: { value: this.state.currency.value, err: 'Please make a selection' }, validPayload: false })
      document.getElementsByName('currency')[0].focus()
    }
    if (payload.work_experience.current_salary.salary_range === '-1') {
      this.setState({ salary_range: { value: this.state.salary_range.value, err: 'Please make a selection' }, validPayload: false })
      document.getElementsByName('salary_range')[0].focus()
    }
    if (!(payload.work_experience.current_salary.amount)) {
      this.setState({ validPayload: false })
      toast.error('Your Salary cannot be 0. Kindly drag the pointer.')
    }
    for (let i = 0; i < payload.work_experience.orgNames.length; i++) {
      if (payload.work_experience.orgNames[i].trim() === '') {
        Array.from(document.getElementsByName("orgNames"))[i].classList.add("error-input")
        toast.error('One or more Organization Name is empty.')
        document.getElementsByName('orgNames')[i].focus()
        document.getElementsByName('orgNames')[i].closest('.accordion__item').classList.add('err-in-acc')
        return false
      } else if (payload.work_experience.designations[i].trim() === '') {
        Array.from(document.getElementsByName("designations"))[i].classList.add("error-input")
        toast.error('One or more Designation value is empty.')
        document.getElementsByName('designations')[i].focus()
        document.getElementsByName('designations')[i].closest('.accordion__item').classList.add('err-in-acc')
        return false
      } else if (payload.work_experience.industry[i].trim() === '-1') {
        Array.from(document.getElementsByName("industry"))[i].classList.add("error-input")
        toast.error('One of the Industry is not selected')
        document.getElementsByName('industry')[i].focus()
        document.getElementsByName('industry')[i].closest('.accordion__item').classList.add('err-in-acc')
        return false
      } else if (payload.work_experience.jobTitles[i] === '-1') {
        Array.from(document.getElementsByName("jobTitles"))[i].classList.add("error-input")
        toast.error('One of the Function is not selected')
        document.getElementsByName('jobTitles')[i].focus()
        document.getElementsByName('jobTitles')[i].closest('.accordion__item').classList.add('err-in-acc')
        return false
      } else if (payload.work_experience.role[i] === '-1') {
        Array.from(document.getElementsByName("role"))[i].classList.add("error-input")
        toast.error('One of the Role is not selected.')
        document.getElementsByName('role')[i].focus()
        document.getElementsByName('role')[i].closest('.accordion__item').classList.add('err-in-acc')
        return false
      } else if (payload.work_experience.skillsP[i].length < 1) {
        Array.from(document.getElementsByName("skillsP"))[i].classList.add("error-input")
        toast.error('One or more primary skills is missing.')
        document.getElementsByName('skillsP')[i].focus()
        document.getElementsByName('skillsP')[i].closest('.accordion__item').classList.add('err-in-acc')
        return false
      }
    }
    for (let i = 0; i < payload.board_experience.boardName.length; i++) {
      if (payload.board_experience.boardName[i].trim() === '') {
        Array.from(document.getElementsByName("boardName"))[i].classList.add("error-input")
        toast.error('One or more Board Name is empty.')
        document.getElementsByName('boardName')[i].focus()
        document.getElementsByName('boardName')[i].closest('.accordion__item').classList.add('err-in-acc')
        return false
      } else if (payload.board_experience.boardType[i] === '-1') {
        Array.from(document.getElementsByName("boardType"))[i].classList.add("error-input")
        toast.error('One or more Board type is not selected.')
        document.getElementsByName('boardType')[i].focus()
        document.getElementsByName('boardType')[i].closest('.accordion__item').classList.add('err-in-acc')
        return false
      }
    }
    if (document.getElementsByClassName('block-error').length) {
      toast.error('One or more Start & End Dates are incorrect. Please verify.')
      return false
    }
    setTimeout(() => {
      if (this.state.validPayload) {
        store.dispatch(setWorkExpObj(payload.work_experience))
        store.dispatch(setBoardExpObj(payload.board_experience))
        putCall(PROFILE, payload, { sfn: this.postUpdateWorkExpPage, efn: this.errUpdateWorkExpPage })
      }
    }, 100)
  }
  errUpdateWorkExpPage = () => {
    toast.error("Server failed to respond. Please try again later.")
  }
  updateSocialPage = () => {
    const payload = {
      social_links: {
        facebook: this.state.facebook.trim() !== '' ? this.state.facebook.trim().search('.com/') >= 0 ? this.state.facebook.trim().split('.com/')[1] : this.state.facebook.trim() : '',
        twitter: this.state.twitter.trim() !== '' ? this.state.twitter.trim().search('.com/') >= 0 ? this.state.twitter.trim().split('.com/')[1] : this.state.twitter.trim() : '',
        linkedin: this.state.linkedin.trim() !== '' ? this.state.linkedin.trim().search('.com/') >= 0 ? this.state.linkedin.trim().split('.com/')[1] : this.state.linkedin.trim() : '',
        instagram: this.state.instagram.trim() !== '' ? this.state.instagram.trim().search('.com/') >= 0 ? this.state.instagram.trim().split('.com/')[1] : this.state.instagram.trim() : '',
        pinterest: this.state.pinterest.trim() !== '' ? this.state.pinterest.trim().search('.com/') >= 0 ? this.state.pinterest.trim().split('.com/')[1] : this.state.pinterest.trim() : '',
        github: this.state.github.trim() !== '' ? this.state.github.trim().search('.com/') >= 0 ? this.state.github.trim().split('.com/')[1] : this.state.github.trim() : ''
      }
    }
    store.dispatch(setSocialLinks(payload.social_links))
    putCall(PROFILE, payload, { sfn: this.postUpdateSocialLinks, efn: this.errUpdateSocialLinks })
  }
  errUpdateSocialLinks = () => {
    toast.error("Server failed to respond. Please try again later.")
  }
  postUpdateSocialLinks = (data) => {
    this.setState({ inputUnsaved: false })
    store.dispatch(setProfileCompletion(data.response.profileCompletionPercentage))
    toast.success('Your Social links information successfully saved')
    this.goNext.call()
  }
  postUpdateWorkExpPage = (data) => {
    this.setState({ inputUnsaved: false })
    getCall(SALARY_MEAN, {}, { sfn: this.postSalaryFetch, efn: this.errorSalaryFetch })
    store.dispatch(setProfileCompletion(data.response.profileCompletionPercentage))
    toast.success('Your Work Experience information successfully saved')
    this.goNext.call()
  }
  errorSalaryFetch = () => {
    toast.error("Server failed to respond. Please try again later.")
  }
  postSalaryFetch = (data) => {
    store.dispatch(setSalaryMean(data.msg))
  }
  postUpdateEduCertPage = (data) => {
    this.setState({ inputUnsaved: false })
    store.dispatch(setProfileCompletion(data.response.profileCompletionPercentage))
    toast.success('Your education & certification information successfully saved')
    this.goNext.call()
  }
  postUpdateBIpage = (data) => {
    this.setState({ inputUnsaved: false })
    store.dispatch(setProfileCompletion(data.response.profileCompletionPercentage))
    toast.success('Your basic information successfully saved')
    this.goNext.call()
  }
  updatePaymentPage = () => {
    if (this.props.state.basicInfo.payment_status) {
      store.dispatch(showFlatForm(false))
    } else {
      toast.error('Subscriprion is required to proceed.')
    }
  }
  errUpdateBIpage = () => { toast.error("Server failed to respond. Please try again later.") }
  setCroppedImage = (data) => {
    this.setState({ profile_pic: data, showEditor: false, inputUnsaved: true })
  }
  handleDrag = (reset) => {
    let fullWidth = document.getElementById('sliderRange').offsetWidth
    let element = document.getElementById('rangeMarker')
    let position = reset === "reset" ? 0 : Number(window.getComputedStyle(element).webkitTransform.split(',')[4].trim());
    let mySalary = Math.ceil(((position / fullWidth) * 500000) + this.state.minSal)
    this.setState({ amount: { value: mySalary, err: '' }, validPayload: true, defaultSliderPos: position, inputUnsaved: true })
  }
  unsaveAlert = () => {
    this.setState({ unsaveAlert: true })
  }
  discardChanges = () => {
    this.setState({ unsaveAlert: false, inputUnsaved: false })
    if (this.state.triggerFrom.type === 'tab') {
      this.setState({ currPage: this.state.triggerFrom.val })
    } else {
      this.setState({ currPage: this.state.currPage - 1 })
    }
  }
  removeVideo = () => {
    this.setState({ videoshot: null })
    putCall(PROFILE, { media: { ...this.props.state.profile.media, videoshot: null } }, {})
  }
  render() {
    const { profile } = this.props.state
    let { personal_details, education, certifications, work_experience, board_experience } = profile
    let caLength = personal_details.countryList ? personal_details.countryList.length : 0
    if (!caLength && this.state.other_country_authorization === "YES") {
      this.addAnotherAuth.call()
    }
    let ebLength = education.degree ? education.degree.length : 0
    if (!ebLength) {
      this.addAnotherEducation.call()
    }
    let crLength = certifications.name ? certifications.name.length : 0
    let weLength = work_experience.orgNames ? work_experience.orgNames.length : 0
    if (!weLength) {
      this.addAnotherWorkExp.call()
    }
    let countryAuthChildren = [], educationBlockChildren = [], certificationBlockChildren = [], workExpBlockChildren = [], boardExpBlockChildren = []
    for (let i = 0; i < caLength; i++) {
      countryAuthChildren.push(
        <CountryAuthBlock
          ifDeleted={this.deleteCountryAuth.bind(this, i)}
          isEdited={this.inputUnsaved.bind(this, i)}
          key={`ca_${i}`}
          countryName={personal_details.countryList[i]}
          authType={personal_details.authType[i]}
          sponsor={personal_details.sponsor && personal_details.sponsor.length ? personal_details.sponsor[i] : ''}
          expiry={personal_details.authExp[i]}
        />)
    }
    for (let i = 0; i < crLength; i++) {
      certificationBlockChildren.push(
        <CertificationBlock
          ifDeleted={this.deleteCertification.bind(this, i)}
          isEdited={this.inputUnsaved.bind(this, i)}
          key={`cr_${i}`}
          certiName={certifications.name[i]}
          certiEndM={certifications.endM && certifications.endM.length ? certifications.endM[i] : new Date().getMonth()}
          certiEndY={certifications.endY && certifications.endY.length ? certifications.endY[i] : new Date().getFullYear()}
          certiUpload={certifications.copy ? certifications.copy[i] : require('../../../images/icons/placeholder-profile.jpg')}
        />)
    }
    for (let i = 0; i < ebLength; i++) {
      educationBlockChildren.push(
        <EducationBlock
          ifDeleted={this.deleteEdicationBlock.bind(this, i)}
          isEdited={this.inputUnsaved.bind(this, i)}
          key={`eb_${i}`}
          institute={education.institute[i]}
          degree={education.degree[i]}
          special={education.special[i]}
          eduStartM={education.startM && education.startM.length ? education.startM[i] : new Date().getMonth()}
          eduEndM={education.endM && education.endM.length ? education.endM[i] : new Date().getMonth()}
          eduStartY={education.startY && education.startY.length ? education.startY[i] : new Date().getFullYear()}
          eduEndY={education.endY && education.endY.length ? education.endY[i] : new Date().getFullYear()}
          activities={education.activities ? education.activities[i] : ''}
          societies={education.societies ? education.societies[i] : ''}
        />
      )
    }
    for (let i = 0; i < weLength; i++) {
      workExpBlockChildren.push(
        <WorkExpBlock
          ifDeleted={this.deleteWorkExpBlock.bind(this, i)}
          isEdited={this.inputUnsaved.bind(this, i)}
          key={`we_${i}`}
          orgNames={work_experience.orgNames[i] || ''}
          jobTitles={work_experience.jobTitles[i] || ''}
          industry={work_experience.industry && work_experience.industry[i] || ''}
          designations={work_experience.designations[i] || ''}
          WEstartM={work_experience.startM && work_experience.startM.length ? work_experience.startM[i] : new Date().getMonth()}
          WEendM={work_experience.endM && work_experience.endM.length ? work_experience.endM[i] : new Date().getMonth()}
          WEstartY={work_experience.startY && work_experience.startY.length ? work_experience.startY[i] : new Date().getFullYear()}
          WEendY={work_experience.endY && work_experience.endY.length ? work_experience.endY[i] : new Date().getFullYear()}
          rnrs={work_experience.rnrs[i] || ''}
          skillsP={work_experience.skillsP ? typeof (work_experience.skillsP[i]) === "string" ? [] : work_experience.skillsP[i] || [] : []}
          skillsO={work_experience.skillsO ? typeof (work_experience.skillsO[i]) === "string" ? [] : work_experience.skillsO[i] || [] : []}
          dropdowns={this.state.dropdowns}
          unique={`we_${i}`}
          role={work_experience.role ? work_experience.role[i] : '-1'}
          tillDate={work_experience.tillDate ? work_experience.tillDate[i] : false}
          empType={work_experience.empType ? work_experience.empType[i] : '-1'}
        />
      )
    }
    let bxLength = board_experience.boardName ? board_experience.boardName.length : 0
    for (let i = 0; i < bxLength; i++) {
      boardExpBlockChildren.push(
        <BoardExpBlock
          ifDeleted={this.deleteBoardExpBlock.bind(this, i)}
          isEdited={this.inputUnsaved.bind(this, i)}
          key={`bx_${i}`}
          unique={`bx_${i}`}
          boardName={board_experience.boardType ? board_experience.boardName[i] : '-1'}
          boardType={board_experience.boardType ? board_experience.boardType[i] : '-1'}
          boardStartM={board_experience.boardStartM && board_experience.boardStartM.length ? board_experience.boardStartM[i] : new Date().getMonth()}
          boardStartY={board_experience.boardStartY && board_experience.boardStartY.length ? board_experience.boardStartY[i] : new Date().getFullYear()}
          boardEndM={board_experience.boardEndM && board_experience.boardEndM.length ? board_experience.boardEndM[i] : new Date().getMonth()}
          boardEndY={board_experience.boardEndY && board_experience.boardEndY.length ? board_experience.boardEndY[i] : new Date().getFullYear()}
        />
      )
    }
    const browser = Bowser.name.toLowerCase();
    return (
      <div id="ProfileEdit">
        <span className="close-pro-edit" onClick={this.closeForm}>&times;</span>
        <div id="progress-holder" className="container text-center">
          <ul>
            <li className={this.state.currPage === 1 ? "prog-icon-curr" : "prog-icon"} onClick={() => { this.setState({ triggerFrom: { type: 'tab', val: 1 } }); this.state.inputUnsaved ? this.unsaveAlert.call() : this.setState({ currPage: 1 }) }}><span className="fa fa-user"></span></li>
            <li className="prog-line"></li>
            <li className={this.state.currPage === 2 ? "prog-icon-curr" : "prog-icon"} onClick={() => { this.setState({ triggerFrom: { type: 'tab', val: 2 } }); this.state.inputUnsaved ? this.unsaveAlert.call() : this.setState({ currPage: 2 }) }}><span className="fa fa-book"></span></li>
            <li className="prog-line"></li>
            <li className={this.state.currPage === 3 ? "prog-icon-curr" : "prog-icon"} onClick={() => { this.setState({ triggerFrom: { type: 'tab', val: 3 } }); this.state.inputUnsaved ? this.unsaveAlert.call() : this.setState({ currPage: 3 }) }}><span className="fa fa-building"></span></li>
            <li className="prog-line"></li>
            <li className={this.state.currPage === 4 ? "prog-icon-curr" : "prog-icon"} onClick={() => { this.setState({ triggerFrom: { type: 'tab', val: 4 } }); this.state.inputUnsaved ? this.unsaveAlert.call() : this.setState({ currPage: 4 }) }}><span className="fa fa-video-camera"></span></li>
            <li className="prog-line"></li>
            <li className={this.state.currPage === 5 ? "prog-icon-curr" : "prog-icon"} onClick={() => { this.setState({ triggerFrom: { type: 'tab', val: 5 } }); this.state.inputUnsaved ? this.unsaveAlert.call() : this.setState({ currPage: 5 }) }}><span className="fa fa-credit-card"></span></li>
          </ul>
        </div>
        <div id="ProfileEdit-holder" className="container">
          <div className="profile-edit-box">
            {this.state.currPage === 1 &&
              <span>
                <h3 className="text-center bold">BASIC INFORMATION</h3>
                <div className="auto-scroller">
                  <form>
                    <div className="row">
                      <div className="col-sm-12">
                        <div className="profile-pic-sec">
                          <div className="pic-holder">
                            <img src={this.state.profile_pic} alt="" className="fit-layout rounded" />
                            <div className="overlay-edit rounded"><span className="fa fa-pencil-square-o" onClick={this.imageEditorTogg}></span></div>
                            {this.state.showEditor && <ImageCroper media={this.props.state.profile.media} updatePic={this.setCroppedImage} closeEditor={this.imageEditorTogg} originalPic={this.state.profile_pic} />}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-12"></div>  {/*Required*/}
                      <div className="col-sm-12">
                        <span className="input-label">About Me/Summary</span><span className='mandate'> *</span>
                        <ReactQuill className="aboutMe" onChange={this.handleAboutChange} value={this.state.aboutMe.value} />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-4">
                        <span className="input-label"> First Name</span><span className='mandate'> *</span>
                        <input className={this.state.first_name.err === '' ? "general-input" : "general-input error-input"} type="text" value={this.state.first_name.value} name="first_name" onChange={this.updateInputState} />
                        {this.state.first_name.err !== '' && <div className="error-info">{this.state.first_name.err}</div>}
                      </div>
                      <div className="col-sm-4">
                        <span className="input-label">Last Name</span><span className='mandate'> *</span>
                        <input className={this.state.last_name.err === '' ? "general-input" : "general-input error-input"} type="text" value={this.state.last_name.value} name="last_name" onChange={this.updateInputState} />
                        {this.state.last_name.err !== '' && <div className="error-info">{this.state.last_name.err}</div>}
                      </div>
                      <div className="col-sm-4">
                        <span className="input-label"> Phone No</span><span className='mandate'> *</span>
                        <select className="inner-input" value={this.state.dial_code.value} name="dial_code" onChange={this.updateInputState}>
                          <option value='-1'>+</option>
                          {dialcodes.map(i => <option key={i} value={i}>{i}</option>)}
                        </select>
                        <input style={{ paddingLeft: '90px' }} className={this.state.phone.err === '' ? "general-input" : "general-input error-input"} maxLength={10} type="text" value={this.state.phone.value} name="phone" onChange={this.updateInputState} />
                        {this.state.phone.err !== '' && <div className="error-info">{this.state.phone.err}</div>}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-12"></div>
                      <div className="col-sm-4">
                        <span className="input-label">Recovery Email</span>
                        <input className={this.state.recovery_email.err === '' ? "general-input" : "general-input error-input"} type="email" value={this.state.recovery_email.value} name="recovery_email" onChange={this.updateInputState} />
                        {this.state.recovery_email.err !== '' && <div className="error-info">{this.state.recovery_email.err}</div>}
                      </div>
                      <div className="col-sm-4">
                        <span className="input-label">Zip Code</span><span className='mandate'> *</span>
                        <input maxLength={11} className={this.state.zipcode.err === '' ? "general-input" : "general-input error-input"} type="text" value={this.state.zipcode.value} name="zipcode" onChange={this.updateInputState} />
                        {this.state.zipcode.err !== '' && <div className="error-info">{this.state.zipcode.err}</div>}
                      </div>
                      <div className="col-sm-4">
                        <span className="input-label">Address Line</span>
                        <input className={this.state.address_line.err === '' ? "general-input" : "general-input error-input"} type="text" value={this.state.address_line.value} name="address_line" onChange={this.updateInputState} />
                        {this.state.address_line.err !== '' && <div className="error-info">{this.state.address_line.err}</div>}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-4">
                        <span className="input-label">Country</span><span className='mandate'> *</span>
                        <select className={this.state.country_name.err === '' ? "general-input" : "general-input error-input"} value={this.state.country_name.value} name="country_name" onChange={this.updateInputState}>
                          <option value='-1'>Select Country</option>
                          {this.state.allCountries.map(i => <option key={i} value={i}>{i}</option>)}
                        </select>
                        {this.state.country_name.err !== '' && <div className="error-info">{this.state.country_name.err}</div>}
                      </div>
                      <div className="col-sm-4">
                        <span className="input-label">State/Province</span><span className='mandate'> *</span>
                        <input className={this.state.state.err === '' ? "general-input" : "general-input error-input"} value={this.state.state.value} name="state" onChange={this.updateInputState} />
                        {this.state.state.err !== '' && <div className="error-info">{this.state.state.err}</div>}
                      </div>
                      <div className="col-sm-4">
                        <span className="input-label">City/Region</span><span className='mandate'> *</span>
                        <input className={this.state.city.err === '' ? "general-input" : "general-input error-input"} value={this.state.city.value} name="city" onChange={this.updateInputState} />
                        {this.state.city.err !== '' && <div className="error-info">{this.state.city.err}</div>}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-4">
                        <span className="input-label">Country of Citizenship</span><span className='mandate'> *</span>
                        <select className={this.state.citizenship.err === '' ? "general-input" : "general-input error-input"} value={this.state.citizenship.value} name="citizenship" onChange={this.updateInputState}>
                          <option value='-1'>Select Country of Citizenship</option>
                          {this.state.allCountries.map(i => <option key={i} value={i}>{i}</option>)}
                        </select>
                        {this.state.citizenship.err !== '' && <div className="error-info">{this.state.citizenship.err}</div>}
                      </div>
                      <div className="col-sm-4">
                        <span className="input-label">Date Of Birth (MM/DD/YYYY)</span>
                        <DatepickerComponent date={this.state.dob.value} max={new Date()} min={null} name="dob" onChange={this.updateInputState} />
                      </div>
                      <div className="col-sm-4">
                        <span className="input-label">Gender</span>
                        <select className="general-input" name="gender" value={this.state.gender.value} onChange={this.updateInputState}>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Others">Others</option>
                        </select>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-xs-12" style={{ marginTop: "30px" }}>
                        <span className="input-label">Are you currently a student? </span><span className='mandate'> *</span>
                        <span onClick={() => this.setState({ is_student: "NO" })}><Radio content="NO" name="is_student" selected={this.state.is_student === "NO"} /></span>
                        <span onClick={() => this.setState({ is_student: "YES" })}><Radio content="YES" name="is_student" selected={this.state.is_student === "YES"} /></span>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-xs-12" style={{ marginTop: "30px" }}>
                        <span className="input-label">Are you authorized to work in any other countries? </span><span className='mandate'> *</span>
                        <span onClick={() => this.setState({ other_country_authorization: "NO" })}><Radio content="NO" name="workAuth" selected={this.state.other_country_authorization === "NO"} /></span>
                        <span onClick={() => this.setState({ other_country_authorization: "YES" })}><Radio content="YES" name="workAuth" selected={this.state.other_country_authorization === "YES"} /></span>
                      </div>
                    </div>
                    <p></p>
                    {this.state.other_country_authorization === "YES" &&
                      <div>
                        <div ref={this.countryAuthList}>
                          <MitAccordion blocks={countryAuthChildren} allowZeroExpanded={true} type="auth" />
                        </div>
                        <button type="button" className="btn-sub-form" onClick={this.addAnotherAuth}><span className="fa fa-plus"></span> Add Another</button>
                      </div>
                    }
                  </form>
                </div>
                <div className="submit-holder text-right">
                  <button type="button" className="btn-general" onClick={this.updateBIpage}>Save &amp; Continue</button>
                </div>
              </span>
            }
            {this.state.currPage === 2 &&
              <span>
                <h3 className="text-center bold">EDUCATION &amp; CERTIFICATION</h3>
                <div className="auto-scroller">
                  <form>
                    <MitAccordion blocks={educationBlockChildren} allowZeroExpanded={true} type="education" />
                    <button type="button" className="btn-sub-form" onClick={this.addAnotherEducation}><span className="fa fa-plus"></span> Add Education</button><hr />
                    <MitAccordion blocks={certificationBlockChildren} allowZeroExpanded={true} type="certification" />
                    <button type="button" className="btn-sub-form" onClick={this.addAnotherCertification}><span className="fa fa-plus"></span> Add Certification</button>
                  </form>
                </div>
                <div className="row">
                  <div className="col-xs-6">
                    <div className="submit-holder">
                      <button type="button" className="btn-general" onClick={this.goBack}>Go Back</button>
                    </div>
                  </div>
                  <div className="col-xs-6">
                    <div className="submit-holder text-right">
                      <button type="button" className="btn-general" onClick={this.updateEduCertPage}>Save &amp; Continue</button>
                    </div>
                  </div>
                </div>
              </span>}
            {this.state.currPage === 3 &&
              <span>
                <h3 className="text-center bold">WORK EXPERIENCE</h3>
                <div className="auto-scroller">
                  <form>
                    <div className="row">
                      <div className="col-sm-6" style={{ marginBottom: "10px" }}>
                        <span className="input-label">Do you have work experience? </span><span className='mandate'> *</span>
                        <span onClick={() => this.setState({ currentlyWorking: false })}><Radio content="NO" name="currentlyWorking" selected={this.state.currentlyWorking === false} /></span>
                        <span onClick={() => this.setState({ currentlyWorking: true })}><Radio content="YES" name="currentlyWorking" selected={this.state.currentlyWorking} /></span>
                      </div>
                      <div className="col-sm-6" style={{ marginBottom: "10px" }}>
                        <span className="input-label">Total experience? </span><span className='mandate'> *</span>
                        <input name='total_experience' className={this.state.total_experience.err ? "exp-inp err" : "exp-inp"} disabled={!this.state.currentlyWorking} placeholder="0" onChange={this.updateInputState} value={this.state.currentlyWorking ? this.state.total_experience.value : 0} /> years
                        {this.state.total_experience.err !== '' && <span className="side-err">{this.state.total_experience.err}</span>}
                      </div>
                    </div>
                    {this.state.currentlyWorking && <MitAccordion blocks={workExpBlockChildren} allowZeroExpanded={true} type="work" />}
                    {this.state.currentlyWorking && <button type="button" className="btn-sub-form" onClick={this.addAnotherWorkExp}><span className="fa fa-plus"></span> Add Another</button>}
                    <hr />
                    <div className="row">
                      <div className="col-sm-12">
                        <h3 className="text-center">BOARD EXPERIENCE</h3>
                      </div>
                      <div className="col-sm-12" style={{ marginBottom: "10px" }}>
                        <span className="input-label">Do you have board experience? </span><span className='mandate'> *</span>
                        <span onClick={() => this.setState({ addBoardExp: false })}><Radio content="NO" name="addBoardExp" selected={this.state.addBoardExp === false} /></span>
                        <span onClick={() => this.setState({ addBoardExp: true })}><Radio content="YES" name="addBoardExp" selected={this.state.addBoardExp} /></span>
                      </div>
                      {this.state.addBoardExp &&
                        <div className="col-sm-12">
                          <MitAccordion blocks={boardExpBlockChildren} allowZeroExpanded={true} type="board" />
                          <button type="button" className="btn-sub-form" onClick={this.addAnotherBoardExp}><span className="fa fa-plus"></span> Add Board Experience</button>
                        </div>
                      }
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-sm-12">
                        <h3 className="text-center">COMPENSATION</h3>
                        <p style={{ fontSize: '0.85em', textAlign: 'center' }}>**This information is for your use only and will not be shared to anyone</p>
                      </div>
                      <div className="col-sm-4">
                        <span className="input-label">Country</span><span className='mandate'> *</span>
                        <select name="workCountry" className={this.state.workCountry.err === '' ? "general-input" : "general-input error-input"} value={this.state.workCountry.value} onChange={this.updateInputState}>
                          <option value="-1">Select Country</option>
                          {this.state.allCountries.map(i => <option key={i} value={i}>{i}</option>)}
                        </select>
                        {this.state.workCountry.err !== '' && <div className="error-info">{this.state.workCountry.err}</div>}
                      </div>
                      <div className="col-sm-4">
                        <span className="input-label">Salary Currency</span><span className='mandate'> *</span>
                        <select name="currency" className={this.state.currency.err === '' ? "general-input" : "general-input error-input"} value={this.state.currency.value} onChange={this.updateInputState}>
                          <option value="-1">Select a Currency</option>
                          {this.state.allCurrencies.map(i => <option key={i.code} value={i.code}>{i.name} ({i.code})</option>)}
                        </select>
                        {this.state.currency.err !== '' && <div className="error-info">{this.state.currency.err}</div>}
                      </div>
                      <div className="col-sm-4">
                        <span className="input-label">Salary Range</span><span className='mandate'> *</span>
                        <select name="salary_range" className={this.state.salary_range.err === '' ? "general-input" : "general-input error-input"} value={this.state.salary_range.value} onChange={this.updateInputState}>
                          <option value="-1">Select Salary Range</option>
                          <option value="r1">0.0M - 0.5M ({this.state.currency.value})</option>
                          <option value="r2">0.5M - 1.0M ({this.state.currency.value})</option>
                          <option value="r3">1.0M - 1.5M ({this.state.currency.value})</option>
                          <option value="r4">1.5M - 2.0M ({this.state.currency.value})</option>
                          <option value="r5">2.0M - 2.5M ({this.state.currency.value})</option>
                          <option value="r6">2.5M - 3.0M ({this.state.currency.value})</option>
                        </select>
                        {this.state.salary_range.err !== '' && <div className="error-info">{this.state.salary_range.err}</div>}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-12">
                        <span className="input-label">Current Salary</span>
                        <div className='salary-bar in-form' id='sliderRange' ref={this.sliderRange}>
                          <Draggable
                            axis="x"
                            handle=".handle"
                            defaultPosition={{ x: this.state.defaultSliderPos, y: 0 }}
                            grid={[1]}
                            scale={1}
                            bounds={`parent`}
                            onDrag={this.handleDrag}
                          >
                            <div className="slider-box" id="rangeMarker">
                              <div className="handle"><span className="fa fa-caret-down"></span></div>
                            </div>
                          </Draggable>
                        </div>
                        <img src={require('../../../images/icons/scale.jpg')} alt='' className='fit-layout' />
                        <ul className="salary-meter">
                          <li style={{ width: 0 }}></li>
                          {this.state.partitions.map(i => <li key={i}>{i} M</li>)}
                          <li style={{ width: 0 }}></li>
                        </ul>
                      </div>
                    </div>
                  </form>
                </div>
                <div className="row">
                  <div className="col-xs-6">
                    <div className="submit-holder">
                      <button type="button" className="btn-general" onClick={this.goBack}>Go Back</button>
                    </div>
                  </div>
                  <div className="col-xs-6">
                    <div className="submit-holder text-right">
                      <button type="button" className="btn-general" onClick={this.updateWorkExpPage}>Save &amp; Continue</button>
                    </div>
                  </div>
                </div>
              </span>}
            {this.state.currPage === 4 &&
              <span>
                <h3 className="text-center bold">Social Handles</h3>
                <div className="auto-scroller">
                  <div className="form-like">
                    <div className="row">
                      <div className="col-sm-6">
                        <div className="row">
                          <div className="col-sm-12">
                            <span className="input-label">Facebook</span>
                            <i className="social-in-input fa fa-facebook"></i>
                            <input className="general-input with-icon" value={this.state.facebook} name="facebook-handle" onChange={this.updateInputState} />
                          </div>
                          <div className="col-sm-12">
                            <span className="input-label">Twitter</span>
                            <i className="social-in-input fa fa-twitter"></i>
                            <input className="general-input with-icon" value={this.state.twitter} name="twitter-handle" onChange={this.updateInputState} />
                          </div>
                          <div className="col-sm-12">
                            <span className="input-label">Instagram</span>
                            <i className="social-in-input fa fa-instagram"></i>
                            <input className="general-input with-icon" value={this.state.instagram} name="instagram-handle" onChange={this.updateInputState} />
                          </div>
                          <div className="col-sm-12">
                            <span className="input-label">Linkedin</span>
                            <i className="social-in-input fa fa-linkedin"></i>
                            <input className="general-input with-icon" value={this.state.linkedin} name="linkedin-handle" onChange={this.updateInputState} />
                          </div>
                          <div className="col-sm-12">
                            <span className="input-label">Github</span>
                            <i className="social-in-input fa fa-github"></i>
                            <input className="general-input with-icon" value={this.state.github} name="github-handle" onChange={this.updateInputState} />
                          </div>
                          <div className="col-sm-12">
                            <span className="input-label">Pinterest</span>
                            <i className="social-in-input fa fa-pinterest"></i>
                            <input className="general-input with-icon" value={this.state.pinterest} name="pinterest-handle" onChange={this.updateInputState} />
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="record-holders">
                          {this.state.videoCameraOn ?
                            <p style={{ margin: '40px auto 10px', fontSize: '0.85em' }}>*Kindly click on the button on the recorder display to start recording.</p>
                            :
                            <button type="button" className="btn-recording" onClick={this.turnCameraOn}>{this.state.videoshot ? "Discard/Retake" : "Turn Camera On"}</button>
                          }
                        </div>
                        <div className="player-holder">
                          {this.state.videoCameraOn ?
                            <div style={{ position: "relative" }}>
                              <video style={{ width: '100%' }} id="myCamera"></video>
                              <p className="countdown-clock">{this.state.countdown}</p>
                              <div className="rec-btn-holder">
                                <button id="btnStop" type="button" className={this.state.isRecording ? "" : "hidden-btn"}><span className="fa fa-stop-circle"></span></button>
                                <button id="btnStart" type="button" className={this.state.isRecording ? "hidden-btn" : ""}><span className="fa fa-play-circle"></span></button>
                              </div>
                            </div>
                            :
                            this.state.videoshot ?
                              <>
                                <video id="vid2" controls key={this.state.videoshot}>
                                  <source src={this.state.videoshot} type="video/webm" />
                                </video>
                                <button type="button" className="btn-rmv-link" onClick={this.removeVideo}>remove video</button>
                                </>
                              :
                              this.state.isLoadingSmall ? <ChatLoader /> :
                                <div className="no-vid-holder">
                                  No video found<br />Click the Edit/Update Video button<br />to record your video
                            </div>
                          }
                          {browser==="safari"?<div className="footnote">*As Safari browser is currently not supporting MediaRecorder API by default, you can enable the feature from Develop &#62; Experimental Features &#62; MediaRecorder or use IE or Chrome browsers to record and view your video.</div>:null}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-xs-6">
                    <div className="submit-holder">
                      <button type="button" className="btn-general" onClick={this.goBack}>Go Back</button>
                    </div>
                  </div>
                  <div className="col-xs-6">
                    <div className="submit-holder text-right">
                      <button type="button" className="btn-general" onClick={this.updateSocialPage}>Save &amp; Continue</button>
                    </div>
                  </div>
                </div>
              </span>}
            {this.state.currPage === 5 &&
              <span>
                <h3 className="text-center bold">PAYMENT DETAILS</h3>
                <div className="auto-scroller">
                  <div className="form-like">
                    <div className="text-center in-payment">
                      {this.props.state.payment && this.props.state.payment.length ?
                        <div className="row">
                          <div className="col-sm-6">
                            <div className="table-responsive pay-details-holder">
                              <h4><strong>Last Order Details</strong></h4>
                              <table className="table table-bordered text-left">
                                <tbody>
                                  <tr>
                                    <td>Order Number</td>
                                    <td>{this.props.state.payment[this.props.state.payment.length - 1].order_number}</td>
                                  </tr>
                                  <tr>
                                    <td>Amount Paid</td>
                                    <td>$ {this.props.state.payment[this.props.state.payment.length - 1].order_total}</td>
                                  </tr>
                                  <tr>
                                    <td>Subscription Start Date</td>
                                    <td>{moment(this.props.state.payment[this.props.state.payment.length - 1].subscription.start_date).format('MMMM Do YYYY')}</td>
                                  </tr>
                                  <tr>
                                    <td>Current Status</td>
                                    <td>{moment(this.props.state.payment[this.props.state.payment.length - 1].subscription.end_date).isAfter(moment()) ? 'Active' : 'Expired'}</td>
                                  </tr>
                                  <tr>
                                    <td>Subscription End Date</td>
                                    <td>{moment(this.props.state.payment[this.props.state.payment.length - 1].subscription.end_date).format('MMMM Do YYYY')}</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                          <div className="col-sm-6">
                            <div className="text-left">
                              <h4 style={{ marginLeft: '25px' }}><strong>Subscribe</strong></h4>
                              {this.state.planDetails.map((i, ind) =>
                                <p key={ind}><Radio id={i.id} name="plan" content={`$ ${i.amount}, per ${i.plan_name}`} value={i.amount} selected={ind === 0} onChange={this.updateInputState} /></p>
                              )}
                              <div style={{ marginTop: '30px' }}><Checkout price={this.state.selectedPlanVal} id={this.state.selectedPlanId} /></div>
                            </div>
                          </div>
                        </div>
                        :
                        <div className="in-payment">
                          {this.state.planDetails.map((i, ind) =>
                            <Radio key={ind} id={i.id} name="plan" content={`$ ${i.amount}, per ${i.plan_name}`} value={i.amount} selected={ind === 0} onChange={this.updateInputState} />
                          )}
                          <div style={{ marginTop: '30px' }}><Checkout price={this.state.selectedPlanVal} id={this.state.selectedPlanId} /></div>
                        </div>
                      }
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-xs-6">
                    <div className="submit-holder">
                      <button type="button" className="btn-general" onClick={this.goBack}>Go Back</button>
                    </div>
                  </div>
                </div>
              </span>}
          </div>
        </div>
        <Modal
          open={this.state.unsaveAlert}
          onClose={() => this.setState({ unsaveAlert: false })}
          center>
          <div className="create-comm-modal">
            <h3 className="text-center">Warning!</h3>
            <h5>Unsaved changes will be lost.</h5>
            <div className="btn-alert-holder text-right"><button onClick={() => this.discardChanges.call()}>Continue</button><button onClick={() => this.setState({ unsaveAlert: false })}>Cancel</button></div>
          </div>
        </Modal>
      </div>
    )
  }
}

export default ProfileEdit;
