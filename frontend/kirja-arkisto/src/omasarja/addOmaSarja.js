import { useState, useEffect } from "react"
import { Button, Card, Col, Row, Stack } from "react-bootstrap"
import { RequiredComponent, WarningComponent, SuccessComponent } from "./utilityComponents"

const AddSeries = (props) => {

    const [serieslist, SetSerieslist] = useState([])
    useEffect(() => {
        const fetchSeries = async () => {
            const f = await fetch("http://localhost:5000/sarja")
            const data = await f.json();

            let sortedSeries = data.data.sort((a, b) => {
                if (a.nimi < b.nimi) return -1;
                if (a.nimi > b.nimi) return 1;
                return 0
            })
            SetSerieslist(sortedSeries)
            
        };
        fetchSeries();
    }, []);

   
    let optionList = serieslist.length > 0
    ? serieslist.map((n, index) => (
        <option key={index} value={n.kirja_id}>
          {n.nimi}
        </option>
      ))
    : [<option key={0} value={-1}>Ei sarjoja</option>];
  
    const [nimi, setNimi] = useState(-1);
    const [kuvaus, setKuvaus] = useState(-1);
    const [kirjaId, setKirjaId] = useState(-1);

    const [addPicKeys, setAddPicKeys] = useState(0);

    const inputStyle = {width: "60%", paddingLeft: "1em"}

    const [saveClicked, setSaveClicked] = useState(false)
    const [finalOmaKirja, setfinalOmaKirja] = useState({})

    const [sarjaFilled, setSarjaFilled] = useState(true)
    const [filesFilled, setFilesFilled] = useState(true)
    const [saveSuccessful, setSaveSuccessful] = useState(false)

    const [insertedBookId, setInsertedBookId] = useState(-1)

    useEffect(() => {
        const addSeries = async () => {
            const f = await fetch("http://localhost:5000/sarja", {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(finalOmaKirja)})
            const data = await f.json();
            if (addPicKeys == 0) {
                setSaveSuccessful(true)
                return null
            }
            setInsertedBookId(data.data.insertId)

        };
        if (saveClicked) {
            addSeries();
            setSaveClicked(false)
        }
    }, [saveClicked]);

    const handleSaveClicked = () => {
        checkInputs()
        console.log("omakirja: " + sarjaFilled + ", files: " + filesFilled)
        if (checkInputs()) {
            let omaKirja = {
                sarja_id: 0,
                nimi: nimi,
                kuvaus: kuvaus,
            }
            setfinalOmaKirja(omaKirja);
            setSaveClicked(true);
        }
    }

    const checkInputs = () => {
        const omaSarjaOK = nimi >= 0 && kuvaus >= 0;
        const fileInputsOK = Array.from(
          document.getElementsByName("files")
        ).every((fi) => fi.files.length > 0);
      
        setSarjaFilled(omaSarjaOK);
        setFilesFilled(fileInputsOK);
      
        return omaSarjaOK && fileInputsOK;
      };
      

    return (
        <Card border="dark" className="mb-1">
            <Card.Body>
                {!saveSuccessful?
                <>
                    <Card.Title>Lisää omiin sarjoihin:</Card.Title>
                    <Row className="mb-2">
                        <Col>
                        <Stack direction="vertical" gap={3} style={{textAlign: "center"}}>
                            <div> 
                                <select onChange={(e) => setKirjaId(e.target.value)} style={inputStyle}>
                                    <option value={-1}>valitse sarja...</option>
                                    {optionList}
                                </select> 
                                <RequiredComponent yes/>
                            </div>
                            <div><input onChange={(e) => setNimi(e.target.value)} type="label" placeholder="nimi" style={inputStyle}/><RequiredComponent yes/></div>
                            <div><input onChange={(e) => setKuvaus(e.target.value)} placeholder="kuvaus" style={inputStyle}/><RequiredComponent yes/></div>
                            
                            
                        </Stack>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            
                            <div className="my-5">
                                {!sarjaFilled?<WarningComponent text="Vaadittuja tietoja puuttuu"/>:<></>}
                                <Button onClick={(e) => handleSaveClicked()}>Tallenna</Button> <Button onClick={(e) => props.handleLisaaClicked()}>Peruuta</Button>
                            </div>
                        </Col>
                    </Row>
                </>:
                <>
                    <SuccessComponent text="Tallennus onnistui"/>
                    <Button onClick={(e) => props.handleLisaaClicked()}>Sulje</Button>
                </>
                }
            </Card.Body>
        </Card>
    )
}

export {AddSeries}


