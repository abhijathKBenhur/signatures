import React, {useEffect, useState} from 'react';
import { Button } from "react-bootstrap";
import CONSTANTS from '../../commons/Constants';
import './discover-more.scss';
import _ from "lodash";
import $ from "jquery";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { updateCategories } from "../../redux/actions";
import SignatureInterface from "../../interface/SignatureInterface";
import { setCollectionList } from "../../redux/actions";

const DiscoverMore = () => {
  const reduxState = useSelector((state) => state, shallowEqual);
  const [categoriesList, setCategoriesList] = useState(reduxState.categoriesList);
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
    setCategoriesList(categoryCopy)
    dispatch(updateCategories(categoryCopy));
  }
  const getCollectionListBasedOntags = () => {
    try {
      let postObj = {
        tags: _.filter(categoriesList, function(o) { return o.isSelected; }).map(val => val.value)
      }
      SignatureInterface.getSignatures(postObj).then(
        (signatures) => {
          let response = _.get(signatures, "data.data");
          let isEmptyPresent = _.find(response, (responseItem) => {
            return _.isEmpty(responseItem.ideaID);
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
          <div className="topics-list">
            <ul>
              {
              categoriesList.slice(0,10).map((item,i) => <li key={i}>
                <span
                
                  className={item.isSelected ? "category-name third-header selected mr-2" : "category-name third-header  mr-2"}
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