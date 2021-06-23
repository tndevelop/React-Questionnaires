

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

const API = {
    fetchQuestionari,
    fetchCompilazioni,
    fetchDomandeQuestionario,
    fetchRisposteQuestionario,
  };
  export default API;
  