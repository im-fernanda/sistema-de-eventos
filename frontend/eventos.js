// Responsável pela lógica e UI dos eventos

import { api, formatDateTime, showLoading, hideLoading, showMessage } from './api.js';

// Funções de renderização, manipulação e formulários de eventos
export async function loadEventos() {
  showLoading('eventos-list');
  try {
    const eventos = await api.getEventos();
    renderEventos(eventos);
  } catch (error) {
    showMessage('Erro ao carregar eventos', 'error');
  } finally {
    hideLoading('eventos-list');
  }
}

export function renderEventos(eventos) {
  const container = document.getElementById('eventos-list');
  if (!Array.isArray(eventos)) {
    container.innerHTML = '<p class="text-gray-500 text-center">Erro ao carregar eventos</p>';
    return;
  }
  if (eventos.length === 0) {
    container.innerHTML = '<p class="text-gray-500 text-center">Nenhum evento encontrado</p>';
    return;
  }
  container.innerHTML = eventos.map(evento => `
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">${evento.nome}</h3>
        <span class="text-sm text-gray-500">${formatDateTime(evento.data)}</span>
      </div>
      <div class="card-content">
        <p><strong>Local:</strong> ${evento.local}</p>
        <p><strong>Capacidade:</strong> ${evento.capacidade}</p>
        <p><strong>Status:</strong> ${evento.status}</p>
        <p class="text-sm text-gray-600">${evento.descricao}</p>
      </div>
      <div class="card-actions">
        <button onclick="editItem('evento', ${evento.id})" class="px-4 py-2 rounded-lg font-semibold shadow bg-yellow-400 text-white hover:bg-yellow-500 transition-all duration-200 transform hover:scale-105">Editar</button>
        <button onclick="deleteItem('evento', ${evento.id})" class="px-4 py-2 rounded-lg font-semibold shadow bg-red-500 text-white hover:bg-red-600 transition-all duration-200 transform hover:scale-105">Excluir</button>
      </div>
    </div>
  `).join('');
}

