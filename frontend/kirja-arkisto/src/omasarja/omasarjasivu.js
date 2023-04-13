import { useState, useEffect } from "react";
import { Button, Col, Row, Stack } from "react-bootstrap";
import {WarningComponent, ListBookCard, GridBookCard,}
 from "./utlilityComponents";
import { AddComponent } from "./addOmaSarja";
import { ViewComponent } from "./viewOmaSarja";
import theme from "./theme.json";

const OmaSarjaSivu = () => {

    const [isBackButton, setIsBackButton] = useState(false)
    const [btnText, setBtnText] = useState("Lisää oma sarja")
    const [searchCounter, setSearchCounter] = useState(0);

    const [serieClicked, setSerieClicked] = useState(false)
    const [selectedSerie, setSelectedSerie] = useState(null)


    const handleButtonClicked = () => {
        if (!isBackButton) {
            setIsBackButton(true)
            setBtnText("Palaa omien sarjojen hakuun")
    
        } else {
            setIsBackButton(false)
            setBtnText("Lisää oma sarja")
            if (serieClicked) setSerieClicked(false)
        }
    }

    const handleSerieClicked = (serie) => {
        if (!serieClicked && serie) {
            setIsBackButton(true)
            setSerieClicked(true)
            setSelectedSerie(serie)
            setBtnText("Palaa omien sarjojen hakuun")
        } else {
            setSerieClicked(false)
        }
    }

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
            !isBackButton && !serieClicked ?
                <Row className="mt-3" >
                    <Col className="px-2 d-md-none">
                        <div className="text-center" style={{verticalAlign: "center", lineHeight: "2.3em"}}>
                            <SearchComponent serieClicked={handleSerieClicked}/>
                        </div>
                    </Col>
                    <Col className="px-5 d-none d-md-block">
                        <div className="text-center" style={{verticalAlign: "center", lineHeight: "2.3em"}}>
                            <SearchComponent serieClicked={handleSerieClicked}/>
                        </div>
                    </Col>
                </Row>
            :
            isBackButton && !serieClicked?
                <Row className="mt-3" >
                    <Col>
                    <div className="text-center" style={{verticalAlign: "center", lineHeight: "2.3em"}}>
                        <AddComponent handleLisaaClicked={handleButtonClicked} handleSarjanLisays={() => setSearchCounter(searchCounter + 1)} />

                    </div>
                    </Col>
                </Row>
            :
            <Row className="mt-3" >
                <Col>
                <div className="text-center" style={{verticalAlign: "center", lineHeight: "2.3em"}}>
                    <ViewComponent omakirja={selectedSerie}/>
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
    const [serieList, setSerieList] = useState([]);
    const [query, setQuery] = useState("");
    const [nimi, setNimi] = useState("");
    const [kuvaus, setKuvaus] = useState("");

    const [gridView, setGridView] = useState(true)
    const [viewModeIcon, setViewModeIcon] = useState("🔳")
    const [ownSeriesGrid, setOwnSeriesGrid] = useState([]);

    const serieClicked = props.serieClicked

    

  const fetchOwnSeries = async () => {
    const response = await fetch("http://localhost:5000/oma_sarja", {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();
    setSerieList(data);
  };

  useEffect(() => {
    fetchOwnSeries();
  }, [searchCounter]);

  let serieData = serieList;
    let BookCardList = []
    let width = 6
    
    if (serieData) {
 
        if (serieData.length == 0 ) {
            BookCardList = [<WarningComponent text="Haulla ei löytynyt tuloksia" key={0}/>]
        }
        else {
            
            if (gridView) {
  
                let serieData2D = []
                for (let i = 0; i < serieData.length; i++) {
                    let row = []
                    if (i == 0 || i % width == 0) {
                        for (let j = 0; j < width; j++) {
                            row.push(serieData[i+j])
                        }
                        serieData2D.push(row)
                    }
                }
  
                if (serieData2D.length > 0){
                    BookCardList = serieData2D.map((n, index) => {
              
                        let row = n.map((n2, index2) => {
                            return(
                                <Col xs={12} sm={6} md={6} lg={4} xl={3} xxl={2} key={index2} onClick={(e) => serieClicked(n2)}>
                                    <GridBookCard
                                        omakirja={n2} >
                                    </GridBookCard>
                                </Col>
                            )
                        });

                        return (
                            <Row key={index}>
                                {row}
                            </Row>
                        )
                    });
                } 
            }
            else {

                if (serieData.length > 0){
                    BookCardList = serieData.map((n, index) => {
                        return (
                            <div onClick={(e) => serieClicked(n)} style={{cursor:"pointer"}} key={index}>
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

    const updateQuery = () => {
        setSearchCounter(searchCounter + 1)
        let q = "";
        if (nimi.length > 0) {
            q = ("&sarjan_nimi=%" + nimi.trim() + "%");
        }
        setQuery(q)
    }

    useEffect(() => {
        const fetchOwnSerie = async () => {
            console.log(query);
            const f = await fetch("http://localhost:5000/oma_sarja" + "?" + query, {
                method: "GET",
                credentials: "include"
            })
            const data = await f.json();
            console.log(data)
            setSerieList(data)
        };
        fetchOwnSerie();
    }, [searchCounter]);

  
   


    const handleSearchClick = (props) => {
        updateQuery()
        setSearchCounter(searchCounter + 1)
    }

    const handleViewModeClick = (props) => {
        gridView?setGridView(false):setGridView(true)
        viewModeIcon=="🔳"?setViewModeIcon("📃"):setViewModeIcon("🔳")
    }

    return (
        <div>
            <div className="text-center">
                <h1 style={{color: "white"}}>Omat sarjasi</h1>
            </div>
            <div className="text-center" style={{verticalAlign: "center", lineHeight: "2.3em"}}>
                <input type={"search"} onChange={(e) => setNimi(e.target.value)} style={{width: "65%", paddingLeft: "1em", backgroundColor: theme.input, borderRadius: '100px', color: "white" }} placeholder="Hae omista sarjoista"></input>
                <Button onClick={handleSearchClick} className='btn btn-dark' style={{width: "3.5em", height: "3.5em", marginLeft: "1em", backgroundColor: theme.button}}>🔎</Button>
                <Button onClick={handleViewModeClick} className='btn btn-dark'  style={{width: "3.5em", height: "3.5em", marginLeft: "1em", backgroundColor: theme.button}}>{viewModeIcon}</Button>
                <div style={{marginTop: "3em", marginBottom: "25em"}}>
                    {BookCardList}
                </div>
            </div>
        </div>
    )
}

export {OmaSarjaSivu}