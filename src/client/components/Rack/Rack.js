import React from 'react';
import { Card, CardDeck, Image } from "react-bootstrap";
import { useHistory } from 'react-router-dom';
import {  Feather, User } from 'react-feather';
import "./Rack.scss";
const Rack = (props) => {
    let history = useHistory();
    function openCardView(tokenId,owner){
        history.push('/card/'+ tokenId +'?owner='+ owner)
    }

    return (
        <div  className="mt-4">
            <h3 className="rackTitle">{props.category}</h3>
            <hr></hr>
            <CardDeck className="cardDeck">
                {props.cards.map((signature,index) => {
                    return (
                    <Card key={index} className="tokenCard" onClick={() =>{
                         openCardView(signature.tokenId, signature.owner)
                    }}>
                        <Card.Img className="tokenCardImage" variant="top" src={window.location.origin+signature.uri} />
                        <Card.Body className="rack-card-body">
                            <div className="d-flex justify-content-between">
                                <Card.Title>{signature.name}</Card.Title>
                            </div>
                           
                            <div className="d-flex justify-content-between">
                                <Card.Text  className="d-flex align-items-center">
                                    {signature.owner}
                                    <Feather size={15} className="ml-2"></Feather>
                                </Card.Text>
                            </div>
                            
                        </Card.Body>
                        <Card.Footer className="rack-card-footer d-flex justify-content-between">
                            {/* <small className="text-muted">{signature.supply} In supply</small> */}
                            <small className="text-muted">{signature.price} ETH</small>
                            <small className="text-muted">{signature.amount} Left</small>
                        </Card.Footer>
                    </Card>
                )})}
                
                </CardDeck>
        </div>
    );
};
export default Rack;