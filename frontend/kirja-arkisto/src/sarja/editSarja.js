import { useState, useEffect } from "react"
import { Button, Card, Col, Row, Stack } from "react-bootstrap"

const SarjaSivu = ({ seriesList }) => {
  const [selectedSeries, setSelectedSeries] = useState(null);

  const handleSeriesClick = (series) => {
    setSelectedSeries(series);
  };
  
 
  return (
    <>
      {seriesList.map((series) => (
        <div key={series.id}>
          <h3>{series.title}</h3>
          <p>{series.description}</p>
          <Button onClick={() => handleSeriesClick(series)}>Edit series</Button>
        </div>
      ))}
      {selectedSeries && <EditSeries series={selectedSeries} />}
    </>
  );
};

const EditSeries = ({ series }) => {
  return (
    <>
      <h3>Edit series</h3>
      <form>
        <label>Title:</label>
        <input type="text" value={series.nimi} />
        <br />
        <label>Description:</label>
        <input type="text" value={series.kuvaus} />
        <br />
        <Button type="submit">Save changes</Button>
      </form>
    </>
  );
};

export { SarjaSivu };
