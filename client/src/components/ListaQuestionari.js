import { Row, ListGroup, Col } from "react-bootstrap";
import { Container } from "react-bootstrap";
import { Link} from "react-router-dom";
import API from "../fileJS/API.js";
import { useState, useEffect } from "react";

function ListaQuestionari(props) {

  const redirectAddress = props.utilizzatore ? "/utilizzatore/questionario" :  "/admin/questionario";
  const [questionari, setQuestionari] = useState([]);

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
    <Col as={Container} fluid="xl" className="mainContainer">
      
    <ListGroup variant="flush">
      
      {questionari.map((q, index) => {
        return (
          <Link key={index} to={{pathname: redirectAddress,
          state : {"qId" : q.id, "userId": q.user}}}>
            <ListGroup.Item key={q.id} index={q.id} onClick={() => {

            }}>
              <Row>
                <Col>{q.titolo}</Col>
                <Col>{q.nCompilazioni}</Col>   
              </Row>
            </ListGroup.Item>
          </Link>
        );
      })}
    </ListGroup>
    </Col>
  );
  
}


export default ListaQuestionari;
