import React from 'react';
import '../Dashboard.css';
import { connect } from "react-redux";
import ToggleSwitch from '../../shared/ToggleSwitch';
import { postCall, getCall } from '../../../utils/api.config';
import { SEARCH_USER, SEARCH_IN_MAP, DUMMY_PIC, ZOOMED_USERS, RECENT_INDIVIDUAL_CORPORATE, POPULAR_INDIVIDUAL_CORPORATE, PROFILE_CLICK_CORPORATE, INDUSTRY, COUNTRIES } from '../../../utils/constants';
import { toast } from 'react-toastify';
import HeatMap from '../../shared/HeatMap';
import ProfilePage from '../profile-page/ProfilePage';
import { RecentSearches } from './RecentSearches';
import { FavouriteIndividuals } from "./FavouriteIndividuals";
import { TaggedIndividuals } from "./TaggedIndividuals";
import { PopularSearches } from './PopularSearches'
import './Searches.css'
import ChatLoader from '../../shared/ChatLoader';
import parse from 'html-react-parser';
import Radio from "../../shared/Radio";

const mapStateToProps = state => {
    return state
};

class ConnectedSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            heatMapView: true,
            resultPage: false,
            searchText: '',
            isLoadingInner: false,
            userList: [],
            skill: '-1',
            city:'',
            country: '-1',
            zipcode: '',
            region: '-1',
            experience: '-1',
            salaryRange: '-1',
            role: '-1',
            pageNo: 1,
            heatMapData: {
                positions: []
            },
            mapVariable: {
                zoom: 1,
                center: { lat: 33.193, lng: -117.241 }
            },
            profileMode: false,
            selectedUser: null,
            totalCount: 0,
            mapVisible: 0,
            totalPages: 1,
            continueSearch: true,
            recentInd: [],
            popularInd: [],
            function: '-1',
            functionOptions: [],
            roleOptions: [],
            skillOptions: [],
            isMobile: window.innerWidth < 720,
            displayFilter: false,
            isSmallMobile: window.innerWidth < 428,
            allCountries: [],
            name: false,
            favtagstatus: false
        }
    }
    searchNow = () => {
        if (this.state.searchText.length <= 2) {
            toast.error('Search string should be atleast 3 characters.')
        } else {
            this.setState({ isLoadingInner: true, userList: [], displayFilter: false, profileMode:false })
            let payload = {
                name: this.state.name,
                searchText: this.state.searchText,
                zipcode: this.state.zipcode.trim() === '' ? null : this.state.zipcode.trim(),
                function: this.state.function === '-1' ? null : this.state.function,
                role: this.state.role === '-1' ? null : this.state.role,
                skills: this.state.skill === '-1' ? null : this.state.skill,
                country: this.state.country === '-1' ? null : this.state.country,
                city: this.state.city === '' ? null : this.state.city,
                experience: this.state.experience === '-1' ? null : this.state.experience,
                pageNo: this.state.pageNo
            }
            if (this.state.heatMapView) {
                postCall(SEARCH_IN_MAP, payload, { sfn: this.successSearchInMap, efn: this.searchError })
            } else {
                postCall(SEARCH_USER, payload, { sfn: this.successSearch, efn: this.searchError })
            }
        }
    }
    successSearchInMap = (data) => {
        let newZoom=1
        switch(data.response.zoomTo){
            case 'country': newZoom = 4; break;
            case 'city': newZoom = 9; break;
            case 'pin': newZoom = 12; break;
            default : break;
        }
        this.setState({
            isLoadingInner: false,
            resultPage: true,
            heatMapData: {
                positions: data.response.userList
            },
            mapVariable: data.response.zoomTo?{
                zoom: newZoom,
                center: data.response.position
            }:this.state.mapVariable,
            totalCount: data.response.totalCount?data.response.totalCount:0,
            mapVisible: (data.response.invisible===0 || data.response.invisible)&&data.response.totalCount?data.response.totalCount - data.response.invisible:0
        })
    }
    successSearch = (data) => {
        this.setState({isLoadingInner: false})
        if (data.response.userList.length) {
            this.setState({
                userList: [...this.state.userList, ...data.response.userList],
                resultPage: true,
            })
        } else {
            this.setState({ continueSearch: false })
        }
    }
    searchError = () => {
        this.setState({ isLoadingInner: false }, ()=>toast.error("Server failed to respond. Please try again later."))
    }
    enterPressed = (e) => {
        if (e.which === 13 || e.keyCode === 13) {
            this.searchNow.call()
        }
    }
    updateParameters = (e) => {
        switch (e.target.name) {
            case "searchText": this.setState({ searchText: e.target.value }); break;
            case "zipcode": this.setState({ zipcode: e.target.value }); break;
            case "experience": this.setState({ experience: e.target.value }); break;
            case "role": this.setState({ role: e.target.value }); break;
            case "function": this.setState({ function: e.target.value }, () => this.setRoleOptions.call()); break;
            case "skill": this.setState({skill: e.target.value}); break;
            case "city": this.setState({city: e.target.value}); break;
            case "country": this.setState({country: e.target.value}); break;
            case "name": this.setState({name: JSON.parse(e.target.value)}); break;
            default: break
        }
    }
    setRoleOptions = () => {
        if (this.state.function !== '-1') {
            var roleOptionIndex = this.state.functionOptions.findIndex(i => i.name === this.state.function)
            var roleOptions = []
            for (let i = 0; i < this.state.functionOptions[roleOptionIndex].roles.length; i++) {
                roleOptions.push(this.state.functionOptions[roleOptionIndex].roles[i].name)
            }
            this.setState({ roleOptions: roleOptions })
        }
        else {
            this.setState({ roleOptions: [], role: '-1' })
        }
    }
    clearParameters = () => {
        this.setState({
            zipcode: '',
            experience: '-1',
            role: '-1',
            function: '-1',
            skill: '-1',
            country: '-1',
            city: '',
            roleOptions: [],
            pageNo: 1
        })
    }
    listSearch = () => {
        this.setState({ heatMapView: !this.state.heatMapView, isLoadingInner: true }, () => {
            if (!this.state.heatMapView && this.state.userList.length === 0) {
                let payload = {
                    name: this.state.name,
                    searchText: this.state.searchText,
                    zipcode: this.state.zipcode.trim() === '' ? null : this.state.zipcode.trim(),
                    function: this.state.function === '-1' ? null : this.state.function,
                    role: this.state.role === '-1' ? null : this.state.role,
                    skills: this.state.skill === '-1' ? null : this.state.skill,
                    country: this.state.country === '-1' ? null : this.state.country,
                    city: this.state.city === '' ? null : this.state.city,
                    experience: this.state.experience === '-1' ? null : this.state.experience,
                    pageNo: this.state.pageNo
                }
                postCall(SEARCH_USER, payload, { sfn: this.successSearch, efn: this.searchError })
            } else {
                this.setState({ isLoadingInner: false })
            }
        })
    }
    showProfile = (user) => {
        let payload = {
            userId: user.basicDetails.id
        }
        postCall(PROFILE_CLICK_CORPORATE, payload, { sfn: this.successProfile, efn: this.errorProfile })
    }
    successProfile=(data)=>{
        this.setState({
            profileMode: true,
            selectedUser: data.response.userProfile,
            heatMapView: false
        })
    }
    errorProfile = () => {
        toast.error("Server failed to respond. Please try again later.")
    }
    showProfileInd = (user) => {
        let payload = {
            userId: user.details.basicDetails.id
        }
        postCall(PROFILE_CLICK_CORPORATE, payload, { sfn: this.successProfile, efn: this.errorProfile })
    }
    getOtherUsers = () => {
        let objDiv = document.getElementById('searchListHolder');
        if ((objDiv.scrollHeight - objDiv.offsetHeight) - objDiv.scrollTop < 1) {
            this.setState({ pageNo: this.state.pageNo + 1, isLoadingInner: true }, () => {
                let payload = {
                    name: this.state.name,
                    searchText: this.state.searchText,
                    zipcode: this.state.zipcode.trim() === '' ? null : this.state.zipcode.trim(),
                    function: this.state.function === '-1' ? null : this.state.function,
                    role: this.state.role === '-1' ? null : this.state.role,
                    skills: this.state.skill === '-1' ? null : this.state.skill,
                    country: this.state.country === '-1' ? null : this.state.country,
                    city: this.state.city === '' ? null : this.state.city,
                    experience: this.state.experience === '-1' ? null : this.state.experience,
                    pageNo: this.state.pageNo
                }
                postCall(SEARCH_USER, payload, { sfn: this.successSearch, efn: this.searchError })
            })
        }
    }
    searchFromRecent = (data) => {
        this.setState({ searchText: data.searchtext, name: data.name }, () => this.searchNow.call())
        data.zipcode ? this.setState({ zipcode: data.zipcode }) : this.setState({ zipcode: '' })
        data.experience?this.setState({experience: data.experience}):this.setState({experience:'-1'})
        data.function ? this.setState({ function: data.function }, ()=>this.setRoleOptions.call()) : this.setState({ function: '-1' })
        data.role ? this.setState({ role: data.role }) : this.setState({ role: '-1' })
        data.skills ? this.setState({skill: data.skill}) : this.setState({skill: '-1'})
        data.city ? this.setState({city: data.city}) : this.setState({city: ''})
        data.country ? this.setState({country: data.country}) : this.setState({country: '-1'})
    }
    searchFromPopular = (data) => {
        this.setState({ searchText: data.searchtext }, () => this.searchNow.call())
    }    
    searchFromTaggedFavourite = (user) => {
        let payload = {
            userId: user.id
        }
        postCall(PROFILE_CLICK_CORPORATE, payload, { sfn: this.successProfileTgdFvt, efn: this.errorProfile })
    }
    
    successProfileTgdFvt=(data)=>{
        this.setState({
          favtagstatus: true,
          profileMode: true,
          selectedUser: data.response.userProfile,
          heatMapView: false,
          resultPage: true,
        });
    }
    componentDidMount() {
        getCall(RECENT_INDIVIDUAL_CORPORATE, {}, { sfn: this.successRecentInd, efn: this.errorInd })
        getCall(POPULAR_INDIVIDUAL_CORPORATE, {}, { sfn: this.successPopularInd, efn: this.errorInd })
        getCall(INDUSTRY, {}, { sfn: this.successIndustry, efn: this.errorIndustry })
        getCall(COUNTRIES, {}, { sfn: this.postCountriesFetch, efn: () => toast.error("Server failed to respond. Please try again later.") })
    }
    postCountriesFetch = (data) => {
        this.setState({allCountries: data.response.countryResult})
    }
    successRecentInd = (data) => {
        this.setState({ recentInd: data.response.recentsearch })
    }
    successPopularInd = (data) => {
        this.setState({ popularInd: data.response.popularsearch })
    }
    successIndustry = (data) => {
        this.setState({ functionOptions: data.response.functions, skillOptions: data.response.skills })
    }
    errorInd = () => {
        toast.error("Server failed to respond. Please try again later.")
    }
    errorIndustry = () => {
        toast.error("Server failed to respond. Please try again later.")
    }
    getZoomValue=(e)=>{
        this.setState({mapVariable:{...{...this.state.mapVariable,zoom:e}}})
    }
    zoomToPin=(e)=>{
        let lat = e.latLng.lat()
        let lng = e.latLng.lng()
        if(this.state.mapVariable.zoom>=12){
            this.setState({heatMapView:false,isLoadingInner: true, userList:[]})
            let zoomedLoc = this.state.heatMapData.positions.find(i=>i.lat===lat.toString() && i.lng===lng.toString())
            let payload = {userIds:zoomedLoc.users.map(i=>i.id)}
            postCall(ZOOMED_USERS, payload, { sfn: this.successSearch, efn: this.searchError })
        }else{
            this.setState({
                mapVariable: {
                    zoom: this.state.mapVariable.zoom<=12?this.state.mapVariable.zoom+2:this.state.mapVariable.zoom,
                    center: { lat: lat, lng: lng }
                }
            })
        }
    }
    backToResults=()=>{
        if (this.state.favtagstatus) {
            this.setState({
              favtagstatus: false,
              profileMode: false,
              heatMapView: true,
              resultPage: false,
            });
        } else {
            this.searchNow.call()
            this.setState({ profileMode: false })
        }        
    }
    render() {
        return (
            <div>
                {this.state.resultPage ?
                    <div>
                        {this.state.isMobile?
                        <div id="Search">
                            <div className="search-filter" style={{display: this.state.displayFilter?'':'none', width:'80%'}}>
                                <div className='search-holder'>
                                    <input type='text' name="searchText" className='search-box-dash' onKeyPress={this.enterPressed} placeholder='Search Keywords' value={this.state.searchText} onChange={this.updateParameters} />
                                    <span className='abs-search fa fa-search' onClick={this.searchNow}></span>
                                </div>
                                <div className="search-tags">
                                    <hr className="filter-partition" />
                                    <h6>Filter Tags <span style={{ float: 'right', cursor: 'pointer' }} onClick={this.clearParameters}>Clear All</span></h6>
                                    <ul className="tags-holder">
                                        {this.state.function !== '-1' && <li>{this.state.function}</li>}
                                        {this.state.role !== '-1' && <li>{this.state.role}</li>}
                                        {this.state.skill !== '-1' && <li>{this.state.skill}</li>}
                                        {this.state.city !== '' && <li>{this.state.city}</li>}
                                        {this.state.country !== '-1' && <li>{this.state.country}</li>}
                                        {this.state.zipcode.trim() !== '' && <li>{this.state.zipcode.trim()}</li>}
                                        {this.state.experience !== '-1' && <li>{this.state.experience} years</li>}
                                    </ul>
                                </div>
                                <div className='scroll-holder'>
                                    <div className="search-item">
                                        <hr className="filter-partition" />
                                        <h6>Filter By Function</h6>
                                        <select name="function" className='general-search-input' value={this.state.function} onChange={this.updateParameters}>
                                            <option value='-1'>Select Function</option>
                                            {this.state.functionOptions.map(i => <option value={i.name} key={i.name}>{i.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="search-item">
                                        <hr className="filter-partition" />
                                        <h6>Filter By Role</h6>
                                        <select name="role" className='general-search-input' value={this.state.role} onChange={this.updateParameters} disabled={this.state.function==='-1'?true:false}>
                                            <option value='-1'>Select Role</option>
                                            {this.state.roleOptions.map(i => <option value={i} key={i}>{i}</option>)}
                                        </select>
                                    </div>
                                    <div className="search-item">
                                        <hr className="filter-partition" />
                                        <h6>Filter By Skill</h6>
                                        <select name="skill" className='general-search-input' value={this.state.skill} onChange={this.updateParameters}>
                                            <option value='-1'>Select Skill</option>
                                            {this.state.skillOptions.map(i => <option value={i} key={i}>{i}</option>)}
                                        </select>
                                    </div>
                                    <div className="search-item">
                                        <hr className="filter-partition" />
                                        <h6>Filter By City Name</h6>
                                        <input className="general-search-input" name="city" value={this.state.city} onChange={this.updateParameters} />
                                    </div>
                                    <div className="search-item">
                                        <hr className="filter-partition" />
                                        <h6>Filter By Country Name</h6>
                                        <select name="country" className='general-search-input' value={this.state.country} onChange={this.updateParameters}>
                                            <option value='-1'>Select Country</option>
                                            {this.state.allCountries.map(i => <option value={i} key={i}>{i}</option>)}
                                        </select>
                                    </div>
                                    <div className="search-item">
                                        <hr className="filter-partition" />
                                        <h6>Filter By Zipcode</h6>
                                        <input className="general-search-input" name="zipcode" value={this.state.zipcode} onChange={this.updateParameters} />
                                    </div>
                                    <div className="search-item">
                                        <hr className="filter-partition" />
                                        <h6>Filter By Experience</h6>
                                        <select className='general-search-input' name="experience" value={this.state.experience} onChange={this.updateParameters} >
                                            <option value='-1'>Select Experience</option>
                                            <option value='0-1'>0-1</option>
                                            <option value='1-3'>1-3</option>
                                            <option value='3-6'>3-6</option>
                                            <option value='6-10'>6-10</option>
                                            <option value='10-20'>10-20</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="apply-holder">
                                    <button type="button" onClick={this.searchNow}>Apply</button>
                                </div>
                            </div>
                            <div className="search-results" style={{display: this.state.displayFilter?'none':'', width:'90%'}}>
                                <div className="row">
                                    <div className="col-lg-8">
                                    <button type="button" style={{border:"none", background:"none", float:"right", cursor:"pointer", display: this.state.profileMode?'none':''}} onClick={()=>this.setState({displayFilter:true})}><span className="fa fa-filter"></span> Filters</button>
                                        {this.state.profileMode ? <button onClick={this.backToResults} type="button" className="back-to-search"><span className="fa fa-long-arrow-left"></span> Results</button> :
                                            <div className="row">
                                                <div className="col-sm-4">
                                                    <h4><strong>{this.state.heatMapView ? `${this.state.mapVisible} located out of ${this.state.totalCount}` : `List of Individuals`}</strong></h4>
                                                </div>
                                                <div className="col-sm-8">
                                                    <div className="row">
                                                        <div className="col-sm-4">
                                                            <ToggleSwitch checked={this.state.heatMapView} title="Heat Map" onClicked={this.listSearch} />
                                                        </div>
                                                        <div className="col-sm-8">
                                                            {false &&
                                                                <div style={{ marginTop: '8px', textAlign: 'right' }}>
                                                                    <strong>Sort By </strong>
                                                                    <select className="sort-by">
                                                                        <option value='rel'>Relevance</option>
                                                                        <option value='exp'>Experience</option>
                                                                        <option value='age'>Age Group</option>
                                                                        <option value='new'>Newest Member</option>
                                                                        <option value='old'>Oldest Member</option>
                                                                    </select>
                                                                </div>
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>}
                                        {this.state.heatMapView ?
                                            <div className="row">
                                                <div className="col-sm-12">
                                                    <HeatMap
                                                        isMarkerShown
                                                        positions={this.state.heatMapData.positions}
                                                        mapVariable={this.state.mapVariable}
                                                        zoomToPin={this.zoomToPin}
                                                        getZoomValue={this.getZoomValue}
                                                    />
                                                    {this.state.isLoadingInner && <ChatLoader />}
                                                </div>
                                            </div>
                                            :
                                            this.state.profileMode ?
                                                <div>
                                                    <ProfilePage user={this.state.selectedUser} />
                                                </div>
                                                :
                                                <div className="row">
                                                    <div className="list-holder" id="searchListHolder" onScroll={this.state.continueSearch ? this.getOtherUsers : () => { }}>
                                                        {this.state.userList.map(i =>
                                                            <div className="col-md-6" key={i.basicDetails.id} onClick={this.showProfile.bind(this, i)}>
                                                                <div className="result-item">
                                                                    {i.basicDetails.available_hire && <div className="hire-avail">Available for Hire</div>}
                                                                    <br/>
                                                                    <ul>
                                                                        <li>
                                                                            <img src={i.basicDetails.profile_pic || DUMMY_PIC} alt="" />
                                                                        </li>
                                                                        <li className='desc-holder'>
                                                                            <span className='name'>{i.basicDetails.first_name} {i.basicDetails.last_name}</span><br />
                                                                            <span className='role'>{i.profile && i.profile.work_experience && i.profile.work_experience.designations && i.profile.work_experience.designations.length ? i.profile.work_experience.designations[0] : 'Not Available'}</span>
                                                                            <span className='taggs'>{i.taggedDetails&&i.taggedDetails.comments&&i.taggedDetails.comments.length?<span data-toggle="tooltip" title="Comments Available" className="fa fa-tag"></span>:null} {i.taggedDetails&&i.taggedDetails.favourite?<span data-toggle="tooltip" title="Favourite" className="fa fa-star"></span>:null} {i.taggedDetails&&i.taggedDetails.shortlisted?<span data-toggle="tooltip" title="Shortlisted" className="fa fa-check-circle-o"></span>:null}</span>
                                                                        </li>
                                                                    </ul>
                                                                    <div className='about'>{i.profile && i.profile.personal_details && i.profile.personal_details.aboutMe ? parse(i.profile.personal_details.aboutMe) : 'Description Not Available'}</div>
                                                                    <ul className="skills">
                                                                        {i.profile && i.profile.work_experience && i.profile.work_experience.skillsP && i.profile.work_experience.skillsP.length && typeof (i.profile.work_experience.skillsP[0]) !== 'string' ? i.profile.work_experience.skillsP[0].map(s => <li key={s}>{s}</li>) : <li>No Skills available</li>}
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {this.state.isLoadingInner && <ChatLoader />}
                                                    </div>
                                                </div>
                                        }
                                    </div>
                                    <div className="col-lg-4">
                                        <div className='recent-holder' style={{display: this.state.profileMode?'none':''}}>
                                            {this.state.recentInd.length > 0 ?
                                                <div>
                                                    <h4><strong>Recent Individuals</strong></h4>
                                                    <ul>
                                                        {this.state.recentInd.slice(0, 5).map(i =>
                                                            <li key={i.individualId} onClick={this.showProfileInd.bind(this, i)}>
                                                                <div className="recent-item">
                                                                    <ul>
                                                                        <li>
                                                                            <img src={i.details.basicDetails.profile_pic || DUMMY_PIC} alt="" />
                                                                        </li>
                                                                        <li className='desc-holder'>
                                                                            <span className='name'>{i.details.basicDetails.first_name} {i.details.basicDetails.last_name}</span><br />
                                                                            <span className='role'>{i.details.profile && i.details.profile.work_experience && i.details.profile.work_experience.role && i.details.profile.work_experience.role.length ? i.details.profile.work_experience.role[0] : 'No Role Available'}</span>
                                                                            <span className='link fa fa-angle-right'></span>
                                                                        </li>
                                                                    </ul>
                                                                </div>
                                                            </li>
                                                        )
                                                        }
                                                    </ul>
                                                </div>
                                                :
                                                <div>No Recent Profiles Found</div>
                                            }
                                            <hr />
                                            {this.state.popularInd.length > 0 ?
                                                <div>
                                                    <h4><strong>Popular Individuals</strong></h4>
                                                    <ul>
                                                        {this.state.popularInd.slice(0, 5).map(i =>
                                                            <li key={i.individualId} onClick={this.showProfileInd.bind(this, i)}>
                                                                <div className="recent-item">
                                                                    <ul>
                                                                        <li>
                                                                            <img src={i.details.basicDetails.profile_pic || DUMMY_PIC} alt="" />
                                                                        </li>
                                                                        <li className='desc-holder'>
                                                                            <span className='name'>{i.details.basicDetails.first_name} {i.details.basicDetails.last_name}</span><br />
                                                                            <span className='role'>{i.details.profile && i.details.profile.work_experience && i.details.profile.work_experience.role && i.details.profile.work_experience.role.length ? i.details.profile.work_experience.role[0] : 'No Role Available'}</span>
                                                                            <span className='link fa fa-angle-right'></span>
                                                                        </li>
                                                                    </ul>
                                                                </div>
                                                            </li>
                                                        )
                                                        }
                                                    </ul>
                                                </div>
                                                :
                                                <div>No Popular Profiles Found</div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        :
                        <div id="Search">
                            <div className="search-filter" style={{display: this.state.profileMode?'none':''}}>
                                <div className='search-holder'>
                                    <input type='text' name="searchText" className='search-box-dash' onKeyPress={this.enterPressed} placeholder='Search Keywords' value={this.state.searchText} onChange={this.updateParameters} />
                                    <span className='abs-search fa fa-search' onClick={this.searchNow}></span>
                                </div>
                                <div className="search-tags">
                                    <hr className="filter-partition" />
                                    <h6>Filter Tags <span style={{ float: 'right', cursor: 'pointer' }} onClick={this.clearParameters}>Clear All</span></h6>
                                    <ul className="tags-holder">
                                        {this.state.function !== '-1' && <li>{this.state.function}</li>}
                                        {this.state.role !== '-1' && <li>{this.state.role}</li>}
                                        {this.state.skill !== '-1' && <li>{this.state.skill}</li>}
                                        {this.state.city !== '' && <li>{this.state.city}</li>}
                                        {this.state.country !== '-1' && <li>{this.state.country}</li>}
                                        {this.state.zipcode.trim() !== '' && <li>{this.state.zipcode.trim()}</li>}
                                        {this.state.experience !== '-1' && <li>{this.state.experience} years</li>}
                                    </ul>
                                </div>
                                <div className='scroll-holder'>
                                    <div className="search-item">
                                        <hr className="filter-partition" />
                                        <h6>Filter By Function</h6>
                                        <select name="function" className='general-search-input' value={this.state.function} onChange={this.updateParameters}>
                                            <option value='-1'>Select Function</option>
                                            {this.state.functionOptions.map(i => <option value={i.name} key={i.name}>{i.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="search-item">
                                        <hr className="filter-partition" />
                                        <h6>Filter By Role</h6>
                                        <select name="role" className='general-search-input' value={this.state.role} onChange={this.updateParameters} disabled={this.state.function==='-1'?true:false}>
                                            <option value='-1'>Select Role</option>
                                            {this.state.roleOptions.map(i => <option value={i} key={i}>{i}</option>)}
                                        </select>
                                    </div>
                                    <div className="search-item">
                                        <hr className="filter-partition" />
                                        <h6>Filter By Skill</h6>
                                        <select name="skill" className='general-search-input' value={this.state.skill} onChange={this.updateParameters}>
                                            <option value='-1'>Select Skill</option>
                                            {this.state.skillOptions.map(i => <option value={i} key={i}>{i}</option>)}
                                        </select>
                                    </div>
                                    <div className="search-item">
                                        <hr className="filter-partition" />
                                        <h6>Filter By City Name</h6>
                                        <input className="general-search-input" name="city" value={this.state.city} onChange={this.updateParameters} />
                                    </div>
                                    <div className="search-item">
                                        <hr className="filter-partition" />
                                        <h6>Filter By Country Name</h6>
                                        <select name="country" className='general-search-input' value={this.state.country} onChange={this.updateParameters}>
                                            <option value='-1'>Select Country</option>
                                            {this.state.allCountries.map(i => <option value={i} key={i}>{i}</option>)}
                                        </select>
                                    </div>
                                    <div className="search-item">
                                        <hr className="filter-partition" />
                                        <h6>Filter By Zipcode</h6>
                                        <input className="general-search-input" name="zipcode" value={this.state.zipcode} onChange={this.updateParameters} />
                                    </div>
                                    <div className="search-item">
                                        <hr className="filter-partition" />
                                        <h6>Filter By Experience</h6>
                                        <select className='general-search-input' name="experience" value={this.state.experience} onChange={this.updateParameters} >
                                            <option value='-1'>Select Experience</option>
                                            <option value='0-1'>0-1</option>
                                            <option value='1-3'>1-3</option>
                                            <option value='3-6'>3-6</option>
                                            <option value='6-10'>6-10</option>
                                            <option value='10-20'>10-20</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="apply-holder">
                                    <button type="button" onClick={this.searchNow}>Apply</button>
                                </div>
                            </div>
                            <div className="search-results" style={{width: this.state.profileMode?'98%':'calc(100% - 300px)', padding: this.state.profileMode?0:'15px'}}>
                                <div className="row">
                                    <div className="col-lg-8" style={{width: this.state.profileMode?'100%':''}}>
                                        {this.state.profileMode ? <button onClick={this.backToResults} type="button" className="back-to-search"><span className="fa fa-long-arrow-left"></span> Results</button> :
                                            <div className="row">
                                                <div className="col-sm-4">
                                                    <h4><strong>{this.state.heatMapView ? `${this.state.mapVisible} located out of ${this.state.totalCount}` : `List of Individuals`}</strong></h4>
                                                </div>
                                                <div className="col-sm-8">
                                                    <div className="row">
                                                        <div className="col-sm-4">
                                                            <ToggleSwitch checked={this.state.heatMapView} title="Heat Map" onClicked={this.listSearch} />
                                                        </div>
                                                        <div className="col-sm-8">
                                                            {false &&
                                                                <div style={{ marginTop: '8px', textAlign: 'right' }}>
                                                                    <strong>Sort By </strong>
                                                                    <select className="sort-by">
                                                                        <option value='rel'>Relevance</option>
                                                                        <option value='exp'>Experience</option>
                                                                        <option value='age'>Age Group</option>
                                                                        <option value='new'>Newest Member</option>
                                                                        <option value='old'>Oldest Member</option>
                                                                    </select>
                                                                </div>
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>}
                                        {this.state.heatMapView ?
                                            <div className="row">
                                                <div className="col-sm-12">
                                                    <HeatMap
                                                        isMarkerShown
                                                        positions={this.state.heatMapData.positions}
                                                        mapVariable={this.state.mapVariable}
                                                        zoomToPin={this.zoomToPin}
                                                        getZoomValue={this.getZoomValue}
                                                    />
                                                    {this.state.isLoadingInner && <ChatLoader />}
                                                </div>
                                            </div>
                                            :
                                            this.state.profileMode ?
                                                <div>
                                                    <ProfilePage user={this.state.selectedUser} />
                                                </div>
                                                :
                                                <div className="row">
                                                    <div className="list-holder" id="searchListHolder" onScroll={this.state.continueSearch ? this.getOtherUsers : () => { }}>
                                                        {this.state.userList.map(i =>
                                                            <div className="col-md-6" key={i.basicDetails.id} onClick={this.showProfile.bind(this, i)}>
                                                                <div className="result-item">
                                                                    {i.basicDetails.available_hire && <div className="hire-avail">Available for Hire</div>}
                                                                    <br/>
                                                                    <ul>
                                                                        <li>
                                                                            <img src={i.basicDetails.profile_pic || DUMMY_PIC} alt="" />
                                                                        </li>
                                                                        <li className='desc-holder'>
                                                                            <span className='name'>{i.basicDetails.first_name} {i.basicDetails.last_name}</span><br />
                                                                            <span className='role'>{i.profile && i.profile.work_experience && i.profile.work_experience.designations && i.profile.work_experience.designations.length ? i.profile.work_experience.designations[0] : 'Not Available'}</span>
                                                                            <span className='taggs'>{i.taggedDetails&&i.taggedDetails.comments&&i.taggedDetails.comments.length?<span data-toggle="tooltip" title="Comments Available" className="fa fa-tag"></span>:null} {i.taggedDetails&&i.taggedDetails.favourite?<span data-toggle="tooltip" title="Favourite" className="fa fa-star"></span>:null} {i.taggedDetails&&i.taggedDetails.shortlisted?<span data-toggle="tooltip" title="Shortlisted" className="fa fa-check-circle-o"></span>:null}</span>
                                                                        </li>
                                                                    </ul>
                                                                    <div className='about'>{i.profile && i.profile.personal_details && i.profile.personal_details.aboutMe ? parse(i.profile.personal_details.aboutMe) : 'Description Not Available'}</div>
                                                                    <ul className="skills">
                                                                        {i.profile && i.profile.work_experience && i.profile.work_experience.skillsP && i.profile.work_experience.skillsP.length && typeof (i.profile.work_experience.skillsP[0]) !== 'string' ? i.profile.work_experience.skillsP[0].map(s => <li key={s}>{s}</li>) : <li>No Skills available</li>}
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {this.state.isLoadingInner && <ChatLoader />}
                                                    </div>
                                                </div>
                                        }
                                    </div>
                                    <div className="col-lg-4">
                                        <div className='recent-holder' style={{display: this.state.profileMode?'none':''}}>
                                            {this.state.recentInd.length > 0 ?
                                                <div>
                                                    <h4><strong>Recent Individuals</strong></h4>
                                                    <ul>
                                                        {this.state.recentInd.slice(0, 5).map(i =>
                                                            <li key={i.individualId} onClick={this.showProfileInd.bind(this, i)}>
                                                                <div className="recent-item">
                                                                    <ul>
                                                                        <li>
                                                                            <img src={i.details.basicDetails.profile_pic || DUMMY_PIC} alt="" />
                                                                        </li>
                                                                        <li className='desc-holder'>
                                                                            <span className='name'>{i.details.basicDetails.first_name} {i.details.basicDetails.last_name}</span><br />
                                                                            <span className='role'>{i.details.profile && i.details.profile.work_experience && i.details.profile.work_experience.role && i.details.profile.work_experience.role.length ? i.details.profile.work_experience.role[0] : 'No Role Available'}</span>
                                                                            <span className='link fa fa-angle-right'></span>
                                                                        </li>
                                                                    </ul>
                                                                </div>
                                                            </li>)
                                                        }
                                                    </ul>
                                                </div>
                                                :
                                                <div>No Recent Profiles Found</div>
                                            }
                                            <hr />
                                            {this.state.popularInd.length > 0 ?
                                                <div>
                                                    <h4><strong>Popular Individuals</strong></h4>
                                                    <ul>
                                                        {this.state.popularInd.slice(0, 5).map(i =>
                                                            <li key={i.individualId} onClick={this.showProfileInd.bind(this, i)}>
                                                                <div className="recent-item">
                                                                    <ul>
                                                                        <li>
                                                                            <img src={i.details.basicDetails.profile_pic || DUMMY_PIC} alt="" />
                                                                        </li>
                                                                        <li className='desc-holder'>
                                                                            <span className='name'>{i.details.basicDetails.first_name} {i.details.basicDetails.last_name}</span><br />
                                                                            <span className='role'>{i.details.profile && i.details.profile.work_experience && i.details.profile.work_experience.role && i.details.profile.work_experience.role.length ? i.details.profile.work_experience.role[0] : 'No Role Available'}</span>
                                                                            <span className='link fa fa-angle-right'></span>
                                                                        </li>
                                                                    </ul>
                                                                </div>
                                                            </li>
                                                        )
                                                        }
                                                    </ul>
                                                </div>
                                                :
                                                <div>No Popular Profiles Found</div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        }
                    </div>
                    :
                    <div className="row">
                        <div className="col-md-9">
                            <div className="main-search-holder">
                                <div className="search-heading">
                                    {/* <h2>Search for Individuals</h2> */}
                                    <div className="form-unit">
                                        {/* <span>Search </span> */}
                                        <Radio name="account" content="Individual" selected={this.props.categoryType === 'individual' ? true : ''} value="individual" onChange={(e) => this.props.itemSelected(e.target.value)} />
                                        <Radio name="account" content="Corporate" selected={this.props.categoryType === 'corporate' ? true : ''} value="corporate" onChange={(e) => this.props.itemSelected(e.target.value)} />
                                    </div>
                                </div>
                                {this.state.isSmallMobile?<span></span>:<span className="fa fa-search"></span>}
                                <input className="search-main" onKeyPress={this.enterPressed} value={this.state.searchText} placeholder={this.props.categoryType === 'individual'?"Search by Individual Name":"Search by Corporate Name"} onChange={(e) => this.setState({ searchText: e.target.value })} />
                                {/* <select name="name" className='general-filter-name' value={this.state.name} onChange={this.updateParameters}>
                                    <option value={false}>Anything</option>
                                    <option value={true}>Name</option>
                                </select> */}
                                <button type="button" className="btn-in-search" onClick={this.searchNow}>{this.state.isSmallMobile?<span className="fa fa-search"></span>:"Search"}</button>
                                {this.state.isLoadingInner && <div style={{ position: 'absolute', bottom: '-75px', width: '100%' }}><ChatLoader /></div>}
                            </div>
                            <RecentSearches itemClicked={this.searchFromRecent} />
                        </div>
                        <div className="col-md-3">
                            <PopularSearches itemClicked={this.searchFromPopular} />
                            <hr className="my-5" />
                            <FavouriteIndividuals itemClicked={this.searchFromTaggedFavourite} />
                            <hr className="my-5" />
                            <TaggedIndividuals itemClicked={this.searchFromTaggedFavourite} />
                        </div>
                    </div>
                }
            </div>
        )
    }

}

const Search = connect(mapStateToProps)(ConnectedSearch);
export default Search;