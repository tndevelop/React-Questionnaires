import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { useState } from "react";
function CreaQuestionario(){
    const [nDomande, setNDomande] = useState(1);
    const[domande, setDomande] = useState([{dId: 0, domanda: "", risposte: [""]}]);

    const addRisposta = (indiceDomanda) => {
        const newDomande = domande;
        newDomande[indiceDomanda].risposte = [...newDomande[indiceDomanda].risposte, ""];
        setDomande([...newDomande]);
    }

    const setValueDomanda = (testo, indiceDomanda) => {
        const newDomande = domande;
        newDomande[indiceDomanda].domanda = testo;
        setDomande([...newDomande]);
    }

    const setValueRisposta = (testo, indiceDomanda, indiceRisposta) => {
        const newDomande = domande;
        newDomande[indiceDomanda].risposte[indiceRisposta] = testo;
        setDomande([...newDomande]);
    }

    return(
<Form>
  <Form.Group className="mb-3" >
    <Form.Label>Nome questionario</Form.Label>
    <Form.Control type="text" />
    
  </Form.Group>
    
    {domande.map((d, index) =>{
        console.log(d);
        return (
        <>
            <Form.Group className="mb-4" >
                <Form.Label>domanda {index}</Form.Label>
                <Form.Control type="text" value={d.domanda} onChange = {(event) => setValueDomanda(event.target.value, index) } />
                {d.risposte.map((r, index) => {
                    return(
                    <>
                    <Form.Label>risposta {index}</Form.Label>
                    <Form.Control type="text" value={r} onChange = {(event) => setValueRisposta(event.target.value, d.dId, index)} />
                    </>);
                })} 
                <Button onClick = {() => {addRisposta(index)}} variant="info">Aggiungi risposta alla domanda {index}</Button>
            </Form.Group>
           
           
        </>);


    }
    )};
    <Button onClick = {() => { 
      setDomande([...domande, {dId: nDomande , domanda: "", risposte: [""]} ]); 
      setNDomande(nDomande + 1);}}>
          Aggiungi domanda
    </Button>
  
  <Row className = "mt-4">
    <Col >
        <Button variant="success" type="submit">
            Submit
        </Button>
    </Col>
  </Row>
</Form>
);
}

export default CreaQuestionario;