import React from "react";
import PropTypes from "prop-types";
import "./confirmation.scss";
import { Modal, Button } from "react-bootstrap";
import { Card, Row, Col, Form, InputGroup } from "react-bootstrap";
import { confirmable, createConfirmation } from "react-confirm";
import _ from "lodash";

class Confirmation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: 0,
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    var stateObject = function() {
      let returnObj = {};
      returnObj[this.target.name] = this.target.value;
      return returnObj;
    }.bind(event)();
    this.setState(stateObject);
  }

  render() {
    const {
      proceedLabel,
      cancelLabel,
      title,
      confirmation,
      showInput,
      showText,
      show,
      proceed,
      enableEscape = true,
    } = this.props;
    return (
      <div className="static-modal">
        <Modal
          dialogClassName="confirmationModal"
          show={show}
          onHide={() => proceed({ proceed: false })}
          backdrop={enableEscape ? true : "static"}
          keyboard={enableEscape}
        >
          <Modal.Header>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              {!_.isEmpty(showInput) ? (
                  <InputGroup className="mb-3">
                    <Form.Control
                      type="number"
                      placeholder={showInput}
                      min={1}
                      name="input"
                      onChange={this.handleChange}
                    />
                  </InputGroup>
              ) : (
                <div></div>
              )}
              {!_.isEmpty(showText) ? (
                  <InputGroup className="mb-3">
                    <Form.Control
                      type="text"
                      placeholder={showText}
                      min={1}
                      name="text"
                      onChange={this.handleChange}
                    />
                  </InputGroup>
              ) : (
                <div></div>
              )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="dark"
              onClick={() =>
                proceed({ proceed: false })
              }
            >
              {cancelLabel}
            </Button>
            <Button
              variant="primary"
              className="button-l"
              bsstyle="primary"
              onClick={() =>
                proceed({ proceed: true, input: this.state.input, text:this.state.text })
              }
            >
              {proceedLabel}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

Confirmation.propTypes = {
  okLabbel: PropTypes.string,
  cancelLabel: PropTypes.string,
  title: PropTypes.string,
  confirmation: PropTypes.string,
  show: PropTypes.bool,
  proceed: PropTypes.func, // called when ok button is clicked.
  enableEscape: PropTypes.bool,
};

export function confirm(
  confirmation,
  title,
  proceedLabel = "OK",
  cancelLabel = "cancel",
  showInput,
  showText
) {
  return createConfirmation(confirmable(Confirmation))({
    confirmation,
    title,
    proceedLabel,
    cancelLabel,
    showInput,
    showText,
  });
}
