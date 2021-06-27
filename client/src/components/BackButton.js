import { Button } from "react-bootstrap";
import {Link} from "react-router-dom";
import { AiOutlineLeft } from "react-icons/ai";

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
