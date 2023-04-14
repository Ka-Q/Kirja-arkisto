import { useState} from "react"
import { Button, Image, Stack, Row, Col , Card } from "react-bootstrap"
import theme from './theme.json'
import { RequiredComponent } from "./utlilityComponents"

// Järjestää annetun listan valokuvia niiden sivunumeron mukaan kasvavasti
const sortBySivunumero = (valokuvat) => {
    return valokuvat.sort((a, b) => {
        if (a.sivunumero < b.sivunumero) return -1
        if (a.sivunumero > b.sivunumero) return 1
        return 0
    });
}

// Komponentti lomakkeelle, jolla annetaan lisättävän valokuvan tiedosto ja tiedot.
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
                            <label for="etukansiRadio" className="pe-1">Etukansi</label> <input id="etukansiRadio" type="radio" name="type" value="etukansi"/>
                        </div>
                        <div className="mx-5" onClick={(e) => setShowSivu(false)}>
                            <label for="takakansiRadio" className="pe-1">Takakansi</label> <input id="takakansiRadio" type="radio" name="type" value="takakansi"/>
                        </div>
                        <div onClick={(e) => setShowSivu(true)}>
                            <label for="sivuRadio" className="pe-1">Sivu</label> <input id="sivuRadio" type="radio" name="type" value="sivu" defaultChecked/>
                        </div>
                        <RequiredComponent/>
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

// Mappaa listan valokuvia pieniksi esikatselukuviksi ValokuvaViewerComponenttia varten
const mapValokuvaToPreviews = (list, kuvaSrc, clickedPic, setClickedPic) => {
    let previewList = list.map((n, index) => {
        n.index = index
        let sivunro = n.sivunumero

        if (sivunro == -200) sivunro = "etukansi"
        if (sivunro == -100) sivunro = "takakansi"

        if (clickedPic.valokuva_id == n.valokuva_id){
            return (
                <div id={"previewPic" + index} className="mx-1" key={index} style={{display:"inline-block", overflow: "auto", whiteSpace: "nowrap", height: "7em", borderRadius: "0.3em"}}>
                    <Image src={kuvaSrc + n.valokuva} height={"100%"}/>
                </div>
            )
        }
        return (
            <div id={"previewPic" + index} className="mx-1" key={index} onClick={(e) => setClickedPic(n)} style={{position: "relative", display:"inline-block", overflow: "auto", whiteSpace: "nowrap", height: "7em" , borderRadius: "0.3em"}}>
                <div style={{display: "inline-block", overflow: "auto", whiteSpace: "nowrap", height: "94%", filter: "brightness(0.4)", margin: 0, padding: 0}}><Image src={kuvaSrc + n.valokuva} height={"100%"}/></div>
                <div className="px-2" style={{position: "absolute", width: "auto", height: "auto", top: "-0.5em", right: "0.5em", paddingTop: "0.4em", color: "white", backgroundColor: "rgba(75, 75, 75 , 0.77)", borderRadius: "0.5em"}}>
                    {sivunro}
                </div>
            </div>
        )
    });
    return previewList
}

// Komponentti valokuvan tarkasteluun. Napit valokuvien välillä navigointiin ja alla scroll, josta voi valita kuvan
const ValokuvaViewerComponent = (props) => {

    // Tietoa esikatselulle ja pikkukuvien kelaukselle
    const [clickedPic, setClickedPic] = useState(props.valokuvat[0]);
    const [valokuvaList, setValokuvaList] = useState(sortBySivunumero(props.valokuvat))

    // Jos oamlla kirjalla ei ole valokuvia, palautetaan tyhjä komponentti
    if (!props.valokuvat || props.valokuvat.length == 0) return (<></>)

    let kuvaSrc = "http://localhost:5000/valokuvatiedosto?valokuva=";

    // Mapataan rajattu lista pikkukuviksi
    let previewList = mapValokuvaToPreviews(valokuvaList, kuvaSrc, clickedPic, setClickedPic)

    // Vierittää esikatseluja niin, että valittu kuva tulee näkyviin. "dir" kertoo vierityssuunnan
    const scrollToPreview = (dir) => {
        let preview = document.getElementById("previewPic" + clickedPic.index)
        if (dir > 0) {
            preview.scrollIntoView({
                behavior: "smooth",
                inline: "start",
                block: "nearest"
            })
        } else {
            preview.scrollIntoView({
                behavior: "smooth",
                inline: "end",
                block: "nearest"
            })
        }
    }

    // Asettavat valitun kuvan ja kelaavat pikkukuvia nappeja painettaessa eteen tai taakse
    const handleIncrease = () => {
        if (clickedPic.index < valokuvaList.length - 1) setClickedPic(valokuvaList[clickedPic.index + 1])
        scrollToPreview(1)
    }
    const handleDecrease = () => {
        if (clickedPic.index > 0) setClickedPic(valokuvaList[clickedPic.index - 1])
        scrollToPreview(-1)
    }

    let sivunumero = clickedPic.sivunumero;
    if (sivunumero == -200) sivunumero = "etukansi"
    if (sivunumero == -100) sivunumero = "takakansi"

    let btnStyle = {backgroundColor: "rgba(40,40,40,0.8)", width:"4em", height: "4em", borderRadius: "1em", padding: "1em", cursor: "pointer", userSelect: "none", fontWeight: "bold", position: "absolute", top: "40%"}
    let BtnStyleLeft = JSON.parse(JSON.stringify(btnStyle)); BtnStyleLeft.left = 0
    let BtnStyleRight = JSON.parse(JSON.stringify(btnStyle)); BtnStyleRight.right = 0

    return(
        <Card border="secondary" style={{backgroundColor: theme.accent, color: "white"}}>
            <Card.Title className="mt-3">
                Valokuvat
            </Card.Title>
            <Card.Body>
                <div style={{height: "30em"}}>
                <a onClick={(e) => window.open(kuvaSrc + clickedPic.valokuva, '_blank').focus()} style={{cursor:"pointer"}}>
                    <Image src={kuvaSrc + clickedPic.valokuva} fluid style={{flexShrink: 0, objectFit: "contain", height:"100%", minWidth: "100%", backgroundColor: "black", borderRadius: "0.3em"}}/>
                </a>
                    <div className="ms-4" style={BtnStyleLeft} onClick={(e) => handleDecrease()}>{"<"}</div>
                    <div className="me-4" style={BtnStyleRight} onClick={(e) => handleIncrease()}>{">"}</div>
                </div>
                <div id="previewScroll" className="py-2" style={{display:"inline-block", overflow: "auto", whiteSpace: "nowrap", width: "100%", height: "auto", userSelect: "none"}} >
                    {previewList}
                </div>
                <hr/>
                <Stack direction="horizontal" gap={0} className="me-2 my-2" style={{position: "relative", top :0}}>
                    <Button className="ms-auto" variant="success" style={{backgroundColor: theme.accent}}  onClick={(e) => console.log("muokataan")}>✏</Button> <span className="mx-1"/>
                    <Button variant="danger" style={{backgroundColor: theme.accent}} onClick={(e) => console.log("poistetaan")}>🗑</Button>
                    <span className="mx-3" style={{lineHeight: "2.3em", width: "0.2em", backgroundColor: theme.input, color: theme.input, borderRadius: "1em"}}>|</span>
                    <Button variant="primary" style={{backgroundColor: theme.accent}} onClick={(e) => console.log("lisätään")}>➕</Button>
                </Stack>
                Sivunumero: {sivunumero} <br/>
                Nimi/kuvaus: {clickedPic.nimi}
            </Card.Body>
        </Card>
    )
}

export { ValokuvaViewerComponent , AddValokuvaFormComponent }