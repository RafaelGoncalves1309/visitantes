
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
      case 'Novo': return '⚪';
      case 'Em Conversa': return '📞';
      case 'Sem Resposta': return '🔴';
      case 'Sem Interesse no Momento': return '🟨';
      case 'Concluído': return '✅';
      case 'Já tem Life': return '🟢';
      case 'Transição': return '🔵';
      case 'Dados Incorretos': return '❌';
      default: return '❔';
    }
  }




  // =========================================
  // CARREGAR DADOS
  // =========================================
 async function carregarDados() {

  const dataInicio = document.getElementById('dataInicio')?.value;
  const dataFim = document.getElementById('dataFim')?.value;

  let query = supabase
    .from('convidados_admin')
    .select('*')
    .order('created_at', { ascending: false });

  if (dataInicio) {
    query = query.gte('created_at', `${dataInicio}T00:00:00`);
  }

  if (dataFim) {
    query = query.lte('created_at', `${dataFim}T23:59:59`);
  }

  const { data, error } = await query;

  if (error) {
    console.error(error);
    return;
  }

  // 🔥 destrói DataTable se existir
  if ($.fn.DataTable.isDataTable('#tabelaConvidados')) {
    $('#tabelaConvidados').DataTable().clear().destroy();
  }

  // 🔥 recria com dados filtrados
  tabela = $('#tabelaConvidados').DataTable({
    data: data,
    pageLength: 100,
    fixedHeader: true,
    order: [[0, 'desc'], [2, 'asc']],
    language: {
      url: 'https://cdn.datatables.net/plug-ins/1.13.6/i18n/pt-BR.json'
    },
    columns: [
      { data: 'created_at', render: d => new Date(d).toLocaleString('pt-BR') },
      { data: 'origem' },
      { data: 'nome' },
      { data: 'telefone' },
      { data: 'bairro' },
      { data: 'cidade' },
      { data: 'status_convidado' },
      { data: 'responsavel' },
      { data: 'lider' },
      { data: 'comentarios' },
      {
        data: 'id',
        render: id => `<button class="btn-editar" data-id="${id}">Editar</button>`
      }
    ]
  });

  // evento editar
  $('#tabelaConvidados').on('click', '.btn-editar', function () {
    window.location.href = `editar.html?id=${this.dataset.id}`;
  });
}
 // =========================================
  // LIMPAR FILTROS
  // =========================================

function limparFiltros() {
  const btn = document.getElementById('btnLimpar');


  btn.innerText = 'Limpando...';

  document.getElementById('dataInicio').value = '';
  document.getElementById('dataFim').value = '';


  carregarDados().then(() => {
    btn.innerText = 'Limpar Filtros';
  });
}
    // =========================================
    // BOTÃO EDITAR
    // =========================================

    document.querySelectorAll('.btn-editar').forEach(btn => {
      btn.addEventListener('click', function () {
        window.location.href = `editar.html?id=${this.dataset.id}`;
      });
    });

    // =========================================
    // DATATABLE (CORRIGIDO)
    // =========================================

       // destrói se já existir
    if ($.fn.DataTable.isDataTable('#tabelaConvidados')) {
      $('#tabelaConvidados').DataTable().destroy();
    }

    // recria
    tabela = $('#tabelaConvidados').DataTable({
      pageLength: 100,
      fixedHeader: true,
      order: [[0, 'desc'], [2, 'asc']],
      language: {
      url: 'https://cdn.datatables.net/plug-ins/1.13.6/i18n/pt-BR.json'
    }
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
      Data: new Date(item.created_at).toLocaleString('pt-BR'),
      Fonte: item.origem || '',
      Nome: item.nome || '',
      Telefone: item.telefone || '',
      Bairro: item.bairro || '',
      Cidade: item.cidade || '',
      Status: item.status_convidado || '',
      Responsavel: item.responsavel || '',
      Lider: item.lider || '',
      Comentarios: item.comentarios || ''
    }));

    const ws = XLSX.utils.json_to_sheet(dadosFormatados);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, 'Convidados');

    const hoje = new Date().toISOString().slice(0, 10);

    XLSX.writeFile(wb, `convidados_${hoje}.xlsx`);
  }

  // =========================================
  // EVENTOS
  // =========================================

  btnLogout.addEventListener('click', logout);
  btnExportar.addEventListener('click', exportarExcel);
  btnFiltrar.addEventListener('click', carregarDados);
  document.getElementById('btnLimpar').addEventListener('click', limparFiltros);

  // =========================================
  // INIT
  // =========================================

  (async () => {
    await verificarLogin();
    await carregarDados();
  })();

});


