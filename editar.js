  const supabaseClient = window.supabase.createClient(
    'https://tkgkrftlwhzibpizhpqt.supabase.co',
     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrZ2tyZnRsd2h6aWJwaXpocHF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5ODY1MzksImV4cCI6MjA5MzU2MjUzOX0.YbSXXMAr3br370uovvUNJ4v82lMS9UB0f752yUJhezE'
  );

const params = new URLSearchParams(window.location.search);

const id = params.get('id');


function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 2000);
}


// ================= CARREGAR DADOS =================
async function carregarConvidado() {

  console.log("ID recebido:", id);

  const { data, error } = await supabaseClient
    .from('convidados_admin')
    .select('*')
    .eq('id', Number(id))
    .single();

  console.log("DATA:", data);
  console.log("ERRO:", error);

  if (error) {
    console.error(error);
    alert('Erro ao carregar convidado');
    return;
  }

  // 🔥 Preenche campos
  document.getElementById('nome').value = data.nome || '';
  document.getElementById('telefone').value = data.telefone || '';
  document.getElementById('bairro').value = data.bairro || '';
  document.getElementById('cidade').value = data.cidade || '';

  

 if (data.created_at) {

  const dataLocal = new Date(data.created_at);

  // ajusta timezone
  dataLocal.setMinutes(
    dataLocal.getMinutes() - dataLocal.getTimezoneOffset()
  );

  document.getElementById('datacadastro').value =
    dataLocal.toISOString().slice(0,16);

}
  document.getElementById('origem').value = data.origem || '';
  document.getElementById('respcontato').value = data.responsavel || '';
  document.getElementById('status').value = data.status_convidado || '';

  document.getElementById('comentarios').value = data.comentarios || '';

}




// ================= SALVAR =================
async function salvar() {

  const { error } = await supabaseClient
    .from('convidados_admin')
    .update({

      nome: document.getElementById('nome').value,
    telefone: document.getElementById('telefone').value,
    bairro: document.getElementById('bairro').value,
    cidade: document.getElementById('cidade').value, 
    aceita_info: 'Sim', 

    origem: document.getElementById('origem').value,

    status_convidado: document.getElementById('status').value,    

    created_at: new Date(document.getElementById('datacadastro').value).toISOString(),
   
    responsavel: document.getElementById('respcontato').value, 
    
    comentarios: document.getElementById('comentarios').value 

    })
    .eq('id', Number(id));

  if (error) {
    console.error(error);
    showToast('Erro ao salvar ❌');
    return;
  }

  showToast('Salvo com sucesso!');

  setTimeout(() => {
    window.location.href = 'admin.html';
  }, 1000);
}
// ================= EVENTO =================
document
  .getElementById('btnSalvar')
  .addEventListener('click', salvar);

// ================= INIT =================
carregarConvidado();








/*
// ================= CARREGAR DADOS =================
/* async function carregarConvidado() {

  const { data, error } = await supabase
    .from('convidados_admin')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(error);
    alert('Erro ao carregar convidado');
    return;
  } 



  async function carregarConvidado() {

  console.log("ID recebido:", id);

  const { data, error } = await supabase
    .from('convidados_admin')
    .select('*')
    .eq('id', Number(id))
    .single();

  console.log("DATA:", data);
  console.log("ERRO:", error);

  if (error) {
    console.error(error);
    alert('Erro ao carregar convidado');
    return;
  }

  document.getElementById('nome').value = data.nome || '';
}

  // 🔥 Preenche campos
  document.getElementById('nome').value = data.nome || '';
  document.getElementById('telefone').value = data.telefone || '';
  document.getElementById('bairro').value = data.bairro || '';
  document.getElementById('cidade').value = data.cidade || '';

  document.getElementById('origem').value = data.origem || '';
  document.getElementById('idade').value = data.idade || '';
  document.getElementById('estadocivil').value = data.estado_civil || '';
  document.getElementById('filhos').value = data.filhos || '';
  document.getElementById('contatado').value = data.contatado || '';
  document.getElementById('datacontato').value = data.data_contato || '';
  document.getElementById('respcontato').value = data.por_quem || '';
  document.getElementById('recebeulife').value = data.recebeu_life || '';
  document.getElementById('quallife').value = data.qual_life || '';
  document.getElementById('visitoulife').value = data.visitou || '';
  document.getElementById('status').value = data.status_convidado || '';
} 

// ================= SALVAR =================
async function salvar() {

  const { error } = await supabase
    .from('convidados_admin')
    .update({

      nome: document.getElementById('nome').value,
      telefone: document.getElementById('telefone').value,
      origem: document.getElementById('origem').value,
      idade: document.getElementById('idade').value,
      estado_civil: document.getElementById('estadocivil').value,
      filhos: document.getElementById('filhos').value,
      contatado: document.getElementById('contatado').value,
      data_contato: document.getElementById('datacontato').value,
      por_quem: document.getElementById('respcontato').value,
      recebeu_life: document.getElementById('recebeulife').value,
      qual_life: document.getElementById('quallife').value,
      visitou: document.getElementById('visitoulife').value,
      status_convidado: document.getElementById('status').value

    })
    .eq('id', id);

  if (error) {
    console.error(error);
    alert('Erro ao salvar');
    return;
  }

  alert('Salvo com sucesso!');
}  

// ================= EVENTO =================
document
  .getElementById('btnSalvar')
  .addEventListener('click', salvar);

// ================= INIT =================
carregarConvidado();  */