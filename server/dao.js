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

  exports.risposteQuestionario = (domId, userId, questId) => {
    let query = `SELECT * FROM domande_questionari_vuote`;
    let whereClause = [];
    if (questId) whereClause.push(`q_id = ${questId}`);
    if (domId) whereClause.push(`d_id = ${domId}`);
    if (userId) whereClause.push(`user_id = ${userId}`);
    if (whereClause.length !== 0) query += " WHERE " + whereClause.join(" AND ");
    return new Promise((resolve, reject) => {
      db.all(query, [], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        console.log(query);
        const risposte = rows.map((r) => ({
          risposte: r.risposte
        }));
        resolve(risposte);
      });
    });
  };

  exports.getQuestionarioMaxId = () => {
    return new Promise((resolve, reject) => {
      const sql_id = "SELECT MAX(id) as maxId FROM questionari";
      let id;
      db.get(sql_id, [], (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        if (row.maxId) {
          id = row.maxId + 1;
  
        } else {
          id = 1;
        }
        resolve(id);
      });
    })
  };

  
//create a new task
exports.createQuestionario =  (questionario, id) => {
    return new Promise((resolve, reject) =>  {
      const sql =
        "INSERT INTO questionari(id, titolo, nCompilazioni, user) VALUES(?, ?, ?, ?)";
      db.run(
        sql,
        [
          id,
          questionario.titolo,
          0,
          questionario.user_id,
        ],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve(this.lastID);
          }
        }
      );
  
    });
  };
  //create a new task
exports.createDomandaQuestionario =  (d) => {
    return new Promise((resolve, reject) =>  {
      const sql =
        "INSERT INTO domande_questionari_vuote(d_id,	q_id,	user_id,	domanda,	risposte,	chiusa,	maxR) VALUES(?, ?, ?, ?,?,?,?)";
      db.run(
        sql,
        [
          d.dId,
          d.qId,
          d.user_id,
          d.domanda,
          d.risposte,
          d.chiusa,
          d.maxR
        ],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve(this.lastID);
          }
        }
      );
  
    });
  };


  exports.questionariUtilizzatore = () => {
    let query = `SELECT * FROM questionari`;
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

  exports.domandeQuestionarioUtilizzatore = (questId) => {
    let query = `SELECT * FROM domande_questionari_vuote`;
    let whereClause = [];
    if (questId) whereClause.push(`q_id = ${questId}`);
    if (whereClause.length !== 0) query += " WHERE " + whereClause.join(" AND ");
    
    return new Promise((resolve, reject) => {
        db.all(query, [], (err, rows) => {
          if (err) {
            reject(err);
            return;
          }
          console.log(query);
          const domande = rows.map((q) => ({
            dId: q.d_id,
            qId: q.q_id,
            userId: q.user_id,
            domanda: q.domanda,
            risposte: q.risposte,
            chiusa: q.chiusa,
            maxR: q.maxR
          }));
          resolve(domande);
        });
      });
  };

  exports.getCompilazioneMaxId = (user_id, quest_id) => {
    return new Promise((resolve, reject) => {
      let sql_id = "SELECT MAX(id) as maxId FROM compilazioni";
      let whereClause = [];
    if (user_id) whereClause.push(`user = ${user_id}`);
    if (quest_id) whereClause.push(`questionario = ${quest_id}`);
    if (whereClause.length !== 0) sql_id += " WHERE " + whereClause.join(" AND ");
    console.log(sql_id)
      let id;
      db.get(sql_id, [], (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        if (row.maxId) {
          id = row.maxId + 1;
  
        } else {
          id = 1;
        }
        resolve(id);
      });
    })
  };

  exports.createCompilazione =  (c, id) => {
    return new Promise((resolve, reject) =>  {
      const sql =
        "INSERT INTO compilazioni(id, user, questionario, nome_utilizzatore) VALUES(?, ?, ?, ?)";
      db.run(
        sql,
        [
          id,
          c.user,
          c.qId,
          c.nome,
        ],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve(this.lastID);
          }
        }
      );
  
    });
  };

  exports.getDomandaMaxId = (user_id, quest_id, comp_id) => {
    return new Promise((resolve, reject) => {
      let sql_id = "SELECT MAX(id) as maxId FROM domande_questionari";
      let whereClause = [];
    if (user_id) whereClause.push(`user = ${user_id}`);
    if (quest_id) whereClause.push(`questionario = ${quest_id}`);
    if (comp_id) whereClause.push(`compilazione = ${comp_id}`);
    if (whereClause.length !== 0) sql_id += " WHERE " + whereClause.join(" AND ");
    console.log(sql_id)
      let id;
      db.get(sql_id, [], (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        if (row.maxId) {
          id = row.maxId + 1;
  
        } else {
          id = 1;
        }
        resolve(id);
      });
    })
  };

  exports.createDomanda =  (d, id) => {
    return new Promise((resolve, reject) =>  {
      const sql =
        "INSERT INTO domande_questionari(user, compilazione, questionario, id, testo_domanda, chiusa, risposta_selezionata, rispostaAperta ) VALUES(?, ?, ?, ?, ?, ?, ?, ?)";
      db.run(
        sql,
        [
          d.user,
          d.compilazione,
          d.questionario,
          id,
          d.testo_domanda,
          d.chiusa,
          d.risposta_selezionata,
          d.rispostaAperta,
        ],
        function (err) {
            
          if (err) {
            reject(err);
          } else {
            resolve(this.lastID);
          }
        }
      );
  
    });
  };


  exports.getUser = (email, password) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM users WHERE email = ?';
      db.get(sql, [email], (err, row) => {
        if (err) {
          reject(err);
        }
        else if (row === undefined) {
          resolve(false);
        }
        else {
          const user = { id: row.id, username: row.email, name: row.name };
          bcrypt.compare(password, row.hash).then(result => {
            if (result) {
              resolve(user);
            }
            else {
              resolve(false);
            }
          });
        }
      });
    });
  };

  
exports.getUserById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users WHERE id = ?';
    db.get(sql, [id], (err, row) => {
      if (err) {
        reject(err);
      }
      else if (row === undefined) {
        resolve({ error: 'User not found!' });
      }
      else {
        const user = { id: row.id, username: row.email, name: row.name };
        resolve(user);
      }
    });
  });
};
