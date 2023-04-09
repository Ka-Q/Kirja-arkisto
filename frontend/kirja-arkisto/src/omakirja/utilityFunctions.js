
const getCoverArt = (omakirja) => {
    
    let kirja = omakirja.kirja
    let kirjankuvat = []
    let valokuvat = []
    kirjankuvat = kirja.kuvat
    valokuvat = omakirja.valokuvat

    let tyyppi = "valokuva"
    let imgsrc = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png?20221208232400";
    let etukansikuva = {}

    // Etsitään valokuva etukannesta
    for (let row in valokuvat) {
        let valokuva = valokuvat[row]
        if (valokuva.sivunumero == -200) {
            etukansikuva = valokuva
            break;
        }
    }

    // Jos jokin valokuva, niin asetetaan
    if (etukansikuva.valokuva) {
        imgsrc = "http://localhost:5000/valokuvatiedosto?valokuva=" + etukansikuva.valokuva
    }
    else { // Jos ei valokuvaa, etsitään kirjan kuvista etukansi
        for (let row in kirjankuvat) {
            let kuva = kirjankuvat[row]
            if (kuva.kuva_tyyppi_id == 1) {
                etukansikuva = kuva
                tyyppi = "kuva"
                break;
            }
        }
    }

    // Jos jokin kuva, niin asetetaan
    if (etukansikuva.kuva) {
        imgsrc = "http://localhost:5000/kuvatiedosto?kuva=" + etukansikuva.kuva
    }
    return {tyyppi: tyyppi, imgsrc: imgsrc};
}

export {getCoverArt}