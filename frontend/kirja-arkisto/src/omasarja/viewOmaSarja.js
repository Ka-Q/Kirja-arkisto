
import { Button, Card, Col, Row } from "react-bootstrap"
import { KuvaViewerComponent, ValokuvaViewerComponent } from "./kuvaComponents"
import { useEffect, useState } from "react"
import { Link, useLocation } from 'react-router-dom'
import { SuccessComponent } from "./utlilityComponents"
import theme from "./theme.json"

const ViewComponent = (props) => {
    const [deleteClicked, setDeleteClicked] = useState(false)
    const [editClicked, setEditClicked] = useState(false)
    const [omasarja, setOmasarja] = useState(null);
    const id = useLocation()


   
    useEffect(() => {
        const fetchSeries = async (id) => {
          let idFormatted = "" + id.pathname.split("/")[2];
          console.log(idFormatted);
          const f = await fetch(
            `http://localhost:5000/oma_kirja_kaikella?&oma_kirja_id=${idFormatted}`, 
            {}
          );
          const data = await f.json();
          console.log(data);
          setOmasarja(data.data[0]); 
        };
        fetchSeries(id);
      }, []);

   
      if (!omasarja) {
        return (
          <div
            className="text-center"
            style={{
              color: "white",
              height: "100%",
              width: "100%",
              paddingBottom: "100%",
              paddingTop: "10em",
              backgroundColor: theme.bg,
            }}
          >
            Odotetaan sarjaa...
            <br />
            <br />
            Mikäli tämä sivu ei muutu, jotain on mennyt pieleen. Voi olla, ettei
            sinulla ole oikeuksia tämän sarjan tarkasteluun
          </div>
        );
      }

      let kuvat = omasarja.kuvat;
    

    return(
        <div className="text-center px-3 py-1" style={{height: "100%",width: "auto", backgroundColor: theme.bg}}>
        <Row className="mt-5">
            {
            kuvat.length > 0?
                <Col sm={12} lg={3}>
                    <Card className="mb-4" border="secondary" style={{backgroundColor: theme.accent, color: "white"}}>
                        <Card.Title className="mt-3">
                            Kuvat
                        </Card.Title>
                        <Card.Body>
                            <KuvaViewerComponent kuvat={kuvat}/>
                        </Card.Body>
                    </Card>
                </Col>
            :
                <></>
            }
            
            <Col >
                <Card border="secondary" style={{backgroundColor: theme.accent, color: "white"}}>
                        <h1 className="mt-3">{omasarja.nimi}</h1>
                        <hr/>
                        <Card.Body>
                            <br/><br/>
                            Kirjan kuvaus: <br/>
                            {omasarja.kuvaus} <br/>
                            <Button href={"http://localhost:3000/oma_kirja/" + omasarja.sarja_id} className='btn btn-dark' style={{backgroundColor: theme.button, marginTop:"15em"}}>Lisää kirjasta {"->"}</Button>
                        </Card.Body>
                    
                </Card>
                <Card className="my-4"  border="secondary" style={{backgroundColor: theme.accent, color: "white"}}>
                        <Card.Title className="mt-3">
                            Toiminnot
                        </Card.Title>
                        <Card.Body>
                            <Button variant="dark" style={{backgroundColor: theme.button}}  onClick={(e) => setEditClicked(true)}>✏ Muokkaa</Button> <span className="mx-3"/>
                            <Button variant="danger" style={{backgroundColor: theme.accent, color: "red"}} onClick={(e) => setDeleteClicked(true)}>🗑 Poista</Button>
                        </Card.Body>
                    
                </Card>
            </Col>


        </Row>
            {deleteClicked?
                <div className="" style={{position: "fixed", width: "100%", height: "100%", left: "0", top: "0", right: "0", bottom: "0", backgroundColor: "rgba(0,0,0,0.9)"}}>
                    
                </div>
            :
            <></>}
            {editClicked?
                <div className="" style={{position: "fixed", width: "100%", height: "100%", left: "0", top: "0", right: "0", bottom: "0", backgroundColor: "rgba(0,0,0,0.9)"}}>
                    
                </div>
            :
            <></>}
        </div>
    )
}
export {ViewComponent}