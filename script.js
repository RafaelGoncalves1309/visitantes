// Máscara de telefone
const telefoneInput = document.getElementById('telefone');

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



// Envio do formulario para o Sheets
document.addEventListener('DOMContentLoaded', function () {

  const form = document.getElementById('form');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const dados = new FormData(form);

    fetch("https://script.google.com/macros/s/AKfycbz018OxnFEFqR_dFi0xLW6oiAUG74qXfN5wpivtOG3t-CNIoxfAicKGiQa1b6Mpxuy-UA/exec", {
      method: "POST",
      body: dados
    })
    .then(() => {
      window.location.href = "obrigado.html";
    })
    .catch(() => {
      alert("Erro ao enviar. Tente novamente.");
    });
  });

});