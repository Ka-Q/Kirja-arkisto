import { useState, useEffect } from "react";
import { Button, Card, Col, Row, Stack, Form } from "react-bootstrap";
import { RequiredComponent, WarningComponent, SuccessComponent } from "./utlilityComponents";
import { useNavigate } from "react-router-dom";
import theme from './theme.json'



const EditSeries = (props) => {
  const { sarja_id, onUpdate } = props;
  const navigate = useNavigate();
 
  const [selectedSeries, setSelectedSeries] = useState({});
  const [nimi, setNimi] = useState("");
  const [kuvaus, setKuvaus] = useState("");

  const [allSeries, setAllSeries] = useState([]);
  

  useEffect(() => {
    const fetchSeries = async () => {
      const f = await fetch("http://localhost:5000/oma_sarja", {
        credentials: "include",
      });
      const data = await f.json();
      const selectedSeries = data.data[0];
      setSelectedSeries(selectedSeries);
      setNimi(selectedSeries.nimi);
      setKuvaus(selectedSeries.kuvaus);
    };
    fetchSeries();
  }, [sarja_id]);
  
  useEffect(() => {
    const fetchSeries = async () => {
      const b = await fetch("http://localhost:5000/oma_sarja", {
        credentials: "include",
      });
      const allSeriesData = await b.json();
      setAllSeries(allSeriesData.data);
    };
    fetchSeries();
  }, []);
  


  const handleCancelClicked = () => {
    navigate('/omasarjasivu'); 
  };



  const handleDeleteClicked = async () => {
    const response = await fetch("http://localhost:5000/oma_sarja", {
      credentials: "include",
      method: 'DELETE',
      mode: "cors",
    });
  
    if (response.ok) {
      navigate('/omasarjasivu');
    } else {
      console.error('Failed to delete the series');
    }
  };
  

  const inputStyle = { width: "60%", paddingLeft: "1em" }


  const [sarjaFilled, setSarjaFilled] = useState(true)
  const [saveSuccessful, setSaveSuccessful] = useState(false)

  async function updateOwnSeries(updatedOwnSeries) {
    const response = await fetch(`http://localhost:5000/oma_sarja`, {
      credentials: "include",
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedOwnSeries),
    });

    if (response.ok) {
      setSaveSuccessful(true);
    } else {
      console.error('Failed to update the series');
    }
  }


  
  const handleSaveClicked =  async () => {
    console.log("Save button clicked");
    if (checkInputs()) {
      console.log("Inputs are valid");
      const updatedOwnSeries = {
        set: {
          nimi: nimi,
          kuvaus: kuvaus,
        },
        where: {
          oma_sarja_id: selectedSeries.oma_sarja_id,
        },
      };
      await updateOwnSeries(updatedOwnSeries);
      onUpdate(); // Lisää tämä rivi ilmoittamaan vanhemmalle komponentille, että sarja on päivitetty
    } else {
      console.log("Inputs are invalid");
    }
  };



  const checkInputs = () => {
    const omaSarjaOK = nimi.length > 0 && kuvaus.length > 0;

    setSarjaFilled(omaSarjaOK);

    return omaSarjaOK;
  };


  return (
    <Card border="secondary" className="mb-1" style={{ backgroundColor: theme.input, color: "white" }}>
      <Card.Body>
        {!saveSuccessful ? (
          <>
            <Card.Title>Muokkaa omaa sarjaa</Card.Title>
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
            <Button onClick={(e) => props.handleLisaaClicked({ selectedSeries })}>Sulje</Button>
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export { EditSeries }