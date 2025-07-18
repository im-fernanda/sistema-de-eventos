// Responsável pela lógica e UI dos participantes

import { api, showLoading, hideLoading, showMessage } from './api.js';

export async function loadParticipantes() {
  showLoading('participantes-list');
  try {
    const participantes = await api.getParticipantes();
    renderParticipantes(participantes);
  } catch (error) {
    showMessage('Erro ao carregar participantes', 'error');
  } finally {
    hideLoading('participantes-list');
  }
}

export function renderParticipantes(participantes) {
  const container = document.getElementById('participantes-list');
  if (!Array.isArray(participantes)) {
    container.innerHTML = '<p class="text-gray-500 text-center">Erro ao carregar participantes</p>';
    return;
  }
  if (participantes.length === 0) {
    container.innerHTML = '<p class="text-gray-500 text-center">Nenhum participante encontrado</p>';
    return;
  }
  container.innerHTML = participantes.map(participante => `
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">${participante.nome}</h3>
        <span class="text-sm text-gray-500">${participante.email}</span>
      </div>
      <div class="card-content">
        <p><strong>Telefone:</strong> ${participante.telefone}</p>
        <p><strong>CPF:</strong> ${participante.cpf}</p>
      </div>
      <div class="card-actions">
        <button onclick="editItem('participante', ${participante.id})" class="btn btn-primary">Editar</button>
        <button onclick="deleteItem('participante', ${participante.id})" class="btn btn-danger">Excluir</button>
      </div>
    </div>
  `).join('');
}
