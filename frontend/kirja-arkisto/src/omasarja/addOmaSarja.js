import { useState, useEffect } from "react"
import { Button, Card, Col, Row, Stack } from "react-bootstrap"
import { RequiredComponent, WarningComponent, SuccessComponent } from "./utlilityComponents"
import theme from "./theme.json"



const AddComponent = (props) => {

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
            <option key={index} value={n.sarja_id}>
                {n.nimi}
            </option>
        ))
        : [<option key={0} value={-1}>Ei sarjoja</option>];


    const [kuvaus, setKuvaus] = useState(-1);
    const [nimi, setNimi] = useState(-1);
    const [sarjasarjaId, setSarjasarjaId] = useState(-1);

    const [addPicKeys, setAddPicKeys] = useState(0);
    const inputStyle = { width: "60%", paddingLeft: "1em" }

    const [omaSarjaFilled, setOmaSarjaFilled] = useState(true)

    const [saveClicked, setSaveClicked] = useState(false)
    const [finalOmaSarja, setfinalOmaSarja] = useState({})

    const [filesFilled, setFilesFilled] = useState(true)
    const [saveSuccessful, setSaveSuccessful] = useState(false)

    const [insertedSarjaId, setInsertedSarjaId] = useState(-1)



    useEffect(() => {
        const addOwnSerie = async () => {
            const f = await fetch("http://localhost:5000/oma_sarja", {
                credentials: "include",
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(finalOmaSarja)
            })
            const data = await f.json();
            if (addPicKeys == 0) {
                setSaveSuccessful(true)
                return null
            }
            setInsertedSarjaId(data.data.insertId)
        };

        if (saveClicked) {
            addOwnSerie();
            setSaveClicked(false)
        }
    }, [saveClicked]);

    const handleSaveClicked = () => {
        checkInputs()
        console.log("omasarja: " + omaSarjaFilled + ", files: " + filesFilled)
        if (checkInputs()) {
            let omaSarja = {
                oma_sarja_id: 0,
                kuvaus: kuvaus,
                nimi: nimi,
                sarja_sarja_id: sarjasarjaId
            };

            setfinalOmaSarja(omaSarja);
            setSaveClicked(true);
        }
    }

    const checkInputs = () => {
        let omaSarjaOK = sarjasarjaId !== -1 && nimi !== "" && kuvaus !== "";
        let fileInputsOK = true;

        let fileInputs = document.getElementsByName("files");
        for (let i = 0; i < fileInputs.length; i++) {
            let fi = fileInputs[i];
            if (!fi.value) {
                fileInputsOK = false;
            }
        }

        setOmaSarjaFilled(omaSarjaOK);
        setFilesFilled(fileInputsOK);

        return omaSarjaOK && fileInputsOK;
    };




    return (
        <div className="text-center" style={{ height: "100%", width: '100%', padding: '10px', backgroundColor: theme.bg }}>
            <Card border="light" className="mb-1">
                <div style={{ color: "white", background: theme.accent, borderRadius: "inherit" }}>
                    <Card.Body>
                        {!saveSuccessful ?
                            <>
                                <Card.Title>Lisää sarja omiin sarjoihin</Card.Title>
                                <Row className="mb-2">
                                    <Col>
                                        <Stack direction="vertical" gap={3} style={{ textAlign: "center" }}>

                                            <div>
                                                <select onChange={(e) => setSarjasarjaId(e.target.value)} style={inputStyle}>
                                                    <option value={-1}>Valitse sarja...</option>
                                                    {optionList}
                                                </select>
                                                <RequiredComponent yes />
                                            </div>
                                            <div><textarea onChange={(e) => setNimi(e.target.value)} placeholder="nimi" style={{ width: "60%", paddingLeft: "1em", backgroundColor: theme.input, borderRadius: '10px', color: "white" }} /><RequiredComponent /></div>
                                            <div><textarea onChange={(e) => setKuvaus(e.target.value)} placeholder="kuvaus" style={{ width: "60%", paddingLeft: "1em", backgroundColor: theme.input, borderRadius: '10px', color: "white" }} /><RequiredComponent /></div>
                                        </Stack>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <div className="my-5">
                                            {!omaSarjaFilled ? <WarningComponent text="Vaadittuja tietoja puuttuu" /> : <></>}
                                            <Button
                                                variant="success"
                                                style={{ backgroundColor: theme.button }}
                                                onClick={(e) => handleSaveClicked(e)}
                                                disabled={!nimi || !kuvaus || !sarjasarjaId === -1}
                                            >
                                                Tallenna
                                            </Button>

                                            <Button variant="dark" onClick={(e) => props.handleLisaaClicked()}>Peruuta</Button>
                                        </div>
                                    </Col>
                                </Row>
                            </> :
                            <>
                                <SuccessComponent text="Tallennus onnistui" />
                                <Button onClick={(e) => props.handleLisaaClicked()}>Sulje</Button>
                            </>
                        }
                    </Card.Body>
                </div>
            </Card>
        </div>
    )
}


export { AddComponent }