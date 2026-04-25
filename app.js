const storageKey = "adminos-saas-dashboard-v1";

const navItems = [
  { id: "dashboard", label: "Visão geral", symbol: "VG" },
  { id: "clientes", label: "Clientes", symbol: "CL" },
  { id: "usuarios", label: "Usuários", symbol: "US" },
  { id: "financeiro", label: "Financeiro", symbol: "FI" },
  { id: "chamados", label: "Chamados", symbol: "CH" },
  { id: "analytics", label: "Indicadores", symbol: "IN" },
  { id: "auditoria", label: "Auditoria", symbol: "AU" },
  { id: "configuracoes", label: "Configurações", symbol: "CF" },
];

const seed = {
  clients: [
    { id: 1, company: "Atlas Saúde", owner: "Marina Costa", plan: "Corporativo", status: "Ativo", health: 94, mrr: 14800, segment: "Saúde", stage: "Retenção" },
    { id: 2, company: "Nexo Fintech", owner: "Rafael Lima", plan: "Crescimento", status: "Ativo", health: 87, mrr: 9600, segment: "Financeiro", stage: "Expansão" },
    { id: 3, company: "Orion Foods", owner: "Bianca Alves", plan: "Essencial", status: "Trial", health: 68, mrr: 1900, segment: "Varejo", stage: "Onboarding" },
    { id: 4, company: "Prime Logística", owner: "Daniel Rocha", plan: "Corporativo", status: "Risco", health: 42, mrr: 12200, segment: "Logística", stage: "Risco" },
    { id: 5, company: "Lume Educação", owner: "Paula Nunes", plan: "Crescimento", status: "Ativo", health: 81, mrr: 6400, segment: "Educação", stage: "Retenção" },
    { id: 6, company: "Vetta Labs", owner: "Carlos Mendes", plan: "Essencial", status: "Pausado", health: 35, mrr: 1200, segment: "Tecnologia", stage: "Risco" },
    { id: 7, company: "Cora Estética", owner: "Julia Prado", plan: "Crescimento", status: "Ativo", health: 76, mrr: 5200, segment: "Estética", stage: "Expansão" },
  ],
  users: [
    { id: 1, name: "Fernando Orrico", email: "fernando@adminos.dev", role: "Admin", status: "Ativo", lastAccess: "Hoje, 09:12" },
    { id: 2, name: "Ana Martins", email: "ana@adminos.dev", role: "Financeiro", status: "Ativo", lastAccess: "Hoje, 08:44" },
    { id: 3, name: "Leandro Silva", email: "leandro@adminos.dev", role: "Suporte", status: "Ativo", lastAccess: "Ontem, 18:20" },
    { id: 4, name: "Camila Torres", email: "camila@adminos.dev", role: "CS", status: "Pausado", lastAccess: "21/04, 14:09" },
    { id: 5, name: "Bruno Freitas", email: "bruno@adminos.dev", role: "Vendas", status: "Ativo", lastAccess: "Hoje, 10:01" },
  ],
  invoices: [
    { id: "INV-1049", client: "Atlas Saúde", amount: 14800, status: "Pago", due: "2026-04-10" },
    { id: "INV-1050", client: "Nexo Fintech", amount: 9600, status: "Processando", due: "2026-04-15" },
    { id: "INV-1051", client: "Prime Logística", amount: 12200, status: "Pendente", due: "2026-04-18" },
    { id: "INV-1052", client: "Lume Educação", amount: 6400, status: "Pago", due: "2026-04-20" },
    { id: "INV-1053", client: "Cora Estética", amount: 5200, status: "Pago", due: "2026-04-24" },
  ],
  tickets: [
    { id: "SUP-218", client: "Prime Logística", title: "Falha em relatório de SLA", priority: "Alta", status: "Aberto", owner: "Leandro Silva", sla: "3h" },
    { id: "SUP-219", client: "Atlas Saúde", title: "Ajuste em permissões", priority: "Média", status: "Em andamento", owner: "Ana Martins", sla: "9h" },
    { id: "SUP-220", client: "Orion Foods", title: "Dúvida no onboarding", priority: "Baixa", status: "Resolvido", owner: "Camila Torres", sla: "22h" },
    { id: "SUP-221", client: "Vetta Labs", title: "Reativação de workspace", priority: "Alta", status: "Aberto", owner: "Leandro Silva", sla: "2h" },
  ],
  events: [
    { actor: "Fernando Orrico", action: "alterou plano da conta Nexo Fintech", time: "Hoje, 10:14", type: "Billing" },
    { actor: "Ana Martins", action: "aprovou fatura INV-1053", time: "Hoje, 09:53", type: "Financeiro" },
    { actor: "Leandro Silva", action: "assumiu chamado SUP-218", time: "Hoje, 09:21", type: "Suporte" },
    { actor: "Sistema", action: "gerou backup automático", time: "Hoje, 04:00", type: "Segurança" },
    { actor: "Bruno Freitas", action: "criou oportunidade para Cora Estética", time: "Ontem, 17:46", type: "Vendas" },
  ],
  revenue: [28, 35, 42, 40, 48, 57, 62, 66, 73, 81, 86, 94],
  settings: {
    mfa: true,
    audit: true,
    billingAlerts: true,
    weeklyReport: false,
    autoAssign: true,
    betaFeatures: false,
  },
};

const defaultState = {
  view: "dashboard",
  search: "",
  theme: "light",
  compact: false,
  clientFilter: "Todos",
  userFilter: "Todos",
  ticketFilter: "Todos",
  data: seed,
};

let state = loadState();

const app = document.querySelector("#app");
const navList = document.querySelector("#navList");
const globalSearch = document.querySelector("#globalSearch");
const themeToggle = document.querySelector("#themeToggle");
const densityToggle = document.querySelector("#densityToggle");
const menuToggle = document.querySelector("#menuToggle");
const newClientButton = document.querySelector("#newClientButton");
const modal = document.querySelector("#clientModal");
const overlay = document.querySelector("#overlay");
const form = document.querySelector("#clientForm");
const toast = document.querySelector("#toast");

function loadState() {
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey));
    if (!stored) return structuredClone(defaultState);
    return {
      ...structuredClone(defaultState),
      ...stored,
      data: {
        ...structuredClone(seed),
        ...(stored.data || {}),
        settings: {
          ...seed.settings,
          ...(stored.data?.settings || {}),
        },
      },
    };
  } catch {
    return structuredClone(defaultState);
  }
}

function saveState() {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function formatMoney(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

function normalize(value) {
  return String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function matchesSearch(item) {
  const term = state.search.trim().toLowerCase();
  if (!term) return true;
  return Object.values(item).join(" ").toLowerCase().includes(term);
}

function applyShellState() {
  document.body.dataset.theme = state.theme;
  document.body.classList.toggle("compact", state.compact);
  globalSearch.value = state.search;
  themeToggle.textContent = state.theme === "dark" ? "Claro" : "Escuro";
  densityToggle.textContent = state.compact ? "Conforto" : "Compacto";
}

function renderNav() {
  navList.innerHTML = navItems
    .map((item) => {
      const active = item.id === state.view ? "active" : "";
      return `
        <button class="nav-item ${active}" type="button" data-route="${item.id}">
          <span class="nav-symbol">${item.symbol}</span>
          <span>${item.label}</span>
        </button>
      `;
    })
    .join("");
}

function setView(view) {
  if (!navItems.some((item) => item.id === view)) return;
  state.view = view;
  window.location.hash = view;
  saveState();
  render();
  app.focus({ preventScroll: true });
  document.body.classList.remove("menu-open");
}

function viewHeader(title, subtitle, actions = "") {
  return `
    <header class="view-header">
      <div>
        <p class="eyebrow">AdminOS</p>
        <h1>${title}</h1>
        <p>${subtitle}</p>
      </div>
      <div class="header-actions">${actions}</div>
    </header>
  `;
}

function metricCard(label, value, note, tone = "accent") {
  const color = {
    accent: "var(--accent)",
    warning: "var(--warning)",
    danger: "var(--danger)",
    violet: "var(--violet)",
    success: "var(--success)",
  }[tone];

  return `
    <article class="card metric-card">
      <div class="metric-label">
        <span>${label}</span>
        <i class="metric-dot" style="background:${color}"></i>
      </div>
      <div class="metric-value">${value}</div>
      <p class="metric-note">${note}</p>
    </article>
  `;
}

function renderDashboard() {
  const { clients, invoices, tickets, revenue, events } = state.data;
  const activeClients = clients.filter((client) => client.status === "Ativo").length;
  const mrr = clients.reduce((sum, client) => sum + client.mrr, 0);
  const pending = invoices.filter((invoice) => invoice.status !== "Pago").reduce((sum, invoice) => sum + invoice.amount, 0);
  const openTickets = tickets.filter((ticket) => ticket.status !== "Resolvido").length;

  return `
    <section class="view">
      ${viewHeader(
        "Painel executivo",
        "Visão consolidada da operação, receita, clientes em risco e atendimento.",
        `<button class="ghost-button" type="button" data-action="reset-demo">Restaurar demo</button>`
      )}

      ${renderExecutiveStrip(mrr, pending, openTickets)}

      <section class="kpi-grid">
        ${metricCard("MRR atual", formatMoney(mrr), "<strong>+12,4%</strong> vs. mês anterior", "accent")}
        ${metricCard("Clientes ativos", activeClients, `${clients.length} contas na base`, "success")}
        ${metricCard("A receber", formatMoney(pending), "faturas em aberto", "warning")}
        ${metricCard("Chamados abertos", openTickets, "SLA médio de 6h", "danger")}
      </section>

      <section class="grid-2">
        <article class="card">
          <div class="panel-header">
            <div>
              <h2>Receita recorrente</h2>
              <p>Evolução mensal em milhares de reais.</p>
            </div>
            <span class="status ativo">Projeção</span>
          </div>
          ${renderRevenueChart(revenue)}
        </article>

        <article class="card">
          <div class="panel-header">
            <div>
              <h2>Composição de planos</h2>
              <p>Distribuição da base por pacote.</p>
            </div>
          </div>
          ${renderPlanMix()}
        </article>
      </section>

      <section class="grid-2">
        ${renderClientsTable(clients.slice(0, 6), false)}
        <article class="card">
          <div class="panel-header">
            <div>
              <h2>Atividade recente</h2>
              <p>Eventos operacionais mais importantes.</p>
            </div>
          </div>
          ${renderEvents(events.slice(0, 5))}
        </article>
      </section>
    </section>
  `;
}

function renderExecutiveStrip(mrr, pending, openTickets) {
  return `
    <section class="executive-strip" aria-label="Resumo executivo">
      <article>
        <span>Operação hoje</span>
        <strong>18 tarefas</strong>
        <small>6 críticas em acompanhamento</small>
      </article>
      <article>
        <span>Meta mensal</span>
        <strong>74%</strong>
        <small>progresso comercial</small>
      </article>
      <article>
        <span>Receita prevista</span>
        <strong>${formatMoney(Math.round(mrr * 1.18))}</strong>
        <small>previsão do ciclo</small>
      </article>
      <article>
        <span>Prioridade</span>
        <strong>${openTickets} SLAs</strong>
        <small>${formatMoney(pending)} em cobrança</small>
      </article>
    </section>
  `;
}

function renderRevenueChart(revenue) {
  const max = Math.max(...revenue);
  const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

  return `
    <div class="chart-bars" aria-label="Gráfico de receita">
      ${revenue
        .map((value, index) => {
          const height = Math.max(12, Math.round((value / max) * 100));
          return `
            <div class="bar-wrap">
              <div class="bar" style="height:${height}%" title="${months[index]}: R$ ${value} mil"></div>
              <span class="bar-label">${months[index]}</span>
            </div>
          `;
        })
        .join("")}
    </div>
  `;
}

function renderPlanMix() {
  const plans = ["Essencial", "Crescimento", "Corporativo"].map((plan) => {
    const count = state.data.clients.filter((client) => client.plan === plan).length;
    const percentage = Math.round((count / state.data.clients.length) * 100);
    return { plan, count, percentage };
  });

  return `
    <ul class="plan-list">
      ${plans
        .map(
          (item) => `
            <li class="plan-item">
              <div class="plan-row">
                <strong>${item.plan}</strong>
                <span>${item.count} contas</span>
              </div>
              <div class="progress"><span style="width:${item.percentage}%"></span></div>
            </li>
          `
        )
        .join("")}
    </ul>
  `;
}

function renderClientes() {
  const filtered = state.data.clients
    .filter(matchesSearch)
    .filter((client) => state.clientFilter === "Todos" || client.status === state.clientFilter);

  return `
    <section class="view">
      ${viewHeader(
        "Clientes",
        "CRM operacional com status, plano, receita mensal e saúde da conta.",
        `<button class="primary-button" type="button" data-action="open-client-modal">Novo cliente</button>`
      )}
      ${renderClientsTable(filtered, true)}
      ${renderPipeline()}
    </section>
  `;
}

function renderClientsTable(clients, showToolbar = true) {
  return `
    <article class="table-panel">
      ${
        showToolbar
          ? `
        <div class="table-toolbar">
          <div>
            <strong>${clients.length} clientes</strong>
          </div>
          <div class="filters">
            <select data-filter="clientFilter" aria-label="Filtrar clientes por status">
              ${["Todos", "Ativo", "Risco", "Trial", "Pausado"].map((status) => option(status, state.clientFilter)).join("")}
            </select>
          </div>
        </div>
      `
          : `
        <div class="table-toolbar">
          <strong>Contas em foco</strong>
          <button class="ghost-button" type="button" data-route="clientes">Abrir CRM</button>
        </div>
      `
      }
      <table class="data-table">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Plano</th>
            <th>Status</th>
            <th>Saúde</th>
            <th>MRR</th>
            <th>Responsável</th>
            ${showToolbar ? "<th>Ação</th>" : ""}
          </tr>
        </thead>
        <tbody>
          ${clients
            .map(
              (client) => `
                <tr>
                  <td>
                    <span class="stacked">
                      <strong>${escapeHtml(client.company)}</strong>
                      <span>${escapeHtml(client.segment)} - ${escapeHtml(client.stage)}</span>
                    </span>
                  </td>
                  <td>${client.plan}</td>
                  <td><span class="status ${normalize(client.status)}">${client.status}</span></td>
                  <td>${health(client.health)}</td>
                  <td>${formatMoney(client.mrr)}</td>
                  <td>${escapeHtml(client.owner)}</td>
                  ${showToolbar ? `<td><button class="ghost-button" type="button" data-action="cycle-client" data-id="${client.id}">Status</button></td>` : ""}
                </tr>
              `
            )
            .join("") || emptyRow(showToolbar ? 7 : 6)}
        </tbody>
      </table>
    </article>
  `;
}

function health(value) {
  const color = value >= 75 ? "var(--success)" : value >= 55 ? "var(--warning)" : "var(--danger)";
  return `
    <span class="health">
      <small>Saúde ${value}/100</small>
      <span class="health-track"><span style="width:${value}%; background:${color}"></span></span>
    </span>
  `;
}

function renderPipeline() {
  const stages = ["Onboarding", "Expansão", "Retenção", "Risco"];
  return `
    <section class="board" aria-label="Pipeline de clientes">
      ${stages
        .map((stage) => {
          const clients = state.data.clients.filter((client) => client.stage === stage);
          return `
            <article class="board-column">
              <h3>${stage} (${clients.length})</h3>
              ${clients
                .map(
                  (client) => `
                    <div class="deal-card">
                      <strong>${escapeHtml(client.company)}</strong>
                      <div class="deal-meta">
                        <span>${client.plan}</span>
                        <span>${formatMoney(client.mrr)}</span>
                      </div>
                      ${health(client.health)}
                    </div>
                  `
                )
                .join("")}
            </article>
          `;
        })
        .join("")}
    </section>
  `;
}

function renderUsuarios() {
  const users = state.data.users
    .filter(matchesSearch)
    .filter((user) => state.userFilter === "Todos" || user.role === state.userFilter);

  return `
    <section class="view">
      ${viewHeader("Usuários", "Controle de acesso, papéis, status e última atividade da equipe.")}
      <article class="table-panel">
        <div class="table-toolbar">
          <strong>${users.length} usuários</strong>
          <div class="filters">
            <select data-filter="userFilter" aria-label="Filtrar usuários por papel">
              ${["Todos", "Admin", "Financeiro", "Suporte", "CS", "Vendas"].map((role) => option(role, state.userFilter)).join("")}
            </select>
          </div>
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th>Usuário</th>
              <th>Papel</th>
              <th>Status</th>
              <th>Último acesso</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            ${users
              .map(
                (user) => `
                  <tr>
                    <td>
                      <span class="stacked">
                        <strong>${escapeHtml(user.name)}</strong>
                        <span>${escapeHtml(user.email)}</span>
                      </span>
                    </td>
                    <td><span class="role-pill">${user.role}</span></td>
                    <td><span class="status ${normalize(user.status)}">${user.status}</span></td>
                    <td>${user.lastAccess}</td>
                    <td><button class="ghost-button" type="button" data-action="toggle-user" data-id="${user.id}">${user.status === "Ativo" ? "Pausar" : "Ativar"}</button></td>
                  </tr>
                `
              )
              .join("") || emptyRow(5)}
          </tbody>
        </table>
      </article>
    </section>
  `;
}

function renderFinanceiro() {
  const totalPaid = state.data.invoices.filter((invoice) => invoice.status === "Pago").reduce((sum, invoice) => sum + invoice.amount, 0);
  const pending = state.data.invoices.filter((invoice) => invoice.status !== "Pago").reduce((sum, invoice) => sum + invoice.amount, 0);
  const filtered = state.data.invoices.filter(matchesSearch);

  return `
    <section class="view">
      ${viewHeader(
        "Financeiro",
        "Faturas, receita reconhecida, pendências e exportação para conciliação.",
        `<button class="primary-button" type="button" data-action="export-invoices">Exportar CSV</button>`
      )}
      <section class="kpi-grid">
        ${metricCard("Recebido", formatMoney(totalPaid), "faturas pagas no ciclo", "success")}
        ${metricCard("Pendente", formatMoney(pending), "cobranças abertas", "warning")}
        ${metricCard("Ticket médio", formatMoney(Math.round((totalPaid + pending) / state.data.invoices.length)), "média por fatura", "violet")}
        ${metricCard("Risco de churn", "1 conta", "monitoramento ativo", "danger")}
      </section>
      <article class="table-panel">
        <div class="table-toolbar">
          <strong>${filtered.length} faturas</strong>
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th>Fatura</th>
              <th>Cliente</th>
              <th>Valor</th>
              <th>Vencimento</th>
              <th>Status</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            ${filtered
              .map(
                (invoice) => `
                  <tr>
                    <td>${invoice.id}</td>
                    <td>${escapeHtml(invoice.client)}</td>
                    <td>${formatMoney(invoice.amount)}</td>
                    <td>${invoice.due}</td>
                    <td><span class="status ${normalize(invoice.status)}">${invoice.status}</span></td>
                    <td><button class="ghost-button" type="button" data-action="mark-invoice-paid" data-id="${invoice.id}">Baixar</button></td>
                  </tr>
                `
              )
              .join("") || emptyRow(6)}
          </tbody>
        </table>
      </article>
    </section>
  `;
}

function renderChamados() {
  const filtered = state.data.tickets
    .filter(matchesSearch)
    .filter((ticket) => state.ticketFilter === "Todos" || ticket.priority === state.ticketFilter);

  return `
    <section class="view">
      ${viewHeader("Chamados", "Fila de suporte com prioridade, responsável e SLA por cliente.")}
      <section class="grid-3">
        ${metricCard("Abertos", state.data.tickets.filter((ticket) => ticket.status === "Aberto").length, "aguardando primeira resposta", "danger")}
        ${metricCard("Em andamento", state.data.tickets.filter((ticket) => ticket.status === "Em andamento").length, "em tratamento", "warning")}
        ${metricCard("Resolvidos", state.data.tickets.filter((ticket) => ticket.status === "Resolvido").length, "neste ciclo", "success")}
      </section>
      <article class="table-panel">
        <div class="table-toolbar">
          <strong>${filtered.length} chamados</strong>
          <div class="filters">
            <select data-filter="ticketFilter" aria-label="Filtrar chamados por prioridade">
              ${["Todos", "Alta", "Média", "Baixa"].map((priority) => option(priority, state.ticketFilter)).join("")}
            </select>
          </div>
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th>Chamado</th>
              <th>Cliente</th>
              <th>Prioridade</th>
              <th>Status</th>
              <th>SLA</th>
              <th>Responsável</th>
            </tr>
          </thead>
          <tbody>
            ${filtered
              .map(
                (ticket) => `
                  <tr>
                    <td>
                      <span class="stacked">
                        <strong>${ticket.id}</strong>
                        <span>${escapeHtml(ticket.title)}</span>
                      </span>
                    </td>
                    <td>${escapeHtml(ticket.client)}</td>
                    <td><span class="priority ${normalize(ticket.priority)}">${ticket.priority}</span></td>
                    <td><span class="status ${normalize(ticket.status)}">${ticket.status}</span></td>
                    <td>${ticket.sla}</td>
                    <td>${escapeHtml(ticket.owner)}</td>
                  </tr>
                `
              )
              .join("") || emptyRow(6)}
          </tbody>
        </table>
      </article>
    </section>
  `;
}

function renderAnalytics() {
  const avgHealth = Math.round(state.data.clients.reduce((sum, client) => sum + client.health, 0) / state.data.clients.length);
  const enterpriseMrr = state.data.clients.filter((client) => client.plan === "Corporativo").reduce((sum, client) => sum + client.mrr, 0);
  const totalMrr = state.data.clients.reduce((sum, client) => sum + client.mrr, 0);
  const enterpriseShare = Math.round((enterpriseMrr / totalMrr) * 100);

  return `
    <section class="view">
      ${viewHeader("Indicadores", "Indicadores de crescimento, qualidade da base e composição de receita.")}
      <section class="kpi-grid">
        ${metricCard("Saúde média", `${avgHealth}/100`, "base geral de clientes", "success")}
        ${metricCard("MRR Corporativo", `${enterpriseShare}%`, "participação da receita", "accent")}
        ${metricCard("Pipeline de expansão", formatMoney(118000), "oportunidades abertas", "violet")}
        ${metricCard("SLA cumprido", "92%", "últimos 30 dias", "warning")}
      </section>
      <section class="grid-2">
        <article class="card">
          <div class="panel-header">
            <div>
              <h2>Receita por mês</h2>
              <p>Base para previsão do próximo ciclo.</p>
            </div>
          </div>
          ${renderRevenueChart(state.data.revenue)}
        </article>
        <article class="card">
          <div class="panel-header">
            <div>
              <h2>Saúde das contas</h2>
              <p>Clientes ordenados por risco operacional.</p>
            </div>
          </div>
          <ul class="plan-list">
            ${[...state.data.clients]
              .sort((a, b) => a.health - b.health)
              .map(
                (client) => `
                  <li class="plan-item">
                    <div class="plan-row">
                      <strong>${escapeHtml(client.company)}</strong>
                      <span>${client.health}/100</span>
                    </div>
                    <div class="progress"><span style="width:${client.health}%"></span></div>
                  </li>
                `
              )
              .join("")}
          </ul>
        </article>
      </section>
    </section>
  `;
}

function renderAuditoria() {
  return `
    <section class="view">
      ${viewHeader("Auditoria", "Linha do tempo de eventos sensíveis, alterações e rotinas automáticas.")}
      <article class="card">
        <div class="timeline">
          ${state.data.events
            .map(
              (event) => `
                <div class="timeline-item">
                  <span class="timeline-dot"></span>
                  <div class="timeline-body">
                    <strong>${escapeHtml(event.actor)} - ${escapeHtml(event.type)}</strong>
                    <span>${escapeHtml(event.action)}</span>
                    <span>${event.time}</span>
                  </div>
                </div>
              `
            )
            .join("")}
        </div>
      </article>
    </section>
  `;
}

function renderConfiguracoes() {
  const groups = [
    {
      title: "Segurança",
      items: [
        ["mfa", "MFA obrigatório", "Exige dupla autenticação"],
        ["audit", "Registro de auditoria", "Registra eventos críticos"],
      ],
    },
    {
      title: "Operação",
      items: [
        ["autoAssign", "Atribuição automática", "Distribui chamados por fila"],
        ["weeklyReport", "Relatório semanal", "Envia resumo executivo"],
      ],
    },
    {
      title: "Faturamento",
      items: [
        ["billingAlerts", "Alertas financeiros", "Sinaliza faturas pendentes"],
        ["betaFeatures", "Recursos beta", "Libera módulos experimentais"],
      ],
    },
  ];

  return `
    <section class="view">
      ${viewHeader("Configurações", "Parâmetros da área de trabalho, segurança, operação e faturamento.")}
      <section class="settings-grid">
        ${groups
          .map(
            (group) => `
              <article class="settings-panel">
                <h2>${group.title}</h2>
                ${group.items
                  .map(
                    ([key, label, note]) => `
                      <div class="setting-row">
                        <span class="stacked">
                          <strong>${label}</strong>
                          <span>${note}</span>
                        </span>
                        <label class="switch" aria-label="${label}">
                          <input type="checkbox" data-setting="${key}" ${state.data.settings[key] ? "checked" : ""} />
                          <span></span>
                        </label>
                      </div>
                    `
                  )
                  .join("")}
              </article>
            `
          )
          .join("")}
      </section>
    </section>
  `;
}

function renderEvents(events) {
  return `
    <ul class="event-list">
      ${events
        .map(
          (event) => `
            <li class="event-item">
              <div class="event-row">
                <strong>${escapeHtml(event.actor)}</strong>
                <span class="role-pill">${escapeHtml(event.type)}</span>
              </div>
              <span>${escapeHtml(event.action)}</span>
              <span class="metric-note">${event.time}</span>
            </li>
          `
        )
        .join("")}
    </ul>
  `;
}

function option(value, selected) {
  return `<option ${value === selected ? "selected" : ""}>${value}</option>`;
}

function emptyRow(cols) {
  return `<tr><td colspan="${cols}">Nenhum registro encontrado.</td></tr>`;
}

function render() {
  applyShellState();
  renderNav();

  const views = {
    dashboard: renderDashboard,
    clientes: renderClientes,
    usuarios: renderUsuarios,
    financeiro: renderFinanceiro,
    chamados: renderChamados,
    analytics: renderAnalytics,
    auditoria: renderAuditoria,
    configuracoes: renderConfiguracoes,
  };

  app.innerHTML = (views[state.view] || renderDashboard)();
}

function openClientModal() {
  modal.hidden = false;
  overlay.hidden = false;
  form.reset();
  requestAnimationFrame(() => form.elements.company.focus());
}

function closeClientModal() {
  modal.hidden = true;
  overlay.hidden = true;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => toast.classList.remove("show"), 2600);
}

function addEvent(actor, action, type = "Sistema") {
  state.data.events.unshift({
    actor,
    action,
    time: "Agora",
    type,
  });
  state.data.events = state.data.events.slice(0, 12);
}

function cycleClientStatus(id) {
  const order = ["Trial", "Ativo", "Risco", "Pausado"];
  const client = state.data.clients.find((item) => item.id === Number(id));
  if (!client) return;
  const next = order[(order.indexOf(client.status) + 1) % order.length];
  client.status = next;
  if (next === "Risco") client.stage = "Risco";
  if (next === "Ativo" && client.stage === "Risco") client.stage = "Retenção";
  addEvent("Sistema", `alterou status de ${client.company} para ${next}`, "CRM");
  saveState();
  render();
  showToast("Status do cliente atualizado.");
}

function toggleUser(id) {
  const user = state.data.users.find((item) => item.id === Number(id));
  if (!user) return;
  user.status = user.status === "Ativo" ? "Pausado" : "Ativo";
  addEvent("Fernando Orrico", `alterou acesso de ${user.name}`, "Segurança");
  saveState();
  render();
  showToast("Usuário atualizado.");
}

function markInvoicePaid(id) {
  const invoice = state.data.invoices.find((item) => item.id === id);
  if (!invoice) return;
  invoice.status = "Pago";
  addEvent("Ana Martins", `baixou fatura ${invoice.id}`, "Financeiro");
  saveState();
  render();
  showToast("Fatura marcada como paga.");
}

function exportInvoices() {
  const rows = [
    ["id", "cliente", "valor", "vencimento", "status"],
    ...state.data.invoices.map((invoice) => [invoice.id, invoice.client, invoice.amount, invoice.due, invoice.status]),
  ];
  const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "faturas-adminos.csv";
  link.click();
  URL.revokeObjectURL(url);
  showToast("CSV de faturas exportado.");
}

function resetDemo() {
  state = structuredClone(defaultState);
  saveState();
  render();
  showToast("Dados demonstrativos restaurados.");
}

navList.addEventListener("click", (event) => {
  const route = event.target.closest("[data-route]")?.dataset.route;
  if (route) setView(route);
});

app.addEventListener("click", (event) => {
  const route = event.target.closest("[data-route]")?.dataset.route;
  if (route) {
    setView(route);
    return;
  }

  const actionTarget = event.target.closest("[data-action]");
  if (!actionTarget) return;

  const { action, id } = actionTarget.dataset;
  const actions = {
    "open-client-modal": openClientModal,
    "cycle-client": () => cycleClientStatus(id),
    "toggle-user": () => toggleUser(id),
    "mark-invoice-paid": () => markInvoicePaid(id),
    "export-invoices": exportInvoices,
    "reset-demo": resetDemo,
  };

  actions[action]?.();
});

app.addEventListener("change", (event) => {
  const filter = event.target.dataset.filter;
  const setting = event.target.dataset.setting;

  if (filter) {
    state[filter] = event.target.value;
    saveState();
    render();
  }

  if (setting) {
    state.data.settings[setting] = event.target.checked;
    addEvent("Fernando Orrico", `atualizou configuração ${setting}`, "Configuração");
    saveState();
    showToast("Configuração salva.");
  }
});

globalSearch.addEventListener("input", (event) => {
  state.search = event.target.value;
  saveState();
  render();
});

themeToggle.addEventListener("click", () => {
  state.theme = state.theme === "dark" ? "light" : "dark";
  saveState();
  render();
});

densityToggle.addEventListener("click", () => {
  state.compact = !state.compact;
  saveState();
  render();
});

menuToggle.addEventListener("click", () => {
  document.body.classList.toggle("menu-open");
});

newClientButton.addEventListener("click", openClientModal);
overlay.addEventListener("click", closeClientModal);
document.querySelector("#closeClientModal").addEventListener("click", closeClientModal);
document.querySelector("#cancelClientModal").addEventListener("click", closeClientModal);

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const company = String(formData.get("company")).trim();
  const owner = String(formData.get("owner")).trim();

  if (!company || !owner) return;

  const client = {
    id: Date.now(),
    company,
    owner,
    plan: String(formData.get("plan")),
    mrr: Number(formData.get("mrr")),
    status: String(formData.get("status")),
    health: Number(formData.get("health")),
    segment: "Novo negócio",
    stage: "Onboarding",
  };

  state.data.clients.unshift(client);
  addEvent("Fernando Orrico", `criou cliente ${client.company}`, "CRM");
  saveState();
  closeClientModal();
  state.view = "clientes";
  render();
  showToast("Cliente cadastrado.");
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !modal.hidden) closeClientModal();
});

window.addEventListener("hashchange", () => {
  const next = window.location.hash.replace("#", "");
  if (next && next !== state.view) {
    state.view = next;
    saveState();
    render();
  }
});

const initialHash = window.location.hash.replace("#", "");
if (initialHash) state.view = initialHash;

render();
