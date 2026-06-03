import { useState } from "react";

const NEEDS = {
  fisiologica: { label: "Necessidade Fisiológica", short: "Sobrevivência", color: "#c8b89a", icon: "◉", level: 1 },
  seguranca: { label: "Necessidade de Segurança", short: "Controle", color: "#e8c96a", icon: "◈", level: 2 },
  pertencimento: { label: "Necessidade de Amor e Pertencimento", short: "Conexão", color: "#7a9abf", icon: "◎", level: 3 },
  estima: { label: "Necessidade de Estima", short: "Reconhecimento", color: "#9ab87a", icon: "◇", level: 4 },
  autorrealizacao: { label: "Necessidade de Autorrealização", short: "Propósito", color: "#bf9a7a", icon: "◆", level: 5 },
};

const KEYWORDS = {
  fisiologica: ["dormindo","dormiu","sono","bocejando","cansado","fraco","fome","não comeu","dor","doente","cabeça","sem energia","lento","lerdo","pálido","dorme na aula","sem forças","calor","frio","sede","mal","enjoado","tontura","não dormiu"],
  seguranca: ["nervoso","ansioso","assustado","chorando","choro","trêmulo","mudança","rotina","medo","nova escola","novo professor","transferido","separação","brigas","briga em casa","imprevisto","explodiu","mudou de comportamento","com medo","violento","guarda compartilhada","triste","tristeza","instável","dois lares","duas casas","responsaveis","esquece","desorganizado","família separada","pais separados","divorciados","não tem rotina","sem rotina","perdido","morde","mordeu","agride","agrediu","bate","bateu"],
  pertencimento: ["sozinho","isolado","ninguém conversa","excluído","grupo","amigos","não tem amigos","bullying","ignorado","não se encaixa","sempre sozinho","afastado","rejeição","rejeitado","não é convidado","come sozinho","não quer se relacionar","não conversa","se afastou","não interage","sem amigos","ficou sozinho","ninguém gosta","sem colega"],
  estima: ["bagunça","palhaço","provoca","desafia","interrompe","chama atenção","grita","faz graça","indisciplina","responde","enfrenta","empurra","xinga","humilhado","vergonha","chora quando erra","desiste fácil","não tenta","diz que é burro","não consigo","ofendido","insultado","chamaram de","zoaram","zoado","ridicularizado"],
  autorrealizacao: ["entediado","tédio","não se interessa","desligado","olha pro vácuo","desmotivado","sem interesse","não liga","indiferente","não vejo sentido","para que serve isso","apático com tudo"],
};

const SINAIS = {
  fisiologica: [
    { palavras: ["dormindo","dormiu","bocejando","sono","não dormiu","dorme na aula"], texto: "privação de sono", impacto: "sem sono o cérebro não consolida memória nem regula emoções — qualquer estímulo vira sobrecarga" },
    { palavras: ["fome","não comeu"], texto: "possível privação alimentar", impacto: "fome ativa o sistema de sobrevivência — aprender se torna impossível quando o organismo busca energia básica" },
    { palavras: ["cansado","sem energia","lento","lerdo","fraco","sem forças"], texto: "esgotamento físico", impacto: "corpo esgotado não tem recursos para sustentar atenção — o que parece desinteresse pode ser exaustão" },
    { palavras: ["calor","frio","sede"], texto: "desconforto ambiental", impacto: "o cérebro prioriza regular o corpo antes de qualquer coisa — desconforto físico sequestra a atenção completamente" },
    { palavras: ["dor","doente","cabeça","mal","enjoado","tontura","pálido"], texto: "desconforto físico não atendido", impacto: "dor ou doença sequestram toda a atenção disponível — nenhum conteúdo consegue competir com isso" },
  ],
  seguranca: [
    { palavras: ["nervoso","ansioso","trêmulo","com medo"], texto: "estado de alerta elevado", impacto: "aluno em modo de ameaça não consegue aprender — o cérebro em alarme prioriza sobrevivência, não cognição" },
    { palavras: ["chorando","choro","triste","tristeza"], texto: "ruptura emocional visível", impacto: "choro em sala raramente é sobre o conteúdo — quase sempre é sinal de que algo no mundo dele está instável" },
    { palavras: ["mudança","rotina","nova escola","novo professor","transferido","não tem rotina","sem rotina"], texto: "ruptura de rotina ou ambiente", impacto: "crianças dependem de previsibilidade — qualquer mudança abrupta pode desestabilizar completamente o funcionamento" },
    { palavras: ["separação","brigas","briga em casa","guarda compartilhada","dois lares","duas casas","família separada","pais separados","divorciados"], texto: "instabilidade no ambiente familiar", impacto: "o que acontece em casa chega na sala — aluno com família em crise opera em modo de emergência constante" },
    { palavras: ["explodiu","mudou de comportamento","morde","mordeu","agride","agrediu","bate","bateu","violento"], texto: "reação desproporcional como defesa", impacto: "agredir ou explodir diante de ameaças pequenas é sinal de que o sistema nervoso está no limite — qualquer estímulo vira gatilho" },
  ],
  pertencimento: [
    { palavras: ["sozinho","sempre sozinho","come sozinho","isolado"], texto: "isolamento social", impacto: "isolamento ativa as mesmas regiões cerebrais que a dor física — aluno sozinho está literalmente sofrendo" },
    { palavras: ["excluído","não é convidado","rejeitado","rejeição","bullying"], texto: "exclusão ou bullying", impacto: "ser excluído pelo grupo é uma das experiências mais devastadoras para um jovem — pode ser a raiz de vários comportamentos problemáticos" },
    { palavras: ["não tem amigos","afastado","não se encaixa","não quer se relacionar","não conversa","se afastou","não interage","ficou sozinho"], texto: "dificuldade de conexão", impacto: "quando o aluno não encontra lugar no grupo, vai buscar pertencimento em outro lugar — às vezes em lugares de risco" },
  ],
  estima: [
    { palavras: ["bagunça","palhaço","faz graça","chama atenção","grita"], texto: "busca de reconhecimento por via negativa", impacto: "aluno que bagunça quase sempre está buscando ser visto — é a única via que descobriu que funciona" },
    { palavras: ["desafia","enfrenta","responde","indisciplina","provoca"], texto: "desafio à autoridade como defesa da estima", impacto: "desafiar o professor pode ser proteção — ele testa antes de ser humilhado, mantendo controle sobre sua própria imagem" },
    { palavras: ["empurra","xinga","ofendido","insultado","chamaram de","zoaram","zoado","ridicularizado","humilhado"], texto: "estima ferida", impacto: "humilhação pública destrói a confiança e contamina toda a relação com o ambiente escolar" },
    { palavras: ["chora quando erra","desiste fácil","não tenta","diz que é burro","não consigo","vergonha"], texto: "crença de incapacidade instalada", impacto: "quando o aluno para de tentar, já concluiu que não vai conseguir — é proteção contra a dor de falhar novamente" },
  ],
  autorrealizacao: [
    { palavras: ["entediado","tédio","não se interessa","sem interesse"], texto: "desconexão com o conteúdo", impacto: "tédio crônico pode ser sinal de que o aluno está além do nível ou nunca encontrou onde seu potencial se encaixa" },
    { palavras: ["desligado","olha pro vácuo","não liga","indiferente","apático com tudo"], texto: "desengajamento total", impacto: "aluno desligado já saiu emocionalmente da sala — o corpo está presente mas ele já foi embora" },
    { palavras: ["desmotivado","não vejo sentido","para que serve isso"], texto: "falta de propósito percebido", impacto: "quando o aluno não enxerga conexão entre o que aprende e sua vida, o cérebro descarta o conteúdo como irrelevante" },
  ],
};

const ACOES = {
  fisiologica: [
    ["Antes de qualquer intervenção pedagógica, pergunte em particular: ele dormiu? comeu? está se sentindo bem fisicamente?", "Acione a equipe de apoio escolar se identificar privação sistemática — isso é responsabilidade institucional, não só sua", "Crie um momento de acolhimento no início da aula — alunos no nível zero precisam de pausa antes de aprender qualquer coisa"],
    ["Não exija atenção antes de verificar as condições básicas — pergunte discretamente como ele está antes de começar a aula", "Se a privação é recorrente, registre e comunique à coordenação — um aluno sem o básico é questão de proteção, não de disciplina", "Reduza demandas cognitivas para esse aluno nesse momento — ele não está em condições de processar, e forçar piora a situação"],
    ["Observe padrões: se ele chega sempre assim na mesma hora ou dia, há algo sistemático acontecendo em casa", "Ofereça uma saída digna — 'você quer tomar água e respirar um pouco?' — antes de qualquer cobrança", "Documente o comportamento com datas e contexto para ter dados quando conversar com a família ou equipe pedagógica"],
  ],
  seguranca: [
    ["Mantenha a rotina da sua aula o mais previsível possível — para alunos em insegurança, saber o que vem a seguir é âncora", "Converse em particular, sem pressão — não para resolver o problema familiar, mas para comunicar que você viu e que ele não está invisível", "Avise sobre qualquer mudança com antecedência — para esse aluno, surpresa é ameaça, não diversão"],
    ["Antes de iniciar qualquer atividade, diga o que vai acontecer — sequência clara é segurança para esse aluno", "Não reaja à reação desproporcional — responda ao que está por baixo dela: 'eu vi que algo te incomodou. Podemos conversar depois?'", "Crie um sinal ou combinação privada com ele — algo que comunique 'está tudo bem, você está seguro aqui'"],
    ["Identifique o que dispara a reação e antecipe — se você sabe que mudanças o desestabilizam, prepare-o com antecedência", "Use linguagem de controle pequeno: 'você pode escolher onde sentar hoje' — dar micro-escolhas reduz a sensação de ameaça", "Aproxime a família com cuidado — às vezes a instabilidade está em casa, e a escola é o único lugar previsível que ele tem"],
  ],
  pertencimento: [
    ["Crie oportunidades estruturadas de conexão — trabalhos em dupla onde ele tenha papel definido e necessário", "Observe os recreios — isolamento nesses momentos é dado clínico, não opção pessoal", "Se há bullying envolvido, acione o protocolo institucional imediatamente — não é problema que a sala resolve sozinha"],
    ["Coloque-o em dupla com alguém que tem perfil compatível — não force amizade, crie condição para ela acontecer", "Dê a ele uma responsabilidade pública na sala — ajudar a distribuir material, liderar uma atividade — isso cria visibilidade positiva", "Verifique nos recreios: se ele está sempre sozinho, chame a atenção da equipe — isolamento prolongado precisa de intervenção estruturada"],
    ["Mencione o nome dele positivamente na frente da turma — ser visto pelo professor muda a percepção dos colegas sobre quem ele é", "Crie projetos em grupo com papéis claros — alunos isolados frequentemente não sabem como entrar num grupo sem uma estrutura que facilite", "Converse individualmente: 'como você está se sentindo com a turma?' — às vezes ele só precisa que alguém pergunte"],
  ],
  estima: [
    ["Encontre algo genuíno para reconhecer nesse aluno publicamente — não elogio vazio, algo real que ele fez ou é", "Nunca o corrija ou discipline publicamente se puder evitar — a plateia amplifica a humilhação e cria ferida duradoura", "Dê a ele um papel de responsabilidade na sala — algo que comunique 'você tem valor aqui'"],
    ["Chame-o em particular antes de uma atividade e diga que acredita que ele vai se sair bem — expectativa positiva muda desempenho", "Quando ele errar, corrija o erro, não a pessoa — 'essa resposta não está certa' é diferente de 'você não sabe'", "Crie situações onde ele possa demonstrar algo que sabe fazer bem — toda criança tem uma área de competência, encontre a dele"],
    ["Observe o que ele faz quando ninguém está cobrando — ali está a pista do que ele valoriza em si mesmo", "Evite comparações com outros alunos, mesmo positivas — 'você é melhor que X' cria hierarquia, não autoestima genuína", "Peça a opinião dele sobre algo relevante para a turma — ser consultado comunica que sua perspectiva tem valor"],
  ],
  autorrealizacao: [
    ["Converse sobre o que ele faz fora da escola — às vezes o potencial está em lugar que o currículo nunca tocou", "Conecte o conteúdo à vida real dele — um exemplo concreto do 'para que serve' pode reacender o engajamento", "Proponha um desafio além do básico — aluno desengajado por tédio precisa de mais complexidade, não menos"],
    ["Pergunte o que ele faz quando ninguém está olhando — jogos, músicas, desenhos, histórias. Isso revela onde o potencial vive", "Ofereça variações da tarefa — 'você pode fazer do jeito padrão ou pode me surpreender' — autonomia ativa engajamento", "Fale sobre seu próprio processo de descoberta — quando você encontrou o que te apaixona? Isso abre a conversa de forma genuína"],
    ["Encontre um projeto ou atividade extracurricular que conecte com o que ele demonstra ter interesse — e indique ativamente", "Mostre exemplos de pessoas que fizeram algo incomum com seus talentos — o que parece 'inútil' hoje pode ser profissão amanhã", "Reduza a pressão por resultado e aumente o espaço para exploração — alunos desmotivados raramente precisam de mais cobrança"],
  ],
};

const POR_QUE = {
  fisiologica: [
    { titulo: "Por que o corpo reage assim?", texto: "Quando necessidades físicas básicas não são atendidas — sono, alimentação, ausência de dor — o cérebro entra em modo de sobrevivência. O córtex pré-frontal, responsável pelo raciocínio e autocontrole, reduz sua atividade. O que assume o comando é a amígdala: a parte mais primitiva do cérebro, que só conhece ameaça e resposta. Nesse estado, não existe capacidade real de aprender, planejar ou se relacionar bem. Não é falta de vontade — é fisiologia." },
    { titulo: "O organismo está racionando recursos — não sabotando a aprendizagem", texto: "Quando energia, descanso ou saúde estão comprometidos, o cérebro desativa funções consideradas não essenciais para a sobrevivência — como atenção, memória e regulação emocional. O comportamento que você vê não é escolha do aluno: é o sistema nervoso priorizando o que parece mais urgente." },
    { titulo: "Por que exigir atenção de quem está sobrevivendo não funciona?", texto: "Privação física eleva cortisol e reduz serotonina. O resultado é que situações normais parecem insuperáveis, tolerância cai, e qualquer demanda adicional vira sobrecarga. Antes de qualquer intervenção pedagógica, a pergunta correta é: esse aluno tem o básico atendido?" },
  ],
  seguranca: [
    { titulo: "Por que a mente em alerta não consegue aprender?", texto: "Quando o ambiente é imprevisível ou ameaçador, o sistema nervoso dispara cortisol — o hormônio do estresse. Em doses altas e contínuas, ele destrói a capacidade de pensar com clareza, dormir bem e confiar nas pessoas. O cérebro passa a varrer o ambiente em busca de perigos o tempo todo. É por isso que alunos em insegurança reagem de forma desproporcional e têm dificuldade de se concentrar." },
    { titulo: "Reação desproporcional é sinal — não comportamento", texto: "Um aluno que explode diante de mudanças pequenas, que precisa controlar tudo ao redor, que reage com ansiedade a imprevistos — está operando com um sistema nervoso em modo de ameaça. A escola pode ser o único ambiente previsível que ele tem. Isso é uma responsabilidade enorme — e uma oportunidade." },
    { titulo: "Por que rotina é remédio para esse aluno?", texto: "Para quem vive em ambiente imprevisível — em casa ou na vida — previsibilidade não é detalhe pedagógico, é necessidade fisiológica. Saber o que vem a seguir acalma o sistema nervoso, libera capacidade cognitiva e permite que o aluno finalmente preste atenção no que você tem a dizer." },
  ],
  pertencimento: [
    { titulo: "Por que a ausência de conexão dói tanto?", texto: "Estudos de neuroimagem mostram que rejeição social ativa as mesmas regiões cerebrais que a dor física. Não é exagero — é literalmente a mesma experiência neurológica. Para nossos ancestrais, ser excluído do grupo significava morte. O cérebro nunca atualizou esse sistema. Por isso solidão e rejeição comprometem o sono, o humor, a imunidade e a capacidade de aprender." },
    { titulo: "Isolamento não é timidez — é sofrimento ativo", texto: "Um aluno que come sozinho, que nunca é chamado para grupos, que fica à margem nos recreios — está experienciando algo que o cérebro registra como dor física. O silêncio dele na sala não é apático: é o silêncio de quem já desistiu de tentar pertencer." },
    { titulo: "Por que o grupo de risco atrai mais do que a escola?", texto: "Gangues, turmas problemáticas e grupos de bullying atendem a mesma necessidade que ambientes saudáveis não estão oferecendo: pertencimento. Se a escola não cria vínculos legítimos, o aluno vai encontrá-los em outro lugar. A pergunta não é por que ele foi — é o que estava faltando aqui." },
  ],
  estima: [
    { titulo: "Por que falta de reconhecimento gera comportamento difícil?", texto: "A autoestima funciona como termostato interno. Quando está baixa, o cérebro interpreta situações cotidianas como ameaças ao valor pessoal. A frustração repetida dispara o mesmo sistema de estresse que uma ameaça física. Com o tempo, o cérebro começa a antecipar a falha antes de tentar — como proteção. O resultado é paralisia, agressividade defensiva ou busca de atenção pela via negativa." },
    { titulo: "Bagunça é pedido de reconhecimento mal formulado", texto: "O aluno que interrompe, que faz graça, que desafia — quase sempre está buscando uma coisa: ser visto. Se os caminhos legítimos para reconhecimento estão bloqueados, ele encontra os que funcionam. Interrupção funciona. Provocação funciona. O problema não é o método — é a necessidade não atendida por trás dele." },
    { titulo: "Por que humilhação pública tem efeito tão duradouro?", texto: "Quando um aluno é corrigido, punido ou exposto na frente dos outros, o cérebro registra isso como ameaça social grave. A memória emocional é mais duradoura do que a cognitiva — o aluno pode esquecer o conteúdo da aula, mas não vai esquecer como se sentiu. Esse é o motivo pelo qual relação precisa vir antes de instrução." },
  ],
  autorrealizacao: [
    { titulo: "Por que desengajamento gera sofrimento?", texto: "Quando o aluno não encontra conexão entre o que aprende e quem ele é, o cérebro descarta o conteúdo como irrelevante para a sobrevivência. Neurologicamente, falta de propósito reduz a produção de dopamina — o neurotransmissor da motivação. O que parece preguiça ou indiferença é frequentemente um sinal de que o potencial desse aluno nunca encontrou onde se encaixar." },
    { titulo: "Tédio crônico pode ser inteligência sem espaço", texto: "Um aluno que parece indiferente a tudo pode não estar desinteressado — pode estar subestimado. O currículo uniforme aplicado a talentos diferentes é uma forma sistemática de frustrar autorrealização. Antes de concluir que ele não quer nada, vale perguntar: o que já foi oferecido que despertou algo nele?" },
    { titulo: "Por que 'para que serve isso?' é pergunta séria, não desaforo?", texto: "Quando o aluno pergunta a utilidade do que aprende, ele está sinalizando a necessidade mais alta de Maslow: fazer sentido. O cérebro não investe atenção e memória em informação percebida como irrelevante. Conectar conteúdo à vida real não é facilitação — é neurociência aplicada." },
  ],
};

const FRASES_FINAIS = {
  fisiologica: [
    "Comportamento é sintoma. Antes de corrigir o que você vê, investigue o que está por baixo.",
    "Um aluno que não tem o básico atendido não está te desafiando — está sobrevivendo. Mude a pergunta.",
    "Antes de exigir presença, verifique se as condições para ela existem.",
  ],
  seguranca: [
    "Um aluno em modo de ameaça não consegue aprender. Sua primeira tarefa não é ensinar — é fazer ele se sentir seguro o suficiente para aprender.",
    "Rotina não é rigidez pedagógica. Para esse aluno, é remédio.",
    "O aluno que mais resiste à sua autoridade pode ser o que mais precisa de um adulto consistente na vida dele.",
  ],
  pertencimento: [
    "A gangue, o grupo da bagunça, o amigo problemático — todos atendem a mesma necessidade que a escola não está atendendo. Quem você quer que atenda primeiro?",
    "Nenhum aluno escolhe ser excluído. Ele só para de tentar pertencer quando já foi rejeitado vezes demais.",
    "O recreio conta. O que acontece fora da sua aula molda o que acontece dentro dela.",
  ],
  estima: [
    "O aluno que mais te desafia é quase sempre o que mais precisa de reconhecimento. Não é coincidência.",
    "Disciplina sem relação é só controle. E controle sem confiança não dura.",
    "O elogio certo, na hora certa, para a pessoa certa, vale mais do que qualquer metodologia.",
  ],
  autorrealizacao: [
    "Quando um aluno para de tentar, não é preguiça — é proteção. Ele decidiu que não tentar dói menos do que tentar e falhar.",
    "Tédio crônico não é falta de interesse. É inteligência esperando um problema à altura.",
    "Sua aula não precisa ser a resposta para esse aluno. Mas pode ser o lugar onde ele encontra a pergunta certa.",
  ],
};



function detectarSinais(texto, necessidade) {
  const lower = texto.toLowerCase();
  return SINAIS[necessidade].filter(s => s.palavras.some(p => lower.includes(p)));
}

function diagnose(text) {
  const lower = text.toLowerCase();
  const scores = {};
  for (const [need, words] of Object.entries(KEYWORDS)) {
    scores[need] = words.filter(w => lower.includes(w)).length;
  }

  const order = ["fisiologica","seguranca","pertencimento","estima","autorrealizacao"];
  
  // Pega top 2 com score > 0
  const ranked = order
    .map(need => ({ need, score: scores[need] }))
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score);

  // Se nenhum score, usa pertencimento e seguranca como default
  if (ranked.length === 0) {
    return ["seguranca", "pertencimento"];
  }
  if (ranked.length === 1) {
    // Segunda opção: vizinho mais próximo na hierarquia
    const idx = order.indexOf(ranked[0].need);
    const second = idx < order.length - 1 ? order[idx + 1] : order[idx - 1];
    return [ranked[0].need, second];
  }
  return [ranked[0].need, ranked[1].need];
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function App() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [escolha, setEscolha] = useState(null);
  const [phase, setPhase] = useState("input"); // input | opcoes | result

  const analyze = () => {
    if (input.trim().length < 15) return;
    const top2 = diagnose(input);
    setResult({ top2 });
    setPhase("opcoes");
  };

  const escolher = (need) => {
    setEscolha(need);
    setPhase("result");
  };

  const reset = () => {
    setInput("");
    setResult(null);
    setEscolha(null);
    setPhase("input");
  };

  const need = escolha ? NEEDS[escolha] : null;

  return (
    <div style={{ minHeight: "100vh", background: "#0d1826", color: "#f2f0eb" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        textarea { resize: none; font-family: 'DM Sans', sans-serif; }
        textarea:focus { outline: none; }
        textarea::placeholder { color: #3a5a7a; }
      `}</style>

      {/* Header */}
      <div style={{ padding: "20px 24px", borderBottom: "1px solid #1a2a4a", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 36, height: 36, background: "#1a2a4a", border: "1px solid #c8b89a55", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Serif Display'", fontSize: 20, color: "#c8b89a" }}>N</div>
        <div>
          <div style={{ fontFamily: "'DM Serif Display'", fontSize: 15 }}>Negociando com a Vida</div>
          <div style={{ fontSize: 10, color: "#4a6a8a", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'DM Sans'" }}>Leitura de Necessidades — Versão Professor</div>
        </div>
      </div>

      <div style={{ maxWidth: 620, margin: "0 auto", padding: "40px 20px 80px" }}>

        {/* FASE 1: INPUT */}
        {phase === "input" && (
          <>
            <div style={{ textAlign: "center", marginBottom: 36 }}>
              <div style={{ fontSize: 11, letterSpacing: "0.15em", color: "#c8b89a", marginBottom: 14, fontFamily: "'DM Sans'" }}>LEITURA TÁTICA DE COMPORTAMENTO</div>
              <h1 style={{ fontFamily: "'DM Serif Display'", fontSize: "clamp(30px,6vw,46px)", lineHeight: 1.2, marginBottom: 18 }}>O que você observou<br/>nesse aluno?</h1>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: "#8a9aaa", fontFamily: "'DM Sans'", maxWidth: 460, margin: "0 auto" }}>
                Descreva o comportamento. A ferramenta identifica as duas necessidades mais prováveis — e você decide qual faz mais sentido.
              </p>
            </div>

            <div style={{ background: "#1a2a4a", border: "1px solid #c8b89a22", borderRadius: 12, padding: "14px 20px", marginBottom: 28, display: "flex", gap: 14 }}>
              <span style={{ color: "#c8b89a", fontSize: 18, marginTop: 2 }}>◈</span>
              <p style={{ fontSize: 13, lineHeight: 1.65, color: "#8a9aaa", fontFamily: "'DM Sans'" }}>
                <span style={{ color: "#c8b89a", fontWeight: 600 }}>Princípio: </span>
                Comportamento é sintoma. Necessidade é causa. Você está prestes a olhar para a causa.
              </p>
            </div>

            <div style={{ background: "#111e30", border: "1px solid #1a2a4a", borderRadius: 14, padding: 22, marginBottom: 28 }}>
              <div style={{ fontSize: 10, letterSpacing: "0.12em", color: "#4a6a8a", fontFamily: "'DM Sans'", fontWeight: 600, marginBottom: 10 }}>DESCREVA O QUE OBSERVOU</div>
              <textarea
                rows={5}
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ex: O aluno não consegue ficar sentado, fica agitado o tempo todo e briga com os colegas por qualquer coisa..."
                style={{ width: "100%", background: "#0d1826", border: "1px solid #1a2a4a", borderRadius: 8, padding: 14, color: "#f2f0eb", fontSize: 15, lineHeight: 1.65 }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14 }}>
                <span style={{ fontSize: 12, color: "#4a6a8a", fontFamily: "'DM Sans'" }}>{input.length} caracteres</span>
                <button onClick={analyze} disabled={input.trim().length < 15}
                  style={{ background: input.trim().length < 15 ? "#2a3a4a" : "#c8b89a", color: input.trim().length < 15 ? "#4a6a8a" : "#0d1826", border: "none", borderRadius: 8, padding: "11px 22px", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", fontFamily: "'DM Sans'", cursor: input.trim().length < 15 ? "not-allowed" : "pointer" }}>
                  LER NECESSIDADE →
                </button>
              </div>
            </div>

            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 10, letterSpacing: "0.12em", color: "#4a6a8a", fontFamily: "'DM Sans'", fontWeight: 600, marginBottom: 12 }}>EXEMPLOS</div>
              {["O aluno ficou dormindo na aula, não respondeu quando chamei","Brigou com o colega sem motivo aparente, muito agressivo","Sempre sozinho no recreio, ninguém conversa com ele","Faz bagunça o tempo todo, parece querer chamar atenção","Não se interessa por nada, olha pro vácuo a aula toda"].map((ex, i) => (
                <div key={i} onClick={() => setInput(ex)}
                  style={{ padding: "10px 16px", background: "#111e3055", border: "1px solid #1a2a4a", borderRadius: 8, fontSize: 13, color: "#6a8aaa", fontFamily: "'DM Sans'", cursor: "pointer", fontStyle: "italic", marginBottom: 6 }}>
                  "{ex}"
                </div>
              ))}
              <div style={{ fontSize: 11, color: "#3a5a7a", fontFamily: "'DM Sans'", marginTop: 6, textAlign: "center" }}>clique em um exemplo para usar</div>
            </div>
          </>
        )}

        {/* FASE 2: ESCOLHA ENTRE AS 2 OPÇÕES */}
        {phase === "opcoes" && result && (
          <>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <div style={{ fontSize: 11, letterSpacing: "0.15em", color: "#c8b89a", marginBottom: 12, fontFamily: "'DM Sans'" }}>DUAS POSSIBILIDADES IDENTIFICADAS</div>
              <h2 style={{ fontFamily: "'DM Serif Display'", fontSize: 28, lineHeight: 1.3, marginBottom: 12 }}>Qual se encaixa melhor<br/>no que você observou?</h2>
              <p style={{ fontSize: 14, color: "#8a9aaa", fontFamily: "'DM Sans'", lineHeight: 1.6 }}>
                Você está na sala — tem informação que o algoritmo não tem.<br/>Escolha a que faz mais sentido.
              </p>
            </div>

            <div style={{ borderLeft: "3px solid #1a2a4a", paddingLeft: 18, marginBottom: 28 }}>
              <div style={{ fontSize: 10, letterSpacing: "0.12em", color: "#4a6a8a", fontFamily: "'DM Sans'", marginBottom: 6 }}>VOCÊ OBSERVOU</div>
              <p style={{ fontSize: 14, color: "#6a8aaa", fontFamily: "'DM Sans'", fontStyle: "italic" }}>"{input}"</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {result.top2.map((needKey, i) => {
                const n = NEEDS[needKey];
                const sinais = detectarSinais(input, needKey);
                return (
                  <button key={needKey} onClick={() => escolher(needKey)}
                    style={{ background: "#111e30", border: "1px solid " + n.color + "55", borderRadius: 14, padding: "20px 22px", cursor: "pointer", textAlign: "left", transition: "all 0.2s" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: sinais.length > 0 ? 12 : 0 }}>
                      <span style={{ fontSize: 28, color: n.color }}>{n.icon}</span>
                      <div>
                        <div style={{ fontSize: 10, color: "#4a6a8a", fontFamily: "'DM Sans'", letterSpacing: "0.1em", marginBottom: 3 }}>POSSIBILIDADE {i + 1}</div>
                        <div style={{ fontFamily: "'DM Serif Display'", fontSize: 18, color: n.color }}>{n.label}</div>
                      </div>
                    </div>
                    {sinais.length > 0 && (
                      <div style={{ borderTop: "1px solid #1a2a4a", paddingTop: 12 }}>
                        {sinais.slice(0,2).map((s, j) => (
                          <div key={j} style={{ fontSize: 13, color: "#8a9aaa", fontFamily: "'DM Sans'", lineHeight: 1.5, marginBottom: j < sinais.length - 1 ? 6 : 0 }}>
                            <span style={{ color: n.color }}>→ </span>{s.texto}: {s.impacto}
                          </div>
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div style={{ textAlign: "center", marginTop: 20 }}>
              <button onClick={reset} style={{ background: "transparent", color: "#4a6a8a", border: "none", fontSize: 12, fontFamily: "'DM Sans'", cursor: "pointer" }}>
                ← Voltar e reescrever
              </button>
            </div>
          </>
        )}

        {/* FASE 3: RESULTADO COMPLETO */}
        {phase === "result" && escolha && need && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 22px", background: "#111e30", border: "1px solid " + need.color + "66", borderRadius: 14, marginBottom: 24 }}>
              <span style={{ fontSize: 38, color: need.color }}>{need.icon}</span>
              <div>
                <div style={{ fontSize: 10, letterSpacing: "0.12em", color: "#4a6a8a", fontFamily: "'DM Sans'", marginBottom: 4 }}>NECESSIDADE SINALIZADA — NÍVEL {need.level} DE 5</div>
                <div style={{ fontFamily: "'DM Serif Display'", fontSize: 20, color: need.color }}>{need.label}</div>
              </div>
            </div>

            <div style={{ borderLeft: "3px solid #1a2a4a", paddingLeft: 18, marginBottom: 24 }}>
              <div style={{ fontSize: 10, letterSpacing: "0.12em", color: "#4a6a8a", fontFamily: "'DM Sans'", marginBottom: 6 }}>VOCÊ OBSERVOU</div>
              <p style={{ fontSize: 14, color: "#6a8aaa", fontFamily: "'DM Sans'", fontStyle: "italic" }}>"{input}"</p>
            </div>

            {/* Sinais */}
            {detectarSinais(input, escolha).length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 10, letterSpacing: "0.12em", color: "#4a6a8a", fontFamily: "'DM Sans'", fontWeight: 600, marginBottom: 14 }}>O QUE ESSE COMPORTAMENTO REVELA</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {detectarSinais(input, escolha).map((sinal, i) => (
                    <div key={i} style={{ background: "#111e30", border: "1px solid #1a2a4a", borderRadius: 12, overflow: "hidden" }}>
                      <div style={{ padding: "10px 18px", borderBottom: "1px solid #1a2a4a", display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: need.color, display: "inline-block", flexShrink: 0 }} />
                        <span style={{ fontFamily: "'DM Serif Display'", fontSize: 16, color: need.color }}>{sinal.texto}</span>
                      </div>
                      <div style={{ padding: "12px 18px" }}>
                        <p style={{ fontSize: 14, lineHeight: 1.65, color: "#a0b0c0", fontFamily: "'DM Sans'" }}>
                          <span style={{ color: "#c8b89a", fontWeight: 600 }}>Por que isso importa: </span>{sinal.impacto}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Por que acontece */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 10, letterSpacing: "0.12em", color: "#4a6a8a", fontFamily: "'DM Sans'", fontWeight: 600, marginBottom: 14 }}>POR QUE ISSO ACONTECE</div>
              <div style={{ background: "#111e30", border: "1px solid " + need.color + "33", borderRadius: 14, overflow: "hidden" }}>
                <div style={{ padding: "12px 20px", borderBottom: "1px solid #1a2a4a", background: need.color + "10" }}>
                  <span style={{ fontFamily: "'DM Serif Display'", fontSize: 16, color: need.color }}>{pick(POR_QUE[escolha]).titulo}</span>
                </div>
                <div style={{ padding: "16px 20px" }}>
                  <p style={{ fontSize: 14, lineHeight: 1.75, color: "#a0b0c0", fontFamily: "'DM Sans'" }}>{pick(POR_QUE[escolha]).texto}</p>
                </div>
              </div>
            </div>

            {/* Como agir */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 10, letterSpacing: "0.12em", color: "#4a6a8a", fontFamily: "'DM Sans'", fontWeight: 600, marginBottom: 14 }}>COMO AGIR</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {pick(ACOES[escolha]).map((a, i) => (
                  <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start", background: "#111e30", border: "1px solid #1a2a4a", borderRadius: 10, padding: "13px 18px" }}>
                    <span style={{ fontFamily: "'DM Serif Display'", fontSize: 22, color: need.color, minWidth: 18, flexShrink: 0 }}>{i + 1}</span>
                    <span style={{ fontSize: 14, lineHeight: 1.6, color: "#d0c8be", fontFamily: "'DM Sans'" }}>{a}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Frase final */}
            <div style={{ background: need.color + "15", border: "1px solid " + need.color + "33", borderRadius: 14, padding: "22px", marginBottom: 28 }}>
              <span style={{ fontFamily: "'DM Serif Display'", fontSize: 56, color: need.color, opacity: 0.5, display: "block", lineHeight: 0.8, marginBottom: 10 }}>"</span>
              <p style={{ fontFamily: "'DM Serif Display'", fontSize: 16, lineHeight: 1.7, fontStyle: "italic" }}>{pick(FRASES_FINAIS[escolha])}</p>
            </div>

            <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
              <button onClick={() => { setEscolha(null); setPhase("opcoes"); }} style={{ background: "transparent", color: "#7a9abf", border: "1px solid #7a9abf44", borderRadius: 8, padding: "11px 22px", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", fontFamily: "'DM Sans'", cursor: "pointer" }}>
                ↑ VER OUTRA POSSIBILIDADE
              </button>
              <button onClick={reset} style={{ background: "transparent", color: "#c8b89a", border: "1px solid #c8b89a33", borderRadius: 8, padding: "11px 22px", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", fontFamily: "'DM Sans'", cursor: "pointer" }}>
                ← OBSERVAR OUTRO ALUNO
              </button>
            </div>
          </>
        )}
      </div>

      <div style={{ textAlign: "center", padding: 20, fontSize: 11, color: "#2a3a4a", fontFamily: "'DM Sans'", borderTop: "1px solid #111e30" }}>
        Baseado em Maslow (1943) • Negociando com a Vida
      </div>
    </div>
  );
}

