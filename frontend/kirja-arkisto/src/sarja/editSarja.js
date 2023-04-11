import { useState, useEffect } from "react";
import { Button, Card, Col, Row, Stack } from "react-bootstrap";
import { RequiredComponent, WarningComponent, SuccessComponent } from "./utilityComponents";
import { useNavigate } from "react-router-dom";


const EditSeries = (props) => {
  const { sarja_id } = props;
  const navigate = useNavigate();
  // Haetaan sivun auetessa sarjat ja asetetaan listaan
  const [selectedSeries, setSelectedSeries] = useState({});
  const [nimi, setNimi] = useState("");
  const [kuvaus, setKuvaus] = useState("");
  const [relatedKirja, setRelatedKirja] = useState([]);

  useEffect(() => {
    const fetchSeries = async () => {
      const f = await fetch(`http://localhost:5000/sarja?sarja_id=${sarja_id}`);
      const data = await f.json();
      const selectedSeries = data.data[0]; // Directly get the first series from the response data
      // Fetch the related kirja for the selected series
      const k = await fetch(`http://localhost:5000/sarjan_kirjat?sarja_id=${selectedSeries.sarja_id}`);
      const kirjaData = await k.json();

      // Set the selectedSeries, nimi, and kuvaus states
      setSelectedSeries(selectedSeries);
      setNimi(selectedSeries.nimi);
      setKuvaus(selectedSeries.kuvaus);
      setRelatedKirja(kirjaData.data);
    };
    fetchSeries();
  }, [sarja_id]);

  const handleCancelClicked = () => {
    navigate('/sarjasivu'); // Update this with the correct path for SarjaSivu
  };

 

  const handleDeleteClicked = async () => {
    const response = await fetch(`http://localhost:5000/sarja?sarja_id=${selectedSeries.sarja_id}`, {
      credentials: "include",
      method: 'DELETE',
      
    });

    if (response.ok) {
      navigate('/sarjasivu');
    } else {
      console.error('Failed to delete the series');
    }
  };

  // tyyliä
  const inputStyle = { width: "60%", paddingLeft: "1em" }

  // Ilmoituksia käyttäjälle
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




  // Kerää input-kenttien tiedot yhteen objektiin ja aloittaa tallennusprosessin. Päivittää saveClicked-lipun, joka laukaiseen useEffenctin ylempänä
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


  return (
    <Card border="dark" className="mb-1">
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
                <ul>
                  {relatedKirja.map((kirja) => (
                    <li key={kirja.kirja_id}>{kirja.nimi}</li>
                  ))}
                </ul>
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
                <Button onClick={(e) => handleDeleteClicked()}>Poista</Button>{" "}
                
                </div>
              </Col>
            </Row>
          </>
        ) : (
          <>
            <SuccessComponent text="Tallennus onnistui" />
            <Button onClick={(e) => props.handleLisaaClicked({selectedSeries})}>Sulje</Button>
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export { EditSeries };
