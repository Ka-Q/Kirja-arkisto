import { useState, useEffect } from "react"
import { Button, Card, Col, Row, Stack } from "react-bootstrap"
import { AddSeries } from "./addSarja"
import { EditSeries } from "./editSarja";

const SarjaSivu = () => {
    const [ListOfSeries, setListOfSeries] = useState([])
    const [selectedSeries, setSelectedSeries] = useState(null);
    const [action, setAction] = useState(null);
    const [showModal, setShowModal] = useState(false);
    
    const [editedSeries, setEditedSeries] = useState(null);
    const [lisaaClicked, setLisaaClicked] = useState(false)
    const [lisaaBtnText, setLisaaBtnText] = useState("Lisää sarja")
  
    // Näyttää ja/tai piilottaa oman kirja lisäys -näkymän
    const handleLisaaClicked = () => {
        if (!lisaaClicked) {
            setLisaaClicked(true)
            setLisaaBtnText("Palaa omien kirjojen hakuun")
        } else {
            setLisaaClicked(false)
            setLisaaBtnText("Lisää sarja")
        }
    }
   

  return (
    <div className="mx-5">
      <div className="text-center" style={{ marginTop: "2em" }}>
        <h1>Sarjat</h1>
      </div>
      <Row>
        <Col>
          <Stack direction="horizontal" gap={3}>
            <div className="bg-light border ms-auto">
            <div className="bg-light border ms-auto"><Button variant="secondary" onClick={(e) => handleLisaaClicked(e.target)}>{lisaaBtnText}</Button></div>
            </div>
          </Stack>
        </Col>
      </Row>
     
      {
            !lisaaClicked ?
                <Row className="mt-3" >
                    <Col>
                    <div className="text-center" style={{verticalAlign: "center", lineHeight: "2.3em"}}>
                        <SearchBar />
                    </div>
                    </Col>
                </Row>
            :
                <Row className="mt-3" >
                    <Col>
                    <div className="text-center" style={{verticalAlign: "center", lineHeight: "2.3em"}}>
                        <AddSeries handleLisaaClicked={handleLisaaClicked}/>
                    </div>
                    </Col>
                </Row>
            }
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
            sarja={n}
            setSelectedSeries={props.setSelectedSeries}
            handleEditClick={props.handleEditClick} // Pass the function down to SeriesCard
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
            const f = await fetch("http://localhost:5000/sarja" + "?" + query)
            const data = await f.json();
            SetSerieslist(data)
        };
        if (searchCounter != 0) {
            fetchSeries();
        }
    }, [searchCounter]);

    const handleSearchClick = (props) => {
        updateQuery()
        setSearchCounter(searchCounter + 1)
    }

    return (
        <div className="text-center" style={{ verticalAlign: "center", lineHeight: "2.3em" }}>
            <input onChange={(e) => setNimi(e.target.value)} style={{ width: "65%" }} placeholder="Hae sarjoista"></input>
            <Button variant="secondary" onClick={handleSearchClick} style={{ width: "3.5em", height: "3.5em", marginLeft: "1em" }}>🔎</Button>
            <div style={{ marginTop: "3em" }}>
                {SeriesCardList}
            </div>
        </div>
    )
}

const SeriesCard = (props) => {
    let sarja = props.sarja;
    const [lisaaClicked, setLisaaClicked] = useState(false)
    const [lisaaBtnText, setLisaaBtnText] = useState("Lisää sarja")
    const [editClicked, setEditClicked] = useState(false)
    
    const handleEditClicked = () => {
      if (!editClicked) {
          setEditClicked(true)
          setLisaaBtnText("Palaa omien kirjojen hakuun")
      } else {
          setEditClicked(false)
          setLisaaBtnText("Lisää sarja")
      }
  }


    return (
        <Card border="dark" className="mb-1">
            <Card.Body>
                <Card.Title>{sarja.nimi}</Card.Title>
                <Row>
                    <Col md={2}>
                        Tähän kuva
                    </Col>
                    <Col>
                        <Card.Text>
                            Kuvaus: {sarja.kuvaus} <p> </p>
                        </Card.Text>
                    </Col>
                    <Col md={2}>
                        <Card.Text style={{ fontSize: "3em" }}>
                            <a href={"#id:" + sarja.sarja_id} onClick={(e) => handleEditClicked(e.target)} style={{ textDecoration: "none"}}>➡</a>
                        </Card.Text>
                    </Col>
                    
                </Row>
            </Card.Body>
        </Card>
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




export { SarjaSivu }