import { Form, Button, Row, Col, Alert } from "react-bootstrap";
import { useState } from "react";

function LoginForm(props) {
  //const [userName, setUsername] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const validString = (str) => {
    return str.length !== 0 && str.search(/^\s+$/gm) === -1;
  };
  const validEmail = (email) => {
    let mailformat =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return email.match(mailformat) === null ? false : true;
  };

  const tryLogin = async (event) => {
    event.preventDefault();
    const credentials = { username, password };
    if (
      !validString(username) ||
      !validString(password) ||
      !validEmail(username)
    )
      return;

    setMessage("");
    let response = await props.login(credentials);
    if(response !== true)   setMessage(response);
  };

  return (
    <Row className="below-nav">
      <Col sm="4"></Col>
      <Form as={Col}>
        {message !== "" ? <Alert variant="danger">{message}</Alert> : ""}
        <Form.Group controlId="email">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter username"
            value={username}
            onChange={(ev) => setUsername(ev.target.value)}
            isInvalid={!validString(username) || !validEmail(username)}
          />
          <Form.Control.Feedback type="invalid">
            Insert a valid email
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
            isInvalid={!validString(password)}
          />
          <Form.Control.Feedback type="invalid">
            Password must be not empty
          </Form.Control.Feedback>
        </Form.Group>

        <Button variant="primary" type="submit" onClick={tryLogin}>
          Login
        </Button>
      </Form>
      <Col sm="4"></Col>
    </Row>
  );
}

function LogoutButtonAndWelcomeUser(props) {
  const [welcome, setWelcome] = useState(true);

  return (
    <>
      <Row className="below-nav">
        <Col sm="3"></Col>
        <Col>
          {welcome ? (
            <Alert
              as={Col}
              variant="success"
              onClose={() => setWelcome(false)}
              dismissible
              className="text-center"
            >
              Welcome, {props.username}
            </Alert>
          ) : (
            ""
          )}
        </Col>
        <Col sm="3"></Col>
      </Row>
      <Row>
        <Col sm="4"></Col>
        <Button variant="danger" as={Col} onClick={props.logout}>
          Logout
        </Button>
        <Col sm="4"></Col>
      </Row>
    </>
  );
}

export { LoginForm, LogoutButtonAndWelcomeUser };
