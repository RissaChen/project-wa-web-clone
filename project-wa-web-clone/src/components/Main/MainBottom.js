import React, { Component } from 'react';
import _ from 'lodash';

import SmileyIcon from 'material-ui/svg-icons/social/mood';
import SendIcon from 'material-ui/svg-icons/content/send';

class MainBottom extends Component {
  render() {
    if (_.isEmpty(this.props.currentChatUser)) {
      return (
        <span />
      )
    }
    return (
        <div className="main-bottom-container">

          <div className="main-bottom-smiley-div">
            <SmileyIcon onClick={this.toggleSmiley} style={{ width: 30, height: 30 }} />
          </div>

          <div className="main-bottom-input-div">
            <input className="main-bottom-input" />
          </div>

          <div className="main-bottom-send-div">
            <SendIcon style={{ width: 30, height: 30 }} />
          </div>

        </div>
    )
  }
}

export default MainBottom;

    {this.state.smileyShow ?
      <Picker onSelect={this.addEmojiToMessage}
        style={{ position: 'relative', width: '100%' }} />
      : <span />}
    <div className="smiley">
      <SmileyIcon onClick={this.toggleSmiley} className="pull-left" />
    </div>

