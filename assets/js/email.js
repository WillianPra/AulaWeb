// Inicializa o EmailJS com o User ID (Public Key)
// IMPORTANTE: Substitua "YOUR_PUBLIC_KEY" pela sua chave pública do EmailJS
emailjs.init("YOUR_PUBLIC_KEY");

// Seleciona o formulário, botão de envio e mensagem de status
const form = document.getElementById("form-contato");
const statusMsg = document.getElementById("status");
const submitBtn = form.querySelector('button[type="submit"]');

form.addEventListener("submit", function (e) {
  e.preventDefault();

  // Validação básica
  if (!form.checkValidity()) {
    statusMsg.style.color = "orange";
    statusMsg.innerHTML =
      "⚠️ Por favor, preencha todos os campos obrigatórios.";
    return;
  }

  // Desabilita o botão e mostra feedback
  submitBtn.disabled = true;
  submitBtn.textContent = "Enviando...";
  statusMsg.style.color = "#0077b6";
  statusMsg.innerHTML = "📤 Enviando mensagem...";

  // Envia o formulário via EmailJS
  // IMPORTANTE: Substitua os IDs pelo seu Service ID e Template ID
  emailjs
    .sendForm("service_fyvknko", "template_6xpwxbl", form)
    .then(() => {
      statusMsg.style.color = "green";
      statusMsg.innerHTML =
        "✅ Mensagem enviada com sucesso! Entraremos em contato em breve.";
      form.reset();

      // Remove a mensagem após 7 segundos
      setTimeout(() => {
        statusMsg.innerHTML = "";
      }, 7000);
    })
    .catch((error) => {
      statusMsg.style.color = "red";
      statusMsg.innerHTML =
        "❌ Erro ao enviar a mensagem. Por favor, tente novamente mais tarde.";

      // Log do erro apenas para debug (remova em produção)
      if (typeof console !== "undefined") {
        console.error("Erro EmailJS:", error);
      }
    })
    .finally(() => {
      // Reabilita o botão
      submitBtn.disabled = false;
      submitBtn.textContent = "Enviar Mensagem";
    });
});
