import { Form, Button, Row, Col, Alert } from "react-bootstrap";
import {Link} from "react-router-dom";
import { AiOutlineLeft } from "react-icons/ai";
import { propTypes } from "react-bootstrap/esm/Image";

function BackButton(props) {
  
  const redirectAddress = props.utilizzatore ? "/utilizzatore" : "/admin";
  

  return (
        <Link to={redirectAddress}><Button variant="primary">
            <AiOutlineLeft></AiOutlineLeft>
          Torna ai questionari {props.faseModifica ? "(eventuali modifiche non verranno salvate)" : ""}
        </Button></Link>
  
  );
}


export { BackButton };
