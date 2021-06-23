'use strict';

const express = require('express');
const morgan = require('morgan');
const dao = require("./dao");

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
