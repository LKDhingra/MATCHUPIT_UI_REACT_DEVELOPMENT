import React from 'react';
import './Communities.css'
import { connect } from 'react-redux';
import { GET_COMMUNITIES, REACT_ON_POST, GET_POSTS, EDIT_POST, JOIN_COMMUNITY, LEAVE_COMMUNITY, INDUSTRY, FILE_UPLOAD, ADD_POST, DELETE_POST, ADD_COMMENT, USER_ID, SEARCH_COMMUNITY, GET_TOP_COMMUNITIES } from '../../../utils/constants';
import { getCall, postCall } from '../../../utils/api.config';
import { toast } from 'react-toastify';
import Modal from 'react-responsive-modal';
import moment from 'moment';

const mapStateToProps = state => {
    return state
};

class ConnectedCommunities extends React.Component {
    constructor(props) {
        super(props);
        this.commentWindow = React.createRef();
        this.state = {
            mode: 'new',
            communityListOriginal: [],
            communityList: [],
            communityListJoined: [],
            communityListTop: [],
            listView: true,
            selCommTitle: '',
            selCommDesc: '',
            discussionList: [],
            currPage: 1,
            totalPages: 1,
            isMember: false,
            postPopup: false,
            postTitle: { value: '', err: '' },
            postDesc: { value: '', err: '' },
            skills: { value: [], err: '' },
            showSkill: false,
            allSkills: [],
            tags: { value: '', err: '' },
            attachments: { value: [], err: '' },
            commentPopup: false,
            commentList: [],
            currPostId: null,
            commentAttchments: { value: [], err: '' },
            currText: { value: '', err: '' },
            searchedCommunityList: []
        }
    }
    scrollCommentWindow = () => {
        let element = this.commentWindow.current;
        element.scrollTop = element.scrollHeight;
    }
    onInputValueChange = (e) => {
        switch (e.target.name) {
            case "postTitle": this.setState({ postTitle: { value: e.target.value, err: '' }, formReady: true }); break;
            case "postDesc": this.setState({ postDesc: { value: e.target.value, err: '' }, formReady: true }); break;
            case "tags": this.setState({ tags: { value: e.target.value, err: '' }, formReady: true }); break;
            default: break;
        }
    }
    componentDidMount = () => {
        if (this.props.type === "individual") {
            getCall(GET_COMMUNITIES, { params: { isMember: false } }, { sfn: this.postCommunityFetch, efn: this.errInCommunityFetch })
            getCall(GET_COMMUNITIES, { params: { isMember: true } }, { sfn: this.postCommunityFetchJoined, efn: this.errInCommunityFetch })
            getCall(GET_TOP_COMMUNITIES, { params: { isMember: true } }, { sfn: this.postCommunityTopFetch, efn: this.errInCommunityFetch })
        } else {
            getCall(GET_COMMUNITIES, {}, { sfn: this.postCommunityFetch, efn: this.errInCommunityFetch })
            getCall(GET_TOP_COMMUNITIES, { params: { isMember: true } }, { sfn: this.postCommunityTopFetch, efn: this.errInCommunityFetch })
        }
        this.setState({ listView: window.location.href.split('/communities')[1] ? false : true })
        setTimeout(() => {
            let selectedCommunity = sessionStorage.getItem('selectedCommunity')
            if (!this.state.listView) {
                getCall(GET_POSTS, { params: { communityId: selectedCommunity } }, { sfn: this.renderPosts, efn: this.errRenderPosts })
            }
        }, 0)
    }
    errInCommunityFetch = () => {
        toast.error("Server failed to respond. Please try again later.")
    }
    errRenderPosts = () => {
        toast.error("Server failed to respond. Please try again later.")
    }
    renderPosts = (data) => {
        this.setState({
            discussionList: data.posts.filter(i => i.isActive),
            selCommTitle: data.communityName,
            selCommDesc: data.communityDescription,
            isMember: data.isMember
        })
    }
    postCommunityFetch = (data) => {
        this.setState({
            communityListOriginal: data.data,
            communityList: data.data,
            totalPages: Number((data.count / 6).toFixed(0))
        })
    }
    postCommunityFetchJoined = (data) => {
        this.setState({
            communityListJoined: data.data
        })
    }
    postCommunityTopFetch = (data) => {
        this.setState({
            communityListTop: data.data
        })
    }
    searchCommunities = (e) => {
        if (e.target.value.length >= 3) {
            let searchText = e.target.value
            postCall(SEARCH_COMMUNITY, { communityName: searchText }, { sfn: this.gotTheCommunities, efn: this.dintGetUsers })
        } else if (e.target.value.length < 3) {
            this.setState({ searchedCommunityList: [] })
        }
    }
    gotTheCommunities = (data) => {
        this.setState({ searchedCommunityList: data.data })
    }
    dintGetUsers = () => {
        toast.error("Server failed to respond. Please try again later.")
    }
    openCommunity = (id, title) => {
        sessionStorage.setItem('selectedCommunity', id)
        if(this.state.listView){
            window.location.href = window.location.href + '/' + title.replace(/ /g, '-');
        }
        else{
            var path = window.location.href.split('/')
            path.pop()
            path = path.join('/')
            window.location.href = path + '/' + title.replace(/ /g, '-');
        }
    }
    nextPage = () => {
        this.setState({ currPage: this.state.currPage + 1 }, () => {
            getCall(GET_COMMUNITIES, { params: { page: this.state.currPage } }, { sfn: this.postCommunityFetch, efn: this.errInCommunityFetch })
        })
    }
    previousPage = () => {
        this.setState({ currPage: this.state.currPage - 1 }, () => {
            getCall(GET_COMMUNITIES, { params: { page: this.state.currPage } }, { sfn: this.postCommunityFetch, efn: this.errInCommunityFetch })
        })
    }
    joinThisCommunity = () => {
        let communityId = sessionStorage.getItem('selectedCommunity')
        postCall(JOIN_COMMUNITY, { communityId: communityId }, { sfn: this.communityJoined, efn: this.joinCommunityErr })
        getCall(GET_COMMUNITIES, { params: { isMember: true } }, { sfn: this.postCommunityFetchJoined, efn: this.errInCommunityFetch })
        getCall(GET_TOP_COMMUNITIES, { params: { isMember: true } }, { sfn: this.postCommunityTopFetch, efn: this.errInCommunityFetch })
    }
    joinCommunityErr = (data) => {
        toast.error("Cannot Join more than 5 communities")
    }
    joinThisCommunityShortCut = (id) => {
        postCall(JOIN_COMMUNITY, { communityId: id }, { sfn: this.communityJoinedShortCut, efn: this.joinCommunityErr })
        getCall(GET_COMMUNITIES, { params: { isMember: true } }, { sfn: this.postCommunityFetchJoined, efn: this.errInCommunityFetch })
        getCall(GET_TOP_COMMUNITIES, { params: { isMember: true } }, { sfn: this.postCommunityTopFetch, efn: this.errInCommunityFetch })
    }
    leaveThisCommunity = () => {
        let communityId = sessionStorage.getItem('selectedCommunity')
        postCall(LEAVE_COMMUNITY, { communityId: communityId }, { sfn: this.communityLeft, efn: this.errCommunityLeft })
    }
    communityJoined = () => {
        toast.success("You successfully joined this community")
        let selectedCommunity = sessionStorage.getItem('selectedCommunity')
        getCall(GET_POSTS, { params: { communityId: selectedCommunity } }, { sfn: this.renderPosts, efn: this.errRenderPosts })
    }
    communityJoinedShortCut = () => {
        toast.success("You successfully joined this community")
        getCall(GET_COMMUNITIES, {}, { sfn: this.postCommunityFetch, efn: this.errInCommunityFetch })
    }
    communityLeft = () => {
        this.setState({ isMember: false })
        toast.warn("You have left this community")
    }
    errCommunityLeft = () => {
        toast.error("Server failed to respond. Please try again later.")
    }
    createPost = () => {
        this.setState({ postPopup: true })
    }
    onCloseModal = () => {
        this.setState({
            postPopup: false,
            postTitle: { value: '', err: '' },
            postDesc: { value: '', err: '' },
            tags: { value: '', err: '' },
            attachments: { value: [], err: '' },
            mode: 'new'
        });
    }
    onCloseCommentModal = () => {
        this.setState({
            commentPopup: false
        })
        setTimeout(() => {
            this.setState({
                commentList: [],
                postTitle: { value: '', err: '' },
                postDesc: { value: '', err: '' }
            })
        }, 400)
    }
    showList = () => {
        this.setState({ showSkill: !this.state.showSkill })
        getCall(INDUSTRY, {}, {
            sfn: (data) => this.setState({
                allSkills: data.response.skills,
                skills: { value: data.response.skills, err: '' }
            }),
            efn: () => toast.error("Server failed to respond. Please try again later.")
        })
    }
    uploadAttachment = (input) => {
        if (input.target.files && input.target.files[0]) {
            const formData = new FormData()
            formData.append('file', input.target.files[0])
            document.getElementById('attInput').value = ''
            postCall(FILE_UPLOAD, formData, { sfn: this.postuploadAttachment, efn: this.errPostUploadAttachment }, 'attachment')
        }
    }
    postuploadAttachment = (data) => {
        let currList = this.state.attachments.value
        currList.push({ path: data.fileUrl, type: data.type })
        setTimeout(() => { this.setState({ attachments: { value: currList, err: '' } }) }, 10)
    }
    errPostUploadAttachment = () => {
        toast.error("Server failed to respond. Please try again later.")
    }
    deleteAttachment = (index) => {
        let allAttachs = this.state.attachments.value
        allAttachs.splice(index, 1)
        setTimeout(() => { this.setState({ attachments: { value: allAttachs, err: '' } }) }, 10)
    }
    uploadAttachmentComm = (input) => {
        if (input.target.files && input.target.files[0]) {
            const formData = new FormData()
            formData.append('file', input.target.files[0])
            document.getElementById('file-input').value = ''
            postCall(FILE_UPLOAD, formData, { sfn: this.postuploadAttachmentComm, efn: this.errPostUploadAttachment }, 'attachment')
        }
    }
    postuploadAttachmentComm = (data) => {
        let currList = this.state.commentAttchments.value
        currList.push({ path: data.fileUrl, type: data.type })
        setTimeout(() => { this.setState({ attachments: { value: currList, err: '' } }) }, 10)
    }
    deleteAttachmentComm = (index) => {
        let allAttachs = this.state.attachments.value
        allAttachs.splice(index, 1)
        setTimeout(() => { this.setState({ attachments: { value: allAttachs, err: '' } }) }, 10)
    }
    submitPost = () => {
        let payload = {
            title: this.state.postTitle.value,
            description: this.state.postDesc.value,
            tags: this.state.tags.value.split(','),
            attachments: this.state.attachments.value
        }
        if (payload.title.trim() === '') {
            this.setState({ postTitle: { value: '', err: 'Title cannot be empty' }, formReady: false })
        }
        if (payload.description.trim() === '') {
            this.setState({ postDesc: { value: '', err: 'Description cannot be empty' }, formReady: false })
        }
        if(payload.tags[0] === ""){
            this.setState({ tags: { value: '', err: 'Mention atleast one tag' }, formReady: false})
        }
        setTimeout(() => {
            if(this.state.formReady){
                if (this.state.mode === "new") {
                    payload.communityId = sessionStorage.getItem('selectedCommunity');
                    postCall(ADD_POST, payload, { sfn: this.postRecall, efn: this.postError })
                    toast.success("New post created")
                } else {
                    payload.postId = this.state.selectedPostId;
                    postCall(EDIT_POST, payload, { sfn: this.postRecall, efn: this.postError })
                }
            }
        }, 0)
    }
    postRecall = (data) => {
        this.onCloseModal.call()
        let selectedCommunity = sessionStorage.getItem('selectedCommunity')
        getCall(GET_POSTS, { params: { communityId: selectedCommunity } }, { sfn: this.renderPosts, efn: this.errRenderPosts })
        getCall(GET_COMMUNITIES, { params: { isMember: true } }, { sfn: this.postCommunityFetchJoined, efn: this.errInCommunityFetch })
        getCall(GET_TOP_COMMUNITIES, { params: { isMember: true } }, { sfn: this.postCommunityTopFetch, efn: this.errInCommunityFetch })
    }
    deletePost = (id) => {
        postCall(DELETE_POST, { postId: id }, { sfn: this.postRecall, efn: this.postError })
        toast.success("Post deleted successfully")
    }
    editPost = (id) => {
        let obj = this.state.discussionList.find(i => i._id === id)
        this.setState({
            postPopup: true,
            postTitle: { value: obj.title, err: '' },
            postDesc: { value: obj.description, err: '' },
            tags: { value: obj.tags.toString(), err: '' },
            attachments: { value: obj.attachments, err: '' },
            mode: 'edit',
            selectedPostId: id
        })
    }
    commentOnIt = (id) => {
        this.setState({ postId: id })
        let payload = {
            postId: id,
            text: this.state.currText.value,
            attachments: this.state.commentAttchments.value
        }
        postCall(ADD_COMMENT, payload, { sfn: this.postCommentAdd, efn: this.postError })
    }
    postCommentAdd = (data) => {
        this.setState({ commentList: [...this.state.commentList, data.comment], currText: { value: '', err: '' }, commentAttchments: { value: [], err: '' } })
        let selectedCommunity = sessionStorage.getItem('selectedCommunity')
        let objDiv = document.getElementsByName(this.state.currPostId)[0].parentElement.previousSibling;
        objDiv.scrollTop = objDiv.scrollHeight;
        getCall(GET_POSTS, { params: { communityId: selectedCommunity } }, { sfn: this.renderPosts, efn: this.errRenderPosts })
    }
    commentListOpen = (id) => {
        Array.from(document.getElementsByClassName('collapse in')).map(i=>i.classList.remove('in'))
        let post = this.state.discussionList.find(i => i._id === id)
        this.setState({
            commentList: post.comments,
            postTitle: { value: post.title, err: '' },
            postDesc: { value: post.description, err: '' },
            currPostId: id
        })
    }
    updateCurrText = (e) => {
        this.setState({ currText: { value: e.target.value, err: '' } })
    }
    reactOnPost = (id, type) => {
        let payload = {
            postId: id,
            type: type
        }
        postCall(REACT_ON_POST, payload, { sfn: this.postReacting, efn: this.postError })
    }
    postReacting = (data) => {
        let selectedCommunity = sessionStorage.getItem('selectedCommunity')
        getCall(GET_POSTS, { params: { communityId: selectedCommunity } }, { sfn: this.renderPosts, efn: this.errRenderPosts })
    }
    postError = () => {}
    render() {
        const accType = this.props.type
        return (
            <div id="Communities">
                {this.state.listView ?
                    <div>
                        <div className="comm-list-holder">
                            <div className="row">
                                <div className={accType === "individual" ? "col-sm-8" : "col-sm-12"}>
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <div className="row">
                                                <div className="col-sm-8">
                                                    <h3>All Communities</h3>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className={accType === "individual" ? "col-sm-6" : "col-sm-4"}>
                                                    <div className="ser-sec-comm text-right">
                                                        <input type="text" placeholder='Search Community Name..' onChange={this.searchCommunities} />
                                                        {this.state.searchedCommunityList.length ? <div className="angle-up"></div> : null}
                                                        {this.state.searchedCommunityList.length ?
                                                            <div className="searched-list">
                                                                {this.state.searchedCommunityList.map(i => (
                                                                    <div key={i._id} onClick={() => this.openCommunity.call(this, i._id, i.title)}>
                                                                        <span>{i.title}</span>
                                                                    </div>
                                                                ))}
                                                            </div> : null}
                                                    </div>
                                                </div>
                                                <div className={accType === "individual" ? "col-sm-6" : "col-sm-8"}>
                                                    <div className="text-right">
                                                        <ul className='pagination-block'>
                                                            <li onClick={this.previousPage} className={this.state.currPage === 1 ? "fa fa-angle-left onEdge" : "fa fa-angle-left"}></li>
                                                            <li className="num-holder">{this.state.currPage}</li>
                                                            <li>|</li>
                                                            <li className="num-holder">{this.state.totalPages}</li>
                                                            <li onClick={this.nextPage} className={this.state.currPage === this.state.totalPages ? "fa fa-angle-right onEdge" : "fa fa-angle-right"}></li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {this.state.communityList.map((i) =>
                                            <div className={accType === "individual" ? "col-sm-6" : "col-sm-4"} key={i._id}>
                                                <div className="matchup-secs community">
                                                    <div style={{ cursor: 'pointer' }} onClick={() => this.openCommunity.call(this, i._id, i.title)}>
                                                        <p><strong>{i.title}</strong></p>
                                                        <p className='tile-desc'>{i.description}</p>
                                                    </div>
                                                    <div className="btn-join-holder">
                                                        <div className="row">
                                                            <div className="col-xs-4">
                                                                <span className="fa fa-user userCount"> {i.userCount}</span>
                                                            </div>
                                                            <div className="col-xs-4">

                                                            </div>
                                                            <div className="col-xs-4 text-right">
                                                                {accType === "individual" ? (!i.isMember) ? <button type="button" className="btn-general" onClick={this.joinThisCommunityShortCut.bind(this, i._id)}>Join</button> : <span className="mem-info">already a member</span> : null}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {accType === "individual" &&
                                    <div className="col-sm-4">
                                        <div>
                                            <h3 className="text-center">My Communities</h3>
                                            <ul className="side-community">
                                                {this.state.communityListJoined.map(i =>
                                                    <li key={i._id} style={{ cursor: 'pointer' }} onClick={() => this.openCommunity.call(this, i._id, i.title)}>
                                                        <div style={{ marginBottom: '10px' }} className="row">
                                                            <strong className="col-xs-8">{i.title}</strong>
                                                            <span className="fa fa-user col-xs-4"> {i.userCount}</span>
                                                        </div>
                                                        <div style={{ marginBottom: '10px' }} className="row">{i.hasPosted ?
                                                            <span className="fa fa-feed col-xs-12">You have posted here</span> :
                                                            <span className="fa fa-feed disabled col-xs-12">You have not posted</span>}
                                                        </div>
                                                    </li>
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                    :
                    <div className="row">
                        <div className="col-sm-8">
                        <button onClick={() => window.location.href= accType==='individual'?'/dashboard-individual/communities':'/dashboard-corporate/communities'} type="button" className="back-to-search"><span className="fa fa-long-arrow-left"></span> Communities</button>
                            <div className="comm-header-holder">
                                {this.state.isMember && <span className='leave-link' onClick={this.leaveThisCommunity}>Leave Community</span>}
                                <h4>{this.state.selCommTitle}</h4>
                                <p>{this.state.selCommDesc}</p>
                                {accType === "individual" ? this.state.isMember ?
                                    <div className="text-right"><button type='button' onClick={this.createPost}>Create Post</button></div>
                                    :
                                    <div className="text-right"><button type='button' onClick={this.joinThisCommunity}>Join Now</button></div>
                                    : 
                                    <div className="text-right"><button type='button' onClick={this.createPost}>Create Post</button></div>
                                }
                            </div>
                            <div className="comm-discussion-holder" id="postAccord">
                                <h4 className="text-center">Top Discussions</h4>
                                <div className="accordion-group">
                                    {this.state.discussionList.length ?
                                        this.state.discussionList.map((i, index) =>
                                            <div key={index} className="discussion-item">
                                                <div data-toggle="collapse" data-target={`#${i._id}`} aria-expanded="false" onClick={this.commentListOpen.bind(this, i._id)}>
                                                    <p><strong>{i.title}</strong></p>
                                                    <p>{i.description}</p>
                                                    <div className="text-center">
                                                        {i.attachments.map((i, index) => {
                                                            switch (i.type) {
                                                                case "document": {
                                                                    return (
                                                                        <div className="attachment-in-post" key={index}>
                                                                            <embed height={400} scrolling={0} className="fit-layout" src={i.path}></embed>
                                                                        </div>
                                                                    )
                                                                }
                                                                case "image": {
                                                                    return (
                                                                        <div className="attachment-in-post" key={index}>
                                                                            <img className="fit-layout" src={i.path} alt="" />
                                                                        </div>
                                                                    )
                                                                }
                                                                case "video": {
                                                                    return (
                                                                        <div className="attachment-in-post" key={index}>
                                                                            <video className="fit-layout" src={i.path} controls />
                                                                        </div>
                                                                    )
                                                                }
                                                                default: break;
                                                            }
                                                        }
                                                        )}</div>
                                                    <div className="row">
                                                        <div className="col-sm-3">
                                                            <span className="disc-floor">By {i.name}</span>
                                                        </div>
                                                        <div className="col-sm-2">
                                                            <span className="disc-floor">{i.comments.length} comments</span>
                                                        </div>
                                                        <div className="col-sm-5">
                                                            <span className="disc-floor"><ul>{i.tags.map((j, index) => <li key={index}>{j}</li>)}</ul></span>
                                                        </div>
                                                        <div className="col-sm-2">
                                                            <span className="disc-floor"><i className="fa fa-clock-o"></i> {moment(i.createdOn).format('MMMM Do YYYY, h:mm:ss a')}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-sm-3">
                                                        <span className="emoji-icons"><span className={i.postEmojis.likes.some(i => i === USER_ID) ? "fa fa-thumbs-up red" : "fa fa-thumbs-up"} style={{ pointerEvents: this.state.isMember ? 'auto' : 'none' }} onClick={this.reactOnPost.bind(this, i._id, 'like')}></span> {i.postEmojis.likes.length}</span>
                                                        <span className="emoji-icons"><span className={i.postEmojis.applauds.some(i => i === USER_ID) ? "fa fa-sign-language red" : "fa fa-sign-language"} style={{ pointerEvents: this.state.isMember ? 'auto' : 'none' }} onClick={this.reactOnPost.bind(this, i._id, 'applaud')}></span> {i.postEmojis.applauds.length}</span>
                                                    </div>
                                                    <div>
                                                        {i.myPost && <span className="fa fa-pencil-square-o edit-post" onClick={this.editPost.bind(this, i._id)}></span>}
                                                        {i.myPost && <span className="fa fa-trash-o delete-post" onClick={this.deletePost.bind(this, i._id)}></span>}
                                                    </div>
                                                </div>
                                                    <div className="collapse" data-parent="postAccord" id={i._id} style={{ padding: '15px' }}>
                                                        <h5><strong>Comments</strong></h5>
                                                        <div className="comments-scroller" ref={this.commentWindow}>
                                                            {this.state.commentList.map(i => (
                                                                <div style={{ padding: '10px', fontSize: '0.8em' }} key={i._id}>
                                                                    <div>
                                                                        <span>
                                                                            <img src={i.profilePic || require('../../../images/icons/placeholder-profile.jpg')} className='comment-img rounded' alt="" />
                                                                        </span><strong>{i.name || 'Unknown User'}</strong><span className="fa fa-clock-o comm-time"> {moment(i.createdOn).format('MMMM Do YYYY, h:mm:ss a')}</span></div>
                                                                    <span className="the-comment">
                                                                        {i.text}
                                                                    </span>
                                                                    {i.attachments.map((i, index) =>
                                                                        <div className="attachment-links" key={index}><a href={i.path} target="_blank" rel="noopener noreferrer">{i.path.split('/')[4]}</a></div>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                        {this.state.isMember ?
                                                            <div className="comment-response">
                                                                <input name={this.state.currPostId} value={this.state.currText.value} placeholder="What do you have to say about it?" onChange={this.updateCurrText} />
                                                                <div className="clip-upload">
                                                                    <label htmlFor="file-input">
                                                                        <i className="fa fa-paperclip" aria-hidden="true"></i>
                                                                    </label>
                                                                    <input type="file" name="file-input" id="file-input" style={{ display: 'none' }} onChange={this.uploadAttachmentComm} />
                                                                </div>
                                                                <button className="btn-comment-res" type="button" onClick={this.commentOnIt.bind(this, this.state.currPostId)}><span className="fa fa-paper-plane"></span></button>
                                                            </div> : null}
                                                        <div className="attachments">
                                                            {this.state.commentAttchments.value.map((i, index) => (
                                                                <div className="attachment-links" key={index}><a href={i.path} target="_blank" rel="noopener noreferrer">{i.path.split('/')[4]}</a> <span onClick={this.deleteAttachmentComm.bind(this, index)} className='fa fa-trash-o'></span></div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    {/* : null
                                                } */}

                                            </div>
                                        ) :
                                        <div className="no-discussions">No Discussions Yet</div>
                                    }
                                </div>
                            </div>
                        </div>
                        {accType === "individual" ?
                            <div className="col-sm-4">
                                <div style={{ marginBottom: '30px' }}>
                                    <h4>My Communities</h4>
                                    <ul className="side-community">
                                        {this.state.communityListJoined.map(i =>
                                            <li key={i._id} style={{ cursor: 'pointer' }} onClick={() => this.openCommunity.call(this, i._id, i.title)}>
                                                <div style={{ marginBottom: '10px' }}>
                                                    <strong>{i.title}</strong>
                                                    <span className="fa fa-user" style={{ float: "right", position: 'inherit' }}> {i.userCount}</span>
                                                </div>
                                                <div style={{ marginBottom: '10px' }}>{i.hasPosted ?
                                                    <span className="fa fa-feed">You have posted here</span> :
                                                    <span className="fa fa-feed disabled">You have not posted</span>}
                                                </div>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                                
                                <div style={{ marginBottom: '30px' }}>
                                    <h4>Top Communities</h4>
                                    <ul className="side-community">
                                        {this.state.communityListTop.map(i =>
                                            <li key={i._id} style={{ cursor: 'pointer' }} onClick={() => this.openCommunity.call(this, i._id, i.title)}>
                                                <div style={{ marginBottom: '10px' }}>
                                                    <strong>{i.title}</strong>
                                                    <span className="fa fa-user" style={{ float: "right", position: 'inherit' }}> {i.userCount}</span>
                                                </div>
                                                <div style={{ marginBottom: '10px' }}>{i.isMember ?
                                                    i.hasPosted ?
                                                        <span className="fa fa-feed"> You have posted here</span> :
                                                        <span className="fa fa-feed disabled"> You have not posted</span>
                                                    :
                                                    <span className="fa fa-link" style={{ color: '#3F465B' }} onClick={this.joinThisCommunityShortCut.bind(this, i._id)}> Join Now</span>
                                                }
                                                </div>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                            :
                            <div className="col-sm-4">
                                <div style={{ marginBottom: '30px' }}>
                                    <h4>Top Communities</h4>
                                    <ul className="side-community">
                                        {this.state.communityListTop.map(i =>
                                            <li key={i._id} style={{ cursor: 'pointer' }} onClick={() => this.openCommunity.call(this, i._id, i.title)}>
                                                <div style={{ marginBottom: '10px' }}>
                                                    <strong>{i.title}</strong>
                                                    <span className="fa fa-user" style={{ float: "right", position: 'inherit' }}> {i.userCount}</span>
                                                </div>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        }
                    </div>
                }
                <Modal
                    open={this.state.postPopup}
                    onClose={this.onCloseModal}
                    styles={{ modal: { background: '#f6f6f6' } }}
                    center>
                    <div className="create-comm-modal">
                        <h3>New Post</h3>
                        <img src={this.props.userPic} className="user-pic-in-modal rounded" alt="" /> <span>{this.props.userName}</span>
                        <form>
                            <div className="form-unit">
                                <input type="text" maxLength="50" placeholder="Enter the Post Title" value={this.state.postTitle.value} className={this.state.postTitle.err === '' ? "" : "error-input"} name="postTitle" onChange={this.onInputValueChange} />
                                {this.state.postTitle.err !== '' && <div className="error-info">{this.state.postTitle.err}</div>}
                            </div>
                            <div className="form-unit">
                                <textarea rows="6" maxLength="1000" placeholder="Enter Description for Post" value={this.state.postDesc.value} className={this.state.postDesc.err === '' ? "" : "error-input"} name="postDesc" onChange={this.onInputValueChange}></textarea>
                                {this.state.postDesc.err !== '' && <div className="error-info">{this.state.postDesc.err}</div>}
                            </div>
                            <div className="form-unit">
                                <input type="text" maxLength="50" placeholder="Enter coma separated keys to tag" value={this.state.tags.value} className={this.state.tags.err === '' ? "" : "error-input"} name="tags" onChange={this.onInputValueChange} />
                                {this.state.tags.err !== '' && <div className="error-info">{this.state.tags.err}</div>}
                            </div>
                            <div className="form-unit">
                                <input type="file" id='attInput' className={this.state.attachments.err === '' ? "" : "error-input"} name="attachments" onChange={this.uploadAttachment} />
                            </div>
                            <div className="attachments">
                                {this.state.attachments.value.map((i, index) => {
                                    switch (i.type) {
                                        case "document":
                                        case "image": {
                                            return (
                                                <div className="attachments-holder" key={index}>
                                                    <span>
                                                        <i onClick={this.deleteAttachment.bind(this, index)} className='fa fa-trash-o'></i>
                                                    </span>
                                                    <object className="fit-layout" style={{ overflow: 'hidden' }} src={i.path}><embed style={{ overflow: 'hidden' }} className="fit-layout" src={i.path}></embed></object>
                                                </div>
                                            )
                                        }
                                        case "video": {
                                            return (
                                                <div className="attachments-holder" key={index}>
                                                    <span>
                                                        <i onClick={this.deleteAttachment.bind(this, index)} className='fa fa-trash-o'></i>
                                                    </span>
                                                    <video className="fit-layout" src={i.path} controls />
                                                </div>
                                            )
                                        }
                                        default: break;
                                    }
                                })}
                            </div>
                        </form>
                        <button type="button" className="btn-general-community" onClick={this.submitPost}>{this.state.mode === 'new' ? "Create Post" : "Edit Post"}</button>
                    </div>
                </Modal>
            </div>
        )
    }
}

const Communities = connect(mapStateToProps)(ConnectedCommunities);
export default Communities;