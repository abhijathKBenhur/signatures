import React from 'react';
import { ListGroup } from "react-bootstrap";
import CONSTANTS from '../../commons/Constants';
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
    return (
        <ListGroup className="">
        {props.myNotifications.map(notification => {
          return   (
            <div className="notification-item d-flex flex-row align-items-center pb-1">
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
      </ListGroup>
    );
};

export default NotificationPanel;