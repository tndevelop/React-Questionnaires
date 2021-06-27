import { Button } from "react-bootstrap";
import { Link} from "react-router-dom";
function ButtonNuovoQuestionario(){
    return(
        <Link to="/admin/questionario/crea"><Button variant="primary">Crea Nuovo</Button></Link>
    )    ;

    
}

export default ButtonNuovoQuestionario;