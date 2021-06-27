import { Row, ListGroup, Col, Button} from "react-bootstrap";
import { Container } from "react-bootstrap";
import { useState, useEffect } from "react";
import API from "../fileJS/API.js";
import { AiOutlineCaretRight, AiOutlineCaretLeft } from "react-icons/ai";
import { BackButton } from "./BackButton";

function ListaRisposte(props) {
  const [compilazioni, setCompilazioni] = useState([]);
  const [nCompilazione, setNCompilazione] = useState(0);
  const [domande, setDomande] = useState([]);
  const [loadRisposte, setLoadRisposte] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCompilazioni = async () => {
      if (props.loggedIn) {
        const compilazioni = await API.fetchCompilazioni(props.userId, props.qId);
        setCompilazioni(compilazioni);
      }
    };
    getCompilazioni().catch((err) => {
          console.error(err);
        });
        
    
  }, [props.userId, props.qId, props.loggedIn]);

  useEffect(() => {
    const getDomande = async () => {
      if (props.loggedIn && compilazioni.length > 0) {
        setLoading(true);
        const domande = await API.fetchDomandeQuestionario(compilazioni[nCompilazione].id , props.qId);
        setDomande([...domande]);
        setLoadRisposte(true);        
      }
    };
    
    getDomande().catch((err) => {
          console.error(err);
        });
    
  }, [compilazioni.length, nCompilazione, props.loggedIn, props.qId, compilazioni]);

  useEffect(() => {
    const getRisposte = async (nDomanda) => {
      const newDomande = domande;
      if (props.loggedIn /*&& compilazioni.length > 0*/ && loadRisposte) {
        const risposte = await API.fetchRisposteQuestionario(props.userId , props.qId, domande[nDomanda].id-1);
        newDomande[nDomanda].risposte = risposte;
        setDomande([...newDomande]);
        if(parseInt(nDomanda) === domande.filter(d => d.chiusa==="1").length-1)
          setLoading(false);
        setLoadRisposte(false);
      }
    };  

    
    for (let idx in domande){
      if(domande[idx].chiusa==="1")
        getRisposte(idx).catch((err) => {
          console.error(err);
        });
    }
    
  }, [domande.length, loadRisposte, props.loggedIn, props.userId, props.qId, domande]);


  return (
    <Col as={Container} fluid="xl" className="mainContainer">
      {loading? "" : 
       <Row className = "mb-4">
                    <Col/><Col>Compilazione fatta da: {compilazioni[nCompilazione].nomeUtilizzatore}</Col><Col/>
        </Row>}
      {loading? <p>still loading</p> : domande.map((q, index) => {
        return (
          
            <>
                <Row key = {index}>
                    <Col/><Col>{q.testoDomanda}</Col><Col/>
                </Row>
                <ListGroup variant="flush" key = {index + domande.length}>
                    {q.chiusa==="1"? q.risposte.map((r, index) => {
                    return ( 
                        <ListGroup.Item key={index} index={index} active={Array.isArray(q.rispostaSelezionata) ? q.rispostaSelezionata.includes(`${index}`): q.rispostaSelezionata === index} >
                            <Row>
                            <Col>{r}</Col>
                            </Row>
                        </ListGroup.Item> 
                    );
            
                    }): 
                    <p>{(q.rispostaAperta != undefined && q.rispostaAperta!== "") ? q.rispostaAperta : <b>L'utilizzatore non ha risposto alla domanda</b>}</p>
                    }
                </ListGroup>
          </>
          
        );

      })}

      <Row>
        <Col>
          <BackButton></BackButton>
        </Col>
        <Col>
          <Button disabled = {nCompilazione===0} onClick= {() =>{setNCompilazione(nCompilazione-1)}}><AiOutlineCaretLeft/></Button>
          <Button disabled={nCompilazione === (compilazioni.length-1)} onClick= {() =>{setNCompilazione(nCompilazione+1);}}><AiOutlineCaretRight/></Button>
        </Col> 
      </Row>
      
    </Col>
    
  );
  
}


export default ListaRisposte;
