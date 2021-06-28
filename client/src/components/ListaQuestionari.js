import { Row, ListGroup, Col, Button } from "react-bootstrap";
import { Container } from "react-bootstrap";
import { Link} from "react-router-dom";
import API from "../fileJS/API.js";
import { useState, useEffect } from "react";
import ButtonNuovoQuestionario from "./ButtonNuovoQuestionario";

function ListaQuestionari(props) {

  const redirectAddress = props.utilizzatore ? "/utilizzatore/questionario" :  "/admin/questionario";
  const [questionari, setQuestionari] = useState([]);
  const variantColor = "bg-light";
  const firstColor = "bg-white"

  useEffect(() => {
    const getQuestionari = async () => {
      if (props.loggedIn) {
        const questionari = await API.fetchQuestionari(props.userId);
        setQuestionari(questionari);
      }else if(props.utilizzatore){
        const questionari = await API.fetchQuestionariUtilizzatore(props.userId);
        setQuestionari(questionari);
      }     
    };
    
    getQuestionari().catch((err) => {
          console.error(err);
        });   
  }, [props.loggedIn, props.userId, props.utilizzatore]); //run only once at beginning

  return (
    <>
    <Col as={Container} fluid="xl" className="mainContainer mt-5">
      
    <ListGroup variant="flush">
      
      {questionari.map((q, index) => {
        return (
          <Link key={index} to={{pathname: redirectAddress,
          state : {"qId" : q.id, "userId": q.user}}}>
            <ListGroup.Item  className = { index % 2 ? variantColor : firstColor } key={q.id} index={q.id} onClick={() => {

            }}>
              <Row>
                <Col><b>{q.titolo}</b></Col>
                <Col>{q.nCompilazioni}</Col>   
              </Row>
            </ListGroup.Item>
          </Link>
        );
      })}
    </ListGroup>
    {props.utilizzatore ? <Link to="/"><Button className="mt-3" variant="secondary">Torna alla login</Button></Link> : <ButtonNuovoQuestionario/>}
    </Col>
    
    </>
  );
  
}


export default ListaQuestionari;
