import { Alert} from "react-bootstrap"

// Näyttää, onko kenttä vaadittu vai ei
const RequiredComponent = (props) => {
    return (
        <>
        {props.yes?
            <span style={{color: "red", fontWeight: "bold", marginLeft: "1.5em"}}>*</span>:
            <span style={{marginLeft: "1.9em"}}/>
        }
        </>
    )
}

// Komponentti virhetilanteen näyttämiselle. Näytetään esim. jos haku ei tuottanut tuloksia.
const WarningComponent = (props) => {
    return (
        <Alert variant="danger">
            {props.text}
        </Alert>
    )
}

// Komponentti toiminnon onnistumisen näyttämiselle. Näytetään esim. jos tallennus onnistui
const SuccessComponent = (props) => {
    return (
        <Alert variant="success">
            {props.text}
        </Alert>
    )
}

export {RequiredComponent, WarningComponent, SuccessComponent}