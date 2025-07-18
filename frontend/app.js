// Variáveis globais
let currentSection = "home";
let editingItem = null;

// Inicialização da aplicação
document.addEventListener("DOMContentLoaded", function () {
  console.log("Sistema de Eventos iniciado");
  loadData();
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
  event.target.classList.add("active");

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
    await Promise.all([loadEventos(), loadIngressos(), loadParticipantes()]);
  } catch (error) {
    console.error("Erro ao carregar dados:", error);
    showMessage("Erro ao carregar dados", "error");
  }
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
function showModal(type, item = null) {
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
}

function closeModal() {
  const modal = document.getElementById("modal");
  modal.classList.add("hidden");
  editingItem = null;
}

// Conteúdo dos modais
function getEventoModalContent(evento = null) {
  const isEditing = evento !== null;
  const title = isEditing ? "Editar Evento" : "Novo Evento";

  return `
        <h2 class="text-2xl font-bold mb-4">${title}</h2>
        <form onsubmit="saveEvento(event)">
            <div class="form-group">
                <label class="form-label">Nome</label>
                <input type="text" name="nome" class="form-input" value="${
                  evento?.nome || ""
                }" required>
            </div>
            <div class="form-group">
                <label class="form-label">Data</label>
                <input type="datetime-local" name="data" class="form-input" value="${
                  evento?.data ? evento.data.slice(0, 16) : ""
                }" required>
            </div>
            <div class="form-group">
                <label class="form-label">Local</label>
                <input type="text" name="local" class="form-input" value="${
                  evento?.local || ""
                }" required>
            </div>
            <div class="form-group">
                <label class="form-label">Capacidade</label>
                <input type="number" name="capacidade" class="form-input" value="${
                  evento?.capacidade || ""
                }" required>
            </div>
            <div class="form-group">
                <label class="form-label">Preço do Ingresso</label>
                <input type="number" name="preco_ingresso" step="0.01" class="form-input" value="${
                  evento?.preco_ingresso || ""
                }" required>
            </div>
            <div class="form-group">
                <label class="form-label">Status</label>
                <select name="status" class="form-input" required>
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
            <div class="form-group">
                <label class="form-label">Descrição</label>
                <textarea name="descricao" class="form-textarea" rows="3">${
                  evento?.descricao || ""
                }</textarea>
            </div>
            <div class="flex justify-end space-x-2">
                <button type="button" onclick="closeModal()" class="btn btn-secondary">Cancelar</button>
                <button type="submit" class="btn btn-primary">${
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
      <h2 class="text-2xl font-bold mb-4">${title}</h2>
      <form onsubmit="saveIngresso(event)">
          <div class="form-group">
              <label class="form-label">Tipo</label>
              <select name="tipo" class="form-input" required>
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
          <div class="form-group">
              <label class="form-label">Preço</label>
              <input type="number" name="preco" step="0.01" class="form-input" value="${
                ingresso?.preco || ""
              }" required>
          </div>
          <div class="form-group">
              <label class="form-label">Evento</label>
              <select name="evento" class="form-input" required>
                  <option value="">Selecione um evento</option>
                  <!-- Opções serão carregadas dinamicamente -->
              </select>
          </div>
          <div class="form-group">
              <label class="form-label">Participante</label>
              <select name="participante" class="form-input" required>
                  <option value="">Selecione um participante</option>
                  <!-- Opções serão carregadas dinamicamente -->
              </select>
          </div>
          <div class="form-group">
              <label class="form-label">Status</label>
              <select name="status" class="form-input" required>
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
          <div class="flex justify-end space-x-2">
              <button type="button" onclick="closeModal()" class="btn btn-secondary">Cancelar</button>
              <button type="submit" class="btn btn-primary">${
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
      <h2 class="text-2xl font-bold mb-4">${title}</h2>
      <form onsubmit="saveParticipante(event)">
          <div class="form-group">
              <label class="form-label">Nome</label>
              <input type="text" name="nome" class="form-input" value="${
                participante?.nome || ""
              }" required>
          </div>
          <div class="form-group">
              <label class="form-label">Email</label>
              <input type="email" name="email" class="form-input" value="${
                participante?.email || ""
              }" required>
          </div>
          <div class="form-group">
              <label class="form-label">Telefone</label>
              <input type="tel" name="telefone" class="form-input" value="${
                participante?.telefone || ""
              }">
          </div>
          <div class="form-group">
              <label class="form-label">CPF</label>
              <input type="text" name="cpf" class="form-input" value="${
                participante?.cpf || ""
              }">
          </div>
          <div class="form-group">
              <label class="form-label">Data de Nascimento</label>
              <input type="date" name="data_nascimento" class="form-input" value="${
                participante?.data_nascimento || ""
              }">
          </div>
          <div class="flex justify-end space-x-2">
              <button type="button" onclick="closeModal()" class="btn btn-secondary">Cancelar</button>
              <button type="submit" class="btn btn-primary">${
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
  ];
  const missingFields = requiredFields.filter((field) => !data[field]);

  if (missingFields.length > 0) {
    console.error("DEBUG: Campos obrigatórios faltando:", missingFields);
    showMessage(
      `Campos obrigatórios faltando: ${missingFields.join(", ")}`,
      "error"
    );
    return;
  }

  // Converter tipos de dados
  if (data.capacidade) {
    data.capacidade = parseInt(data.capacidade);
  }
  if (data.preco_ingresso) {
    data.preco_ingresso = parseFloat(data.preco_ingresso);
  }

  // Tratar campo descrição vazio
  if (data.descricao === "") {
    data.descricao = null;
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
    showMessage("Erro ao salvar evento", "error");
  }
}

async function saveIngresso(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData.entries());

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
    showMessage("Erro ao salvar ingresso", "error");
  }
}

async function saveParticipante(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData.entries());

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
    showMessage("Erro ao salvar participante", "error");
  }
}

// Funções de edição e exclusão
function editItem(type, id) {
  // Implementar busca do item por ID e abertura do modal
  console.log(`Editando ${type} com ID ${id}`);
}

async function deleteItem(type, id) {
  if (!confirm("Tem certeza que deseja excluir este item?")) {
    return;
  }

  try {
    switch (type) {
      case "evento":
        await api.deleteEvento(id);
        showMessage("Evento excluído com sucesso!", "success");
        loadEventos();
        break;
      case "ingresso":
        await api.deleteIngresso(id);
        showMessage("Ingresso excluído com sucesso!", "success");
        loadIngressos();
        break;
      case "participante":
        await api.deleteParticipante(id);
        showMessage("Participante excluído com sucesso!", "success");
        loadParticipantes();
        break;
    }
  } catch (error) {
    console.error(`Erro ao excluir ${type}:`, error);
    showMessage(`Erro ao excluir ${type}`, "error");
  }
}
