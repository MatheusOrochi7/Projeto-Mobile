document.addEventListener("DOMContentLoaded", function () {
  configurarSplash();
  configurarAnalise();
  configurarPerfil();
  configurarBotoesVoltar();
  configurarAjuda();
});

function configurarSplash() {
  const splash = document.getElementById("splash-apresentacao");
  const botaoComecar = document.getElementById("botao-comecar-protecao");

  if (!splash || !botaoComecar) return;

  botaoComecar.addEventListener("click", function () {
    splash.classList.add("oculto");
  });
}

function configurarAnalise() {
  const formulario = document.getElementById("formulario-analise");
  const campoMensagem = document.getElementById("mensagem-para-analisar");
  const feedback = document.getElementById("feedback-analise");

  if (!formulario || !campoMensagem) return;

  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const texto = campoMensagem.value.trim();

    if (texto.length < 10) {
      if (feedback) {
        feedback.textContent = "Cole uma mensagem um pouco maior para continuar.";
      }
      campoMensagem.focus();
      return;
    }

    localStorage.setItem("mensagemAnalise", texto);
    window.location.href = "resultado.html";
  });
}

function configurarPerfil() {
  const formulario = document.getElementById("formulario-perfil");
  const resultado = document.getElementById("resultado-perfil");

  if (!formulario || !resultado) return;

  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const marcados = formulario.querySelectorAll('input[type="checkbox"]:checked').length;

    resultado.classList.add("visivel");

    if (marcados >= 3) {
      resultado.textContent =
        "Vários sinais de atenção foram marcados. Converse com alguém de confiança e inicie uma atividade física para melhorar seu condicionamento.";
    } else if (marcados >= 1) {
      resultado.textContent =
        "Há sinais que merecem atenção. Procure confirmar sua situação com um médico.";
    } else {
      resultado.textContent =
        "Nenhum dos sinais principais foi marcado. Continue observando com calma e cuide da sua saúde.";
    }
  });
}

function configurarAjuda() {
  const modal = document.getElementById("modal-ajuda");
  const modalTitulo = document.getElementById("modal-titulo");
  const modalCorpo = document.getElementById("modal-corpo");
  const modalFechar = document.getElementById("modal-fechar");

  if (!modal || !modalTitulo || !modalCorpo) return;

  function abrirModal(titulo, corpoHtml) {
    modalTitulo.textContent = titulo;
    modalCorpo.innerHTML = corpoHtml;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    modalFechar.focus();
  }

  function fecharModal() {
    modal.hidden = true;
    document.body.style.overflow = "";
  }

  if (modalFechar) {
    modalFechar.addEventListener("click", fecharModal);
  }

  modal.addEventListener("click", function (evento) {
    if (evento.target === modal) fecharModal();
  });

  document.addEventListener("keydown", function (evento) {
    if (evento.key === "Escape" && !modal.hidden) fecharModal();
  });

  const botaoGuia = document.getElementById("botao-guia-denuncia");
  if (botaoGuia) {
    botaoGuia.addEventListener("click", function () {
      abrirModal(
        "Guia de Auto-Cuidado",
        `<ol class="modal-lista">
          <li>Beba água regularmente ao longo do dia.</li>
          <li>Faça alongamentos leves ao acordar.</li>
          <li>Caminhe pelo menos 15 minutos por dia, se possível.</li>
          <li>Durma de 7 a 8 horas por noite.</li>
          <li>Consulte um médico regularmente para acompanhar sua saúde.</li>
        </ol>`
      );
    });
  }

  const artigoExercicios = document.getElementById("artigo-golpistas");
  if (artigoExercicios) {
    artigoExercicios.addEventListener("click", function (evento) {
      evento.preventDefault();
      abrirModal(
        "Exercícios para fazer em casa",
        `<p>Pequenos exercícios ajudam a manter a mobilidade e a força muscular:</p>
         <ul class="modal-lista">
           <li>Sentar e levantar da cadeira, 10 repetições.</li>
           <li>Elevação de braços com halteres leves ou garrafas de água.</li>
           <li>Marcha estacionária por 2 minutos.</li>
           <li>Alongamento de pescoço e ombros.</li>
         </ul>`
      );
    });
  }

  const artigoDetox = document.getElementById("artigo-suspeita");
  if (artigoDetox) {
    artigoDetox.addEventListener("click", function (evento) {
      evento.preventDefault();
      abrirModal(
        "Chá detox para melhorar o intestino",
        `<p>Uma opção simples para o bem-estar intestinal:</p>
         <ul class="modal-lista">
           <li>Ferva água com folhas de hortelã ou erva-cidreira.</li>
           <li>Deixe descansar por 5 minutos antes de coar.</li>
           <li>Beba morno, de preferência após as refeições.</li>
         </ul>
         <p class="texto-suave">Consulte um médico antes de iniciar qualquer novo hábito alimentar.</p>`
      );
    });
  }

  const botaoLigar = document.getElementById("botao-ligar-filha");
  if (botaoLigar) {
    botaoLigar.addEventListener("click", function () {
      botaoLigar.classList.add("botao-ativo-clique");
      setTimeout(function () {
        botaoLigar.classList.remove("botao-ativo-clique");
      }, 300);
    });
  }
}

function configurarBotoesVoltar() {
  const botoes = document.querySelectorAll("[data-acao='voltar']");

  botoes.forEach(function (botao) {
    botao.addEventListener("click", function () {
      history.back();
    });
  });
}