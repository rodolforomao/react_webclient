import ReactDOM from 'react-dom';
import React, { Component } from 'react'
import { w3cwebsocket as W3CWebSocket} from "websocket";
import { Card, Avatar, Input, Typography } from 'antd';
import 'antd/dist/antd.css';
import './index.css'

const { Search } = Input;
const { Text } = Typography;

const client = new W3CWebSocket('ws://127.0.0.1:8000');

export default class App extends Component {

  state = {
    userName: '',
    isLoggedIn: false,
    messages: []
  };

  onButtonClicked = (value) => {
    client.send(
      JSON.stringify({
        type: "message",
        msg: value,
        user: this.state.userName
      })
    );
  }
  componentDidMount()
  {
    client.onopen = () => {
      console.log('WebSocket Client Connected');
    };
    client.onmessage = (message) =>{
      const dataFromServer = JSON.parse(message.data);
      console.log('got reply!', dataFromServer);
      if(dataFromServer.type === "message")
      {
        this.setState((state) =>
          ({
            messages: [ ...state.messages,
              {
                msg: dataFromServer.msg,
                user: dataFromServer.user
              }]
          })
        );
      }
    };
  }

  render() {
    return (
      <div className='main'>
        {
          this.state.isLoggedIn ?
            <div>
              <div className='title'>
                <Text type="secondary" style={{ fontSize: '36px'}}>WebSocket</Text>
              </div>
              <div className='bottom'>
                <Search 
                  placeholder='input message and send'
                  enterButton='Send'
                  value={this.state.searchVal}
                  size='Large'
                  onChange={(e) => this.setState({ searchVal: e.target.value})}
                  onSearch={value => this.onButtonClicked(value)}
                />

                
              </div>
            </div>
            :
            <div style={{ padding: '200px 40px'}}>
              <Search 
                placeholder='Enter Username'
                enterButton='Login'
                size='large'
                onSearch={value => this.setState({ isLoggedIn: true, userName: value})}
              />
            </div>
        }
      </div>
    )
  }
}

ReactDOM.render((<App />), 
  document.getElementById('root'));