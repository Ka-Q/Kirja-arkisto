import { useState, useEffect } from "react";
import { Button, Card, Col, Row, Stack } from "react-bootstrap";
import { RequiredComponent, WarningComponent, SuccessComponent } from "./utilityComponents";
import { BrowserRouter as Router, Route, Routes, Link, useParams, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { KirjaViewerComponent } from "./kuvaComponents";

import theme from './theme.json'


const EditSeries = (props) => {
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

  const [isDone, setIsDone] = useState(false);
  const [error, setError] = useState(false);



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
      const selectedSeries = data.data[0]; // Directly get the first series from the response data
      // Fetch the related kirja for the selected series
      const k = await fetch(`http://localhost:5000/sarjan_kirjat?sarja_id=${id}`);
      const kirjaData = await k.json();

      // Set the selectedSeries, nimi, and kuvaus states
      setSelectedSeries(selectedSeries);
      setNimi(selectedSeries.nimi);
      setKuvaus(selectedSeries.kuvaus);
      setRelatedKirja(kirjaData.data);
      setRelatedKirjaID(kirjaData.data.map(kirja => kirja.kirja_id));
    };
    fetchSeries();
  }, [id]);



  const handleCancelClicked = () => {
    navigate('/sarjasivu', { replace: true });


  };



  const HandleDeleteClicked = async () => {


    const updateOmaSarja = async () => {
      const f = await fetch("http://localhost:5000/oma_sarja_admin", {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: "include",
        body: JSON.stringify({
          where: {
            sarja_sarja_id: id
          },
          set: {
            sarja_sarja_id: "-1" // or another appropriate value
          }
        })
      });
      const data = await f.json();
      console.log(data);
    };


    const deleteFromSarjanKirjat = async () => {
      const f = await fetch("http://localhost:5000/sarjan_kirjat", {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: "include",
        body: JSON.stringify({ sarja_id: id })
      });
      const data = await f.json();
      console.log(data);
    };



    const deleteSarja = async () => {
      const f = await fetch("http://localhost:5000/sarja", {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: "include",
        body: JSON.stringify({ sarja_id: id })
      });
      const data = await f.json();
      console.log(data);
    };
    await updateOmaSarja();
    await deleteFromSarjanKirjat();
    await deleteSarja();
    setIsDone(true)


  }







  const inputStyle = { width: "60%", paddingLeft: "1em" }


  const [sarjaFilled, setSarjaFilled] = useState(true)
  const [filesFilled, setFilesFilled] = useState(true)
  const [saveSuccessful, setSaveSuccessful] = useState(false)



  async function updateSeries(updatedSeries) {
    const response = await fetch(`http://localhost:5000/sarja`, {
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
        // Fetch the updated related books
        const k = await fetch(`http://localhost:5000/sarjan_kirjat?sarja_id=${id}`);
        const kirjaData = await k.json();
        setRelatedKirja(kirjaData.data);

        // Update the selectedBook state to an empty string
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

  const handleRemoveBookFromSeries = async (kirja_id) => {
    const response = await fetch(`http://localhost:5000/sarjan_kirjat`, {
      credentials: "include",
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sarja_id: id,
        kirja_id: kirja_id,
      }),
    });

    if (response.ok) {
      // Fetch the updated related books
      const k = await fetch(`http://localhost:5000/sarjan_kirjat?sarja_id=${id}`);
      const kirjaData = await k.json();
      setRelatedKirja(kirjaData.data);
    } else {
      console.error("Failed to remove the book from the series");
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
      {isDone ? (
        <Col>
          <Row className="mt-3">
            <Col sm={12} lg={12} className="text-center">
              <Card
                bg="dark"
                className="px-2 py-5"
                style={{
                  color: "white",
                  height: "auto",
                  width: "auto",
                  margin: "20%",
                }}
              >
                <SuccessComponent text="Poisto onnistui" />
                <Link to="/sarjasivu">
                  <Button variant="success">Jatka</Button>
                </Link>
              </Card>
            </Col>
          </Row>
        </Col>
      ) : !editClicked ? (

        <Col>
          <Row className="mt-5">
            <Col sm={12} lg={3}>
              <Card className="mb-4">
                <div style={{ color: "white", background: "#131415", borderRadius: "inherit" }}>
                  <Card.Title className="text-center mt-3">Sarjan kirjat</Card.Title>
                  <Card.Body >

                    <Card.Body>
                      {relatedKirja.length > 0 && (
                        <KirjaViewerComponent
                          key={relatedKirja[0].kirja_id}
                          kirjaIds={relatedKirja.map((kirja) => kirja.kirja_id)}
                        />
                      )}
                    </Card.Body>









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
                  <h3 className="text-center mt-3">Sarjan kirjat</h3>
                  {relatedKirja.length > 0 ? (


                    <ul className="text-center mt-3">
                      {relatedKirja.map((kirja) => (
                        <Link to={"/kirja/" + kirja.kirja_id}
                          style={{ backgroundColor: theme.button, color: "white" }}>

                          <li key={kirja.kirja_id}>
                            {kirja.nimi}{" "}


                          </li>
                        </Link>
                      ))}
                    </ul>
                  ) : (
                    <p>Loading related books...</p>
                  )}
                </Card.Body>
              </Card>


              {isAdmin ?
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
                          <Link to="/sarjasivu"><Button variant="success">Jatka</Button></Link>
                        </Card>
                      </>
                    ) : error ? (
                      <>
                        <Card bg="danger" className="px-2 py-5" style={{ color: "white", height: "auto", width: "auto", margin: "20%" }}>
                          <WarningComponent text="Poisto epäonnistui"></WarningComponent>
                          <Button variant="danger" onClick={() => setError(false)}>Sulje</Button>
                        </Card>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="danger"
                          style={{ backgroundColor: theme.accent, color: "red" }}
                          onClick={() => HandleDeleteClicked()}
                        >
                          🗑 Poista
                        </Button>


                      </>
                    )}

                  </Card.Body>
                </Card> :
                <></>}
            </Col>
          </Row>

        </Col>
      ) : (

        <Card border="secondary" className="mb-1" style={{ backgroundColor: theme.accent, color: "white" }}>
          <Card.Body>
            {!saveSuccessful ? (
              <>
                <Card.Title className="text-center mt-3">Muokkaa sarjaa</Card.Title>
                <Row className="mb-2">
                  <Col>
                    <Stack direction="vertical" gap={3} style={{ textAlign: "center" }}>

                      <div>
                        <input
                          value={nimi}
                          onChange={(e) => setNimi(e.target.value)}
                          placeholder="nimi"
                          style={{ width: "50%", paddingLeft: "1em", paddingRight: "1em", marginBottom: "1.5em", borderRadius: '100px', color: "white", backgroundColor: theme.input }}
                        />
                        <RequiredComponent yes />
                      </div>
                      <div>
                        <input
                          value={kuvaus}
                          onChange={(e) => setKuvaus(e.target.value)}
                          placeholder="kuvaus"
                          style={{ width: "50%", paddingLeft: "1em", paddingRight: "1em", marginBottom: "1.5em", borderRadius: '100px', color: "white", backgroundColor: theme.input }}
                        />
                        <RequiredComponent yes />
                      </div>
                    </Stack>
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col>
                    <h3 className="text-center mt-3">Sarjan kirjat:</h3>

                    {relatedKirja.length > 0 ? (


                      <ul className="text-center mt-3">
                        {relatedKirja.map((kirja) => (
                          <Link to={"/kirja/" + kirja.kirja_id}
                            style={{ backgroundColor: theme.button, color: "white" }}>

                            <li key={kirja.kirja_id}>
                              {kirja.nimi}{" "}

                              <Button
                                variant="danger"
                                size="sm"
                                style={{ backgroundColor: theme.accent, color: "red" }}
                                onClick={() => handleRemoveBookFromSeries(kirja.kirja_id)}
                              >
                                🗑 Poista
                              </Button>
                            </li>
                          </Link>
                        ))}
                      </ul>

                    ) : (
                      <p>Loading related books...</p>
                    )}
                  </Col>


                  <Col>
                    <h3>Lisää kirja sarjaan:</h3>
                    <select
                      style={{ width: "50%", paddingLeft: "1em", paddingRight: "1em", marginBottom: "1.5em", borderRadius: '100px', color: "white", backgroundColor: theme.input }}
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
                    <Button style={{ backgroundColor: theme.button }} onClick={handleAddBookToSeries}>Lisää kirja</Button>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className="text-center mt-3">
                      {!sarjaFilled ? (
                        <WarningComponent text="Vaadittuja tietoja puuttuu" />
                      ) : (
                        <></>
                      )}

                      <Button style={{ backgroundColor: theme.button }} onClick={(e) => handleSaveClicked()}>Tallenna</Button>{" "}
                      <Button style={{ backgroundColor: theme.button }} onClick={(e) => handleCancelClicked()}>
                        Peruuta
                      </Button>{" "}




                    </div>
                  </Col>
                </Row>
              </>
            ) : (
              <>
                <SuccessComponent text="Tallennus onnistui" />
                <Button style={{ backgroundColor: theme.button }} onClick={(e) => handleCancelClicked()}>
                  Sulje
                </Button>

              </>
            )}
          </Card.Body>
        </Card >
      )}
    </>
  );
};

export { EditSeries };
