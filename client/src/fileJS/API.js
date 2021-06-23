

const BASEURL = "/api";

const fetchQuestionari = async (userId) => {
    const response = await fetch(`/api/admin/questionari?user_id=${userId}`);
    const responseBody = await response.json();
    return responseBody;
};

const fetchCompilazioni = async (userId, questId) => {
    const response = await fetch(`/api/admin/compilazioni?user_id=${userId}&quest_id=${questId}`);
    const responseBody = await response.json();
    return responseBody;
};

const fetchDomandeQuestionario = async (compId, questId) => {
    const response = await fetch(`/api/admin/domandeQuestionario?comp_id=${compId}&quest_id=${questId}`);
    const responseBody = await response.json();
    return responseBody;
};

const fetchRisposteQuestionario = async (compId, questId, domId) => {
    const response = await fetch(`/api/admin/risposteQuestionario?quest_id=${questId}&comp_id=${compId}&dom_id=${domId}`);
    const responseBody = await response.json();
    return responseBody;
};

const addQuestionario = async (questionario) => {
    const response = await fetch("/api/admin/questionari", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(questionario),
    });
    const responseBody = await response.json();
    return responseBody;
  };

  const addDomanda = async (domanda, questionario) => {
    domanda.qId = questionario.qId;
    domanda.user_id = questionario.user_id;
    const response = await fetch("/api/utilizzatore/domandeQuestionario", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(domanda),
    });
    const responseBody = await response.json();
    return response.status();
  };

  const fetchQuestionariUtilizzatore = async () => {
    const response = await fetch(`/api/utilizzatore/questionari`);
    const responseBody = await response.json();
    return responseBody;
};

const fetchDomandeUtilizzatore = async (questId) => {
    const response = await fetch(`/api/utilizzatore/domande?quest_id=${questId}`);
    const responseBody = await response.json();
    console.log(responseBody)
    for(let idxDomanda in responseBody){
        responseBody[idxDomanda].risposte = await responseBody[idxDomanda].risposte.split(",");
        for(let idxRisposta in responseBody[idxDomanda].risposte){
            responseBody[idxDomanda].risposte[idxRisposta] = {
                testo: responseBody[idxDomanda].risposte[idxRisposta],
                selezionata: 0
            }
        }
    }
    return responseBody;
};

const addCompilazione = async (compilazione) => {
    
    const response = await fetch("/api/utilizzatore/compilazioni", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(compilazione),
    });
    const responseBody = await response.json();
    return responseBody;
  };

  const addDomandaCompilata = async (domanda) => {
    
    const response = await fetch("/api/utilizzatore/domande", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(domanda),
    });
    const responseBody = await response.json();
    return responseBody;
  };
const API = {
    fetchQuestionari,
    fetchCompilazioni,
    fetchDomandeQuestionario,
    fetchRisposteQuestionario,
    addQuestionario,
    addDomanda,
    fetchQuestionariUtilizzatore,
    fetchDomandeUtilizzatore,
    addCompilazione,
    addDomandaCompilata,
  };
  export default API;
  