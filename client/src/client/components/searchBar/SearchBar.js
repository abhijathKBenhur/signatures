import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Modal, Button, Row, Col, Form, InputGroup } from "react-bootstrap";
import "./SearchBar.scss";
import Select from "react-select";
import { Tag } from "react-feather";
import _ from "lodash";
import SignatureInterface from "../../interface/SignatureInterface";
import CONSTANTS from "../../commons/Constants";
function Search(props) {
  const reduxState = useSelector((state) => state, shallowEqual);
  const dispatch = useDispatch();
  const wrapperRef = useRef(null);
  const [tags, setTags] = useState([]);
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
    // let tagsFromBottom = _.filter(categoriesList, function(o) { return o.isSelected; }).map(val => val.value) || [];
    // if (tags.length || tagsFromBottom.length)
    //   postObj.tags = [...tags.map(tag => tag.value), ...tagsFromBottom]
    props.searchTextChanged(CONSTANTS.FILTERS_TYPES.SEARCH,searchText)
  
  }, [searchText, tags]);
  const search = (event) => {
    if (event) setSearchText(event.target.value);
  };

  const handleTagsChange = (selectedtags) => {
    setTags(selectedtags);
  };

  
  return (
    <div className="search-bar-container">
      <div className="search-dropdown-container" ref={wrapperRef}>
        <input
          type="text"
          onKeyUp={search}
          id="search-box"
          autoComplete="off"
          className="search-box"
          placeholder="Search IdeaTribe"
        />
       
        {showDropdown && (
          <Form.Group as={Col} className="dropdown" md="12">
            <Select
              value={tags}
              closeMenuOnSelect={true}
              isMulti
              className="tag-selector"
              options={CONSTANTS.CATEGORIES}
              onChange={handleTagsChange}
              placeholder="Tags*"
            />
          </Form.Group>
        )}
      </div>
    </div>
  );
}

export default Search;
