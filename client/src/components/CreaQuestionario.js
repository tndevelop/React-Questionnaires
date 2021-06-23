import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import API from "../fileJS/API.js";

function CreaQuestionario(props){
    const [nDomande, setNDomande] = useState(0);
    const[domande, setDomande] = useState([]);
    const[nome, setNome] = useState("");


    const addRisposta = (indiceDomanda) => {
        const newDomande = domande;
        if (newDomande[indiceDomanda].risposte.length >= 10) return;
        newDomande[indiceDomanda].risposte = [...newDomande[indiceDomanda].risposte, ""];
        setDomande([...newDomande]);
    }

    const setValueDomanda = (testo, indiceDomanda) => {
        const newDomande = domande;
        newDomande[indiceDomanda].domanda = testo;
        setDomande([...newDomande]);
    }

    const setMaxR = (maxR, indiceDomanda) => {
        const newDomande = domande;
        newDomande[indiceDomanda].maxR = maxR;
        setDomande([...newDomande]);
    }

    const setValueRisposta = (testo, indiceDomanda, indiceRisposta) => {
        const newDomande = domande;
        newDomande[indiceDomanda].risposte[indiceRisposta] = testo;
        setDomande([...newDomande]);
    }

    const deleteDomanda = (indiceDomanda) => {
        const newDomande = domande;
        newDomande.splice(indiceDomanda,1);
        setDomande([...newDomande]);
    }

    const deleteRisposta = (indiceDomanda, indiceRisposta) => {
        console.log(indiceDomanda);
        const newDomande = domande;
        newDomande[indiceDomanda].risposte.splice(indiceRisposta, 1);
        setDomande([...newDomande]);
    }

    const submit = (user) => {
        
        const addQuestionario = async () => {
            let q = {   };
            q.titolo = nome;
            q.user_id = user;
            const qId = await API.addQuestionario(q);
            q.qId = qId;
            
            for(let idx in domande){
                let d;
                if(domande[idx].chiusa){
                    d = {dId: domande[idx].dId , domanda: domande[idx].domanda, risposte: domande[idx].risposte, chiusa:  domande[idx].chiusa, maxR : domande[idx].maxR}
                }else{
                    d = {dId: domande[idx].dId , domanda: domande[idx].domanda, risposte: [], chiusa:  domande[idx].chiusa}
                }

                API.addDomanda(d, q);
            }    
          };
        

          addQuestionario().catch((err) => {
            console.error(err);
          });   
    }

    return(
<Form>
  <Form.Group className="mb-3" >
    <Form.Label>Nome questionario</Form.Label>
    <Form.Control type="text" value={nome} onChange = {(event) => setNome(event.target.value)}/>
    
  </Form.Group>
    
    {domande.map((d, index) =>{
        return (
        <>
            <Form.Group className="mb-5" >
                <Form.Label>domanda {index}</Form.Label><FaTrashAlt
                    className="trash"
                    onClick={() => deleteDomanda(index)}
                ></FaTrashAlt>
                <Form.Control type="text" value={d.domanda} onChange = {(event) => setValueDomanda(event.target.value, index) } />
                {d.chiusa ? 
                <>
                    <Form.Label>massimo numero di risposte</Form.Label>
                    <Form.Control type="text" value={d.maxR} onChange = {(event) => setMaxR(event.target.value, index) } />
                </>
                : ""}
                {d.risposte.map((r, index) => {
                    return(
                    <>
                    <Form.Label>risposta {index}</Form.Label><FaTrashAlt
                    className="trash"
                    onClick={() => deleteRisposta(d.dId, index)}
                    ></FaTrashAlt>
                    <Form.Control type="text" value={r} onChange = {(event) => setValueRisposta(event.target.value, d.dId, index)} />
                    </>);
                })} 
                {d.chiusa  ? 
                <Button onClick = {() => {addRisposta(index)}} variant="info">Aggiungi risposta alla domanda {index}</Button>
                : ""}
            </Form.Group>
           
           
        </>);


    }
    )};
    <Col>
    <Button onClick = {() => { 
      setDomande([...domande, {dId: nDomande , domanda: "", risposte: [""], chiusa : true, maxR:1} ]); 
      setNDomande(nDomande + 1);}}>
          Aggiungi domanda a risposta chiusa
    </Button>
    </Col>
    <Col>
    <Button onClick = {() => { 
      setDomande([...domande, {dId: nDomande , domanda: "", risposte: [], chiusa:false} ]); 
      setNDomande(nDomande + 1);}}>
          Aggiungi domanda a risposta aperta
    </Button>
    </Col>
  <Row className = "mt-4">
    <Col >
        <Button variant="success"  onClick = {() => submit(props.user)}>
            Submit
        </Button>
    </Col>
  </Row>
</Form>
);
}

export default CreaQuestionario;