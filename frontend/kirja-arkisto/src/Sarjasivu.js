import { useState, useEffect } from "react"
import { Button, Card, Col, Row, Stack } from "react-bootstrap"

const SarjaSivu = () => {
    const [ListOfSeries, setListOfSeries] = useState([])
    const [selectedSeries, setSelectedSeries] = useState(null);
    const [action, setAction] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editedSeries, setEditedSeries] = useState(null);

    

    const handleDeleteClick = async (sarja_id) => {
        if (sarja_id) {
            // Send DELETE request to server to delete the specified sarja object
            await fetch('http://localhost:5000/sarja', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sarja_id }),
            });

            // Clear the editedSeries state if the deleted series was being edited
            if (editedSeries?.sarja_id === sarja_id) {
                setEditedSeries(null);
            }

            // Update the list of series by filtering out the deleted sarja object
            setListOfSeries(ListOfSeries.filter((s) => s.sarja_id !== sarja_id));

            // Deselect the deleted sarja object by setting selectedSeries to null
            setSelectedSeries(null);
        }
    };

    
    
  const handleEditClick = (sarja) => {
    // Set the edited series to the clicked series
    setEditedSeries(sarja);
    // Set the action to "edit" to indicate that the modal should show the edit form
    setAction("edit");
    // Show the modal
    setShowModal(true);
  };

  return (
    <div className="mx-5">
      <div className="text-center" style={{ marginTop: "2em" }}>
        <h1>Sarjat</h1>
      </div>
      <Row>
        <Col>
          <Stack direction="horizontal" gap={3}>
            <div className="bg-light border ms-auto">
              <Button variant="secondary">Lisää</Button>
            </div>
            <div className="bg-light border">
              <Button
                variant="secondary"
                onClick={() => handleDeleteClick(selectedSeries?.sarja_id)}
              >
                Poista
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
              list={ListOfSeries}
              setList={setListOfSeries}
              handleDeleteClick={handleDeleteClick}
              handleEditClick={handleEditClick} // Pass the function down to SearchBar
            />
          </div>
        </Col>
      </Row>
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
    const handleEditClick = () => {
      props.handleEditClick(sarja); // Call the function passed down as a prop
    };


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
                            <a href={"#id:" + sarja.sarja_id} style={{ textDecoration: "none" }}>➡</a>
                        </Card.Text>
                    </Col>
                    <Col>
                        <div>
                            <Button variant="primary" onClick={handleEditClick}>Muokkaa</Button>

                        </div>
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