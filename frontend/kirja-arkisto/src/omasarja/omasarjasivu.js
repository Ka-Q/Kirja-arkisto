import { useState, useEffect } from "react"
import { Button, Card, Col, Row, Stack } from "react-bootstrap"
import { AddComponent } from "./addOmaSarja"
import { ViewComponent } from "./viewOmaSarja";
import theme from './theme.json'
import { EditSeries } from "./editOmaSarja";



const OmaSarjaSivu = () => {

  const [selectedOwnSeries, setSelectedOwnSeries] = useState(null);
  const [lisaaClicked, setLisaaClicked] = useState(false)
  const [lisaaBtnText, setLisaaBtnText] = useState("Lisää oma sarja")
  const [editClicked, setEditClicked] = useState(false)


  const handleLisaaClicked = () => {
    if (!lisaaClicked) {
      setLisaaBtnText("Palaa sarjojen hakuun")
      setEditClicked(false)
      setLisaaClicked(true)

    } else {
      setLisaaClicked(false)
      setLisaaBtnText("Lisää sarja")
      setEditClicked(false)
    }
  }

  const [omasarjaId, setOmaSarjaId] = useState(null);

  const handleEditClicked = (sarja_id) => {
    if (!editClicked) {
      setEditClicked(true);
      setLisaaBtnText("Lisää sarja");
      setLisaaClicked(false);
      setOmaSarjaId(sarja_id);
    } else {
      setEditClicked(false);
      setLisaaBtnText("Lisää sarja");
    }
  };

  return (
    <div style={{ backgroundColor: theme.bg, paddingBottom: "20%" }}>
      <div className="text-center" >
        <h1 style={{ color: "white" }}>Omat sarjat</h1>
      </div>
      <Row>
        <Col>
          <Stack direction='horizontal' gap={3}>
            <div className=" ms-auto"><Button className='btn btn-dark' style={{ backgroundColor: theme.button }} onClick={(e) => handleLisaaClicked(e.target)}>{lisaaBtnText}</Button></div>
          </Stack>
        </Col>
      </Row>


      {!lisaaClicked && !editClicked && (
        <Row className="mt-3">
          <Col>
            <div
              className="text-center"
              style={{ verticalAlign: "center", lineHeight: "2.3em" }}
            >
              <SearchBar
                setSelectedOwnSeries={setSelectedOwnSeries}
                handleEditClicked={handleEditClicked}
              />
            </div>
          </Col>
        </Row>
      )}
      {editClicked && (
        <Row className="mt-3">
          <Col>
            <div
              className="text-center"
              style={{ verticalAlign: "center", lineHeight: "2.3em" }}
            >
              <EditSeries
                handleEditClicked={handleEditClicked}
                sarja_id={omasarjaId}
              />
            </div>
          </Col>
        </Row>
      )}
      {lisaaClicked && (
        <Row className="mt-3">
          <Col>
            <div
              className="text-center"
              style={{ verticalAlign: "center", lineHeight: "2.3em" }}
            >
              <AddComponent handleLisaaClicked={handleLisaaClicked} />
            </div>
          </Col>
        </Row>
      )}
    </div>
  );
};
             






const SearchBar = (props) => {

  const [searchCounter, setSearchCounter] = useState(0);
  const [serieslist, SetSerieslist] = useState([]);
  const [query, setQuery] = useState("");
  const [nimi, setNimi] = useState("");
  console.log(nimi)
  console.log(searchCounter)


  let seriesData = serieslist.data
  let SeriesCardList = [];
  if (seriesData) {
    if (seriesData.length > 0) {
      SeriesCardList = seriesData.map((n, index) => {
        return (
          <SeriesCard
            key={index}
            omasarja={n}
            setSelectedOwnSeries={props.setSelectedOwnSeries}
            handleEditClicked={props.handleEditClicked}
          />



        );
      });
    } else if (searchCounter != 0) {
      SeriesCardList = [<ErrorCard />];
    }
  }


  const updateQuery = () => {
    setSearchCounter(searchCounter + 1)
    let q = "";
    if (nimi.length > 0) {
      let splitName = nimi.split(' ');
      if (splitName.length > 1) {
        q += "&nimi="
        for (let wrd in splitName) {
          q += wrd + "%20"
        }
        q = q.substring(0, q.length - 3)
      } else {
        q += ("&nimi=%" + nimi + "%");
      }
    }
    console.log(q)
    setQuery(q)
  }

  useEffect(() => {
    const fetchSeries = async () => {
      const f = await fetch("http://localhost:5000/oma_sarja" + "?" + query, {
        credentials: "include"
      });
      const data = await f.json();
  
      const fetchBooks = async (sarja_id) => {
        const b = await fetch(`http://localhost:5000/kirja?series_id=${sarja_id}`, {
          credentials: "include"
        });
        const booksData = await b.json();
        return booksData.data;
      };
  
      const seriesWithBooks = await Promise.all(
        data.data.map(async (series) => {
          const books = await fetchBooks(series.sarja_id);
          return { ...series, books };
        })
      );
  
      SetSerieslist({ ...data, data: seriesWithBooks });
    };
    fetchSeries();
  }, [searchCounter]);
  



  const handleSearchClick = (props) => {
    updateQuery()
    setSearchCounter(searchCounter + 1)
  }

  return (
    <div className="text-center" style={{ verticalAlign: "center", lineHeight: "2.3em" }}>
      <input onChange={(e) => setNimi(e.target.value)} style={{ backgroundColor: theme.input, width: "65%" }} placeholder="Hae sarjoista"></input>
      <Button onClick={handleSearchClick} className='btn btn-dark' style={{ backgroundColor: theme.button, width: "3.5em", height: "3.5em", marginLeft: "1em" }}>🔎</Button>
      <div style={{ marginTop: "3em" }}>
        {SeriesCardList}
      </div>
    </div>
  )
}
const SeriesCard = (props) => {
  let omasarja = props.omasarja;
  const handleEditClicked = (omasarja_id) => {
    props.setSelectedOwnSeries(omasarja);
    props.handleEditClicked(omasarja_id);
  };

  const renderBooks = () => {
    return (
      <ul>
        {omasarja.books.map((book, index) => (
          <li key={index}>{book.nimi}</li>
        ))}
      </ul>
    );
  };

  return (
    <Card border="secondary" className="mb-1" style={{ backgroundColor: theme.input, color: "white" }}>
      <Card.Body>
        <Card.Title>{omasarja.nimi}</Card.Title>
        <Row>
          <Col md={2}>
          </Col>
          <Col>
            <Card.Text>
              Kuvaus: {omasarja.kuvaus}
              <p> </p>
              
            </Card.Text>
          </Col>
          <Col md={2}>
            <Card.Text style={{ fontSize: "3em" }}>
              <a
                href={"#id:" + omasarja.sarja_id}
                onClick={() => handleEditClicked(omasarja.sarja_id)}
                style={{ textDecoration: "none" }}
              >
                ➡
              </a>
            </Card.Text>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};


const ErrorCard = () => {
  return (
    <Card border="dark" className="mb-1">
      <Card.Body>
        <Card.Title>Haulla ei löytynyt tuloksia</Card.Title>
      </Card.Body>
    </Card>
  )
}




export { OmaSarjaSivu }