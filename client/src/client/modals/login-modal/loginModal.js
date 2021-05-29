import React, { Component, useState } from "react";
import { Modal, Button, Row, Col, Form, InputGroup } from "react-bootstrap";
import MongoDBInterface from '../../interface/MongoDBInterface'
import { ToastContainer, toast } from 'react-toastify';
import "./loginModal.scss";
import _ from 'lodash'
class LoginModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      password: "",
      login: true,
      
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleLogin = this.toggleLogin.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.onHide()
    if(this.state.login){
      MongoDBInterface.login(this.state).then(success =>{
        console.log(success)
        let userInfo = _.get(success,'data.data.userName')
        console.log("logged in ", )
        localStorage.setItem("userInfo",userInfo)
        window.location.reload();
      })  
    }else{
      MongoDBInterface.signup(this.state).then(success =>{
        let userInfo = _.get(success,'data.data.userName')
        console.log("signed up ", )
        localStorage.setItem("userInfo",userInfo)
        window.location.reload();
      })
    }
    // toast.dark('Welcome ' + localStorage.getItem("userInfo") +" !", {
    //   position: "bottom-right",
    //   autoClose: 3000,
    //   hideProgressBar: true,
    //   closeOnClick: true,
    //   pauseOnHover: true,
    //   draggable: true,
    //   progress: undefined,
    //   });
    
  }



  handleChange(event) {
    var stateObject = function() {
      let returnObj = {};
      returnObj[this.target.name] = this.target.value;
         return returnObj;
    }.bind(event)();
    this.setState(stateObject)
  }

  toggleLogin(){
    this.setState({
      login: !this.state.login
    })
  }

  render() {
    return (
      <Modal
        {...this.props}
        dialogClassName="modal-40w loginmodal"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {this.state.login?  "Login" : "Sign Up"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate onSubmit={this.handleSubmit}>
            <Form.Row>
              <Form.Group controlId="userName" className="w-100">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" onChange={this.handleChange} name="userName"/>
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group controlId="password" className="w-100">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password"  onChange={this.handleChange} name="password"/>
              </Form.Group>
            </Form.Row>
            {
              this.state.login ? 
                <Form.Text className="text-muted">
                  Don't have an account with us ? <Button className="signUpButton"  onClick={this.toggleLogin} variant="link">Sign up</Button> here.
                </Form.Text>  
               : 
               <Form.Text className="text-muted">
                 Already have an account with us ? <Button className="signUpButton"  onClick={this.toggleLogin} variant="link">Sign in</Button> here.
              </Form.Text>  
            }
            
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" value="Submit" onClick={this.handleSubmit} className="w-100">
          {this.state.login?  "Login" : "Sign Up"}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default LoginModal;
