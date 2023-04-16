import { useState, useEffect } from "react"
import { Button, Col, Collapse, Dropdown, Fade, Row, Stack } from "react-bootstrap"
import { WarningComponent, ListBookCard, GridBookCard } from "./utlilityComponents"
import { AddComponent } from "./addOmaKirja"

//Tyyliä
import './omakirjaStyle.css'
import theme from './theme.json'

const OmaKirjaSivu = () => {

    const [isBackButton, setIsBackButton] = useState(false)
    const [btnText, setBtnText] = useState("Lisää oma kirja")

    // Näyttää ja/tai piilottaa oman kirja lisäys -näkymän
    const handleButtonClicked = () => {
        if (!isBackButton) {
            setIsBackButton(true)
            setBtnText("Palaa omien kirjojen hakuun")
        } else {
            setIsBackButton(false)
            setBtnText("Lisää oma kirja")
        }
    }

    const LineHeight = "2.3em"

    return (
        <div  style={{backgroundColor: theme.bg, paddingBottom: "20%"}}>
            <div className="mx-3 pt-5">
                <Row>
                    <Col>
                        <Stack direction="horizontal" gap={3}>
                            <div className="ms-auto"><Button className='btn btn-dark' style={{backgroundColor: theme.button}} onClick={(e) => handleButtonClicked(e.target)}>{btnText}</Button></div>
                        </Stack>
                    </Col>
                </Row>
                {
                !isBackButton?
                    <SearchComponent/>
                :
                    <Row className="mt-3" >
                        <Col>
                        <div className="text-center" style={{verticalAlign: "center", lineHeight: LineHeight}}>
                            <AddComponent handleLisaaClicked={handleButtonClicked}/>
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

    // Yleinen haku
    const [searchCounter, setSearchCounter] = useState(0);
    const [fetchData, setFetchData] = useState([]);
    const [query, setQuery] = useState("");
    const [nimi, setNimi] = useState("");

    // Ruudukko vai lista?
    const [gridView, setGridView] = useState(true)
    const [viewModeIcon, setViewModeIcon] = useState("🔳")

    // Lisäasetuksia haulle
    const [moreClicked, setMoreClicked] = useState(false);
    const [order, setOrder] = useState("id")
    const [filterAuthor, setFilterAuthor] = useState(false)
    const [author, setAuthor] = useState("")
    const [filterStars, setFilterStars] = useState(-1)

    // Hakee omat kirjat queryllä
    useEffect(() => {
        const fetchOwnBook = async () => {
            console.log(query);
            const f = await fetch("http://localhost:5000/oma_kirja_kaikella" + "?" + query, {
                method: "GET",
                credentials: "include"
            })
            const data = await f.json();
            console.log(data)
            setFetchData(data)
        };
        fetchOwnBook();
    }, [searchCounter]);

    // Päivittää queryä
    const updateQuery = () => {
        let q = "";
        if (nimi.length > 0) q += "&kirjan_nimi=%" + nimi.trim() + "%"
        if (filterAuthor) q += "&kirjailijat=%" + author.trim() + "%"
        if (filterStars >= 0)  q += "&kuntoluokka=" + filterStars
        setQuery(q)
    }
    
    // Järjestetään hakutulokset halutulla tavalla
    let bookData = sortBy(fetchData.data, order)
    
    //Data JSON:ista korteiksi joko ruudukkoon tai listaan
    let BookCardList = []
    if ((fetchData.message + "").includes("(no user)")){
        BookCardList = [<WarningComponent text="Sinun on kirjauduttava sisään tarkastellaksesi omia kirjojasi." key={0}/>]
    }
    if (bookData) {
        BookCardList = mapToList(bookData, gridView)
    }

    // Kasaa queryn ja suorittaa haun
    const handleSearchClick = () => {
        updateQuery()
        setSearchCounter(searchCounter + 1)
    }

    // Vaihtaa ruudukon ja listan välillä
    const handleViewModeClick = () => {
        gridView?setGridView(false):setGridView(true)
        viewModeIcon=="🔳"?setViewModeIcon("📃"):setViewModeIcon("🔳")
    }

    let moreIcon = "➕";
    if (moreClicked) moreIcon = "➖"

    let LineHeight = "2.3em"

    return (
        <Row className="mt-3" >
            <Col className="px-2">
            <div className="text-center" style={{verticalAlign: "center", lineHeight: LineHeight}}>
                    <div>
                        <div className="text-center">
                            <h1 style={{color: "white"}}>Omat kirjasi</h1>
                        </div>
                        <div className="text-center" style={{verticalAlign: "center", lineHeight: "2.3em"}}>
                            <Button onClick={(e) => handleViewModeClick()} className='btn btn-dark'  style={{width: "3.5em", height: "3.5em", marginRight: "1em", backgroundColor: theme.button}}>{viewModeIcon}</Button>
                            <input type={"search"} onChange={(e) => setNimi(e.target.value)} style={{width: "55%", paddingLeft: "1em", backgroundColor: theme.input, borderRadius: '100px', color: "white" }} placeholder="Hae omista kirjoista"></input>
                            <Button onClick={(e) => handleSearchClick()} className='btn btn-dark' style={{width: "3.5em", height: "3.5em", marginLeft: "1em", backgroundColor: theme.button}}>🔎</Button>
                            <Button onClick={(e) => setMoreClicked(!moreClicked)} className='btn btn-dark'  style={{width: "3.5em", height: "3.5em", marginLeft: "1em", backgroundColor: theme.button}}>{moreIcon}</Button>
                            <Collapse in={moreClicked} className="mt-3">
                                <div>
                                    <div className="mb-2" style={{height: "0.2em", width: "100%", backgroundColor: theme.input, borderRadius: "1em"}}/>
                                    <Dropdown style={{display: "inline"}}>
                                        <Dropdown.Toggle variant="dark" style={{backgroundColor: theme.button, height: "3.5em"}}>{convertOrder(order)}</Dropdown.Toggle>
                                        <Dropdown.Menu variant="dark" style={{backgroundColor: "#131415"}}>
                                            <Dropdown.Item onClick={(e) => setOrder("id")}>Lisäysjärjestys</Dropdown.Item>
                                            <Dropdown.Item onClick={(e) => setOrder("ar")}>Aakkosellinen (A-Ö)</Dropdown.Item>
                                            <Dropdown.Item onClick={(e) => setOrder("ad")}>Aakkosellinen (Ö-A)</Dropdown.Item>
                                            <Dropdown.Item onClick={(e) => setOrder("dr")}>Hankinta-aika (V-U)</Dropdown.Item>
                                            <Dropdown.Item onClick={(e) => setOrder("dd")}>Hankinta-aika (U-V)</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    <Dropdown style={{display: "inline"}}>
                                        <Dropdown.Toggle variant="dark" style={{backgroundColor: theme.button, height: "3.5em", marginLeft: "1em"}}>{convertStars(filterStars)}</Dropdown.Toggle>
                                        <Dropdown.Menu variant="dark" style={{backgroundColor: "#131415"}}>
                                            <Dropdown.Item onClick={(e) => setFilterStars(-1)}>{convertStars(-1)}</Dropdown.Item>
                                            <Dropdown.Item onClick={(e) => setFilterStars(0)}>{convertStars(0)}</Dropdown.Item>
                                            <Dropdown.Item onClick={(e) => setFilterStars(1)}>{convertStars(1)}</Dropdown.Item>
                                            <Dropdown.Item onClick={(e) => setFilterStars(2)}>{convertStars(2)}</Dropdown.Item>
                                            <Dropdown.Item onClick={(e) => setFilterStars(3)}>{convertStars(3)}</Dropdown.Item>
                                            <Dropdown.Item onClick={(e) => setFilterStars(4)}>{convertStars(4)}</Dropdown.Item>
                                            <Dropdown.Item onClick={(e) => setFilterStars(5)}>{convertStars(5)}</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    <Fade in={filterAuthor} dimension={"width"}>
                                        {filterAuthor? 
                                            <input onChange={(e) => setAuthor(e.target.value)} type="search" placeholder="Kirjailijan nimi" style={{width: "20em", paddingLeft: "1em", marginLeft: "1em" , backgroundColor: theme.input, borderRadius: '2em', color: "white"}}/>
                                        :<></>}
                                    </Fade>
                                    <Button onClick={(e) => setFilterAuthor(!filterAuthor)} className='btn btn-dark' style={{height: "3.5em", minWidth: "3.5em", marginLeft: "1em", backgroundColor: theme.button}}>{convertAuthor(filterAuthor)}</Button>
                                    <div className="mt-2" style={{height: "0.2em", width: "100%", backgroundColor: theme.input, borderRadius: "1em"}}/>
                                </div>
                            </Collapse>
                            <div style={{marginTop: "3em", marginBottom: "25em"}}>
                                {BookCardList}
                            </div>
                        </div>
                    </div>
                </div>
            </Col>
        </Row>
    )
}

const convertAuthor = (filterAuthor) => {
    if (filterAuthor) return "❌";
    return "Rajaa kirjailijalla"
}

const convertOrder = (order) => {
    if (order == "id") return "Lisäysjärjestys";
    if (order == "ar") return "(A-Ö)";
    if (order == "ad") return "(Ö-A)";
    if (order == "dr") return "(V-U)";
    if (order == "dd") return "(U-V)";
}

const convertStars = (stars) => {
    if (stars == -1) return "Kaikki kuntoluokat";
    if (stars == 0) return "⚫⚫⚫⚫⚫";
    if (stars == 1) return "⭐⚫⚫⚫⚫";
    if (stars == 2) return "⭐⭐⚫⚫⚫";
    if (stars == 3) return "⭐⭐⭐⚫⚫";
    if (stars == 4) return "⭐⭐⭐⭐⚫";
    if (stars == 5) return "⭐⭐⭐⭐⭐";
}

const sortBy = (bookList, order) => {

    if(!bookList) return bookList;

    if (order == "id") return bookList.sort((a, b) => {
        if (a.oma_kirja_id > b.oma_kirja_id) return 1
        if (a.oma_kirja_id < b.oma_kirja_id) return -1
        return 0
    })

    if (order == "ar") return bookList.sort((a, b) => {
        if (a.kirja.nimi > b.kirja.nimi) return 1
        if (a.kirja.nimi < b.kirja.nimi) return -1
        return 0
    })

    if (order == "ad") return bookList.sort((a, b) => {
        if (a.kirja.nimi > b.kirja.nimi) return -1
        if (a.kirja.nimi < b.kirja.nimi) return 1
        return 0
    })

    if (order == "dr") return bookList.sort((a, b) => {
        if (new Date(a.hankinta_aika).getTime() > new Date(b.hankinta_aika).getTime()) return 1
        if (new Date(a.hankinta_aika).getTime() < new Date(b.hankinta_aika).getTime()) return -1
        return 0
    })

    if (order == "dd") return bookList.sort((a, b) => {
        if (new Date(a.hankinta_aika).getTime() > new Date(b.hankinta_aika).getTime()) return -1
        if (new Date(a.hankinta_aika).getTime() < new Date(b.hankinta_aika).getTime()) return 1
        return 0
    })
}

const mapToList = (bookData, gridView) => {

    let width = 6
    let BookCardList = [];

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
                            <Col xs={12} sm={6} md={6} lg={4} xl={3} xxl={2} key={index2}>
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
                        <div style={{cursor:"pointer"}} key={index}>
                            <ListBookCard  
                                omakirja={n} >
                            </ListBookCard>
                        </div>
                    )
                });
            }
        }
    }
    return BookCardList
}


export {OmaKirjaSivu}