import { Button,  Row, Col, Container } from "react-bootstrap";
import Form from 'react-bootstrap/Form'
import { useState, useEffect} from "react";
import { FaTrashAlt } from "react-icons/fa";
import API from "../fileJS/API.js";
import { Link} from "react-router-dom";
import { BackButton } from "./BackButton";
import {AiOutlineCaretDown, AiOutlineCaretUp} from "react-icons/ai";

function CreaQuestionario(props){
    const [nDomande, setNDomande] = useState(0);
    const[domande, setDomande] = useState([]);
    const[nome, setNome] = useState("");
    const[valid, setValid] = useState(false);

    useEffect(() => {
        const validInputs = () => {
            let ret = true;
            if (!validString(nome)) return false;
            if(domande.length === 0) return false;
            for(let idxD in domande){
                if(!validString(domande[idxD].domanda)) return false;
                if(domande[idxD].chiusa === true)
                    for(let idxR in domande[idxD].risposte)
                        if(!validString(domande[idxD].risposte[idxR])) return false;
            }
            return ret;
    
        }

       if(validInputs()) setValid(true);
       else setValid(false); 
        
      }, [nome, domande, domande.length, nDomande]); 


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
        if (maxR > 10) maxR=10;
        if (maxR < 1) maxR = 1;
        if (!Number.isInteger(parseInt(maxR))) maxR = 1;
        newDomande[indiceDomanda].maxR = maxR;
        setDomande([...newDomande]);
    }

    const setObbligatoria = (obbligatoria, indiceDomanda) => {
        const newDomande = domande;
        newDomande[indiceDomanda].obbligatoria = obbligatoria;
        setDomande([...newDomande]);
    }

    const setMinR = (minR, indiceDomanda, maxR) => {
        const newDomande = domande;
        if (minR > maxR) minR=maxR;
        if (minR < 0) minR = 0;
        if (!Number.isInteger(parseInt(minR))) minR = 1;
        if (minR > newDomande[indiceDomanda].risposte.length) minR = newDomande[indiceDomanda].risposte.length;
        newDomande[indiceDomanda].minR = minR;
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
        setNDomande(nDomande-1)
        for (let i = indiceDomanda; i< newDomande.length; i++)      newDomande[i].dId--;
        setDomande([...newDomande]);
    }

    const deleteRisposta = (indiceDomanda, indiceRisposta) => {
        const newDomande = domande;
        newDomande[indiceDomanda].risposte.splice(indiceRisposta, 1);
        setDomande([...newDomande]);
    }

    

    const validString = (str) => {
        return str !== undefined && str.length !== 0;
      };

    const validmaxR = (maxR) => {
        return Number.isInteger(parseInt(maxR)) &&  maxR >= 1 && maxR <= 10;
      };
    const validminR = (minR, risposte) => {
        return Number.isInteger(parseInt(minR)) &&  minR >= 0 && minR <= 10 && minR <= risposte.length;
      };

      const moveQuestion = (indiceDomanda, nuovoIndice) => {
        const newDomande = domande;
        newDomande[indiceDomanda] = newDomande.splice(nuovoIndice,1, newDomande[indiceDomanda])[0];
        const tmpId = newDomande[indiceDomanda].dId;
        newDomande[indiceDomanda].dId = newDomande[nuovoIndice].dId;
        newDomande[nuovoIndice].dId = tmpId;
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
                    d = {dId: domande[idx].dId , domanda: domande[idx].domanda, risposte: domande[idx].risposte, chiusa:  domande[idx].chiusa, maxR : domande[idx].maxR, minR: domande[idx].minR}
                }else{
                    d = {dId: domande[idx].dId , domanda: domande[idx].domanda, risposte: [], chiusa:  domande[idx].chiusa, obbligatoria: domande[idx].obbligatoria}
                }

                API.addDomanda(d, q);
            }    
          };
          

          addQuestionario().catch((err) => {
            console.error(err);
          });   
    }

    return(
<Col as={Container} fluid="xl" className="mainContainer">
<Form>
  <Form.Group className="mb-3" >
    <Form.Label><b>Nome questionario</b></Form.Label>
    <Form.Control 
        type="text" 
        value={nome} 
        onChange = {(event) => setNome(event.target.value)}
        isInvalid={!validString(nome)}
    />
    
  </Form.Group>
    
    {domande.map((d, index) =>{
        return (
        <Row key={index}>
            
            <Form.Group className="mb-5" >
                <Button variant="info" className="mb-2" disabled={index===0} onClick= {() => moveQuestion(index, index-1)}><AiOutlineCaretUp></AiOutlineCaretUp></Button><Button variant="info" className="mb-2" disabled={index===domande.length-1} onClick= {() => moveQuestion(index, index+1)}><AiOutlineCaretDown></AiOutlineCaretDown></Button>
                
                <Form.Label><b>Domanda {index}</b></Form.Label><FaTrashAlt
                    className="trash"
                    onClick={() => deleteDomanda(index)}
                ></FaTrashAlt>
                <Form.Control 
                    type="text" 
                    value={d.domanda} 
                    onChange = {(event) => setValueDomanda(event.target.value, index) } 
                    isInvalid={!validString(d.domanda)}
                />
                {d.chiusa ? 
                <>
                <Row>
                    <Col>
                        <Form.Label>Massimo numero di risposte</Form.Label>
                    </Col>
                    <Col>
                        <Form.Control 
                            type="number" 
                            value={d.maxR} 
                            onChange = {(event) => setMaxR(event.target.value, index) } 
                            isInvalid={!validmaxR(d.maxR)}
                        />
                    </Col>
                    <Col/>
                    <Col>
                        <Form.Label>Minimo numero di risposte</Form.Label>
                    </Col>
                    <Col>
                        <Form.Control 
                            type="number" 
                            value={d.minR} 
                            onChange = {(event) => setMinR(event.target.value, index, d.maxR) } 
                            isInvalid={!validminR(d.minR, d.risposte)}
                        />
                    </Col>
                    <Col/>
                    </Row>
                </>
                : <Form.Check
                        inline
                        type="checkbox"
                        checked={d.obbligatoria}
                        label="domanda obbligatoria"
                        onChange={(event) => setObbligatoria(event.target.checked, index)}
                    />
              }
                {d.risposte.map((r, index) => {
                    return(
                    <Row index = {index}>
                    <Form.Label><b>Risposta {index}</b><FaTrashAlt
                    className="trash"
                    onClick={() => deleteRisposta(d.dId, index)}
                    ></FaTrashAlt></Form.Label>
                    <Form.Control 
                        type="text" 
                        value={r} 
                        onChange = {(event) => setValueRisposta(event.target.value, d.dId, index)} 
                        isInvalid={!validString(r)}
                    />
                    </Row>);
                })} 
                {d.chiusa  ? 
                <Button className="mt-3" onClick = {() => {addRisposta(index)}} variant="info">Aggiungi risposta alla domanda {index}</Button>
                : ""}
            </Form.Group>
           
           
           
        </Row>);


    }
    )}
    <Col className="mb-3">
    <Button variant="light" onClick = {() => { 
      setDomande([...domande, {dId: nDomande , domanda: "", risposte: [""], chiusa : true, maxR:1, minR:1} ]); 
      setNDomande(nDomande + 1);}}>
          Aggiungi domanda a risposta chiusa
    </Button>
    </Col>
    <Col>
    <Button variant="light" onClick = {() => { 
      setDomande([...domande, {dId: nDomande , domanda: "", risposte: [], chiusa:false, obbligatoria: false} ]); 
      setNDomande(nDomande + 1);}}>
          Aggiungi domanda a risposta aperta
    </Button>
    </Col>
  <Row className = "mt-4">
    <Col >
        {valid ? 
        <Link to="/admin"><Button variant="primary"  onClick = {() => submit(props.user)}>
            Submit
        </Button></Link> :
        <Button variant="primary"  disabled>
        Submit
    </Button>
        }
        
    </Col>
  </Row>
  <BackButton faseModifica="true"></BackButton>
</Form>
</Col>        
);
}

export default CreaQuestionario;