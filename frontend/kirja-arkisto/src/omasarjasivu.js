import { useState, useEffect } from "react"
import { Button, Col, Row, Stack } from "react-bootstrap"

const OmaSarjaSivu = () => {
  const [ListOfSeries, setListOfSeries] = useState([])
  const [selectedSeries, setSelectedSeries] = useState(null);

  return (
    <div className="mx-5">
      <div className="text-center" style={{ marginTop: "2em" }}>
        <h1>Oma sarja</h1>
      </div>
      <Row>
        <Col>
          <Stack direction="horizontal" gap={3}>
            <div className="bg-light border ms-auto"><Button variant="primary" >Lisää oma sarja</Button></div>
          </Stack>
        </Col>
      </Row>
      <Row className="mt-3" >
        <Col>
          <div className="text-center" style={{ verticalAlign: "center", lineHeight: "2.3em" }}>
            <SearchBar list={ListOfSeries} setList={setListOfSeries} setSelectedSeries={setSelectedSeries} />
          </div>
        </Col>
      </Row>
    </div>
  )
}

const SearchBar = (props) => {
  const [searchCounter, setSearchCounter] = useState(0);
  const [serieslist, SetSerieslist] = useState([]);
  const [query, setQuery] = useState("");
  const [nimi, setNimi] = useState("");

  console.log(nimi)
  console.log(searchCounter)

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
      <input onChange={(e) => setNimi(e.target.value)} style={{ width: "65%" }} placeholder="Hae omista sarjoista"></input>
      <Button variant="primary" onClick={handleSearchClick} style={{ width: "3.5em", height: "3.5em", marginLeft: "1em" }}>🔎</Button>
    </div>
  )
}

export {OmaSarjaSivu}
