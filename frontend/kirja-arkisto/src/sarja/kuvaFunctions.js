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

export {getCoverArt}