document.addEventListener('DOMContentLoaded', function () {

  // 🔗 Conexão com Supabase
  const supabase = window.supabase.createClient(
    'https://tkgkrftlwhzibpizhpqt.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrZ2tyZnRsd2h6aWJwaXpocHF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5ODY1MzksImV4cCI6MjA5MzU2MjUzOX0.YbSXXMAr3br370uovvUNJ4v82lMS9UB0f752yUJhezE'
  );

  // 🚀 Função de login
  async function login() {
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    if (!email || !senha) {
      alert('Preencha email e senha');
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: senha
    });

    if (error) {
      console.error('Erro no login:', error);
      alert(error.message);
     // alert('Email ou senha inválidos');
      return;
    }

    window.location.href = "admin.html";
  }

  // 🔐 Verifica sessão
  async function verificarSessao() {
    const { data } = await supabase.auth.getSession();

    if (data.session) {
      window.location.href = "admin.html";
    }
  }

  // 👇 AGORA sim o form existe
  document.getElementById('formLogin').addEventListener('submit', function(e) {
    e.preventDefault();
    login();
  });

  verificarSessao();

});