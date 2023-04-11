import { useState } from "react"
import { Button, Image,  Stack } from "react-bootstrap"
import theme from './theme.json'

const KuvaViewerComponent = (props) => {

    const [clickedPic, setClickedPic] = useState(props.kuvat[0]);
    const [rollIndex, setRollIndex] = useState(0);

    const width = 5


    if (!props.kuvat || props.kuvat.length == 0) return (<></>)

    let kuvaSrc = "http://localhost:5000/kuvatiedosto?kuva=";
    let kuvat = props.kuvat

    const handleIncrease = () => {
        if (rollIndex < kuvat.length - width) setRollIndex(rollIndex + 1);
    }
    const handleDecrease = () => {
        if (rollIndex > 0) setRollIndex(rollIndex - 1);
    }

    let kuvatSorted = sortByTyyppi(kuvat)

    let previewList = mapKuvaToPreviews(kuvaSrc, clickedPic, setClickedPic)

    let remainingImages = kuvat.length - rollIndex - width
    if (remainingImages < 0) remainingImages = 0
    
    let BtnStyle = {backgroundColor:  theme.button};

    return(
        <div>
            <div className="mx-auto" style={{width:"100%", height: "auto", marginBottom: "1em"}}>
                <a onClick={(e) => window.open(kuvaSrc + clickedPic.kuva, '_blank').focus()} style={{cursor:"pointer"}}>
                <Image src={kuvaSrc + clickedPic.kuva} fluid style={{width:"100%"}}/>
                </a>
            </div>
            <Stack direction="horizontal" gap={1}>
                <Button onClick={(e) => handleDecrease()} className='btn btn-dark' style={BtnStyle}> {"< " + rollIndex} </Button>
                {previewList}
                <Button onClick={(e) => handleIncrease()} className='btn btn-dark' style={BtnStyle}> {"> " + (remainingImages)} </Button>
            </Stack>
            <div style={{textAlign: "left"}}>
                Tyyppi: {clickedPic.kuva_tyyppi_id}<br/>
                Taiteilija: {clickedPic.taiteilija} ({clickedPic.julkaisuvuosi}) <br/>
                Tyyli: {clickedPic.tyyli} <br/>
                Kuvaus: {clickedPic.kuvaus} <br/>
            </div>
        </div>
    )
}

const sortByTyyppi = (kuvat) => {
    return kuvat.sort((a, b) => {
        if (a.kuva_tyyppi_id < b.kuva_tyyppi_id) return -1
        if (a.kuva_tyyppi_id > b.kuva_tyyppi_id) return 1
        return 0
    });
}

const mapKuvaToPreviews = (list, kuvaSrc, clickedPic, setClickedPic) => {
    let previewList = list.map((n, index) => {
        let style = {width: "20%"};
        let clickedStyle = {width: "20%", border: "2px solid black", borderRadius: "5px"}
        
        if (clickedPic.kuva_id == n.kuva_id){
            return (
                <div key={index} onClick={(e) => setClickedPic(n)} style={clickedStyle}>
                    <Image src={kuvaSrc + n.kuva} thumbnail fluid/>
                </div>
            )
        }
        return (
            <div key={index} onClick={(e) => setClickedPic(n)} style={style}>
                <Image src={kuvaSrc + n.kuva} thumbnail fluid/>
            </div>
        )
    });
    return previewList
}

const ValokuvaViewerComponent = (props) => {

  
    const [clickedPic, setClickedPic] = useState(props.valokuvat[0]);
    const [rollIndex, setRollIndex] = useState(0);

    const width = 5


    if (!props.valokuvat || props.valokuvat.length == 0) return (<></>)

    let kuvaSrc = "http://localhost:5000/valokuvatiedosto?valokuva=";
    let valokuvat = props.valokuvat

  
    const handleIncrease = () => {
        if (rollIndex < valokuvat.length - width) setRollIndex(rollIndex + 1);
    }
    const handleDecrease = () => {
        if (rollIndex > 0) setRollIndex(rollIndex - 1);
    }

    let previewList = mapValokuvaToPreviews(kuvaSrc, clickedPic, setClickedPic)

    let remainingImages = valokuvat.length - rollIndex - width
    if (remainingImages < 0) remainingImages = 0

    let sivunumero = clickedPic.sivunumero;
    if (sivunumero == -200) sivunumero = "etukansi"
    if (sivunumero == -100) sivunumero = "takakansi"

    let BtnStyle = {backgroundColor:  theme.button};
    
    return(
        <div style={{width: "100%"}}>
            <Stack direction="horizontal" gap={1}>
                <Button onClick={(e) => handleDecrease()} className='btn btn-dark' style={BtnStyle}> {"< " + rollIndex} </Button>
                {previewList}
                <Button onClick={(e) => handleIncrease()} className='btn btn-dark' style={BtnStyle}> {"> " + (remainingImages)} </Button>
            </Stack>
            <div className="mx-auto" style={{width:"100%", height: "auto", marginTop: "1em"}}>
                <a onClick={(e) => window.open(kuvaSrc + clickedPic.valokuva, '_blank').focus()} style={{cursor:"pointer"}}>
                <Image src={kuvaSrc + clickedPic.valokuva} fluid style={{width:"100%"}}/>
                </a>
            </div>
            <div style={{textAlign: "left"}}>
                Sivunumero: {sivunumero}<br/>
                Nimi/Kuvaus: {clickedPic.nimi} <br/>
            </div>
        </div>
    )
}


const mapValokuvaToPreviews = (list, kuvaSrc, clickedPic, setClickedPic) => {
    let previewList = list.map((n, index) => {
        let style = {width: "20%"};
        let clickedStyle = {width: "20%", border: "2px solid black", borderRadius: "5px"}
        
        if (clickedPic.valokuva_id == n.valokuva_id){
            return (
                <div key={index} onClick={(e) => setClickedPic(n)} style={clickedStyle}>
                    <Image src={kuvaSrc + n.valokuva} thumbnail fluid/>
                </div>
            )
        }
        return (
            <div key={index} onClick={(e) => setClickedPic(n)} style={style}>
                <Image src={kuvaSrc + n.valokuva} thumbnail fluid/>
            </div>
        )
    });
    return previewList
}

export {KuvaViewerComponent, ValokuvaViewerComponent}