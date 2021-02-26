import React from 'react';
import '../Dashboard.css';
import { connect } from "react-redux";
import ToggleSwitch from '../../shared/ToggleSwitch';
import { postCall, getCall } from '../../../utils/api.config';
import { DUMMY_LOGO, SEARCH_C_IN_MAP, ZOOMED_USERS, SEARCH_CORP, INDUSTRY, RECENT_CORPORATE_INDIVIDUAL, POPULAR_CORPORATE_INDIVIDUAL, PROFILE_CLICK_INDIVIDUAL, COUNTRIES } from '../../../utils/constants';
import { toast } from 'react-toastify';
import HeatMap from '../../shared/HeatMap';
import ProfilePage from '../profile-page-c/ProfilePage';
import ChatLoader from '../../shared/ChatLoader';
import { RecentSearches } from './RecentSearches';
import { PopularSearches } from './PopularSearches'
import './Searches.css'
import parse from 'html-react-parser'
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
            country: '-1',
            city: '',
            industry: '-1',
            industries: [],
            type: '-1',
            employeeCount: '-1',
            zipcode: '',
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
            recentCorp: [],
            popularCorp: [],
            isMobile: window.innerWidth < 767,
            displayFilter: false,
            isSmallMobile: window.innerWidth < 428,
            allCountries:[],
            name: false
        }
    }
    componentDidMount() {
        getCall(INDUSTRY, {}, { sfn: this.postIndustriesFetch })
        getCall(RECENT_CORPORATE_INDIVIDUAL, {}, { sfn: this.successRecentCorp, efn: this.errorCorp })
        getCall(POPULAR_CORPORATE_INDIVIDUAL, {}, { sfn: this.successPopularCorp, efn: this.errorCorp })
        getCall(COUNTRIES, {}, { sfn: this.postCountriesFetch, efn: () => toast.error("Server failed to respond. Please try again later.") })
    }
    postCountriesFetch = (data) => {
        this.setState({allCountries: data.response.countryResult})
    }
    postIndustriesFetch = (data) => {
        this.setState({ industries: data.response.industries })
    }
    errorCorp = () => {
        toast.error("Server failed to respond. Please try again later.")
    }
    searchNow = () => {
        if (this.state.searchText.length <= 2) {
            toast.error('Search string should be atleast 3 characters.')
        } else {
            this.setState({ isLoadingInner: true, userList: [], displayFilter: false, profileMode:false })
            let payload = {
                name: this.state.name,
                searchText: this.state.searchText,
                country: this.state.country === '-1' ? null : this.state.country,
                city: this.state.city === '' ? null : this.state.city,
                industry: this.state.industry === '-1' ? null : this.state.industry,
                type: this.state.type === '-1' ? null : this.state.type,
                employeeCount: this.state.employeeCount === '-1' ? null : this.state.employeeCount,
                zipcode: this.state.zipcode.trim() === '' ? null : this.state.zipcode.trim(),
                pageNo: this.state.pageNo
            }
            if (this.state.heatMapView) {
                postCall(SEARCH_C_IN_MAP, payload, { sfn: this.successSearchInMap, efn: this.searchError })
            } else {
                postCall(SEARCH_CORP, payload, { sfn: this.successSearch, efn: this.searchError })
            }
        }
    }
    successSearchInMap = (data) => {
        let newZoom=1
        switch(data.response.zoomTo){
            case 'country': newZoom = 4; break;
            case 'city': newZoom = 9; break;
            case 'pin': newZoom = 12; break;
            default: break;
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
            mapVisible: data.response.totalCount?data.response.totalCount - data.response.invisible:0
        })
    }
    successSearch = (data) => {
        this.setState({isLoadingInner: false})
        if (data.response.userList.length) {
            this.setState({
                userList: [...this.state.userList, ...data.response.userList],
                resultPage: true
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
            case "country": this.setState({ country: e.target.value }); break;
            case "city": this.setState({ city: e.target.value }); break;
            case "industry": this.setState({ industry: e.target.value }); break;
            case "type": this.setState({ type: e.target.value }); break;
            case "employeeCount": this.setState({ employeeCount: e.target.value }); break;
            case "zipcode": this.setState({ zipcode: e.target.value}); break;
            case "name": this.setState({name: JSON.parse(e.target.value)}); break;
            default: break
        }
    }
    clearParameters = () => {
        this.setState({
            city: '',
            country: '-1',
            zipcode: '',
            industry: '-1',
            type: '-1',
            employeeCount: '-1',
            pageNo: 1
        })
    }
    listSearch = () => {
        this.setState({ heatMapView: !this.state.heatMapView, isLoadingInner: true }, () => {
            if (!this.state.heatMapView && this.state.userList.length === 0) {
                let payload = {
                    name: this.state.name,
                    searchText: this.state.searchText,
                    country: this.state.country === '-1' ? null : this.state.country,
                    city: this.state.city === '' ? null : this.state.city,
                    industry: this.state.industry === '-1' ? null : this.state.industry,
                    type: this.state.type === '-1' ? null : this.state.type,
                    employeeCount: this.state.employeeCount === '-1' ? null : this.state.employeeCount,
                    zipcode: this.state.zipcode.trim() === '' ? null : this.state.zipcode.trim(),
                    pageNo: this.state.pageNo
                }
                postCall(SEARCH_CORP, payload, { sfn: this.successSearch, efn: this.searchError })
            } else {
                this.setState({ isLoadingInner: false })
            }
        })
    }
    showProfile = (user) => {
        let payload = {
            userId: user.id
        }
        postCall(PROFILE_CLICK_INDIVIDUAL, payload, { sfn: this.successProfile, efn: this.errorProfile })
    }
    successProfile=(data)=>{
        this.setState({
            profileMode: true,
            selectedUser: data.response.corpProfile,
            heatMapView: false
        })
    }
    errorProfile = () => {
        toast.error("Server failed to respond. Please try again later.")
    }
    showProfileInd = (user) => {
        let payload = {
            userId: user.details.id
        }
        postCall(PROFILE_CLICK_INDIVIDUAL, payload, { sfn: this.successProfile, efn: this.errorProfile })
    }
    getOtherUsers = () => {
        let objDiv = document.getElementById('searchListHolder');
        if ((objDiv.scrollHeight - objDiv.offsetHeight) - objDiv.scrollTop < 1) {
            this.setState({ pageNo: this.state.pageNo + 1, isLoadingInner: true }, () => {
                let payload = {
                    name:this.state.name,
                    searchText: this.state.searchText,
                    country: this.state.country === '-1' ? null : this.state.country,
                    city: this.state.city === '' ? null : this.state.city,
                    industry: this.state.industry === '-1' ? null : this.state.industry,
                    type: this.state.type === '-1' ? null : this.state.type,
                    employeeCount: this.state.employeeCount === '-1' ? null : this.state.employeeCount,
                    zipcode: this.state.zipcode.trim() === '' ? null : this.state.zipcode.trim(),
                    pageNo: this.state.pageNo
                }
                postCall(SEARCH_CORP, payload, { sfn: this.successSearch, efn: this.searchError })
            })
        }
    }
    searchFromRecent = (data) => {
        this.setState({ searchText: data.searchtext, name: data.name }, () => this.searchNow.call())
        data.country ? this.setState({ country: data.country }) : this.setState({ country: '-1' })
        data.city ? this.setState({ city: data.city }) : this.setState({ city: '' })
        data.type ? this.setState({ type: data.type }) : this.setState({ type: '-1' })
        data.emp_count ? this.setState({ employeeCount: data.emp_count }) : this.setState({ employeeCount: '-1' })
        data.zipcode ? this.setState({ zipcode: data.zipcode}) : this.setState({zipcode: ''})
    }
    searchFromPopular = (data) => {
        this.setState({ searchText: data.searchtext }, () => this.searchNow.call())
    }
    successRecentCorp = (data) => {
        this.setState({ recentCorp: data.response.recentsearch })
    }
    successPopularCorp = (data) => {
        this.setState({ popularCorp: data.response.popularsearch })
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
        this.searchNow.call()
        this.setState({ profileMode: false })
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
                                        {this.state.industry !== '-1' && <li>{this.state.industry}</li>}
                                        {this.state.type !== '-1' && <li>{this.state.type}</li>}
                                        {this.state.city !== '' && <li>{this.state.city}</li>}
                                        {this.state.country !== '-1' && <li>{this.state.country}</li>}
                                        {this.state.zipcode.trim() !== '' && <li>{this.state.zipcode.trim()}</li>}
                                        {this.state.employeeCount !== '-1' && <li>{this.state.employeeCount}</li>}
                                    </ul>
                                </div>
                                <div className='scroll-holder'>
                                    <div className="search-item">
                                        <hr className="filter-partition" />
                                        <h6>Filter By Industry</h6>
                                        <select name="industry" className='general-search-input' value={this.state.industry} onChange={this.updateParameters}>
                                            <option value='-1'>Select Industry</option>
                                            {this.state.industries.map(i => (<option key={i} value={i}>{i}</option>))}
                                        </select>
                                    </div>
                                    <div className="search-item">
                                        <hr className="filter-partition" />
                                        <h6>Filter By Organisation Type</h6>
                                        <select name="type" className='general-search-input' value={this.state.type} onChange={this.updateParameters}>
                                            <option value='-1'>Select Organisation Type</option>
                                            <option value='Private'>Private</option>
                                            <option value='Public'>Public</option>
                                            <option value='Startup'>Start Up</option>
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
                                        <h6>Filter By Employee Count</h6>
                                        <select className='general-search-input' name="employeeCount" value={this.state.employeeCount} onChange={this.updateParameters} >
                                            <option value='-1'>Select Employee Range</option>
                                            <option value='0-100'>0 - 100</option>
                                            <option value='101-500'>101 - 500</option>
                                            <option value='501-1000'>501 - 1000</option>
                                            <option value='1001-5000'>1001 - 5000</option>
                                            <option value='above5000'>more than 5000</option>
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
                                                    <h4><strong>{this.state.heatMapView ? `${this.state.mapVisible} located out of ${this.state.totalCount}` : `List of Corporates`}</strong></h4>
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
                                                                        <option value='old'>Oldest Organization</option>
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
                                                            <div className="col-md-6" key={i.id} onClick={this.showProfile.bind(this, i)}>
                                                                <div className="result-item">
                                                                    {i.currently_hire && <div className="hire-avail">Hiring</div>}
                                                                    <ul>
                                                                        <li>
                                                                            <img src={i.logo || DUMMY_LOGO} alt="" />
                                                                        </li>
                                                                        <li className='desc-holder'>
                                                                            <span className='name'>{i.name}</span><br />
                                                                            <span className='role'>{i.type ? i.type + " Organization" : 'Type not found'}</span>
                                                                            <span className='industries-tags'>{i.website}</span>
                                                                        </li>
                                                                    </ul>
                                                                    <p className='about-org'>{parse(i.culture)}</p>
                                                                    <p className='industries-tags'>{i.industry}</p>
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
                                            {this.state.recentCorp.length > 0 ?
                                                <div>
                                                    <h4><strong>Recent Corporates</strong></h4>
                                                    <ul>
                                                        {this.state.recentCorp.slice(0, 5).map(i =>
                                                            <li key={i.corpId} onClick={this.showProfileInd.bind(this, i)}>
                                                                <div className="recent-item">
                                                                    <ul>
                                                                        <li>
                                                                            <img src={i.details.logo || DUMMY_LOGO} alt="" />
                                                                        </li>
                                                                        <li className='desc-holder'>
                                                                            <span className='name'>{i.details.name}</span><br />
                                                                            <span className='role'>{i.details.industry || 'No Industry Available'}</span>
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
                                            {this.state.popularCorp.length > 0 ?
                                                <div>
                                                    <h4><strong>Popular Corporates</strong></h4>
                                                    <ul>
                                                        {this.state.popularCorp.slice(0, 5).map(i =>
                                                            <li key={i.corpId} onClick={this.showProfileInd.bind(this, i)}>
                                                                <div className="recent-item">
                                                                    <ul>
                                                                        <li>
                                                                            <img src={i.details.logo || DUMMY_LOGO} alt="" />
                                                                        </li>
                                                                        <li className='desc-holder'>
                                                                            <span className='name'>{i.details.name}</span><br />
                                                                            <span className='role'>{i.details.industry || 'No Industry Avaliable'}</span>
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
                                        {this.state.industry !== '-1' && <li>{this.state.industry}</li>}
                                        {this.state.type !== '-1' && <li>{this.state.type}</li>}
                                        {this.state.city !== '' && <li>{this.state.city}</li>}
                                        {this.state.country !== '-1' && <li>{this.state.country}</li>}
                                        {this.state.zipcode.trim() !== '' && <li>{this.state.zipcode.trim()}</li>}
                                        {this.state.employeeCount !== '-1' && <li>{this.state.employeeCount}</li>}
                                    </ul>
                                </div>
                                <div className='scroll-holder'>
                                    <div className="search-item">
                                        <hr className="filter-partition" />
                                        <h6>Filter By Industry</h6>
                                        <select name="industry" className='general-search-input' value={this.state.industry} onChange={this.updateParameters}>
                                            <option value='-1'>Select Industry</option>
                                            {this.state.industries.map(i => (<option key={i} value={i}>{i}</option>))}
                                        </select>
                                    </div>
                                    <div className="search-item">
                                        <hr className="filter-partition" />
                                        <h6>Filter By Organisation Type</h6>
                                        <select name="type" className='general-search-input' value={this.state.type} onChange={this.updateParameters}>
                                            <option value='-1'>Select Organisation Type</option>
                                            <option value='Private'>Private</option>
                                            <option value='Public'>Public</option>
                                            <option value='Startup'>Start Up</option>
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
                                        <h6>Filter By Employee Count</h6>
                                        <select className='general-search-input' name="employeeCount" value={this.state.employeeCount} onChange={this.updateParameters} >
                                            <option value='-1'>Select Employee Range</option>
                                            <option value='0-100'>0 - 100</option>
                                            <option value='101-500'>101 - 500</option>
                                            <option value='501-1000'>501 - 1000</option>
                                            <option value='1001-5000'>1001 - 5000</option>
                                            <option value='above5000'>more than 5000</option>
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
                                                    <h4><strong>{this.state.heatMapView ? `${this.state.mapVisible} located out of ${this.state.totalCount}` : `List of Corporates`}</strong></h4>
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
                                                                        <option value='old'>Oldest Organization</option>
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
                                                            <div className="col-md-6" key={i.id} onClick={this.showProfile.bind(this, i)}>
                                                                <div className="result-item">
                                                                    {i.currently_hire && <div className="hire-avail">Hiring</div>}
                                                                    <ul>
                                                                        <li>
                                                                            <img src={i.logo || DUMMY_LOGO} alt="" />
                                                                        </li>
                                                                        <li className='desc-holder'>
                                                                            <span className='name'>{i.name}</span><br />
                                                                            <span className='role'>{i.type ? i.type + " Organization" : 'Type not found'}</span>
                                                                            <span className='industries-tags'>{i.website}</span>
                                                                        </li>
                                                                    </ul>
                                                                    <p className='about-org'>{parse(i.culture)}</p>
                                                                    <p className='industries-tags'>{i.industry}</p>
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
                                            {this.state.recentCorp.length > 0 ?
                                                <div>
                                                    <h4><strong>Recent Corporates</strong></h4>
                                                    <ul>
                                                        {this.state.recentCorp.slice(0, 5).map(i =>
                                                            <li key={i.corpId} onClick={this.showProfileInd.bind(this, i)}>
                                                                <div className="recent-item">
                                                                    <ul>
                                                                        <li>
                                                                            <img src={i.details.logo || DUMMY_LOGO} alt="" />
                                                                        </li>
                                                                        <li className='desc-holder'>
                                                                            <span className='name'>{i.details.name}</span><br />
                                                                            <span className='role'>{i.details.industry || 'No Industry Available'}</span>
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
                                            {this.state.popularCorp.length > 0 ?
                                                <div>
                                                    <h4><strong>Popular Corporates</strong></h4>
                                                    <ul>
                                                        {this.state.popularCorp.slice(0, 5).map(i =>
                                                            <li key={i.corpId} onClick={this.showProfileInd.bind(this, i)}>
                                                                <div className="recent-item">
                                                                    <ul>
                                                                        <li>
                                                                            <img src={i.details.logo || DUMMY_LOGO} alt="" />
                                                                        </li>
                                                                        <li className='desc-holder'>
                                                                            <span className='name'>{i.details.name}</span><br />
                                                                            <span className='role'>{i.details.industry || 'No Industry Avaliable'}</span>
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
                                    <option value={true}>Company</option>
                                </select> */}
                                <button type="button" className="btn-in-search" onClick={this.searchNow}>{this.state.isSmallMobile?<span className="fa fa-search"></span>:"Search"}</button>
                                {this.state.isLoadingInner && <div style={{ position: 'absolute', bottom: '-75px', width: '100%' }}><ChatLoader /></div>}
                            </div>
                            <RecentSearches itemClicked={this.searchFromRecent} />
                        </div>
                        <div className="col-md-3">
                            <PopularSearches itemClicked={this.searchFromPopular} />
                        </div>
                    </div>
                }
            </div>
        )
    }

}

const Search = connect(mapStateToProps)(ConnectedSearch);
export default Search;