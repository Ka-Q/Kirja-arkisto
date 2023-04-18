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

/**
 * A Component for flipping between two images
 * @param {object} props
 * @param {string} props.src1 string source of the first image to be displayed
 * @param {string} props.src2 string source of the second image to be displayed
 * @param {boolean} props.reversed boolean for controling animation direction
 * @param {int} props.duration integer for controlling animation duration in milliseconds.
 * @param {string} props.perspective string source for controlling animation perspective
 * @returns A component with an image-element that flips around when clicked.
 */
const ImageFlipperComponent = (props) => {

    const perspective = props.perspective || '600px';

    const duration = props.duration || 1;
    const durationMs = duration * 1000;

    const direction = props.reversed? 'reverse' : 'normal';

    let showSrc1 = true;

    const defaultStyle = {display:'flex', width:'100%', cursor:'pointer', userSelect:'none'};
    const style = {...defaultStyle, ...props.style};

    const flipStyle = `.img-flipper {
        animation-timing-function: ease-in-out;
        animation-duration: ${duration}s;
        animation-direction: ${direction};
        animation-iteration-count: 1;
    }`;

    const flipRStyle = `.img-flipper-r {
        animation-name: flip-with-rotate;
    }`;

    let flipWithRotate = `
    @-webkit-keyframes flip-with-rotate {
        0% {-webkit-transform:perspective(${perspective}), rotateY(0))} 
        100% {-webkit-transform: perspective(${perspective}) rotateY(180deg) scaleX(-1)}
    }`;

    let styleEl = document.createElement("style");
    document.head.appendChild(styleEl);
    let styleSheet = styleEl.sheet;

    styleSheet.insertRule(flipStyle, 0);
    styleSheet.insertRule(flipRStyle, 0);
    styleSheet.insertRule(flipWithRotate, 0);
    
    const handleClick = (element) => {

        if (element.className == 'img-flipper img-flipper-r') return;
        showSrc1 = !showSrc1;
        element.className = 'img-flipper img-flipper-r';
        setTimeout(() => {
            element.src = showSrc1? props.src1 : props.src2;
          }, durationMs / 2);
        setTimeout(() => {
            element.className = '';
          }, durationMs);
    }
    return(
        <div>
            <img id='img-flipper-img' src={props.src1} onClick={(e) => handleClick(e.target)} style={style}/>
        </div>
    )
}

const CoverViewerComponent = (props) => {

    const frontCover = getFrontCover(props.omakirja)
    const backCover = getBackCover(props.omakirja)
    const [showFrontCover, setShowFrontCover] = useState(true)
    const [animationPlaying, setAnimationPlaying] = useState(false)
    const duration = 1;

    

    const handleClick = () => {
        if (animationPlaying) return;
        setShowFrontCover(!showFrontCover)
        setAnimationPlaying(true);

        setTimeout(() => {
            setAnimationPlaying(false)
          }, duration * 1000);
        
    }
    return(
        <div>
            <div className="mb-3" onClick={() => handleClick()}>
                <ImageFlipperComponent 
                    src1={frontCover}
                    src2={backCover}
                    duration={duration}
                    perspective="300px"/>
            </div>
            {showFrontCover?
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

export {ImageFlipperComponent, CoverViewerComponent}