import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import './App.css';
import { Container, Button, Col} from "react-bootstrap";
import {  BrowserRouter as Router,  Switch,  Route,  Redirect,} from "react-router-dom";
import ListaQuestionari from "./components/ListaQuestionari";
import ListaRisposte from "./components/ListaRisposte";
import ButtonNuovoQuestionario from "./components/ButtonNuovoQuestionario";
import CreaQuestionario from "./components/CreaQuestionario";

const questionari= [

  {id: 1, nome: "ti piace la frutta", numCompilazioni : 7},
  {id: 2,nome: "ti piace la pasta", numCompilazioni : 4},
  {id: 3,nome: "ti piace la pizza", numCompilazioni : 3}


];

const domande = [
  {dId: 1, nome: "Tommaso", qId: 1, domanda: "ti piacciono le mele?", risposte: ["Sì", "No", "Così così"], rispostaSelezionata : 0},
  {dId: 2, nome: "Tommaso", qId: 1, domanda: "ti piacciono le fragole?", risposte: ["Sì", "No", "Così così"], rispostaSelezionata : 2}


];

function App() {
  return (
    
    <Router>
      
      <Container fluid="true">
        <Switch>
          <Route
            path="/login"
            render={() => (
              <>
               
              </>
            )}
          />

          <Route
            path="/questionario/crea"
            render={() => (
              <>
                <CreaQuestionario></CreaQuestionario>
              </>
            )}
          />

          <Route
            path="/questionario"
            render={({location}) => (
              <>
                <ListaRisposte 
                  domande = {domande.filter(r => r.qId===location.state.qId)}
                  
                ></ListaRisposte>
               <p></p>
              </>
            )}
          />
          
          <Route
            exact
            path="/"
            render={() => {
                return (
                  <>
                   <ListaQuestionari
                      questionari={questionari}
                    ></ListaQuestionari>
                    <ButtonNuovoQuestionario/>
                  </>
                );
              }
            }
          />
        </Switch>
        </Container>
    </Router>
    
  );
}

export default App;
