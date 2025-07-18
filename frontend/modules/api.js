// api.js
export class ApiService {
  constructor(baseURL = "http://localhost:8000/api") {
    this.baseURL = baseURL;
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
  getEventos() {
    return this.request("/eventos/");
  }

  getEvento(id) {
    return this.request(`/eventos/${id}/`);
  }

  createEvento(data) {
    return this.request("/eventos/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  updateEvento(id, data) {
    return this.request(`/eventos/${id}/`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  deleteEvento(id) {
    return this.request(`/eventos/${id}/`, {
      method: "DELETE",
    });
  }

  // Ingressos
  getIngressos() {
    return this.request("/ingressos/");
  }

  getIngresso(id) {
    return this.request(`/ingressos/${id}/`);
  }

  createIngresso(data) {
    return this.request("/ingressos/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  updateIngresso(id, data) {
    return this.request(`/ingressos/${id}/`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  deleteIngresso(id) {
    return this.request(`/ingressos/${id}/`, {
      method: "DELETE",
    });
  }

  // Participantes
  getParticipantes() {
    return this.request("/participantes/");
  }

  getParticipante(id) {
    return this.request(`/participantes/${id}/`);
  }

  createParticipante(data) {
    return this.request("/participantes/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  updateParticipante(id, data) {
    return this.request(`/participantes/${id}/`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  deleteParticipante(id) {
    return this.request(`/participantes/${id}/`, {
      method: "DELETE",
    });
  }
}

export const api = new ApiService();
