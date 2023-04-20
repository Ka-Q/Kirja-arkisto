import { useState, useEffect } from "react";
import { Button, Image, Stack } from "react-bootstrap";
import theme from "./theme.json";

const KirjaViewerComponent = ({ kirjaId }) => {
  // Set the initial state for the currentImage
  const [currentImage, setCurrentImage] = useState(null);

  
  const [rollIndex, setRollIndex] = useState(0);
  const width = 5;
  const BtnStyle = { backgroundColor: theme.button };
  const [bookData, setBookData] = useState(null);

  useEffect(() => {
    fetchBookData();
  }, []);

  const fetchBookData = async () => {
    try {
      // Use the first related book ID from the props
     
  
      const response = await fetch(`http://localhost:5000/kirja_kaikella`);
      const data = await response.json();
      if (data.status === "OK") {
        setBookData(data.data);
        setCurrentImage(data.data[0].kuvat[0]);
      }
    } catch (error) {
      console.error("Error fetching book data:", error);
    }
  };
  const handleImageClick = (image) => {
    setCurrentImage(image);
  };

  const handleIncrease = () => {
    if (rollIndex < bookData[0].kuvat.length - width) setRollIndex(rollIndex + 1);
  };

  const handleDecrease = () => {
    if (rollIndex > 0) setRollIndex(rollIndex - 1);
  };

  if (!bookData) {
    return <div>Loading...</div>;
  }

  // Sort the kirjat array using the sortByJärjestysnumero function
  const sortedKirjat = sortByJärjestysnumero(bookData[0].kuvat);

  // Generate the previewList using the mapKirjaToPreviews function
  const previewList = mapKirjaToPreviews(sortedKirjat, "http://localhost:5000/kuvatiedosto?kuva=", currentImage, setCurrentImage);

  const remainingImages = bookData[0].kuvat.length - (rollIndex + width);

  return (
    <div>
      <div className="mx-auto" style={{ width: "100%", height: "auto", marginBottom: "1em" }}>
        <a onClick={(e) => window.open(`http://localhost:5000/kuvatiedosto?kuva=${currentImage.kuva}`, "_blank").focus()} style={{ cursor: "pointer" }}>
          <Image src={`http://localhost:5000/kuvatiedosto?kuva=${currentImage.kuva}`} fluid style={{ width: "100%" }} />
        </a>
      </div>
      <Stack direction="horizontal" gap={1}>
        <Button onClick={(e) => handleDecrease()} className="btn btn-dark" style={BtnStyle}>
          {"< " + rollIndex}
        </Button>
        {previewList}
        <Button onClick={(e) => handleIncrease()} className="btn btn-dark" style={BtnStyle}>
          {"> " + remainingImages}
        </Button>
      </Stack>
      <div style={{ textAlign: "left" }}>
        <p>Nimi: {bookData[0].nimi}</p>
        <p>Järjestysnumero: {bookData[0].jarjestysnumero}</p>
        <p>Kuvaus: {bookData[0].kuvaus}</p>
        <p>Kirjailijat: {bookData[0].kirjailijat}</p>
        <p>Ensipainosvuosi: {bookData[0].ensipainosvuosi}</p>

      </div>
    </div>
  );
};
const sortByJärjestysnumero = (kirjat) => {
    return kirjat.sort((a, b) => {
      if (a.jarjestysnumero < b.jarjestysnumero) return -1;
      if (a.jarjestysnumero > b.jarjestysnumero) return 1;
      return 0;
    });
  };
  
  const mapKirjaToPreviews = (list, kirjaSrc, currentImage, setCurrentImage) => {
    let previewList = list.map((n, index) => {
      let style = { width: "20%" };
      let clickedStyle = { width: "20%", border: "2px solid black", borderRadius: "5px" };
  
      if (currentImage.kuva_id === n.kuva_id) {
        return (
          <div key={index} onClick={(e) => setCurrentImage(n)} style={clickedStyle}>
            <Image src={kirjaSrc + n.kuva} thumbnail fluid />
          </div>
        );
      }
      return (
        <div key={index} onClick={(e) => setCurrentImage(n)} style={style}>
          <Image src={kirjaSrc + n.kuva} thumbnail fluid />
        </div>
      );
    });
    return previewList;
  };


  


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

export {KuvaViewerComponent, ValokuvaViewerComponent, KirjaViewerComponent}