import '../style.css';
import { Button, Card, Col, Row, Stack } from "react-bootstrap"
import { useState, useEffect } from 'react';
import { WarningComponent, ListBookCard, GridBookCard } from "./utilityComponents"
import { AddComponent } from "./addKirja"
import 'bootstrap/dist/css/bootstrap.min.css'
import { ViewComponent } from './viewKirja';

const KirjaSivu = (props) => {



  const [isBackButton, setIsBackButton] = useState(false)
  const [btnText, setBtnText] = useState("Lisää oma kirja")

  const [bookClicked, setBookClicked] = useState(false)
  const [selectedBook, setSelectedBook] = useState(null)


  //console.log('backbutton', isBackButton, 'bookclicked', bookClicked)

  // Näytä tai piilota kirja lisäys -näkymän
  const handleButtonClicked = () => {
    if (!isBackButton) {
      setIsBackButton(true)
      setBtnText("Palaa kirjojen hakuun")
    } else {
      setIsBackButton(false)
      setBtnText("Lisää kirja")
      if (bookClicked) setBookClicked(false)
    }
  }

  const handleBookClicked = (book) => {

    if (!bookClicked && book) {
      setIsBackButton(true)
      setBookClicked(true)
      setSelectedBook(book)
      setBtnText("Palaa omien kirjojen hakuun")
    } else {
      setBookClicked(false)
    }
  }

  const LineHeight = "2.3em"

  return (
    <div style={{ backgroundColor: "#202020" }}>
      <div className='mx-3'>
        <div className='text-center' style={{ paddingTop: '2em' }}>
          <h1 style={{ color: "white" }}>Kirjat</h1>
        </div>

        <Row>
          <Col>
            <Stack direction='horizontal' gap={3}>
              <div className=" ms-auto"><Button className='btn btn-dark' style={{ backgroundColor: "#424242" }} onClick={(e) => handleButtonClicked(e.target)}>{btnText}</Button></div>
            </Stack>
          </Col>
        </Row>
        {
          !isBackButton && !bookClicked ?
            <Row className="mt-3" >
              <Col className="px-2 d-md-none">
                <div className="text-center" style={{ verticalAlign: "center", lineHeight: LineHeight }}>
                  <SearchComponent bookClicked={handleBookClicked} />
                </div>
              </Col>
              <Col className="px-5 d-none d-md-block">
                <div className="text-center" style={{ verticalAlign: "center", lineHeight: LineHeight }}>
                  <SearchComponent bookClicked={handleBookClicked} />
                </div>
              </Col>
            </Row>
            :
            isBackButton && !bookClicked ?
              <Row className="mt-3" >
                <Col>
                  <div className="text-center" style={{ verticalAlign: "center", lineHeight: LineHeight }}>
                    <AddComponent handleLisaaClicked={handleButtonClicked} />
                  </div>
                </Col>
              </Row>
              :
              <Row className="mt-3" >{console.log('tere')}
                <Col>
                  <div className="text-center" style={{ verticalAlign: "center", lineHeight: LineHeight }}>
                    <ViewComponent omakirja={selectedBook} />
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

  const bookClicked = props.bookClicked

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
              <div style={{ cursor: "pointer" }} key={index}>
                <ListBookCard
                  kirja={n} >
                </ListBookCard>
              </div>
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
      q = ("&nimi=%" + nimi.trim() + "%");
    }
    setQuery(q);
  }

  // Hakee kirjat queryllä
  useEffect(() => {
    const fetchBook = async () => {
      const f = await fetch("http://localhost:5000/kirja_kaikella" + "?" + query)
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
      <input type={"search"} onChange={(e) => setNimi(e.target.value)} style={{ width: "65%", paddingLeft: "1em", backgroundColor: "#3a3a3a", borderRadius: '100px', color: "white" }} placeholder="Hae omista kirjoista"></input>
      <Button onClick={handleSearchClick} className='btn btn-dark' style={{ backgroundColor: "#424242", width: "3.5em", height: "3.5em", marginLeft: "1em" }}>🔎</Button>
      <Button onClick={handleViewModeClick} className='btn btn-dark' style={{ backgroundColor: "#424242", width: "3.5em", height: "3.5em", marginLeft: "1em" }}>{viewModeIcon}</Button>
      <div className="mx-5" style={{ marginTop: "3em", marginBottom: "25em" }}>
        {bookCardList}
      </div>

    </div>
  )
}

export { KirjaSivu };
