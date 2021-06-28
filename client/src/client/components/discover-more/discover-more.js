import React from 'react';
import { Button } from "react-bootstrap";
import CONSTANTS from '../../commons/Constants';
import './discover-more.scss';

const DiscoverMore = () => {

    return (
        <div className="discover-topics-section">
          <div className="card-topics-nav">
                <h4>Discover More Topics</h4>
          </div>
          <div className="topics-list">
            <ul>
              {
              CONSTANTS.CATEGORIES.map((item,i) => <li>
                <Button
                key={i}
                  className="btn-secondary"
                  bsstyle="primary"
                  onClick={() => {
                    
                  }}
                >
                   {item.value}
                </Button>
                </li>)
              }
            </ul>
          </div>
          </div>
    )
    
}

export default DiscoverMore;