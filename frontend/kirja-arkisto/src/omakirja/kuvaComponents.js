import { useState } from "react"
import { Button, Collapse, Image, Stack} from "react-bootstrap"
import theme from './theme.json'
import { getBackCover, getCoverArt, getFrontCover } from "./utilityFunctions";

const KuvaViewerComponent = (props) => {

    // Tietoa esikatselulle ja pikkukuvien kelaukselle
    const [clickedPic, setClickedPic] = useState(props.kuvat[0]);
    const [rollIndex, setRollIndex] = useState(0);

    const width = 5

    // Jos kirjalla ei ole kuvia, palautetaan tyhjä komponentti
    if (!props.kuvat || props.kuvat.length == 0) return (<></>)

    let kuvaSrc = "http://localhost:5000/kuvatiedosto?kuva=";
    let kuvat = props.kuvat

    // kelaavat pikkukuvia nappeja painettaessa
    const handleIncrease = () => {
        if (rollIndex < kuvat.length - width) setRollIndex(rollIndex + 1);
    }
    const handleDecrease = () => {
        if (rollIndex > 0) setRollIndex(rollIndex - 1);
    }

    // Järjestetään kuvat tyypin mukaan (etukansi, takakansi, muut)
    let kuvatSorted = sortByTyyppi(kuvat)

    // Rajataan näkyviin tulevat pikkukuvat indeksin ja leveyden perusteella
    let croppedlist = kuvatSorted.slice(rollIndex, rollIndex + width)

    // Mapataan rajattu lista pikkukuviksi
    let previewList = mapKuvaToPreviews(croppedlist, kuvaSrc, clickedPic, setClickedPic)

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

const CoverViewerComponent = (props) => {

    let omakirja = props.omakirja
    
    const [etukansi, setEtukansi] = useState(getFrontCover(omakirja))
    const [takakansi, setTakakansi] = useState(getBackCover(omakirja))

    const [showEtukansi, setShowEtukansi] = useState(true)
    
    const handleClick = (element) => {

        if (element.className == "flip flip-r")  return;
        setShowEtukansi(!showEtukansi)
        element.className = "flip flip-r" 
        setTimeout(() => {
            if (showEtukansi) element.src = takakansi
            if (!showEtukansi) element.src = etukansi
          }, 500);
        setTimeout(() => {
            element.className = ""
          }, 1000);
    }
    return(
        <div>
            <div className="mb-3" style={{userSelect: "none", cursor: "pointer"}}>
                <Image className="" fluid src={etukansi} onClick={(e) => handleClick(e.target)} style={{width:"100%", borderRadius: "0.3em"}}/>
            </div>
            {showEtukansi?
            <>
            <h5>Etukansi</h5> <br/>
            Klikkaa kuvaa nähdäksesi takakannen
            </>:
            <>
            <h5>Takakansi</h5> <br/>
            Klikkaa kuvaa nähdäksesi etukannen
            </>}
        </div>
    )
}

export {CoverViewerComponent}