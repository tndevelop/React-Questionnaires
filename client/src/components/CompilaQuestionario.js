import { Row, ListGroup, Col, Form, Button} from "react-bootstrap";
import { Container } from "react-bootstrap";
import {useState, useEffect} from "react";
import API from "../fileJS/API.js";
import {  BrowserRouter as Router,  Switch,  Route,  Redirect, Link} from "react-router-dom";
import { BackButton } from "./BackButton";

function CompilaQuestionario(props) {
    const[nome, setNome] = useState("");
    const[domande, setDomande] = useState([]);
    const[valid, setValid] = useState(false);

    useEffect(() => {
      
        
       if(validInputs()) setValid(true);
       else setValid(false); 
       
      }); 

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

    const submit = () =>{
      const addCompilazione = async () => {
        
        //add to domande questionari
        // add to risposte questionari
        //increment count compilazioni in questionari
        let compilazione = {
          nome: nome,
          qId : props.qId,
          user: props.userId
        }
        const compId = await API.addCompilazione(compilazione);
        await API.increaseNCompilazioni(props.qId, props.userId);
        
        for(let idx in domande){
          let d;
          let risp_selezionate = [];
          for (let ridx in domande[idx].risposte)
            if(domande[idx].risposte[ridx].selezionata)
              risp_selezionate.push(ridx);
          if(domande[idx].chiusa == "1"){
              d = {user: props.userId, compilazione: compId, questionario: props.qId, testo_domanda: domande[idx].domanda, chiusa: domande[idx].chiusa, risposta_selezionata: risp_selezionate}
          }else{
              d = {user: props.userId, compilazione: compId, questionario: props.qId, testo_domanda: domande[idx].domanda, chiusa: domande[idx].chiusa, rispostaAperta: domande[idx].testoRispostaAperta }
          }
          await API.addDomandaCompilata(d);
        } 
        

      };
    

      addCompilazione().catch((err) => {
        console.error(err);
      });   
    }

    useEffect(() => {
      const getDomande = async () => {
          const domande = await API.fetchDomandeUtilizzatore(props.qId);
          setDomande(domande);
      };
      
      getDomande().catch((err) => {
            console.error(err);
          });   
    }, []); //run only once at beginning

    const validString = (str) => {
      return str != undefined && str.length !== 0;
    };

    const validInputs = () => {
      let ret = true;
      console.log(domande)
      if (!validString(nome)) return false;
      for(let idxD in domande){
          if(domande[idxD].chiusa == "1"){
              if(domande[idxD].risposte.filter(r=>r.selezionata == true).length == 0) 
                return false;
          }else {
            if(!validString(domande[idxD].testoRispostaAperta)) return false;
          }
      }
      return ret;

  }

  return (
    <Col as={Container} fluid="xl" className="mainContainer">
    <BackButton utilizzatore="true" faseModifica="true"></BackButton>

      <Form.Group className="mb-3 mt-3" >
    <Form.Label>Il tuo nome</Form.Label>
    <Form.Control 
      type="text" 
      value={nome} 
      onChange = {(event) => setNome(event.target.value)}
      isInvalid={!validString(nome)}
    />
    
  </Form.Group>
      {domande.map((d, index) => {
        return (
          
            <>
                <Row>
                    <Col/> 
                    <Col>{d.domanda}</Col> 
                    {d.chiusa=="1"? <Col>massimo risposte: {d.maxR}</Col> :  <Col/>
                      
                    }
                    {d.chiusa=="1" && d.risposte.filter((r) => r.selezionata).length == 0 ? <p className="red">select at least 1</p> : "" }
                </Row>
                <ListGroup variant="flush">

                    {d.chiusa=="1" ?
                    
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
                    
                    : <Form.Control 
                          type="text" 
                          value={d.testoRispostaAperta} 
                          onChange = {(event) => setValueRispostaAperta(event.target.value, d.dId)} 
                          isInvalid={!validString(d.testoRispostaAperta)}
                        />
                    }
                </ListGroup>
                
          </>
          
        );

      })}
      {valid ? 
        <Link to="/utilizzatore"><Button  className="mt-4" onClick = {() => submit()}>Submit</Button></Link>
      : <Button  className="mt-4" disabled>Submit</Button>}
    </Col>
  );
  
}


export default CompilaQuestionario;
