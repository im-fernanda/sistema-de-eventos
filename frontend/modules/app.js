// app.js
import { loadEventos, renderEventos } from './eventos.js';
import { loadIngressos, renderIngressos } from './ingressos.js';
import { loadParticipantes, renderParticipantes } from './participantes.js';
import { showToast, showMessage, showLoading, hideLoading } from './utils.js';


// Inicialização da aplicação
document.addEventListener("DOMContentLoaded", function () {
  console.log("Sistema de Eventos iniciado");
  loadData();
  // Acessibilidade: foco inicial
  document.querySelector("button.nav-link").focus();
});

// Navegação entre seções
export function showSection(sectionName) {
  // Esconder todas as seções
  document.querySelectorAll(".section").forEach((section) => {
    section.classList.remove("active");
  });

  // Remover classe active de todos os links
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.remove("active");
  });

  // Mostrar seção selecionada
  document.getElementById(sectionName).classList.add("active");

  // Adicionar classe active ao link correspondente
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));
  navLinks.forEach((link) => {
    if (link.textContent.trim().toLowerCase() === sectionName.toLowerCase()) {
      link.classList.add("active");
      link.focus();
    }
  });

  currentSection = sectionName;

  // Carregar dados da seção se necessário
  if (sectionName === "eventos") {
    loadEventos();
  } else if (sectionName === "ingressos") {
    loadIngressos();
  } else if (sectionName === "participantes") {
    loadParticipantes();
  }
}

// Carregar dados iniciais
async function loadData() {
  try {
    showLoader();
    await Promise.all([loadEventos(), loadIngressos(), loadParticipantes()]);
  } catch (error) {
    console.error("Erro ao carregar dados:", error);
    showToast("Erro ao carregar dados", "error");
  } finally {
    hideLoader();
  }
}

// Loader global
function showLoader() {
  document.getElementById("loader").classList.remove("hidden");
}

function hideLoader() {
  document.getElementById("loader").classList.add("hidden");
}

// Expor funções globalmente
window.showSection = showSection;
