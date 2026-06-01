import { useState } from "react";

const NEEDS = {
  fisiologica: { label: "Necessidade Fisiológica", short: "Sobrevivência", color: "#c8b89a", icon: "◉", level: 1 },
  seguranca: { label: "Necessidade de Segurança", short: "Controle", color: "#e8c96a", icon: "◈", level: 2 },
  pertencimento: { label: "Necessidade de Amor e Pertencimento", short: "Conexão", color: "#7a9abf", icon: "◎", level: 3 },
  estima: { label: "Necessidade de Estima", short: "Reconhecimento", color: "#9ab87a", icon: "◇", level: 4 },
  autorrealizacao: { label: "Necessidade de Autorrealização", short: "Propósito", color: "#bf9a7a", icon: "◆", level: 5 },
};

const KEYWORDS = {
  fisiologica: ["dormindo","dormiu","sono","bocejando","cansado","fraco","fome","não comeu","dor","doente","cabeça","sem energia","lento","lerdo","pálido","dorme na aula","sem forças"],
  seguranca: ["agitado","nervoso","ansioso","assustado","chorando","choro","trêmulo","mudança","rotina","medo","nova escola","novo professor","transferido","separação","brigas","briga em casa","imprevisto","explodiu","mudou de comportamento","com medo","agressivo","violento"],
  pertencimento: ["sozinho","isolado","ninguém conversa","excluído","grupo","amigos","não tem amigos","bullying","ignorado","não se encaixa","sempre sozinho","afastado","rejeição","rejeitado","não é convidado","come sozinho","não quer se relacionar","não conversa","se afastou","não interage","sem amigos","ficou sozinho"],
  estima: ["bagunça","palhaço","provoca","desafia","interrompe","chama atenção","grita","faz graça","indisciplina","responde","enfrenta","empurra","xinga","humilhado","vergonha","chora quando erra","desiste fácil","não tenta","diz que é burro","não consigo","ofendido","insultado","chamaram de"],
  autorrealizacao: ["entediado","tédio","não se interessa","desligado","olha pro vácuo","desmotivado","sem interesse","não liga","indiferente","não vejo sentido","para que serve isso","apático com tudo"],
};

const SINAIS = {
  fisiologica: [
    { palavras: ["dormindo","dormiu","bocejando","sono"], texto: "sinais de privação de sono", impacto: "um aluno sem sono não consegue processar informação — o cérebro literalmente não forma memórias em estado de privação" },
    { palavras: ["fome","não comeu"], texto: "possível privação alimentar", impacto: "fome ativa o sistema de sobrevivência — aprender se torna impossível quando o organismo está buscando energia básica" },
    { palavras: ["cansado","sem energia","lento","lerdo","fraco","apático"], texto: "esgotamento físico", impacto: "corpo esgotado não tem recursos para sustentar atenção — o que parece desinteresse pode ser exaustão" },
    { palavras: ["dor","doente","cabeça","pálido"], texto: "desconforto físico não atendido", impacto: "dor ou doença sequestram toda a atenção disponível — nenhum conteúdo consegue competir com isso" },
  ],
  seguranca: [
    { palavras: ["agitado","nervoso","ansioso","trêmulo"], texto: "estado de alerta elevado", impacto: "aluno em modo de ameaça não consegue aprender — o cérebro em alarme prioriza sobrevivência, não cognição" },
    { palavras: ["chorando","choro"], texto: "ruptura emocional visível", impacto: "choro em sala raramente é sobre o conteúdo — quase sempre é sinal de que algo no mundo dele está instável" },
    { palavras: ["mudança","rotina","nova escola","novo professor","transferido"], texto: "ruptura de rotina ou ambiente", impacto: "crianças dependem de previsibilidade para se sentirem seguras — qualquer mudança abrupta pode desestabilizar completamente" },
    { palavras: ["separação","brigas","briga em casa"], texto: "instabilidade no ambiente familiar", impacto: "o que acontece em casa chega na sala de aula — aluno com família em crise opera em modo de emergência constante" },
    { palavras: ["explodiu","mudou de comportamento","imprevisto"], texto: "reação desproporcional a imprevistos", impacto: "explodir diante de mudanças pequenas é sinal clássico de que a necessidade de segurança está muito ameaçada" },
  ],
  pertencimento: [
    { palavras: ["sozinho","sempre sozinho","come sozinho"], texto: "isolamento social", impacto: "isolamento ativa as mesmas regiões cerebrais que a dor física — aluno sozinho está literalmente sofrendo, não apenas tímido" },
    { palavras: ["excluído","não é convidado","rejeitado","rejeição"], texto: "exclusão pelo grupo", impacto: "ser excluído pelo grupo é uma das experiências mais devastadoras para um adolescente — pode ser a raiz de vários comportamentos problemáticos" },
    { palavras: ["bullying","ignorado pelos colegas"], texto: "possível situação de bullying", impacto: "vítima de bullying carrega um peso invisível — o que parece apatia ou agressividade pode ser resposta a um sofrimento que ele não sabe nomear" },
    { palavras: ["não tem amigos","afastado","não se encaixa"], texto: "dificuldade de pertencimento ao grupo", impacto: "quando o aluno não encontra lugar no grupo legítimo da escola, ele vai buscar pertencimento em outro lugar — às vezes em lugares de risco" },
  ],
  estima: [
    { palavras: ["bagunça","palhaço","faz graça","chama atenção","grita"], texto: "busca de reconhecimento por via negativa", impacto: "aluno que bagunça quase sempre está buscando reconhecimento — é a única via que ele descobriu que funciona para ser visto" },
    { palavras: ["desafia","enfrenta","responde","indisciplina"], texto: "desafio à autoridade como defesa da estima", impacto: "desafiar o professor pode ser proteção — se ele testa antes de ser humilhado, mantém o controle sobre sua própria imagem" },
    { palavras: ["agressivo com colega","briga","empurra","xinga"], texto: "agressividade como afirmação de valor", impacto: "agressão física frequentemente é tentativa de estabelecer status quando outros caminhos de reconhecimento estão bloqueados" },
    { palavras: ["humilhado","vergonha"], texto: "estima ferida publicamente", impacto: "humilhação pública destrói a confiança e contamina toda a relação com o ambiente — demora muito para se reconstruir" },
    { palavras: ["não tenta","desiste fácil","diz que é burro","não consigo","chora quando erra"], texto: "crença de incapacidade instalada", impacto: "quando o aluno para de tentar, é porque já concluiu que não vai conseguir — é proteção contra a dor de falhar novamente" },
  ],
  autorrealizacao: [
    { palavras: ["entediado","tédio","não se interessa","sem interesse"], texto: "desconexão com o conteúdo", impacto: "tédio crônico pode ser sinal de que o aluno está além do nível do conteúdo ou que nunca encontrou onde seu potencial se encaixa" },
    { palavras: ["desligado","olha pro vácuo","não participa","indiferente"], texto: "desengajamento total", impacto: "aluno desligado já saiu emocionalmente da sala — o corpo está presente mas ele já foi embora. É o sinal mais urgente de todos" },
    { palavras: ["não vejo sentido","para que serve isso","não quer nada"], texto: "falta de propósito percebido", impacto: "quando o aluno não enxerga conexão entre o que aprende e sua vida, o cérebro descarta o conteúdo como irrelevante" },
  ],
};

const ACOES = {
  fisiologica: [
    "Antes de qualquer intervenção pedagógica, verifique as condições básicas — converse em particular e pergunte diretamente se ele dormiu e comeu",
    "Acione a equipe de apoio escolar ou assistência social se identificar privação sistemática — isso é responsabilidade institucional, não só sua",
    "Crie um momento de acolhimento no início da aula — alunos no nível zero precisam de pausa antes de conseguir aprender qualquer coisa",
  ],
  seguranca: [
    "Mantenha a rotina da sua aula o mais previsível possível — para alunos em insegurança, saber o que vem a seguir é âncora",
    "Converse em particular, sem pressão — não para resolver o problema familiar, mas para comunicar que você viu e que ele não está invisível",
    "Avise sobre qualquer mudança com antecedência — para esse aluno, surpresa é ameaça, não diversão",
  ],
  pertencimento: [
    "Crie oportunidades estruturadas de conexão — trabalhos em dupla ou grupo onde ele tenha papel definido e necessário",
    "Observe os recreios e momentos livres — isolamento nesses momentos é dado clínico, não opção pessoal",
    "Se há bullying envolvido, acione o protocolo institucional imediatamente — não é problema que a sala resolve sozinha",
  ],
  estima: [
    "Encontre algo genuíno para reconhecer nesse aluno publicamente — não elogio vazio, algo real que ele fez ou é",
    "Nunca o corrija ou discipline publicamente se puder evitar — a plateia amplifica a humilhação e cria ferida duradoura",
    "Dê a ele um papel de responsabilidade na sala — algo que comunique 'você tem valor aqui'",
  ],
  autorrealizacao: [
    "Converse com ele sobre o que faz fora da escola — às vezes o potencial está em lugar que o currículo nunca tocou",
    "Conecte o conteúdo à vida real dele — um exemplo concreto do 'para que serve' pode reacender o engajamento",
    "Proponha um desafio além do básico — aluno desengajado por tédio precisa de mais complexidade, não menos",
  ],
};

const FRASES_FINAIS = {
  fisiologica: "Comportamento é sintoma. Antes de corrigir o que você vê, investigue o que está por baixo.",
  seguranca: "Um aluno em modo de ameaça não consegue aprender. Sua primeira tarefa não é ensinar — é fazer ele se sentir seguro o suficiente para aprender.",
  pertencimento: "A gangue, o grupo da bagunça, o amigo problemático — todos atendem a mesma necessidade que a escola não está atendendo. Quem você quer que atenda primeiro?",
  estima: "O aluno que mais te desafia é quase sempre o que mais precisa de reconhecimento. Não é coincidência.",
  autorrealizacao: "Quando um aluno para de tentar, não é preguiça — é proteção. Ele decidiu que não tentar dói menos do que tentar e falhar.",
};


const POR_QUE = {
  fisiologica: {
    titulo: "Por que o corpo reage assim?",
    texto: "Quando necessidades físicas básicas não são atendidas — sono, alimentação, ausência de dor — o cérebro entra em modo de sobrevivência. O córtex pré-frontal, responsável pelo raciocínio e autocontrole, reduz sua atividade. O que assume o comando é a amígdala: a parte mais primitiva do cérebro, que só conhece ameaça e resposta. Nesse estado, não existe capacidade real de aprender, planejar ou se relacionar bem. Não é fraqueza — é fisiologia. O organismo está fazendo exatamente o que foi programado para fazer: sobreviver primeiro."
  },
  seguranca: {
    titulo: "Por que a mente reage assim?",
    texto: "Quando o ambiente é imprevisível ou ameaçador, o sistema nervoso dispara cortisol — o hormônio do estresse. Em doses pequenas, ele aumenta a atenção. Em doses altas e contínuas, ele destrói a capacidade de pensar com clareza, dormir bem e confiar nas pessoas. O cérebro passa a varrer o ambiente em busca de perigos o tempo todo, mesmo quando não há nenhum. É por isso que quem está em insegurança enxerga ameaça em situações neutras, reage de forma desproporcional e tem dificuldade de se concentrar em qualquer outra coisa."
  },
  pertencimento: {
    titulo: "Por que a ausência de conexão dói tanto?",
    texto: "Estudos de neuroimagem mostram que rejeição social ativa as mesmas regiões cerebrais que a dor física. Não é exagero — é literalmente a mesma experiência neurológica. Isso faz sentido evolutivo: para nossos ancestrais, ser excluído do grupo significava morte. O cérebro nunca atualizou esse sistema. Por isso solidão e rejeição não são apenas emoções desconfortáveis — são sinais de alarme profundos que comprometem o sono, o humor, a imunidade e a capacidade de tomar boas decisões."
  },
  estima: {
    titulo: "Por que falta de reconhecimento afeta tanto?",
    texto: "A autoestima funciona como um termostato interno de segurança social. Quando é alta, a pessoa age, arrisca, se expõe. Quando é baixa, o cérebro interpreta situações cotidianas como ameaças ao valor pessoal. A frustração repetida — especialmente quando acompanhada de injustiça — dispara o mesmo sistema de estresse que uma ameaça física. Com o tempo, o cérebro começa a antecipar a falha antes mesmo de tentar, como mecanismo de proteção. O resultado é a paralisia, a agressividade defensiva ou o esforço invisível de quem age mas nunca acredita que vai ser suficiente."
  },
  autorrealizacao: {
    titulo: "Por que não realizar o potencial gera sofrimento?",
    texto: "Maslow foi direto: o que o homem pode ser, ele deve ser. Quando uma pessoa tem suas necessidades básicas razoavelmente atendidas mas não encontra espaço para expressar seu potencial, surge um estado de inquietação persistente que nenhuma conquista material resolve. Neurologicamente, falta de propósito reduz a produção de dopamina — o neurotransmissor da motivação e do sentido. A pessoa funciona, mas não vive. Age, mas não se move. É um sofrimento silencioso e difícil de nomear, exatamente porque tudo parece estar bem por fora."
  }
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
  let best = "pertencimento";
  let bestScore = 0;
  for (const need of order) {
    if (scores[need] > bestScore) {
      bestScore = scores[need];
      best = need;
    }
  }
  return best;
}

export default function App() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [phase, setPhase] = useState("input");

  const analyze = () => {
    if (input.trim().length < 15) return;
    const necessidade = diagnose(input);
    const sinais = detectarSinais(input, necessidade);
    setResult({ necessidade, sinais });
    setPhase("result");
  };

  const reset = () => {
    setInput("");
    setResult(null);
    setPhase("input");
  };

  const need = result ? NEEDS[result.necessidade] : null;

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

        {phase === "input" && (
          <>
            <div style={{ textAlign: "center", marginBottom: 36 }}>
              <div style={{ fontSize: 11, letterSpacing: "0.15em", color: "#c8b89a", marginBottom: 14, fontFamily: "'DM Sans'" }}>LEITURA TÁTICA DE COMPORTAMENTO</div>
              <h1 style={{ fontFamily: "'DM Serif Display'", fontSize: "clamp(30px,6vw,46px)", lineHeight: 1.2, marginBottom: 18 }}>O que você observou<br/>nesse aluno?</h1>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: "#8a9aaa", fontFamily: "'DM Sans'", maxWidth: 460, margin: "0 auto" }}>
                Descreva o comportamento que chamou sua atenção. A ferramenta identifica qual necessidade humana está por trás — e como agir.
              </p>
            </div>

            {/* Aviso tático */}
            <div style={{ background: "#1a2a4a", border: "1px solid #c8b89a22", borderRadius: 12, padding: "16px 20px", marginBottom: 28, display: "flex", gap: 14, alignItems: "flex-start" }}>
              <span style={{ color: "#c8b89a", fontSize: 20, marginTop: 2 }}>◈</span>
              <p style={{ fontSize: 13, lineHeight: 1.65, color: "#8a9aaa", fontFamily: "'DM Sans'" }}>
                <span style={{ color: "#c8b89a", fontWeight: 600 }}>Princípio do negociador: </span>
                Comportamento é sintoma. Necessidade é causa. Você está prestes a olhar para a causa.
              </p>
            </div>

            <div style={{ background: "#111e30", border: "1px solid #1a2a4a", borderRadius: 14, padding: 22, marginBottom: 28 }}>
              <div style={{ fontSize: 10, letterSpacing: "0.12em", color: "#4a6a8a", fontFamily: "'DM Sans'", fontWeight: 600, marginBottom: 10 }}>DESCREVA O QUE OBSERVOU</div>
              <textarea
                rows={6}
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ex: O aluno ficou quieto a aula toda, não participou de nada, estava olhando pro vácuo. Quando perguntei se estava bem, desviou o olhar..."
                style={{ width: "100%", background: "#0d1826", border: "1px solid #1a2a4a", borderRadius: 8, padding: 14, color: "#f2f0eb", fontSize: 15, lineHeight: 1.65 }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14 }}>
                <span style={{ fontSize: 12, color: "#4a6a8a", fontFamily: "'DM Sans'" }}>{input.length} caracteres</span>
                <button
                  onClick={analyze}
                  disabled={input.trim().length < 15}
                  style={{ background: input.trim().length < 15 ? "#2a3a4a" : "#c8b89a", color: input.trim().length < 15 ? "#4a6a8a" : "#0d1826", border: "none", borderRadius: 8, padding: "11px 22px", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", fontFamily: "'DM Sans'", cursor: input.trim().length < 15 ? "not-allowed" : "pointer" }}
                >
                  LER NECESSIDADE →
                </button>
              </div>
            </div>

            {/* Exemplos */}
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 10, letterSpacing: "0.12em", color: "#4a6a8a", fontFamily: "'DM Sans'", fontWeight: 600, marginBottom: 12 }}>EXEMPLOS DO QUE VOCÊ PODE DESCREVER</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  "Ficou dormindo na aula, não respondeu quando chamei",
                  "Brigou com o colega sem motivo aparente, muito agressivo",
                  "Sempre sozinho no recreio, ninguém conversa com ele",
                  "Faz bagunça o tempo todo, parece querer chamar atenção",
                  "Não se interessa por nada, olha pro vácuo a aula toda",
                ].map((ex, i) => (
                  <div
                    key={i}
                    onClick={() => setInput(ex)}
                    style={{ padding: "10px 16px", background: "#111e3055", border: "1px solid #1a2a4a", borderRadius: 8, fontSize: 13, color: "#6a8aaa", fontFamily: "'DM Sans'", cursor: "pointer", fontStyle: "italic" }}
                  >
                    "{ex}"
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 11, color: "#3a5a7a", fontFamily: "'DM Sans'", marginTop: 8, textAlign: "center" }}>clique em um exemplo para usar</div>
            </div>
          </>
        )}

        {phase === "result" && result && need && (
          <>
            {/* Badge */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 22px", background: "#111e30", border: "1px solid " + need.color + "66", borderRadius: 14, marginBottom: 24 }}>
              <span style={{ fontSize: 38, color: need.color }}>{need.icon}</span>
              <div>
                <div style={{ fontSize: 10, letterSpacing: "0.12em", color: "#4a6a8a", fontFamily: "'DM Sans'", marginBottom: 4 }}>NECESSIDADE SINALIZADA — NÍVEL {need.level} DE 5</div>
                <div style={{ fontFamily: "'DM Serif Display'", fontSize: 20, color: need.color }}>{need.label}</div>
              </div>
            </div>

            {/* O que você observou */}
            <div style={{ borderLeft: "3px solid #1a2a4a", paddingLeft: 18, marginBottom: 24 }}>
              <div style={{ fontSize: 10, letterSpacing: "0.12em", color: "#4a6a8a", fontFamily: "'DM Sans'", marginBottom: 6 }}>VOCÊ OBSERVOU</div>
              <p style={{ fontSize: 14, lineHeight: 1.65, color: "#6a8aaa", fontFamily: "'DM Sans'", fontStyle: "italic" }}>"{input}"</p>
            </div>

            {/* Sinais detectados */}
            {result.sinais.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 10, letterSpacing: "0.12em", color: "#4a6a8a", fontFamily: "'DM Sans'", fontWeight: 600, marginBottom: 14 }}>O QUE ESSE COMPORTAMENTO REVELA</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {result.sinais.map((sinal, i) => (
                    <div key={i} style={{ background: "#111e30", border: "1px solid #1a2a4a", borderRadius: 12, overflow: "hidden" }}>
                      <div style={{ padding: "10px 18px", borderBottom: "1px solid #1a2a4a", display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: need.color, display: "inline-block", flexShrink: 0 }} />
                        <span style={{ fontFamily: "'DM Serif Display'", fontSize: 16, color: need.color }}>{sinal.texto}</span>
                      </div>
                      <div style={{ padding: "12px 18px" }}>
                        <p style={{ fontSize: 14, lineHeight: 1.65, color: "#a0b0c0", fontFamily: "'DM Sans'" }}>
                          <span style={{ color: "#c8b89a", fontWeight: 600 }}>Por que isso importa: </span>
                          {sinal.impacto}
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
                  <span style={{ fontFamily: "'DM Serif Display'", fontSize: 16, color: need.color }}>{POR_QUE[result.necessidade].titulo}</span>
                </div>
                <div style={{ padding: "16px 20px" }}>
                  <p style={{ fontSize: 14, lineHeight: 1.75, color: "#a0b0c0", fontFamily: "'DM Sans'" }}>{POR_QUE[result.necessidade].texto}</p>
                </div>
              </div>
            </div>

            {/* Como agir */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 10, letterSpacing: "0.12em", color: "#4a6a8a", fontFamily: "'DM Sans'", fontWeight: 600, marginBottom: 14 }}>COMO AGIR</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {ACOES[result.necessidade].map((a, i) => (
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
              <p style={{ fontFamily: "'DM Serif Display'", fontSize: 16, lineHeight: 1.7, fontStyle: "italic" }}>{FRASES_FINAIS[result.necessidade]}</p>
            </div>

            <div style={{ textAlign: "center" }}>
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

