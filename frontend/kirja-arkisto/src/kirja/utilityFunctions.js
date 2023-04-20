import { useEffect, useState} from "react"
import { Button, Image, Stack, Row, Col , Card, Collapse } from "react-bootstrap"
import theme from './theme.json'
import { RequiredComponent, WarningComponent } from "./utilityComponents"

const getCoverArt = (kirja) => {
    
    let kirjankuvat = []
    kirjankuvat = kirja.kuvat

    let imgsrc = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png?20221208232400";
    let etukansikuva = {}
    for (let row in kirjankuvat) {
        let kuva = kirjankuvat[row]
        if (kuva.kuva_tyyppi_id == 1) {
            etukansikuva = kuva
            break;
        }
    }
    if (etukansikuva.kuva) {
        imgsrc = "http://localhost:5000/kuvatiedosto?kuva=" + etukansikuva.kuva
    }
    return imgsrc;
}

const getBackCover = (kirja) => {

    
    let kirjankuvat = []
    kirjankuvat = kirja.kuvat

    let imgsrc = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png?20221208232400";
    let takakansikuva = "";

    //etsitään kirjan kuvista etukansi
    for (let row in kirjankuvat) {
        let kuva = kirjankuvat[row]
        if (kuva.kuva_tyyppi_id == 2) {
            takakansikuva = kuva
            break;
        }
    }

    // Jos jokin kuva, niin asetetaan
    if (takakansikuva.kuva) {
        imgsrc = "http://localhost:5000/kuvatiedosto?kuva=" + takakansikuva.kuva
    }
    return imgsrc;
}

const sendValokuvaForm = async (form, bookId) => {
    let formdata = new FormData(form)

    let type = formdata.get("type");

    /*// jos sivunumeroa ei ole, laitetaan -1
    if (!formdata.get("sivunumero")) { 
        formdata.set("sivunumero", -1)
    }

    // jos sivunumero on alle -1, laitetaan -1
    if (formdata.get("sivunumero") < -1) { 
        formdata.set("sivunumero", -1)
    }*/
/*
    // Etukannelle sivunro -200 ja takakannelle sivunro -100
    if (type == "etukansi") {
        formdata.set("sivunumero", -200)
    } else if (type == "takakansi") {
        formdata.set("sivunumero", -100)
    }
*/
    // jos tiedostoa ei ole, palautetaan false
    if (formdata.get("files").name == "") { 
        return 1
    }

    formdata.delete("type")

    const f = await fetch("http://localhost:5000/kuva_tiedostolla", {
    credentials: "include",
    method: 'POST',
    body: formdata})
    const data = await f.json()

    console.log("Insert id: " + data.data.insertId);

    let obj = {kirja_kirja_id: bookId, kuva_kuva_id: data.data.insertId}

    const f2 = await fetch("http://localhost:5000/kirjan_kuvat", {
        credentials: "include",
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)})

    const data2 = await f2.json()

    console.log("Insert id2: " + data2.data.insertId);
    return 0;
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
                    <div className="mx-auto" style={{display:"flex"}}>
                        <div >
                            <label htmlFor="kuvatyyppi1" className="pe-1">Etukansi</label> 
                            <input id="kuvatyyppi1" type="radio" name="kuva_tyyppi_id" value="1"/>
                        </div>
                        <div >
                            <label htmlFor="kuvatyyppi2" className="pe-1">Takakansi</label> 
                            <input id="kuvatyyppi2" type="radio" name="kuva_tyyppi_id" value="2"/>
                        </div>
                        <div >
                            <label htmlFor="kuvatyyppi3" className="pe-1">Muu</label> 
                            <input id="kuvatyyppi3" type="radio" name="kuva_tyyppi_id" value="3"/>
                        </div>
                        <div >
                            <label htmlFor="kuva" className="pe-1">Kuvan nimi</label> 
                            <input id="kuva" type="text" name="kuva" />
                        </div>
                        <div >
                            <label htmlFor="julkaisuvuosi" className="pe-1">julkaisuvuosi</label> 
                            <input id="julkaisuvuosi" type="text" name="julkaisuvuosi"/>
                        </div>
                        <div >
                            <label htmlFor="taiteilija" className="pe-1">Taiteilija</label> 
                            <input id="taiteilija" type="text" name="taiteilija" />
                        </div>
                        <div >
                            <label htmlFor="tyyli" className="pe-1">Tyyli</label> 
                            <input id="tyyli" type="text" name="tyyli" value="tyyli"/>
                        </div>
                        <div >
                            <label htmlFor="kuvaus" className="pe-1">Kuvaus</label> 
                            <input id="kuvaus" type="text" name="kuvaus" />
                        </div>
                    </div>
                    
                </Stack>
            </form>
            </Col>
        </Row>
    )
}



export {getCoverArt, sendValokuvaForm, getBackCover, AddValokuvaFormComponent}