import { useState, useEffect } from "react";
import { Button, Col, Form, Row, Stack } from "react-bootstrap";

const OmaSarjaSivu = () => {
  const [seriesList, setSeriesList] = useState([]);
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddClick = () => {
    setShowAddForm(true);
  };

  const handleAddFormSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    const data = {
      nimi: form.elements.nimi.value,
      kuvaus: form.elements.kuvaus.value,
    };
    
    console.log(data);
    setShowAddForm(false);
  };

  return (
    <div className="mx-5">
      <div className="text-center" style={{ marginTop: "2em" }}>
        <h1>Oma sarja</h1>
      </div>
      <Row>
        <Col>
          <Stack direction="horizontal" gap={3}>
            <div className="bg-light border ms-auto">
              <Button variant="primary" onClick={handleAddClick}>
                Lisää oma sarja
              </Button>
            </div>
          </Stack>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <div
            className="text-center"
            style={{ verticalAlign: "center", lineHeight: "2.3em" }}
          >
            <SearchBar
              list={seriesList}
              setList={setSeriesList}
              setSelectedSeries={setSelectedSeries}
            />
          </div>
        </Col>
      </Row>
      {showAddForm && (
        <Row className="mt-3">
          <Col>
            <div className="text-center">
              <h2>Lisää oma sarja</h2>
              <Form onSubmit={handleAddFormSubmit}>
                <Form.Group controlId="nimi">
                  <Form.Label>Nimi</Form.Label>
                  <Form.Control type="text" placeholder="Syötä nimi" />
                </Form.Group>
                <Form.Group controlId="kuvaus">
                  <Form.Label>Kuvaus</Form.Label>
                  <Form.Control
                    as="textarea"
                    placeholder="Syötä kuvaus"
                    style={{ height: "100px" }}
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Tallenna
                </Button>{" "}
                <Button variant="primary" onClick={() => setShowAddForm(false)}>
                  Peruuta
                </Button>
              </Form>
            </div>
          </Col>
        </Row>
      )}
    </div>
  );
};

const SearchBar = (props) => {
  const [searchCounter, setSearchCounter] = useState(0);
  const [seriesList, setSeriesList] = useState([]);
  const [query, setQuery] = useState("");
  const [nimi, setNimi] = useState("");

  console.log(nimi);
  console.log(searchCounter);

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
        setSeriesList(data);
        };
        if (searchCounter !== 0) {
        fetchSeries();
        }
        }, [searchCounter]);
        
        const handleSearchClick = (props) => {
        updateQuery();
        setSearchCounter(searchCounter + 1);
        };
        
        return (
        <div className="text-center" style={{ verticalAlign: "center", lineHeight: "2.3em" }}>
        <input
        onChange={(e) => setNimi(e.target.value)}
        style={{ width: "65%" }}
        placeholder="Hae omista sarjoista"
        ></input>
        <Button
        variant="primary"
        onClick={handleSearchClick}
        style={{ width: "3.5em", height: "3.5em", marginLeft: "1em" }}
        >
        🔎
        </Button>
        {seriesList.map((series) => (
        <div key={series.id}>
        <h3>{series.nimi}</h3>
        <p>{series.kuvaus}</p>
        </div>
        ))}
        </div>
        );
        };


export {OmaSarjaSivu}
