import { Container, Button, Col, } from "react-bootstrap";
import {  BrowserRouter as Router,  Switch,  Route,  Redirect, Link} from "react-router-dom";
function ButtonNuovoQuestionario(){
    return(
        <Link to="/admin/questionario/crea"><Button variant="primary">Crea Nuovo</Button></Link>
    )    ;

    
}

export default ButtonNuovoQuestionario;