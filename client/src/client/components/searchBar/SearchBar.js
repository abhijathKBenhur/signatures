import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import "./SearchBar.scss";
import { Tag } from "react-feather";
import _ from "lodash";
import MongoDBInterface from "../../interface/MongoDBInterface";
import CONSTANTS from "../../commons/Constants";
import { setCollectionList } from "../../redux/actions";
function Search() {
  const reduxState = useSelector((state) => state, shallowEqual);
  const dispatch = useDispatch();
  const wrapperRef = useRef(null);
  const [tags, setTags] = useState([...CONSTANTS.CATEGORIES]);
  const tagsCopy = [...tags];
  const [searchText, setSearchText] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  useEffect(() => {
    function handleClickOutside(event) {
      console.log(event.target.id);
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target) &&
        event.target.id !== "search-box"
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  useEffect(() => {
    const { metamaskID = undefined } = reduxState;
    let postObj = { userName: metamaskID, searchString: searchText };
    let selectedTags = tags.filter((val) => val.isSelected);
    if (selectedTags.length)
      postObj.tags = selectedTags.map((item) => item.value);
    try {
      MongoDBInterface.getSignatures(postObj).then(
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
  }, [searchText, tags]);
  const search = (event) => {
    if (event) setSearchText(event.target.value);
  };

  const setTagsList = (item, key) => {
    tagsCopy[key].isSelected = !item.isSelected;
    setTags([...tagsCopy]);
  };
  return (
    <div className="search-bar-container">
      <div className="search-dropdown-container">
        <input
          type="text"
          onKeyUp={search}
          id="search-box"
          autoComplete="off"
          className="search-box"
          placeholder="Search Collections"
          
        />
        <Tag className="search-tag" color="#56288c" size={20} onClick={(event) => {
            event.stopPropagation();
            setShowDropdown(!showDropdown);
          }}></Tag>
        {/* <div className="tags-pills">
          {tags
            .filter((item) => item.isSelected)
            .map((item) => (
              <span>{item.value}</span>
            ))}
        </div> */}
        {showDropdown && (
          <ul className="dropdown" ref={wrapperRef}>
            {tags.map((item, key) => (
              <li
                className={item.isSelected ? "selected" : ""}
                onClick={(event) => {
                  setTagsList(item, key);
                }}
              >
                {item.value}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Search;
