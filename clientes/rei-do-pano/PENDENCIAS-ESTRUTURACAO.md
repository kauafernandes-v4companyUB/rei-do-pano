# Pendências da Estruturação Estratégica — Rei do Pano & Rainha Modas

> Lista consolidada de informações que as skills da Estruturação Estratégica exigem e que **não foram encontradas** nos materiais analisados. Ausência de informação não é erro — é o que ainda precisa ser levantado com o cliente ou operador.
> Ver os arquivos em `base-de-conhecimento/` para o detalhamento completo de cada ponto e suas fontes.
>
> **Revisão de 2026-09-10:** lista podada pelo operador — itens de baixa materialidade ou excessivamente específicos (nitpicks de formato de entrega, ou pontos já resolvidos por confirmação direta) foram removidos. A pendência de equipe/fornecedores foi **resolvida** (ver `base-de-conhecimento/07-equipe-e-fornecedores.md`) e a de arquitetura de sistema também (ver seção final deste arquivo).

## Empresa e dados de negócio (`base-de-conhecimento/00-empresa-e-contexto.md`)

- [ ] Razão social / CNPJ do grupo.
- [ ] Data de fundação exata (fontes divergem entre "mais de 30 anos" e "quatro décadas").
- [ ] Headcount total do grupo (3 lojas Rei do Pano + Rainha Modas) — só há o número da unidade principal de Vilhena (~40 colaboradores).
- [ ] Faturamento anual, detalhado mês a mês e por canal (online/offline) e por região.
- [ ] Ticket médio de vendas.
- [ ] Taxa de crescimento anual dos últimos 3 anos.
- [ ] Verba mínima e máxima esperada de faturamento a partir do investimento em mídia.
- [ ] Margem de contribuição atual (só existe a margem-alvo de 8–10%, que é uma meta, não o valor atual).
- [ ] Confirmação formal do uso do sistema Linx como ERP/PDV (citado apenas em documentos posteriores ao pré-kick-off).
- [ ] Estrutura de forças de vendas (não respondida no pré-kick-off).

## Persona / ICP (`base-de-conhecimento/01-persona-icp-jtbd.md`)

- [ ] Persona nomeada e JTBD estruturado para o segmento B2B (existe caracterização, mas não no mesmo nível de profundidade de Dona Aparecida/Camila).

## Mercado, SWOT e concorrentes (`base-de-conhecimento/02-mercado-swot-concorrentes.md`)

- [ ] Matriz TOWS formal (cruzamento Forças×Oportunidades, Forças×Ameaças etc.) — hoje só existem os elementos brutos organizados em SWOT.
- [ ] TAM/SAM/SOM calculado (existe apenas a área de influência ~180 mil habitantes/raio de 120 km como proxy de TAM).

## Posicionamento e Manual de Marca (`base-de-conhecimento/03-posicionamento-e-manual-de-marca.md`)

- [ ] Canvas de Posicionamento formal (PUV estruturada, territórios de marca, taglines alternativas testadas) — hoje existe apenas o Manifesto/storytelling "O Novo Reinado" e a tagline única "Construindo um Novo Reinado".
- [ ] Esclarecer se o conteúdo duplicado nos "Pilares e Valores" da Rainha Modas (texto idêntico ao do Rei do Pano, falando de tecidos/3.000m²) é um erro de produção do Manual de Marca ou conteúdo intencional a ser revisado.

## Auditoria de Comunicação (`base-de-conhecimento/04-auditoria-comunicacao-redes-sociais.md`)

- [ ] Auditoria dedicada de WhatsApp Business (estrutura de catálogo, mensagens automáticas, etiquetas).
- [ ] Handles reais de Instagram e número de WhatsApp Business das duas marcas (os materiais tratam apenas do formato recomendado, ex. @reidopanooficial, sem confirmar o handle real em uso).

## Diagnóstico de Mídia / Tráfego Pago (`base-de-conhecimento/05-diagnostico-midia-trafego-pago.md`)

- [ ] **Seção "08 — Copy para Meta Ads" do documento de Tráfego Pago está truncada** — apenas o cabeçalho aparece no PDF; nenhuma copy de anúncio Meta foi recuperada (distinto dos textos de Google Ads, que estão completos).
- [ ] **Seção "09 — Fluxo" do mesmo documento está ausente** — não há conteúdo algum, apenas a referência na navegação do documento.
- [ ] Orçamento de mídia (budget mensal por plataforma).
- [ ] Metas de CPA/CPL/ROAS esperadas e forecast de mídia (escopo da skill `ee-s3-forecast-midia`, sem material disponível neste projeto).
- [ ] Confirmação de que as contas de anúncio (Meta Business Manager, Google Ads) já foram efetivamente criadas.
- [ ] Decisão final sobre conta de anúncios da Rainha Modas: separada ou integrada ao Business Manager principal.

## Landing Page, Copy e Criativos (`base-de-conhecimento/06-landing-page-copy-criativos.md`)

- [ ] Copy de anúncios Meta Ads (30+ variações por funil, conforme escopo da skill `ee-s3-copy-anuncios`) — não localizada.
- [ ] Criativos estáticos finalizados da **Rainha Modas** — só os 3 criativos do Rei do Pano foram encontrados como arquivos de imagem prontos.
- [ ] Confirmação da configuração/extração do sistema Linx (pré-requisito citado tanto no roadmap quanto na estratégia de público para remarketing).
- [ ] Confirmação de quais eventos de conversão estão de fato configurados no Pixel/GTM da landing page (clique WhatsApp vs. envio de formulário de cotação, ou ambos).

## Equipe e Fornecedores — RESOLVIDO ✅

Equipe V4 final confirmada pelo operador (2026-09-10): Kauã Fernandes (Account Manager), Luciano (Gestor de Tráfego), Leo (Designer/Social Media), Nathalia (Head de Squad), unidade **Leal Vieira & Co.** Ver `base-de-conhecimento/07-equipe-e-fornecedores.md` para a reconciliação com o nome "Kuri & Co." visto no Manual de Marca.

## Arquitetura de sistema — RESOLVIDO ✅

Este projeto agora está estruturado no padrão oficial de cliente do sistema `v4-estruturacao-ia`: `client.json` (fonte única de verdade), `base-de-conhecimento/` (conhecimento consolidado) e `outputs/` (aguardando geração de outputs formais por skill — ver `outputs/README.md`). `meta.modelo_venda` definido como `"pdv"` (loja física com crediário próprio, WhatsApp e base de clientes Linx — perfil que corresponde exatamente às skills de Semana 3 do modelo PDV).

### Pendência remanescente da arquitetura
- [ ] Os outputs formais em JSON (`outputs/{skill}.json`, validados pelo `schema.json` de cada skill) ainda não foram gerados — o que existe hoje em `base-de-conhecimento/` é a síntese em Markdown desta consolidação, que serve de insumo para gerar esses outputs quando cada skill for rodada/validada com o operador.
- [ ] `workspace_id` do V4MOS não identificado nos materiais — sem ele, não há integração automática de dados de mídia (Google Ads/Facebook Ads) via API.
