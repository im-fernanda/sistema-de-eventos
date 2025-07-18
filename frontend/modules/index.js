// index.js
import { showSection } from './app.js';
import { createEvento, editEvento, deleteEvento } from './eventos.js';
import { createIngresso, editIngresso, deleteIngresso } from './ingressos.js';
import { createParticipante, editParticipante, deleteParticipante } from './participantes.js';

// Inicialização global
window.showSection = showSection;

// Funções de Eventos
window.createEvento = createEvento;
window.editEvento = editEvento;
window.deleteEvento = deleteEvento;

// Funções de Ingressos
window.createIngresso = createIngresso;
window.editIngresso = editIngresso;
window.deleteIngresso = deleteIngresso;

// Funções de Participantes
window.createParticipante = createParticipante;
window.editParticipante = editParticipante;
window.deleteParticipante = deleteParticipante;
