import React, {useEffect, useState} from 'react';
import { Button } from "react-bootstrap";
import CONSTANTS from '../../commons/Constants';
import './discover-more.scss';
import _ from "lodash";
import $ from "jquery";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { updateCategories } from "../../redux/actions";
import MongoDBInterface from "../../interface/MongoDBInterface";
import { setCollectionList } from "../../redux/actions";

const DiscoverMore = () => {
  const reduxState = useSelector((state) => state, shallowEqual);
  const { categoriesList = [] } = reduxState;
  const dispatch = useDispatch()
  let categoryCopy = [];
  useEffect(() => {
      getCollectionListBasedOntags()
  }, [categoriesList])
  useEffect(() => {
    return () =>{
      let categoryCopy = _.cloneDeep(categoriesList)
      categoryCopy.map( val => val.isSelected = false)
      dispatch(updateCategories(categoryCopy));
    }
}, [])
  const categorySelected = (item,index) => {
    categoryCopy = _.cloneDeep(categoriesList)
    categoryCopy[index].isSelected = !item.isSelected;
    dispatch(updateCategories(categoryCopy));
  }
  const getCollectionListBasedOntags = () => {
    try {
      let postObj = {
        tags: _.filter(categoriesList, function(o) { return o.isSelected; }).map(val => val.value)
      }
      MongoDBInterface.getSignatures(postObj).then(
        (signatures) => {
          let response = _.get(signatures, "data.data");
          let isEmptyPresent = _.find(response, (responseItem) => {
            return _.isEmpty(responseItem.ideaID);
          });
          document.querySelector('.deck').scrollIntoView({
            behavior: 'smooth' 
          });
          dispatch(setCollectionList(response));
        },
        (error) => {
          dispatch(setCollectionList([]));
        }
      );
    } catch (e) {
      console.log(e);
    }
  }

    return (
        <div className="discover-topics-section">
          <div className="card-topics-nav">
                <h4>Discover</h4>
          </div>
          <div className="topics-list">
            <ul>
              {
              categoriesList.map((item,i) => <li>
                <Button
                key={i}
                  className={item.isSelected ? "btn-secondary selected" : "btn-secondary"}
                  bsstyle="primary"

                  onClick={(event) => {
                      categorySelected(item,i)
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