import { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";

const OmaSarjaSivu = (props) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event) => {
    event.preventDefault();
  };

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Container>
      <Row className="my-5">
        <Col>
        <div className="text-center" style={{marginTop: "2em"}}>
        <h1>Oma sarja</h1>
            </div>
        </Col>
      </Row>
      <Row>
        <Col>
        <Form onSubmit={handleSearch}>
  <Form.Group className="position-relative d-flex">
    <Form.Control
      type="text"
      placeholder="Hae omista sarjoista"
      value={searchTerm}
      onChange={handleInputChange}
      style={{ marginRight: "1cm" }}
    />
    <Button
      variant="secondary"
      onClick={handleSearch}
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        width: "3.5em",
        height: "3.5em",
      }}
    >
      🔎
    </Button>
  </Form.Group>
</Form>


        </Col>
      </Row>
    </Container>
  );
};

export {OmaSarjaSivu}