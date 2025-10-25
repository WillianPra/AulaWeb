// === MÁSCARAS AUTOMÁTICAS ===
document.addEventListener("DOMContentLoaded", function () {
  // Função auxiliar para aplicar máscara
  function aplicarMascara(valor, mascara) {
    const apenasNumeros = valor.replace(/\D/g, "");
    let resultado = "";
    let indiceNumero = 0;

    for (
      let i = 0;
      i < mascara.length && indiceNumero < apenasNumeros.length;
      i++
    ) {
      if (mascara[i] === "#") {
        resultado += apenasNumeros[indiceNumero];
        indiceNumero++;
      } else {
        resultado += mascara[i];
      }
    }
    return resultado;
  }

  // Função para validar CPF
  function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, "");
    if (cpf.length !== 11) return false;

    // Verifica CPFs com todos os dígitos iguais
    if (/^(\d)\1{10}$/.test(cpf)) return false;

    // Validação dos dígitos verificadores
    let soma = 0;
    let resto;

    for (let i = 1; i <= 9; i++) {
      soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) {
      soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;

    return true;
  }

  // Elementos do formulário
  const form = document.getElementById("form-cadastro");
  const cpf = document.getElementById("cpf");
  const telefone = document.getElementById("telefone");
  const cep = document.getElementById("cep");
  const msgDiv = document.getElementById("mensagemErro");

  // Máscaras
  if (cpf) {
    cpf.addEventListener("input", (e) => {
      e.target.value = aplicarMascara(e.target.value, "###.###.###-##");
    });
  }

  if (telefone) {
    telefone.addEventListener("input", (e) => {
      e.target.value = aplicarMascara(e.target.value, "(##) #####-####");
    });
  }

  if (cep) {
    cep.addEventListener("input", (e) => {
      e.target.value = aplicarMascara(e.target.value, "#####-###");

      // Se o CEP estiver completo, busca o endereço
      if (e.target.value.replace(/\D/g, "").length === 8) {
        fetch(
          `https://viacep.com.br/ws/${e.target.value.replace(/\D/g, "")}/json/`
        )
          .then((response) => response.json())
          .then((data) => {
            if (!data.erro) {
              document.getElementById("cidade").value = data.localidade || "";
              const estado = document.getElementById("estado");
              if (estado) {
                const opcaoEstado = Array.from(estado.options).find(
                  (option) => option.value === data.uf
                );
                if (opcaoEstado) {
                  estado.value = data.uf;
                }
              }
            }
          })
          .catch((error) => console.error("Erro ao buscar CEP:", error));
      }
    });
  }

  // Validação do formulário
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      let mensagensErro = [];
      const elementos = this.querySelectorAll("input, select, textarea");
      elementos.forEach((el) => el.classList.remove("erro"));

      // Validações específicas
      if (cpf) {
        const cpfValue = cpf.value.replace(/\D/g, "");
        if (!validarCPF(cpfValue)) {
          mensagensErro.push("CPF inválido");
          cpf.classList.add("erro");
        }
      }

      if (telefone && !telefone.value.match(/^\(\d{2}\)\s\d{5}-\d{4}$/)) {
        mensagensErro.push("Telefone inválido");
        telefone.classList.add("erro");
      }

      if (cep && !cep.value.match(/^\d{5}-\d{3}$/)) {
        mensagensErro.push("CEP inválido");
        cep.classList.add("erro");
      }

      // Exibição de mensagens de erro
      if (msgDiv) {
        if (mensagensErro.length > 0) {
          msgDiv.textContent = mensagensErro.join(", ");
          msgDiv.style.display = "block";
        } else {
          msgDiv.textContent = "";
          msgDiv.style.display = "none";
          alert("Cadastro enviado com sucesso!");
          this.reset();
        }
      }
    });
  }
});
