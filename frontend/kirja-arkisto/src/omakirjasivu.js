import { useState, useEffect } from "react"
import { Button, Card, Col, Row, Stack } from "react-bootstrap"

const OmaKirjaSivu = () => {

    const [listOfOwnBooks, setListOfOwnBooks] = useState([])

    return (
        <div className="mx-5">
            <div className="text-center" style={{marginTop: "2em"}}>
                <h1>Oma kirja</h1>
            </div>
            <Row>
                <Col>
                    <Stack direction="horizontal" gap={3}>
                        <div className="bg-light border ms-auto"><Button >Lisää</Button></div>
                        <div className="bg-light border"><Button>Muokkaa</Button></div>
                        <div className="bg-light border"><Button>Poista</Button></div>
                    </Stack>
                </Col>
            </Row>
            <Row className="mt-3" >
                <Col>
                <div className="text-center" style={{verticalAlign: "center", lineHeight: "2.3em"}}>
                    <SearchBar list={listOfOwnBooks} setList={setListOfOwnBooks}/>
                </div>
                </Col>
            </Row>
        </div>
    )
}

const SearchBar = (props) => {

    const [searchCounter, setSearchCounter] = useState(0);
    const [bookList, setBookList] = useState([]);
    const [query, setQuery] = useState("");
    const [nimi, setNimi] = useState("");
    console.log(nimi)
    console.log(bookList.data)

    //Mapping JSON to BookCards
    let bookData = bookList.data
    let BookCardList = []

    if (bookData) {
        BookCardList = bookData.map((n, index) => {
            return (
                <BookCard 
                    key={index} 
                    omakirja={n} >
                </BookCard>
            )
        })
    }
    
    const updateQuery = () => {
        setSearchCounter(searchCounter + 1)
        let q = "";
        if (nimi.length > 0) {
            let splitName = nimi.split(' ');
            if (splitName.length > 1) {
                q += "&kirjan_nimi="
                for (let wrd in splitName) {
                    q += wrd + "%20"
                }
                q = q.substring(0, q.length-3)
            } else {
                q += ("&kirjan_nimi=%" + nimi + "%");
            }
        }
        console.log(q)
        setQuery(q)
    }

    useEffect(() => {
        const fetchOwnBook = async () => {
            const f = await fetch("http://localhost:5000/oma_kirja_kaikella" + "?" + query)
            const data = await f.json();
            setBookList(data)
        };
        if (searchCounter != 0) {
            fetchOwnBook();
        }
    }, [searchCounter]);

    const handleSearchClick = (props) => {
        updateQuery()
        setSearchCounter(searchCounter + 1)
    }

    return (
        <div className="text-center" style={{verticalAlign: "center", lineHeight: "2.3em"}}>
            <input onChange={(e) => setNimi(e.target.value)} style={{width: "65%"}} placeholder="Hae omista kirjoista"></input>
            <Button onClick={handleSearchClick} style={{width: "3.5em", height: "3.5em", marginLeft: "1em"}}>🔎</Button>
            <div style={{marginTop: "3em"}}>
                {BookCardList}
            </div>
        </div>
    )
}

const BookCard = (props) => {
    let omakirja = props.omakirja
    let kirja = omakirja.kirja
    return (
        <Card border="dark" className="mb-1">
            <Card.Body>
                <Card.Title>{kirja.nimi}</Card.Title>
                <Card.Text>
                    Kuntoluokka: {omakirja.kuntoluokka} <p> </p>
                    Hankittu: {omakirja.hankinta_aika}
                </Card.Text>
            </Card.Body>
        </Card>
    )
}

export {OmaKirjaSivu}