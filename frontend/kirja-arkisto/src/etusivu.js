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
import {OmaKirjaSivu} from "./omakirja/omakirjasivu";
import {SarjaSivu} from "./sarja/sarjasivu";
import {OmaSarjaSivu} from "./omasarja/omasarjasivu";
import { KirjaSivu } from "./kirja/kirjasivu";




function Etusivu () {

    return (
      <div >
      <Router>
      <Navbar style={{backgroundColor: "#131415"}} variant="dark" expand="lg">
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
                  <LinkContainer to="/omasarja"><Nav.Link className="mx-2">Oma sarja</Nav.Link></LinkContainer>
              </Nav>
              </Navbar.Collapse>
          </Container>
      </Navbar>

      <Routes>
          <Route path="/" element={<FrontPage/>}/>
          <Route path="/kirja" element={<BookPage />}/>
          <Route path="/sarjasivu" element={<SeriesPage />}/>
          <Route path="/omakirja" element={<OwnedBookPage/>}/>
          <Route path="/omasarja" element={<OwnedSeriePage/>}/>
      </Routes>
      </Router>
  </div>
    )
}

const FrontPage = (props) => {
  return (
    <div style={{height: "100%",width: '100%',padding: '10px', backgroundColor: "#202020"}}>
    <Row className="mx-5 my-5">
      <Col>
        <img src="https://dbdzm869oupei.cloudfront.net/img/sticker/preview/90751.png"/>
      </Col>
      <Col >
        <h1  className="" style={{color: "white"}}>Tervetuloa käyttämään kirja-arkistoa johon voit tallettaa omia kirjoja ja kirjasarjojasi</h1>
      </Col>
    </Row>
    <Logincomponent />
    </div>
  )
}

const BookPage = (props) => {
  return (
    <KirjaSivu/>
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

const OwnedSeriePage = (props) => {
  return (
    <OmaSarjaSivu/>
  )
}

const Logincomponent = () => {

  const [sposti, setSposti] = useState("");
  const [salasana, setSalasana] = useState("");
  const [clickCounter, setClickCounter] = useState(0);
  const [clickCounter2, setClickCounter2] = useState(0);

  useEffect(() => {
      const sendAuth = async () => {
          const f = await fetch("http://localhost:5000/login", {
              credentials: "include",
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({sposti: sposti, salasana: salasana})
          })
          const data = await f.json();
          console.log(data);
      };
      if (clickCounter > 0) sendAuth();
  }, [clickCounter]);

  useEffect(() => {
      const sendAuth = async () => {
          const f = await fetch("http://localhost:5000/logout", {
              credentials: "include",
              method: 'POST'
          })
          const data = await f.json();
          console.log(data);
      };
      if (clickCounter2 > 0) sendAuth();
  }, [clickCounter2]);


  const handleClick = () => {
      setClickCounter(clickCounter + 1);
  }
  const handleClick2 = () => {
      setClickCounter2(clickCounter2 + 1);
  }

  return (
      <>
          <input placeholder="sposti" onChange={(e) => setSposti(e.target.value)}/>
          <input placeholder="salasana" onChange={(e) => setSalasana(e.target.value)}/>
          <button onClick={(e) => handleClick()}>Kirjaudu</button>
          <button onClick={(e) => handleClick2()}>Kirjaudu ulos</button>
      </>

  )
}


export {Etusivu};