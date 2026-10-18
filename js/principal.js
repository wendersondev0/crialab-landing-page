const whatsappNumero = "5527996530954";
const topo = document.querySelector("[data-topo]");
const menu = document.querySelector("[data-menu]");
const menuBotao = document.querySelector("[data-menu-botao]");
const formulario = document.querySelector("[data-formulario]");
const erro = document.querySelector("[data-erro]");
const ok = document.querySelector("[data-ok]");
const ano = document.querySelector("[data-ano]");

if (ano) {
  ano.textContent = String(new Date().getFullYear());
}

function fecharMenu() {
  if (!menu || !menuBotao) {
    return;
  }
  menu.classList.remove("aberto");
  menuBotao.setAttribute("aria-expanded", "false");
}

if (menuBotao && menu) {
  menuBotao.addEventListener("click", () => {
    const aberto = menu.classList.toggle("aberto");
    menuBotao.setAttribute("aria-expanded", aberto ? "true" : "false");
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", fecharMenu);
  });
}

document.addEventListener("keydown", (evento) => {
  if (evento.key === "Escape") {
    fecharMenu();
  }
});

const secoes = [...document.querySelectorAll("main section[id]")];
const links = [...document.querySelectorAll(".menu a[href^='#']")];

function marcarAtual() {
  if (topo) {
    topo.classList.toggle("firme", window.scrollY > 8);
  }
  const marca = window.scrollY + 120;
  let atual = secoes[0]?.id || "";
  secoes.forEach((secao) => {
    if (secao.offsetTop <= marca) {
      atual = secao.id;
    }
  });
  links.forEach((link) => {
    const href = link.getAttribute("href");
    if (href === `#${atual}`) {
      link.setAttribute("aria-current", "true");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

marcarAtual();
window.addEventListener("scroll", marcarAtual, { passive: true });

if (formulario) {
  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    erro.hidden = true;
    ok.hidden = true;
    formulario.querySelectorAll(".campo").forEach((campo) => campo.classList.remove("invalido"));

    const dados = new FormData(formulario);
    const nome = String(dados.get("nome") || "").trim();
    const email = String(dados.get("email") || "").trim();
    const tipo = String(dados.get("tipo") || "").trim();
    const mensagem = String(dados.get("mensagem") || "").trim();
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!nome || !emailValido || !tipo || !mensagem) {
      ["nome", "email", "tipo", "mensagem"].forEach((campo) => {
        const input = formulario.elements.namedItem(campo);
        if (!(input instanceof HTMLElement)) {
          return;
        }
        const vazio = campo === "email" ? !emailValido : !String(dados.get(campo) || "").trim();
        input.closest(".campo")?.classList.toggle("invalido", vazio);
      });
      erro.hidden = false;
      return;
    }

    const texto = [
      "Olá, Cria Lab DM! Quero falar com a oficina.",
      `Nome: ${nome}`,
      `E-mail: ${email}`,
      `Telefone: ${String(dados.get("telefone") || "").trim() || "não informado"}`,
      `Tipo: ${tipo}`,
      `Peça: ${String(dados.get("peca") || "").trim() || "não informada"}`,
      `Quantidade: ${String(dados.get("quantidade") || "").trim() || "1"}`,
      `Mensagem: ${mensagem}`
    ].join("\n");

    const url = `https://wa.me/${whatsappNumero}?text=${encodeURIComponent(texto)}`;
    const janela = window.open(url, "_blank", "noopener,noreferrer");
    if (!janela) {
      window.location.href = url;
    }
    ok.hidden = false;
  });
}

const visor = document.querySelector("[data-visor]");
const visorImagem = visor?.querySelector("img");
const fecharVisor = document.querySelector("[data-fechar]");

document.querySelectorAll("[data-ampliar]").forEach((botao) => {
  botao.addEventListener("click", () => {
    const imagem = botao.querySelector("img");
    if (!visor || !visorImagem || !imagem) {
      return;
    }
    visorImagem.src = imagem.currentSrc || imagem.src;
    visorImagem.alt = imagem.alt;
    visor.showModal();
  });
});

fecharVisor?.addEventListener("click", () => {
  visor?.close();
});

visor?.addEventListener("click", (evento) => {
  if (evento.target === visor) {
    visor.close();
  }
});
