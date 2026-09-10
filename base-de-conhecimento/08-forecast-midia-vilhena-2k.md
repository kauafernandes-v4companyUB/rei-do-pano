# Forecast de Mídia — Rei do Pano, R$2.000/mês, Vilhena Somente

> Skill relacionada: `ee-s3-forecast-midia`. Escopo **restrito** em relação ao plano regional original (`05-diagnostico-midia-trafego-pago.md`): só **Rei do Pano** (Rainha Modas fica fora dessa verba), só **Vilhena** (exclui Colorado do Oeste e Cerejeiras), verba fixa de **R$2.000/mês**. Parâmetros definidos em conversa direta com o operador em 2026-09-10, não em `client.json.briefing`.
> Output estruturado (JSON validado pelo `schema.json` da skill): `outputs/ee-s3-forecast-midia.json`.
> Legenda: ✅ fato · 💡 inferência · [E] estimativa sem dado histórico do cliente · 🔎 pendente.

## 1. Por que esse recorte (Vilhena só, Rei do Pano só, R$2k fixo)

O plano regional da V4 (`05-diagnostico-midia-trafego-pago.md`) segmenta um raio de 120km cobrindo as 3 lojas (Vilhena, Colorado do Oeste, Cerejeiras) e as duas marcas. Este forecast testa uma verba menor e mais concentrada:

- **Geo:** raio de ~15-20km a partir da loja sede (Av. Major Amarante, 3295, Vilhena/RO) — não os 120km do plano regional.
- **Marca:** só Rei do Pano. Rainha Modas não entra nesta verba.
- **Budget:** R$2.000/mês, **fixo** ao longo dos 6 meses — não é um plano de escala de verba, é um plano de ganho de eficiência dentro de um teto definido.

💡 **Por que isso muda a lógica do forecast:** o padrão de forecast de 6 meses (M1 setup → M2-M3 otimização → M4-M6 escala) normalmente pressupõe **aumento de budget** na fase de escala. Aqui não há esse aumento — a curva de melhora vem inteiramente de CPL caindo e conversão subindo, não de mais dinheiro entrando. Isso significa que o resultado tende a um **platô** a partir do Mês 4, não a um crescimento contínuo.

## 2. Split de verba: 80% Meta / 20% Google

| Canal | % | R$/mês | Papel |
|---|---|---|---|
| Meta Ads | 80% | R$1.600 | Cria demanda nova (público ainda não digitalizado) via WhatsApp |
| Google Ads (Search) | 20% | R$400 | Captura a intenção de compra que já existe em Vilhena |

**Racional do split:** em Vilhena isolada, o volume de busca mensurável do Rei do Pano é pequeno — **~200 buscas/mês** (110 "rei do pano vilhena" + 90 "aviamentos vilhena", ver `02-mercado-swot-concorrentes.md` §1), com **0 concorrentes** disputando lance nesses termos. Isso significa CPC mínimo — R$400/mês é suficiente pra capturar praticamente toda essa intenção. O restante do orçamento rende mais em Meta, que é onde a doc original identifica a real oportunidade: "o mercado ainda não foi digitalizado... o Meta é quem vai criar os novos [sinais de intenção]".

⚠️ **Ajuste importante em relação ao plano regional:** como o volume nativo de busca em Vilhena é baixo demais pra consumir R$400/mês só com Blindagem de Marca + Core, a campanha de **Conquista (termos de concorrentes — Havan, Lojas Avenida)** entra **desde o Mês 1** neste plano, não "só depois da Core estabilizada" como recomendado no documento original. Sem isso, parte do budget de Google ficaria parada.

## 3. Pré-requisito não-negociável (custo zero, fora dos R$2.000)

Sem isso, o Mês 1 real desempenha pior que o modelado — é o gargalo já identificado no diagnóstico de mídia:

1. **Pixel Meta** via GTM, com evento **Contact** disparando no clique do botão de WhatsApp.
2. **Google Tag Manager + GA4** instalados na LP (rei-do-pano.vercel.app).
3. Confirmar se as contas (Meta Business Manager, Google Ads) já foram de fato criadas — o material trata isso como passo 1 do roadmap, ainda não confirmado como concluído.

## 4. Estrutura de campanhas (TECR)

### Meta Ads — R$1.600/mês

**1. Lead via WhatsApp — Público Frio Vilhena (R$1.300/mês, ~R$43/dia)**
- **Tópico:** geração de lead qualificado direto no WhatsApp da loja, sem depender de LP/pixel maduros.
- **Estratégia:** anúncio de Mensagens (Click-to-WhatsApp), público frio geo-segmentado em raio de 15-20km de Vilhena.
- **Conjunto:** mulheres 30-60 anos, classes B/C, interesses costura/decoração/moda/artesanato; 2-3 criativos em teste paralelo (produto + crediário como gancho); copies testando "renovar o enxoval" vs. "tecido pra costurar" vs. "crediário sem juros".
- **Resultado esperado:** CPL de R$22,50 [E] (Mês 1) caindo a R$14,50 [E] (Mês 6); ~71 a 110 leads/mês.

**2. Engajamento de Publicação — Amplificação Orgânica (R$300/mês, ~R$10/dia)**
- **Tópico:** amplificar o post orgânico de melhor desempenho da semana no Instagram do Rei do Pano.
- **Estratégia:** campanha de Engajamento de baixo custo e contínua — sem criativo novo, usa o que já validou organicamente.
- **Conjunto:** público quente + interesses adjacentes.
- **Resultado esperado:** não gera lead direto. Acumula o volume necessário pra ativar remarketing — condição documentada: **≥1.000 pessoas engajadas OU ≥500 visitantes únicos no pixel**. Com R$1.600/mês total em Meta, esse volume deve levar entre 3 e 6 semanas [E] pra se acumular.

### Google Ads — R$400/mês

| Campanha | Verba | Termos | Racional |
|---|---|---|---|
| Blindagem de Marca | R$80 | rei do pano vilhena, rei do pano rondônia, rei do pano | Protege o nome, CPC quase irrelevante, quase 100% dos cliques já são conversão |
| Core — Intenção de Compra | R$260 | aviamentos vilhena (+57% YoY), tecidos vilhena, loja de tecidos vilhena, cortinas sob medida vilhena, materiais para costura vilhena | Principal fonte de leads dessa plataforma |
| Conquista — Termos de Concorrentes | R$60 | lojas avenida vilhena, havan vilhena, lojas avenida tecidos, havan tecidos | Ativada desde o Mês 1 (ajuste vs. plano original) pra consumir o budget; captura intenção comprovada com oferta de crediário que a Havan não tem |

**Negativas obrigatórias:** grátis, emprego, estágio, vaga, como fazer, tutorial, artigo científico, receita, curso de costura, tecidos online, comprar online, delivery, atacado, fábrica de tecidos.

### Fora do escopo deste plano
- Rainha Modas (verba e campanhas separadas)
- Colorado do Oeste e Cerejeiras (fora do raio geo definido)
- Remarketing/Reengajamento formal — só ativa quando bater a condição de volume acima; não está garantido dentro da janela de 6 meses com essa verba
- Campanha de Oferta Sazonal e Reconhecimento de Marca (fases futuras do plano regional, exigem criativos validados e pixel maduro)

## 5. Modelagem financeira — 6 meses (blended Meta + Google)

Todas as métricas abaixo são estimativas [E] — o grupo está em maturidade digital **V0** (sem Pixel/GTM/GA4, sem histórico de campanhas pagas em nenhuma das duas marcas). Regras de benchmark aplicadas (`references/benchmarks-forecast.md` da skill): budget <R$2k/mês → CPL 30-50% acima no Mês 1 (aprendizado); cidade pequena/baixa concorrência → CPC/CPL tende a ficar abaixo da média nacional, mas com menos volume disponível.

| Métrica | M1 (setup) | M2 | M3 | M4 | M5 | M6 |
|---|---|---|---|---|---|---|
| Budget | R$2.000 | R$2.000 | R$2.000 | R$2.000 | R$2.000 | R$2.000 |
| Impressões | 87.500 | 96.600 | 102.800 | 105.950 | 110.200 | 113.300 |
| Cliques | 1.350 | 1.535 | 1.767 | 1.946 | 2.120 | 2.328 |
| CTR | 1,54% | 1,59% | 1,72% | 1,84% | 1,92% | 2,05% |
| CPC | R$1,48 | R$1,30 | R$1,13 | R$1,03 | R$0,94 | R$0,86 |
| Leads | 111 | 145 | 168 | 183 | 197 | 207 |
| CPL | R$18,02 | R$13,79 | R$11,90 | R$10,93 | R$10,15 | R$9,66 |
| Taxa MQL | 65% | 68% | 70% | 72% | 74% | 75% |
| MQLs | 72 | 99 | 118 | 132 | 146 | 155 |
| Clientes atendidos | 22 | 33 | 41 | 49 | 55 | 62 |
| CAC de mídia | R$90,90 | R$60,60 | R$48,78 | R$40,82 | R$36,36 | R$32,26 |

**Totais 6 meses:** R$12.000 investidos · 616.350 impressões · 11.046 cliques (CTR médio 1,79%) · **1.011 leads** (CPL médio R$11,87) · 722 MQLs (taxa média 71,4%) · **262 clientes atendidos** (CAC de mídia médio R$45,80).

⚠️ **Por que não há ROAS/faturamento nesta tabela:** `client.json → briefing.product.ticket` é `null` — não há ticket médio, conversão loja histórica ou margem confirmados. Este forecast é operacional (funil de mídia), não financeiro. Assim que esses dados existirem, dá pra projetar receita/ROAS em cima do número de clientes atendidos acima.

### Cenários de sensibilidade

| Cenário | Total de leads | CPL médio | Clientes atendidos | CAC de mídia médio | Condição |
|---|---|---|---|---|---|
| Otimista | 1.250 | R$9,60 | 340 | R$35,29 | CPL 20% abaixo do realista + conversão 20% acima (criativos performam muito bem, concorrência local não reage) |
| **Realista** | **1.011** | **R$11,87** | **262** | **R$45,80** | Cenário base modelado acima |
| Pessimista | 780 | R$15,38 | 175 | R$68,57 | CPL 30% acima do realista + conversão 20% abaixo (aprendizado mais lento, atendimento WhatsApp não treinado pra converter) |

## 6. Tracking — o que acompanhar (sem CRM/pixel maduro ainda)

| Métrica | Definição | Fonte | Frequência |
|---|---|---|---|
| Leads WhatsApp | Conversas iniciadas via clique no anúncio que chegam no WhatsApp Business | WhatsApp Business + evento Contact do Pixel | Diária |
| CPL Blended | Budget total (Meta+Google) ÷ leads do mês | Gerenciadores de Anúncios (consolidado manualmente) | Semanal |
| Taxa de MQL | % de leads que são pessoa real com intenção de compra | Triagem manual da equipe no WhatsApp | Semanal |
| Conversão MQL → cliente | % de MQLs que efetivamente compram | Registro manual da equipe de vendas (Linx não integrado ao funil ainda) | Semanal |
| CAC de mídia | Budget do mês ÷ clientes atendidos vindos da mídia | Cálculo manual cruzando gasto com vendas | Mensal |

## 7. Premissas e dependências explícitas

- Budget fixo em R$2.000/mês nos 6 meses, sem crescimento — premissa do operador, não do plano regional padrão.
- Geo restrita a Vilhena (raio ~15-20km), excluindo as filiais de Colorado do Oeste e Cerejeiras.
- Cobre só o Rei do Pano — Rainha Modas fora desta verba.
- CPL, CPC e taxas de conversão são estimativas [E] sem histórico real do cliente.
- Depende da instalação prévia de Pixel + GTM + evento Contact — sem isso, Mês 1 real fica pior que o modelado.
- Sem ticket médio/conversão loja confirmados em `client.json`, não há projeção de ROAS/faturamento — só funil de mídia.
- Google consome o budget de R$400/mês via correspondência ampla + Conquista desde o Mês 1, ajuste necessário dado o volume nativo baixo de busca em Vilhena.
- `served_clients`/CAC assumem conversão MQL→venda de 30% (M1) a 40% (M6) — não validada, baseada no nível de consciência 3 já documentado (público já decidiu que precisa comprar, só não decidiu onde).
- Remarketing formal não entra nesta janela de 6 meses — só ativa ao bater a condição de volume de engajamento/pixel (ver §4 acima).

## 8. Próximo passo recomendado

Recalibrar este forecast com CPL/CPC reais assim que as primeiras campanhas rodarem 2-4 semanas, e incluir ticket médio + conversão loja reais assim que confirmados com o cliente — nesse momento dá pra evoluir de "funil de mídia" pra projeção de ROAS/faturamento de fato.

## Fontes consultadas

- `client.json` (briefing, meta, history)
- `base-de-conhecimento/05-diagnostico-midia-trafego-pago.md` (plano regional original, estrutura de campanhas Meta/Google, roadmap de setup)
- `base-de-conhecimento/02-mercado-swot-concorrentes.md` §1 (volume de busca Vilhena/RO)
- `base-de-conhecimento/01-persona-icp-jtbd.md` §4 (nível de consciência do público)
- `references/benchmarks-forecast.md` da skill `ee-s3-forecast-midia` (regras de ajuste de CPL por budget/cidade)
- Output estruturado: `outputs/ee-s3-forecast-midia.json`
