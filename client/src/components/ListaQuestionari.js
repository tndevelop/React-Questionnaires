import { Row, ListGroup, Col } from "react-bootstrap";
import { Container, Form } from "react-bootstrap";
import {  Link} from "react-router-dom";

function ListaQuestionari(props) {

  const redirectAddress = props.utilizzatore ? "/utilizzatore/questionario" :  "/admin/questionario"

  return (
    <Col as={Container} fluid="xl" className="mainContainer">
      
    <ListGroup variant="flush">
      
      {props.questionari.map((q, index) => {
        return (
          <Link to={{pathname: redirectAddress,
          state : {"qId" : q.id}}}>
            <ListGroup.Item key={q.id} index={q.id} onClick={() => {

            }}>
              <Row>
                <Col>{q.nome}</Col>
                <Col>{q.numCompilazioni}</Col>   
              </Row>
            </ListGroup.Item>
          </Link>
        );
      })}
    </ListGroup>
    </Col>
  );
  
}


export default ListaQuestionari;
