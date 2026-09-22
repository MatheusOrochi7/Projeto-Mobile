/* =========================================================
   auth.js
   Autenticação simulada, 100% HTML/CSS/JS (sem servidor).

   Os dados ficam salvos no localStorage do PRÓPRIO navegador
   do usuário. Isso é suficiente para prototipar um fluxo de
   cadastro/login funcional, mas tem limites importantes de
   segurança — veja o aviso no final deste arquivo.
   ========================================================= */

const CHAVE_USUARIOS = "pilatesIdosos_usuarios";
const CHAVE_SESSAO = "pilatesIdosos_sessao";

function obterUsuarios() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE_USUARIOS)) || [];
  } catch (erro) {
    return [];
  }
}

function salvarUsuarios(lista) {
  localStorage.setItem(CHAVE_USUARIOS, JSON.stringify(lista));
}

function gerarSal(tamanho = 16) {
  const valores = new Uint8Array(tamanho);
  crypto.getRandomValues(valores);
  return Array.from(valores, (b) => b.toString(16).padStart(2, "0")).join("");
}

// Gera um hash da senha (nunca guardamos a senha em texto puro).
async function gerarHash(senha, sal) {
  if (window.crypto && crypto.subtle && crypto.subtle.digest) {
    const codificador = new TextEncoder();
    const dados = codificador.encode(sal + senha);
    const buffer = await crypto.subtle.digest("SHA-256", dados);
    return Array.from(new Uint8Array(buffer), (b) =>
      b.toString(16).padStart(2, "0")
    ).join("");
  }

  // Fallback simples, só usado se o navegador não suportar
  // crypto.subtle (ex.: contexto não seguro). Bem mais fraco
  // que SHA-256, mas evita quebrar o fluxo.
  let hash = 0;
  const texto = sal + senha;
  for (let i = 0; i < texto.length; i++) {
    hash = (hash << 5) - hash + texto.charCodeAt(i);
    hash |= 0;
  }
  return "fallback-" + Math.abs(hash).toString(16);
}

async function cadastrarUsuario(nome, email, senha) {
  const usuarios = obterUsuarios();
  const emailNormalizado = email.trim().toLowerCase();

  const jaExiste = usuarios.some((u) => u.email === emailNormalizado);
  if (jaExiste) {
    return { ok: false, mensagem: "Este e-mail já está cadastrado." };
  }

  const sal = gerarSal();
  const hash = await gerarHash(senha, sal);

  usuarios.push({
    nome: nome.trim(),
    email: emailNormalizado,
    sal: sal,
    hash: hash,
  });

  salvarUsuarios(usuarios);
  return { ok: true };
}

async function autenticarUsuario(email, senha) {
  const usuarios = obterUsuarios();
  const emailNormalizado = email.trim().toLowerCase();
  const usuario = usuarios.find((u) => u.email === emailNormalizado);

  if (!usuario) {
    return { ok: false, mensagem: "E-mail ou senha incorretos." };
  }

  const hashDigitado = await gerarHash(senha, usuario.sal);
  if (hashDigitado !== usuario.hash) {
    return { ok: false, mensagem: "E-mail ou senha incorretos." };
  }

  iniciarSessao(usuario);
  return { ok: true };
}

function iniciarSessao(usuario) {
  sessionStorage.setItem(
    CHAVE_SESSAO,
    JSON.stringify({
      nome: usuario.nome,
      email: usuario.email,
      entrouEm: Date.now(),
    })
  );
}

function obterSessao() {
  try {
    return JSON.parse(sessionStorage.getItem(CHAVE_SESSAO));
  } catch (erro) {
    return null;
  }
}

function encerrarSessao() {
  sessionStorage.removeItem(CHAVE_SESSAO);
  window.location.href = "login.html";
}

// Chame no início de páginas que exigem estar logado.
// Se não houver sessão ativa, manda para o login e retorna true
// (o chamador pode usar isso para não continuar configurando a página).
function exigirLogin() {
  if (!obterSessao()) {
    window.location.href = "login.html";
    return true;
  }
  return false;
}

/* =========================================================
   AVISO DE SEGURANÇA
   -------------------------------------------------------
   Este é um login "client-side only": não existe servidor
   validando nada, tudo roda e fica salvo no navegador do
   próprio usuário (localStorage/sessionStorage).

   Isso é adequado para protótipos, projetos de estudo ou
   demonstrações — mas NÃO deve ser usado para dados reais
   de pessoas, porque:

   - Qualquer pessoa com acesso ao mesmo navegador consegue
     abrir o DevTools (F12) e ler o localStorage.
   - Não há proteção real: os "usuários cadastrados" só
     existem naquele navegador/dispositivo específico — não
     dá para logar com a mesma conta em outro aparelho.
   - Sem HTTPS + servidor, não existe forma de proteger a
     senha de verdade (aqui, o hash SHA-256 evita salvar a
     senha em texto puro, mas isso não substitui um backend).

   Para um login real e seguro, é necessário um servidor
   (Node, Python, PHP etc.) com banco de dados, hash de senha
   com bcrypt/argon2, HTTPS e validação no lado do servidor.
   ========================================================= */
