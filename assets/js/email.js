// Inicializa o EmailJS com o ID do usuário
emailjs.init("service_fyvknko");

// Seleciona o formulário e a mensagem de status
const form = document.getElementById("form-contato");
const statusMsg = document.getElementById("status");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  statusMsg.innerHTML = "Enviando mensagem..."; // Feedback inicial

  emailjs
    .sendForm("service_fyvknko", "template_6xpwxbl", form)
    .then(() => {
      statusMsg.style.color = "green";
      statusMsg.innerHTML = "✅ Mensagem enviada com sucesso!";
      form.reset();

      // Remove a mensagem após 5 segundos
      setTimeout(() => {
        statusMsg.innerHTML = "";
      }, 5000);
    })
    .catch((error) => {
      statusMsg.style.color = "red";
      statusMsg.innerHTML = "❌ Erro ao enviar. Tente novamente.";
      console.error("Erro:", error);
    });
});
