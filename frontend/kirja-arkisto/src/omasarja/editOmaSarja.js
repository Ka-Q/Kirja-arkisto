import { useState, useEffect } from "react";
import { Button, Card, Col, Row, Stack } from "react-bootstrap";
import { RequiredComponent, WarningComponent, SuccessComponent } from "./utlilityComponents";
import { BrowserRouter as Router, Route, Routes, Link, useParams, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { KirjaViewerComponent, KuvaViewerComponent } from "./kuvaComponents";

import theme from './theme.json'


const EditSeries = (props) => {
  const { sarja_id, onUpdate } = props;
  const [sarjat, setSarjat] = useState([]);
  const [isDone, setIsDone] = useState(false);


  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [allBooksData, setAllBooksData] = useState([]);


  const [nimi, setNimi] = useState("");
  const [kuvaus, setKuvaus] = useState("");
  const [relatedKirja, setRelatedKirja] = useState([]);
  const [relatedKirjaID, setRelatedKirjaID] = useState([]);


  const [allBooks, setAllBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState("");


  useEffect(() => {
    const fetchSeries = async () => {
      const f = await fetch(`http://localhost:5000/sarja?sarja_id=${id}`);
      const data = await f.json();
      const selectedSeries = data.data[0]; 
      const k = await fetch(`http://localhost:5000/sarjan_kirjat?sarja_id=${id}`);
      const kirjaData = await k.json();

      setSelectedSeries(selectedSeries);
      setNimi(selectedSeries.nimi);
      setKuvaus(selectedSeries.kuvaus);
      setRelatedKirja(kirjaData.data);
      setRelatedKirjaID(kirjaData.data.map(kirja => kirja.kirja_id));
    };
    fetchSeries();
  }, [id]);
  



  const handleCancelClicked = () => {
    navigate('/omasarjasivu', { replace: true });


  };
  



  const handleDeleteClicked = async () => {
    const response = await fetch("http://localhost:5000/oma_sarja", {
      credentials: "include",
      method: 'DELETE',
    });

    if (response.ok) {
      setIsDone(true);
    } else {
      console.error('Failed to delete the series');
    }
  };

  const inputStyle = { width: "60%", paddingLeft: "1em" }


  const [sarjaFilled, setSarjaFilled] = useState(true)
  const [filesFilled, setFilesFilled] = useState(true)
  const [saveSuccessful, setSaveSuccessful] = useState(false)



  async function updateSeries(updatedSeries) {
    const response = await fetch(`http://localhost:5000/oma_sarja`, {
      credentials: "include",
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedSeries),
    });

    if (response.ok) {
      setSaveSuccessful(true);
    } else {
      console.error('Failed to update the series');
    }
  }
  useEffect(() => {
    const fetchBooks = async () => {
      const response = await fetch("http://localhost:5000/kirja");
      const data = await response.json();
      setAllBooks(data.data);
    };
    fetchBooks();
  }, []);
  


  const handleAddBookToSeries = async () => {
    if (selectedBook) {
      const response = await fetch("http://localhost:5000/sarjan_kirjat", {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sarja_id: id,
          kirja_id: selectedBook,
        }),
      });

      if (response.ok) {
     
        const k = await fetch(`http://localhost:5000/sarjan_kirjat?sarja_id=${id}`);
        const kirjaData = await k.json();
        setRelatedKirja(kirjaData.data);


        setSelectedBook("");
      } else {
        console.error("Failed to add the book to the series");
      }
    }
  };

  const handleSaveClicked = () => {
    if (checkInputs()) {
      const updatedSeries = {
        set: {
          nimi: nimi,
          kuvaus: kuvaus,
        },
        where: {
          sarja_id: selectedSeries.sarja_id,
        },
      };
      updateSeries(updatedSeries);
    }
  };


  const checkInputs = () => {
    const omaSarjaOK = nimi.length > 0 && kuvaus.length > 0;
    const fileInputsOK = Array.from(
      document.getElementsByName("files")
    ).every((fi) => fi.files.length > 0);

    setSarjaFilled(omaSarjaOK);
    setFilesFilled(fileInputsOK);

    return omaSarjaOK && fileInputsOK;
  };

  const [editClicked, setEditClicked] = useState(false);
  

  return (
    <>
      {!editClicked ? (

        <Col>
          <Row className="mt-5">
            <Col sm={10} lg={3}>
              <Card className="mb-4">
                <div style={{ color: "white", background: "#131415", borderRadius: "inherit" }}>
                  <Card.Title className="text-center mt-3">Sarjan kirjat</Card.Title>
                  <Card.Body >
                  
                  <KirjaViewerComponent kirjaId={relatedKirja.map(kirja => kirja.kirja_id).join(',')} />




                  </Card.Body>
                </div>
              </Card>
            </Col>
            <Col sm={12} lg={8}>
              <Card
                border="secondary"
                style={{ backgroundColor: theme.accent, color: "white" }}
              >
                <Card.Body>
                  <h1 className="text-center mt-3">{selectedSeries?.nimi}</h1>
                  <hr />
                  <Card.Text className="text-center mt-3">
                    <strong>Kuvaus:</strong> {selectedSeries?.kuvaus}
                  </Card.Text>
                  <h3>Sarjan kirjat:</h3>
                  {relatedKirja.length > 0 ? (
                    <ul>
                      {relatedKirja.map((kirja) => (
                        <li key={kirja.kirja_id}>{kirja.nimi}</li>
                      ))}
                    </ul>
                  ) : (
                    <p></p>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>


          <Card
            className="my-4"
            border="secondary"
            style={{ backgroundColor: theme.accent, color: "white" }}
          >
            <Card.Title className="text-center mt-3">Toiminnot</Card.Title>
            <Card.Body className="text-center mt-3">
              <Button
                variant="dark"
                style={{ backgroundColor: theme.button }}
                onClick={() => setEditClicked(true)}
              >
                ✏ Muokkaa
              </Button>{" "}
              <span className="mx-3" />
              {isDone ? (
                <>
                  <Card bg="dark" className="px-2 py-5" style={{ color: "white", height: "auto", width: "auto", margin: "20%" }}>
                    <SuccessComponent text="Poisto onnistui"></SuccessComponent>
                    <Link to="/omasarjasivu"><Button variant="success">Jatka</Button></Link>
                  </Card>
                </>
              ) : (
                <>
                  <Button
                    variant="danger"
                    style={{ backgroundColor: theme.accent, color: "red" }}
                    onClick={() => handleDeleteClicked()}
                  >
                    🗑 Poista
                  </Button>
                </>
              )}
            </Card.Body>
          </Card>
          
        </Col>
      ) : (

        <Card border="secondary" className="mb-1" style={{ backgroundColor: theme.input, color: "white" }}>
          <Card.Body>
            {!saveSuccessful ? (
              <>
                <Card.Title>Muokkaa sarjaa</Card.Title>
                <Row className="mb-2">
                  <Col>
                    <Stack direction="vertical" gap={3} style={{ textAlign: "center" }}>

                      <div>
                        <input
                          value={nimi}
                          onChange={(e) => setNimi(e.target.value)}
                          placeholder="nimi"
                          style={inputStyle}
                        />
                        <RequiredComponent yes />
                      </div>
                      <div>
                        <input
                          value={kuvaus}
                          onChange={(e) => setKuvaus(e.target.value)}
                          placeholder="kuvaus"
                          style={inputStyle}
                        />
                        <RequiredComponent yes />
                      </div>
                    </Stack>
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col>
                    <h3>Sarjan kirjat:</h3>
                    {relatedKirja.length > 0 ? (
                      <ul>
                        {relatedKirja.map((kirja) => (
                          <li key={kirja.kirja_id}>{kirja.nimi}</li>
                        ))}
                      </ul>
                    ) : (
                      <p></p>
                    )}

                  </Col>
                  <Col>
                    <h3>Lisää kirja sarjaan:</h3>
                    <select
                      value={selectedBook}
                      onChange={(e) => setSelectedBook(e.target.value)}
                    >
                      <option value="">Valitse kirja</option>
                      {allBooks.map((book) => (
                        <option key={book.kirja_id} value={book.kirja_id}>
                          {book.nimi}
                        </option>
                      ))}
                    </select>
                    <Button onClick={handleAddBookToSeries}>Lisää kirja</Button>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className="my-5">
                      {!sarjaFilled ? (
                        <WarningComponent text="Vaadittuja tietoja puuttuu" />
                      ) : (
                        <></>
                      )}

                      <Button onClick={(e) => handleSaveClicked()}>Tallenna</Button>{" "}
                      <Button onClick={(e) => handleCancelClicked()}>
                        Peruuta
                      </Button>{" "}




                    </div>
                  </Col>
                </Row>
              </>
            ) : (
              <>
                <SuccessComponent text="Tallennus onnistui" />
                <Button onClick={(e) => handleCancelClicked()}>
                  Sulje
                </Button>

              </>
            )}
          </Card.Body>
        </Card>
      )}
    </>
  );
};

export { EditSeries };
