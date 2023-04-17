
import { useState, useEffect } from "react";
import { Button, Card, Col, Row, Stack } from "react-bootstrap";
import {
  RequiredComponent,
  WarningComponent,
  SuccessComponent,
} from "./utilityComponents";
import { BrowserRouter as Router, Route, Routes, Link, useParams,useNavigate } from "react-router-dom";
import { useLocation} from "react-router-dom";

import theme from "./theme.json";


const AddSeries = (props) => {
  // Initialize state variables
  const [nimi, setNimi] = useState("");
  const [kuvaus, setKuvaus] = useState("");
  const [saveSuccessful, setSaveSuccessful] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const handleCancelClicked = () => {
    navigate('/sarjasivu', { replace: true });


  };
  const navigate = useNavigate();
  const handleSaveClicked = async () => {
    setShowWarning(false);

    if (nimi && kuvaus) {
      const omaKirja = {
        sarja_id: 0,
        nimi: nimi,
        kuvaus: kuvaus,
      };
      const response = await fetch("http://localhost:5000/sarja", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(omaKirja),
      });

      if (response.status === 200) {
        setSaveSuccessful(true);
      } else {
        setSaveSuccessful(false);
      }
    } else {
      setShowWarning(true);
    }
  };

  return (
    <div
      className="text-center"
      style={{
        height: "100%",
        width: "100%",
        padding: "10px",
        backgroundColor: theme.bg,
      }}
    >
      <Card border="light" className="mb-1">
        <div
          style={{
            color: "white",
            background: theme.accent,
            borderRadius: "inherit",
          }}
        >
          <Card.Body>
            {!saveSuccessful ? (
              <>
                <Card.Title>Lisää sarja</Card.Title>
                <Row className="mb-2">
                  <Col>
                    <Stack direction="vertical" gap={3} style={{ textAlign: "center" }}>
                      <div>
                        <textarea
                          onChange={(e) => setNimi(e.target.value)}
                          placeholder="nimi"
                          style={{
                            width: "60%",
                            paddingLeft: "1em",
                            backgroundColor: theme.input,
                            borderRadius: "10px",
                            color: "white",
                          }}
                        />
                        <RequiredComponent yes />
                      </div>
                      <div>
                        <textarea
                          onChange={(e) => setKuvaus(e.target.value)}
                          placeholder="kuvaus"
                          style={{
                            width: "60%",
                            paddingLeft: "1em",
                            backgroundColor: theme.input,
                            borderRadius: "10px",
                            color: "white",
                          }}
                        />
                        <RequiredComponent yes />
                      </div>
                    </Stack>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className="my-5">
                      {showWarning && (!nimi || !kuvaus) ? (
                        <WarningComponent text="Vaadittuja tietoja puuttuu" />
                      ) : (
                        <></>
                      )}
                      <Button
                        variant="success"
                        style={{ backgroundColor: theme.button }}
                        onClick={handleSaveClicked}
                        disabled={!nimi || !kuvaus}
                      >
                        Tallenna
                      </Button>
                      <Button
                        variant="dark"
                        onClick={(e) => handleCancelClicked()}
                      >
                        Peruuta
                      </Button>
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
        </div>
      </Card>
    </div>
  );
};

export { AddSeries };
