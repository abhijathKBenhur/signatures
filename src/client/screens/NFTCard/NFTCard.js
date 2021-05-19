import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Form, Container } from "react-bootstrap";
import MongoDBInterface from '../../interface/MongoDBInterface';
import { confirm } from "../../modals/confirmation/confirmation"
import SocialShare from '../../modals/social-share/socialShare'
import { useParams,useLocation } from "react-router-dom";
import LoginModal from "../../modals/login-modal/loginModal";
import { useHistory } from 'react-router-dom';
import _ from 'lodash'
import { ToastContainer, toast } from 'react-toastify';
import { Share2, ShoppingCart, Feather, User, Edit, DollarSign, Award } from 'react-feather';

import './NFTCard.scss'
import 'react-toastify/dist/ReactToastify.css';

const NFT = (props) => {
    let history = useHistory();
    const [token, setToken] = useState({});
    const [showShareModal, setShowShareModal] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const location = useLocation()
    let referrer  = new URLSearchParams(location.search).get("referrer");
    let owner  = new URLSearchParams(location.search).get("owner");
    

    useEffect(() => {
        console.log("getting toke " + tokenId + "owner: ", owner)
        MongoDBInterface.getTokenById(tokenId,owner).then(token => {
            setToken(_.get(token,'data.data'));
        })
    }, []); // call the method once

    let { tokenId } = useParams();
    
    function copyURL(){
        setShowShareModal(true)
    }

    

    function editPrice(){
        confirm("Set sell price.","Please enter the sell price","Ok","Cancel",true).then(success => {
            if(success.proceed){
                let setter = localStorage.getItem("userInfo")
                MongoDBInterface.updatePrice({setter: setter, price: Number(success.input), tokenId:tokenId}).then(tokenResponse => {
                    window.location.reload();
                })
            }else{

            }
          }) 
    }

     function buyToken() {
         if(_.isEmpty(localStorage.getItem("userInfo"))){
            setShowLoginModal(true)
         }else{
            confirm("This transaction will cost you "+ token.price+" ETH","Are your sure to buy this token","OK","Back").then(success => {
                if(success.proceed){
                    let buyerAccount = localStorage.getItem("userInfo")
                    let seller = token.type == "Licence" ? token.account : token.owner
                    MongoDBInterface.buyToken({buyer: buyerAccount, seller:seller,...token, }).then(tokenResponse => {
                        console.log("tokens transfered")
                        MongoDBInterface.buyUserToken({buyer: buyerAccount,seller,referrer:referrer,..._.get(tokenResponse,'data.data')}).then(success => {
                            console.log("amounts transfered")
                            toast.dark('Token has been added to your collection!', {
                                position: "bottom-right",
                                autoClose: 3000,
                                hideProgressBar: true,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                            });
                            history.push('/home')
                        })
                    })
                }else{
                }
              }) 
         }
    }
    return (
        <Container className="cardView">
               <LoginModal
                show={showLoginModal}
                onHide={() => setShowLoginModal(false)}
                onSubmit={props.submitLoginForm}
                ></LoginModal>
            <SocialShare
                show={showShareModal}
                onHide={() => setShowShareModal(false)}
                ></SocialShare>
            <Row>
                <Col md="3"></Col>
                <Col md="5">
                    <Card className="">
                        <Card.Footer>
                            <div className="d-flex justify-content-between">
                                <small className="text-muted">{token.price} ETH</small>
                                <div>
                                    {
                                        token.type == "Licence" ? 
                                            token.owner != localStorage.getItem("userInfo") ? 
                                            <ShoppingCart onClick={buyToken}></ShoppingCart>
                                            :
                                            <React.Fragment>
                                                <Share2 className="ml-2" onClick={()=> copyURL(true)}></Share2> 
                                            </React.Fragment>
                                        :
                                            token.owner != localStorage.getItem("userInfo") ? 
                                            <ShoppingCart onClick={buyToken}></ShoppingCart>
                                            :
                                            <React.Fragment>
                                                <Edit onClick={editPrice}></Edit>
                                                <Share2 className="ml-2" onClick={()=> copyURL()}></Share2> 
                                            </React.Fragment>
                                    }
                                </div>
                            </div>
                        </Card.Footer>
                        <Card.Img variant="top" src={token.uri} />
                        <Card.Body>
                            <div className="d-flex justify-content-between">
                                <Card.Title>
                                    {token.name} 
                                    {token.type == "Licence" ? 
                                        <Award size={15} color="black"></Award>
                                    :
                                        <DollarSign size={15} color="black"></DollarSign>
                                    }
                                </Card.Title>
                                <Card.Text  className="d-flex align-items-center">
                                    {token.owner}
                                    <Feather size={15} className="ml-2"></Feather>
                                </Card.Text>
                            </div>
                           
                            <div className="d-flex justify-content-between">
                                <Card.Text>
                                    {token.category}
                                </Card.Text>
                                <Card.Text  className="d-flex align-items-center">
                                    {token.account}
                                    <User size={15} className="ml-2"></User>
                                </Card.Text>
                            </div>
                            
                        </Card.Body>
                        <Card.Footer>
                             {token.description}    
                        </Card.Footer>
                    </Card>
                </Col>
                
            </Row>
        </Container>
    );
};

export default NFT;