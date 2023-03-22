import { useState, useEffect } from "react";
import './style.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from "react-bootstrap/esm/Button";
import 'bootstrap/dist/css/bootstrap.min.css'
import {LinkContainer} from 'react-router-bootstrap'
import {Routes, Route, BrowserRouter as Router} from 'react-router-dom'
import {Row, Col} from "react-bootstrap"
import {OmaKirjaSivu} from "./omakirjasivu";
import {SarjaSivu} from "./sarjasivu";


function Etusivu () {

    return (
      <div>
      <Router>
      <Navbar bg="light" expand="lg">
          <Container>
              <LinkContainer to="/"><Navbar.Brand>
                  Kirjasovellus
              </Navbar.Brand></LinkContainer>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mx-auto">
                  <LinkContainer to="/"><Nav.Link className="mx-2" >Etusivu</Nav.Link></LinkContainer>
                  <LinkContainer to="/kirja"><Nav.Link className="mx-2">Kirjat</Nav.Link></LinkContainer>
                  <LinkContainer  to="/sarjasivu"><Nav.Link className="mx-2">Sarjat</Nav.Link></LinkContainer>
                  <LinkContainer to="/omakirja"><Nav.Link className="mx-2">Oma kirja</Nav.Link></LinkContainer>
              </Nav>
              </Navbar.Collapse>
          </Container>
      </Navbar>

      <Routes>
          <Route path="/" element={<FrontPage/>}/>
          <Route path="/kirja" element={<BookPage />}/>
          <Route path="/sarjasivu" element={<SeriesPage />}/>
          <Route path="/omakirja" element={<OwnedBookPage/>}/>
      </Routes>
      </Router>
  </div>
    )
}

const FrontPage = (props) => {
  return (
    <Row className="mx-5 my-5">
      <Col>
        <img src="https://dbdzm869oupei.cloudfront.net/img/sticker/preview/90751.png"/>
      </Col>
      <Col >
        <h1  className="item-main">Tervetuloa käyttämään kirja-arkistoa johon voit tallettaa omia kirjoja ja kirjasarjojasi</h1>
      </Col>
    </Row>
  )
}

const BookPage = (props) => {
  return (
    <>Kirja</>
  )
}

const SeriesPage = (props) => {
  return (
    <SarjaSivu/>
  )
}

const OwnedBookPage = (props) => {
  return (
    <OmaKirjaSivu/>
  )
}




export {Etusivu};