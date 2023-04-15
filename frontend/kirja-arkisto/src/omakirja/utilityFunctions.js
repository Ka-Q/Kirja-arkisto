
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

const getFrontCover = (omakirja) => {
    
    let kirja = omakirja.kirja
    let kirjankuvat = []
    kirjankuvat = kirja.kuvat

    let imgsrc = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png?20221208232400";
    let etukansikuva = "";

    //etsitään kirjan kuvista etukansi
    for (let row in kirjankuvat) {
        let kuva = kirjankuvat[row]
        if (kuva.kuva_tyyppi_id == 1) {
            etukansikuva = kuva
            break;
        }
    }

    // Jos jokin kuva, niin asetetaan
    if (etukansikuva.kuva) {
        imgsrc = "http://localhost:5000/kuvatiedosto?kuva=" + etukansikuva.kuva
    }
    console.log("Etukansi: " + imgsrc)
    return imgsrc;
}

const getBackCover = (omakirja) => {

    let kirja = omakirja.kirja
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
    console.log("Takakansi: " + imgsrc)
    return imgsrc;
}

const sendValokuvaForm = async (form, bookId) => {
    let formdata = new FormData(form)

    let type = formdata.get("type");

    // jos sivunumeroa ei ole, laitetaan -1
    if (!formdata.get("sivunumero")) { 
        formdata.set("sivunumero", -1)
    }

    // jos sivunumero on alle -1, laitetaan -1
    if (formdata.get("sivunumero") < -1) { 
        formdata.set("sivunumero", -1)
    }

    // Etukannelle sivunro -200 ja takakannelle sivunro -100
    if (type == "etukansi") {
        formdata.set("sivunumero", -200)
    } else if (type == "takakansi") {
        formdata.set("sivunumero", -100)
    }

    // jos tiedostoa ei ole, palautetaan false
    if (formdata.get("files").name == "") { 
        return 1
    }

    formdata.delete("type")

    const f = await fetch("http://localhost:5000/valokuva_tiedostolla", {
    credentials: "include",
    method: 'POST',
    body: formdata})
    const data = await f.json()

    console.log("Insert id: " + data.data.insertId);

    let obj = {oma_kirja_id: bookId, valokuva_id: data.data.insertId}

    const f2 = await fetch("http://localhost:5000/oman_kirjan_valokuvat", {
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

export {getCoverArt, getFrontCover, getBackCover, sendValokuvaForm}