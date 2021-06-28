import "bootstrap/dist/css/bootstrap.min.css";
import {React, useState, useEffect} from "react";
import './App.css';
import { Container} from "react-bootstrap";
import {  BrowserRouter as Router,  Switch,  Route,  Redirect} from "react-router-dom";
import ListaQuestionari from "./components/ListaQuestionari";
import ListaRisposte from "./components/ListaRisposte";
import CreaQuestionario from "./components/CreaQuestionario";
import {LoginForm, LogoutButtonAndWelcomeUser} from "./components/LoginForm"
import CompilaQuestionario from "./components/CompilaQuestionario";
import API from "./fileJS/API.js";
document.body.style = 'background: #ccebff;';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState({ id: -1 });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userInfo = await API.getUserInfo();
        setUser({ id: userInfo.id, name: userInfo.name });
        setLoggedIn(true);
      } catch (err) {
        console.log(err.error);
      }
    };
    checkAuth();
  }, [loggedIn]);

  const login = async (credentials) => {
    try {
      const response = await API.logIn(credentials);
      if (response) {
        setUser({ id: response.id, name: response.name });
        setLoggedIn(true);
      return true;//  return response.name;
      }
    } catch (e) {
      return "Incorrect username and/or password";
    }

  }

  const doLogOut = () => {
    API.logOut()
      .then((val) => setLoggedIn(false))
      .catch((err) => console.log(err));
  };
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
              {loggedIn ? (
                      <>
                        <LogoutButtonAndWelcomeUser
                          logout={doLogOut}
                          username={user.name}
                        />
                      </>
                    ) : (
                      <Redirect to="/" />
                    )}
                <CreaQuestionario user = {user.id}></CreaQuestionario>
              </>
            )}
          />

          <Route
            path="/admin/questionario"
            render={({location}) => (
              <>
              {loggedIn ? (
                      <>
                        <LogoutButtonAndWelcomeUser
                          logout={doLogOut}
                          username={user.name}
                        />
                      </>
                    ) : (
                      <Redirect to="/" />
                    )}
                <ListaRisposte
                  loggedIn = {loggedIn}
                  userId = {user.id}
                  qId = {location.state.qId}
                  
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
                    {loggedIn ? (
                      <>
                        <LogoutButtonAndWelcomeUser
                          logout={doLogOut}
                          username={user.name}
                        />
                      </>
                    ) : (
                      <Redirect to="/" />
                    )}
                   <ListaQuestionari
                      loggedIn = {loggedIn}
                      userId = {user.id}
                      
                    ></ListaQuestionari>
                    
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
