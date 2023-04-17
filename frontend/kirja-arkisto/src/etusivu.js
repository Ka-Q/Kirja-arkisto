import { useState, useEffect } from "react";
import './style.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from "react-bootstrap/esm/Button";
import 'bootstrap/dist/css/bootstrap.min.css'
import { LinkContainer } from 'react-router-bootstrap'
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom'
import { Row, Col, Dropdown } from "react-bootstrap"
import { OmaKirjaSivu } from "./omakirja/omakirjasivu";
import { SarjaSivu } from "./sarja/sarjasivu";
import { OmaSarjaSivu } from "./omasarja/omasarjasivu";
import { KirjaSivu } from "./kirja/kirjasivu";
import { WarningComponent } from "./omakirja/utlilityComponents";
import { ViewComponent } from "./omakirja/viewOmaKirja";
import { ViewComponent as KirjaViewComponent } from "./kirja/viewKirja";
import { EditSeries } from "./sarja/editSarja";
import { AddSeries } from "./sarja/addSarja";



function Etusivu() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const sendAuth = async () => {
      const f = await fetch("http://localhost:5000/check_login", {
        credentials: "include",
        method: 'GET'
      })
      const data = await f.json();
      console.log(data.data);
      if (data.data) { setIsLoggedIn(true) } else setIsLoggedIn(false)
    };
    sendAuth();
  }, [isLoggedIn]);

  return (
    <div >
      <Router>
        <Navbar style={{ backgroundColor: "#131415" }} variant="dark" expand="lg">
          <Container>
            <LinkContainer to="/"><Navbar.Brand>
              Kirjasovellus
            </Navbar.Brand></LinkContainer>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mx-auto">
                <LinkContainer to="/"><Nav.Link className="mx-2" >Etusivu</Nav.Link></LinkContainer>
                <LinkContainer to="/kirja"><Nav.Link className="mx-2">Kirjat</Nav.Link></LinkContainer>
                <LinkContainer to="/sarjasivu"><Nav.Link className="mx-2">Sarjat</Nav.Link></LinkContainer>
                {isLoggedIn ?
                  <>
                    <LinkContainer to="/omakirja"><Nav.Link className="mx-2">Oma kirja</Nav.Link></LinkContainer>
                    <LinkContainer to="/omasarja"><Nav.Link className="mx-2">Oma sarja</Nav.Link></LinkContainer>
                  </> :
                  <>
                    <Nav.Link className="mx-2" disabled>Oma kirja</Nav.Link>
                    <Nav.Link className="mx-2" disabled>Oma sarja</Nav.Link>
                  </>}
              </Nav>
              {isLoggedIn ?
                <LogoutComponent setIsLoggedIn={setIsLoggedIn} />
                :
                <Dropdown>
                  <Dropdown.Toggle variant="success" style={{ width: "10em" }}>Kirjaudu sisään</Dropdown.Toggle>
                  <Dropdown.Menu className="mt-1" variant="dark" style={{ backgroundColor: "#131415", borderRadius: "0.5rem" }}>
                    <div className="px-2 py-2">
                      <LoginComponent setIsLoggedIn={setIsLoggedIn} />
                    </div>
                  </Dropdown.Menu>
                </Dropdown>
              }
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Routes>
          <Route path="/" element={<FrontPage />} />
          <Route path="/kirja" element={<BookPage />} />
          <Route path="/kirja/:id" element={<KirjaViewComponent />} />
          <Route path="/sarjasivu" element={<SeriesPage />} />
          <Route path="/sarjasivu/edit/:id" element={<EditSeries />} />
          <Route path="/sarjasivu/add" element={<AddSeries />} />
          <Route path="/omakirja/*" element={<OwnedBookPage />} />
          <Route path="/omakirja/:id" element={<ViewComponent />} />
          <Route path="/omasarja" element={<OwnedSeriePage />} />
        </Routes>
      </Router>
    </div>
  )
}

const FrontPage = (props) => {
  return (
    <div style={{ height: "100%", width: '100%', padding: '10px', backgroundColor: "#202020" }}>
      <Row className="mx-5 my-5">
        <Col>
          <img src="https://dbdzm869oupei.cloudfront.net/img/sticker/preview/90751.png" />
        </Col>
        <Col >
          <h1 className="" style={{ color: "white" }}>Tervetuloa käyttämään kirja-arkistoa johon voit tallettaa omia kirjoja ja kirjasarjojasi</h1>
        </Col>
      </Row>
    </div>
  )
}

const BookPage = (props) => {
  return (
    <KirjaSivu />
  )
}

const SeriesPage = (props) => {
  return (
    <>
      <SarjaSivu />
    </>
  );
};

const OwnedBookPage = (props) => {
  return (
    <OmaKirjaSivu />
  )
}

const OwnedSeriePage = (props) => {
  return (
    <OmaSarjaSivu />
  )
}

const LoginComponent = (props) => {

  const [sposti, setSposti] = useState("");
  const [salasana, setSalasana] = useState("");
  const [clickCounter, setClickCounter] = useState(0);
  const [error, setError] = useState(false)

  useEffect(() => {
    const sendAuth = async () => {
      const f = await fetch("http://localhost:5000/login", {
        credentials: "include",
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sposti: sposti, salasana: salasana })
      })
      const data = await f.json();
      console.log(data);
      if (data.status == "OK") { props.setIsLoggedIn(true); window.location.reload() } else { setError(true) }

    };
    if (clickCounter > 0) sendAuth();
  }, [clickCounter]);

  const handleClick = () => {
    setClickCounter(clickCounter + 1);
  }

  let inputStyle = { backgroundColor: "#3a3a3a", borderRadius: '0.5rem', color: "white", lineHeight: "2rem" }

  return (
    <div className="text-center">
      <input className="mb-2" placeholder="tunnus" onChange={(e) => setSposti(e.target.value)} style={inputStyle} />
      <input className="mb-2" placeholder="salasana" onChange={(e) => setSalasana(e.target.value)} style={inputStyle} />
      <Button variant="success" onClick={(e) => handleClick()} style={{ width: "100%" }}>Kirjaudu</Button>
      {error ? <div className="mt-4"><WarningComponent text="Tarkista tunnus ja salasana" /></div> : <></>}
    </div>
  )
}

const LogoutComponent = (props) => {

  const [clickCounter, setClickCounter] = useState(0);

  useEffect(() => {
    const sendAuth = async () => {
      const f = await fetch("http://localhost:5000/logout", {
        credentials: "include",
        method: 'POST'
      })
      const data = await f.json();
      console.log(data);
      if (data) { props.setIsLoggedIn(false); window.location.reload() } else { console.log("jotain meni pieleen") }
    };
    if (clickCounter > 0) sendAuth();
  }, [clickCounter]);

  const handleClick = () => {
    setClickCounter(clickCounter + 1);
  }

  return (
    <div className="text-center">
      <Button variant="danger" onClick={(e) => handleClick()} style={{ width: "10em" }}>Kirjaudu ulos</Button>
    </div>
  )

}


export { Etusivu };