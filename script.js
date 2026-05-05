// Aguarda o DOM carregar
document.addEventListener('DOMContentLoaded', function () {

  // 🔗 Conexão com Supabase
  const supabase = window.supabase.createClient(
    'https://tkgkrftlwhzibpizhpqt.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrZ2tyZnRsd2h6aWJwaXpocHF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5ODY1MzksImV4cCI6MjA5MzU2MjUzOX0.YbSXXMAr3br370uovvUNJ4v82lMS9UB0f752yUJhezE'
  );

  // 📱 Máscara de telefone
  const telefoneInput = document.getElementById('telefone');

  if (telefoneInput) {
    telefoneInput.addEventListener('input', function (e) {
      let valor = e.target.value.replace(/\D/g, '');

      if (valor.length > 11) valor = valor.slice(0, 11);

      if (valor.length > 6) {
        valor = valor.replace(/(\d{2})(\d{5})(\d+)/, '($1) $2-$3');
      } else if (valor.length > 2) {
        valor = valor.replace(/(\d{2})(\d+)/, '($1) $2');
      } else {
        valor = valor.replace(/(\d*)/, '($1');
      }

      e.target.value = valor;
    });
  }

  // 📤 Envio do formulário
  const form = document.getElementById('form');

  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      const checkbox = document.getElementById('aceito');

      const dados = {
        nome: form.nome.value,
        telefone: form.telefone.value,
        bairro: form.bairro.value,
        cidade: form.cidade.value,
        aceita_info: checkbox.checked ? 'sim' : 'não'
      };

      // 🚀 envia para o Supabase
      const { error } = await supabase
        .from('convidados')
        .insert([dados]);

      if (error) {
        console.error('Erro ao salvar:', error);
        alert('Erro ao enviar. Tente novamente.');
        return;
      }

      // ✅ redireciona
      window.location.href = "obrigado.html";
    });
  }

});