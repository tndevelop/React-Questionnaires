"use strict";
/* Data Access Object (DAO) module */

const sqlite = require("sqlite3");
const dayjs = require("dayjs");
const bcrypt = require('bcrypt');

// open the database
const db = new sqlite.Database("questionari.db", (err) => {
  if (err) throw err;
});


exports.questionariAdmin = (userId) => {
    let query = `SELECT * FROM questionari`;
  
    let whereClause = [];
    if (userId) whereClause.push(`user = ${userId}`);
    if (whereClause.length !== 0) query += " WHERE " + whereClause.join(" AND ");
    return new Promise((resolve, reject) => {
      db.all(query, [], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        console.log(query);
        const questionari = rows.map((q) => ({
          id: q.id,
          titolo: q.titolo,
          nCompilazioni: q.nCompilazioni,
          user : q.user,
        }));
        resolve(questionari);
      });
    });
  };
  

  exports.compilazioni = (userId, questId) => {
    let query = `SELECT * FROM compilazioni`;
  
    let whereClause = [];
    if (userId) whereClause.push(`user = ${userId}`);
    if (questId) whereClause.push(`questionario = ${questId}`);
    if (whereClause.length !== 0) query += " WHERE " + whereClause.join(" AND ");
    return new Promise((resolve, reject) => {
      db.all(query, [], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        console.log(query);
        const compilazioni = rows.map((c) => ({
          id: c.id,
          user : c.user,
          questionario: c.questionario,
          nomeUtilizzatore: c.nome_utilizzatore,
        }));
        resolve(compilazioni);
      });
    });
  };

  exports.domandeQuestionario = (compId, questId) => {
    let query = `SELECT * FROM domande_questionari`;
  
    let whereClause = [];
    if (compId) whereClause.push(`compilazione = ${compId}`);
    if (questId) whereClause.push(`questionario = ${questId}`);
    if (whereClause.length !== 0) query += " WHERE " + whereClause.join(" AND ");
    return new Promise((resolve, reject) => {
      db.all(query, [], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        
        const domande = rows.map((d) => ({
          id: d.id,
          testoDomanda: d.testo_domanda,
          compilazione : d.compilazione,
          questionario: d.questionario,
          chiusa : d.chiusa,
          rispostaSelezionata : d.risposta_selezionata,
          rispostaAperta: d.rispostaAperta,
        }));
        resolve(domande);
      });
    });
  };

  exports.risposteQuestionario = (domId, compId, questId) => {
    let query = `SELECT * FROM risposte_questionari`;
    console.log(domId);
    let whereClause = [];
    if (compId) whereClause.push(`compilazione = ${compId}`);
    if (questId) whereClause.push(`questionario = ${questId}`);
    if (domId) whereClause.push(`domanda = ${domId}`);
    if (whereClause.length !== 0) query += " WHERE " + whereClause.join(" AND ");
    return new Promise((resolve, reject) => {
      db.all(query, [], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        console.log(query);
        const risposte = rows.map((r) => ({
          id: r.id,
          testo: r.testo,
          domanda: r.domanda,
          compilazione : r.compilazione,
          questionario: r.questionario,
        }));
        resolve(risposte);
      });
    });
  };