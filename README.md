# Exam #1: "Questionario"
## Student: s282478 NATTA TOMMASO

## React Client Application Routes

- Route `/`: Pagina di login. Da qui ci si può loggare come admin oppure continuare come utilizzatore, senza effettuare il login
- Route `/admin`: Pagina contenente la lista dei questionari creati dall'admin. Da qui si può cliccare su uno specifico questionario per visualizzare le compilazioni o creare un nuovo questionario
- Route `/admin/questionario`: Pagina contenente le compilazioni fatte dagli utilizzatori per un singolo questionario.
- Route `/admin/questionario/crea`: Pagina di creazione del questionario
- Route `/utilizzatore`: Pagina contenente la lista di tutti i questionari dell'applicazione, resi disponibili per la compilazione da perte dell'utilizzatore.
- Route `/utilizzatore/questionario`: Pagina per la compilazione di un singolo questionario.

## API Server

Anche se è un'informazione ridondante, per eccesso di zelo anche per tutte le get è specificato che non è richiesto un body.


- POST `/api/sessions`
  - request parameters: NONE
  - request body content: 
   { username: "john.doe@polito.it", 
   password: "password" }
  - response body content:
  { id: 1, 
  username: "john.doe@polito.it", 
  name: "John" }
- DELETE `/api/sessions/current`
  - request parameters: NONE
  - request body content: NONE
  - response body content: NONE
- GET `/api/sessions/current`
  - request parameters: NONE
   - request body content: NONE
  - response body content: 
        { id: 1, 
        username: "john.doe@polito.it", 
        name: "John" }
- GET `/api/admin/questionari`
  - request parameters: ?user_id=1
   - request body content: NONE
  - response body content: 
  [{"id":1,"titolo":"ti piacciono i gatti?","nCompilazioni":2,"user":1},
  {"id":2,"titolo":"Ti piace il calcio?","nCompilazioni":2,"user":1},
  {"id":5,"titolo":"ds","nCompilazioni":0,"user":1},{"id":6,"titolo":"Ti piace la pasta?","nCompilazioni":1,"user":1}]
- GET `/api/admin/compilazioni`
  - request parameters: ?user_id=1&quest_id=2
   - request body content: NONE
  - response body content: 
  [{"id":1,"user":1,"questionario":1,"nomeUtilizzatore":"Marcello"},{"id":2,"user":1,"questionario":1,"nomeUtilizzatore":"Ornella"}]
- GET `/api/admin/domandeQuestionario`
  - request parameters: ?comp_id=1&quest_id=2
   - request body content: NONE
  - response body content:
  [{"id":1,"testoDomanda":"Spiega che cos'è il fuorigioco","compilazione":1,"questionario":2,"chiusa":"0","rispostaSelezionata":null,"rispostaAperta":"Quando la palla viene passata troppo presto"},{"id":2,"testoDomanda":"Quali sono le squadre più vincenti del campionato?","compilazione":1,"questionario":2,"chiusa":"1","rispostaSelezionata":"0,1,5,6","rispostaAperta":null},{"id":3,"testoDomanda":"Hai mai giocato a calcio?","compilazione":1,"questionario":2,"chiusa":"1","rispostaSelezionata":0,"rispostaAperta":null}]
- GET `/api/admin/risposteQuestionario`
  - request parameters: ?quest_id=1&user_id=1&dom_id=3
   - request body content: NONE
  - response body content: stringa contenente le varie risposte alla domanda separate da virgola
  [{"risposte":"1,2,3,+ di 3"}]
- POST `/api/admin/questionari`
  - request parameters: NONE
   - request body content: { titolo: 'gf', user_id: 1 }
  - response body content: { 1}
- POST `/api/admin/domandeQuestionario`
  - request parameters: NONE
   - request body content: {
  dId: 0,
  domanda: 'Ti piacciono?',
  risposte: [ 'Sì', 'No' ],
  chiusa: true,
  maxR: 1,
  minR: 1,
  qId: 10,
  user_id: 1
    }
  - response body content: NONE
- POST `/api/utilizzatore/questionari`
  - request parameters: NONE
   - request body content: {
      q_id : 1,
      user_id : 1
    }
  - response body content: ritorna il numero di compilazioni
  { 4 }
- GET `/api/utilizzatore/questionari`
  - request parameters: NONE
   - request body content: NONE
  - response body content: 
  [{"id":1,"titolo":"ti piacciono i gatti?","nCompilazioni":2,"user":1},{"id":2,"titolo":"Ti piace il calcio?","nCompilazioni":2,"user":1},{"id":3,"titolo":"Cosa ti piace fare nel tempo libero?","nCompilazioni":2,"user":0},{"id":4,"titolo":"Sei un artista?","nCompilazioni":2,"user":0},{"id":5,"titolo":"ds","nCompilazioni":0,"user":1},{"id":6,"titolo":"Ti piace la pasta?","nCompilazioni":1,"user":1}]
- GET `/api/utilizzatore/domande`
  - request parameters: ?quest_id=1
   - request body content: NONE
  - response body content: 
  [{"dId":0,"qId":1,"userId":1,"domanda":"hai mai avuto un gatto?","risposte":"Sì,No","chiusa":"1","maxR":1,"minR":1,"obbligatoria":null},{"dId":1,"qId":1,"userId":1,"domanda":"Ti piacciono gli animali?","risposte":"","chiusa":"0","maxR":null,"minR":null,"obbligatoria":0},{"dId":2,"qId":1,"userId":1,"domanda":"Ti piacciono i gatti?","risposte":"","chiusa":"0","maxR":null,"minR":null,"obbligatoria":1},{"dId":3,"qId":1,"userId":1,"domanda":"Se hai avuto un gatto, quante volte gli davi da mangiare al giorno?","risposte":"1,2,3,+ di 3","chiusa":"1","maxR":1,"minR":0,"obbligatoria":null}]
- POST `/api/utilizzatore/compilazioni`
  - request parameters: NONE
   - request body content: { nome: 'Tommaso', qId: 9, user: 1 }
  - response body content: restituisce l'id della compilazione
  { 4 }
- POST `/api/utilizzatore/domande`
  - request parameters: NONE
   - request body content: {
  user: 1,
  compilazione: 3,
  questionario: 1,
  testo_domanda: 'Se hai avuto un gatto, quante volte gli davi da mangiare al giorno?',
  chiusa: '1',
  risposta_selezionata: [ '1' ]
}
  - response body content: restituisce l'id della domanda
  { 1 }


## Database Tables

- Table `users` - contains id, email, name, hash
- Table `questionari` - contains id, titolo, nCompilazioni, user
- Table `domande_questionari_vuote` - contains d_id, q_id, user_id, domanda, risposte, chiusa, maxR, minR, obbligatoria
- Table `domande_questionari` - contains id, user, compilazione, questionario, testo_domanda, chiusa, risposta_selezinata, rispostaAperta
- Table `compilazioni` - contains id, user, questionario, nome_utilizzatore

## Main React Components

- `LoginForm` (in `LoginForm.js`): gestire la login. presenta un form in cui inserire i dati
- `LogoutButtonAndWelcomeUser` (in `LoginForm.js`): gestire il logout. Presenta un pulsante tramite cui sloggarsi e un pop-up con la scritta "Welcome <nome utente>" quando si è loggati
- `ListaRisposte` (in `ListaRisposte.js`): Serve all'admin a visualizzare le risposte fornite ad un questionario. Lista le risposte fornite dall'utente e permette la navigazione tra una compilazione e l'altra
- `ListaQuestionari` (in `ListaQuestionari.js`): usata sia da admin sia da utilizzatore per visualizzare i questionari disponibili. Permette all'admin di passare alla visualizzazione delle compilazioni e all'utilizzatore di passare alla compilazione del questionario
- `CreaQuestionario` (in `CreaQuestionario.js`): Permette all'admin la creazione del questionario. Visualizza un form in cui inserire il nome del questionario e le domande (aggiungibili tramite appositi pulsanti)
- `CompilaQuestionario` (in `CompilaQuestionario.js`): permette all'utilizzatore di compilare il questionario. Presenta un form con la lista delle domande e la possibilità di rispondere. 
- `ButtonNuovoQuestionario` (in `ButtonNuovoQuestionario.js`): Bottone che permette all'admin di passare alla schermata di creazione di un nuovo questionario.
- `BackButton` (in `BackButton.js`): Bottone che permette all'utilizzatore e all'admin ti tornare alla lista dei questionari quando si trovano rispettivamente in fase di compilazione o di creazione del questionario

(only _main_ components, minor ones may be skipped)

## Screenshot

Creazione di un questionario

![Screenshot](./img/screenshot.jpg)

## Users Credentials

- username: "john.doe@polito.it", password: "password" 
- username: "tommaso.natta@gmail.com, password: "natta" 
