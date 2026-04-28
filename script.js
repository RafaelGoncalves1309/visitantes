// Aguarda o DOM carregar
document.addEventListener('DOMContentLoaded', function () {

  // Máscara de telefone
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

  // Envio do formulário
  const form = document.getElementById('form');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const checkbox = document.getElementById('aceito');

      const dados = new URLSearchParams();

      dados.append('nome', form.nome.value);
      dados.append('telefone', form.telefone.value);
      dados.append('bairro', form.bairro.value);
      dados.append('cidade', form.cidade.value);

      // 👇 Checkbox
      dados.append('termos', checkbox.checked ? 'sim' : 'não');

      fetch("https://script.google.com/macros/s/AKfycbwpaiyWpFFiG9WZsaorpxieT6_GMrS7jJiMgg4qzxFAcJm2IEjAjQkGd5gRawGUxmhx/exec", {
       
        
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: dados.toString()
      })
      .then(() => {
        window.location.href = "obrigado.html";
      })
      .catch(() => {
        alert("Erro ao enviar. Tente novamente.");
      });

    }); // 👈 FECHA submit
  }

}); // 👈 FECHA DOMContentLoaded

