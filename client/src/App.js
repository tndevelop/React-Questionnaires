import "bootstrap/dist/css/bootstrap.min.css";
import {React, useState} from "react";
import './App.css';
import { Container, Button, Col} from "react-bootstrap";
import {  BrowserRouter as Router,  Switch,  Route,  Redirect, Link} from "react-router-dom";
import ListaQuestionari from "./components/ListaQuestionari";
import ListaRisposte from "./components/ListaRisposte";
import ButtonNuovoQuestionario from "./components/ButtonNuovoQuestionario";
import CreaQuestionario from "./components/CreaQuestionario";
import {LoginForm} from "./components/LoginForm"
import CompilaQuestionario from "./components/CompilaQuestionario";
import API from "./fileJS/API.js";

const questionari= [

  {id: 1, nome: "ti piace la frutta", numCompilazioni : 7},
  {id: 2,nome: "ti piace la pasta", numCompilazioni : 4},
  {id: 3,nome: "ti piace la pizza", numCompilazioni : 3}


];

const domande = [
  {dId: 1, nome: "Tommaso", qId: 1, domanda: "ti piacciono le mele?", risposte: ["Sì", "No", "Così così"], rispostaSelezionata : 0, chiusa:true},
  {dId: 2, nome: "Tommaso", qId: 1, domanda: "ti piacciono le fragole?", risposte: ["Sì", "No", "Così così"], rispostaSelezionata : 2, chiusa:true},
  {dId: 3, nome: "Tommaso", qId: 1, domanda: "ti piacciono le banane?", risposte: [], rispostaSelezionata : 2, chiusa:false}


];

const domandeQuestionario = [
  {dId: 0, nome: "Tommaso", qId: 1, domanda: "ti piacciono le mele?", risposte: [{testo: "Sì", selezionata:false},{testo: "No", selezionata:false},{testo: "Così così", selezionata:false}], rispostaSelezionata : 0, chiusa:true, maxR:1},
  {dId: 1, nome: "Tommaso", qId: 1, domanda: "ti piacciono le fragole?", risposte: [{testo: "Sì", selezionata:false},{testo: "No", selezionata:false},{testo: "Così così", selezionata:false}], rispostaSelezionata : 2, chiusa:true, maxR:2},
  {dId: 2, nome: "Tommaso", qId: 1, domanda: "ti piacciono le banane?", risposte: [], testoRispostaAperta : "", chiusa:false}


];

function App() {
  const [dirty, setDirty] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState({ id: 1 });

  const login = async (credentials) => {
    try {
      //const response = await API.logIn(credentials);
      //if (response) {
      //  setUser({ id: response.id, name: response.name });
        setLoggedIn(true);
        setDirty(true); //così viene eseguita la useEffect
      return true;//  return response.name;
      //}
    } catch (e) {
      return "Incorrect username and/or password";
    }

  }
  return (
    
    <Router>
      
      <Container fluid="true">
        <Switch>
        <Route
            path="/utilizzatore/questionario"
            render={({location}) => (
              <>
                <CompilaQuestionario
                qId = {location.state.qId}
                userId = {location.state.userId}
                domande = {domandeQuestionario.filter(r => r.qId===location.state.qId)}
                ></CompilaQuestionario>
              </>
            )}
          />
        <Route
            path="/utilizzatore"
            render={() => (
              <>
                <ListaQuestionari  utilizzatore="true"></ListaQuestionari>
              </>
            )}
          />

        

          <Route
            path="/admin/questionario/crea"
            render={() => (
              <>
                <CreaQuestionario user = {user.id}></CreaQuestionario>
              </>
            )}
          />

          <Route
            path="/admin/questionario"
            render={({location}) => (
              <>
                <ListaRisposte
                  loggedIn = {loggedIn}
                  userId = {user.id}
                  qId = {location.state.qId}
                  domande = {domande.filter(r => r.qId===location.state.qId)}
                  
                ></ListaRisposte>
               <p></p>
              </>
            )}
          />
          
          <Route
            exact
            path="/admin"
            render={() => {
                return (
                  <>
                   <ListaQuestionari
                      loggedIn = {loggedIn}
                      userId = {user.id}
                      
                    ></ListaQuestionari>
                    <ButtonNuovoQuestionario/>
                  </>
                );
              }
            }
          />

        <Route
            path="/"
            render={() => (
              <>{loggedIn ? ( <Redirect to ={"/admin"}/>) :
                <><LoginForm login = {login}></LoginForm>
                  <Link to="/utilizzatore"><Button>continua come utilizzatore</Button></Link>
                </>
                }
              </>
            )}
          />
        </Switch>
        </Container>
    </Router>
    
  );
}

export default App;
