import React, { Component } from 'react';
import { Container, Row, Col } from "react-bootstrap";
import MongoDBInterface from '../../interface/MongoDBInterface';
import _ from 'lodash'
import Rack from '../../components/Rack/Rack'
import './profile.scss'
import {  User } from 'react-feather';
class profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            myTokens: [],
            userInfo:{},
            loggedUser:localStorage.getItem("userInfo")
        }


    }

    componentWillMount() {
        
        MongoDBInterface.getTokens({userName:this.state.loggedUser}).then(tokens => {
            this.setState({
                myTokens: _.get(tokens,'data.data').filter(card => card.owner == localStorage.getItem("userInfo"))
              })
          })


        MongoDBInterface.getUserInfo({userName:this.state.loggedUser}).then(user => {
            this.setState({
                userInfo: _.get(user,'data.data')
              })
          })
        
    }

   

    render() {
        return (
            <div>
                <Row className="w-100">
                    <div className="userPane">
                        <Row className="userInfo">
                            <Col md="12">
                                {this.state.userInfo.userName}
                            </Col>
                            <Col md="12">
                                {this.state.userInfo.balance} ETH
                            </Col>
                        </Row>
                        <div className="profileHolder">
                            <User size={50}></User>
                        </div>
                    </div>
                </Row>
                
                <Row className="w-100 mt-5">
                    <Rack category={"Collection"} cards={this.state.myTokens} ></Rack>
                </Row>
            </div>
        );
    }
}



export default profile;