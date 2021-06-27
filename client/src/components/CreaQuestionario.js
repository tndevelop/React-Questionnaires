import { Button,  Row, Col } from "react-bootstrap";
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
    const validminR = (minR) => {
        return Number.isInteger(parseInt(minR)) &&  minR >= 0 && minR <= 10;
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
        
<Form>
  <Form.Group className="mb-3" >
    <Form.Label>Nome questionario</Form.Label>
    <Form.Control 
        type="text" 
        value={nome} 
        onChange = {(event) => setNome(event.target.value)}
        isInvalid={!validString(nome)}
    />
    
  </Form.Group>
    
    {domande.map((d, index) =>{
        return (
        <>
            
            <Form.Group className="mb-5" key={index}>
                <Button disabled={index===0} onClick= {() => moveQuestion(index, index-1)}><AiOutlineCaretUp></AiOutlineCaretUp></Button><Button disabled={index===domande.length-1} onClick= {() => moveQuestion(index, index+1)}><AiOutlineCaretDown></AiOutlineCaretDown></Button>
                <Form.Label>domanda {index}</Form.Label><FaTrashAlt
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
                        <Form.Label>massimo numero di risposte</Form.Label>
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
                        <Form.Label>minimo numero di risposte</Form.Label>
                    </Col>
                    <Col>
                        <Form.Control 
                            type="number" 
                            value={d.minR} 
                            onChange = {(event) => setMinR(event.target.value, index, d.maxR) } 
                            isInvalid={!validminR(d.minR)}
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
                    <>
                    <Form.Label>risposta {index}</Form.Label><FaTrashAlt
                    className="trash"
                    onClick={() => deleteRisposta(d.dId, index)}
                    ></FaTrashAlt>
                    <Form.Control 
                        type="text" 
                        value={r} 
                        onChange = {(event) => setValueRisposta(event.target.value, d.dId, index)} 
                        isInvalid={!validString(r)}
                    />
                    </>);
                })} 
                {d.chiusa  ? 
                <Button onClick = {() => {addRisposta(index)}} variant="secondary">Aggiungi risposta alla domanda {index}</Button>
                : ""}
            </Form.Group>
           
           
           
        </>);


    }
    )};
    <Col>
    <Button onClick = {() => { 
      setDomande([...domande, {dId: nDomande , domanda: "", risposte: [""], chiusa : true, maxR:1, minR:1} ]); 
      setNDomande(nDomande + 1);}}>
          Aggiungi domanda a risposta chiusa
    </Button>
    </Col>
    <Col>
    <Button onClick = {() => { 
      setDomande([...domande, {dId: nDomande , domanda: "", risposte: [], chiusa:false, obbligatoria: false} ]); 
      setNDomande(nDomande + 1);}}>
          Aggiungi domanda a risposta aperta
    </Button>
    </Col>
  <Row className = "mt-4">
    <Col >
        {valid ? 
        <Link to="/admin"><Button variant="success"  onClick = {() => submit(props.user)}>
            Submit
        </Button></Link> :
        <Button variant="success"  disabled>
        Submit
    </Button>
        }
        <BackButton faseModifica="true"></BackButton>
    </Col>
  </Row>
</Form>
);
}

export default CreaQuestionario;