  const supabaseClient = window.supabase.createClient(
    'https://tkgkrftlwhzibpizhpqt.supabase.co',
     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrZ2tyZnRsd2h6aWJwaXpocHF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5ODY1MzksImV4cCI6MjA5MzU2MjUzOX0.YbSXXMAr3br370uovvUNJ4v82lMS9UB0f752yUJhezE'
  );


  const telefoneInput =
  document.getElementById('telefone');

telefoneInput.addEventListener('input', (e) => {

  let valor = e.target.value;

  // remove tudo que não for número
  valor = valor.replace(/\D/g, '');

  // limita a 11 números
  valor = valor.substring(0, 11);

  // aplica máscara
  valor = valor.replace(
    /^(\d{2})(\d)/g,
    '($1) $2'
  );

  valor = valor.replace(
    /(\d{5})(\d)/,
    '$1-$2'
  );

  e.target.value = valor;
});

// ================= TOAST =================
function showToast(message, success = true) {

  const toast = document.getElementById('toast');

  toast.textContent = message;

  toast.style.background = success
    ? '#2ecc71'
    : '#e74c3c';

  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 2000);
}

// ================= INSERIR =================
async function inserir() {

  const dados = {

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
    

  };

  const { error } = await supabaseClient
    .from('convidados_admin')
    .insert([dados]);

  if (error) {

    console.error(error);

    showToast('Erro ao inserir ❌', false);

    return;
  }

  showToast('Inserido com sucesso!');

  setTimeout(() => {
    window.location.href = 'admin.html';
  }, 2200);
}

// ================= EVENTO =================
document
  .getElementById('btnInserir')
  .addEventListener('click', inserir);