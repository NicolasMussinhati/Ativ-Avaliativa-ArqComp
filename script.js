const paresTermos = [
    {
        id: 1,
        termo: "CPU",
        conceito: "Cérebro do computador que interpreta e executa instruções.",
        explicacao: "A CPU coordena as operações do sistema, buscando, decodificando e executando instruções dos programas."
    },
    {
        id: 2,
        termo: "ULA",
        conceito: "Parte do processador que faz cálculos e operações lógicas.",
        explicacao: "A ULA realiza operações matemáticas básicas (soma, subtração) e comparações lógicas essenciais para qualquer processamento."
    },
    {
        id: 3,
        termo: "UC",
        conceito: "Gerencia o fluxo de dados e busca instruções na memória.",
        explicacao: "A UC orquestra os sinais internos do processador, garantindo que cada instrução ocorra na ordem certa."
    },
    {
        id: 4,
        termo: "REGISTRADORES",
        conceito: "Memória ultrarrápida interna ao processador para dados imediatos.",
        explicacao: "Os registradores ficam no topo da hierarquia de memória, guardando operandos e endereços usados diretamente pela CPU."
    },
    {
        id: 5,
        termo: "RAM",
        conceito: "Memória principal volátil usada pelos programas em execução.",
        explicacao: "A RAM permite leitura e escrita rápidas durante o uso do sistema, mas perde todo o conteúdo quando o computador é desligado."
    },
    {
        id: 6,
        termo: "ROM",
        conceito: "Memória não volátil gravada de fábrica para inicialização.",
        explicacao: "A ROM mantém suas informações mesmo sem energia elétrica, sendo fundamental para armazenar rotinas iniciais de boot."
    },
    {
        id: 7,
        termo: "CACHE",
        conceito: "Memória intermediária veloz que reduz acessos à memória principal.",
        explicacao: "A memória cache armazena cópias dos dados mais acessados recentemente para evitar que o processador espere pela RAM."
    },
    {
        id: 8,
        termo: "MEMORIADEMASSA",
        conceito: "Armazenamento permanente de grande capacidade para arquivos e sistema.",
        explicacao: "Dispositivos como SSDs e HDs guardam dados a longo prazo sem depender de energia contínua para manter as informações."
    },
    {
        id: 9,
        termo: "DMA",
        conceito: "Permite periféricos transferirem dados sem sobrecarregar o processador.",
        explicacao: "O DMA libera a CPU de gerenciar transferências repetitivas entre dispositivos de E/S e a RAM."
    },
    {
        id: 10,
        termo: "ADDRESSBUS",
        conceito: "Via unidirecional que indica onde ler ou gravar dados.",
        explicacao: "O barramento de endereço transporta a localização física na memória ou periférico que o processador deseja acessar."
    },
    {
        id: 11,
        termo: "DATABUS",
        conceito: "Via bidirecional que transporta informações entre componentes.",
        explicacao: "O barramento de dados leva as instruções e valores propriamente ditos entre processador, memória e periféricos."
    },
    {
        id: 12,
        termo: "MICROCONTROLADOR",
        conceito: "Chip único com processador, memória e periféricos integrados.",
        explicacao: "Muito usado em sistemas embarcados e IoT, reúne processamento, armazenamento e pinos de entrada/saída em um só circuito."
    }
];

const tabuleiro = document.getElementById("tabuleiro");
const contadorAcertos = document.getElementById("contador-acertos");
const contadorTentativas = document.getElementById("contador-tentativas");
const painelExplicacao = document.getElementById("painel-explicacao");
const explicacaoBadge = document.getElementById("explicacao-badge");
const explicacaoTitulo = document.getElementById("explicacao-titulo");
const explicacaoConceito = document.getElementById("explicacao-conceito");
const explicacaoTexto = document.getElementById("explicacao-texto");
const btnReiniciar = document.getElementById("btn-reiniciar");

const listaConceitos = document.getElementById("lista-conceitos");
const contadorLateral = document.getElementById("contador-lateral");

const painelResumo = document.getElementById("painel-resumo");
const resumoSelo = document.getElementById("resumo-selo");
const resumoAcertos = document.getElementById("resumo-acertos");
const resumoTentativas = document.getElementById("resumo-tentativas");
const resumoPrecisao = document.getElementById("resumo-precisao");
const feedbackTitulo = document.getElementById("feedback-titulo");
const feedbackTexto = document.getElementById("feedback-texto");
const btnJogarNovamente = document.getElementById("btn-jogar-novamente");

let cartasViradas = [];
let bloqueioTabuleiro = false;
let acertos = 0;
let tentativas = 0;
let paresDesbloqueados = [];

function embaralhar(lista) {
    for (let i = lista.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [lista[i], lista[j]] = [lista[j], lista[i]];
    }
    return lista;
}

function criarBaralho() {
    const baralho = [];
    paresTermos.forEach((item) => {
        baralho.push({
            id: item.id,
            tipo: "termo",
            conteudo: item.termo,
            termo: item.termo,
            conceito: item.conceito,
            explicacao: item.explicacao
        });
        baralho.push({
            id: item.id,
            tipo: "conceito",
            conteudo: item.conceito,
            termo: item.termo,
            conceito: item.conceito,
            explicacao: item.explicacao
        });
    });
    return embaralhar(baralho);
}

function atualizarPlacar() {
    contadorAcertos.textContent = `${acertos} de ${paresTermos.length} pares`;
    contadorTentativas.textContent = tentativas;
    contadorLateral.textContent = `${acertos}/${paresTermos.length}`;
}

function marcarItemAtivoNoMenu(termoAtivo) {
    const botoes = listaConceitos.querySelectorAll(".item-conceito");
    botoes.forEach((btn) => {
        btn.classList.toggle("ativo", btn.dataset.termo === termoAtivo);
    });
}

function adicionarNoMenuLateral(item) {
    if (paresDesbloqueados.some((p) => p.id === item.id)) return;
    paresDesbloqueados.push(item);

    const vazio = listaConceitos.querySelector(".lista-vazia");
    if (vazio) vazio.remove();

    const li = document.createElement("li");
    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "item-conceito ativo";
    botao.dataset.termo = item.termo;
    botao.innerHTML = `<span>${item.termo}</span><small>Rever</small>`;

    botao.addEventListener("click", () => {
        exibirExplicacao(item, null, null);
        marcarItemAtivoNoMenu(item.termo);
    });

    li.appendChild(botao);
    listaConceitos.appendChild(li);
    marcarItemAtivoNoMenu(item.termo);
}

function exibirExplicacao(dados, primeiraCarta, segundaCarta) {
    const { termo, conceito, explicacao } = dados;

    if (primeiraCarta && segundaCarta) {
        primeiraCarta.classList.add("par-destaque");
        segundaCarta.classList.add("par-destaque");

        const rect1 = primeiraCarta.getBoundingClientRect();
        const rect2 = segundaCarta.getBoundingClientRect();
        const pontoMedioX = ((rect1.left + rect1.width / 2) + (rect2.left + rect2.width / 2)) / 2;
        const containerRect = painelExplicacao.parentElement.getBoundingClientRect();
        const origemX = Math.max(0, Math.min(containerRect.width, pontoMedioX - containerRect.left));
        painelExplicacao.style.transformOrigin = `${origemX}px top`;

        setTimeout(() => {
            primeiraCarta.classList.remove("par-destaque");
            segundaCarta.classList.remove("par-destaque");
        }, 950);
    } else {
        painelExplicacao.style.transformOrigin = "center top";
    }

    explicacaoBadge.textContent = termo;
    explicacaoTitulo.textContent = `${termo} — Par identificado!`;
    explicacaoConceito.textContent = `Conceito: ${conceito}`;
    explicacaoTexto.textContent = explicacao;

    painelExplicacao.classList.remove("oculto");
    requestAnimationFrame(() => {
        painelExplicacao.classList.add("expandido");
        painelExplicacao.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
}

function gerarFeedbackDesempenho(totalTentativas, totalPares) {
    if (totalTentativas <= totalPares + 4) {
        return {
            selo: "Excelente domínio",
            titulo: "Desempenho muito forte!",
            texto: `Você fechou em ${totalTentativas} tentativas. Continue reforçando a diferença entre barramentos (ADDRESSBUS vs. DATABUS) e memórias voláteis (RAM/CACHE) vs. não voláteis (ROM) revisando pelo menu lateral.`
        };
    }
    if (totalTentativas <= totalPares * 2) {
        return {
            selo: "Bom progresso",
            titulo: "Como melhorar na próxima rodada",
            texto: `Você precisou de ${totalTentativas} tentativas. Tente agrupar mentalmente os termos por função (processamento: CPU, ULA, UC, REGISTRADORES; memória e barramento) antes de virar as cartas.`
        };
    }
    return {
        selo: "Em evolução",
        titulo: "Dica para reduzir as tentativas",
        texto: `Você concluiu em ${totalTentativas} tentativas. Use o menu lateral para reler cada conceito assim que encontrá-lo e associe palavras-chave curtas (ex.: "volátil" para RAM, "unidirecional" para ADDRESSBUS).`
    };
}

function mostrarSumarioFinal() {
    const totalPares = paresTermos.length;
    const precisao = Math.round((totalPares / tentativas) * 100);
    const feedback = gerarFeedbackDesempenho(tentativas, totalPares);

    resumoSelo.textContent = feedback.selo;
    resumoAcertos.textContent = `${acertos} de ${totalPares}`;
    resumoTentativas.textContent = tentativas;
    resumoPrecisao.textContent = `${precisao}%`;
    feedbackTitulo.textContent = feedback.titulo;
    feedbackTexto.textContent = feedback.texto;

    painelResumo.classList.remove("oculto");
    painelResumo.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function iniciarJogo() {
    tabuleiro.innerHTML = "";
    listaConceitos.innerHTML = `<li class="lista-vazia">Nenhum par encontrado ainda.</li>`;
    paresDesbloqueados = [];

    cartasViradas = [];
    bloqueioTabuleiro = false;
    acertos = 0;
    tentativas = 0;

    painelExplicacao.classList.remove("expandido");
    painelExplicacao.classList.add("oculto");
    painelResumo.classList.add("oculto");
    atualizarPlacar();

    const baralho = criarBaralho();

    baralho.forEach((dadosCarta) => {
        const carta = document.createElement("div");
        carta.classList.add("carta", `tipo-${dadosCarta.tipo}`);
        carta.dataset.id = dadosCarta.id;
        carta.dataset.tipo = dadosCarta.tipo;
        carta.dataset.termo = dadosCarta.termo;
        carta.dataset.conceito = dadosCarta.conceito;
        carta.dataset.explicacao = dadosCarta.explicacao;

        carta.innerHTML = `
            <div class="carta-interna">
                <div class="carta-frente">?</div>
                <div class="carta-verso">${dadosCarta.conteudo}</div>
            </div>
        `;

        carta.addEventListener("click", () => virarCarta(carta));
        tabuleiro.appendChild(carta);
    });
}

function virarCarta(carta) {
    if (bloqueioTabuleiro) return;
    if (carta.classList.contains("virada") || carta.classList.contains("encontrada")) return;

    carta.classList.add("virada");
    cartasViradas.push(carta);

    if (cartasViradas.length === 2) {
        tentativas++;
        atualizarPlacar();
        verificarPar();
    }
}

function verificarPar() {
    const [primeira, segunda] = cartasViradas;
    const mesmoId = primeira.dataset.id === segunda.dataset.id;
    const tiposDiferentes = primeira.dataset.tipo !== segunda.dataset.tipo;

    if (mesmoId && tiposDiferentes) {
        primeira.classList.add("encontrada");
        segunda.classList.add("encontrada");
        acertos++;
        atualizarPlacar();

        const dadosPar = {
            id: Number(primeira.dataset.id),
            termo: primeira.dataset.termo,
            conceito: primeira.dataset.conceito,
            explicacao: primeira.dataset.explicacao
        };

        adicionarNoMenuLateral(dadosPar);
        exibirExplicacao(dadosPar, primeira, segunda);
        cartasViradas = [];

        if (acertos === paresTermos.length) {
            setTimeout(mostrarSumarioFinal, 700);
        }
    } else {
        bloqueioTabuleiro = true;
        setTimeout(() => {
            primeira.classList.remove("virada");
            segunda.classList.remove("virada");
            cartasViradas = [];
            bloqueioTabuleiro = false;
        }, 1100);
    }
}

btnReiniciar.addEventListener("click", iniciarJogo);
btnJogarNovamente.addEventListener("click", iniciarJogo);

iniciarJogo();