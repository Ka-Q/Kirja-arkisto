import '../style.css';
import { Button, Card, Col, Row, Stack } from "react-bootstrap"
import { useState, useEffect } from 'react';
import { WarningComponent, ListBookCard, GridBookCard } from "./utilityComponents"
import { AddComponent } from "./addKirja"
import 'bootstrap/dist/css/bootstrap.min.css'

const KirjaSivu = (props) => {


  const [lisaaClicked, setLisaaClicked] = useState(false)
  const [lisaaBtnText, setLisaaBtnText] = useState("Lisää kirja")

  // Näytä tai piilota kirja lisäys -näkymän
  const handleLisaaClicked = () => {
    if (!lisaaClicked) {
      setLisaaClicked(true)
      setLisaaBtnText("Palaa kirjojen hakuun")
    } else {
      setLisaaClicked(false)
      setLisaaBtnText("Lisää kirja")
    }
  }


  return (
    <div  style={{backgroundColor: "#202020"}}>
    <div className='mx-3'>
      <div className='text-center' style={{ paddingTop: '2em' }}>
        <h1 style={{color: "white"}}>Kirjat</h1>
      </div>

      <Row>
        <Col>
          <Stack direction='horizontal' gap={3}>
            <div className=" ms-auto"><Button className='btn btn-dark' style={{backgroundColor: "#424242"}} onClick={(e) => handleLisaaClicked(e.target)}>{lisaaBtnText}</Button></div>
          </Stack>
        </Col>
      </Row>
      {
        !lisaaClicked ?
          <Row className="mt-3" >
            <Col>
              <div className="text-center" style={{ verticalAlign: "center", lineHeight: "2.3em" }}>
                <SearchComponent />

              </div>
            </Col>
          </Row>
          :
          <Row className="mt-3" >
            <Col>
              <div className="text-center" style={{ verticalAlign: "center", lineHeight: "2.3em" }}>
                <AddComponent handleLisaaClicked={handleLisaaClicked}/>
                
              </div>
            </Col>
          </Row>
      }
    </div>
    </div>
  )
}

const SearchComponent = (props) => {

  const [searchCounter, setSearchCounter] = useState(0);
  const [booklist, setBookList] = useState([]);
  const [query, setQuery] = useState("");
  const [nimi, setNimi] = useState("");
  const [gridView, setGridView] = useState(true)
  const [viewModeIcon, setViewModeIcon] = useState("🔳")

  let bookData = booklist.data
  let bookCardList = []
  let width = 6

  if (bookData) {
    // Jos ei tuloksia, niin viesti
    if (bookData.length == 0) {
      bookCardList = [<WarningComponent text="Haulla ei löytynyt tuloksia" key={0} />]
    }
    else {

      if (gridView) {
        // Eritellään data kaksiuloitteiseksi taulukoksi
        let bookData2D = []
        for (let i = 0; i < bookData.length; i++) {
          let row = []
          if (i == 0 || i % width == 0) {
            for (let j = 0; j < width; j++) {
              row.push(bookData[i + j])
            }
            bookData2D.push(row)
          }
        }

        // Ruudukon map
        if (bookData2D.length > 0) {
          bookCardList = bookData2D.map((n, index) => {
            // Sarakkeet riville
            let row = n.map((n2, index2) => {
              return (
                <Col xs={12} sm={6} md={6} lg={4} xl={3} xxl={2} key={index2}>
                  <GridBookCard
                    kirja={n2} >
                  </GridBookCard>
                </Col>
              )
            });
            // Rivit listaan
            return (
              <Row key={index}>
                {row}
              </Row>
            )
          });
        }
      }
        else {
        // Listan map
        if (bookData.length > 0) {
          bookCardList = bookData.map((n, index) => {
            return (
              <ListBookCard
                key={index}
                kirja={n} >
              </ListBookCard>
            )
          });
          }
        }
      }
    }

    const updateQuery = () => {
      setSearchCounter(searchCounter + 1)
      let q = "";
      if (nimi.length > 0) {
        let splitName = nimi.trim().split(' ');
        if (splitName.length > 1) {
          q += "&nimi="
          for (let i = 0; i < splitName.length; i++) {
            if (splitName[i].length > 0) q += splitName[i] + "%20";
          }
          q = q.substring(0, q.length - 3);
        } else {
          q += ("&nimi=%" + nimi.trim() + "%");
        }
      }
      setQuery(q);
    }

    // Hakee kirjat queryllä
    useEffect(() => {
      const fetchBook = async () => {
        const f = await fetch("http://localhost:5000/kirja" + "?" + query)
        const data = await f.json();
        setBookList(data)
      };
      fetchBook();
    }, [searchCounter]);

    const handleSearchClick = (props) => {
      updateQuery()
      setSearchCounter(searchCounter + 1)
    }

    const handleViewModeClick = (props) => {
      gridView ? setGridView(false) : setGridView(true)
      viewModeIcon == "🔳" ? setViewModeIcon("📃") : setViewModeIcon("🔳")
    }
    return (
      <div className="text-center" style={{ verticalAlign: "center", lineHeight: "2.3em" }}>
        <input type={"search"} onChange={(e) => setNimi(e.target.value)} style={{ width: "65%", paddingLeft: "1em", backgroundColor:"#3a3a3a", borderRadius: '100px', color: "white" }} placeholder="Hae omista kirjoista"></input>
        <Button onClick={handleSearchClick} className='btn btn-dark'  style={{backgroundColor: "#424242", width: "3.5em", height: "3.5em", marginLeft: "1em" }}>🔎</Button>
        <Button onClick={handleViewModeClick} className='btn btn-dark' style={{backgroundColor: "#424242", width: "3.5em", height: "3.5em", marginLeft: "1em" }}>{viewModeIcon}</Button>
        <div className="mx-5" style={{ marginTop: "3em", marginBottom: "25em" }}>
          {bookCardList}
        </div>

      </div>
    )
  }

  export { KirjaSivu };
