// Configuração da API
const API_BASE_URL = "http://localhost:8000/api";

// Classe para gerenciar requisições HTTP
class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Método genérico para fazer requisições
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    // Debug: log dos dados sendo enviados
    if (options.body) {
      console.log("DEBUG: Dados sendo enviados:", options.body);
    }

    try {
      const response = await fetch(url, config);

      if (options.method === "DELETE" && (response.status === 204 || response.headers.get("content-length") === "0")) {
        return true;
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error("DEBUG: Resposta de erro:", errorText);
        throw new Error(
          `HTTP error! status: ${response.status} - ${errorText}`
        );
      }

      // Se não houver conteúdo, retorna true
      if (response.status === 204 || response.headers.get("content-length") === "0") {
        return true;
      }

      return await response.json();
    } catch (error) {
      console.error("Erro na requisição:", error);
      throw error;
    }
  }

  // Eventos
  async getEventos() {
    return this.request("/eventos/");
  }

  async getEvento(id) {
    return this.request(`/eventos/${id}/`);
  }

  async createEvento(data) {
    return this.request("/eventos/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateEvento(id, data) {
    return this.request(`/eventos/${id}/`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteEvento(id) {
    return this.request(`/eventos/${id}/`, {
      method: "DELETE",
    });
  }

  // Ingressos
  async getIngressos() {
    return this.request("/ingressos/");
  }

  async getIngresso(id) {
    return this.request(`/ingressos/${id}/`);
  }

  async createIngresso(data) {
    return this.request("/ingressos/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateIngresso(id, data) {
    return this.request(`/ingressos/${id}/`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteIngresso(id) {
    return this.request(`/ingressos/${id}/`, {
      method: "DELETE",
    });
  }

  // Participantes
  async getParticipantes() {
    return this.request("/participantes/");
  }

  async getParticipante(id) {
    return this.request(`/participantes/${id}/`);
  }

  async createParticipante(data) {
    return this.request("/participantes/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateParticipante(id, data) {
    return this.request(`/participantes/${id}/`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteParticipante(id) {
    return this.request(`/participantes/${id}/`, {
      method: "DELETE",
    });
  }
}

// Instância global da API
const api = new ApiService();

// Funções auxiliares para formatação
function formatDate(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR");
}

function formatDateTime(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleString("pt-BR");
}

function formatCurrency(value) {
  if (!value) return "R$ 0,00";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

// Função para mostrar mensagens
function showMessage(message, type = "info") {
  const messageDiv = document.createElement("div");
  messageDiv.className = `message message-${type}`;
  messageDiv.textContent = message;

  // Inserir no topo da página
  const main = document.querySelector("main");
  main.insertBefore(messageDiv, main.firstChild);

  // Remover após 5 segundos
  setTimeout(() => {
    messageDiv.remove();
  }, 5000);
}

// Função para mostrar loading
function showLoading(containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = `
      <div class="loading">
          <div class="spinner"></div>
      </div>
  `;
}

// Função para esconder loading
function hideLoading(containerId) {
  const container = document.getElementById(containerId);
  const loading = container.querySelector(".loading");
  if (loading) {
    loading.remove();
  }
}
