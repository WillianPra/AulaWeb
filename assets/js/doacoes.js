document.addEventListener("DOMContentLoaded", function () {
  // Elementos do DOM
  const formDoacao = document.getElementById("form-doacao");
  const botoesValor = document.querySelectorAll(".btn-valor");
  const inputValorPersonalizado = document.getElementById("customAmount");
  const metodosPagamento = document.querySelectorAll(".method");
  const botaoConfirmar = document.getElementById("botaoPix");

  // Variável para controlar estado do pagamento
  const estadoPagamento = {
    mensagem: "",
    processando: false,
  };

  let valorSelecionado = 0;
  let metodoPagamentoAtual = "pix";

  // Máscara para o telefone
  const inputTelefone = document.getElementById("telefone");

  function aplicarMascaraTelefone(telefone) {
    // Remove tudo que não é número
    let valor = telefone.replace(/\D/g, "");

    // Limita a 11 dígitos
    valor = valor.substring(0, 11);

    // Aplica a máscara
    if (valor.length > 0) {
      valor = "(" + valor;
      if (valor.length > 3) {
        valor = valor.substring(0, 3) + ") " + valor.substring(3);
      }
      if (valor.length > 10) {
        valor = valor.substring(0, 10) + "-" + valor.substring(10);
      }
    }

    return valor;
  }

  // Validação do telefone
  function validarTelefone(telefone) {
    // Se o campo estiver vazio, retorna true pois é opcional
    if (!telefone) return true;

    // Remove todos os caracteres não numéricos
    const numeroLimpo = telefone.replace(/\D/g, "");

    // Verifica se tem 10 ou 11 dígitos (com ou sem 9)
    return numeroLimpo.length === 10 || numeroLimpo.length === 11;
  }

  // Evento para aplicar máscara no telefone
  inputTelefone.addEventListener("input", function (e) {
    let cursorPos = this.selectionStart;
    const valorAntes = this.value;
    const valorDepois = aplicarMascaraTelefone(this.value);

    this.value = valorDepois;

    // Mantém o cursor na posição correta
    if (valorDepois.length > valorAntes.length) {
      cursorPos++;
    }
    this.selectionEnd = cursorPos;
  });

  // Formatação de moeda
  function formatarMoeda(valor) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  }

  // Função para limpar seleção de valores
  function limparSelecaoValores() {
    botoesValor.forEach((btn) => {
      btn.classList.remove("selected");
      btn.setAttribute("aria-pressed", "false");
    });
    inputValorPersonalizado.value = "";
    valorSelecionado = 0;
    atualizarBotaoConfirmar();
    atualizarResumo();
  }

  // Função para validar o formulário
  function validarFormulario() {
    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const telefone = document.getElementById("telefone").value;
    const valor = valorSelecionado || Number(inputValorPersonalizado.value);
    const mensagemErro = document.getElementById("mensagemErro");

    // Limpa mensagem de erro anterior
    mensagemErro.textContent = "";
    mensagemErro.style.display = "none";

    if (!nome || !email || !valor || valor <= 0) {
      mensagemErro.textContent =
        "Por favor, preencha todos os campos obrigatórios e selecione um valor válido.";
      mensagemErro.style.display = "block";
      mensagemErro.focus(); // Foca na mensagem de erro
      return false;
    }

    if (telefone && !validarTelefone(telefone)) {
      mensagemErro.textContent =
        "Por favor, insira um número de telefone válido no formato (00) 00000-0000";
      mensagemErro.style.display = "block";
      mensagemErro.focus(); // Foca na mensagem de erro
      return false;
    }

    return true;
  }

  // Eventos para botões de valor
  botoesValor.forEach((botao) => {
    botao.addEventListener("click", function () {
      if (estadoPagamento.processando) return;

      // Remove seleção dos outros botões
      botoesValor.forEach((btn) => {
        btn.classList.remove("selected");
        btn.setAttribute("aria-pressed", "false");
      });

      inputValorPersonalizado.value = "";

      // Seleciona este botão
      this.classList.add("selected");
      this.setAttribute("aria-pressed", "true");
      valorSelecionado = Number(this.dataset.amount);

      atualizarBotaoConfirmar();
      atualizarResumo();
    });
  });

  // Evento para input de valor personalizado
  inputValorPersonalizado.addEventListener("input", function () {
    if (estadoPagamento.processando) return;

    botoesValor.forEach((btn) => {
      btn.classList.remove("selected");
      btn.setAttribute("aria-pressed", "false");
    });

    valorSelecionado = Number(this.value);
    atualizarBotaoConfirmar();
    atualizarResumo();
  });

  // Eventos para métodos de pagamento
  metodosPagamento.forEach((metodo) => {
    // Suporte a clique
    metodo.addEventListener("click", function () {
      if (estadoPagamento.processando) return;

      metodosPagamento.forEach((m) => {
        m.classList.remove("selected");
        m.setAttribute("aria-checked", "false");
      });

      this.classList.add("selected");
      this.setAttribute("aria-checked", "true");
      metodoPagamentoAtual = this.dataset.method;

      atualizarBotaoConfirmar();
      atualizarResumo();
    });

    // Suporte a teclado (Enter e Space)
    metodo.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.click();
      }
    });
  });

  // Função para atualizar texto do botão
  function atualizarBotaoConfirmar() {
    const textos = {
      pix: `Pagar com PIX ${
        valorSelecionado ? formatarMoeda(valorSelecionado) : ""
      }`,
      cartao: `Pagar com Cartão ${
        valorSelecionado ? formatarMoeda(valorSelecionado) : ""
      }`,
      boleto: `Gerar Boleto ${
        valorSelecionado ? formatarMoeda(valorSelecionado) : ""
      }`,
    };
    botaoConfirmar.innerHTML = `<i class="fas fa-heart" aria-hidden="true"></i> ${textos[metodoPagamentoAtual]}`;
  }

  // Função para atualizar o resumo
  function atualizarResumo() {
    const nome = document.getElementById("nome").value;
    const valor = valorSelecionado || Number(inputValorPersonalizado.value);

    document.getElementById("sumNome").textContent = nome || "—";
    document.getElementById("sumValor").textContent =
      valor > 0 ? formatarMoeda(valor) : "—";

    const metodoNomes = {
      pix: "PIX",
      cartao: "Cartão de Crédito",
      boleto: "Boleto Bancário",
    };
    document.getElementById("sumMetodo").textContent =
      metodoNomes[metodoPagamentoAtual];
  }

  // Atualiza resumo quando nome muda
  document.getElementById("nome").addEventListener("input", atualizarResumo);

  // Função para esconder todas as mensagens
  function esconderMensagens() {
    document.getElementById("mensagemPix").style.display = "none";
    document.getElementById("mensagemBoleto").style.display = "none";
    document.getElementById("mensagemCartao").style.display = "none";
  }

  // Inicializar escondendo todas as mensagens
  esconderMensagens();

  // Evento de clique no botão confirmar
  botaoConfirmar.addEventListener("click", function (e) {
    e.preventDefault();

    if (!validarFormulario()) return;

    // Esconder mensagens anteriores
    esconderMensagens();

    // Simular processamento
    estadoPagamento.processando = true;
    botaoConfirmar.disabled = true;
    botaoConfirmar.textContent = "Processando...";

    setTimeout(() => {
      // Mostrar mensagem apropriada
      const elementoMensagem = document.getElementById(
        `mensagem${
          metodoPagamentoAtual.charAt(0).toUpperCase() +
          metodoPagamentoAtual.slice(1)
        }`
      );
      if (elementoMensagem) {
        elementoMensagem.style.display = "block";
      }

      estadoPagamento.processando = false;
      botaoConfirmar.disabled = false;
      atualizarBotaoConfirmar();

      // Esconder mensagem após 5 segundos
      setTimeout(() => {
        esconderMensagens();
      }, 5000);
    }, 2000);
  });

  // Evento para limpar formulário
  document
    .querySelector('button[type="reset"]')
    .addEventListener("click", function () {
      limparSelecaoValores();

      metodosPagamento.forEach((m) => {
        m.classList.remove("selected");
        m.setAttribute("aria-checked", "false");
      });

      const pixMetodo = document.querySelector('[data-method="pix"]');
      pixMetodo.classList.add("selected");
      pixMetodo.setAttribute("aria-checked", "true");

      metodoPagamentoAtual = "pix";
      atualizarBotaoConfirmar();
      atualizarResumo();
      esconderMensagens();

      // Limpa mensagem de erro
      const mensagemErro = document.getElementById("mensagemErro");
      mensagemErro.textContent = "";
      mensagemErro.style.display = "none";
    });
});
