# Diagnóstico de Mídia e Plano de Tráfego Pago — Rei do Pano & Rainha Modas

> Skill relacionada: `ee-s2-diagnostico-midia`. Fonte principal: `04/Estruturação Estratégica de Tráfego Pago — Rei do Pano & Rainha Modas.pdf` — documento tipo portal navegável da V4 (seções 01 a 09), com dados reais extraídos de bibliotecas de anúncios (Meta Ads Library, Google Ads Transparency) e do Google Keyword Planner.
> ⚠️ **Este PDF está truncado**: a navegação superior do documento lista as seções **"08 COPY"** e **"09 FLUXO"**, mas o arquivo exportado termina imediatamente após o cabeçalho da seção 08 ("Copy para Meta Ads"), sem conteúdo visível. As seções 01 a 07 estão completas. Ver `PENDENCIAS-ESTRUTURACAO.md`.
> Legenda: ✅ fato · 💡 inferência · 🔎 pendente · ⚠️ divergência.

## 1. Ponto de partida (Maturidade Digital = V0)

- Documento datado de **maio de 2026**.
- Classificação declarada: **"V0 — Estruturação"**.
- "As duas marcas partem do zero digital: Rei do Pano e Rainha Modas têm forte presença física e uma base de clientes consolidada de mais de 30 anos. No digital, porém, **não há pixel instalado, não há rastreamento de eventos, não há histórico de campanhas pagas**. Isso não é um problema — é o ponto de partida. A vantagem: construímos a estrutura certa desde o início, sem vícios de campanhas mal configuradas."

### O que precisa ser construído, por prioridade
| Item | Prioridade | Descrição |
|---|---|---|
| Pixel da Meta | **Máxima** | Rastreador que aprende com visitantes do site/LP. Sem ele, o algoritmo do Meta anuncia "no escuro". |
| Google Tag Manager + GA4 | **Máxima** | GTM organiza todos os rastreamentos em um lugar; GA4 registra comportamento; juntos alimentam o Google Ads com dados reais |
| WhatsApp como canal de conversão | **Início imediato** | Para clientes V0, campanhas com destino WhatsApp são o ponto de entrada ideal — menor fricção, não depende de pixel/LP configurados. Atendente recebe o lead direto e fecha no modelo que o Rei do Pano já domina (relacionamento + crediário) |
| Landing Page de conversão | **Fase seguinte** | Página com CTA para WhatsApp, crediário, promoções e produtos principais — ancora o pixel e melhora a qualidade dos anúncios (ver `06-landing-page-copy-criativos.md`) |

**Ordem de construção recomendada e por quê importa:** "Cada camada de rastreamento habilita a próxima. Pular etapas significa pagar mais caro pelos mesmos resultados."
1. Instalar o Pixel e o GTM — sem rastreamento, os algoritmos não aprendem; cada real investido vai para públicos genéricos.
2. Rodar as primeiras campanhas — com o rastreamento no ar, cada campanha gera dados reais (quem clicou, quem enviou mensagem, quem converteu); o algoritmo aprende rapidamente e os custos caem ao longo das semanas.
3. Escalar com dados reais — com CAC conhecido e públicos validados, o investimento pode crescer com segurança. A base de clientes do Linx entra como lista de remarketing e lookalike, e o crediário vira argumento de anúncio.

### Estrutura a configurar por marca
**Rei do Pano:** Pixel da Meta (evento de contato/WhatsApp), Google Tag Manager (tags de GA4 e Google Ads), Conta de Google Ads (vinculada a Analytics e Merchant Center se necessário), Gerenciador de Anúncios Meta, base de clientes (Linx) exportada para upload como audiência personalizada no Meta.
**Rainha Modas:** os mesmos itens, mais uma decisão em aberto: **"Definir se Rainha Modas mantém conta separada ou é integrada ao perfil principal"** (rastreamento/mídia — distinto, mas correlato, da decisão de perfil de Instagram tratada em `04-auditoria-comunicacao-redes-sociais.md`, §3).

## 2. Público — segmentação para tráfego pago

| Camada | Composição |
|---|---|
| **Público frio** | Segmentação geográfica de 120 km a partir de Vilhena; mulheres 30 a 60 anos, classes B e C; interesses: costura, decoração, moda, artesanato, tecidos; interesses B2B: costureira, tapeceiro, alfaiataria, confecção; lookalike 1% da lista de clientes Linx (quando disponível) |
| **Público quente** | Pessoas que interagiram com o Instagram @reidopano.com.br ou @rainhamodas.com.br; pessoas que enviaram mensagem pelo WhatsApp Business; visitantes do site (após pixel instalado e com volume mínimo); visualizadores de vídeo (75% ou mais do tempo) |
| **Público de lista / CRM (evolução futura)** | Upload da lista de clientes inativos extraída do Linx; campanha de reengajamento personalizada por segmento; lookalike 1% e 2% da base de compradores reais; exclusão automática de compradores recentes das campanhas de prospecção; **disponível apenas após extração e formatação do relatório Linx** |

> **Condição de ativação do remarketing:** "público de engajamento do Instagram ≥ 1.000 pessoas **ou** visitantes únicos do site ≥ 500 eventos no pixel. Antes desse volume a segmentação é ampla demais — a verba não tem eficiência."

## 3. Como funcionam as plataformas (módulo teórico do documento)

### Meta Ads — "o leilão da atenção"
Vencedor do leilão = combinação de 3 pilares, não apenas o maior lance:
1. **Lance** — quanto você está disposto a pagar pela ação desejada.
2. **Taxa de Ação Estimada** — probabilidade de que aquela pessoa específica realize a ação; depende do volume de dados que o pixel já coletou.
3. **Relevância do Anúncio** — quão pertinentes são o criativo, a copy e a oferta para aquela pessoa naquele momento; cresce com o histórico de criativos publicados.

`Lance × Taxa de Ação × Relevância = Vencedor do Leilão`

**Aplicação ao grupo (nível atual):** Pilar 1 (Lance) = neutro, definido pelo orçamento diário assim que a conta é criada. Pilar 2 (Taxa de Ação) = **gargalo atual** — sem Pixel instalado, o Meta não sabe quem já comprou/visitou/mandou mensagem, usa dados genéricos, o que eleva custo e piora resultado; "instalar o Pixel desde o dia 1 é a intervenção mais crítica". Pilar 3 (Relevância) = **a construir** — sem histórico de criativos, o algoritmo parte do zero; cresce com os testes.

### Google Ads — "o leilão da intenção"
Diferença fundamental: o usuário chega primeiro (já digitou algo, tem intenção explícita). O Quality Score combina:
1. **CTR Esperado** — probabilidade de clique baseada no histórico; headlines específicas ("Tecidos em Vilhena — Maior Variedade da Região") performam muito melhor que genéricas.
2. **Relevância do Anúncio** — correspondência entre o anúncio e a intenção da busca; campanhas genéricas pagam mais e aparecem menos.
3. **Experiência da Landing Page** — página rápida, relevante, com CTA claro aumenta o Quality Score, reduzindo o custo por clique.

`CTR Esperado + Relevância + Landing Page = Quality Score` — "cada ponto a mais no Quality Score reduz o custo por clique sem aumentar o orçamento. [...] a diferença entre pagar R$2 ou R$0,80 pelo mesmo resultado."

### Meta vs. Google — papéis complementares no funil
- **Meta Ads: criamos a demanda.** Interrompe a navegação de alguém que não estava pensando em tecidos/moda e apresenta a oferta; constrói audiência, gera reconhecimento, traz o cliente para o topo do funil.
- **Google Ads: capturamos a demanda que já existe.** Alguém pesquisou "tecidos em Vilhena" — a intenção já está ali; o Google coloca o grupo como resposta certa no momento em que o cliente está pronto para agir.

## 4. Estratégia Meta Ads (seção 06)

### Tipos de campanha e sequenciamento
| Campanha | Status | Objetivo |
|---|---|---|
| **Lead via WhatsApp** | Ativo desde o dia 1 | Mensagens — anúncio leva direto ao WhatsApp do grupo, sem pixel/LP/formulário; caminho de menor fricção, funciona desde a primeira semana |
| **Engajamento de Publicação** | Ativo desde o dia 1 | Amplifica posts orgânicos com maior potencial (lançamentos de coleção, promoções, produtos sazonais); alimenta a audiência quente para campanhas futuras |
| **Campanha de Oferta Sazonal** | Fase futura | Alcance/Oferta — campanhas temáticas atreladas às datas de maior volume (Dia das Mães, Black Friday, Natal, liquidações de estoque); exige calendário promocional estruturado e criativos validados |
| **Reconhecimento de Marca** | Fase futura | Alcance/Awareness — topo de funil para construir familiaridade em toda a região de influência; mais eficaz quando já há criativos validados, audiências quentes e o pixel colhendo dados de visitantes reais do site |
| **Remarketing — Reengajamento** | Mês 2 em diante | Mensagens/Conversões — ativada quando a audiência quente tiver volume suficiente (ver condição de ativação acima); segmenta quem interagiu com os perfis ou clicou no anúncio mas ainda não enviou mensagem; criativo distinto da campanha de aquisição (não apresenta a loja, oferece razão específica para voltar) |

### Prioridade de execução — primeiras semanas
1. Criar contas de anúncios e configurar o Gerenciador de Negócios (uma conta por marca — Rei do Pano + Rainha Modas — dentro do mesmo Business Manager; contas separadas garantem dados limpos e orçamentos independentes).
2. Instalar GTM e configurar o Pixel + evento de WhatsApp (antes de subir qualquer campanha, o pixel precisa estar instalado e disparando o evento Contact no clique do botão de WhatsApp).
3. Subir a primeira campanha Lead via WhatsApp com público frio segmentado (segmentação geográfica de 120 km, mulheres 30–60 anos, interesses de costura/moda/decoração; testar 2–3 criativos por marca para identificar qual mensagem ressoa mais rápido).
4. Amplificar posts com maior orgânico via campanha de Engajamento (identificar semanalmente o post com melhor desempenho orgânico de cada marca e impulsionar).

### Organização técnica — Pixel, GTM e estrutura de dados
- **Pixel Meta:** instalar via GTM (nunca código manual no site — impossível de manter); evento PageView automático pelo GTM logo na instalação; evento Contact (clique WhatsApp) disparado via GTM no botão de contato; evento ViewContent em páginas de produto/categoria relevante; API de Conversões implementada em paralelo ao pixel para redundância de dados (server-side); verificar eventos no Events Manager antes de subir a primeira campanha.
- **Boas práticas GTM:** uma conta GTM, um container por domínio — nunca misturar Rei do Pano e Rainha Modas no mesmo container; nomear tags com padrão [Plataforma] — [Evento] — [Local] (ex.: META — Contact — Botão WhatsApp); usar variáveis de camada de dados para capturar informações dinâmicas de produto; ativar Modo de Depuração antes de publicar qualquer versão nova; versionar o container (nunca publicar sem nomear a versão com data e descrição); auditar tags ativas a cada 60 dias (tags duplicadas corrompem dados).
- **Evolução futura — CRM e API de Conversões:** quando a extração do Linx estiver disponível e o pixel tiver volume de dados, o próximo passo é enviar os eventos de conversão reais (compra, contato qualificado) de volta ao Meta via API de Conversões — elimina ruído de atribuição do pixel e faz o algoritmo otimizar com o que de fato gerou resultado.

## 5. Estratégia Google Ads (seção 07)

### Dados de volume de busca
Ver tabela completa em `02-mercado-swot-concorrentes.md`, seção 1. Resumo: ~410 buscas/mês combinadas, 0 concorrentes ativos anunciando nesses termos, aviamentos +57% YoY (único termo de crescimento expressivo — "o mercado B2B de costureiras e tapeceiros está se digitalizando").

### Estrutura de campanhas recomendada
| Campanha | Status | Termos-exemplo | Racional |
|---|---|---|---|
| **Blindagem de Marca** | Obrigatória | rei do pano vilhena, rei do pano rondônia, rei do pano, rainha modas vilhena, rainha modas rondônia, rainha modas | Protege o nome das marcas nos resultados de busca, impedindo que concorrentes apareçam quando alguém busca diretamente pelo grupo. "O termo 'rainha modas vilhena' já aparece com concorrência Média, o que indica que alguém está de olho." |
| **Core — Intenção de Compra** | Obrigatória | aviamentos vilhena, tecidos vilhena, loja de tecidos vilhena, cortinas sob medida vilhena, materiais para costura vilhena / loja de roupas vilhena, loja de calçados vilhena, moda feminina vilhena, roupas femininas vilhena | Captura buscas de categoria com intenção de compra direta. "Aviamentos vilhena" (+57% YoY) e "loja de roupas vilhena" (170/mês) são os termos de maior potencial imediato. |
| **Conquista — Termos de Concorrentes** | Opcional/sugestão, recomendada só depois da campanha Core estabilizada | lojas avenida vilhena, havan vilhena, lojas avenida tecidos, havan tecidos | Aparecer quando alguém busca pelos concorrentes já demonstra intenção de compra — capturar com oferta de crediário próprio e variedade de tecidos |

**Palavras-chave negativas de exclusão obrigatória:** grátis, emprego, estágio, vaga, como fazer, tutorial, artigo científico, receita, curso de costura, tecidos online, comprar online, delivery, atacado, fábrica de tecidos.

### Textos de anúncio prontos (títulos ≤30 caracteres, descrições ≤90 caracteres)

**Rei do Pano — Títulos (10):** Rei do Pano — Vilhena · Tecidos e Aviamentos · Crediário Próprio Sem Juros · Maior Variedade da Região · Cortinas Sob Medida · 30 Anos de Tradição · Aviamentos e Materiais · Loja Física em Vilhena · Fale pelo WhatsApp Agora · Atendimento Especializado

**Rei do Pano — Descrições (3):**
1. "A maior loja de tecidos do Cone Sul. Crediário próprio sem juros. Visite-nos em Vilhena." (88 car.)
2. "Tecidos por metro, aviamentos, enxoval e cortinas sob medida. Atendimento humanizado." (85 car.)
3. "30 anos em Vilhena. Crediário próprio e sem juros. Entre em contato pelo WhatsApp." (82 car.)

**Rei do Pano — Sitelinks (4):** Falar no WhatsApp (tire dúvidas e veja os produtos disponíveis) · Como Chegar (endereço e horário) · Crediário Próprio (parcele sem juros com aprovação rápida) · Cortinas Sob Medida (orçamento sem compromisso pelo WhatsApp)

**Rainha Modas — Títulos (10):** Rainha Modas — Vilhena · Moda Feminina e Calçados · Crediário Próprio Sem Juros · Roupas e Calçados Femininos · Moda para Todas as Idades · Loja de Moda em Vilhena · Novidades Toda Semana · Compre no Crediário · Atendimento pelo WhatsApp · Moda Feminina com Crediário

**Rainha Modas — Descrições (3):**
1. "Roupas femininas, calçados e muito mais. Crediário próprio sem juros em Vilhena." (80 car.)
2. "Encontre moda feminina com atendimento humanizado. Parcele no crediário sem juros." (82 car.)
3. "Loja física em Vilhena com variedade de roupas e calçados. Fale pelo WhatsApp agora." (84 car.)

**Rainha Modas — Sitelinks (4):** Falar no WhatsApp (veja as novidades e tire dúvidas agora) · Como Chegar (endereço e horário) · Crediário Próprio (parcele roupas e calçados sem juros) · Ver Coleção (confira as novidades da temporada)

## 6. Seções não recuperáveis do documento

- **08 — Copy para Meta Ads:** apenas o cabeçalho da seção aparece no PDF exportado; o conteúdo (copies de anúncio Meta, distinto dos textos de Google Ads já listados acima) **não está presente no arquivo**. 🔎
- **09 — Fluxo:** referenciada na navegação superior do documento (junto com as demais 8 seções), mas nenhum conteúdo dessa seção foi encontrado no PDF. Não é possível inferir o que "Fluxo" cobriria (possivelmente um fluxograma de atendimento/qualificação do lead vindo dos anúncios) sem acesso à versão completa do documento. 🔎

## 7. Lacunas identificadas

- Orçamento de mídia (budget mensal/mensal por plataforma) não está definido em nenhum material — o pré-kick-off deixou em branco a pergunta sobre verba mínima/máxima esperada de faturamento. 🔎
- Metas de CPA/CPL/ROAS específicas não aparecem no doc. de Tráfego Pago (o documento é mais conceitual/estrutural que projetivo em métricas de performance esperada) — não há forecast de mídia (esse seria o escopo da skill `ee-s3-forecast-midia`, sem material disponível no projeto até o momento). 🔎
- Seções 08 (Copy Meta Ads) e 09 (Fluxo) do próprio documento fonte estão ausentes (ver seção 6 acima). 🔎
- Não há confirmação formal de que as contas de anúncio (Meta Business Manager, Google Ads) já foram de fato criadas — o documento trata a criação como passo 1 do roadmap de execução, ainda não confirmado como concluído nos materiais disponíveis. 🔎

## Fontes consultadas

- `04/Estruturação Estratégica de Tráfego Pago — Rei do Pano & Rainha Modas.pdf` (seções 01 a 07; seção 08 parcial/truncada; seção 09 ausente)
- `03/03 - EE - REI DO PANO - PESQUISA DE MERCADO.pdf` (cruzamento de estratégia de aquisição/mídia paga, ver `03-posicionamento-e-manual-de-marca.md` §8)
