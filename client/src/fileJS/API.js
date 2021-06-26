

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
    for (let idx in responseBody){
      if (responseBody[idx].chiusa == "1" && typeof responseBody[idx].rispostaSelezionata === 'string')
        responseBody[idx].rispostaSelezionata = responseBody[idx].rispostaSelezionata.split(",");
    }
    
    
    return responseBody;
};

const fetchRisposteQuestionario = async (userId, questId, domId) => {
    const response = await fetch(`/api/admin/risposteQuestionario?quest_id=${questId}&user_id=${userId}&dom_id=${domId}`);
    const responseBody = await response.json();
    let arrayRisposte = responseBody[0].risposte.split(",");
    return arrayRisposte;
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
    const response = await fetch("/api/admin/domandeQuestionario", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(domanda),
    });
    //const responseBody = await response.json();
    return response.status;
  };

  const fetchQuestionariUtilizzatore = async () => {
    const response = await fetch(`/api/utilizzatore/questionari`);
    const responseBody = await response.json();
    return responseBody;
};

const fetchDomandeUtilizzatore = async (questId) => {
    const response = await fetch(`/api/utilizzatore/domande?quest_id=${questId}`);
    const responseBody = await response.json();
    
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

  const increaseNCompilazioni = async (questionario, user) => {
    let bodyChiamata = {
      q_id : questionario,
      user_id : user
    };
    const response = await fetch("/api/utilizzatore/questionari", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyChiamata),
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

  async function logIn(credentials) {
    let response = await fetch("/api/sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });
    return await response.json();
  }
  
  async function logOut() {
    await fetch("/api/sessions/current", { method: "DELETE" });
  }
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
    logIn,
    logOut,
    increaseNCompilazioni
  };
  export default API;
  