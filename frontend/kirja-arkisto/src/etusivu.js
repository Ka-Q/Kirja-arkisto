import { useState, useEffect } from "react";
import './style.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from "react-bootstrap/esm/Button";
import 'bootstrap/dist/css/bootstrap.min.css'

function Etusivu () {


    return (
        <div className="wrapper">
            <Navbar bg="light" expand="lg" className="item-nav">
        <Container>
          <Navbar.Brand href="#home">Kirja-arkisto</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#home">Home</Nav.Link>
              <Nav.Link href="#link">Link</Nav.Link>
              <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">
                  Another action
                </NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">
                  Separated link
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
            <div className="item-leftside">
                <img src="https://dbdzm869oupei.cloudfront.net/img/sticker/preview/90751.png"/>
            </div>
            <div className="item-main">
                <h1>Tervetuloa käyttämään kirja-arkistoa johon voit tallettaa omia kirjoja ja kirjasarjojasi</h1>
            </div>
        </div>
    )
}




export {Etusivu};