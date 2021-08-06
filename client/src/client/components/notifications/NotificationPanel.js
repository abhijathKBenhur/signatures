import React, { useState } from 'react';
import { ListGroup } from "react-bootstrap";
import CONSTANTS from '../../commons/Constants';
import ViewNotification from '../../modals/viewNotification/view-notification';
import _ from 'lodash';
import './notification.scss'



function getNotificationImage(type){
    let icons = ""
    switch(type){
        case CONSTANTS.NOTIFICATION_ACTIONS.PERSONAL_MESSAGE:
            icons = "fa fa-envelope-o"
        break;
    }
    return icons
}


const NotificationPanel = (props) => {
    console.log('props = ', props);

    const [notificationState, setNotificationState] =  useState({
        viewNotification: false,
        selectedNotification: {}
    })
    const viewMessageHandler = (notification) => {
        setNotificationState({
            ...notificationState,
            viewNotification: true,
            selectedNotification: notification
        })
    }
    
    return (
        <ListGroup className="">
        {props.myNotifications.map(notification => {
          return   (
            <div className="notification-item d-flex flex-row align-items-center pb-1" onClick={() => viewMessageHandler(notification)}>
                <div className="icon mr-2 p-1">
                    <i className={getNotificationImage(notification.action)}></i>
                </div>
                <div className="content">
                    <div className="top master-grey">{notification.from}</div>
                    <div className="bottom second-grey">{notification.message}</div>
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