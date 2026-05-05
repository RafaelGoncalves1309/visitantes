document.addEventListener('DOMContentLoaded', function () {

  const supabase = window.supabase.createClient(
    'https://tkgkrftlwhzibpizhpqt.supabase.co',
     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrZ2tyZnRsd2h6aWJwaXpocHF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5ODY1MzksImV4cCI6MjA5MzU2MjUzOX0.YbSXXMAr3br370uovvUNJ4v82lMS9UB0f752yUJhezE'
  );

  const tbody = document.getElementById('tbody');
  const btnFiltrar = document.getElementById('btnFiltrar');
  const btnLogout = document.getElementById('btnLogout');

  // 🔐 Proteção
  async function verificarLogin() {
    const { data } = await supabase.auth.getSession();

    if (!data.session) {
      window.location.href = "login.html";
    }
  }

  // 🚪 Logout
  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "login.html";
  }

  // 📊 Buscar dados
  async function carregarDados() {
 
    const dataInicio = document.getElementById('dataInicio').value;
    const dataFim = document.getElementById('dataFim').value;

    let query = supabase
      .from('convidados')
      .select('*')
      .order('created_at', { ascending: false });

    if (dataInicio) {
    query = query.gte('created_at', dataInicio + 'T00:00:00');
    }

    if (dataFim) {
    query = query.lte('created_at', dataFim + 'T23:59:59');
    }

    const { data, error } = await query;

    if (error) {
      console.error(error);
      return;
    }

    tbody.innerHTML = '';

    data.forEach(item => {
      const tr = document.createElement('tr');

      tr.innerHTML = `
        <td>${item.nome || ''}</td>
        <td>${item.telefone || ''}</td>
        <td>${item.bairro || ''}</td>
        <td>${item.cidade || ''}</td>
        <td>${item.aceita_info || ''}</td>
        <td>${new Date(item.created_at).toLocaleString()}</td>
      `;

      tbody.appendChild(tr);
    });
  }


  const btnExportar = document.getElementById('btnExportar');

btnExportar.addEventListener('click', exportarExcel);

async function exportarExcel() {

  const dataInicio = document.getElementById('dataInicio').value;
  const dataFim = document.getElementById('dataFim').value;
  const busca = document.getElementById('busca')?.value || '';

  let query = supabase
    .from('convidados')
    .select('*')
    .order('created_at', { ascending: false });

  if (dataInicio) {
    query = query.gte('created_at', dataInicio + 'T00:00:00');
  }

  if (dataFim) {
    query = query.lte('created_at', dataFim + 'T23:59:59');
  }

  if (busca) {
    query = query.or(`nome.ilike.%${busca}%,telefone.ilike.%${busca}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error(error);
    alert('Erro ao exportar');
    return;
  }

  // 📊 transforma dados
const dadosFormatados = data.map(item => ({
  Data: new Date(item.created_at).toLocaleString(),
  Nome: item.nome || '',
  Telefone: item.telefone || '',
  Bairro: item.bairro || '',
  Cidade: item.cidade || '',
  "Aceita Info": item.aceita_info || ''
}));

  // 📁 cria planilha
  const ws = XLSX.utils.json_to_sheet(dadosFormatados);
  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, ws, "Convidados");

  // 📥 download
  XLSX.writeFile(wb, "convidados.xlsx");
}

  // 🎯 Eventos
  btnFiltrar.addEventListener('click', carregarDados);
  btnLogout.addEventListener('click', logout);

  // 🚀 Init
  verificarLogin();
  carregarDados();


  document.getElementById('btnExportar').addEventListener('click', exportarExcel);
});