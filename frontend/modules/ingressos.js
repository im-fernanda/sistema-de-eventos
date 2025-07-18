// ingressos.js
import { api } from './api.js';
import { showLoading, hideLoading, showMessage } from './utils.js';

export async function loadIngressos() {
  try {
    showLoading("ingressos-list");
    const ingressos = await api.getIngressos();
    renderIngressos(ingressos);
  } catch (error) {
    console.error("Erro ao carregar ingressos:", error);
    showMessage("Erro ao carregar ingressos", "error");
  } finally {
    hideLoading("ingressos-list");
  }
}

export function renderIngressos(ingressos) {
  const container = document.getElementById("ingressos-list");

  if (ingressos && typeof ingressos === "object" && ingressos.results) {
    ingressos = ingressos.results;
  }

  if (!Array.isArray(ingressos)) {
    console.error("DEBUG: Ingressos não é um array:", ingressos);
    container.innerHTML =
      '<p class="text-gray-500 text-center">Erro ao carregar ingressos</p>';
    return;
  }

  if (ingressos.length === 0) {
    container.innerHTML =
      '<p class="text-gray-500 text-center">Nenhum ingresso encontrado</p>';
    return;
  }

  container.innerHTML = ingressos
    .map(
      (ingresso) => `
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">Ingresso #${ingresso.id}</h3>
            </div>
            <div class="card-content">
                <p class="mb-2"><strong>Evento:</strong> ${ingresso.evento || "N/A"}</p>
                <p class="mb-2"><strong>Participante:</strong> ${ingresso.participante || "N/A"}</p>
                <p class="mb-2"><strong>Tipo:</strong> ${ingresso.tipo || "N/A"}</p>
                <p class="mb-2"><strong>Valor:</strong> R$ ${ingresso.valor || "0,00"}</p>
                <p class="mb-2"><strong>Status:</strong> ${ingresso.status || "N/A"}</p>
            </div>
            <div class="card-actions">
                <button onclick="editIngresso(${ingresso.id})" class="btn-edit">Editar</button>
                <button onclick="deleteIngresso(${ingresso.id})" class="btn-delete">Excluir</button>
            </div>
        </div>
    `
    )
    .join("");
}
