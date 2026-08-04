
// =========================================
// GLOBAL
// =========================================

let tabela;
//let supabase;

// =========================================
// INIT
// =========================================


document.addEventListener('DOMContentLoaded', function () {

  // =========================================
  // SUPABASE
  // =========================================



  const supabase = window.supabase.createClient(
    'https://tkgkrftlwhzibpizhpqt.supabase.co',
     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrZ2tyZnRsd2h6aWJwaXpocHF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5ODY1MzksImV4cCI6MjA5MzU2MjUzOX0.YbSXXMAr3br370uovvUNJ4v82lMS9UB0f752yUJhezE'
  );



  // =========================================
  // ELEMENTOS
  // =========================================

  const btnLogout = document.getElementById('btnLogout');
  const btnExportar = document.getElementById('btnExportar');
  const btnFiltrar = document.getElementById('btnFiltrar');
  const btnLimpar = document.getElementById('btnLimpar');

  const buscaGlobal = document.getElementById('buscaGlobal');

  // =========================================
  // LOGIN
  // =========================================

  async function verificarLogin() {

    const { data } = await supabase.auth.getSession();

    if (!data.session) {
      window.location.href = 'login.html';
    }

  }

  // =========================================
  // LOGOUT
  // =========================================

  async function logout() {

    await supabase.auth.signOut();

    window.location.href = 'login.html';

  }

  // =========================================
  // STATUS ICON
  // =========================================

  function getStatusIcon(status) {

    switch (status) {

      case 'Novo':
        return '⚪';

      case 'Em Conversa':
        return '📞';

      case 'Sem Resposta':
        return '🔴';

      case 'Sem Interesse no Momento':
        return '🟨';

      case 'Concluído':
        return '✅';

      case 'Já tem Life':
        return '🟢';

      case 'Transição':
        return '🔵';

      case 'Dados Incorretos':
        return '❌';

      default:
        return '❔';

    }

  }

  // =========================================
  // STATUS CLASS
  // =========================================

  function getStatusClass(status) {

    switch (status) {

      case 'Novo':
        return 'status-novo';

      case 'Em Conversa':
        return 'status-conversa';

      case 'Concluído':
        return 'status-ok';

      case 'Sem Resposta':
        return 'status-semresposta';

      default:
        return 'status-default';

    }

  }

  // =========================================
  // ATUALIZAR CARDS
  // =========================================

  function atualizarCards(data) {

    document.getElementById('cardTotal').innerText = data.length;

    document.getElementById('cardConversa').innerText =
      data.filter(item => item.status_convidado === 'Em Conversa').length;

    document.getElementById('cardConcluidos').innerText =
      data.filter(item => item.status_convidado === 'Concluído').length;

    document.getElementById('cardSemResposta').innerText =
      data.filter(item => item.status_convidado === 'Sem Resposta').length;

  }

  // =========================================
  // CARREGAR DADOS
  // =========================================

  async function carregarDados() {

    btnFiltrar.innerText = 'Carregando...';

    // filtros

    const dataInicio = document.getElementById('dataInicio').value;
    const dataFim = document.getElementById('dataFim').value;

    const filtroStatus =
      document.getElementById('filtroStatus').value;

    const filtroCidade =
      document.getElementById('filtroCidade').value;

    const filtroResponsavel =
      document.getElementById('filtroResponsavel').value;

    // query

    let query = supabase
      .from('convidados_admin')
      .select('*')
      .order('created_at', { ascending: false });

    // filtros backend

    if (dataInicio) {
      query = query.gte(
        'created_at',
        `${dataInicio}T00:00:00`
      );
    }

    if (dataFim) {
      query = query.lte(
        'created_at',
        `${dataFim}T23:59:59`
      );
    }

    if (filtroStatus) {
      query = query.eq(
        'status_convidado',
        filtroStatus
      );
    }

    if (filtroCidade) {
      query = query.ilike(
        'cidade',
        `%${filtroCidade}%`
      );
    }

    if (filtroResponsavel) {
      query = query.ilike(
        'responsavel',
        `%${filtroResponsavel}%`
      );
    }

    // executa

    const { data, error } = await query;

    btnFiltrar.innerText = '🔎 Filtrar';

    if (error) {

      console.error(error);

      alert('Erro ao carregar dados');

      return;

    }

    // atualiza cards

    atualizarCards(data);

    // destrói tabela antiga

    if ($.fn.DataTable.isDataTable('#tabelaConvidados')) {

      $('#tabelaConvidados')
        .DataTable()
        .clear()
        .destroy();

    }

    // recria tabela

    tabela = $('#tabelaConvidados').DataTable({

      data: data,

      responsive: true,

      scrollX: true,

      fixedHeader: true,

      stateSave: true,

      pageLength: 100,

      order: [[0, 'desc']],

      language: {
        url:
          'https://cdn.datatables.net/plug-ins/1.13.6/i18n/pt-BR.json'
      },

      columns: [

        {
          data: 'id'
        },

        {
          data: 'created_at',

          render: function (data) {

            return new Date(data)
              .toLocaleString('pt-BR');

          }

        },

        {
          data: 'origem'
        },

        {
          data: 'nome'
        },

        {
          data: 'telefone'
        },

        {
          data: 'bairro'
        },

        {
          data: 'cidade'
        },

        {
          data: 'status_convidado',

          render: function (data) {

            return `
              <span class="status ${getStatusClass(data)}">
                ${getStatusIcon(data)} ${data || ''}
              </span>
            `;

          }

        },

        {
          data: 'responsavel'
        },

        {
          data: 'lider'
        },

        {
          data: 'comentarios',

          render: function (data) {

            return `
              <div class="comentario">
                ${data || ''}
              </div>
            `;

          }

        },

        {
          data: 'id',

          render: function (id) {

            return `
              <button
                class="btn-editar"
                data-id="${id}"
              >
                ✏️ Editar
              </button>
            `;

          }

        }

      ]

    });

  }

  // =========================================
  // LIMPAR FILTROS
  // =========================================

  async function limparFiltros() {

    btnLimpar.innerText = 'Limpando...';

    document.getElementById('dataInicio').value = '';
    document.getElementById('dataFim').value = '';

    document.getElementById('filtroStatus').value = '';
    document.getElementById('filtroCidade').value = '';
    document.getElementById('filtroResponsavel').value = '';

    buscaGlobal.value = '';

    await carregarDados();

    btnLimpar.innerText = '🧹 Limpar';

  }

  // =========================================
  // EVENTO EDITAR
  // =========================================

  $('#tabelaConvidados').on(
    'click',
    '.btn-editar',
    function () {

      const id = this.dataset.id;

      window.location.href =
        `editar.html?id=${id}`;

    }
  );

  // =========================================
  // BUSCA GLOBAL
  // =========================================

  buscaGlobal.addEventListener('keyup', function () {

    tabela.search(this.value).draw();

  });

  // =========================================
  // EXPORTAR EXCEL
  // =========================================

  async function exportarExcel() {

    const { data, error } = await supabase
      .from('convidados_admin')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {

      console.error(error);

      alert('Erro ao exportar');

      return;

    }

    const dadosFormatados = data.map(item => ({

      Data:
        new Date(item.created_at)
          .toLocaleString('pt-BR'),

      Fonte:
        item.origem || '',

      Nome:
        item.nome || '',

      Telefone:
        item.telefone || '',

      Bairro:
        item.bairro || '',

      Cidade:
        item.cidade || '',

      Status:
        item.status_convidado || '',

      Responsavel:
        item.responsavel || '',

      Lider:
        item.lider || '',

      Comentarios:
        item.comentarios || ''

    }));

    const ws =
      XLSX.utils.json_to_sheet(dadosFormatados);

    const wb =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      wb,
      ws,
      'Convidados'
    );

    const hoje =
      new Date()
        .toISOString()
        .slice(0, 10);

    XLSX.writeFile(
      wb,
      `convidados_${hoje}.xlsx`
    );

  }

  // =========================================
  // EVENTOS
  // =========================================

  btnLogout.addEventListener(
    'click',
    logout
  );

  btnExportar.addEventListener(
    'click',
    exportarExcel
  );

  btnFiltrar.addEventListener(
    'click',
    carregarDados
  );

  btnLimpar.addEventListener(
    'click',
    limparFiltros
  );

  // =========================================
  // INIT
  // =========================================

  (async function () {

    await verificarLogin();

    await carregarDados();

  })();

})

