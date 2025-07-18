// participantes.js
import { api } from './api.js';
import { showLoading, hideLoading, showMessage } from './utils.js';

export async function loadParticipantes() {
  try {
    showLoading("participantes-list");
    const participantes = await api.getParticipantes();
    renderParticipantes(participantes);
  } catch (error) {
    console.error("Erro ao carregar participantes:", error);
    showMessage("Erro ao carregar participantes", "error");
  } finally {
    hideLoading("participantes-list");
  }
}

export function renderParticipantes(participantes) {
  const container = document.getElementById("participantes-list");

  if (participantes && typeof participantes === "object" && participantes.results) {
    participantes = participantes.results;
  }

  if (!Array.isArray(participantes)) {
    console.error("DEBUG: Participantes não é um array:", participantes);
    container.innerHTML =
      '<p class="text-gray-500 text-center">Erro ao carregar participantes</p>';
    return;
  }

  if (participantes.length === 0) {
    container.innerHTML =
      '<p class="text-gray-500 text-center">Nenhum participante encontrado</p>';
    return;
  }

  container.innerHTML = participantes
    .map(
      (participante) => `
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">${participante.nome}</h3>
            </div>
            <div class="card-content">
                <p class="mb-2"><strong>Email:</strong> ${participante.email || "N/A"}</p>
                <p class="mb-2"><strong>CPF:</strong> ${participante.cpf || "N/A"}</p>
                <p class="mb-2"><strong>Telefone:</strong> ${participante.telefone || "N/A"}</p>
            </div>
            <div class="card-actions">
                <button onclick="editParticipante(${participante.id})" class="btn-edit">Editar</button>
                <button onclick="deleteParticipante(${participante.id})" class="btn-delete">Excluir</button>
            </div>
        </div>
    `
    )
    .join("");
}
