
// ================= SUPABASE =================

const supabaseClient = window.supabase.createClient(
    'https://tkgkrftlwhzibpizhpqt.supabase.co',
     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrZ2tyZnRsd2h6aWJwaXpocHF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5ODY1MzksImV4cCI6MjA5MzU2MjUzOX0.YbSXXMAr3br370uovvUNJ4v82lMS9UB0f752yUJhezE'
);


// ================= CARREGAR RELATÓRIOS =================
async function carregarRelatorios() {

  const { data, error } = await supabaseClient
    .from('convidados_admin')
    .select('*');

  if (error) {
    console.error(error);
    return;
  }


  // ================= CARDS =================

  document.getElementById('totalConvidados').textContent =
    data.length;


  const concluidos = data.filter(item =>
    item.status_convidado === 'Concluído'
  ).length;


  document.getElementById('totalConcluidos').textContent =
    concluidos;


  const semResposta = data.filter(item =>
    item.status_convidado === 'Sem Resposta'
  ).length;


  document.getElementById('totalSemResposta').textContent =
    semResposta;


  const dadosIncorretos = data.filter(item =>
    item.status_convidado === 'Dados Incorretos'
  ).length;


  document.getElementById('totalDadosIncorretos').textContent =
    dadosIncorretos;


  // ================= STATUS =================

  const statusMap = {};

  data.forEach(item => {

    const status = item.status_convidado || 'Sem Status';

    statusMap[status] =
      (statusMap[status] || 0) + 1;
  });


  const relatorioStatus =
    document.getElementById('relatorioStatus');


  Object.entries(statusMap).forEach(([status, total]) => {

    relatorioStatus.innerHTML += `
      <div class="item-relatorio">
        <span>${status}</span>
        <strong>${total}</strong>
      </div>
    `;
  });


  // ================= ORIGEM =================

  const origemMap = {};

  data.forEach(item => {

    const origem = item.origem || 'Sem Origem';

    origemMap[origem] =
      (origemMap[origem] || 0) + 1;
  });


  const relatorioOrigem =
    document.getElementById('relatorioOrigem');


  Object.entries(origemMap).forEach(([origem, total]) => {

    relatorioOrigem.innerHTML += `
      <div class="item-relatorio">
        <span>${origem}</span>
        <strong>${total}</strong>
      </div>
    `;
  });


  // ================= CIDADES =================

  const cidadeMap = {};

  data.forEach(item => {

    const cidade = item.cidade || 'Sem Cidade';

    cidadeMap[cidade] =
      (cidadeMap[cidade] || 0) + 1;
  });


  const relatorioCidade =
    document.getElementById('relatorioCidade');


  Object.entries(cidadeMap).forEach(([cidade, total]) => {

    relatorioCidade.innerHTML += `
      <div class="item-relatorio">
        <span>${cidade}</span>
        <strong>${total}</strong>
      </div>
    `;
  });


  // ================= TABELA =================

  const tbody =
    document.getElementById('tabelaRelatorio');


  data
    .slice(0, 10)
    .forEach(item => {

      const tr = document.createElement('tr');

      tr.innerHTML = `
        <td>${item.nome || ''}</td>
        <td>${item.cidade || ''}</td>
        <td>${item.origem || ''}</td>
        <td>${item.status_convidado || ''}</td>
      `;

      tbody.appendChild(tr);
    });
}


// ================= INIT =================
carregarRelatorios();