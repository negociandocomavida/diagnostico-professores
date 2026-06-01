import { useState } from "react";

const NEEDS = {
  fisiologica: { label: "Necessidade Fisiológica", short: "Sobrevivência", color: "#c8b89a", icon: "◉", level: 1 },
  seguranca: { label: "Necessidade de Segurança", short: "Controle", color: "#e8c96a", icon: "◈", level: 2 },
  pertencimento: { label: "Necessidade de Amor e Pertencimento", short: "Conexão", color: "#7a9abf", icon: "◎", level: 3 },
  estima: { label: "Necessidade de Estima", short: "Reconhecimento", color: "#9ab87a", icon: "◇", level: 4 },
  autorrealizacao: { label: "Necessidade de Autorrealização", short: "Propósito", color: "#bf9a7a", icon: "◆", level: 5 },
};

const KEYWORDS = {
  fisiologica: ["fome","cansado","cansaço","sono","dor","doente","doença","exausto","exaustão","sem energia","corpo","durmo pouco","não consigo dormir","fraqueza","físico"],
  seguranca: ["medo","perder emprego","desemprego","dinheiro","instável","futuro","incerto","ansioso","ansiedade","ameaça","risco","crise","endividado","dívida","perder tudo","demitido","demissão"],
  pertencimento: ["sozinho","solidão","rejeitado","rejeição","excluído","exclusão","relacionamento","pertencer","amizade","distante","afastado","ninguém me entende","desconectado","não tenho amigos","me sinto só"],
  estima: ["reconhecimento","reconhecido","não sou reconhecido","valorizado","não sou valorizado","ignorado","humilhado","humilhação","injusto","injustiça","mérito","esforço","dedicação","dedicar","ninguém vê","frustrado","frustração","desrespeitado","inferior","incapaz","fracasso","advertido","advertência","não é justo","sem reconhecimento","invisível no trabalho"],
  autorrealizacao: ["propósito","sentido","vazio","potencial","realização","sonho","missão","significado","entediado","tédio","perdido","direção","quero mais","não sei o que quero","desperdiçando","estagnado"]
};

// Sinais específicos detectados no texto
const SINAIS = {
  fisiologica: [
    { palavras: ["durmo pouco","não consigo dormir","sono"], texto: "privação de sono", impacto: "compromete sua capacidade de raciocinar, regular emoções e agir com clareza" },
    { palavras: ["cansado","cansaço","exausto","exaustão","sem energia"], texto: "esgotamento físico", impacto: "quando o corpo está no limite, qualquer situação difícil parece impossível de resolver" },
    { palavras: ["dor","doente","doença"], texto: "condição física não atendida", impacto: "dor ou doença sequestram toda a atenção do organismo, deixando tudo o mais em segundo plano" },
    { palavras: ["fome"], texto: "privação alimentar", impacto: "sem combustível básico, o cérebro não consegue processar nada além da sobrevivência imediata" },
  ],
  seguranca: [
    { palavras: ["perder emprego","demitido","demissão","desemprego"], texto: "ameaça ao emprego", impacto: "a perda do emprego ativa o nível mais primitivo de alarme: a sobrevivência em risco" },
    { palavras: ["dinheiro","endividado","dívida"], texto: "instabilidade financeira", impacto: "quando as contas ameaçam, o cérebro entra em modo de emergência e para de pensar em qualquer outra coisa" },
    { palavras: ["ansioso","ansiedade","medo","ameaça"], texto: "estado de alerta constante", impacto: "viver em modo de ameaça esgota o sistema nervoso e distorce a leitura de qualquer situação" },
    { palavras: ["futuro","incerto","instável"], texto: "imprevisibilidade do futuro", impacto: "quando o amanhã é incerto, o organismo não consegue relaxar nem no presente" },
    { palavras: ["família","preocupado","preocupação"], texto: "preocupação com família", impacto: "sentir que as pessoas que você ama estão em risco ativa uma das ameaças mais profundas que existem" },
  ],
  pertencimento: [
    { palavras: ["sozinho","solidão"], texto: "solidão", impacto: "o isolamento ativa as mesmas regiões cerebrais que a dor física — não é metáfora, é fisiologia" },
    { palavras: ["rejeitado","rejeição","excluído","exclusão"], texto: "sensação de rejeição", impacto: "ser excluído por outros ativa no cérebro a mesma resposta que uma ameaça física" },
    { palavras: ["ninguém me entende","distante","afastado","desconectado"], texto: "desconexão relacional", impacto: "sentir que não há ninguém realmente presente para você é uma das formas mais silenciosas de sofrimento" },
    { palavras: ["relacionamento"], texto: "conflito relacional", impacto: "vínculos abalados comprometem a base emocional de onde você opera no dia a dia" },
  ],
  estima: [
    { palavras: ["reconhecido","não sou reconhecido","sem reconhecimento","ninguém vê"], texto: "falta de reconhecimento", impacto: "quando você se dedica e isso não é visto, sua autoestima vai sendo corroída por dentro, mesmo que discretamente" },
    { palavras: ["frustrado","frustração"], texto: "frustração acumulada", impacto: "a frustração repetida envia uma mensagem devastadora para sua mente: 'o que você faz não importa'" },
    { palavras: ["injusto","injustiça","não é justo"], texto: "sensação de injustiça", impacto: "injustiça fere a estima porque comunica que as regras não se aplicam a você — que você vale menos" },
    { palavras: ["dedicação","dedicar","esforço","mérito"], texto: "esforço não reconhecido", impacto: "dar o melhor de si sem retorno corrói a crença de que vale a pena continuar se esforçando" },
    { palavras: ["advertido","advertência","humilhado","humilhação","desrespeitado"], texto: "humilhação ou punição injusta", impacto: "ser punido injustamente destrói a confiança e faz você questionar seu lugar no ambiente" },
    { palavras: ["ignorado","invisível","invisível no trabalho"], texto: "invisibilidade", impacto: "não ser visto é uma das formas mais lentas e eficazes de destruir a autoestima de alguém" },
    { palavras: ["inferior","incapaz","fracasso"], texto: "sentimento de incapacidade", impacto: "quando a estima está baixa, sua mente começa a confirmar crenças negativas sobre você mesmo" },
  ],
  autorrealizacao: [
    { palavras: ["vazio","sentido","propósito","missão"], texto: "falta de propósito", impacto: "quando você não sabe mais por que faz o que faz, até as coisas que antes faziam sentido parecem ocas" },
    { palavras: ["entediado","tédio","estagnado"], texto: "estagnação", impacto: "a sensação de não estar crescendo vai corroendo a motivação dia a dia, mesmo sem uma causa visível" },
    { palavras: ["potencial","desperdiçando","não sei o que quero"], texto: "potencial bloqueado", impacto: "sentir que tem mais dentro de você do que está sendo usado é um dos sinais mais claros de que você está pronto para o próximo nível" },
    { palavras: ["sonho","realização","quero mais"], texto: "sonhos não realizados", impacto: "quando o que você sonhou ficou só no sonho, o presente começa a perder cor" },
  ],
};

const ACOES = {
  fisiologica: ["Antes de qualquer decisão importante, resolva o básico: durma, coma, cuide do corpo", "Identifique qual necessidade física está sendo sistematicamente ignorada na sua rotina", "Converse com alguém próximo sobre o que está te sobrecarregando fisicamente"],
  seguranca: ["Liste o que você PODE controlar agora — foque só nisso, ignora o resto por enquanto", "Crie uma rotina pequena e previsível para os próximos dias para ancorar sua segurança", "Converse abertamente com quem compartilha essa instabilidade — o silêncio amplifica o medo"],
  pertencimento: ["Entre em contato hoje com alguém que te faz bem — uma mensagem simples já quebra o isolamento", "Identifique onde você sente que pertence de verdade e vá até lá com mais frequência", "Se o conflito relacional tem um nome, considere abrir uma conversa honesta sobre o que está sentindo"],
  estima: ["Reconheça para si mesmo o que você fez bem recentemente — sem minimizar, sem relativizar", "Converse diretamente com quem não te reconheceu: às vezes invisibilidade é falta de atenção, não má vontade", "Avalie se o ambiente onde você está tem estrutura para reconhecer pessoas — se não tem, isso é informação importante"],
  autorrealizacao: ["Reserve tempo esta semana para algo que te faz perder a noção do tempo — sem justificar", "Pergunte a si mesmo: o que eu faria se soubesse que não ia falhar?", "Identifique o que está te impedindo de agir no seu potencial e trate isso como o problema real"],
};

const FRASES_FINAIS = {
  fisiologica: "Você não pode negociar com ninguém — nem consigo mesmo — quando o nível zero está no vermelho. Cuide do corpo primeiro.",
  seguranca: "Em terreno instável, você não precisa resolver tudo de uma vez. Só precisa encontrar o próximo ponto firme para pisar.",
  pertencimento: "Pertencer não é um luxo emocional. É a base sem a qual nada mais funciona direito.",
  estima: "Quem não se reconhece não consegue exigir reconhecimento do mundo. O primeiro passo começa dentro.",
  autorrealizacao: "O que você pode ser, você deve ser. Ignorar esse chamado não faz ele ir embora — só aumenta o ruído.",
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
  const sinaisEncontrados = [];
  for (const sinal of SINAIS[necessidade]) {
    if (sinal.palavras.some(p => lower.includes(p))) {
      sinaisEncontrados.push(sinal);
    }
  }
  return sinaisEncontrados;
}

function diagnose(text) {
  const lower = text.toLowerCase();
  const scores = {};
  for (const [need, words] of Object.entries(KEYWORDS)) {
    scores[need] = words.filter(w => lower.includes(w)).length;
  }
  const order = ["autorrealizacao","estima","pertencimento","seguranca","fisiologica"];
  let best = "estima";
  let bestScore = -1;
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
          <div style={{ fontSize: 10, color: "#4a6a8a", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'DM Sans'" }}>Diagnóstico de Necessidades</div>
        </div>
      </div>

      <div style={{ maxWidth: 620, margin: "0 auto", padding: "40px 20px 80px" }}>

        {phase === "input" && (
          <>
            <div style={{ textAlign: "center", marginBottom: 36 }}>
              <div style={{ fontSize: 11, letterSpacing: "0.15em", color: "#c8b89a", marginBottom: 14, fontFamily: "'DM Sans'" }}>ENTENDA O QUE ESTÁ ACONTECENDO</div>
              <h1 style={{ fontFamily: "'DM Serif Display'", fontSize: "clamp(34px,7vw,50px)", lineHeight: 1.2, marginBottom: 18 }}>O que você está<br/>sentindo agora?</h1>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: "#8a9aaa", fontFamily: "'DM Sans'", maxWidth: 440, margin: "0 auto" }}>
                Descreva com suas palavras. A ferramenta identifica qual necessidade humana está afetada — e explica como ela impacta você.
              </p>
            </div>

            <div style={{ background: "#111e30", border: "1px solid #1a2a4a", borderRadius: 14, padding: 22, marginBottom: 28 }}>
              <div style={{ fontSize: 10, letterSpacing: "0.12em", color: "#4a6a8a", fontFamily: "'DM Sans'", fontWeight: 600, marginBottom: 10 }}>ESCREVA AQUI</div>
              <textarea
                rows={6}
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ex: Sinto que não sou reconhecido no trabalho. Dou tudo de mim e parece que ninguém vê..."
                style={{ width: "100%", background: "#0d1826", border: "1px solid #1a2a4a", borderRadius: 8, padding: 14, color: "#f2f0eb", fontSize: 15, lineHeight: 1.65 }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14 }}>
                <span style={{ fontSize: 12, color: "#4a6a8a", fontFamily: "'DM Sans'" }}>{input.length} caracteres</span>
                <button
                  onClick={analyze}
                  disabled={input.trim().length < 15}
                  style={{ background: input.trim().length < 15 ? "#2a3a4a" : "#c8b89a", color: input.trim().length < 15 ? "#4a6a8a" : "#0d1826", border: "none", borderRadius: 8, padding: "11px 22px", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", fontFamily: "'DM Sans'", cursor: input.trim().length < 15 ? "not-allowed" : "pointer" }}
                >
                  ANALISAR →
                </button>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 5, opacity: 0.4 }}>
              {Object.entries(NEEDS).reverse().map(([k, n]) => (
                <div key={k} style={{ display: "flex", alignItems: "center", gap: 12, padding: "7px 16px", borderLeft: "2px solid " + n.color, background: "#111e3055", borderRadius: "0 8px 8px 0" }}>
                  <span style={{ color: n.color, fontSize: 13 }}>{n.icon}</span>
                  <span style={{ fontSize: 12, color: "#8a9aaa", fontFamily: "'DM Sans'" }}>{n.short}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {phase === "result" && result && need && (
          <>
            {/* Badge */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 22px", background: "#111e30", border: "1px solid " + need.color + "66", borderRadius: 14, marginBottom: 24 }}>
              <span style={{ fontSize: 38, color: need.color }}>{need.icon}</span>
              <div>
                <div style={{ fontSize: 10, letterSpacing: "0.12em", color: "#4a6a8a", fontFamily: "'DM Sans'", marginBottom: 4 }}>NECESSIDADE AFETADA — NÍVEL {need.level} DE 5</div>
                <div style={{ fontFamily: "'DM Serif Display'", fontSize: 20, color: need.color }}>{need.label}</div>
              </div>
            </div>

            {/* Sinais detectados */}
            {result.sinais.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 10, letterSpacing: "0.12em", color: "#4a6a8a", fontFamily: "'DM Sans'", fontWeight: 600, marginBottom: 14 }}>O QUE SEU RELATO REVELA</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {result.sinais.map((sinal, i) => (
                    <div key={i} style={{ background: "#111e30", border: "1px solid #1a2a4a", borderRadius: 12, overflow: "hidden" }}>
                      <div style={{ padding: "10px 18px", borderBottom: "1px solid #1a2a4a", display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: need.color, display: "inline-block", flexShrink: 0 }} />
                        <span style={{ fontFamily: "'DM Serif Display'", fontSize: 16, color: need.color }}>{sinal.texto}</span>
                      </div>
                      <div style={{ padding: "12px 18px" }}>
                        <p style={{ fontSize: 14, lineHeight: 1.65, color: "#a0b0c0", fontFamily: "'DM Sans'" }}>
                          <span style={{ color: "#c8b89a", fontWeight: 600 }}>Como isso afeta você: </span>
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

            {/* O que fazer */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 10, letterSpacing: "0.12em", color: "#4a6a8a", fontFamily: "'DM Sans'", fontWeight: 600, marginBottom: 14 }}>O QUE VOCÊ PODE FAZER</div>
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
                ← ANALISAR OUTRO SENTIMENTO
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

