import React from 'react';
import { connect } from 'react-redux';
import './Messenger.css';
import { getCall, postCall } from '../../../utils/api.config';
import { GET_ALL_USERS, docMaxSize, videoMaxSize, imgMaxSize, CREATE_CONVERSATION, GET_CHAT_MSG, FILE_UPLOAD, ADD_MESSAGE, GET_CONVERSATIONS, DUMMY_PIC } from '../../../utils/constants';
import Radio from '../../shared/Radio';
import moment from 'moment';
import ChatLoader from '../../shared/ChatLoader';
import { toast } from 'react-toastify';

const mapStateToProps = state => {
  return state
};

class ConnectedMessenger extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      responseText: { value: '', err: '' },
      responseAttach: {},
      account: "individual",
      contactList: [],
      convoListOriginal: [],
      msgPage: 1,
      currReceiver: { profile_pic: '', userId: '', username: '' },
      currSender: { profile_pic: '', userId: '', username: '' },
      convoListFiltered: [],
      currentChat: {},
      chatLoading: false,
      displayMessage: false,
      isMobile: window.innerWidth < 581,
      newConvoUserFound: false,
      newConvoUserId: ""
    }
  }
  componentDidMount() {
    this.setState({ chatLoading: true })
    getCall(GET_CONVERSATIONS, {}, { sfn: this.afterGettingConversations, efn: () => toast.error("Server failed to respond. Please try again later.") })
  }
  afterGettingConversations = (data) => {
    this.setState({ convoListFiltered: data.conversations, convoListOriginal: data.conversations, chatLoading: false })
    setTimeout(() => {
      if (this.state.convoListOriginal.length) {
        if (this.state.isMobile) {
          Array.from(document.getElementById('conversationList').children)
        }
        else {
          Array.from(document.getElementById('conversationList').children) && Array.from(document.getElementById('conversationList').children)[0].click()
        }
      }
    }, 1000)

  }
  filterConversations = (e) => {
    this.setState({
      convoListFiltered: this.state.convoListOriginal.filter(i => (
        (i.sender.username.toLowerCase().includes(e.target.value.toLowerCase())) ||
        (i.receiver.username.toLowerCase().includes(e.target.value.toLowerCase())) ||
        (i.message.message.text && i.message.message.text.toLowerCase().includes(e.target.value.toLowerCase()))))
    })
  }
  selectConversation = (e) => {
    if (this.state.isMobile) {
      this.setState({
        displayMessage: true,
        currConvoId: e.currentTarget.id,
        currSender: this.state.convoListOriginal.find(i => i._id === e.currentTarget.id).sender,
        currReceiver: this.state.convoListOriginal.find(i => i._id === e.currentTarget.id).receiver,
        currentChat: [],
        chatLoading: true
      })
      getCall(GET_CHAT_MSG, { params: { conversationId: e.currentTarget.id, page: 1 } }, { sfn: this.messagesFetched, efn: () => toast.error("Server failed to respond. Please try again later.") })
    }
    else {
      let elems = Array.from(document.getElementById('conversationList').children)
      elems.forEach((el) => {
        el.classList.remove("selected-chat");
      });
      e.currentTarget.classList.add("selected-chat")
      this.setState({
        currConvoId: e.currentTarget.id,
        currSender: this.state.convoListOriginal.find(i => i._id === e.currentTarget.id).sender,
        currReceiver: this.state.convoListOriginal.find(i => i._id === e.currentTarget.id).receiver,
        currentChat: [],
        chatLoading: true
      })
      getCall(GET_CHAT_MSG, { params: { conversationId: e.currentTarget.id, page: 1 } }, { sfn: this.messagesFetched, efn: () => toast.error("Server failed to respond. Please try again later.") })
    }
  }
  messagesFetched = (data) => {
    this.setState({
      currentChat: data.msg,
      chatLoading: false
    })
    let objDiv = document.getElementById('chat-sec-window');
    objDiv.scrollTop = objDiv.scrollHeight;
  }
  getOldMessages = () => {
    let objDiv = document.getElementById('chat-sec-window');
    if (objDiv.scrollTop === 0) {
      this.setState({ msgPage: this.state.msgPage + 1, chatLoading: true }, () =>
        getCall(GET_CHAT_MSG, { params: { conversationId: this.state.currConvoId, page: this.state.msgPage } }, { sfn: this.oldMessagesFetched, efn: () => toast.error("Server failed to respond. Please try again later.") })
      )
    }
  }
  oldMessagesFetched = (data) => {
    let currentChat = this.state.currentChat
    let datamsg = data.msg
    let finalChat = {}
    if ((Object.keys(currentChat)[0]) === (Object.keys(datamsg)[Object.keys(datamsg).length - 1])) {
      currentChat[Object.keys(currentChat)[0]] = datamsg[Object.keys(datamsg)[Object.keys(datamsg).length - 1]].concat(currentChat[Object.keys(currentChat)[0]])
    }
    finalChat = { ...datamsg, ...currentChat }
    setTimeout(() => {
      this.setState({ currentChat: finalChat, chatLoading: false })
    }, 100)
  }
  searchUser = (e) => {
    if (e.target.value.length >= 3) {
      let searchText = e.target.value
      getCall(GET_ALL_USERS, { params: { searchText: searchText, accounType: this.state.account } }, { sfn: this.gotTheUsers, efn: this.dintGetUsers })
    } else if (e.target.value.length < 3) {
      this.setState({ contactList: [] })
    }
  }
  gotTheUsers = (data) => {
    this.setState({ contactList: data.users || [] })
  }
  dintGetUsers = () => {
    toast.error("Server failed to respond. Please try again later.")
  }
  startConversation = (receiver) => {
    let { profile_pic, first_name, last_name, id, account_type, name, logo } = this.props.basicInfo
    let payload = {
      senderId: id,
      senderName: account_type === 'individual' ? first_name + ' ' + last_name : name,
      senderImage: account_type === 'individual' ? profile_pic : logo || DUMMY_PIC,
      receiverId: receiver.id,
      receiverName: receiver.name,
      receiverImage: receiver.profile_pic || DUMMY_PIC
    }
    this.setState({ currSender: { profile_pic: account_type === 'individual' ? profile_pic : logo, userId: id, username: account_type === 'individual' ? first_name + ' ' + last_name : name } })
    this.state.convoListFiltered.map(i => {
      if (i.receiver.userId === payload.receiverId) {
        this.setState({ newConvoUserFound: true, newConvoUserId: i._id })
      }
    }
    )
    setTimeout(() => {
      if (this.state.newConvoUserFound) {
        this.conversationFound.call()
        this.setState({ contactList: [], searchUser: false })
      }
      else {
        postCall(CREATE_CONVERSATION, payload, { sfn: this.conversationCreated, efn: () => toast.error("Server failed to respond. Please try again later.") })
      }
    }, 100)
  }
  conversationFound = () => {
    document.getElementById(this.state.newConvoUserId).click()
    this.setState({ newConvoUserFound: false, newConvoUserId: '' })
  }
  conversationCreated = (data) => {
    this.setState({ contactList: [], searchUser: false })
    let currConvo = this.state.convoListOriginal
    currConvo.splice(0, 0, data.conversation)
    this.setState({ convoListOriginal: currConvo, convoListFiltered: currConvo })
    document.getElementById(data.conversation._id).click()
  }
  uploadAttachment = (input) => {
    if (input.target.files && input.target.files[0]) {
      let attachType = input.target.files[0].type.split('/')[0]
      if ((attachType === 'application' || attachType === 'document') && input.target.files[0].size > docMaxSize) {
        toast.error('File size is too large to be sent')
        return false
      } else if (attachType === 'video' && input.target.files[0].size > videoMaxSize) {
        toast.error('File size is too large to be sent')
        return false
      } else if (attachType === 'image' && input.target.files[0].size > imgMaxSize) {
        toast.error('File size is too large to be sent')
        return false
      } else {
        const formData = new FormData()
        formData.append('file', input.target.files[0])
        document.getElementById('file-input').value = ''
        postCall(FILE_UPLOAD, formData, { sfn: this.postuploadAttachment, efn: () => toast.error("Server failed to respond. Please try again later.") }, 'allAttachments')
      }
    }
  }
  postuploadAttachment = (data) => {
    let payload = {
      conversationId: this.state.currConvoId,
      message: {
        text: null,
        owner: this.props.basicInfo.id,
        attachments: { path: data.fileUrl, _type: data.type },
        messageType: data.type,
        timeStamp: moment().format()
      }
    }
    postCall(ADD_MESSAGE, payload, { sfn: this.messageSubmitted, efn: () => toast.error("Server failed to respond. Please try again later.") })
  }
  submitResponse = () => {
    let payload = {
      conversationId: this.state.currConvoId,
      message: {
        text: this.state.responseText.value.trim(),
        owner: this.props.basicInfo.id,
        attachments: null,
        messageType: "text",
        timeStamp: moment().format()
      }
    }
    postCall(ADD_MESSAGE, payload, { sfn: this.messageSubmitted, efn: () => toast.error("Server failed to respond. Please try again later.") })
  }
  messageSubmitted = (data) => {
    let today = moment().format('MM/DD/YYYY')
    if (!this.state.currentChat[today]) {
      this.setState({
        currentChat: { ...{ ...this.state.currentChat, [today]: [] } }
      })
    }
    setTimeout(() => {
      this.setState({
        currentChat: { ...{ ...this.state.currentChat, [today]: [...this.state.currentChat[today], data.msg] } },
        responseText: { value: '', err: '' }
      })
      let objDiv = document.getElementById('chat-sec-window');
      objDiv.scrollTop = objDiv.scrollHeight;
    }, 100)
  }
  updateResponse = (e) => {
    this.setState({ responseText: { value: e.target.value, err: '' } })
  }
  render() {
    let dates = Object.keys(this.state.currentChat)
    return (
      <div id="Messenger">
        {this.state.isMobile ?
          <div>
            <div className="user-list" style={{ display: this.state.displayMessage ? 'none' : '', width: '100%', borderRight: 'none' }}>
              <div className="head-sec">
                <strong>Conversations</strong>
                <div style={{ position: 'relative' }}>
                  {this.props.basicInfo.account_type === "individual" && <div className="radio-holders">
                    <Radio name="account" content="All" value="all" selected={this.state.account === 'all'} onChange={() => this.setState({ account: 'all', contactList: [] }, () => document.getElementById('allUserSearch').value = '')} />
                    <Radio name="account" content="Individual" value="individual" selected={this.state.account === 'individual'} onChange={() => this.setState({ account: 'individual', contactList: [] }, () => document.getElementById('allUserSearch').value = '')} />
                    <Radio name="account" content="Corporate" value="corporate" selected={this.state.account === 'corporate'} onChange={() => this.setState({ account: 'corporate', contactList: [] }, () => document.getElementById('allUserSearch').value = '')} />
                  </div>}
                  <input id="allUserSearch" type="text" defaultValue="" onChange={this.searchUser} style={{ borderRadius: 0 }} className="general-input" placeholder="Who would you like to contact?" />
                  {this.state.contactList.length ?
                    <div className="users-list">
                      {this.state.contactList.map(i => (
                        <div key={i.id} onClick={this.startConversation.bind(this, i)}>
                          <span><img className="rounded searching-user" src={i.profile_pic} alt="" /> {i.name}</span>
                        </div>
                      ))}
                    </div> : null}
                </div>
              </div>
              <div className="ser-sec">
                <input type="text" placeholder='Search contacts or messages' onChange={this.filterConversations} />
              </div>
              <ul id='conversationList'>
                {this.state.convoListFiltered.map((i) =>
                  <li onClick={this.selectConversation} key={i._id} id={i._id}>
                    {i.message && <span className="timestamp">{moment(i.message.message.createdOn).format('MMMM Do YYYY, h:mm:ss a')}</span>}
                    <table className="user-item">
                      <tbody>
                        <tr>
                          <td className="image-holder"><img src={i.sender.userId === this.props.basicInfo.id ? i.receiver.profile_pic : i.sender.profile_pic || DUMMY_PIC} className="rounded chat-image" alt="" /></td>
                          <td className="name-holder">
                            <p><strong>{i.sender.userId === this.props.basicInfo.id ? i.receiver.username : i.sender.username}</strong></p>
                            <p className="message">{i.message ? <span>{i.message.message.text || <span><span className="fa fa-paperclip"></span><span></span> {i.message.message.attachments.path ? i.message.message.attachments.path.split('/')[4] : 'Attachment'}</span> || ' '}</span> : <span>No conversations yet..</span>}</p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </li>
                )}
              </ul>
            </div>
            {this.state.convoListFiltered.length ?
              <div className="user-chat" style={{ display: this.state.displayMessage ? '' : 'none', width: '100%' }}>
                <span className="fa fa-arrow-left" style={{ cursor: "pointer" }} onClick={() => this.setState({ displayMessage: false })}></span>
                <div className="chatbox-head">
                  <img src={this.state.currReceiver.userId === this.props.basicInfo.id ? this.state.currSender.profile_pic : this.state.currReceiver.profile_pic} className="fit-layout rounded" alt="" />
                  <span className="chat-main-name">{this.state.currReceiver.userId === this.props.basicInfo.id ? this.state.currSender.username : this.state.currReceiver.username}</span>
                  <span className="chat-main-role">{this.state.currReceiver.userId === this.props.basicInfo.id ? this.state.currSender.subname : this.state.currReceiver.subname}</span>
                </div>
                <hr />
                <div className='chat-sec' id="chat-sec-window" onScroll={this.getOldMessages}>
                  {this.state.chatLoading && <ChatLoader />}
                  {dates.map(i =>
                    <div key={i}>
                      <div className="text-center date-partition"><span>{i}</span></div>
                      {this.state.currentChat[i].map(i =>
                        (i.message.owner === this.props.basicInfo.id ?
                          <div style={{ marginBottom: '8px', textAlign: 'right' }} key={i._id}>
                            <span className="msg-time left">{moment(i.message.createdOn).format('h:mm a')}</span> {i.message.messageType === 'text' ? i.message.text : i.message.attachments && i.message.attachments._type && i.message.attachments.path && (i.message.attachments._type === 'video' ? <div><video controls width={window.innerWidth < 428 ? 100 : 250} src={i.message.attachments.path} /></div> : i.message.attachments._type === "image" ? <div><img src={i.message.attachments.path} width={window.innerWidth < 428 ? 100 : 250} alt="" /></div> : <a href={i.message.attachments.path} target="_blank" rel="noopener noreferrer">{i.message.attachments.path.split('/')[4]}</a>)}
                            <img src={this.state.currReceiver.userId === i.message.owner ? this.state.currReceiver.profile_pic : this.state.currSender.profile_pic} className="rounded inchat left" alt="" />
                          </div>
                          :
                          <div style={{ marginBottom: '8px' }} key={i._id}>
                            <img src={this.state.currReceiver.userId === i.message.owner ? this.state.currReceiver.profile_pic : this.state.currSender.profile_pic} className="rounded inchat right" alt="" />
                            {i.message.messageType === 'text' ? i.message.text : i.message.attachments && i.message.attachments._type && i.message.attachments.path && (i.message.attachments._type === 'video' ? <div><video controls width={window.innerWidth < 428 ? 100 : 250} src={i.message.attachments.path} /></div> : i.message.attachments._type === "image" ? <div><img src={i.message.attachments.path} width={window.innerWidth < 428 ? 100 : 250} alt="" /></div> : <a href={i.message.attachments.path} target="_blank" rel="noopener noreferrer">{i.message.attachments.path.split('/')[4]}</a>)} <span className="msg-time right">{moment(i.message.createdOn).format('h:mm a')}</span>
                          </div>)
                      )}
                    </div>
                  )}
                </div>
                <div className='input-holder'>
                  <textarea type="text" rows='3' className="general-input" placeholder="Write a message.." onChange={this.updateResponse} value={this.state.responseText.value} />
                  <button disabled={this.state.responseText.value.length === 0} type="button" className="btn-chat-send" style={{ right: window.innerWidth < 387 ? '50px' : '75px' }} onClick={this.submitResponse}><i className="fa fa-paper-plane"></i></button>
                  <button type="button" className="btn-chat-send">
                    <div className="clip-upload">
                      <label htmlFor="file-input">
                        <i className="fa fa-paperclip" aria-hidden="true"></i>
                      </label>
                      <input type="file" name="file-input" id="file-input" style={{ display: 'none' }} onChange={this.uploadAttachment} />
                    </div>
                  </button>
                </div>
              </div> : null}
          </div>
          :
          <div>
            <div className="user-list">
              <div className="head-sec">
                <strong>Conversations</strong>
                <div style={{ position: 'relative' }}>
                  {this.props.basicInfo.account_type === "individual" && <div className="radio-holders">
                    <Radio name="account" content="All" value="all" selected={this.state.account === 'all'} onChange={() => this.setState({ account: 'all', contactList: [] }, () => document.getElementById('allUserSearch').value = '')} />
                    <Radio name="account" content="Individual" value="individual" selected={this.state.account === 'individual'} onChange={() => this.setState({ account: 'individual', contactList: [] }, () => document.getElementById('allUserSearch').value = '')} />
                    <Radio name="account" content="Corporate" value="corporate" selected={this.state.account === 'corporate'} onChange={() => this.setState({ account: 'corporate', contactList: [] }, () => document.getElementById('allUserSearch').value = '')} />
                  </div>}
                  <input id="allUserSearch" type="text" defaultValue="" onChange={this.searchUser} style={{ borderRadius: 0 }} className="general-input" placeholder="Who would you like to contact?" />
                  {this.state.contactList.length ?
                    <div className="users-list">
                      {this.state.contactList.map(i => (
                        <div key={i.id} onClick={this.startConversation.bind(this, i)}>
                          <span><img className="rounded searching-user" src={i.profile_pic} alt="" /> {i.name}</span>
                        </div>
                      ))}
                    </div> : null}
                </div>
              </div>
              <div className="ser-sec">
                <input type="text" placeholder='Search for contacts below' onChange={this.filterConversations} />
              </div>
              <ul id='conversationList'>
                {this.state.convoListFiltered.map((i) =>
                  <li onClick={this.selectConversation} key={i._id} id={i._id}>
                    {i.message && <span className="timestamp">{moment(i.message.message.createdOn).format('MMMM Do YYYY, h:mm:ss a')}</span>}
                    <table className="user-item">
                      <tbody>
                        <tr>
                          <td className="image-holder"><img src={i.sender.userId === this.props.basicInfo.id ? i.receiver.profile_pic : i.sender.profile_pic || DUMMY_PIC} className="rounded chat-image" alt="" /></td>
                          <td className="name-holder">
                            <p><strong>{i.sender.userId === this.props.basicInfo.id ? i.receiver.username : i.sender.username}</strong></p>
                            <p className="message">{i.message ? <span>{i.message.message.text || <span><span className="fa fa-paperclip"></span><span></span> {i.message.message.attachments && i.message.message.attachments.path ? i.message.message.attachments.path.split('/')[4] : 'Attachment'}</span> || ' '}</span> : <span>No conversations yet..</span>}</p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </li>
                )}
              </ul>
            </div>
            {this.state.convoListFiltered.length ?
              <div className="user-chat">
                <div className="chatbox-head">
                  <img src={this.state.currReceiver.userId === this.props.basicInfo.id ? this.state.currSender.profile_pic : this.state.currReceiver.profile_pic} className="fit-layout rounded" alt="" />
                  <span className="chat-main-name">{this.state.currReceiver.userId === this.props.basicInfo.id ? this.state.currSender.username : this.state.currReceiver.username}</span>
                  <span className="chat-main-role">{this.state.currReceiver.userId === this.props.basicInfo.id ? this.state.currSender.subname : this.state.currReceiver.subname}</span>
                </div>
                <hr />
                <div className='chat-sec' id="chat-sec-window" onScroll={this.getOldMessages}>
                  {this.state.chatLoading && <ChatLoader />}
                  {dates.map(i =>
                    <div key={i}>
                      <div className="text-center date-partition"><span>{i}</span></div>
                      {this.state.currentChat[i].map(i =>
                        (i.message.owner === this.props.basicInfo.id ?
                          <div style={{ marginBottom: '8px', textAlign: 'right' }} key={i._id}>
                            <span className="msg-time left">{moment(i.message.createdOn).format('h:mm a')}</span> {i.message.messageType === 'text' ? i.message.text : i.message.attachments && i.message.attachments._type && i.message.attachments.path && (i.message.attachments._type === 'video' ? <div><video controls width={window.innerWidth < 428 ? 100 : 250} src={i.message.attachments.path} /></div> : i.message.attachments._type === "image" ? <div><img src={i.message.attachments.path} width={window.innerWidth < 428 ? 100 : 250} alt="" /></div> : <a href={i.message.attachments.path} target="_blank" rel="noopener noreferrer">{i.message.attachments.path.split('/')[4]}</a>)}
                            <img src={this.state.currReceiver.userId === i.message.owner ? this.state.currReceiver.profile_pic : this.state.currSender.profile_pic} className="rounded inchat left" alt="" />
                          </div>
                          :
                          <div style={{ marginBottom: '8px' }} key={i._id}>
                            <img src={this.state.currReceiver.userId === i.message.owner ? this.state.currReceiver.profile_pic : this.state.currSender.profile_pic} className="rounded inchat right" alt="" />
                            {i.message.messageType === 'text' ? i.message.text : i.message.attachments && i.message.attachments._type && i.message.attachments.path && (i.message.attachments._type === 'video' ? <div><video controls width={window.innerWidth < 428 ? 100 : 250} src={i.message.attachments.path} /></div> : i.message.attachments._type === "image" ? <div><img src={i.message.attachments.path} width={window.innerWidth < 428 ? 100 : 250} alt="" /></div> : <a href={i.message.attachments.path} target="_blank" rel="noopener noreferrer">{i.message.attachments.path.split('/')[4]}</a>)} <span className="msg-time right">{moment(i.message.createdOn).format('h:mm a')}</span>
                          </div>)
                      )}
                    </div>
                  )}
                </div>
                <div className='input-holder'>
                  <textarea type="text" rows='3' className="general-input" placeholder="Write a message.." onChange={this.updateResponse} value={this.state.responseText.value} />
                  <button disabled={this.state.responseText.value.length === 0} type="button" className="btn-chat-send" style={{ right: '75px' }} onClick={this.submitResponse}><i className="fa fa-paper-plane"></i></button>
                  <button type="button" className="btn-chat-send">
                    <div className="clip-upload">
                      <label htmlFor="file-input">
                        <i className="fa fa-paperclip" aria-hidden="true"></i>
                      </label>
                      <input type="file" name="file-input" id="file-input" style={{ display: 'none' }} onChange={this.uploadAttachment} />
                    </div>
                  </button>
                </div>
              </div> : null}
          </div>
        }
      </div>
    )
  }
}

const Messenger = connect(mapStateToProps)(ConnectedMessenger);
export default Messenger;