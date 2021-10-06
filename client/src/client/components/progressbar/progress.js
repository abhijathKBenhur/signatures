import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import React, { useEffect, useState } from "react";
import './progress.scss'

const ProgressBar = (props) => {
    return (
        <>
            <div className={`progress-bar ${(props && props.class) ? props.class : ''}`}>
                <span className="bar">
                    <span className="progress"></span>
                </span>
            </div>
        </>
    )
}
export default ProgressBar;