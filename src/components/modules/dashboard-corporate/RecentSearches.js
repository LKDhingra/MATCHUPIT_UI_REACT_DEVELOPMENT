import React, { Component } from 'react'
import { getCall } from '../../../utils/api.config';
import { RECENT_SEARCH_CORPORATE } from '../../../utils/constants';
import { toast } from 'react-toastify';

export class RecentSearches extends Component {
    state = {
        searches: [],
        screenWidth: window.innerWidth
    }
    componentDidMount() {
        getCall(RECENT_SEARCH_CORPORATE, {}, { sfn: this.successRecentSearches, efn: this.errorRecentSearches })
    }
    successRecentSearches = (data) => {
        this.setState({searches: data.response.recentsearch})
    }
    errorRecentSearches = () => {
        toast.error("Server failed to respond. Please try again later.")
    }
    render() {
        const { searches, screenWidth } = this.state
        let recentSearches = []
        if(screenWidth>767){
            recentSearches.push(
                <div className="carousel-inner" key="recentsearch">
                    <ul className="item active text-center">
                        {searches.slice(0, 3).map(entry=> {
                            return (
                                <li key={entry.id} className="recentsearches-secs" onClick={this.props.itemClicked.bind(this,entry)}>
                                    <div>
                                        <span><strong>Search:</strong> {entry.searchtext}</span>
                                        <span>
                                            {(entry.function===null||entry.function!==null)&&<span><br/><strong>Function:</strong> {entry.function !== null ? entry.function : `-`}</span>}
                                            {(entry.role===null||entry.role!==null)&&<span><br/><strong>Role:</strong> {entry.role !== null ? entry.role : `-`}</span>}
                                            {(entry.skill===null||entry.skill!==null)&&<span><br/><strong>Skill:</strong> {entry.skills !== null ? entry.skills : `-`}</span>}
                                            {(entry.city===null||entry.city!==null)&&<span><br/><strong>City:</strong> {entry.city !== null ? entry.city : `-`}</span>}
                                            {(entry.country===null||entry.country!==null)&&<span><br/><strong>Country:</strong> {entry.country !== null ? entry.country : `-`}</span>}
                                            {(entry.zipcode===null||entry.zipcode!==null)&&<span><br/><strong>Zipcode:</strong> {entry.zipcode !== null ? entry.zipcode : `-`}</span>}
                                            {(entry.experience===null||entry.experience!==null)&&<span><br/><strong>Experience:</strong> {entry.experience !== null ? entry.experience : `-`}</span>}
                                            {(entry.name===null||entry.name!==null)&&<span><br/><strong>Searched:</strong> {entry.name ? 'Individual' : 'Anything'}</span>}
                                        </span>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                    {searches.length > 3 && 
                    <ul className="item text-center">
                        {searches.slice(3, 6).map(entry=> {
                            return (
                                <li key={entry.id} className="recentsearches-secs" onClick={this.props.itemClicked.bind(this,entry)}>
                                    <div>
                                        <span><strong>Search:</strong> {entry.searchtext}</span>
                                        <span>
                                            {(entry.function===null||entry.function!==null)&&<span><br/><strong>Function:</strong> {entry.function !== null ? entry.function : `-`}</span>}
                                            {(entry.role===null||entry.role!==null)&&<span><br/><strong>Role:</strong> {entry.role !== null ? entry.role : `-`}</span>}
                                            {(entry.skill===null||entry.skill!==null)&&<span><br/><strong>Skill:</strong> {entry.skills !== null ? entry.skills : `-`}</span>}
                                            {(entry.city===null||entry.city!==null)&&<span><br/><strong>City:</strong> {entry.city !== null ? entry.city : `-`}</span>}
                                            {(entry.country===null||entry.country!==null)&&<span><br/><strong>Country:</strong> {entry.country !== null ? entry.country : `-`}</span>}
                                            {(entry.zipcode===null||entry.zipcode!==null)&&<span><br/><strong>Zipcode:</strong> {entry.zipcode !== null ? entry.zipcode : `-`}</span>}
                                            {(entry.experience===null||entry.experience!==null)&&<span><br/><strong>Experience:</strong> {entry.experience !== null ? entry.experience : `-`}</span>}
                                            {(entry.name===null||entry.name!==null)&&<span><br/><strong>Searched:</strong> {entry.name ? 'Individual' : 'Anything'}</span>}
                                        </span>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                    }
                    {searches.length > 6 && 
                    <ul className="item text-center">
                        {searches.slice(6, 9).map(entry=> {
                            return (
                                <li key={entry.id} className="recentsearches-secs" onClick={this.props.itemClicked.bind(this,entry)}>
                                    <div>
                                        <span><strong>Search:</strong> {entry.searchtext}</span>
                                        <span>
                                            {(entry.function===null||entry.function!==null)&&<span><br/><strong>Function:</strong> {entry.function !== null ? entry.function : `-`}</span>}
                                            {(entry.role===null||entry.role!==null)&&<span><br/><strong>Role:</strong> {entry.role !== null ? entry.role : `-`}</span>}
                                            {(entry.skill===null||entry.skill!==null)&&<span><br/><strong>Skill:</strong> {entry.skills !== null ? entry.skills : `-`}</span>}
                                            {(entry.city===null||entry.city!==null)&&<span><br/><strong>City:</strong> {entry.city !== null ? entry.city : `-`}</span>}
                                            {(entry.country===null||entry.country!==null)&&<span><br/><strong>Country:</strong> {entry.country !== null ? entry.country : `-`}</span>}
                                            {(entry.zipcode===null||entry.zipcode!==null)&&<span><br/><strong>Zipcode:</strong> {entry.zipcode !== null ? entry.zipcode : `-`}</span>}
                                            {(entry.experience===null||entry.experience!==null)&&<span><br/><strong>Experience:</strong> {entry.experience !== null ? entry.experience : `-`}</span>}
                                            {(entry.name===null||entry.name!==null)&&<span><br/><strong>Searched:</strong> {entry.name ? 'Individual' : 'Anything'}</span>}
                                        </span>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                    }
                </div>
            )
        }
        if(screenWidth<767&&screenWidth>480){
            recentSearches.push(
                <div className="carousel-inner" key="recentsearch">
                    <ul className="item active text-center">
                        {searches.slice(0, 2).map(entry=> {
                            return (
                                <li key={entry.id} className="recentsearches-secs" onClick={this.props.itemClicked.bind(this,entry)}>
                                    <div>
                                        <span><strong>Search:</strong> {entry.searchtext}</span>
                                        <span>
                                            {(entry.function===null||entry.function!==null)&&<span><br/><strong>Function:</strong> {entry.function !== null ? entry.function : `-`}</span>}
                                            {(entry.role===null||entry.role!==null)&&<span><br/><strong>Role:</strong> {entry.role !== null ? entry.role : `-`}</span>}
                                            {(entry.skill===null||entry.skill!==null)&&<span><br/><strong>Skill:</strong> {entry.skills !== null ? entry.skills : `-`}</span>}
                                            {(entry.city===null||entry.city!==null)&&<span><br/><strong>City:</strong> {entry.city !== null ? entry.city : `-`}</span>}
                                            {(entry.country===null||entry.country!==null)&&<span><br/><strong>Country:</strong> {entry.country !== null ? entry.country : `-`}</span>}
                                            {(entry.zipcode===null||entry.zipcode!==null)&&<span><br/><strong>Zipcode:</strong> {entry.zipcode !== null ? entry.zipcode : `-`}</span>}
                                            {(entry.experience===null||entry.experience!==null)&&<span><br/><strong>Experience:</strong> {entry.experience !== null ? entry.experience : `-`}</span>}
                                            {(entry.name===null||entry.name!==null)&&<span><br/><strong>Searched:</strong> {entry.name ? 'Individual' : 'Anything'}</span>}
                                        </span>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                    {searches.length > 2 && 
                    <ul className="item text-center">
                        {searches.slice(2, 4).map(entry=> {
                            return (
                                <li key={entry.id} className="recentsearches-secs" onClick={this.props.itemClicked.bind(this,entry)}>
                                    <div>
                                        <span><strong>Search:</strong> {entry.searchtext}</span>
                                        <span>
                                            {(entry.function===null||entry.function!==null)&&<span><br/><strong>Function:</strong> {entry.function !== null ? entry.function : `-`}</span>}
                                            {(entry.role===null||entry.role!==null)&&<span><br/><strong>Role:</strong> {entry.role !== null ? entry.role : `-`}</span>}
                                            {(entry.skill===null||entry.skill!==null)&&<span><br/><strong>Skill:</strong> {entry.skills !== null ? entry.skills : `-`}</span>}
                                            {(entry.city===null||entry.city!==null)&&<span><br/><strong>City:</strong> {entry.city !== null ? entry.city : `-`}</span>}
                                            {(entry.country===null||entry.country!==null)&&<span><br/><strong>Country:</strong> {entry.country !== null ? entry.country : `-`}</span>}
                                            {(entry.zipcode===null||entry.zipcode!==null)&&<span><br/><strong>Zipcode:</strong> {entry.zipcode !== null ? entry.zipcode : `-`}</span>}
                                            {(entry.experience===null||entry.experience!==null)&&<span><br/><strong>Experience:</strong> {entry.experience !== null ? entry.experience : `-`}</span>}
                                            {(entry.name===null||entry.name!==null)&&<span><br/><strong>Searched:</strong> {entry.name ? 'Individual' : 'Anything'}</span>}
                                        </span>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                    }
                    {searches.length > 4 && 
                    <ul className="item text-center">
                        {searches.slice(4, 6).map(entry=> {
                            return (
                                <li key={entry.id} className="recentsearches-secs" onClick={this.props.itemClicked.bind(this,entry)}>
                                    <div>
                                        <span><strong>Search:</strong> {entry.searchtext}</span>
                                        <span>
                                            {(entry.function===null||entry.function!==null)&&<span><br/><strong>Function:</strong> {entry.function !== null ? entry.function : `-`}</span>}
                                            {(entry.role===null||entry.role!==null)&&<span><br/><strong>Role:</strong> {entry.role !== null ? entry.role : `-`}</span>}
                                            {(entry.skill===null||entry.skill!==null)&&<span><br/><strong>Skill:</strong> {entry.skills !== null ? entry.skills : `-`}</span>}
                                            {(entry.city===null||entry.city!==null)&&<span><br/><strong>City:</strong> {entry.city !== null ? entry.city : `-`}</span>}
                                            {(entry.country===null||entry.country!==null)&&<span><br/><strong>Country:</strong> {entry.country !== null ? entry.country : `-`}</span>}
                                            {(entry.zipcode===null||entry.zipcode!==null)&&<span><br/><strong>Zipcode:</strong> {entry.zipcode !== null ? entry.zipcode : `-`}</span>}
                                            {(entry.experience===null||entry.experience!==null)&&<span><br/><strong>Experience:</strong> {entry.experience !== null ? entry.experience : `-`}</span>}
                                            {(entry.name===null||entry.name!==null)&&<span><br/><strong>Searched:</strong> {entry.name ? 'Individual' : 'Anything'}</span>}
                                        </span>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                    }
                    {searches.length > 6 && 
                    <ul className="item text-center">
                        {searches.slice(6, 8).map(entry=> {
                            return (
                                <li key={entry.id} className="recentsearches-secs" onClick={this.props.itemClicked.bind(this,entry)}>
                                    <div>
                                        <span><strong>Search:</strong> {entry.searchtext}</span>
                                        <span>
                                            {(entry.function===null||entry.function!==null)&&<span><br/><strong>Function:</strong> {entry.function !== null ? entry.function : `-`}</span>}
                                            {(entry.role===null||entry.role!==null)&&<span><br/><strong>Role:</strong> {entry.role !== null ? entry.role : `-`}</span>}
                                            {(entry.skill===null||entry.skill!==null)&&<span><br/><strong>Skill:</strong> {entry.skills !== null ? entry.skills : `-`}</span>}
                                            {(entry.city===null||entry.city!==null)&&<span><br/><strong>City:</strong> {entry.city !== null ? entry.city : `-`}</span>}
                                            {(entry.country===null||entry.country!==null)&&<span><br/><strong>Country:</strong> {entry.country !== null ? entry.country : `-`}</span>}
                                            {(entry.zipcode===null||entry.zipcode!==null)&&<span><br/><strong>Zipcode:</strong> {entry.zipcode !== null ? entry.zipcode : `-`}</span>}
                                            {(entry.experience===null||entry.experience!==null)&&<span><br/><strong>Experience:</strong> {entry.experience !== null ? entry.experience : `-`}</span>}
                                            {(entry.name===null||entry.name!==null)&&<span><br/><strong>Searched:</strong> {entry.name ? 'Individual' : 'Anything'}</span>}
                                        </span>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                    }
                    {searches.length > 8 && 
                    <ul className="item text-center">
                        {searches.slice(8, 10).map(entry=> {
                            return (
                                <li key={entry.id} className="recentsearches-secs" onClick={this.props.itemClicked.bind(this,entry)}>
                                    <div>
                                        <span><strong>Search:</strong> {entry.searchtext}</span>
                                        <span>
                                            {(entry.function===null||entry.function!==null)&&<span><br/><strong>Function:</strong> {entry.function !== null ? entry.function : `-`}</span>}
                                            {(entry.role===null||entry.role!==null)&&<span><br/><strong>Role:</strong> {entry.role !== null ? entry.role : `-`}</span>}
                                            {(entry.skill===null||entry.skill!==null)&&<span><br/><strong>Skill:</strong> {entry.skills !== null ? entry.skills : `-`}</span>}
                                            {(entry.city===null||entry.city!==null)&&<span><br/><strong>City:</strong> {entry.city !== null ? entry.city : `-`}</span>}
                                            {(entry.country===null||entry.country!==null)&&<span><br/><strong>Country:</strong> {entry.country !== null ? entry.country : `-`}</span>}
                                            {(entry.zipcode===null||entry.zipcode!==null)&&<span><br/><strong>Zipcode:</strong> {entry.zipcode !== null ? entry.zipcode : `-`}</span>}
                                            {(entry.experience===null||entry.experience!==null)&&<span><br/><strong>Experience:</strong> {entry.experience !== null ? entry.experience : `-`}</span>}
                                            {(entry.name===null||entry.name!==null)&&<span><br/><strong>Searched:</strong> {entry.name ? 'Individual' : 'Anything'}</span>}
                                        </span>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                    }
                </div>
            )
        }
        if(screenWidth<480){
            recentSearches.push(
                <div className="carousel-inner" key="recentsearch">
                    <ul className="item active text-center">
                        {searches.slice(0, 1).map(entry=> {
                            return (
                                <li key={entry.id} className="recentsearches-secs" onClick={this.props.itemClicked.bind(this,entry)}>
                                    <div>
                                        <span><strong>Search:</strong> {entry.searchtext}</span>
                                        <span>
                                            {(entry.function===null||entry.function!==null)&&<span><br/><strong>Function:</strong> {entry.function !== null ? entry.function : `-`}</span>}
                                            {(entry.role===null||entry.role!==null)&&<span><br/><strong>Role:</strong> {entry.role !== null ? entry.role : `-`}</span>}
                                            {(entry.skill===null||entry.skill!==null)&&<span><br/><strong>Skill:</strong> {entry.skills !== null ? entry.skills : `-`}</span>}
                                            {(entry.city===null||entry.city!==null)&&<span><br/><strong>City:</strong> {entry.city !== null ? entry.city : `-`}</span>}
                                            {(entry.country===null||entry.country!==null)&&<span><br/><strong>Country:</strong> {entry.country !== null ? entry.country : `-`}</span>}
                                            {(entry.zipcode===null||entry.zipcode!==null)&&<span><br/><strong>Zipcode:</strong> {entry.zipcode !== null ? entry.zipcode : `-`}</span>}
                                            {(entry.experience===null||entry.experience!==null)&&<span><br/><strong>Experience:</strong> {entry.experience !== null ? entry.experience : `-`}</span>}
                                            {(entry.name===null||entry.name!==null)&&<span><br/><strong>Searched:</strong> {entry.name ? 'Individual' : 'Anything'}</span>}
                                        </span>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                    {searches.length>10?
                        searches.slice(1, 10).map(entry=>{
                            return(
                                <ul className="item text-center" key={entry.id}>
                                    <li className="recentsearches-secs" onClick={this.props.itemClicked.bind(this,entry)}>
                                        <div>
                                            <span><strong>Search:</strong> {entry.searchtext}</span>
                                            <span>
                                                {(entry.function===null||entry.function!==null)&&<span><br/><strong>Function:</strong> {entry.function !== null ? entry.function : `-`}</span>}
                                                {(entry.role===null||entry.role!==null)&&<span><br/><strong>Role:</strong> {entry.role !== null ? entry.role : `-`}</span>}
                                                {(entry.skill===null||entry.skill!==null)&&<span><br/><strong>Skill:</strong> {entry.skills !== null ? entry.skills : `-`}</span>}
                                                {(entry.city===null||entry.city!==null)&&<span><br/><strong>City:</strong> {entry.city !== null ? entry.city : `-`}</span>}
                                                {(entry.country===null||entry.country!==null)&&<span><br/><strong>Country:</strong> {entry.country !== null ? entry.country : `-`}</span>}
                                                {(entry.zipcode===null||entry.zipcode!==null)&&<span><br/><strong>Zipcode:</strong> {entry.zipcode !== null ? entry.zipcode : `-`}</span>}
                                                {(entry.experience===null||entry.experience!==null)&&<span><br/><strong>Experience:</strong> {entry.experience !== null ? entry.experience : `-`}</span>}
                                                {(entry.name===null||entry.name!==null)&&<span><br/><strong>Searched:</strong> {entry.name ? 'Individual' : 'Anything'}</span>}
                                            </span>
                                        </div>
                                    </li>
                                </ul>
                            )
                        })
                        :
                        searches.slice(1, searches.length).map(entry=>{
                            return(
                                <ul className="item text-center" key={entry.id}>
                                    <li className="recentsearches-secs" onClick={this.props.itemClicked.bind(this,entry)}>
                                        <div>
                                            <span><strong>Search:</strong> {entry.searchtext}</span>
                                            <span>
                                                {(entry.function===null||entry.function!==null)&&<span><br/><strong>Function:</strong> {entry.function !== null ? entry.function : `-`}</span>}
                                                {(entry.role===null||entry.role!==null)&&<span><br/><strong>Role:</strong> {entry.role !== null ? entry.role : `-`}</span>}
                                                {(entry.skill===null||entry.skill!==null)&&<span><br/><strong>Skill:</strong> {entry.skills !== null ? entry.skills : `-`}</span>}
                                                {(entry.city===null||entry.city!==null)&&<span><br/><strong>City:</strong> {entry.city !== null ? entry.city : `-`}</span>}
                                                {(entry.country===null||entry.country!==null)&&<span><br/><strong>Country:</strong> {entry.country !== null ? entry.country : `-`}</span>}
                                                {(entry.zipcode===null||entry.zipcode!==null)&&<span><br/><strong>Zipcode:</strong> {entry.zipcode !== null ? entry.zipcode : `-`}</span>}
                                                {(entry.experience===null||entry.experience!==null)&&<span><br/><strong>Experience:</strong> {entry.experience !== null ? entry.experience : `-`}</span>}
                                                {(entry.name===null||entry.name!==null)&&<span><br/><strong>Searched:</strong> {entry.name ? 'Individual' : 'Anything'}</span>}
                                            </span>
                                        </div>
                                    </li>
                                </ul>
                            )
                        })
                    }
                </div>
            )
        }
        return (
            <div id='recentsearches'>
                {searches.length > 0  ?
                    <div>
                        <h3><strong>Search History</strong></h3>
                        <div id = "recentSearchesCarousel" className="carousel slide" data-interval="false">
                            {recentSearches}
                        </div>
                        <a className="left carousel-control" href="#recentSearchesCarousel" data-slide="prev">
                            <span className="glyphicon glyphicon-chevron-left"></span>
                            <span className="sr-only">Previous</span>
                        </a>
                        <a className="right carousel-control" href="##recentSearchesCarousel" data-slide="next">
                            <span className="glyphicon glyphicon-chevron-right"></span>
                            <span className="sr-only">Next</span>
                        </a>
                    </div>
                    :
                    <div>No History Found</div>
                }
            </div>
        )
    }
}

export default RecentSearches


