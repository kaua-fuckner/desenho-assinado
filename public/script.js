   const CLIENT_ID = "1045032219556-65b51meblui5h7fgmshro38cgehm2pn6.apps.googleusercontent.com"; 

const form = document.getElementById("formulario");
const campoNumero = document.getElementById("numero");
const mensagem = document.getElementById("mensagem");
const figura = document.getElementById("desenho");
const botaoBaixar = document.getElementById("baixar");
const usuario = document.getElementById("usuario");

let idToken = null;
let svgAtual = null;
let numeroAtual = null;

function erro(texto) {
  mensagem.textContent = texto;
  figura.innerHTML = "";
  botaoBaixar.hidden = true;
}

function aoLogar(resposta) {
  idToken = resposta.credential;
  try {
    const payload = JSON.parse(
      atob(resposta.credential.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
    );
    usuario.textContent = "Conectado como " + payload.email;
  } catch {
    usuario.textContent = "Conectado";
  }
  mensagem.textContent = "";
}

function iniciarGoogle() {
  if (!window.google || !google.accounts) {
    setTimeout(iniciarGoogle, 100);
    return;
  }
  google.accounts.id.initialize({ client_id: CLIENT_ID, callback: aoLogar });
  google.accounts.id.renderButton(document.getElementById("google-login"), {
    theme: "outline",
    size: "large",
  });
}
iniciarGoogle();

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  mensagem.textContent = "";

  const numero = Number(campoNumero.value);
  if (!idToken) {
    erro("Entre com sua conta Google antes de gerar o desenho.");
    return;
  }

  try {
    const resp = await fetch("/api/desenho", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + idToken,
      },
      body: JSON.stringify({ numero }),
    });

    if (resp.status === 400) {
      erro("Erro 400: informe um número inteiro entre 1 e 100.");
      return;
    }
    if (resp.status === 401) {
      idToken = null;
      usuario.textContent = "";
      erro("Erro 401: sessão inválida ou expirada. Entre novamente com o Google.");
      return;
    }
    if (!resp.ok) {
      erro("Erro " + resp.status + " ao gerar o desenho.");
      return;
    }

    svgAtual = await resp.text();
    numeroAtual = numero;
    figura.innerHTML = svgAtual;
    botaoBaixar.hidden = false;
  } catch {
    erro("Falha de rede ao chamar o servidor.");
  }
});

botaoBaixar.addEventListener("click", () => {
  if (!svgAtual) return;
  const blob = new Blob([svgAtual], { type: "image/svg+xml" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "desenho-" + numeroAtual + ".svg";
  a.click();
  URL.revokeObjectURL(a.href);
});