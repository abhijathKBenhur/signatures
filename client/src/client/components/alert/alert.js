import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import React, { useEffect, useState } from "react";
import './alert.scss'

const AlertBanner = ({isDismissible = true, variant="success", heading, content, extraContent, actionText = "View", actionFunction}) => {
    const [show, setShow] = useState(true);
  
    return (
        <>
            {show && <Alert className="special-alert" onClose={() => setShow(false)}  variant={variant} dismissible={isDismissible}>
                {heading && <Alert.Heading> {heading} </Alert.Heading>}
                {content && <p> 
                    {content} 
                    {actionFunction &&  <Alert.Link  onClick={actionFunction}> {actionText} </Alert.Link> }
                </p>}
                {extraContent && <hr />}
                {extraContent && <p className="mb-0"> {extraContent} </p>}
            </Alert>}
        </>
    )
}
export default AlertBanner;