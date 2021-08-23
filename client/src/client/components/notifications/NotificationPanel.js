import React, { useState } from 'react';
import { ListGroup } from "react-bootstrap";
import CONSTANTS from '../../commons/Constants';
import ViewNotification from '../../modals/viewNotification/view-notification';
import {getInitialSubString} from "../../commons/common.utils"
import _ from 'lodash';
import './notification.scss'
import NotificationInterface from '../../interface/NotificationInterface';

import { useHistory } from "react-router-dom";

function getNotificationImage(type){

    let icons = ""
    switch(type){
        case CONSTANTS.ACTIONS.PERSONAL_MESSAGE:
            icons = "fa fa-envelope-o"
        break;
        case CONSTANTS.ACTIONS.FOLLOW:
            icons = "fa fa-user-plus"
        break;
        case CONSTANTS.ACTIONS.UPVOTE:
            icons = "fa fa-thumbs-up"
        break;
        case CONSTANTS.ACTIONS.COMMENT:
            icons = "fa fa-commenting-o"
        break;
        case CONSTANTS.ACTIONS.CREATE_CLAN:
            icons = "fa fa-users"
        break;
        default:
        icons = "fa fa-bell"
        break;
    }
    return icons
}


const NotificationPanel = (props) => {
    console.log('props = ', props);
    let history = useHistory();
    const [notificationState, setNotificationState] =  useState({
        viewNotification: false,
        selectedNotification: {}
    })
    const viewMessageHandler = (notification) => {

        notification.status = CONSTANTS.ACTIONS.COMPLETED
        setNotificationState({
            ...notificationState,
            viewNotification: true,
            selectedNotification: notification
        })
        NotificationInterface.markNotificationAsRead(notification)
    }

    function openNofitication(){

    }
    
    return (
        <ListGroup className="">
        {props.myNotifications.reverse().map(notification => {
          return   (
            <div className={notification.status == "COMPLETED" ? "notification-item d-flex flex-row align-items-center pb-1 pl-1": "notification-item d-flex flex-row align-items-center pb-1 pl-1 unread"} onClick={() => viewMessageHandler(notification)}>
                <div className="icon mr-2 p-1" onClick={() =>{
                    history.push({
                        pathname: "/profile/" + notification.from.userName,
                      });
                }}>
                    <i className={getNotificationImage(notification.action)}></i>
                </div>
                <div className="content" onClick={() =>{
                    openNofitication(notification)
                }}>
                    <div className="top master-grey">{notification.from.userName}</div>
                    <div className="bottom second-grey">{getInitialSubString(notification.message, 25)}</div>
                </div>
            </div>
          )
        })}
        {_.get(notificationState, 'viewNotification')  &&  <ViewNotification notification={_.get(notificationState, 'selectedNotification')} 
         onHide={() => setNotificationState({ ...notificationState, viewNotification: false, selectedNotification: {} })} />}
       
      </ListGroup>
    );
};

export default NotificationPanel;