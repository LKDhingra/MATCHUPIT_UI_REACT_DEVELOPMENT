import React, { Component } from 'react'
import { postCall, getCall } from "../../../utils/api.config";
import { TAGGED_FAVOURITES_CORPORATE, DUMMY_PIC, PROFILE_CLICK_CORPORATE } from "../../../utils/constants";
import { toast } from 'react-toastify';

export class FavouriteIndividuals extends Component {

    state = {
        favouriteUsers : []
    }
    componentDidMount() {
        getCall(TAGGED_FAVOURITES_CORPORATE, {}, { sfn: this.successFavouriteSearches, efn: this.errorFavouriteSearches })
    }
    successFavouriteSearches = (data) => {
        this.setState({ favouriteUsers: data.response.favouriteUsersList });
    }
    errorFavouriteSearches = () => {
        toast.error("Server failed to respond. Please try again later.")
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
    render() {
        const {favouriteUsers} = this.state
        return (
            <div>
                {favouriteUsers.length > 0 ?
                    <>
                        <h3><strong>Favourite Individuals</strong></h3>
                        <div className='recent-holder'>
                            <ul>
                                {favouriteUsers.map((data)=> 
                                    <li key={data.id} onClick={this.props.itemClicked.bind(this,data)}>
                                        <div className="recent-item">
                                            <ul>
                                                <li>
                                                    <img src={data.profile_pic || DUMMY_PIC} alt="" />
                                                </li>
                                                <li className='desc-holder'>
                                                    <span className='name'>{data.first_name} {data.last_name}</span><br />
                                                    <span className='link fa fa-angle-right'></span>
                                                </li>
                                            </ul>
                                        </div>
                                    </li>
                                    )
                                }
                            </ul>
                        </div>
                    </>
                :
                    ""
                }
            </div>
        )
    }
}

export default FavouriteIndividuals
