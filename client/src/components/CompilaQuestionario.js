import { Row, ListGroup, Col, Form, Button} from "react-bootstrap";
import { Container } from "react-bootstrap";
import {useState} from "react";

function CompilaQuestionario(props) {
    const[domande, setDomande] = useState(props.domande);
    const checkItem = (selezionata, indiceDomanda, indiceRisposta) => {
        const newDomande = domande;
        let risposteDate = newDomande[indiceDomanda].risposte.filter( (r) => r.selezionata==true ).length;
        if(risposteDate >= newDomande[indiceDomanda].maxR && selezionata==true) return; //non permettere la selezione di più risposte di quelle consentite
        newDomande[indiceDomanda].risposte[indiceRisposta].selezionata = selezionata;
        setDomande([...newDomande]);
      }

      const setValueRispostaAperta = (testo, indiceDomanda) => {
        const newDomande = domande;
        newDomande[indiceDomanda].testoRispostaAperta = testo;
        setDomande([...newDomande]);
    }

  return (
    <Col as={Container} fluid="xl" className="mainContainer">
      {domande.map((d, index) => {
        return (
          
            <>
                <Row>
                    <Col/> 
                    <Col>{d.domanda}</Col> 
                    {d.chiusa? <Col>massimo risposte: {d.maxR}</Col> :  <Col/>}
                </Row>
                <ListGroup variant="flush">

                    {d.chiusa ?
                    
                    d.risposte.map((r, index) => {
                    return ( 
                        <ListGroup.Item key={index} index={index}  >
                            <Row>
                            <Form.Check
                                checked={r.selezionata}
                                onChange={(event) => {
                                checkItem(event.target.checked, d.dId, index);
                                }}
                                type="checkbox"
                                label={r.testo}
                                
                            />
                            
                            </Row>
                        </ListGroup.Item> 
                    );})
                    
                    : <Form.Control type="text" value={d.testoRispostaAperta} onChange = {(event) => setValueRispostaAperta(event.target.value, d.dId)} />
                    }
                </ListGroup>
                
          </>
          
        );

      })}
        <Button type="submit" className="mt-4">Submit</Button>
    </Col>
  );
  
}


export default CompilaQuestionario;
