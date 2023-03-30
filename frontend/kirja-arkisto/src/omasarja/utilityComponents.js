import { Alert} from "react-bootstrap"

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

const WarningComponent = (props) => {
    return (
        <Alert variant="danger">
            {props.text}
        </Alert>
    )
}

const SuccessComponent = (props) => {
    return (
        <Alert variant="success">
            {props.text}
        </Alert>
    )
}

export {RequiredComponent, WarningComponent, SuccessComponent}