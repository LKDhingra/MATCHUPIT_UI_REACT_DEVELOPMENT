import React from 'react';
import './ProfileEditCorp.css';
import store from '../../../redux/store';
import { postCall, putCall, getCall } from '../../../utils/api.config';
import { FILE_UPLOAD, PROFILE, INDUSTRY, PLAN_DETAIL, COUNTRIES, DUMMY_LOGO } from '../../../utils/constants';
import { showFlatForm, setCorporateInfo, setSocialLinks, setOtherAddresses, setCorporateVideo, addAddressRow, deleteAddressRow } from '../../../redux/actions';
import moment from 'moment';
import ReactPlayer from 'react-player';
import { toast } from 'react-toastify';
import { isInputEmpty, numOnly, emailInFormat, alphaOnly, isImageOk, isVideoOk, isPDFOk, isZipcodeOk } from '../../../utils/validators';
import DatepickerComponent from '../../shared/DatepickerComponent';
import ChatLoader from '../../shared/ChatLoader';
import MitAccordion from '../../shared/MitAccordion';
import AddressBlock from './AddressBlock';
import Radio from '../../shared/Radio';
import Checkout from '../../shared/StripeCheckout';
import ReactQuill from 'react-quill';
import { dialcodes } from '../../../utils/dialcodes';

const stocks = require('stock-ticker-symbol');
const axios = require("axios");

class ProfileEditCorp extends React.Component {
  constructor(props) {
    super(props);
    const { basicInfo, payment, profile } = this.props.state
    const { name, industry, ticker, type, email, employee_count, revenue, revenue_currency, dial_code, telephone, future_road_map, current_road_map, zipcode, country_name, address_line, state, city, establishment_date, logo, video_intro, culture, website, recovery_email } = basicInfo
    const { social_links } = profile
    this.state = {
      inputUnsaved:false,
      ticker: ticker || '',
      currPage: 1,
      isLoading: false,
      company_type: { value: type || '-1', err: '' },
      registeredEmail: email,
      name: { value: name || '', err: '' },
      industry: { value: industry || '-1', err: '' },
      employee_count: { value: employee_count || '', err: '' },
      revenue: { value: revenue || '', err: '' },
      recovery_email: { value: recovery_email || '', err: '' },
      country_name: { value: country_name || '', err: '' },
      zipcode: { value: zipcode || '', err: '' },
      address_line: { value: address_line || '', err: '' },
      state: { value: state || '', err: '' },
      city: { value: city || '', err: '' },
      revenue_currency: { value: revenue_currency || '', err: '' },
      telephone: { value: telephone || '', err: '' },
      current_road_map: { value: current_road_map || '', err: '' },
      future_road_map: { value: future_road_map || '', err: '' },
      establishment_date: { value: establishment_date || moment().format('MM/DD/YYYY'), err: '' },
      logo: { value: logo || '', err: '' },
      logoErr: '',
      vidErr: '',
      video_intro: video_intro,
      culture: { value: culture || '', err: '' },
      website: { value: website || '', err: '' },
      validPayload: true,
      isRenewing: false,
      receivedOn: payment && payment.length ? moment(payment[payment.length - 1].time_stamp).format('MMMM Do YYYY, h:mm:ss a') : null,
      expiresOn: payment && payment.length ? moment(payment[payment.length - 1].time_stamp).add(30, 'days').format('MMMM Do YYYY, h:mm:ss a') : null,
      industries: [],
      facebook: social_links.facebook || '',
      twitter: social_links.twitter || '',
      linkedin: social_links.linkedin || '',
      instagram: social_links.instagram || '',
      pinterest: social_links.pinterest || '',
      github: social_links.github || '',
      dial_code: { value: dial_code || '-1', err: '' },
      listedCompanies: [],
      allCountries: [],
      coverPicPath: ""
    }
  }

  componentDidMount() {
    getCall(INDUSTRY, {}, { sfn: this.postIndustriesFetch, efn: () => toast.error("Server failed to respond. Please try again later.") })
    getCall(COUNTRIES, {}, { sfn: this.postCountriessFetch, efn: () => toast.error("Server failed to respond. Please try again later.") })
    getCall(PLAN_DETAIL, {}, { sfn: this.setPlanDetails, efn: () => toast.error("Server failed to respond. Please try again later.") })
    
    if ("media" in this.props.state.profile === true && "coverPic" in this.props.state.profile.media == true) {
      this.setState({
        coverPicPath: this.props.state.profile.media.coverPic,
      });
    } else {
      this.setState({
        coverPicPath: "",
      });
    }
  }
  setPlanDetails = (data) => {
    this.setState({
      planDetails: data.plans.filter(i => i.plan_for === 'c')
    }, () => this.setState({
      selectedPlanVal: this.state.planDetails[0].amount,
      selectedPlanId: this.state.planDetails[0].id
    }))
  }
  postCountriessFetch = (data) => {
    this.setState({ allCountries: data.response.countryResult })
  }
  postIndustriesFetch = (data) => {
    this.setState({ industries: data.response.industries })
  }
  inputUnsaved=()=>{
    this.setState({ inputUnsaved:true })
  }
  updateInputState = (e) => {
    this.setState({ validPayload: true })
    this.inputUnsaved.call()
    switch (e.target.name) {
      case "name": this.setState({ name: { value: e.target.value, err: '' } }, () => this.fetchDetails.call()); break
      case "telephone": this.setState({ telephone: { value: e.target.value, err: '' } }); break
      case "country_name": this.setState({ country_name: { value: e.target.value, err: '' } }); break
      case "zipcode": this.setState({ zipcode: { value: e.target.value, err: '' } }); break
      case "address_line": this.setState({ address_line: { value: e.target.value, err: '' } }); break
      case "dial_code": this.setState({ dial_code: { value: e.target.value, err: '' }, telephone: { ...this.state.telephone, err: '' } }, ()=>document.getElementsByName('telephone')[0].focus()); break
      case "state": this.setState({ state: { value: e.target.value, err: '' } }); break
      case "city": this.setState({ city: { value: e.target.value, err: '' } }); break
      case "revenue_currency": this.setState({ revenue_currency: { value: e.target.value, err: '' } }); break
      case "establishment_date": this.setState({ establishment_date: { value: e.target.value, err: '' } }); break
      case "website": this.setState({ website: { value: e.target.value, err: '' } }); break
      case "recovery_email": this.setState({ recovery_email: { value: e.target.value, err: '' } }); break
      case "revenue": this.setState({ revenue: { value: e.target.value, err: '' } }); break
      case "employee_count": this.setState({ employee_count: { value: e.target.value, err: '' } }); break
      case "industry": this.setState({ industry: { value: e.target.value, err: '' } }); break
      case "company_type": this.setState({ company_type: { value: e.target.value, err: '' } }); break
      case "facebook-handle": this.setState({ facebook: e.target.value }); break
      case "twitter-handle": this.setState({ twitter: e.target.value }); break
      case "linkedin-handle": this.setState({ linkedin: e.target.value }); break
      case "instagram-handle": this.setState({ instagram: e.target.value }); break
      case "pinterest-handle": this.setState({ pinterest: e.target.value }); break
      case "github-handle": this.setState({ github: e.target.value }); break
      case "current_road_map": this.setState({ current_road_map: { value: e.target.value, err: '' } }); break
      case "future_road_map": this.setState({ future_road_map: { value: e.target.value, err: '' } }); break
      default: break
    }
  }

  readCoverPageURL = (input) => {
    if (input.target.files && input.target.files[0]) {
      const formData = new FormData();
      formData.append("file", input.target.files[0]);
      if (input.target.name === "coverPic") {
        if (isImageOk(input.target.files[0].name, input.target.files[0].size)) {
          postCall(FILE_UPLOAD, formData, { sfn: this.postCoverPhotoUpload, efn: () => toast.error("Server failed to respond. Please try again later.") }, 'image')
        } else {
          toast.error("Should be an image & less than 200KB");
        }
      }
    }
  }

  postCoverPhotoUpload = (data) => {
    this.setState({
      coverPicPath: data.fileUrl,
    });
  }

  readURL = (input) => {
    if (input.target.files && input.target.files[0]) {
      this.setState({
        logoErr: '',
        vidErr: '',
        logo: { value: '', err: '' },
        validPayload: true,
        isLoading: true
      })
      const formData = new FormData()
      formData.append('file', input.target.files[0])
      if (input.target.name === 'logo') {
        if (isImageOk(input.target.files[0].name, input.target.files[0].size)) {
          postCall(FILE_UPLOAD, formData, { sfn: this.postLogoUpload, efn: () => toast.error("Server failed to respond. Please try again later.") }, 'image')
        } else {
          this.setState({
            logoErr: 'Should be an image & less than 200KB',
            validPayload: false,
            isLoading: false
          })
        }
      } else if (input.target.name === 'video_intro') {
        if(input.target.files[0].type.substring(0, 5)==='video'){
          if (isVideoOk(input.target.files[0].name, input.target.files[0].size)) {
            this.setState({ isLoading: true })
            postCall(FILE_UPLOAD, formData, { sfn: this.postVideoUpload, efn: () => toast.error("Server failed to respond. Please try again later.") }, 'videopdf')
          } else {
            this.setState({
              vidErr: 'Should be a video  & less than 10MB',
              validPayload: false,
              isLoading: false
            })
          }
        }
        else{
          if(isPDFOk(input.target.files[0].name, input.target.files[0].size)) {
            this.setState({ isLoading: true })
            postCall(FILE_UPLOAD, formData, { sfn: this.postVideoUpload, efn: () => toast.error("Server failed to respond. Please try again later.") }, 'videopdf')
          } else {
            this.setState({
              vidErr: 'Should be a pdf  & less than 5MB',
              validPayload: false,
              isLoading: false
            })
          }
        }
        var reader = new FileReader();
        reader.readAsDataURL(input.target.files[0]);
      }
    }
  }

  postLogoUpload = (data) => {
    this.setState({
      logo: { value: data.fileUrl, err: '' },
      isLoading: false
    });
  }
  postVideoUpload = (data) => {
    this.inputUnsaved.call()
    this.setState({
      isLoading: false,
      video_intro: data.fileUrl
    })
  }

  closeForm = () => {
    if (!this.state.name) {
      toast.error('Company Name is required.')
    } else {
      store.dispatch(showFlatForm(false))
      window.location.reload()
    }
  }

  updateCorpInfo = () => {
    this.setState({ establishment_date: { value: document.getElementsByName("establishment_date")[0].value.toString(), err: "" } })
    let payload = {
      basic_details: {
        name: this.state.name.value.replace(/,/g, ''),
        industry: this.state.industry.value,
        employee_count: this.state.employee_count.value,
        revenue: this.state.revenue.value,
        recovery_email: this.state.recovery_email.value,
        country_name: this.state.country_name.value,
        zipcode: this.state.zipcode.value,
        address_line: this.state.address_line.value,
        state: this.state.state.value,
        city: this.state.city.value,
        revenue_currency: this.state.revenue_currency.value,
        dial_code: this.state.dial_code.value,
        telephone: this.state.telephone.value,
        establishment_date: document.getElementsByName('establishment_date')[0].value.toString(),
        logo: this.state.logo.value,
        culture: this.state.culture.value,
        website: this.state.website.value.replace('https://', '').replace('http://', ''),
        type: this.state.company_type.value,
        current_road_map: this.state.current_road_map.value,
        future_road_map: this.state.future_road_map.value,
        ticker: this.state.ticker
      },
      address_details: {
        addressO: Array.from(document.getElementsByName("addressO")).map(c => c.value),
        cityO: Array.from(document.getElementsByName("cityO")).map(c => c.value),
        stateO: Array.from(document.getElementsByName("stateO")).map(c => c.value),
        countryO: Array.from(document.getElementsByName("countryO")).map(c => c.value),
        zipcodeO: Array.from(document.getElementsByName("zipcodeO")).map(c => c.value),
      }
    }

    // start updating cover photo
    if (this.state.coverPicPath != "") {
      if ("media" in this.props.state.profile === true) {
        let media = this.props.state.profile.media;
        if ("coverPic" in this.props.state.profile.media === true) {
          media.coverPic = this.state.coverPicPath;
          payload["media"] = media;
        } else {
          media["coverPic"] = this.state.coverPicPath;
          payload["media"] = media;
        }
      } else {
        payload["media"] = {
          coverPic: this.state.coverPicPath,
        };
      }
    } else {
      if ("media" in this.props.state.profile === true && "coverPic" in this.props.state.profile.media === true) {
        let media = this.props.state.profile.media;
        delete media.coverPic;
        payload["media"] = media;
      }
    }
    // end updating cover photo

    if (isInputEmpty(payload.basic_details.logo)) {
      toast.error("Logo cannot be empty")
    }
    if (isInputEmpty(payload.basic_details.name)) {
      this.setState({ name: { value: this.state.name.value, err: 'Company Name cannot be empty' }, validPayload: false })
      document.getElementsByName('name')[0].focus()
    }
    if (payload.basic_details.culture==='<p><br></p>') {
      this.setState({ culture: { value: this.state.culture.value, err: '' }, validPayload: false })
      document.getElementsByClassName('ql-editor')[0].style.boxShadow = '0px 0px 3px #C40223'
      document.getElementsByClassName('ql-editor')[0].focus()
      toast.error('About company cannot be empty')
    }
    if (payload.basic_details.industry === '-1') {
      this.setState({ industry: { value: this.state.industry.value, err: 'Industry Type cannot be empty' }, validPayload: false })
      document.getElementsByName('industry')[0].focus()
    }
    if (isInputEmpty(payload.basic_details.telephone)) {
      this.setState({ telephone: { value: this.state.telephone.value, err: 'Telephone cannot be empty' }, validPayload: false })
      document.getElementsByName('telephone')[0].focus()
    }
    if (!numOnly(payload.basic_details.telephone)) {
      this.setState({ telephone: { value: this.state.telephone.value, err: 'Only numbers allowed here' }, validPayload: false })
      document.getElementsByName('telephone')[0].focus()
    }
    if (payload.basic_details.dial_code==='-1'){
      this.setState({ telephone: { value: this.state.telephone.value, err: 'Country Code cannot be empty' }, validPayload: false })
      document.getElementsByName('telephone')[0].focus()
    }
    if (payload.basic_details.recovery_email.length && !emailInFormat(payload.basic_details.recovery_email)) {
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
    if (isInputEmpty(payload.basic_details.country_name)) {
      this.setState({ country_name: { value: this.state.country_name.value, err: 'Country name cannot be empty' }, validPayload: false })
      document.getElementsByName('country_name')[0].focus()
    }
    if (!alphaOnly(payload.basic_details.country_name)) {
      this.setState({ country_name: { value: this.state.country_name.value, err: 'Only alphabets allowed here' }, validPayload: false })
      document.getElementsByName('country_name')[0].focus()
    }
    if (isInputEmpty(payload.basic_details.state)) {
      this.setState({ state: { value: this.state.state.value, err: 'State name cannot be empty' }, validPayload: false })
      document.getElementsByName('state')[0].focus()
    }
    if (!alphaOnly(payload.basic_details.state)) {
      this.setState({ state: { value: this.state.state.value, err: 'Only alphabets allowed here' }, validPayload: false })
      document.getElementsByName('state')[0].focus()
    }
    if (isInputEmpty(payload.basic_details.city)) {
      this.setState({ city: { value: this.state.city.value, err: 'City name cannot be empty' }, validPayload: false })
      document.getElementsByName('city')[0].focus()
    }
    if (isInputEmpty(payload.basic_details.employee_count)) {
      this.setState({ employee_count: { value: this.state.employee_count.value, err: 'Employee count cannot be empty' }, validPayload: false })
      document.getElementsByName('employee_count')[0].focus()
    }
    if (!numOnly(payload.basic_details.employee_count)) {
      this.setState({ employee_count: { value: this.state.employee_count.value, err: 'Only Numbers allowed Employee count' }, validPayload: false })
      document.getElementsByName('employee_count')[0].focus()
    }
    if (!numOnly(payload.basic_details.revenue)) {
      this.setState({ revenue: { value: this.state.revenue.value, err: 'Only number allowed here' }, validPayload: false })
      document.getElementsByName('revenue')[0].focus()
    }
    if (isInputEmpty(payload.basic_details.logo)) {
      this.setState({ logo: { value: this.state.logo.value, err: 'Logo cannot be empty' }, validPayload: false })
      document.getElementsByName('logo')[0].focus()
    }
    if (isInputEmpty(payload.basic_details.website)) {
      this.setState({ website: { value: this.state.website.value, err: 'Website cannot be empty' }, validPayload: false })
      document.getElementsByName('website')[0].focus()
    }
    if (payload.basic_details.type === '-1') {
      this.setState({ company_type: { value: this.state.company_type.value, err: 'Company Type cannot be empty' }, validPayload: false })
      document.getElementsByName('company_type')[0].focus()
    }
    if (payload.address_details.countryO.length) {
      for (let i = 0; i < payload.address_details.countryO.length; i++) {
        if (payload.address_details.cityO[i].trim() === '') {
          Array.from(document.getElementsByName("cityO"))[i].classList.add("error-input")
          toast.error('One or more City Name is empty.')
          document.getElementsByName('cityO')[i].focus()
          return false
        } else if (payload.address_details.stateO[i].trim() === '') {
          Array.from(document.getElementsByName("stateO"))[i].classList.add("error-input")
          toast.error('One or more State Name is empty.')
          document.getElementsByName('stateO')[i].focus()
          return false
        } else if (payload.address_details.countryO[i].trim() === '') {
          Array.from(document.getElementsByName("countryO"))[i].classList.add("error-input")
          toast.error('One or more Country Name is empty.')
          document.getElementsByName('countryO')[i].focus()
          return false
        } else if (payload.address_details.zipcodeO[i].trim() === '') {
          Array.from(document.getElementsByName("zipcodeO"))[i].classList.add("error-input")
          toast.error('One or more Zipcode is empty.')
          document.getElementsByName('zipcodeO')[i].focus()
          return false
        } else if (payload.address_details.zipcodeO[i].trim().length < 5) {
          Array.from(document.getElementsByName("zipcodeO"))[i].classList.add("error-input")
          toast.error('One or more Zipcode has invalid length.')
          document.getElementsByName('zipcodeO')[i].focus()
          return false
        }
      }
    }
    setTimeout(() => {
      if (this.state.validPayload) {
        store.dispatch(setCorporateInfo(payload.basic_details))
        store.dispatch(setOtherAddresses(payload.address_details))
        putCall(PROFILE, payload, { sfn: this.postUpdateCorporate, efn: this.errUpdateCorporate })
      }
    }, 100)
  }

  postUpdateCorporate = () => {
    this.setState({ currPage: this.state.currPage + 1, inputUnsaved:false })
    toast.success('Your company details information successfully saved')
  }
  errUpdateCorporate = () => {
    toast.error('Something went wrong. Could not update profile.')
  }

  goBack = () => {
    if(this.state.inputUnsaved){
      window.alert('Your unsaved data will get lost. Please save it first.')
    }else{
      this.setState({ currPage: this.state.currPage - 1 })
    }
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
      },
      basic_details: {
        video_intro: this.state.video_intro
      }
    }
    store.dispatch(setSocialLinks(payload.social_links))
    store.dispatch(setCorporateVideo(payload.basic_details.video_intro))
    putCall(PROFILE, payload, { sfn: this.postUpdateSocialLinks, efn: this.errUpdateSocialLinks })
  }
  errUpdateSocialLinks = () => {
    toast.error("Server failed to respond. Please try again later.")
  }
  postUpdateSocialLinks = (data) => {
    this.setState({ currPage: this.state.currPage + 1, inputUnsaved:false })
    toast.success('Your Social links information successfully saved')
  }
  updatePaymentPage = () => {
    if (this.props.state.basicInfo.payment_status) {
      store.dispatch(showFlatForm(false))
    } else {
      toast.error('Subscriprion is required to proceed.')
    }
  }
  errUpdateBIpage = () => { }
  addAnotherAddress = () => {
    this.inputUnsaved.call()
    store.dispatch(addAddressRow({ countryO: '', stateO: '', cityO: '', zipcode: '', addressO: '' }))
  }
  deleteAddress = (index) => {
    this.inputUnsaved.call()
    store.dispatch(deleteAddressRow(index))
  }
  fetchDetails = () => {
    let name = this.state.name.value
    if (name.length >= 4) {
      let ticker = stocks.search(name)
      if (ticker.length) {
        this.setState({ listedCompanies: ticker }, () => {
          if (ticker.length === 1)
            this.setState({ ticker: ticker[0].ticker })
        })
      } else {
        this.setState({ ticker: '' })
      }
    }
  }
  findYahooDetails = () => {
    this.inputUnsaved.call()
    let ticker = this.state.ticker
    axios({
      method: "GET",
      url: "https://yahoo-finance15.p.rapidapi.com/api/yahoo/qu/quote/" + ticker + "/asset-profile",
      headers: {
        "content-type": "application/octet-stream",
        "x-rapidapi-host": "yahoo-finance15.p.rapidapi.com",
        "x-rapidapi-key": "b83ce79a26mshacecbbc51423dcap1bc1d8jsn9f1747709316",
        "useQueryString": true
      }
    })
      .then((response) => {
        var data = response.data.assetProfile
        this.setState({
          address_line: { value: data.address1 ? data.address1 : '', err: '' },
          city: { value: data.city ? data.city : '', err: '' },
          country_name: { value: data.country ? this.state.allCountries.find(i => i === data.country) || '-1' : '-1', err: '' },
          employee_count: { value: data.fullTimeEmployees ? data.fullTimeEmployees : '', err: '' },
          industry: { value: data.industry ? this.state.industries.find(i => i === data.industry) || '-1' : '-1', err: '' },
          telephone: { value: data.phone ? data.phone.replace(/-|\s/g, "") : '', err: '' },
          state: { value: data.state ? data.state : '', err: '' },
          website: { value: data.website ? data.website : '', err: '' },
          zipcode: { value: data.zip ? data.zip : '', err: '' },
          culture: { value: data.longBusinessSummary ? data.longBusinessSummary : '', err: '' }
        })
      })
      .catch((error) => {
        console.log(error)
      })
  }
  handleAboutChange=(value)=>{
    this.setState({ culture: {value:value, err:'' }, validPayload: true})
  }
  removeVideo=()=>{
    this.setState({video_intro:null})
  }
  onCoverButtonClick = () => {
    document.getElementById("coverPic").click();
  }
  render() {
    const { profile } = this.props.state
    let { address_details } = profile
    let addLength = address_details.countryO.length
    let addressBlockChildren = []
    for (let i = 0; i < addLength; i++) {
      addressBlockChildren.push(
        <AddressBlock
          ifDeleted={this.deleteAddress.bind(this, i)}
          isEdited={this.inputUnsaved.bind(this,i)}
          key={`add_${i}`}
          countryO={address_details.countryO && address_details.countryO.length ? address_details.countryO[i] : ''}
          stateO={address_details.stateO && address_details.stateO.length ? address_details.stateO[i] : ''}
          cityO={address_details.cityO && address_details.cityO.length ? address_details.cityO[i] : ''}
          addressO={address_details.addressO && address_details.addressO.length ? address_details.addressO[i] : ''}
          zipcodeO={address_details.zipcodeO && address_details.zipcodeO.length ? address_details.zipcodeO[i] : ''}
        />)
    }
    return (
      <div id="ProfileEdit">
        <span className="close-pro-edit" onClick={this.closeForm}>&times;</span>
        <div id="progress-holder" className="container text-center">
          <ul>
            <li className={this.state.currPage === 1 ? "prog-icon-curr" : "prog-icon"} onClick={() => this.setState({ currPage: 1 })}><span className="fa fa-user"></span></li>
            <li className="prog-line"></li>
            <li className={this.state.currPage === 2 ? "prog-icon-curr" : "prog-icon"} onClick={() => this.setState({ currPage: 2 })}><span className="fa fa-video-camera"></span></li>
            <li className="prog-line"></li>
            <li className={this.state.currPage === 3 ? "prog-icon-curr" : "prog-icon"} onClick={() => this.setState({ currPage: 3 })}><span className="fa fa-credit-card"></span></li>
          </ul>
        </div>
        <div id="ProfileEdit-holder" className="container">
          {this.state.currPage === 1 &&
            <div className="profile-edit-box">
              <h3 className="text-center bold">COMPANY INFORMATION</h3>
              <div className="auto-scroller">
                <form>
                  <div className="row pb-5 mb-3">
                    <div className="col-sm-12">
                      <div className="profile-pic-sec">
                        <img src={this.state.coverPicPath != "" ? this.state.coverPicPath : require("../../../images/banners/cover-photo.png")} alt="" className="coverphoto" />
                        <div class="btn-center-cover">
                          <input className="invisible" type="file" id="coverPic" name="coverPic" onChange={this.readCoverPageURL} accept="image/*" />
                          <button type="button" className="btn btn-light" onClick={this.onCoverButtonClick}><i className="fa fa-pencil-square-o"></i> Change Cover Photo</button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row pt-5 mt-5">                    
                    <div className="col-sm-12 text-right">
                      <a href="javascript:void(0)" className="text-danger" onClick={() => this.setState({ coverPicPath: "" })}>Remove Cover Photo</a>
                    </div>
                    <div className="col-sm-4">
                      <span className="input-label">Company Logo</span><span className='mandate'> *</span>
                      <div className="profile-picture-holder">
                        <img src={this.state.logo.value || DUMMY_LOGO} alt="" className="fit-layout" />
                        {this.state.isLoading && <ChatLoader />}
                        <div className="overlay-edit">
                          <label htmlFor="logo">
                            <span className="fa fa-pencil-square-o" onClick={this.imageEditorTogg}></span>
                          </label>
                          <input id="logo" className="invisible" type="file" name="logo" onChange={this.readURL} accept="image/*" />
                        </div>
                        {this.state.logoErr !== '' && <div className="error-info">{this.state.logoErr}</div>}
                      </div>
                    </div>
                    <div className="col-sm-4">
                      <div>
                        <span className="input-label"> Company Name</span><span className='mandate'> *</span>
                        <input list="companyName" className={this.state.name.err === '' ? "general-input" : "general-input error-input"} type="text" value={this.state.name.value} name="name" onChange={this.updateInputState} />
                        <datalist id="companyName">
                          {this.state.listedCompanies.map(i => <option key={i.ticker} value={i.name} />)}
                        </datalist>
                        {this.state.name.err !== '' && <div className="error-info">{this.state.name.err}</div>}
                      </div>
                      <div>
                        <span className="input-label"> Company Ticker</span><span className='mandate'> *</span>
                        <div style={{ position: 'relative' }}>
                          <input className="general-input" disabled type="text" value={this.state.ticker || ''} />
                          <button type="button" className="btn-lookup" onClick={this.findYahooDetails}>Lookup</button>
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-4">
                      <div className="row">
                        <div className="col-sm-12">
                          <span className="input-label">Recovery Email</span>
                          <input className={this.state.recovery_email.err === '' ? "general-input" : "general-input error-input"} type="email" value={this.state.recovery_email.value} name="recovery_email" onChange={this.updateInputState} />
                          {this.state.recovery_email.err !== '' && <div className="error-info">{this.state.recovery_email.err}</div>}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-12">
                          <span className="input-label"> Phone No</span><span className='mandate'> *</span>
                          <select className="inner-input" value={this.state.dial_code.value} name="dial_code" onChange={this.updateInputState}>
                            <option value='-1'>+</option>
                            {dialcodes.map(i => <option key={i} value={i}>{i}</option>)}
                          </select>
                          <input style={{ paddingLeft: '90px' }} maxLength={10} className={this.state.telephone.err === '' ? "general-input" : "general-input error-input"} type="text" value={this.state.telephone.value} name="telephone" onChange={this.updateInputState} />
                          {this.state.telephone.err !== '' && <div className="error-info">{this.state.telephone.err}</div>}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-12">
                      <span className="input-label">About Company</span>
                      <ReactQuill onChange={this.handleAboutChange} value={this.state.culture.value} />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-4">
                      <span className="input-label">Industry</span><span className='mandate'> *</span>
                      <select name="industry" className="general-input" value={this.state.industry.value} onChange={this.updateInputState}>
                        <option value="-1">Select Industry</option>
                        {this.state.industries.map(i => (<option key={i} value={i}>{i}</option>))}
                      </select>
                      {this.state.industry.err !== '' && <div className="error-info">{this.state.industry.err}</div>}
                    </div>
                    <div className="col-sm-4">
                      <span className="input-label">HQ Address</span>
                      <input className={this.state.address_line.err === '' ? "general-input" : "general-input error-input"} type="text" value={this.state.address_line.value} name="address_line" onChange={this.updateInputState} />
                      {this.state.address_line.err !== '' && <div className="error-info">{this.state.address_line.err}</div>}
                    </div>
                    <div className="col-sm-4">
                      <span className="input-label">City/Town</span><span className='mandate'> *</span>
                      <input className={this.state.city.err === '' ? "general-input" : "general-input error-input"} value={this.state.city.value} name="city" onChange={this.updateInputState} />
                      {this.state.city.err !== '' && <div className="error-info">{this.state.city.err}</div>}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-4">
                      <span className="input-label">State/Province</span><span className='mandate'> *</span>
                      <input className={this.state.state.err === '' ? "general-input" : "general-input error-input"} value={this.state.state.value} name="state" onChange={this.updateInputState} />
                      {this.state.state.err !== '' && <div className="error-info">{this.state.state.err}</div>}
                    </div>
                    <div className="col-sm-4">
                      <span className="input-label">Country</span><span className='mandate'> *</span>
                      <select className={this.state.country_name.err === '' ? "general-input" : "general-input error-input"} value={this.state.country_name.value} name="country_name" onChange={this.updateInputState}>
                        <option value='-1'>Select Country</option>
                        {this.state.allCountries.map(i => <option key={i} value={i}>{i}</option>)}
                      </select>
                      {this.state.country_name.err !== '' && <div className="error-info">{this.state.country_name.err}</div>}
                    </div>
                    <div className="col-sm-4">
                      <span className="input-label">Zip Code</span><span className='mandate'> *</span>
                      <input maxLength={11} className={this.state.zipcode.err === '' ? "general-input" : "general-input error-input"} type="text" value={this.state.zipcode.value} name="zipcode" onChange={this.updateInputState} />
                      {this.state.zipcode.err !== '' && <div className="error-info">{this.state.zipcode.err}</div>}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-12"><br />
                      <MitAccordion blocks={addressBlockChildren} allowZeroExpanded={true} type="address" />
                      <button type="button" className="btn-sub-form" onClick={this.addAnotherAddress}><span className="fa fa-plus"></span> Other Locations</button>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-4">
                      <span className="input-label">Employee Count</span><span className='mandate'> *</span>
                      <input className={this.state.employee_count.err === '' ? "general-input" : "general-input error-input"} type="text" value={this.state.employee_count.value} name="employee_count" onChange={this.updateInputState} />
                      {this.state.employee_count.err !== '' && <div className="error-info">{this.state.employee_count.err}</div>}
                    </div>
                    <div className="col-sm-4">
                      <span className="input-label">Establishment Date</span><span className='mandate'> *</span>
                      <DatepickerComponent date={this.state.establishment_date.value} max={new Date()} name="establishment_date" />
                    </div>
                    <div className="col-sm-4">
                      <span className="input-label">Website</span><span className='mandate'> *</span>
                      <input type="text" className={this.state.website.err === '' ? "general-input" : "general-input error-input"} name="website" value={this.state.website.value} onChange={this.updateInputState} placeholder="www.company.domain" />
                      {this.state.website.err !== '' && <div className="error-info">{this.state.website.err}</div>}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-4">
                      <span className="input-label">Company Type</span><span className='mandate'> *</span>
                      <select className={this.state.company_type.err === '' ? "general-input" : "general-input error-input"} type="text" value={this.state.company_type.value} name="company_type" onChange={this.updateInputState}>
                        <option value='-1'>Select Company Type</option>
                        <option value='Private'>Private Organization</option>
                        <option value='Public'>Public Organization</option>
                        <option value='Startup'>Startup Organization</option>
                      </select>
                      {this.state.company_type.err !== '' && <div className="error-info">{this.state.company_type.err}</div>}
                    </div>
                    <div className="col-sm-4">
                      <span className="input-label">Total Revenue</span>
                      <input disabled={this.state.company_type.value !== 'Public'} className={this.state.revenue.err === '' ? "general-input" : "general-input error-input"} type="text" value={this.state.company_type.value !== 'Public' ? () => this.setState({ revenue: { value: '-1', err: '' } }) : this.state.revenue.value} name="revenue" onChange={this.updateInputState} />
                      {this.state.revenue.err !== '' && <div className="error-info">{this.state.revenue.err}</div>}
                    </div>
                    <div className="col-sm-4">
                      <span className="input-label">Revenue Currency</span>
                      <select disabled={this.state.company_type.value !== 'Public'} className="general-input" type="text" value={this.state.company_type.value !== 'Public' ? '-1' : this.state.revenue_currency.value} name="revenue_currency" onChange={this.updateInputState}>
                        <option value='-1'>Select Currency Type</option>
                        <option value='USD'>$ USD</option>
                        <option value='INR'>&#8377; INR</option>
                        <option value='EURO'>&#8364; EURO</option>
                      </select>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-6">
                      <span className="input-label">Tools / Technologies / Methods Used</span>
                      <textarea placeholder="Upto 1000 Characters" maxLength={1000} rows="3" className={this.state.current_road_map.err === '' ? "general-input" : "general-input error-input"} value={this.state.current_road_map.value} name="current_road_map" onChange={this.updateInputState} />
                      {this.state.current_road_map.err !== '' && <div className="error-info">{this.state.current_road_map.err}</div>}
                    </div>
                    <div className="col-sm-6">
                      <span className="input-label">Latest News</span>
                      <textarea placeholder="Upto 1000 Characters" maxLength={1000} rows="3" className={this.state.future_road_map.err === '' ? "general-input" : "general-input error-input"} value={this.state.future_road_map.value} name="future_road_map" onChange={this.updateInputState} />
                      {this.state.future_road_map.err !== '' && <div className="error-info">{this.state.future_road_map.err}</div>}
                    </div>
                  </div>
                </form>
              </div>
              <div className="submit-holder text-right">
                <button type="button" className="btn-general" disabled={!this.state.validPayload} onClick={this.updateCorpInfo}>Save &amp; Continue</button>
              </div>
            </div>}
          {this.state.currPage === 2 &&
            <div className="profile-edit-box">
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
                      <div className="row">
                        <div className="col-sm-12">
                          <span className="input-label">Upload Intro Video / PDF</span>
                          <input type="file" className="general-input" name="video_intro" onChange={this.readURL} accept="video/*, .pdf" />
                          {this.state.vidErr !== '' && <div className="error-info vidImg">{this.state.vidErr}</div>}
                          <div className="row" style={{ marginTop: '15px' }}>
                            <div className="col-xs-12 text-center">
                              {this.state.video_intro ? this.state.isLoading ? <ChatLoader /> : this.state.video_intro.substring(this.state.video_intro.length-3).toLowerCase()==='pdf'?<embed height={375} scrolling={0} className="fit-layout" src={this.state.video_intro}></embed>:<ReactPlayer url={this.state.video_intro} width='100%' height={260} controls /> : <img src={require('../../../images/banners/no_video.png')} alt="" className="fit-layout" />}
                              <button type="button" className="btn-rmv-link" onClick={this.removeVideo}>remove intro</button>
                            </div>
                          </div>
                        </div>
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
                    <button type="button" className="btn-general" disabled={!this.state.validPayload} onClick={this.updateSocialPage}>Save &amp; Continue</button>
                  </div>
                </div>
              </div>
            </div>
          }
          {this.state.currPage === 3 &&
            <div className="profile-edit-box">
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
                      <div className="text-left in-payment">
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
                <div className="col-xs-6">
                  <div className="submit-holder text-right">
                    {/* <button type="button" className="btn-general" onClick={this.updatePaymentPage}>SUBMIT</button> */}
                  </div>
                </div>
              </div>
            </div>}
        </div>
      </div>
    )
  }
}

export default ProfileEditCorp;
