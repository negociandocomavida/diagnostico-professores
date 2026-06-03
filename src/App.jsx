import { useState } from "react";

const SUPABASE_URL = "https://fqtofzjtbcyocrsibahn.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxdG9memp0YmN5b2Nyc2liYWhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0NjMxOTcsImV4cCI6MjA5NjAzOTE5N30.SKWTkN4ukO_qNzmib7bvKAMZZo1uk-09uMVctXWSkCs";

async function salvarFeedback(necessidade, textoUsuario, fb, comentario) {
  try {
    await fetch(SUPABASE_URL + "/rest/v1/feedbacks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_KEY,
        "Authorization": "Bearer " + SUPABASE_KEY,
        "Prefer": "return=minimal"
      },
      body: JSON.stringify({
        site: "aluno",
        necessidade,
        texto_usuario: textoUsuario,
        feedback: fb,
        comentario
      })
    });
  } catch(e) {
    console.error("Erro ao salvar:", e);
  }
}

const NEEDS = {
  fisiologica: { label: "Necessidade Fisiológica", short: "Sobrevivência", color: "#c8b89a", icon: "◉", level: 1 },
  seguranca: { label: "Necessidade de Segurança", short: "Controle", color: "#e8c96a", icon: "◈", level: 2 },
  pertencimento: { label: "Necessidade de Amor e Pertencimento", short: "Conexão", color: "#7a9abf", icon: "◎", level: 3 },
  estima: { label: "Necessidade de Estima", short: "Reconhecimento", color: "#9ab87a", icon: "◇", level: 4 },
  autorrealizacao: { label: "Necessidade de Autorrealização", short: "Propósito", color: "#bf9a7a", icon: "◆", level: 5 },
};

const KEYWORDS = {
  fisiologica: ["fome","cansado","cansaço","sono","dor","doente","doença","exausto","exaustão","sem energia","corpo","durmo pouco","não consigo dormir","fraqueza","físico","calor","frio","sede","mal","enjoado","tontura","não dormi"],
  seguranca: ["medo","perder emprego","desemprego","dinheiro","instável","futuro","incerto","ansioso","ansiedade","ameaça","risco","crise","endividado","dívida","perder tudo","demitido","demissão","preocupado","preocupação","família","inseguro","incerteza","separação","divórcio","perda"],
  pertencimento: ["sozinho","solidão","rejeitado","rejeição","excluído","exclusão","relacionamento","pertencer","amizade","distante","afastado","ninguém me entende","desconectado","não tenho amigos","me sinto só","isolado","abandono","abandonado","sem ninguém","ninguém liga"],
  estima: ["reconhecimento","reconhecido","não sou reconhecido","valorizado","não sou valorizado","ignorado","humilhado","humilhação","injusto","injustiça","mérito","esforço","dedicação","dedicar","ninguém vê","frustrado","frustração","desrespeitado","inferior","incapaz","fracasso","advertido","advertência","não é justo","sem reconhecimento","invisível","menosprezado","subestimado"],
  autorrealizacao: ["propósito","sentido","vazio","potencial","realização","sonho","missão","significado","entediado","tédio","perdido","direção","quero mais","não sei o que quero","desperdiçando","estagnado","sem rumo","não me realizo","poderia ser mais"],
};

const SINAIS = {
  fisiologica: [
    { palavras: ["durmo pouco","não consigo dormir","sono","não dormi"], texto: "privação de sono", impacto: "sem sono o cérebro não consolida memória nem regula emoções — qualquer situação vira sobrecarga" },
    { palavras: ["cansado","cansaço","exausto","exaustão","sem energia","fraqueza"], texto: "esgotamento físico", impacto: "quando o corpo está no limite, qualquer situação difícil parece impossível de resolver" },
    { palavras: ["dor","doente","doença","mal","enjoado","tontura"], texto: "desconforto físico não atendido", impacto: "dor ou doença sequestram toda a atenção do organismo, deixando tudo o mais em segundo plano" },
    { palavras: ["fome","calor","frio","sede"], texto: "necessidade física básica não atendida", impacto: "sem o básico resolvido, o cérebro não consegue processar nada além da sobrevivência imediata" },
  ],
  seguranca: [
    { palavras: ["perder emprego","demitido","demissão","desemprego"], texto: "ameaça ao emprego", impacto: "a perda do emprego ativa o nível mais primitivo de alarme — a sobrevivência em risco" },
    { palavras: ["dinheiro","endividado","dívida","crise"], texto: "instabilidade financeira", impacto: "quando as contas ameaçam, o cérebro entra em modo de emergência e para de pensar em qualquer outra coisa" },
    { palavras: ["ansioso","ansiedade","medo","ameaça","inseguro"], texto: "estado de alerta constante", impacto: "viver em modo de ameaça esgota o sistema nervoso e distorce a leitura de qualquer situação" },
    { palavras: ["futuro","incerto","instável","incerteza","sem rumo"], texto: "imprevisibilidade do futuro", impacto: "quando o amanhã é incerto, o organismo não consegue relaxar nem no presente" },
    { palavras: ["família","preocupado","preocupação","separação","divórcio","perda"], texto: "ameaça a pessoas importantes", impacto: "sentir que quem você ama está em risco ativa uma das ameaças mais profundas que existem" },
  ],
  pertencimento: [
    { palavras: ["sozinho","solidão","isolado","sem ninguém"], texto: "solidão", impacto: "o isolamento ativa as mesmas regiões cerebrais que a dor física — não é metáfora, é fisiologia" },
    { palavras: ["rejeitado","rejeição","excluído","exclusão","abandono","abandonado"], texto: "sensação de rejeição", impacto: "ser excluído ativa no cérebro a mesma resposta que uma ameaça física — o sistema nervoso não diferencia" },
    { palavras: ["ninguém me entende","distante","afastado","desconectado","ninguém liga"], texto: "desconexão relacional", impacto: "sentir que não há ninguém realmente presente para você é uma das formas mais silenciosas de sofrimento" },
    { palavras: ["não tenho amigos","me sinto só","sem amigos"], texto: "ausência de vínculos", impacto: "vínculos não são luxo — são necessidade estrutural. Sem eles, o funcionamento emocional e cognitivo se deteriora" },
  ],
  estima: [
    { palavras: ["reconhecido","não sou reconhecido","sem reconhecimento","ninguém vê","ignorado","invisível"], texto: "falta de reconhecimento", impacto: "quando você se dedica e isso não é visto, sua autoestima vai sendo corroída por dentro, mesmo que discretamente" },
    { palavras: ["frustrado","frustração"], texto: "frustração acumulada", impacto: "frustração repetida envia uma mensagem devastadora para sua mente: o que você faz não importa" },
    { palavras: ["injusto","injustiça","não é justo","desrespeitado","menosprezado","subestimado"], texto: "sensação de injustiça", impacto: "injustiça fere a estima porque comunica que as regras não se aplicam a você — que você vale menos" },
    { palavras: ["dedicação","dedicar","esforço","mérito"], texto: "esforço não reconhecido", impacto: "dar o melhor de si sem retorno corrói a crença de que vale a pena continuar se esforçando" },
    { palavras: ["humilhado","humilhação","advertido","advertência"], texto: "humilhação ou punição injusta", impacto: "ser punido injustamente destrói a confiança e faz você questionar seu lugar no ambiente" },
    { palavras: ["inferior","incapaz","fracasso"], texto: "sentimento de incapacidade", impacto: "quando a estima está baixa, sua mente começa a confirmar crenças negativas sobre você mesmo" },
  ],
  autorrealizacao: [
    { palavras: ["vazio","sentido","propósito","missão","não me realizo"], texto: "falta de propósito", impacto: "quando você não sabe mais por que faz o que faz, até as coisas que antes faziam sentido parecem ocas" },
    { palavras: ["entediado","tédio","estagnado","poderia ser mais"], texto: "estagnação", impacto: "a sensação de não estar crescendo vai corroendo a motivação dia a dia, mesmo sem uma causa visível" },
    { palavras: ["potencial","desperdiçando","não sei o que quero","sem rumo"], texto: "potencial bloqueado", impacto: "sentir que tem mais dentro de você do que está sendo usado é um dos sinais mais claros de que você está pronto para o próximo nível" },
    { palavras: ["sonho","realização","quero mais"], texto: "sonhos não realizados", impacto: "quando o que você sonhou ficou só no sonho, o presente começa a perder cor" },
  ],
};

const POR_QUE = {
  fisiologica: [
    { titulo: "Por que seu corpo reage assim?", texto: "Quando necessidades físicas básicas não são atendidas — sono, alimentação, ausência de dor — o cérebro entra em modo de sobrevivência. O córtex pré-frontal, responsável pelo raciocínio e autocontrole, reduz sua atividade. O que assume o comando é a amígdala: a parte mais primitiva do cérebro, que só conhece ameaça e resposta. Não é fraqueza — é fisiologia. O organismo está fazendo exatamente o que foi programado para fazer: sobreviver primeiro." },
    { titulo: "Seu corpo está pedindo socorro — e fazendo certo", texto: "O sistema nervoso humano foi desenhado para garantir a sobrevivência antes de qualquer outra coisa. Quando energia, descanso ou saúde estão comprometidos, o cérebro desliga funções consideradas não essenciais — como criatividade, paciência e tomada de decisão racional. O que parece falta de vontade é na verdade o organismo racionando recursos." },
    { titulo: "Por que tudo parece mais pesado quando o básico falta?", texto: "Privação física — seja de sono, alimentação ou bem-estar corporal — eleva os níveis de cortisol e reduz a serotonina. O resultado é que situações normais parecem insuperáveis, pequenos problemas viram crises, e a capacidade de regular as próprias emoções cai drasticamente. Não é exagero da sua parte — é química." },
  ],
  seguranca: [
    { titulo: "Por que sua mente não para de se preocupar?", texto: "Quando o ambiente é imprevisível ou ameaçador, o sistema nervoso dispara cortisol — o hormônio do estresse. Em doses altas e contínuas, ele destrói a capacidade de pensar com clareza, dormir bem e confiar nas pessoas. O cérebro passa a varrer o ambiente em busca de perigos o tempo todo, mesmo quando não há nenhum." },
    { titulo: "O cérebro em modo de ameaça não descansa", texto: "A necessidade de segurança é tão fundamental que, quando ameaçada, o cérebro não consegue focar em mais nada. É como tentar trabalhar com um alarme disparado — impossível ignorar. Mesmo que a ameaça seja abstrata (futuro incerto, instabilidade financeira), o organismo reage como se fosse um perigo físico imediato." },
    { titulo: "Por que você reage de forma tão intensa a situações que outros ignoram?", texto: "Quando a necessidade de segurança está cronicamente ameaçada, o sistema de alerta fica hipersensível. O cérebro aprende a identificar perigo em sinais mínimos — um tom de voz, uma mudança de plano, um silêncio. Não é exagero: é um sistema nervoso que foi treinado a sobreviver num ambiente imprevisível." },
  ],
  pertencimento: [
    { titulo: "Por que a ausência de conexão dói tanto?", texto: "Estudos de neuroimagem mostram que rejeição social ativa as mesmas regiões cerebrais que a dor física. Não é metáfora — é literalmente a mesma experiência neurológica. Para nossos ancestrais, ser excluído do grupo significava morte. O cérebro nunca atualizou esse sistema. Por isso solidão e rejeição comprometem o sono, o humor, a imunidade e a capacidade de tomar boas decisões." },
    { titulo: "Conexão não é luxo — é necessidade estrutural", texto: "Maslow foi categórico: após segurança física, o ser humano precisa de amor e pertencimento para funcionar bem. Sem vínculos genuínos, o cérebro interpreta o mundo como hostil. Isso não é fraqueza emocional — é o sistema nervoso sinalizando que uma necessidade básica não está sendo atendida." },
    { titulo: "Por que o isolamento distorce a forma como você vê tudo?", texto: "Quando estamos desconectados, o cérebro entra em modo de vigilância social — passamos a interpretar situações neutras como rejeição, a antecipar abandono e a nos fechar ainda mais. É um ciclo que se alimenta sozinho. A solidão não é apenas dolorosa: ela literalmente altera a percepção da realidade." },
  ],
  estima: [
    { titulo: "Por que falta de reconhecimento afeta tanto?", texto: "A autoestima funciona como um termostato interno de segurança social. Quando é alta, você age, arrisca, se expõe. Quando é baixa, o cérebro interpreta situações cotidianas como ameaças ao seu valor pessoal. A frustração repetida dispara o mesmo sistema de estresse que uma ameaça física. Com o tempo, o cérebro começa a antecipar a falha antes mesmo de tentar — como mecanismo de proteção." },
    { titulo: "Injustiça não é só desconfortável — é ameaça ao seu valor", texto: "Quando você se dedica e não é reconhecido — ou pior, é tratado de forma injusta — o cérebro registra isso como uma ameaça à sua posição no grupo. Evolutivamente, perder status social era perigoso. Por isso a dor do não-reconhecimento é tão intensa: não é frescura, é um sistema antigo reagindo a uma ameaça real." },
    { titulo: "Por que você continua se sentindo insuficiente mesmo quando faz tudo certo?", texto: "Estima baixa cria um filtro cognitivo que descarta evidências positivas e amplifica as negativas. Você pode ter feito um excelente trabalho, mas o cérebro encontra motivos para minimizar. Isso não é modéstia — é um padrão aprendido que se instala quando o ambiente não oferece reconhecimento consistente." },
  ],
  autorrealizacao: [
    { titulo: "Por que esse vazio não passa mesmo quando tudo parece bem?", texto: "Maslow foi direto: o que você pode ser, você deve ser. Quando suas necessidades básicas estão razoavelmente atendidas mas você não encontra espaço para expressar seu potencial, surge um estado de inquietação persistente que nenhuma conquista material resolve. Neurologicamente, falta de propósito reduz a produção de dopamina — o neurotransmissor da motivação e do sentido." },
    { titulo: "Por que conquistas externas não preenchem o que você sente por dentro?", texto: "Quando o potencial não encontra expressão, o cérebro gera um estado crônico de insatisfação que não responde a conquistas materiais, elogios ou distrações. É diferente de tristeza ou ansiedade — é mais parecido com fome: um sinal persistente de que algo essencial está faltando. E esse algo é a sua própria realização." },
    { titulo: "Estagnação não é preguiça — é sinal de que você está pronto para mais", texto: "A inquietação que você sente não é ingratidão pelo que tem. É o sinal mais honesto que existe de que você cresceu além do espaço que ocupa. Maslow descrevia isso como a necessidade mais alta — e a mais silenciosa, porque acontece quando tudo 'parece bem' por fora mas não ressoa por dentro." },
  ],
};

const ACOES = {
  fisiologica: [
    [
      "Resolva o básico antes de qualquer outra decisão — durma, coma, cuide do corpo. Isso não é procrastinação, é prioridade correta",
      "Identifique qual necessidade física está sendo sistematicamente ignorada na sua rotina e trate como urgência",
      "Converse com alguém próximo sobre o que está te sobrecarregando fisicamente — carregar isso sozinho amplifica tudo",
    ],
    [
      "Antes de tomar qualquer decisão importante hoje, resolva o básico primeiro: sono, alimentação, descanso",
      "Observe sua rotina da última semana — qual necessidade física você tem adiado repetidamente? Esse é o ponto de partida",
      "Não normalize o esgotamento. O que parece necessário aguentar frequentemente é algo que pode ser ajustado",
    ],
    [
      "Durma. Coma. Beba água. Isso não é conselho óbvio — é diagnóstico. Comece exatamente aqui",
      "Pergunte a si mesmo: o que meu corpo estaria pedindo se eu parasse por 5 minutos para ouvir?",
      "Delegue, cancele ou adie o que for possível hoje para criar espaço para o corpo se recuperar",
    ],
  ],
  seguranca: [
    [
      "Liste o que você PODE controlar agora — foque só nisso, deixe o resto de lado por enquanto",
      "Crie uma rotina pequena e previsível para os próximos dias — âncoras de segurança funcionam mesmo quando são simples",
      "Converse abertamente com quem compartilha essa instabilidade — o silêncio amplifica o medo mais do que a realidade justifica",
    ],
    [
      "Separe o que depende de você do que não depende. Aja no primeiro. Aceite provisoriamente o segundo",
      "Crie pelo menos um ponto fixo previsível no seu dia — uma hora, uma atividade, um ritual simples. Âncoras funcionam",
      "Nomeie o medo com precisão. 'Estou com medo de X acontecer' é mais manejável do que ansiedade difusa sem nome",
    ],
    [
      "Qual é o pior cenário real? Escreva. Depois escreva o que você faria se ele acontecesse. Isso reduz o poder que ele tem",
      "Identifique uma pessoa com quem você pode ser honesto sobre o que está sentindo — carregar incerteza sozinho é mais pesado do que precisa ser",
      "Reduza decisões desnecessárias nos próximos dias — cada escolha consome energia que seu sistema nervoso precisa para se estabilizar",
    ],
  ],
  pertencimento: [
    [
      "Entre em contato hoje com alguém que te faz bem — uma mensagem simples já quebra o ciclo do isolamento",
      "Identifique onde você sente que pertence de verdade e vá até lá com mais frequência — conexão precisa de repetição",
      "Se o conflito relacional tem um nome, considere abrir uma conversa honesta — a maioria dos afastamentos começa com silêncios não resolvidos",
    ],
    [
      "Mande uma mensagem hoje para alguém que você admira ou com quem perdeu contato. Não precisa ser longa",
      "Identifique um ambiente onde você se sente genuinamente aceito — e aumente a frequência com que aparece por lá",
      "Considere que afastamento raramente é só do outro. O que você pode fazer de diferente para se aproximar?",
    ],
    [
      "Conexão começa com presença. Apareça para alguém hoje — fisicamente ou por mensagem — sem agenda, só para estar",
      "Pense em quem te vê de verdade. Se a lista está vazia, esse é o sinal mais importante que você pode receber agora",
      "Não espere condições perfeitas para se reconectar. Uma palavra honesta vale mais do que silêncio prolongado",
    ],
  ],
  estima: [
    [
      "Reconheça para si mesmo o que você fez bem recentemente — sem minimizar, sem relativizar, sem mas",
      "Converse diretamente com quem não te reconheceu — às vezes invisibilidade é falta de atenção, não má vontade",
      "Avalie honestamente se o ambiente onde você está tem estrutura para reconhecer pessoas — se não tem, isso é informação importante",
    ],
    [
      "Liste três coisas que você fez bem na última semana. Se seu cérebro resistir, isso é exatamente o sinal de que você precisa fazer o exercício",
      "Diga em voz alta o que você precisava ouvir — às vezes o reconhecimento precisa começar por você mesmo antes de vir de fora",
      "Avalie: o ambiente onde você está é capaz de enxergar pessoas? Se não for, o problema não é você",
    ],
    [
      "Pare de esperar que o reconhecimento externo valide o que você já sabe sobre si mesmo. Comece a construir essa base por dentro",
      "Converse com alguém de confiança sobre o que você está sentindo — nomear injustiça em voz alta reduz o peso que ela tem",
      "Pergunte-se: o que eu estaria fazendo diferente se eu soubesse que meu esforço tem valor — independente de alguém reconhecer?",
    ],
  ],
  autorrealizacao: [
    [
      "Reserve tempo esta semana para algo que te faz perder a noção do tempo — sem justificar, sem produtivizar",
      "Pergunte a si mesmo: o que eu faria se soubesse que não ia falhar? A resposta costuma apontar para onde você deveria estar",
      "Identifique o que está te impedindo de agir no seu potencial e trate isso como o problema real — não o sintoma",
    ],
    [
      "O que você fazia quando criança que te absorvia completamente? Esse rastro costuma apontar para onde seu potencial vive",
      "Separe uma hora esta semana para algo que não tem utilidade imediata — só porque você gosta. Isso não é desperdício, é combustível",
      "Escreva uma versão de você daqui a 5 anos que está vivendo plenamente. O que essa versão faz diferente hoje?",
    ],
    [
      "Identifique uma coisa pequena que você pode fazer esta semana que está alinhada com quem você quer ser — não com o que é esperado de você",
      "Converse com alguém que você admira por viver de forma autêntica. Pergunte como chegou lá",
      "Pare de otimizar a vida que você tem e comece a imaginar a vida que você quer. A clareza sobre o destino muda as decisões do caminho",
    ],
  ],
};

const FRASES_FINAIS = {
  fisiologica: [
    "Você não pode negociar com ninguém — nem consigo mesmo — quando o nível zero está no vermelho. Cuide do corpo primeiro.",
    "O corpo não é obstáculo para o que você quer fazer. Ele é o veículo. Sem combustível, nada anda.",
    "Antes de resolver qualquer problema externo, resolva o interno. Tudo fica mais claro quando o básico está atendido.",
  ],
  seguranca: [
    "Em terreno instável, você não precisa resolver tudo de uma vez. Só precisa encontrar o próximo ponto firme para pisar.",
    "Controle o que pode ser controlado. Aceite o que não pode. A diferença entre os dois é onde mora a paz.",
    "Segurança não é ausência de risco. É saber que você consegue lidar com o que vier.",
  ],
  pertencimento: [
    "Pertencer não é um luxo emocional. É a base sem a qual nada mais funciona direito.",
    "Você não precisa de muitas pessoas. Precisa das certas — e de coragem para se aproximar delas.",
    "Conexão real começa quando você para de se esconder e permite ser visto do jeito que é.",
  ],
  estima: [
    "Quem não se reconhece não consegue exigir reconhecimento do mundo. O primeiro passo começa dentro.",
    "Seu valor não depende de validação externa. Mas depende de você acreditar nisso antes de esperar que os outros acreditem.",
    "O reconhecimento que mais importa é o que você dá a si mesmo — e ninguém pode tomar esse de você.",
  ],
  autorrealizacao: [
    "O que você pode ser, você deve ser. Ignorar esse chamado não faz ele ir embora — só aumenta o ruído.",
    "A inquietação que você sente não é problema. É direção. Aprenda a ouvi-la.",
    "Você já tem o que precisa para começar. O que falta é parar de esperar permissão.",
  ],
};

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

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
  let best = "estima";
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
  const [feedback, setFeedback] = useState(null); // null | "sim" | "nao"
  const [comentario, setComentario] = useState("");
  const [feedbackEnviado, setFeedbackEnviado] = useState(false);

  const enviarFeedback = async (fb) => {
    setFeedback(fb);
  };

  const enviarComentario = async () => {
    if (feedbackEnviado) return;
    await salvarFeedback(result.necessidade, input, feedback, comentario);
    setFeedbackEnviado(true);
  };

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
    setFeedback(null);
    setComentario("");
    setFeedbackEnviado(false);
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
                Descreva com suas palavras. A ferramenta identifica qual necessidade humana está afetada, por que você reage assim — e o que fazer.
              </p>
            </div>

            <div style={{ background: "#111e30", border: "1px solid #1a2a4a", borderRadius: 14, padding: 22, marginBottom: 28 }}>
              <div style={{ fontSize: 10, letterSpacing: "0.12em", color: "#4a6a8a", fontFamily: "'DM Sans'", fontWeight: 600, marginBottom: 10 }}>ESCREVA AQUI</div>
              <textarea
                rows={6}
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ex: Sinto que não sou reconhecido no trabalho. Dou tudo de mim e parece que ninguém vê. Fico frustrado e não consigo dormir..."
                style={{ width: "100%", background: "#0d1826", border: "1px solid #1a2a4a", borderRadius: 8, padding: 14, color: "#f2f0eb", fontSize: 15, lineHeight: 1.65 }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14 }}>
                <span style={{ fontSize: 12, color: "#4a6a8a", fontFamily: "'DM Sans'" }}>{input.length} caracteres</span>
                <button onClick={analyze} disabled={input.trim().length < 15}
                  style={{ background: input.trim().length < 15 ? "#2a3a4a" : "#c8b89a", color: input.trim().length < 15 ? "#4a6a8a" : "#0d1826", border: "none", borderRadius: 8, padding: "11px 22px", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", fontFamily: "'DM Sans'", cursor: input.trim().length < 15 ? "not-allowed" : "pointer" }}>
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

            {/* O que você escreveu */}
            <div style={{ borderLeft: "3px solid #1a2a4a", paddingLeft: 18, marginBottom: 24 }}>
              <div style={{ fontSize: 10, letterSpacing: "0.12em", color: "#4a6a8a", fontFamily: "'DM Sans'", marginBottom: 6 }}>VOCÊ ESCREVEU</div>
              <p style={{ fontSize: 14, color: "#6a8aaa", fontFamily: "'DM Sans'", fontStyle: "italic" }}>"{input}"</p>
            </div>

            {/* Sinais */}
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
                          <span style={{ color: "#c8b89a", fontWeight: 600 }}>Como isso te afeta: </span>{sinal.impacto}
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
                  <span style={{ fontFamily: "'DM Serif Display'", fontSize: 16, color: need.color }}>{pick(POR_QUE[result.necessidade]).titulo}</span>
                </div>
                <div style={{ padding: "16px 20px" }}>
                  <p style={{ fontSize: 14, lineHeight: 1.75, color: "#a0b0c0", fontFamily: "'DM Sans'" }}>{pick(POR_QUE[result.necessidade]).texto}</p>
                </div>
              </div>
            </div>

            {/* O que fazer */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 10, letterSpacing: "0.12em", color: "#4a6a8a", fontFamily: "'DM Sans'", fontWeight: 600, marginBottom: 14 }}>O QUE VOCÊ PODE FAZER</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {pick(ACOES[result.necessidade]).map((a, i) => (
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
              <p style={{ fontFamily: "'DM Serif Display'", fontSize: 16, lineHeight: 1.7, fontStyle: "italic" }}>{pick(FRASES_FINAIS[result.necessidade])}</p>
            </div>

            {/* Feedback */}
            <div style={{ background: "#111e30", border: "1px solid #1a2a4a", borderRadius: 14, padding: "22px", marginBottom: 28 }}>
              <div style={{ fontSize: 10, letterSpacing: "0.12em", color: "#4a6a8a", fontFamily: "'DM Sans'", fontWeight: 600, marginBottom: 14 }}>ESSE DIAGNÓSTICO FEZ SENTIDO PARA VOCÊ?</div>
              
              {!feedbackEnviado ? (
                <>
                  <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
                    <button onClick={() => enviarFeedback("sim")}
                      style={{ flex: 1, padding: "10px", borderRadius: 8, border: "1px solid " + (feedback === "sim" ? need.color : "#1a2a4a"), background: feedback === "sim" ? need.color + "22" : "transparent", color: feedback === "sim" ? need.color : "#6a8aaa", fontFamily: "'DM Sans'", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                      ✓ Sim, fez sentido
                    </button>
                    <button onClick={() => enviarFeedback("nao")}
                      style={{ flex: 1, padding: "10px", borderRadius: 8, border: "1px solid " + (feedback === "nao" ? "#e87a7a" : "#1a2a4a"), background: feedback === "nao" ? "#e87a7a22" : "transparent", color: feedback === "nao" ? "#e87a7a" : "#6a8aaa", fontFamily: "'DM Sans'", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                      ✗ Não muito
                    </button>
                  </div>

                  {feedback && (
                    <>
                      <div style={{ fontSize: 10, letterSpacing: "0.12em", color: "#4a6a8a", fontFamily: "'DM Sans'", fontWeight: 600, marginBottom: 8 }}>
                        DEIXE UM COMENTÁRIO <span style={{ color: "#3a5a7a", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(anônimo)</span>
                      </div>
                      <textarea
                        rows={3}
                        value={comentario}
                        onChange={e => setComentario(e.target.value)}
                        placeholder="Conte como você está se sentindo, ou o que aconteceu com você..."
                        style={{ width: "100%", background: "#0d1826", border: "1px solid #1a2a4a", borderRadius: 8, padding: 12, color: "#f2f0eb", fontSize: 14, lineHeight: 1.6, fontFamily: "'DM Sans'", resize: "none", marginBottom: 12 }}
                      />
                      <p style={{ fontSize: 11, color: "#3a5a7a", fontFamily: "'DM Sans'", marginBottom: 12 }}>
                        Seus comentários são anônimos e podem ajudar outras pessoas que passam pela mesma situação.
                      </p>
                      <button onClick={enviarComentario}
                        style={{ width: "100%", background: need.color, color: "#0d1826", border: "none", borderRadius: 8, padding: "11px", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", fontFamily: "'DM Sans'", cursor: "pointer" }}>
                        ENVIAR FEEDBACK
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div style={{ textAlign: "center", padding: "16px 0" }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>🙏</div>
                  <p style={{ fontFamily: "'DM Serif Display'", fontSize: 16, color: need.color, marginBottom: 6 }}>Obrigado pelo seu retorno!</p>
                  <p style={{ fontSize: 13, color: "#6a8aaa", fontFamily: "'DM Sans'", lineHeight: 1.6 }}>Seu comentário anônimo ajuda a melhorar essa ferramenta e pode tocar a vida de outras pessoas.</p>
                </div>
              )}
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

