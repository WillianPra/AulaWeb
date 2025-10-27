document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".hamburger-menu");
  const navLinks = document.querySelector(".menu");
  const menuItems = document.querySelectorAll(".menu a");
  const body = document.body;

  // Criar overlay
  const overlay = document.createElement("div");
  overlay.className = "menu-overlay";
  document.body.appendChild(overlay);

  // Adicionar estilos do overlay dinamicamente
  const style = document.createElement("style");
  style.textContent = `
    .menu-overlay {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 999;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    .menu-overlay.active {
      display: block;
      opacity: 1;
    }
    body.menu-open {
      overflow: hidden;
    }
  `;
  document.head.appendChild(style);

  // Função para fechar o menu
  const closeMenu = () => {
    navLinks.classList.remove("active");
    hamburger.classList.remove("active");
    hamburger.setAttribute("aria-expanded", "false");
    overlay.classList.remove("active");
    body.classList.remove("menu-open");
  };

  if (hamburger && navLinks) {
    // Toggle do menu hamburguer
    hamburger.addEventListener("click", (e) => {
      e.stopPropagation();
      navLinks.classList.toggle("active");
      hamburger.classList.toggle("active");
      overlay.classList.toggle("active");
      body.classList.toggle("menu-open");
      const isExpanded = hamburger.getAttribute("aria-expanded") === "true";
      hamburger.setAttribute("aria-expanded", !isExpanded);
    });

    // Fechar menu ao clicar em um link
    menuItems.forEach((item) => {
      item.addEventListener("click", (e) => {
        // Pequeno delay para permitir a animação antes de navegar
        const href = item.getAttribute("href");
        e.preventDefault();
        closeMenu();
        setTimeout(() => {
          window.location.href = href;
        }, 300);
      });
    });

    // Fechar menu ao clicar fora
    document.addEventListener("click", (e) => {
      if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
        closeMenu();
      }
    });

    // Fechar menu ao redimensionar a janela para desktop
    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) {
        closeMenu();
      }
    });
  }
  const telefoneInput = document.getElementById("telefone");

  telefoneInput.addEventListener("input", function () {
    let valor = this.value.replace(/\D/g, ""); // Remove tudo que não é número

    if (valor.length > 11) valor = valor.slice(0, 11); // Limita a 11 dígitos

    if (valor.length <= 10) {
      // Formato para telefones fixos (xx) xxxx-xxxx
      valor = valor.replace(/^(\d{2})(\d)/, "($1) $2");
      valor = valor.replace(/(\d{4})(\d{1,4})$/, "$1-$2");
    } else {
      // Formato para celulares (xx) xxxxx-xxxx
      valor = valor.replace(/^(\d{2})(\d)/, "($1) $2");
      valor = valor.replace(/(\d{5})(\d{1,4})$/, "$1-$2");
    }

    this.value = valor;
  });
});
