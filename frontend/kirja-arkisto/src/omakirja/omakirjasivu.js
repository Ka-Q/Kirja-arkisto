import { useState, useEffect } from "react"
import { Button, Col, Row, Stack } from "react-bootstrap"
import { WarningComponent, ListBookCard, GridBookCard } from "./utlilityComponents"
import { AddComponent } from "./addOmaKirja"

//Tyyliä
import './omakirjaStyle.css'
import { ViewComponent } from "./viewOmaKirja"

const OmaKirjaSivu = () => {

    const [isBackButton, setIsBackButton] = useState(false)
    const [btnText, setBtnText] = useState("Lisää oma kirja")

    const [bookClicked, setBookClicked] = useState(false)
    const [selectedBook, setSelectedBook] = useState(null)

    // Näyttää ja/tai piilottaa oman kirja lisäys -näkymän
    const handleButtonClicked = () => {
        if (!isBackButton) {
            setIsBackButton(true)
            setBtnText("Palaa omien kirjojen hakuun")
            //if (bookClicked) setBookClicked(false)
        } else {
            setIsBackButton(false)
            setBtnText("Lisää oma kirja")
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

    return (
        <div  style={{backgroundColor: "#202020"}}>
        <div className="mx-3 pt-5">
            <Row>
                <Col>
                    <Stack direction="horizontal" gap={3}>
                        <div className="ms-auto"><Button className='btn btn-dark' style={{backgroundColor: "#424242"}} onClick={(e) => handleButtonClicked(e.target)}>{btnText}</Button></div>
                    </Stack>
                </Col>
            </Row>
            {
            !isBackButton && !bookClicked ?
                <Row className="mt-3" >
                    <Col>
                    <div className="text-center" style={{verticalAlign: "center", lineHeight: "2.3em"}}>
                        <SearchComponent bookClicked={handleBookClicked}/>
                    </div>
                    </Col>
                </Row>
            :
            isBackButton && !bookClicked?
                <Row className="mt-3" >
                    <Col>
                    <div className="text-center" style={{verticalAlign: "center", lineHeight: "2.3em"}}>
                        <AddComponent handleLisaaClicked={handleButtonClicked}/>
                    </div>
                    </Col>
                </Row>
            :
            <Row className="mt-3" >
                <Col>
                <div className="text-center" style={{verticalAlign: "center", lineHeight: "2.3em"}}>
                    <ViewComponent omakirja={selectedBook}/>
                </div>
                </Col>
            </Row>
            }
        </div>
        </div>
    )
}

// Komponentti hakukentälle. Tekee sumean haun oman kirjan nimellä ja asettaa tulokset hakukentän alle listana tai ruudukkona
const SearchComponent = (props) => {

    const [searchCounter, setSearchCounter] = useState(0);
    const [bookList, setBookList] = useState([]);
    const [query, setQuery] = useState("");
    const [nimi, setNimi] = useState("");

    const [gridView, setGridView] = useState(true)
    const [viewModeIcon, setViewModeIcon] = useState("🔳")

    const bookClicked = props.bookClicked

    //Data JSON:ista korteiksi joko ruudukkoon tai listaan
    let bookData = bookList.data
    let BookCardList = []
    let width = 6
    
    if (bookData) {
        // Jos ei tuloksia, niin viesti
        if (bookData.length == 0 ) {
            BookCardList = [<WarningComponent text="Haulla ei löytynyt tuloksia" key={0}/>]
        }
        else {
            
            if (gridView) {
                // Eritellään data kaksiuloitteiseksi taulukoksi
                let bookData2D = []
                for (let i = 0; i < bookData.length; i++) {
                    let row = []
                    if (i == 0 || i % width == 0) {
                        for (let j = 0; j < width; j++) {
                            row.push(bookData[i+j])
                        }
                        bookData2D.push(row)
                    }
                }

                // Ruudukon map
                if (bookData2D.length > 0){
                    BookCardList = bookData2D.map((n, index) => {
                        // Sarakkeet riville
                        let row = n.map((n2, index2) => {
                            return(
                                <Col xs={12} sm={6} md={6} lg={4} xl={3} xxl={2} key={index2} onClick={(e) => bookClicked(n2)}>
                                    <GridBookCard
                                        omakirja={n2} >
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
                if (bookData.length > 0){
                    BookCardList = bookData.map((n, index) => {
                        return (
                            <div onClick={(e) => bookClicked(n)} style={{cursor:"pointer"}} key={index}>
                                <ListBookCard  
                                    omakirja={n} >
                                </ListBookCard>
                            </div>
                        )
                    });
                }
            }
        }
    }
    
    // Päivittää reaaliajassa queryä
    const updateQuery = () => {
        setSearchCounter(searchCounter + 1)
        let q = "";
        if (nimi.length > 0) {
            let splitName = nimi.trim().split(' ');
            if (splitName.length > 1) {
                q += "&kirjan_nimi="
                for (let i = 0; i < splitName.length; i++) {
                    if (splitName[i].length > 0) q += splitName[i] + "%20";
                }
                q = q.substring(0, q.length-3);
            } else {
                q += ("&kirjan_nimi=%" + nimi.trim() + "%");
            }
        }
        setQuery(q)
    }

    // Hakee omat kirjat queryllä
    useEffect(() => {
        const fetchOwnBook = async () => {
            const f = await fetch("http://localhost:5000/oma_kirja_kaikella" + "?" + query, {
                method: "GET",
                credentials: "include"
            })
            const data = await f.json();
            console.log(data)
            setBookList(data)
        };
        fetchOwnBook();
    }, [searchCounter]);

    // Laukaisee ylemmän useEffectin searchCounterin avulla.
    const handleSearchClick = (props) => {
        updateQuery()
        setSearchCounter(searchCounter + 1)
    }

    // Laukaisee ylemmän useEffectin searchCounterin avulla.
    const handleViewModeClick = (props) => {
        gridView?setGridView(false):setGridView(true)
        viewModeIcon=="🔳"?setViewModeIcon("📃"):setViewModeIcon("🔳")
    }

    return (
        <div>
            <div className="text-center">
                <h1 style={{color: "white"}}>Oma kirja</h1>
            </div>
            <div className="text-center" style={{verticalAlign: "center", lineHeight: "2.3em"}}>
                <input type={"search"} onChange={(e) => setNimi(e.target.value)} style={{width: "65%", paddingLeft: "1em", backgroundColor:"#3a3a3a", borderRadius: '100px', color: "white" }} placeholder="Hae omista kirjoista"></input>
                <Button onClick={handleSearchClick} className='btn btn-dark' style={{width: "3.5em", height: "3.5em", marginLeft: "1em", backgroundColor: "#424242"}}>🔎</Button>
                <Button onClick={handleViewModeClick} className='btn btn-dark'  style={{width: "3.5em", height: "3.5em", marginLeft: "1em", backgroundColor: "#424242"}}>{viewModeIcon}</Button>
                <div  className="mx-5" style={{marginTop: "3em", marginBottom: "25em"}}>
                    {BookCardList}
                </div>
                {/*<Logincomponent/>*/}
            </div>

        </div>
    )
}

const Logincomponent = () => {

    const [sposti, setSposti] = useState("");
    const [salasana, setSalasana] = useState("");
    const [clickCounter, setClickCounter] = useState(0);
    const [clickCounter2, setClickCounter2] = useState(0);
    const [clickCounter3, setClickCounter3] = useState(0);

    useEffect(() => {
        const sendAuth = async () => {
            const f = await fetch("http://localhost:5000/login", {
                credentials: "include",
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({sposti: sposti, salasana: salasana})
            })
            const data = await f.json();
            console.log(data);
        };
        if (clickCounter > 0) sendAuth();
    }, [clickCounter]);

    useEffect(() => {
        const sendAuth = async () => {
            const f = await fetch("http://localhost:5000/logout", {
                credentials: "include",
                method: 'POST'
            })
            const data = await f.json();
            console.log(data);
        };
        if (clickCounter2 > 0) sendAuth();
    }, [clickCounter2]);

    useEffect(() => {
        const sendAuth = async () => {
            const f = await fetch("http://localhost:5000/check_login", {
                credentials: "include",
                method: 'GET'
            })
            const data = await f.json();
            console.log(data.data);
        };
        if (clickCounter3 > 0) sendAuth();
    }, [clickCounter3]);


    const handleClick = () => {
        setClickCounter(clickCounter + 1);
    }
    const handleClick2 = () => {
        setClickCounter2(clickCounter2 + 1);
    }
    const handleClick3 = () => {
        setClickCounter3(clickCounter3 + 1);
    }

    return (
        <>
            <input placeholder="sposti" onChange={(e) => setSposti(e.target.value)}/>
            <input placeholder="salasana" onChange={(e) => setSalasana(e.target.value)}/>
            <button onClick={(e) => handleClick()}>Kirjaudu</button>
            <button onClick={(e) => handleClick2()}>Kirjaudu ulos</button>
            <button onClick={(e) => handleClick3()}>/check_login</button>
        </>

    )
}

export {OmaKirjaSivu}