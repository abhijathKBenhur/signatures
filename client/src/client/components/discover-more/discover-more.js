import React, {useEffect, useState} from 'react';
import { Button } from "react-bootstrap";
import CONSTANTS from '../../commons/Constants';
import './discover-more.scss';
import _ from "lodash";
import $ from "jquery";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import SignatureInterface from "../../interface/SignatureInterface";

const DiscoverMore = (props) => {
  const [selectedCateogory, setSelectedCateogory] = useState("");
  const categorySelected = (item,index) => {
    let targetCateogry = selectedCateogory == item.value?  "" : item.value;
    setSelectedCateogory(targetCateogry)
    props.categorySelected(CONSTANTS.FILTERS_TYPES.CATEGORY_FILTER,targetCateogry)
  }
    return (
        <div className="discover-topics-section">
          <div className="topics-list">
            <ul>
              {
              CONSTANTS.CATEGORIES.slice(0,10).map((item,i) => <li key={i}>
                <span
                
                  className={selectedCateogory == item.value ? "category-name third-header selected mr-2" : "category-name third-header  mr-2"}
                  bsstyle="primary"
                  onClick={(event) => {
                      categorySelected(item,i)
                  }}
                >
                   {item.label}
                </span>
                </li>)
              }
            </ul>
          </div>
          </div>
    )
    
}

export default DiscoverMore;