import React, { Component } from 'react'
import { getCall } from '../../../utils/api.config';
import { POPULAR_SEARCH_INDIVIDUAL } from '../../../utils/constants';
import { toast } from 'react-toastify';

export class PopularSearches extends Component {

    state = {
        popularSearches : []
    }
    componentDidMount() {
        getCall(POPULAR_SEARCH_INDIVIDUAL, {}, { sfn: this.successPopularSearches, efn: this.errorPopularSearches })
    }
    successPopularSearches = (data) => {
        this.setState({popularSearches: data.response.popularsearch})
    }
    errorPopularSearches = () => {
        toast.error("Server failed to respond. Please try again later.")
    }
    render() {
        const {popularSearches} = this.state
        return (
            <div id="popularsearches">
                <h3><strong>Popular Text Searched</strong></h3>
                <ul>
                    {popularSearches.map((entry, index)=> 
                            <li key={index} className="popularsearches-secs" onClick={this.props.itemClicked.bind(this,entry)}>
                                <span><strong>Search:</strong> {entry.searchtext}</span>
                            </li>
                        )
                    }
                </ul>
            </div>
        )
    }
}

export default PopularSearches
