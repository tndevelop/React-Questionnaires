'use strict';

const express = require('express');
const morgan = require('morgan');
const dao = require("./dao");
const { check, query, validationResult } = require("express-validator"); // validation middleware

// init express
const app = new express();
const port = 3001;

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

// set-up the middlewares
app.use(morgan("dev"));
app.use(express.json()); // for parsing json request body


/* admin APIs */

// GET /api/admin/questionari -> tutti i questionari dell'admin
app.get("/api/admin/questionari",  /*isLoggedIn,*/ (req, res) => {
  
  const userId = req.query.user_id;
  console.log(userId);
      dao.questionariAdmin(
        userId
        )
        .then((questionari) => res.json(questionari))
        .catch(() => res.status(500).end());
});

// GET /api/admin/compilazioni -> tutte le compilazioni di un singolo questionario dell'admin
app.get("/api/admin/compilazioni",  /*isLoggedIn,*/ (req, res) => {
  
  const userId = req.query.user_id;
  const questId = req.query.quest_id;
      dao.compilazioni(
        userId,
        questId,
        )
        .then((questionari) => res.json(questionari))
        .catch(() => res.status(500).end());
});

// GET /api/admin/domandeQuestionario -> tutte le domande di una singola compilazione di un singolo questionario dell'admin
app.get("/api/admin/domandeQuestionario",  /*isLoggedIn,*/ (req, res) => {
  
  const compId = req.query.comp_id;
  const questId = req.query.quest_id;
      dao.domandeQuestionario(
        compId,
        questId,
        )
        .then((questionari) => res.json(questionari))
        .catch(() => res.status(500).end());
});

// GET /api/admin/risposteQuestionario -> tutte le risposte di una specifica domanda di una singola compilazione di un singolo questionario dell'admin
app.get("/api/admin/risposteQuestionario",  /*isLoggedIn,*/ (req, res) => {
  const domId = req.query.dom_id;
  const compId = req.query.comp_id;
  const questId = req.query.quest_id;
      dao.risposteQuestionario(
        domId,
        compId,
        questId,
        
        )
        .then((questionari) => res.json(questionari))
        .catch(() => res.status(500).end());
});


//POST /api/admin/questionari
app.post(
  "/api/admin/questionari",
  /*isLoggedIn,*/
  [
    check("titolo").exists(),
    check("user_id").exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    try {
      
      let questionario = req.body;
      let id = await dao.getQuestionarioMaxId();
      
      await dao.createQuestionario(questionario, id);
      res.status(200).json(id).end();
    } catch (err) {
      res
        .status(503)
        .json({ error: `Database error while adding the task: ${err}` });
    }
  }
);

//POST /api/utilizzatore/domandeQuestionario
app.post(
  "/api/utilizzatore/domandeQuestionario",
  /*isLoggedIn,*/
  [
    check("dId").exists(),
    check("domanda").exists(),
    check("risposte").exists(),

  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    try {
      
      let domanda = req.body;
      
      
      await dao.createDomanda(domanda);
      res.status(200).end();
    } catch (err) {
      res
        .status(503)
        .json({ error: `Database error while adding the task: ${err}` });
    }
  }
);


// GET /api/utilizzatore/questionari
app.get("/api/utilizzatore/questionari", (req, res) => {
      dao.questionariUtilizzatore(
        )
        .then((questionari) => res.json(questionari))
        .catch(() => res.status(500).end());
});

// GET /api/utilizzatore/domande
app.get("/api/utilizzatore/domande", (req, res) => {
  const questId = req.query.quest_id;
  dao.domandeQuestionarioUtilizzatore(
      questId,
    )
    .then((questionari) => res.json(questionari))
    .catch(() => res.status(500).end());
});

// POST /api/admin/compilazioni 
app.post(
  "/api/utilizzatore/compilazioni",
  /*isLoggedIn,*/
  [
    check("user").exists(),
    check("qId").exists(),
    check("nome").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    try {
      
      let compilazione = req.body;
      let id = await dao.getCompilazioneMaxId(compilazione.user, compilazione.qId);
      
      await dao.createCompilazione(compilazione, id);
      res.status(200).json(id).end();
    } catch (err) {
      res
        .status(503)
        .json({ error: `Database error while adding the task: ${err}` });
    }
  }
);

// POST /api/admin/compilazioni 
app.post(
  "/api/utilizzatore/domande",
  [
    check("compilazione").exists(),
    check("questionario").exists(),
  ],
  async (req, res) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    try {
      
      let domanda = req.body;
      let id = await dao.getDomandaMaxId(domanda.user, domanda.questionario, domanda.compilazione);
      await dao.createDomanda(domanda, id);
      res.status(200).json(id).end();
    } catch (err) {
      res
        .status(503)
        .json({ error: `Database error while adding the task: ${err}` });
    }
  }
);
