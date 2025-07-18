// Variáveis globais
let currentSection = "home";
let editingItem = null;

// Inicialização da aplicação
document.addEventListener("DOMContentLoaded", function () {
  console.log("Sistema de Eventos iniciado");
  loadData();
  // Acessibilidade: foco inicial
  document.querySelector("button.nav-link").focus();
});

// Navegação entre seções
function showSection(sectionName) {
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

// Toast de feedback
function showToast(message, type = "info") {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.className = `fixed bottom-6 right-6 z-50 px-4 py-3 rounded shadow-lg text-white text-lg font-semibold toast-${type}`;
  if (type === "success") toast.classList.add("bg-green-600");
  else if (type === "error") toast.classList.add("bg-red-600");
  else toast.classList.add("bg-blue-600");
  toast.classList.remove("hidden");
  setTimeout(() => {
    toast.classList.add("hidden");
  }, 3000);
}

// Substituir showMessage para usar o toast
function showMessage(message, type = "info") {
  showToast(message, type);
}

// Eventos
async function loadEventos() {
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

function renderEventos(eventos) {
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
                <span class="text-sm text-gray-500">${formatDate(
                  evento.data
                )}</span>
            </div>
            <div class="card-content">
                <p class="mb-2"><strong>Local:</strong> ${
                  evento.local || "N/A"
                }</p>
                <p class="mb-2"><strong>Capacidade:</strong> ${
                  evento.capacidade || "N/A"
                }</p>
                <p class="mb-2"><strong>Status:</strong> ${
                  evento.status || "N/A"
                }</p>
                <p class="text-sm text-gray-600">${
                  evento.descricao || "Sem descrição"
                }</p>
            </div>
            <div class="card-actions">
                <button onclick="editItem('evento', ${
                  evento.id
                })" class="btn btn-primary">Editar</button>
                <button onclick="deleteItem('evento', ${
                  evento.id
                })" class="btn btn-danger">Excluir</button>
            </div>
        </div>
    `
    )
    .join("");
}

// Ingressos
async function loadIngressos() {
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

function renderIngressos(ingressos) {
  const container = document.getElementById("ingressos-list");

  // Verificar se ingressos é um objeto com paginação
  if (ingressos && typeof ingressos === "object" && ingressos.results) {
    ingressos = ingressos.results;
  }

  // Verificar se ingressos é um array
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
            <h3 class="card-title">${ingresso.tipo || "Ingresso"}</h3>
            <span class="text-sm text-gray-500">${formatCurrency(
              ingresso.preco
            )}</span>
        </div>
        <div class="card-content">
            <p class="mb-2"><strong>Evento:</strong> ${
              ingresso.evento_nome || "N/A"
            }</p>
            <p class="mb-2"><strong>Participante:</strong> ${
              ingresso.participante_nome || "N/A"
            }</p>
            <p class="mb-2"><strong>Status:</strong> ${
              ingresso.status || "N/A"
            }</p>
        </div>
        <div class="card-actions">
            <button onclick="editItem('ingresso', ${
              ingresso.id
            })" class="btn btn-primary">Editar</button>
            <button onclick="deleteItem('ingresso', ${
              ingresso.id
            })" class="btn btn-danger">Excluir</button>
        </div>
    </div>
  `
    )
    .join("");
}

// Participantes
async function loadParticipantes() {
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

function renderParticipantes(participantes) {
  const container = document.getElementById("participantes-list");

  // Verificar se participantes é um objeto com paginação
  if (
    participantes &&
    typeof participantes === "object" &&
    participantes.results
  ) {
    participantes = participantes.results;
  }

  // Verificar se participantes é um array
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
            <span class="text-sm text-gray-500">${participante.email}</span>
        </div>
        <div class="card-content">
            <p class="mb-2"><strong>Telefone:</strong> ${
              participante.telefone || "N/A"
            }</p>
            <p class="mb-2"><strong>CPF:</strong> ${
              participante.cpf || "N/A"
            }</p>
            <p class="mb-2"><strong>Data de Nascimento:</strong> ${
              formatDate(participante.data_nascimento) || "N/A"
            }</p>
        </div>
        <div class="card-actions">
            <button onclick="editItem('participante', ${
              participante.id
            })" class="btn btn-primary">Editar</button>
            <button onclick="deleteItem('participante', ${
              participante.id
            })" class="btn btn-danger">Excluir</button>
        </div>
    </div>
  `
    )
    .join("");
}

// Modais
async function showModal(type, item = null) {
  editingItem = item;
  const modal = document.getElementById("modal");
  const modalBody = document.getElementById("modal-body");

  let modalContent = "";

  switch (type) {
    case "evento":
      modalContent = getEventoModalContent(item);
      break;
    case "ingresso":
      modalContent = getIngressoModalContent(item);
      break;
    case "participante":
      modalContent = getParticipanteModalContent(item);
      break;
  }

  modalBody.innerHTML = modalContent;
  modal.classList.remove("hidden");

  // Carregar opções dos selects se necessário
  if (type === "ingresso") {
    await loadSelectOptions();
  }

  // Inicializar contador de caracteres para eventos
  if (type === "evento") {
    setTimeout(() => {
      const textarea = document.querySelector('textarea[name="descricao"]');
      const counter = document.getElementById("descricao-counter");
      if (textarea && counter) {
        updateCharCounter(textarea, "descricao-counter");
        validateDescription(textarea);
      }
    }, 100);
  }
}

function closeModal() {
  const modal = document.getElementById("modal");
  modal.classList.add("hidden");
  editingItem = null;
  // Limpar erros visuais
  clearFieldErrors();
}

// Conteúdo dos modais
function getEventoModalContent(evento = null) {
  const isEditing = evento !== null;
  const title = isEditing ? "Editar Evento" : "Novo Evento";

  return `
    <h2 class="text-2xl font-bold mb-6 text-center text-blue-700">${title}</h2>
    <form onsubmit="saveEvento(event)" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Nome</label>
        <input type="text" name="nome" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" value="${
          evento?.nome || ""
        }" required>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Data e Hora</label>
        <input type="datetime-local" name="data" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" value="${
          evento?.data ? evento.data.slice(0, 16) : ""
        }" required step="60">
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Local</label>
        <input type="text" name="local" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" value="${
          evento?.local || ""
        }" required>
      </div>
      <div class="flex gap-4">
        <div class="w-1/2">
          <label class="block text-sm font-medium text-gray-700 mb-1">Capacidade</label>
          <input type="number" name="capacidade" min="1" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" value="${
            evento?.capacidade || ""
          }" required>
        </div>
        <div class="w-1/2">
          <label class="block text-sm font-medium text-gray-700 mb-1">Preço do Ingresso</label>
          <input type="number" name="preco_ingresso" min="0" step="0.01" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" value="${
            evento?.preco_ingresso || ""
          }" required>
        </div>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select name="status" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required>
          <option value="ATIVO" ${
            evento?.status === "ATIVO" ? "selected" : ""
          }>Ativo</option>
          <option value="CANCELADO" ${
            evento?.status === "CANCELADO" ? "selected" : ""
          }>Cancelado</option>
          <option value="FINALIZADO" ${
            evento?.status === "FINALIZADO" ? "selected" : ""
          }>Finalizado</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Descrição 
          <span class="text-red-500 text-xs">*</span>
        </label>
        <textarea 
          name="descricao" 
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical transition-colors" 
          rows="4" 
          placeholder="Descreva detalhes do evento, programação, regras especiais, etc. (mínimo 10 caracteres)"
          maxlength="1000"
          required
          oninput="updateCharCounter(this, 'descricao-counter'); validateDescription(this)"
        >${evento?.descricao || ""}</textarea>
        <div id="descricao-counter" class="char-counter">
          ${evento?.descricao ? evento.descricao.length : 0}/1000 caracteres
        </div>
      </div>
      <div class="flex justify-end gap-2 pt-2">
        <button type="button" onclick="closeModal()" class="px-4 py-2 rounded bg-gray-500 text-white hover:bg-gray-700 transition">Cancelar</button>
        <button type="submit" class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition">${
          isEditing ? "Atualizar" : "Criar"
        }</button>
      </div>
    </form>
  `;
}

function getIngressoModalContent(ingresso = null) {
  const isEditing = ingresso !== null;
  const title = isEditing ? "Editar Ingresso" : "Novo Ingresso";

  return `
    <h2 class="text-2xl font-bold mb-6 text-center text-green-700">${title}</h2>
    <form onsubmit="saveIngresso(event)" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Tipo 
          <span class="text-red-500 text-xs">*</span>
        </label>
        <select name="tipo" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" required>
          <option value="VIP" ${
            ingresso?.tipo === "VIP" ? "selected" : ""
          }>VIP</option>
          <option value="PADRAO" ${
            ingresso?.tipo === "PADRAO" ? "selected" : ""
          }>Padrão</option>
          <option value="ESTUDANTE" ${
            ingresso?.tipo === "ESTUDANTE" ? "selected" : ""
          }>Estudante</option>
          <option value="IDOSO" ${
            ingresso?.tipo === "IDOSO" ? "selected" : ""
          }>Idoso</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Preço 
          <span class="text-red-500 text-xs">*</span>
        </label>
        <input type="number" name="preco" step="0.01" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" value="${
          ingresso?.preco || ""
        }" required>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Evento 
          <span class="text-red-500 text-xs">*</span>
        </label>
        <select name="evento" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" required>
          <option value="">Selecione um evento</option>
          <!-- Opções serão carregadas dinamicamente -->
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Participante 
          <span class="text-red-500 text-xs">*</span>
        </label>
        <select name="participante" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" required>
          <option value="">Selecione um participante</option>
          <!-- Opções serão carregadas dinamicamente -->
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Status 
          <span class="text-red-500 text-xs">*</span>
        </label>
        <select name="status" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" required>
          <option value="ATIVO" ${
            ingresso?.status === "ATIVO" ? "selected" : ""
          }>Ativo</option>
          <option value="USADO" ${
            ingresso?.status === "USADO" ? "selected" : ""
          }>Usado</option>
          <option value="CANCELADO" ${
            ingresso?.status === "CANCELADO" ? "selected" : ""
          }>Cancelado</option>
        </select>
      </div>
      <div class="flex justify-end gap-2 pt-2">
        <button type="button" onclick="closeModal()" class="px-4 py-2 rounded bg-gray-500 text-white hover:bg-gray-700 transition">Cancelar</button>
        <button type="submit" class="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 transition">${
          isEditing ? "Atualizar" : "Criar"
        }</button>
      </div>
    </form>
  `;
}

function getParticipanteModalContent(participante = null) {
  const isEditing = participante !== null;
  const title = isEditing ? "Editar Participante" : "Novo Participante";

  return `
    <h2 class="text-2xl font-bold mb-6 text-center text-purple-700">${title}</h2>
    <form onsubmit="saveParticipante(event)" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Nome 
          <span class="text-red-500 text-xs">*</span>
        </label>
        <input type="text" name="nome" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" value="${
          participante?.nome || ""
        }" required>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Email 
          <span class="text-red-500 text-xs">*</span>
        </label>
        <input type="email" name="email" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" value="${
          participante?.email || ""
        }" required>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Telefone 
          <span class="text-gray-400 text-xs">(opcional)</span>
        </label>
        <input type="tel" name="telefone" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" value="${
          participante?.telefone || ""
        }">
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          CPF 
          <span class="text-gray-400 text-xs">(opcional)</span>
        </label>
        <input type="text" name="cpf" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" value="${
          participante?.cpf || ""
        }">
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Data de Nascimento 
          <span class="text-gray-400 text-xs">(opcional)</span>
        </label>
        <input type="date" name="data_nascimento" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" value="${
          participante?.data_nascimento || ""
        }">
      </div>
      <div class="flex justify-end gap-2 pt-2">
        <button type="button" onclick="closeModal()" class="px-4 py-2 rounded bg-gray-500 text-white hover:bg-gray-700 transition">Cancelar</button>
        <button type="submit" class="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700 transition">${
          isEditing ? "Atualizar" : "Criar"
        }</button>
      </div>
    </form>
  `;
}

// Funções de salvamento
async function saveEvento(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData.entries());

  // Debug: log dos dados do formulário
  console.log("DEBUG: Dados do formulário:", data);

  // Validar campos obrigatórios
  const requiredFields = [
    "nome",
    "data",
    "local",
    "capacidade",
    "preco_ingresso",
    "status",
    "descricao",
  ];

  // Limpar erros visuais anteriores
  clearFieldErrors();

  const missingFields = requiredFields.filter(
    (field) =>
      !data[field] ||
      (typeof data[field] === "string" && data[field].trim() === "")
  );

  if (missingFields.length > 0) {
    // Destacar campos com erro
    missingFields.forEach((field) => {
      highlightFieldError(field);
    });

    showMessage(
      `Preencha todos os campos obrigatórios: ${missingFields
        .map((field) => getFieldLabel(field))
        .join(", ")}`,
      "error"
    );
    return;
  }

  // Validação extra: capacidade e preço devem ser positivos
  if (parseInt(data.capacidade) <= 0) {
    showMessage("A capacidade deve ser maior que zero.", "error");
    return;
  }
  if (parseFloat(data.preco_ingresso) < 0) {
    showMessage("O preço do ingresso não pode ser negativo.", "error");
    return;
  }

  // Converter tipos de dados
  if (data.capacidade) {
    data.capacidade = parseInt(data.capacidade);
  }
  if (data.preco_ingresso) {
    data.preco_ingresso = parseFloat(data.preco_ingresso);
  }

  // Validar descrição não vazia e com tamanho mínimo
  if (!data.descricao || data.descricao.trim() === "") {
    showMessage("A descrição é obrigatória.", "error");
    highlightFieldError("descricao");
    return;
  }

  if (data.descricao.trim().length < 10) {
    showMessage("A descrição deve ter pelo menos 10 caracteres.", "error");
    highlightFieldError("descricao");
    return;
  }

  console.log("DEBUG: Dados processados:", data);

  try {
    if (editingItem) {
      await api.updateEvento(editingItem.id, data);
      showMessage("Evento atualizado com sucesso!", "success");
    } else {
      await api.createEvento(data);
      showMessage("Evento criado com sucesso!", "success");
    }

    closeModal();
    loadEventos();
  } catch (error) {
    console.error("Erro ao salvar evento:", error);

    // Tratar erros específicos do backend
    let errorMessage = "Erro ao salvar evento";

    if (error.message.includes("400")) {
      try {
        const errorData = JSON.parse(error.message.split(" - ")[1]);
        if (errorData.descricao) {
          errorMessage = `Erro na descrição: ${errorData.descricao.join(", ")}`;
        } else if (errorData.nome) {
          errorMessage = `Erro no nome: ${errorData.nome.join(", ")}`;
        } else if (errorData.data) {
          errorMessage = `Erro na data: ${errorData.data.join(", ")}`;
        } else if (errorData.local) {
          errorMessage = `Erro no local: ${errorData.local.join(", ")}`;
        } else if (errorData.capacidade) {
          errorMessage = `Erro na capacidade: ${errorData.capacidade.join(
            ", "
          )}`;
        } else if (errorData.preco_ingresso) {
          errorMessage = `Erro no preço: ${errorData.preco_ingresso.join(
            ", "
          )}`;
        } else {
          errorMessage = "Verifique os dados informados";
        }
      } catch (e) {
        errorMessage = "Dados inválidos. Verifique os campos obrigatórios.";
      }
    } else if (error.message.includes("500")) {
      errorMessage = "Erro interno do servidor. Tente novamente.";
    } else if (error.message.includes("NetworkError")) {
      errorMessage = "Erro de conexão. Verifique se o servidor está rodando.";
    }

    showMessage(errorMessage, "error");
  }
}

async function saveIngresso(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData.entries());

  // Debug: log dos dados do formulário
  console.log("DEBUG: Dados do formulário ingresso:", data);

  // Validar campos obrigatórios
  const requiredFields = ["tipo", "preco", "evento", "participante", "status"];

  // Limpar erros visuais anteriores
  clearFieldErrors();

  const missingFields = requiredFields.filter(
    (field) =>
      !data[field] ||
      (typeof data[field] === "string" && data[field].trim() === "")
  );

  if (missingFields.length > 0) {
    // Destacar campos com erro
    missingFields.forEach((field) => {
      highlightFieldError(field);
    });

    showMessage(
      `Preencha todos os campos obrigatórios: ${missingFields
        .map((field) => getIngressoFieldLabel(field))
        .join(", ")}`,
      "error"
    );
    return;
  }

  // Validação extra: preço deve ser positivo
  if (parseFloat(data.preco) <= 0) {
    showMessage("O preço deve ser maior que zero.", "error");
    highlightFieldError("preco");
    return;
  }

  // Converter tipos de dados
  if (data.preco) {
    data.preco = parseFloat(data.preco);
  }
  if (data.evento) {
    data.evento = parseInt(data.evento);
  }
  if (data.participante) {
    data.participante = parseInt(data.participante);
  }

  console.log("DEBUG: Dados processados ingresso:", data);

  try {
    if (editingItem) {
      await api.updateIngresso(editingItem.id, data);
      showMessage("Ingresso atualizado com sucesso!", "success");
    } else {
      await api.createIngresso(data);
      showMessage("Ingresso criado com sucesso!", "success");
    }

    closeModal();
    loadIngressos();
  } catch (error) {
    console.error("Erro ao salvar ingresso:", error);

    // Tratar erros específicos do backend
    let errorMessage = "Erro ao salvar ingresso";

    if (error.message.includes("400")) {
      try {
        const errorData = JSON.parse(error.message.split(" - ")[1]);
        if (errorData.tipo) {
          errorMessage = `Erro no tipo: ${errorData.tipo.join(", ")}`;
        } else if (errorData.preco) {
          errorMessage = `Erro no preço: ${errorData.preco.join(", ")}`;
        } else if (errorData.evento) {
          errorMessage = `Erro no evento: ${errorData.evento.join(", ")}`;
        } else if (errorData.participante) {
          errorMessage = `Erro no participante: ${errorData.participante.join(
            ", "
          )}`;
        } else if (errorData.status) {
          errorMessage = `Erro no status: ${errorData.status.join(", ")}`;
        } else {
          errorMessage = "Verifique os dados informados";
        }
      } catch (e) {
        errorMessage = "Dados inválidos. Verifique os campos obrigatórios.";
      }
    } else if (error.message.includes("500")) {
      errorMessage = "Erro interno do servidor. Tente novamente.";
    } else if (error.message.includes("NetworkError")) {
      errorMessage = "Erro de conexão. Verifique se o servidor está rodando.";
    }

    showMessage(errorMessage, "error");
  }
}

async function saveParticipante(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData.entries());

  // Debug: log dos dados do formulário
  console.log("DEBUG: Dados do formulário participante:", data);

  // Validar campos obrigatórios
  const requiredFields = ["nome", "email"];

  // Limpar erros visuais anteriores
  clearFieldErrors();

  const missingFields = requiredFields.filter(
    (field) =>
      !data[field] ||
      (typeof data[field] === "string" && data[field].trim() === "")
  );

  if (missingFields.length > 0) {
    // Destacar campos com erro
    missingFields.forEach((field) => {
      highlightFieldError(field);
    });

    showMessage(
      `Preencha todos os campos obrigatórios: ${missingFields
        .map((field) => getParticipanteFieldLabel(field))
        .join(", ")}`,
      "error"
    );
    return;
  }

  // Validação de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    showMessage("Digite um email válido.", "error");
    highlightFieldError("email");
    return;
  }

  // Validação de nome (mínimo 2 caracteres)
  if (data.nome.trim().length < 2) {
    showMessage("O nome deve ter pelo menos 2 caracteres.", "error");
    highlightFieldError("nome");
    return;
  }

  console.log("DEBUG: Dados processados participante:", data);

  try {
    if (editingItem) {
      await api.updateParticipante(editingItem.id, data);
      showMessage("Participante atualizado com sucesso!", "success");
    } else {
      await api.createParticipante(data);
      showMessage("Participante criado com sucesso!", "success");
    }

    closeModal();
    loadParticipantes();
  } catch (error) {
    console.error("Erro ao salvar participante:", error);

    // Tratar erros específicos do backend
    let errorMessage = "Erro ao salvar participante";

    if (error.message.includes("400")) {
      try {
        const errorData = JSON.parse(error.message.split(" - ")[1]);
        if (errorData.nome) {
          errorMessage = `Erro no nome: ${errorData.nome.join(", ")}`;
        } else if (errorData.email) {
          errorMessage = `Erro no email: ${errorData.email.join(", ")}`;
        } else if (errorData.telefone) {
          errorMessage = `Erro no telefone: ${errorData.telefone.join(", ")}`;
        } else if (errorData.cpf) {
          errorMessage = `Erro no CPF: ${errorData.cpf.join(", ")}`;
        } else if (errorData.data_nascimento) {
          errorMessage = `Erro na data de nascimento: ${errorData.data_nascimento.join(
            ", "
          )}`;
        } else {
          errorMessage = "Verifique os dados informados";
        }
      } catch (e) {
        errorMessage = "Dados inválidos. Verifique os campos obrigatórios.";
      }
    } else if (error.message.includes("500")) {
      errorMessage = "Erro interno do servidor. Tente novamente.";
    } else if (error.message.includes("NetworkError")) {
      errorMessage = "Erro de conexão. Verifique se o servidor está rodando.";
    }

    showMessage(errorMessage, "error");
  }
}

// Função para atualizar contador de caracteres
function updateCharCounter(textarea, counterId) {
  const counter = document.getElementById(counterId);
  const currentLength = textarea.value.length;
  const maxLength = textarea.maxLength;
  const minLength = 10;

  let statusText = "";
  if (currentLength === 0) {
    statusText = "Descrição obrigatória";
  } else if (currentLength < minLength) {
    statusText = `Mínimo ${minLength} caracteres (faltam ${
      minLength - currentLength
    })`;
  } else {
    statusText = "Descrição válida";
  }

  counter.textContent = `${currentLength}/${maxLength} caracteres - ${statusText}`;

  // Mudar cor baseado no uso e validação
  counter.className = "char-counter";

  if (currentLength === 0) {
    counter.classList.add("danger");
  } else if (currentLength < minLength) {
    counter.classList.add("warning");
  } else if (currentLength > maxLength * 0.8) {
    counter.classList.add("warning");
  } else if (currentLength > maxLength * 0.95) {
    counter.classList.remove("warning");
    counter.classList.add("danger");
  } else {
    counter.classList.remove("warning", "danger");
  }
}

// Funções de validação visual
function clearFieldErrors() {
  document.querySelectorAll(".field-error").forEach((el) => {
    el.classList.remove("field-error");
    el.classList.remove("border-red-500");
    el.classList.remove("focus:ring-red-500");
    el.classList.add("border-gray-300");
    el.classList.add("focus:ring-blue-500");
  });
}

function highlightFieldError(fieldName) {
  const field = document.querySelector(`[name="${fieldName}"]`);
  if (field) {
    field.classList.add("field-error", "border-red-500", "focus:ring-red-500");
    field.classList.remove("border-gray-300", "focus:ring-blue-500");
    field.focus();
  }
}

function getFieldLabel(fieldName) {
  const labels = {
    nome: "Nome",
    data: "Data e Hora",
    local: "Local",
    capacidade: "Capacidade",
    preco_ingresso: "Preço do Ingresso",
    status: "Status",
    descricao: "Descrição",
  };
  return labels[fieldName] || fieldName;
}

function getIngressoFieldLabel(fieldName) {
  const labels = {
    tipo: "Tipo",
    preco: "Preço",
    evento: "Evento",
    participante: "Participante",
    status: "Status",
  };
  return labels[fieldName] || fieldName;
}

function getParticipanteFieldLabel(fieldName) {
  const labels = {
    nome: "Nome",
    email: "Email",
    telefone: "Telefone",
    cpf: "CPF",
    data_nascimento: "Data de Nascimento",
  };
  return labels[fieldName] || fieldName;
}

// Validação em tempo real da descrição
function validateDescription(textarea) {
  const value = textarea.value.trim();
  const minLength = 10;

  // Remover classes de erro anteriores
  textarea.classList.remove("border-red-500", "focus:ring-red-500");
  textarea.classList.add("border-gray-300", "focus:ring-blue-500");

  // Validar tamanho mínimo
  if (value.length > 0 && value.length < minLength) {
    textarea.classList.remove("border-gray-300", "focus:ring-blue-500");
    textarea.classList.add("border-yellow-500", "focus:ring-yellow-500");
  } else if (value.length >= minLength) {
    textarea.classList.remove(
      "border-gray-300",
      "focus:ring-blue-500",
      "border-yellow-500",
      "focus:ring-yellow-500"
    );
    textarea.classList.add("border-green-500", "focus:ring-green-500");
  }
}

// Funções de edição e exclusão
async function editItem(type, id) {
  try {
    showLoader();
    let item;

    switch (type) {
      case "evento":
        item = await api.getEvento(id);
        break;
      case "ingresso":
        item = await api.getIngresso(id);
        break;
      case "participante":
        item = await api.getParticipante(id);
        break;
      default:
        throw new Error(`Tipo desconhecido: ${type}`);
    }

    // Armazenar item sendo editado
    editingItem = item;

    // Abrir modal com dados do item
    showModal(type, item);
  } catch (error) {
    console.error(`Erro ao carregar ${type} para edição:`, error);
    showMessage(`Erro ao carregar ${type} para edição`, "error");
  } finally {
    hideLoader();
  }
}

async function deleteItem(type, id) {
  // Confirmação mais elegante
  const itemName = getItemTypeName(type);
  const confirmed = await showConfirmDialog(
    `Excluir ${itemName}`,
    `Tem certeza que deseja excluir este ${itemName}?`,
    "Esta ação não pode ser desfeita."
  );

  if (!confirmed) {
    return;
  }

  try {
    showLoader();
    let deleted = false;
    switch (type) {
      case "evento":
        await api.deleteEvento(id);
        deleted = true;
        loadEventos();
        break;
      case "ingresso":
        await api.deleteIngresso(id);
        deleted = true;
        loadIngressos();
        break;
      case "participante":
        await api.deleteParticipante(id);
        deleted = true;
        loadParticipantes();
        break;
      default:
        throw new Error(`Tipo desconhecido: ${type}`);
    }
    if (deleted) {
      showMessage(`${itemName} excluído com sucesso!`, "success");
    }
  } catch (error) {
    console.error(`Erro ao excluir ${type}:`, error);
    let errorMessage = `Erro ao excluir ${itemName}`;
    if (error.message && error.message.includes("404")) {
      errorMessage = `${itemName} não encontrado`;
    } else if (error.message && error.message.includes("400")) {
      errorMessage = `Não é possível excluir este ${itemName} (pode estar em uso)`;
    } else if (error.message && error.message.includes("500")) {
      errorMessage = "Erro interno do servidor. Tente novamente.";
    } else if (error.message && error.message.includes("NetworkError")) {
      errorMessage = "Erro de conexão. Verifique se o servidor está rodando.";
    }
    showMessage(errorMessage, "error");
  } finally {
    hideLoader();
  }
}

// Função auxiliar para obter o nome do tipo de item
function getItemTypeName(type) {
  const names = {
    evento: "Evento",
    ingresso: "Ingresso",
    participante: "Participante",
  };
  return names[type] || type;
}

// Função para mostrar diálogo de confirmação
function showConfirmDialog(title, message, warning = "") {
  return new Promise((resolve) => {
    const modal = document.getElementById("modal");
    const modalBody = document.getElementById("modal-body");

    modalBody.innerHTML = `
      <div class="text-center">
        <h2 class="text-2xl font-bold mb-4 text-red-700">${title}</h2>
        <p class="text-gray-700 mb-4">${message}</p>
        ${warning ? `<p class="text-sm text-red-600 mb-6">${warning}</p>` : ""}
        <div class="flex justify-center gap-4">
          <button 
            onclick="closeConfirmDialog(false)" 
            class="px-6 py-2 rounded bg-gray-500 text-white hover:bg-gray-700 transition"
          >
            Cancelar
          </button>
          <button 
            onclick="closeConfirmDialog(true)" 
            class="px-6 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
          >
            Excluir
          </button>
        </div>
      </div>
    `;

    modal.classList.remove("hidden");

    // Armazenar a função resolve para ser chamada quando o usuário decidir
    window.closeConfirmDialog = (result) => {
      modal.classList.add("hidden");
      delete window.closeConfirmDialog;
      resolve(result);
    };
  });
}

// Função para carregar opções dos selects
async function loadSelectOptions() {
  try {
    console.log("DEBUG: Iniciando carregamento de opções dos selects");

    const [eventosResponse, participantesResponse] = await Promise.all([
      api.getEventos(),
      api.getParticipantes(),
    ]);

    // Verificar se os dados têm a estrutura esperada
    const eventos =
      eventosResponse && eventosResponse.results
        ? eventosResponse.results
        : eventosResponse;
    const participantes =
      participantesResponse && participantesResponse.results
        ? participantesResponse.results
        : participantesResponse;

    console.log("DEBUG: Eventos carregados:", eventos);
    console.log("DEBUG: Participantes carregados:", participantes);

    // Carregar eventos no select
    const eventoSelect = document.querySelector('select[name="evento"]');
    if (eventoSelect) {
      console.log("DEBUG: Encontrou select de eventos");
      eventoSelect.innerHTML = '<option value="">Selecione um evento</option>';

      if (Array.isArray(eventos)) {
        eventos.forEach((evento) => {
          const option = document.createElement("option");
          option.value = evento.id;
          option.textContent = `${evento.nome} - ${formatDateTime(
            evento.data
          )}`;
          if (editingItem && editingItem.evento === evento.id) {
            option.selected = true;
          }
          eventoSelect.appendChild(option);
        });
        console.log(`DEBUG: Adicionados ${eventos.length} eventos ao select`);
      } else {
        console.error("DEBUG: Eventos não é um array:", eventos);
      }
    } else {
      console.error("DEBUG: Select de eventos não encontrado");
    }

    // Carregar participantes no select
    const participanteSelect = document.querySelector(
      'select[name="participante"]'
    );
    if (participanteSelect) {
      console.log("DEBUG: Encontrou select de participantes");
      participanteSelect.innerHTML =
        '<option value="">Selecione um participante</option>';

      if (Array.isArray(participantes)) {
        participantes.forEach((participante) => {
          const option = document.createElement("option");
          option.value = participante.id;
          option.textContent = `${participante.nome} (${participante.email})`;
          if (editingItem && editingItem.participante === participante.id) {
            option.selected = true;
          }
          participanteSelect.appendChild(option);
        });
        console.log(
          `DEBUG: Adicionados ${participantes.length} participantes ao select`
        );
      } else {
        console.error("DEBUG: Participantes não é um array:", participantes);
      }
    } else {
      console.error("DEBUG: Select de participantes não encontrado");
    }
  } catch (error) {
    console.error("Erro ao carregar opções dos selects:", error);
    showMessage("Erro ao carregar opções dos formulários", "error");
  }
}
