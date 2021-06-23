import { Row, ListGroup, Col, Button} from "react-bootstrap";
import { Container } from "react-bootstrap";
import { useState, useEffect } from "react";
import API from "../fileJS/API.js";
import { AiOutlineCaretRight, AiOutlineCaretLeft } from "react-icons/ai";

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
        
    
  }, []);

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
    
  }, [compilazioni.length, nCompilazione]);

  useEffect(() => {
    const getRisposte = async (nDomanda) => {
      const newDomande = domande;
      if (props.loggedIn && compilazioni.length > 0 && loadRisposte) {
        const risposte = await API.fetchRisposteQuestionario(compilazioni[nCompilazione].id , props.qId, domande[nDomanda].id);
        newDomande[nDomanda].risposte = risposte;
        setDomande([...newDomande]);
        if(nDomanda == domande.filter(d => d.chiusa=="true").length-1)
          setLoading(false);
        setLoadRisposte(false);
      }
    };    
    for (let idx in domande){
      if(domande[idx].chiusa=="true")
        getRisposte(idx).catch((err) => {
          console.error(err);
        });
    }
    
  }, [domande.length, loadRisposte]);


  return (
    <Col as={Container} fluid="xl" className="mainContainer">
      {loading? <p>still loading</p> : domande.map((q, index) => {
        return (
          
            <>
                <Row>
                    <Col/><Col>{q.testoDomanda}</Col><Col/>
                </Row>
                <ListGroup variant="flush">
                    {q.chiusa=="true"? q.risposte.map((r, index) => {
                    return ( 
                        <ListGroup.Item key={index} index={index} active={q.rispostaSelezionata === index} >
                            <Row>
                            <Col>{r.testo}</Col>
                            </Row>
                        </ListGroup.Item> 
                    );
            
                    }): 
                    <p>{q.rispostaAperta}</p>
                    }
                </ListGroup>
          </>
          
        );

      })}

      <Row><Col><Button disabled = {nCompilazione==0} onClick= {() =>{setNCompilazione(nCompilazione-1)}}><AiOutlineCaretLeft/></Button><Button disabled={nCompilazione == (compilazioni.length-1)} onClick= {() =>{console.log(nCompilazione); setNCompilazione(nCompilazione+1);}}><AiOutlineCaretRight/></Button></Col></Row>
    
    </Col>
  );
  
}


export default ListaRisposte;
