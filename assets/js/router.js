class Router {
  constructor(routes) {
    this.routes = routes;
    this.mainContent = document.getElementById("main-content");
    this.init();
  }

  init() {
    // Lidar com o carregamento inicial
    window.addEventListener("load", () => {
      this.handleRoute(window.location.pathname);
    });

    // Lidar com mudanças no histórico (botões voltar/avançar)
    window.addEventListener("popstate", () => {
      this.handleRoute(window.location.pathname);
    });

    // Interceptar cliques em links
    document.addEventListener("click", (e) => {
      const link = e.target.closest("a");
      if (link && link.href.includes(window.location.origin)) {
        e.preventDefault();
        const path = link.pathname;
        this.navigate(path);
      }
    });
  }

  async handleRoute(path) {
    // Remover extensão .html da path se existir
    path = path.replace(".html", "");
    // Se for a raiz, usar 'index'
    path = path === "/" ? "/index" : path;

    // Remover a classe 'active' de todos os links do menu
    document.querySelectorAll(".menu a").forEach((link) => {
      link.classList.remove("active");
    });

    // Adicionar a classe 'active' ao link atual
    const currentLink = document.querySelector(`.menu a[href="${path}.html"]`);
    if (currentLink) {
      currentLink.classList.add("active");
    }

    try {
      // Adicionar animação de fade-out
      if (this.mainContent) {
        this.mainContent.classList.add("fade-out");
        await new Promise((resolve) => setTimeout(resolve, 300)); // Esperar a animação
      }

      const response = await fetch(`${path}.html`);
      if (!response.ok) throw new Error("Página não encontrada");

      const html = await response.text();
      const temp = document.createElement("div");
      temp.innerHTML = html;

      // Extrair o conteúdo principal
      const newContent = temp.querySelector("main").innerHTML;

      if (this.mainContent) {
        this.mainContent.innerHTML = newContent;
        this.mainContent.classList.remove("fade-out");
        this.mainContent.classList.add("fade-in");

        // Foco para acessibilidade
        const newTitle = this.mainContent.querySelector("h1, h2, h3");
        if (newTitle) {
          newTitle.setAttribute("tabindex", "-1");
          newTitle.focus();
        } else {
          this.mainContent.setAttribute("tabindex", "-1");
          this.mainContent.focus();
        }

        setTimeout(() => {
          this.mainContent.classList.remove("fade-in");
        }, 300);
      }

      const title = temp.querySelector("title");
      if (title) {
        document.title = title.textContent;
      }

      this.loadPageScripts(temp);
    } catch (error) {
      console.error("Erro ao carregar a página:", error);
      if (this.mainContent) {
        this.mainContent.innerHTML = "<h1>Página não encontrada</h1>";
        const errorTitle = this.mainContent.querySelector("h1");
        errorTitle.setAttribute("tabindex", "-1");
        errorTitle.focus();
      }
    }
  }

  navigate(path) {
    window.history.pushState({}, "", path);
    this.handleRoute(path);
  }

  loadPageScripts(content) {
    const scripts = content.getElementsByTagName("script");
    Array.from(scripts).forEach((oldScript) => {
      const newScript = document.createElement("script");
      if (oldScript.src) {
        newScript.src = oldScript.src;
        // Para garantir a ordem de execução correta
        newScript.async = false;
        document.body.appendChild(newScript);
      } else {
        newScript.textContent = oldScript.textContent;
        document.body.appendChild(newScript);
      }
      // O script antigo deve ser removido se estiver no DOM principal
      oldScript.parentNode?.removeChild(oldScript);
    });
  }
}
