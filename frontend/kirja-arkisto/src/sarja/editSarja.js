import { useState, useEffect } from "react"
import { Button, Card, Col, Row, Stack } from "react-bootstrap"

const SarjaSivu = ({ seriesList }) => {
  const [selectedSeries, setSelectedSeries] = useState(null);

  const handleSeriesClick = (series) => {
    setSelectedSeries(series);
  };
  
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
