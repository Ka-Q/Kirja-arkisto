import { useState, useEffect } from "react"
import { Button, Card, Col, Row, Stack } from "react-bootstrap"
import { AddSeries } from "./addSarja"
import { EditSeries } from "./editSarja";
import { Route, Routes, Link, useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";



import theme from './theme.json'


const SarjaSivu = () => {
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [filteredSeries, setFilteredSeries] = useState([]);

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const sendAuth = async () => {
      const f = await fetch("http://localhost:5000/check_login", {
        credentials: "include",
        method: 'GET'
      })
      const data = await f.json();
      console.log(data.data);
      if (data.data && data.data.rooli == 1) { setIsAdmin(true) } else setIsAdmin(false)
    };
    sendAuth();
  }, []);


  return (
    <div style={{ backgroundColor: "#202020" }}>
      <div className='mx-3'>
        <div className='text-center' style={{ paddingTop: '2em' }}>
          <h1 style={{ color: "white" }}>Sarjat</h1>
        </div>
        <Row className="justify-content-end">
          <Col md="auto">
            {isAdmin ?
              <Link
                to="/sarjasivu/add"
                className="btn btn-dark mt-3"
                style={{ backgroundColor: theme.button }}
              >
                Lisää sarja
              </Link> :
              <button
                disabled
                className="btn btn-dark mt-3"
                style={{ backgroundColor: theme.button }}
              >
                Lisää sarja
              </button>}

          </Col>
        </Row>


        <Row>
          <Col>
            <SearchBar setSelectedSeries={setSelectedSeries} setFilteredSeries={setFilteredSeries} />
          </Col>

        </Row>
        <div className="fluid">
          <SeriesCardList setSelectedSeries={setSelectedSeries} serieslist={filteredSeries} />
        </div>
      </div>
      <Outlet>
        <Routes>
          <Route path="/sarjasivu/add" element={<AddSeries />} />
          <Route path="/sarjasivu/edit/:id" element={<EditSeries />} />
        </Routes>
      </Outlet>
    </div>
  );
};

const SearchBar = ({ setSelectedSeries, setFilteredSeries }) => {

  const [searchCounter, setSearchCounter] = useState(0);
  const [serieslist, SetSerieslist] = useState([]);
  const [query, setQuery] = useState("");
  const [nimi, setNimi] = useState("");

  const updateQuery = () => {
    setSearchCounter(searchCounter + 1);
    let q = "";
    if (nimi.length > 0) {
      let splitName = nimi.split(" ");
      if (splitName.length > 1) {
        q += "&nimi=";
        for (let wrd in splitName) {
          q += wrd + "%20";
        }
        q = q.substring(0, q.length - 3);
      } else {
        q += "&nimi=%" + nimi + "%";
      }
    }
    console.log(q);
    setQuery(q);
  };

  useEffect(() => {
    const fetchSeries = async () => {
      const f = await fetch("http://localhost:5000/sarja" + "?" + query);
      const data = await f.json();
      setFilteredSeries(data);

    };
    fetchSeries();
  }, [searchCounter]);

  const handleSearchClick = () => {
    updateQuery();
    setSearchCounter(searchCounter + 1);
  };

  return (
    <div className="text-center" style={{ verticalAlign: "center", lineHeight: "2.3em" }}>
      <input onChange={(e) => setNimi(e.target.value)} style={{ width: "65%", paddingLeft: "1em", backgroundColor: "#3a3a3a", borderRadius: '100px', color: "white" }} placeholder="Hae sarjoista"></input>
      <Button onClick={handleSearchClick} className='btn btn-dark' style={{ backgroundColor: theme.button, width: "3.5em", height: "3.5em", marginLeft: "1em" }}>🔎</Button>
    </div>
  )
}

const SeriesCardList = ({ setSelectedSeries, serieslist }) => {
  const handleCardClick = (sarja) => {
    setSelectedSeries(sarja);
  };

  let seriesData = serieslist.data;
  let SeriesCardList = [];
  if (seriesData && seriesData.length > 0) {
    SeriesCardList = seriesData.map((n, index) => {
      if (n.sarja_id > 0) {
        return (
          <SeriesCard
            key={index}
            sarja={n}
            handleCardClick={handleCardClick}
          />
        );
      } else {
        return null;
      }
    });
  }

  return (
    <div style={{ marginTop: "3em" }}>
      {SeriesCardList}
    </div>
  )
}


const SeriesCard = (props) => {
  let sarja = props.sarja;

  return (
    <Link
      to={{
        pathname: `/sarjasivu/edit/${sarja.sarja_id}`,
        state: { selectedSeries: sarja },
      }}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <Card border="dark" className="mb-1 me-auto ms-auto" style={{ backgroundColor: "#313131", width: "75%", color: "white" }}>
        <Card.Body onClick={() => props.handleCardClick(sarja)}>
          <Card.Title className="text-center mt-3">{sarja.nimi}</Card.Title>

          <Col>
            <Card.Text className="text-center mt-3">
              Kuvaus: {sarja.kuvaus} <p> </p>
            </Card.Text>
          </Col>


        </Card.Body>
      </Card>
    </Link>
  )
}
const ErrorCard = () => {
  return (
    <Card border="dark" className="mb-1">
      <Card.Body>
        <Card.Title>Haulla ei löytynyt tuloksia</Card.Title>
      </Card.Body>
    </Card>
  )
}

export { SarjaSivu, SearchBar }
