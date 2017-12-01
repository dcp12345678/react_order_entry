import _ from 'lodash';
import React from 'react';
import {Navbar, Nav, NavItem, Modal, Button} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';

class Helper {

  static isNullOrWhitespace(input) {
    return !input || input.trim().length < 1;
  }

  static formatDate(date) {
    const d = new Date(date);
    let month = String(d.getMonth() + 1);
    let day = String(d.getDate());
    const year = d.getFullYear();

    if (month.length < 2) { // eslint-disable-line no-magic-numbers
      month = `0${month}`;
    }
    if (day.length < 2) { // eslint-disable-line no-magic-numbers
      day = `0${day}`;
    }

    return [year, month, day].join('-');
  }

  static setSessionStorageObject(key, value) {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  static getSessionStorageObject(key) {
    const value = sessionStorage.getItem(key);
    return value && JSON.parse(value);
  }

  static removeSessionStorageObject(key) {
    sessionStorage.removeItem(key);
  }

  static buildOptionsForSelectList(optionList, selectedOptionId) {
    const optId = parseInt(selectedOptionId, 10);
    const options = [];
    if (optId === -1) {
      options.push(<option value="-1" selected>--Please Select--</option>);
    } else {
      options.push(<option value="-1">--Please Select--</option>);
    }

    const optionsToAdd = _.map(optionList, (option) => {
      let o;
      if (option.id === optId) {
        o = (<option value={option.id} selected>{option.name}</option>);
      } else {
        o = (<option value={option.id}>{option.name}</option>);
      }
      return o;
    });
    options.push(...optionsToAdd);

    return options;
  }

  static buildNavBar(navItems) {
    debugger;
    const buildItem = (item, index) => {
      switch (item) {
        case 'newOrder':
          return (
            <LinkContainer to="/editOrder/-1">
              <NavItem eventKey={index}>New Order</NavItem>
            </LinkContainer>
          );
        case 'searchOrders':
          return (
            <LinkContainer to="/searchOrders">
              <NavItem eventKey={index}>Search Orders</NavItem>
            </LinkContainer>
          );
        case 'logout':
          return (
            <LinkContainer to="/logout">
              <NavItem eventKey={index}>Logout</NavItem>
            </LinkContainer>
          );
        default:
          return null;
      }
    };

    const mappedNavItems = _.map(navItems, (item, index) => buildItem(item, index));

    const ret = (
      <Navbar>
        <Nav>
          {mappedNavItems}
        </Nav>
      </Navbar>
    );

    return ret;
  }

  static showError(close, title, body) {
    return (
      <Modal show onHide={close}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>{body}</h4>
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle="danger" bsSize="small" onClick={close}>OK</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default Helper;
