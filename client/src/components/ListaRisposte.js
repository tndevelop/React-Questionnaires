import { Row, ListGroup, Col } from "react-bootstrap";
import { Container } from "react-bootstrap";

function ListaRisposte(props) {
  return (
    <Col as={Container} fluid="xl" className="mainContainer">
      {props.domande.map((q, index) => {
        return (
          
            <>
                <Row>
                    <Col/><Col>{q.domanda}</Col><Col/>
                </Row>
                <ListGroup variant="flush">
                    {q.risposte.map((r, index) => {
                    return ( 
                        <ListGroup.Item key={index} index={index} active={q.rispostaSelezionata === index} >
                            <Row>
                            <Col>{r}</Col>
                            </Row>
                        </ListGroup.Item> 
                    );
            
                    })}
                </ListGroup>
          </>
          
        );

      })}
    
    </Col>
  );
  
}


export default ListaRisposte;
