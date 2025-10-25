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
  inputTelefone.addEventListener("input", function(e) {
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
    botoesValor.forEach((btn) => btn.classList.remove("selected"));
    inputValorPersonalizado.value = "";
    valorSelecionado = 0;
    atualizarBotaoConfirmar(); // Atualiza texto do botão ao limpar
  }

  // Função para validar o formulário
  function validarFormulario() {
    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const telefone = document.getElementById("telefone").value;
    const valor = valorSelecionado || Number(inputValorPersonalizado.value);

    if (!nome || !email || !valor || valor <= 0) {
      alert(
        "Por favor, preencha todos os campos obrigatórios e selecione um valor válido."
      );
      return false;
    }

    if (telefone && !validarTelefone(telefone)) {
      alert(
        "Por favor, insira um número de telefone válido no formato (00) 00000-0000"
      );
      return false;
    }

    return true;
  }

  // Eventos para botões de valor
  botoesValor.forEach((botao) => {
    botao.addEventListener("click", function () {
      if (estadoPagamento.processando) return; // Evita mudança durante processamento

      botoesValor.forEach((btn) => btn.classList.remove("selected"));
      inputValorPersonalizado.value = ""; // Limpa input personalizado

      this.classList.add("selected");
      valorSelecionado = Number(this.dataset.amount);
      atualizarBotaoConfirmar(); // Atualiza texto do botão com o novo valor
    });
  });

  // Evento para input de valor personalizado
  inputValorPersonalizado.addEventListener("input", function () {
    if (estadoPagamento.processando) return; // Evita mudança durante processamento

    botoesValor.forEach((btn) => btn.classList.remove("selected"));
    valorSelecionado = Number(this.value);
    atualizarBotaoConfirmar(); // Atualiza texto do botão com o novo valor
  });

  // Eventos para métodos de pagamento
  metodosPagamento.forEach((metodo) => {
    metodo.addEventListener("click", function () {
      if (estadoPagamento.processando) return; // Evita mudança durante processamento

      metodosPagamento.forEach((m) => m.classList.remove("selected"));
      this.classList.add("selected");
      metodoPagamentoAtual = this.dataset.method;

      // Atualiza texto do botão
      atualizarBotaoConfirmar();
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
    botaoConfirmar.textContent = textos[metodoPagamentoAtual];
  }

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
      metodosPagamento.forEach((m) => m.classList.remove("selected"));
      document.querySelector('[data-method="pix"]').classList.add("selected");
      metodoPagamentoAtual = "pix";
      atualizarBotaoConfirmar();
      esconderMensagens(); // Esconde todas as mensagens ao limpar
    });
});
