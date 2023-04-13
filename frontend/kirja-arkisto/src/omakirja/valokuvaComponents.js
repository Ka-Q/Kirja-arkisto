import { useState } from "react"
import { Button, Image, Stack, Row, Col } from "react-bootstrap"
import theme from './theme.json'
import { RequiredComponent } from "./utlilityComponents"

const ValokuvaViewerComponent = (props) => {

    // Tietoa esikatselulle ja pikkukuvien kelaukselle
    const [clickedPic, setClickedPic] = useState(props.valokuvat[0]);
    const [rollIndex, setRollIndex] = useState(0);

    const width = 5

    // Jos oamlla kirjalla ei ole valokuvia, palautetaan tyhjä komponentti
    if (!props.valokuvat || props.valokuvat.length == 0) return (<></>)

    let kuvaSrc = "http://localhost:5000/valokuvatiedosto?valokuva=";
    let valokuvat = props.valokuvat

    // kelaavat pikkukuvia nappeja painettaessa
    const handleIncrease = () => {
        if (rollIndex < valokuvat.length - width) setRollIndex(rollIndex + 1);
    }
    const handleDecrease = () => {
        if (rollIndex > 0) setRollIndex(rollIndex - 1);
    }

    // Järjestetään valokuvat sivunumeron mukaan (kasvava)
    let valokuvatSorted = sortBySivunumero(valokuvat)

    // Rajataan näkyviin tulevat pikkukuvat indeksin ja leveyden perusteella
    let croppedlist = valokuvatSorted.slice(rollIndex, rollIndex + width)

    // Mapataan rajattu lista pikkukuviksi
    let previewList = mapValokuvaToPreviews(croppedlist, kuvaSrc, clickedPic, setClickedPic)

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

const sortBySivunumero = (valokuvat) => {
    return valokuvat.sort((a, b) => {
        if (a.sivunumero < b.sivunumero) return -1
        if (a.sivunumero > b.sivunumero) return 1
        return 0
    });
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

const AddValokuvaFormComponent = (props) => {
    const inputStyle = props.inputStyle
    const formId = props.formId

    const [showSivu, setShowSivu] = useState(true)

    const inputStyleFile = JSON.parse(JSON.stringify(inputStyle));
    inputStyleFile.borderRadius = "0.5em";
    inputStyleFile.padding = "0.5em";

    // Formia ei lähetetä submitilla, vaan juurikomponentin useEffectissä
    const handleSubmit = async (e) => {
        e.preventDefault()
    }

    return (
        <Row className="mt-2 mb-2">
            <hr/>
            <Col>
            <form id={formId} onSubmit={(e) => handleSubmit(e)}>
                <Stack direction="vertical" gap={3} style={{textAlign: "center"}}>
                    <div><input type={"file"} name="files" style={inputStyleFile}/><RequiredComponent yes/></div>
                    <div><input type={"text"} name="nimi" placeholder="nimi" style={inputStyle}/><RequiredComponent/></div>
                    <div className="mx-auto" style={{display:"flex"}}>
                        <div onClick={(e) => setShowSivu(false)}>
                            <label for="etukansiRadio" className="pe-3">Etukansi</label> <input id="etukansiRadio" type="radio" name="type" value="etukansi"/>
                        </div>
                        <div className="mx-5" onClick={(e) => setShowSivu(false)}>
                            <label for="takakansiRadio" className="pe-3">Takakansi</label> <input id="takakansiRadio" type="radio" name="type" value="takakansi"/>
                        </div>
                        <div onClick={(e) => setShowSivu(true)}>
                            <label for="sivuRadio" className="pe-3">Sivu</label> <input id="sivuRadio" type="radio" name="type" value="sivu" defaultChecked/>
                        </div>
                        <RequiredComponent yes/>
                    </div>
                    {showSivu? 
                        <div><input type={"number"} name="sivunumero" placeholder="sivunumero" style={inputStyle}/><RequiredComponent/></div>
                    :
                        <></>
                    }
                </Stack>
            </form>
            </Col>
        </Row>
    )
}

export { ValokuvaViewerComponent, AddValokuvaFormComponent }