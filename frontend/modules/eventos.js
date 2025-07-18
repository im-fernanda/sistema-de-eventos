// eventos.js
import { api } from './api.js';
import { showLoading, hideLoading, showMessage, formatDate } from './utils.js';

export async function loadEventos() {
  try {
    showLoading("eventos-list");
    const eventos = await api.getEventos();
    console.log("DEBUG: Eventos retornados pela API:", eventos);
    console.log("DEBUG: Tipo de eventos:", typeof eventos);
    renderEventos(eventos);
  } catch (error) {
    console.error("Erro ao carregar eventos:", error);
    showMessage("Erro ao carregar eventos", "error");
  } finally {
    hideLoading("eventos-list");
  }
}

export function renderEventos(eventos) {
  const container = document.getElementById("eventos-list");

  // Verificar se eventos é um objeto com paginação
  if (eventos && typeof eventos === "object" && eventos.results) {
    eventos = eventos.results;
  }

  // Verificar se eventos é um array
  if (!Array.isArray(eventos)) {
    console.error("DEBUG: Eventos não é um array:", eventos);
    container.innerHTML =
      '<p class="text-gray-500 text-center">Erro ao carregar eventos</p>';
    return;
  }

  if (eventos.length === 0) {
    container.innerHTML =
      '<p class="text-gray-500 text-center">Nenhum evento encontrado</p>';
    return;
  }

  container.innerHTML = eventos
    .map(
      (evento) => `
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">${evento.nome}</h3>
                <span class="text-sm text-gray-500">${formatDate(evento.data)}</span>
            </div>
            <div class="card-content">
                <p class="mb-2"><strong>Local:</strong> ${evento.local || "N/A"}</p>
                <p class="mb-2"><strong>Capacidade:</strong> ${evento.capacidade || "N/A"}</p>
                <p class="mb-2"><strong>Status:</strong> ${evento.status || "N/A"}</p>
                <p class="text-sm text-gray-600">${evento.descricao || "Sem descrição"}</p>
            </div>
            <div class="card-actions flex gap-2 mt-4">
                <button onclick="editEvento(${evento.id})" class="px-4 py-2 rounded-lg font-semibold shadow bg-yellow-400 text-white hover:bg-yellow-500 transition-all duration-200 transform hover:scale-105">Editar</button>
                <button onclick="deleteEvento(${evento.id})" class="px-4 py-2 rounded-lg font-semibold shadow bg-red-500 text-white hover:bg-red-600 transition-all duration-200 transform hover:scale-105">Excluir</button>
            </div>
        </div>
    `
    )
    .join("");
}
