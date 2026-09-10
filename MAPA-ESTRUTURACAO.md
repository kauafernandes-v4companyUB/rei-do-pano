# Mapa da Estruturação Estratégica — Rei do Pano & Rainha Modas

## Visão geral

Este repositório reúne os materiais da Estruturação Estratégica de marketing e vendas do grupo **Rei do Pano** (tecidos, cama/mesa/banho, utilidades domésticas — Vilhena, Colorado do Oeste e Cerejeiras, RO) e sua marca irmã **Rainha Modas** (moda feminina, calçados e acessórios), conduzida pela **V4 Company** com apoio de design do estúdio parceiro **Kuri & Co.**

O projeto ainda não está estruturado no formato padrão de cliente do sistema `v4-estruturacao-ia` (pastas `clientes/{slug}/client.json` + `base-de-conhecimento/` + `outputs/`) — em vez disso, os materiais originais chegaram organizados em pastas numeradas (`01/` a `05/`), refletindo a sequência de entregas do processo (pré-kick-off → kick-off → análise de social media → briefing mestre + pesquisa de mercado → estruturação de tráfego pago → manual de marca/KV e landing page).

Esta consolidação (pasta `consolidado/`) lê todos esses materiais de ponta a ponta, cruza informações entre fontes, resolve divergências quando possível (e as documenta quando não), e organiza o conhecimento por dimensão estratégica — mapeada às skills oficiais do sistema `v4-estruturacao-ia` sempre que há correspondência clara.

## Estrutura de pastas

```
rei-do-pano/
├── 01/ 02/ 03/ 04/ 05/     ← materiais originais (intocados)
├── consolidado/            ← base de conhecimento consolidada (este mapa indexa cada arquivo)
├── MAPA-ESTRUTURACAO.md    ← você está aqui
└── PENDENCIAS-ESTRUTURACAO.md
```

## Skills e suas entregas consolidadas

### Semana 1 — Descoberta do Negócio e Pesquisa de Mercado

#### 1. `ee-s1-persona-icp` — ICP e Persona (Jobs-to-be-Done)
**Objetivo:** definir o cliente ideal de cada marca com framework JTBD.
**Entrega consolidada:** [`consolidado/01-persona-icp-jtbd.md`](consolidado/01-persona-icp-jtbd.md)
**Fontes principais:** Briefing Mestre; Estruturação de Tráfego Pago (seção 03 — Análise de Público)
**Status:** **Completo** para B2C (Dona Aparecida / Camila, com JTBD funcional/emocional/social e nível de consciência mapeado) · **Parcial** para B2B (caracterização existe, sem persona nomeada)

#### 2. `ee-s1-auditoria-comunicacao` — Auditoria de Comunicação
**Objetivo:** mapear pontos de contato digitais e gerar matriz de gaps e quick wins.
**Entrega consolidada:** [`consolidado/04-auditoria-comunicacao-redes-sociais.md`](consolidado/04-auditoria-comunicacao-redes-sociais.md)
**Fontes principais:** Análise de Social Media (auditoria ponto a ponto de Instagram + benchmark de concorrentes)
**Status:** **Completo** para Instagram (ambas as marcas) · **Pendente** para WhatsApp Business, Facebook e uma matriz de gaps formal (site/GMB cobertos apenas indiretamente)

#### 3. `ee-s1-swot` — Análise de Concorrentes + SWOT
**Objetivo:** scorecard de concorrentes com evidência, SWOT acionável, matriz TOWS, priorização em Gantt de 90 dias.
**Entrega consolidada:** [`consolidado/02-mercado-swot-concorrentes.md`](consolidado/02-mercado-swot-concorrentes.md)
**Fontes principais:** Pré-kick-off (concorrentes citados pelo cliente); Estruturação de Tráfego Pago (scorecard de rastreamento/mídia de Havan e Lojas Avenida, com evidência); Análise de Social Media (benchmark de criativos de 5 outras referências)
**Status:** **Completo** (scorecard de concorrentes com evidência + SWOT reorganizado) · **Pendente** matriz TOWS formal e Gantt de 90 dias

#### 4. `ee-s2-pesquisa-mercado` — Pesquisa de Mercado
**Objetivo:** TAM/SAM/SOM, concorrentes, tendências, JTBD e diferenciais reais.
**Entrega consolidada:** [`consolidado/02-mercado-swot-concorrentes.md`](consolidado/02-mercado-swot-concorrentes.md) (contexto de mercado, sazonalidade, dados de busca) + [`consolidado/00-empresa-e-contexto.md`](consolidado/00-empresa-e-contexto.md) (posicionamento atual/desejado, objetivo central)
**Fontes principais:** Pesquisa de Mercado (mapa estratégico 4Ps + AEMR)
**Status:** **Parcial** — cobre concorrência, tendências e diferenciais em profundidade; **TAM/SAM/SOM não calculado** (existe apenas a área de influência como proxy)

#### 5. `ee-s1-arquitetura-presenca` — Arquitetura de Presença Digital
**Objetivo:** inventário de ativos digitais, porta de entrada, hand-offs entre canais, níveis 1-4.
**Entrega consolidada:** não há arquivo dedicado — informação equivalente está distribuída entre [`consolidado/04-auditoria-comunicacao-redes-sociais.md`](consolidado/04-auditoria-comunicacao-redes-sociais.md) e [`consolidado/05-diagnostico-midia-trafego-pago.md`](consolidado/05-diagnostico-midia-trafego-pago.md) (canais definidos na seção Praça dos 4Ps: Instagram, WhatsApp Business, Landing Page, Google Meu Negócio, marketplace como fase 2)
**Status:** **Pendente** como entrega formal — a skill é `[STUB]` na implementação do sistema; os materiais deste projeto não incluem um inventário estruturado por níveis 1-4

### Semana 2 — Diagnóstico Digital e Posicionamento Estratégico

#### 6. `ee-s2-diagnostico-midia` — Diagnóstico de Mídia Paga
**Objetivo:** métricas atuais vs. benchmarks, top problemas, plano de ação 30 dias.
**Entrega consolidada:** [`consolidado/05-diagnostico-midia-trafego-pago.md`](consolidado/05-diagnostico-midia-trafego-pago.md)
**Fontes principais:** Estruturação de Tráfego Pago (documento completo — setup, público, plataformas, estratégia Meta e Google Ads)
**Status:** **Completo** para diagnóstico de ponto de partida (V0), estrutura de campanhas e dados de busca · **Documento-fonte truncado** nas seções 08 (Copy Meta Ads) e 09 (Fluxo) — não recuperável nesta consolidação

#### 7. `ee-s2-diagnostico-organico-ig` — Diagnóstico de Conteúdo Orgânico Instagram
**Entrega consolidada:** coberto dentro de [`consolidado/04-auditoria-comunicacao-redes-sociais.md`](consolidado/04-auditoria-comunicacao-redes-sociais.md) (linha editorial, Reels, benchmark direto de concorrentes via Instagram)
**Status:** **Completo** — via API Instagram Graph não foi usada (o material é uma auditoria manual/qualitativa, não um relatório de API), mas o conteúdo analítico esperado está presente

#### 8. `ee-s2-diagnostico-criativos` — Diagnóstico de Criativos
**Entrega consolidada:** coberto dentro de [`consolidado/04-auditoria-comunicacao-redes-sociais.md`](consolidado/04-auditoria-comunicacao-redes-sociais.md) (matriz de forças/oportunidades de melhoria por criativo de concorrente, com evidência visual) e [`consolidado/06-landing-page-copy-criativos.md`](consolidado/06-landing-page-copy-criativos.md) (criativos próprios produzidos)
**Status:** **Completo** para benchmark de concorrentes · **Parcial** para os criativos próprios (apenas Rei do Pano tem assets finais localizados)

#### 9. `ee-s1-diagnostico-maturidade` — Diagnóstico de Maturidade Digital
**Entrega consolidada:** [`consolidado/05-diagnostico-midia-trafego-pago.md`](consolidado/05-diagnostico-midia-trafego-pago.md), seção 1 (classificação V0 — Estruturação, por pilar)
**Status:** **Completo** para o nível geral (V0) e pilares de mídia/rastreamento · scorecard formal por pilar (Mídia, Orgânico/SEO, Criativos, CRM, CRO) com benchmark setorial não encontrado como peça isolada

#### 10. `ee-s2-posicionamento` — Canvas de Posicionamento
**Objetivo:** PUV, 4Ps, território de marca, taglines.
**Entrega consolidada:** [`consolidado/03-posicionamento-e-manual-de-marca.md`](consolidado/03-posicionamento-e-manual-de-marca.md)
**Fontes principais:** Pesquisa de Mercado (4Ps completos); Manual de Marca/KV (manifesto, DNA de marca, arquétipos)
**Status:** **Completo** para 4Ps, narrativa/território de marca ("O Novo Reinado") e posicionamento atual/desejado · **Pendente** um Canvas PUV formal com taglines alternativas testadas

### Semana 4 — Identidade de Comunicação e Plano de Mídia (produção)

#### 11. `ee-s3-manual-marca` — Manual de Marca (Brandbook + MIV)
**Entrega consolidada:** [`consolidado/03-posicionamento-e-manual-de-marca.md`](consolidado/03-posicionamento-e-manual-de-marca.md)
**Fontes principais:** `05/KV - Rei do Pano.pdf` (31 páginas — o documento mais completo e visualmente rico do projeto)
**Status:** **Completo** — manifesto, DNA de marca, arquétipos, pilares/valores, paleta (hex codes), tipografia, sistema de logo e aplicações, todos documentados. Uma inconsistência de conteúdo copiado entre marcas foi identificada e registrada.

#### 12. `ee-s3-landing-page` — Landing Page
**Entrega consolidada:** [`consolidado/06-landing-page-copy-criativos.md`](consolidado/06-landing-page-copy-criativos.md)
**Fontes principais:** Briefing Mestre (copy planejada); verificação ao vivo de `https://rei-do-pano.vercel.app/`
**Status:** **Completo e implantado** — página publicada e funcional, com estrutura que expande o planejado originalmente

#### 13. `ee-s3-copy-anuncios` — Copy de Anúncios (Meta + Google)
**Entrega consolidada:** [`consolidado/05-diagnostico-midia-trafego-pago.md`](consolidado/05-diagnostico-midia-trafego-pago.md), seção 5
**Status:** **Completo** para Google Ads (títulos, descrições e sitelinks prontos para as duas marcas) · **Ausente** para Meta Ads (seção truncada no documento-fonte)

#### 14. `ee-s3-criativos-anuncios` — Briefing Criativo de Anúncios
**Entrega consolidada:** [`consolidado/06-landing-page-copy-criativos.md`](consolidado/06-landing-page-copy-criativos.md), seções 5–6
**Status:** **Completo** para Rei do Pano (briefing + 3 assets finais) · **Parcial** para Rainha Modas (apenas briefing textual, sem assets finais localizados)

#### 15. `ee-s3-forecast-midia` — Forecast e Plano de Mídia (6 meses)
**Status:** **Não iniciado** — nenhum material de forecast financeiro/plano de mídia de 6 meses foi encontrado no projeto

#### 16. `ee-s3-crm-setup`, `ee-s5-scripts-sdr`, `ee-s5-sdr-ia-config`
**Status:** **Não iniciado** — nenhum material de CRM (Kommo), scripts de SDR IA ou configuração de agente foi encontrado. Compatível com o fato de o `meta.modelo_venda` mais provável para este cliente ser PDV/loja física com WhatsApp humano, não necessariamente Inside Sales com SDR IA (não confirmado — ver `PENDENCIAS-ESTRUTURACAO.md`).

### Contexto adicional (sem skill correspondente direta)

#### 17. Equipe do Projeto e Fornecedores
**Entrega consolidada:** [`consolidado/07-equipe-e-fornecedores.md`](consolidado/07-equipe-e-fornecedores.md)
**Fontes principais:** apresentação de kick-off; rodapé do Manual de Marca ("Designed by Kuri & Co")
**Status:** **Parcial** — papéis de Coordenação (Ana Talita) e Diretoria (Rafael Lonkouski) confirmados; demais papéis (Account Manager, Gestor de Tráfego, Designer) divergem entre 4 versões do material de kick-off

#### 18. Empresa e Contexto Geral
**Entrega consolidada:** [`consolidado/00-empresa-e-contexto.md`](consolidado/00-empresa-e-contexto.md)
**Status:** **Completo** para identidade, missão/visão/valores, modelo de negócio, diferenciais e objetivo central · **Pendente** boa parte dos dados financeiros (faturamento, ticket médio, margem atual — nunca preenchidos no formulário de pré-kick-off)

## Como usar esta base

- Comece por `00-empresa-e-contexto.md` para o panorama geral do grupo.
- `01` a `06` seguem a lógica das semanas 1, 2 e 4 da Estruturação Estratégica (persona → mercado/SWOT → posicionamento/marca → auditoria de comunicação → mídia/tráfego pago → landing page/copy/criativos).
- `07` traz contexto operacional (equipe, fornecedores).
- `PENDENCIAS-ESTRUTURACAO.md` lista, por skill, exatamente o que falta levantar antes de qualquer entrega subsequente depender dessa informação.
- Cada arquivo em `consolidado/` tem sua própria seção "Fontes consultadas" ao final, remetendo aos arquivos originais em `01/` a `05/` para auditoria/verificação.
