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

let cartasViradas = [];
let bloqueioTabuleiro = false;
let acertos = 0;
let tentativas = 0;

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
}

function expandirExplicacaoGuiada(primeira, segunda) {
    const { termo, conceito, explicacao } = primeira.dataset;

    // 1. Expande as duas cartas do par encontrado
    primeira.classList.add("par-destaque");
    segunda.classList.add("par-destaque");

    // 2. Define origem da expansão próxima ao ponto médio entre as duas cartas
    const rect1 = primeira.getBoundingClientRect();
    const rect2 = segunda.getBoundingClientRect();
    const pontoMedioX = ((rect1.left + rect1.width / 2) + (rect2.left + rect2.width / 2)) / 2;
    const containerRect = painelExplicacao.parentElement.getBoundingClientRect();
    const origemX = Math.max(0, Math.min(containerRect.width, pontoMedioX - containerRect.left));

    painelExplicacao.style.transformOrigin = `${origemX}px top`;
    explicacaoBadge.textContent = termo;
    explicacaoTitulo.textContent = `${termo} — Par identificado!`;
    explicacaoConceito.textContent = `Conceito: ${conceito}`;
    explicacaoTexto.textContent = explicacao;

    // 3. Revela e expande o painel
    painelExplicacao.classList.remove("oculto");
    requestAnimationFrame(() => {
        painelExplicacao.classList.add("expandido");
        painelExplicacao.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });

    // 4. Retorna as cartas ao tamanho normal após a transição de guia
    setTimeout(() => {
        primeira.classList.remove("par-destaque");
        segunda.classList.remove("par-destaque");
    }, 950);
}

function iniciarJogo() {
    tabuleiro.innerHTML = "";
    cartasViradas = [];
    bloqueioTabuleiro = false;
    acertos = 0;
    tentativas = 0;

    painelExplicacao.classList.remove("expandido");
    painelExplicacao.classList.add("oculto");
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
        expandirExplicacaoGuiada(primeira, segunda);
        cartasViradas = [];
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

iniciarJogo();