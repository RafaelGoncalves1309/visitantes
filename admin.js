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


  async function abrirEdicao(item) {

  const novaOrigem = prompt(
    "Origem:",
    item.origem || ''
  );

  if (novaOrigem === null) return;

  const { error } = await supabase
    .from('convidados_admin')
    .update({
      origem: novaOrigem
    })
    .eq('id', item.id);

  if (error) {
    console.error(error);
    alert('Erro ao atualizar');
    return;
  }

  alert('Atualizado com sucesso');

  carregarDados();
}

  // 🚪 Logout
  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "login.html";
  }




  function getStatusIcon(status) {

  switch(status) {

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

    case 'Transição':
      return '🔵';

    case 'Dados Incorretos':
      return '❌';

    default:
      return '❔';
  }
}

  
  // 📊 Buscar dados  <td>${item.status_convidado || ''}</td>
  async function carregarDados() {
 
    const dataInicio = document.getElementById('dataInicio').value;
    const dataFim = document.getElementById('dataFim').value;

    let query = supabase
      .from('convidados_admin')
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
        <td>${new Date(item.created_at).toLocaleString()}</td>
        <td>${item.origem || ''}</td>
        <td>${item.nome || ''}</td>
        <td>${item.telefone || ''}</td>
        <td>${item.bairro || ''}</td>
        <td>${item.cidade || ''}</td>        
        <td>${getStatusIcon(item.status_convidado)}
            ${item.status_convidado || ''}
        </td>
        <td>${item.responsavel || ''}</td> 
         <td>${item.lider || ''}</td> 
        <td>${item.comentarios || ''}</td> 
        <td>
            <button class="btn-editar" data-id="${item.id}">
                Editar
            </button>
        </td>
      `;

      tbody.appendChild(tr);

      const btnEditar = tr.querySelector('.btn-editar');
      btnEditar.addEventListener('click', () => {
      window.location.href = `editar.html?id=${item.id}`;
       
      });      
    
    });
  }


const btnExportar = document.getElementById('btnExportar');

btnExportar.addEventListener('click', exportarExcel);

async function exportarExcel() {

  const dataInicio = document.getElementById('dataInicio').value;
  const dataFim = document.getElementById('dataFim').value;
  const busca = document.getElementById('busca')?.value || '';

  let query = supabase
    .from('convidados_admin')
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
  Origem: item.origem || '', 
  Nome: item.nome || '',  
  Telefone: item.telefone || '',
  Bairro: item.bairro || '',
  Cidade: item.cidade || '', 
  Status: item.status_convidado || '',   
  Responsavel: item.responsavel || '',
  "Lider-Life": item.lider || '',
  Comentarios: item.comentarios || '',
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

