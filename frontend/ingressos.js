// Responsável pela lógica e UI dos ingressos

import { api, formatCurrency, showLoading, hideLoading, showMessage } from './api.js';

export async function loadIngressos() {
  showLoading('ingressos-list');
  try {
    const ingressos = await api.getIngressos();
    renderIngressos(ingressos);
  } catch (error) {
    showMessage('Erro ao carregar ingressos', 'error');
  } finally {
    hideLoading('ingressos-list');
  }
}

export function renderIngressos(ingressos) {
  const container = document.getElementById('ingressos-list');
  if (!Array.isArray(ingressos)) {
    container.innerHTML = '<p class="text-gray-500 text-center">Erro ao carregar ingressos</p>';
    return;
  }
  if (ingressos.length === 0) {
    container.innerHTML = '<p class="text-gray-500 text-center">Nenhum ingresso encontrado</p>';
    return;
  }
  container.innerHTML = ingressos.map(ingresso => `
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">${ingresso.tipo}</h3>
        <span class="text-sm text-gray-500">${formatCurrency(ingresso.preco)}</span>
      </div>
      <div class="card-content">
        <p><strong>Evento:</strong> ${ingresso.evento_nome}</p>
        <p><strong>Participante:</strong> ${ingresso.participante_nome}</p>
        <p><strong>Status:</strong> ${ingresso.status}</p>
      </div>
      <div class="card-actions">
        <button onclick="editItem('ingresso', ${ingresso.id})" class="btn btn-primary">Editar</button>
        <button onclick="deleteItem('ingresso', ${ingresso.id})" class="btn btn-danger">Excluir</button>
      </div>
    </div>
  `).join('');
}

// ...outras funções específicas de ingressos (formulário, modal, etc)
