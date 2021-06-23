import { Row, ListGroup, Col, Form, Button} from "react-bootstrap";
import { Container } from "react-bootstrap";
import {useState, useEffect} from "react";
import API from "../fileJS/API.js";

function CompilaQuestionario(props) {
    const[nome, setNome] = useState("");
    const[domande, setDomande] = useState([]);
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
        console.log(newDomande[indiceDomanda])
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
        

        /*
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
        }    */
      };
    

      addCompilazione().catch((err) => {
        console.error(err);
      });   
    }

    useEffect(() => {
      const getDomande = async () => {
          const domande = await API.fetchDomandeUtilizzatore(props.qId);
          setDomande(domande);
          console.log(domande);     
      };
      
      getDomande().catch((err) => {
            console.error(err);
          });   
    }, []); //run only once at beginning

  return (
    <Col as={Container} fluid="xl" className="mainContainer">
      <Form.Group className="mb-3" >
    <Form.Label>Il tuo nome</Form.Label>
    <Form.Control type="text" value={nome} onChange = {(event) => setNome(event.target.value)}/>
    
  </Form.Group>
      {domande.map((d, index) => {
        return (
          
            <>
                <Row>
                    <Col/> 
                    <Col>{d.domanda}</Col> 
                    {d.chiusa=="1"? <Col>massimo risposte: {d.maxR}</Col> :  <Col/>}
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
                    
                    : <Form.Control type="text" value={d.testoRispostaAperta} onChange = {(event) => setValueRispostaAperta(event.target.value, d.dId)} />
                    }
                </ListGroup>
                
          </>
          
        );

      })}
        <Button className="mt-4" onClick = {() => submit()}>Submit</Button>
    </Col>
  );
  
}


export default CompilaQuestionario;
