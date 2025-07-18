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
            <div class="card-actions flex gap-2 mt-4">
                <button onclick="editParticipante(${participante.id})" class="px-4 py-2 rounded-lg font-semibold shadow bg-yellow-400 text-white hover:bg-yellow-500 transition-all duration-200 transform hover:scale-105">Editar</button>
                <button onclick="deleteParticipante(${participante.id})" class="px-4 py-2 rounded-lg font-semibold shadow bg-red-500 text-white hover:bg-red-600 transition-all duration-200 transform hover:scale-105">Excluir</button>
            </div>
        </div>
    `
    )
    .join("");
}
