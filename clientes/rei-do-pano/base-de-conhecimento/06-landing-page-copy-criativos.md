# Landing Page, Copy e Criativos de Anúncio — Rei do Pano & Rainha Modas

> Skills relacionadas: `ee-s3-landing-page`, `ee-s3-copy-anuncios`, `ee-s3-criativos-anuncios`. Fontes: Briefing Mestre (doc. 03 — copy/estrutura original planejada), `05/LINK PARA A LANDING PAGE.docx` (link da entrega ao vivo), verificação direta da landing page publicada, e os 3 assets de criativos estáticos em `05/Criativos KV-assets/` (idênticos aos exemplos já embutidos no Manual de Marca).
> Legenda: ✅ fato · 💡 inferência · 🔎 pendente · ⚠️ divergência.

## 1. Landing Page — status da entrega

- **URL ao vivo:** https://rei-do-pano.vercel.app/ (registrada em `05/LINK PARA A LANDING PAGE.docx`). ✅ **Confirmado publicado e acessível** — a página está no ar (verificação feita durante esta consolidação).
- Hospedagem: Vercel — consistente com o padrão de entregáveis de landing page descrito na arquitetura da Estruturação Estratégica (`ee-s3-landing-page`: "Copy completa seção por seção, geração de código React+Tailwind, e deploy na Vercel").

## 2. Estrutura planejada (Briefing Mestre, seção "04 — Landing Page B2C/B2B")

Página de conversão para WhatsApp, estrutura originalmente definida:

| Seção | Copy planejada |
|---|---|
| 1. Hero (Topo) | Headline: "A maior variedade de tecidos e decoração de Vilhena, agora a um clique de você." Subtexto: "Há mais de 30 anos entregando qualidade com facilidade no pagamento." CTA principal: botão amarelo "Falar com um Vendedor no WhatsApp" |
| 2. Categorias | Grade visual com fotos bem iluminadas: (1) Cama, Mesa e Banho; (2) Tecidos por Metro e Aviamentos; (3) Eletrodomésticos e Utilidades; (4) Cortinas Sob Medida |
| 3. Vantagens Competitivas | 3 ícones: 💳 Crediário Próprio (facilitado e sem burocracia); 👑 Tradição (mais de 3 décadas de confiança); 🤝 Atendimento Humano (você não é um número, é de casa) |
| 4. Prova Social | Headline: "O que nossos clientes dizem." Exibição de estrelas (4,6/5,0) do Google Meu Negócio + 3 prints de avaliações reais elogiando atendimento e variedade |
| 5. Direcionamento Geográfico | Mapa/listagem das unidades (Vilhena, Cerejeiras, Colorado do Oeste), com opção de escolher com qual loja deseja falar no WhatsApp |

## 3. Estrutura efetivamente publicada (verificação ao vivo)

A verificação da landing page ao vivo mostra uma versão **mais completa** que a planejada no briefing — a estrutura final tem 14 blocos, todos coerentes com o Manual de Marca e o Manual de Copy:

1. **Header/Navegação** — menu: Vantagens, Produtos, Clientes, História, Lojas, FAQ. CTA: "Solicitar Cotação".
2. **Hero** — Headline: **"Construindo um Novo Reinado"** (tagline derivada do conceito de marca "O Novo Reinado"). Subtexto reforça "maior variedade de tecidos e decoração, agora a um clique" e "há mais de 30 anos vestindo e decorando lares". CTAs: WhatsApp + "Ver Vantagens". Números-chave exibidos: 30+ anos, 3 lojas, 3.000 m².
3. **Vantagens** — "Por que comprar com o Rei do Pano?": crediário próprio até 6x sem juros; história/tradição 30+ anos; atendimento "caloroso e humano".
4. **Trajetória/Nossa História** — destaca a estrutura de 3.000 m² com elevador; consolida a narrativa de tradição Rei do Pano + Grupo Rainha Modas.
5. **Mix de Produtos** — 4 categorias (igual ao planejado): Cama, Mesa & Banho · Tecidos & Aviamentos · Eletros & Utilidades · Cortinas Sob Medida — cada uma com imagem, descrição e CTA via WhatsApp.
6. **Segmentação de Clientes** — B2C (donas de casa e famílias) e B2B (costureiras e tapeceiros), confirmando a implementação do ICP dual descrito em `01-persona-icp-jtbd.md`.
7. **Galeria Visual** — 5 imagens temáticas (vitrine, enxoval, confecção, mesa posta, cortinas).
8. **Depoimentos/Provas Sociais** — avaliação agregada 4,6/5,0 (327 avaliações) + 3 depoimentos nominais de clientes reais, com cidade.
9. **Presença Regional/Lojas** — as três unidades, com endereço completo, telefone/WhatsApp e CTA individual por loja.
10. **Formulário de Cotação** — campos: Nome, WhatsApp, Cidade, UF, Categoria de Interesse (Tecidos, Cama/Mesa/Banho, Eletros, Cortinas, Crediário), Mensagem. Aviso de proteção de dados.
11. **FAQ** — 6 perguntas: funcionamento do crediário próprio; compra de tecidos por WhatsApp; cortinas sob medida; canais de atendimento; condições para profissionais (B2B); formas de pagamento.
12. **CTA Final** — "Renove a sua casa" + botão WhatsApp comercial.
13. **Footer** — logo/tagline, navegação, contatos, endereços das 3 unidades, copyright 2026.
14. **Modal de confirmação** — "Sua solicitação de cotação foi enviada."

### ✅ Cruzamento planejado × entregue
A landing page publicada **cumpre e expande** a estrutura originalmente prevista no Briefing Mestre: mantém hero, categorias, vantagens, prova social e direcionamento geográfico exatamente como planejado, e adiciona seções de aprofundamento (História, Segmentação B2C/B2B, Galeria, FAQ e um formulário de cotação estruturado que não estava detalhado no briefing original). O crediário, o WhatsApp como canal principal e a segmentação B2C/B2B aparecem de forma consistente em múltiplos pontos da página — alinhado à estratégia de copy e à segmentação de público definidas em `01-persona-icp-jtbd.md` e `03-posicionamento-e-manual-de-marca.md`.

💡 **Observação:** a página já está pronta para gerar leads via formulário (não apenas via WhatsApp), o que é uma evolução em relação ao objetivo original descrito no Briefing Mestre ("foco em coletar lead ou direcionar ao WhatsApp" — Pesquisa de Mercado, seção Praça). Isso é relevante para o Pixel/eventos de conversão descritos em `05-diagnostico-midia-trafego-pago.md`: o evento de conversão da LP pode ser tanto "clique no WhatsApp" quanto "envio de formulário de cotação" — **pendência**: confirmar quais eventos estão de fato configurados no Pixel/GTM para esta página. 🔎

## 4. Manual de Copy (referência completa)

Ver `03-posicionamento-e-manual-de-marca.md`, seção 7, para tom de voz, atributos de comunicação, palavras-chave a usar/evitar e banco de headlines.

## 5. Criativos estáticos e briefing de designer (fonte: Briefing Mestre, seção "05 — Criativos Estáticos & Roadmap")

**Regra de ouro:** todos os criativos devem respeitar as cores da marca (Vermelho e Amarelo para Rei do Pano), possuir CTAs claros ("Pedir agora", "Saiba mais") e não parecer um panfleto estático de mercado.

### Criativos Rei do Pano (briefing original)
| # | Objetivo | Headline / Subheadline | CTA |
|---|---|---|---|
| 1 | Captação de novos clientes (B2C) — foco em oferta-âncora (enxoval ou Paninho Mágico) | "Ganhe 15% de desconto na primeira compra" / "Apresente este post na loja" | Levar tráfego digital para a loja física |
| 2 | Institucional/Autoridade — foco no crediário próprio, imagem acolhedora | "Realize o sonho da casa renovada com o Crediário Rei do Pano." | — |
| 3 | Reengajamento (base inativa) | "Pano Mágico" / "15% de desconto" | "Pedir agora" |

### Criativos Rainha Modas (briefing original)
| # | Headline | Subheadline | CTA |
|---|---|---|---|
| 1 | "O melhor da moda" | "15% de desconto na compra de duas peças" | "Pedir agora" |
| 2 | "As melhores marcas" | "No crediário" | "Pedir agora" |
| 3 | "Vestido com renda" | "10% de desconto no crediário da loja" | — |

### ✅ Criativos efetivamente produzidos e entregues (arquivos em `05/Criativos KV-assets/` e replicados no Manual de Marca)
Os 3 assets finais em PNG (e as versões equivalentes nas páginas de "Aplicações" do Manual de Marca) correspondem aos criativos 1, 2 e 3 do **Rei do Pano** do briefing original, com adaptações finais de arte:
1. **"GANHE 15% DE DESCONTO NA PRIMEIRA COMPRA"** — mascote do Rei ilustrado, 3 fotos de produto (jogo de cama, foto do Rei, roupa de cama azul), CTA "Apresente este post na loja".
2. **"Realize o sonho da casa renovada com o CREDIÁRIO REI DO PANO" + "COMPRAR AGORA"** — foto de toalhas empilhadas em ambiente de banheiro, logo do Rei do Pano.
3. **"PANO MÁGICO — 15% DE DESCONTO" + "COMPRAR AGORA"** — foto de panos multicoloridos (laranja/verde/azul) sobre mesa de madeira, claim "Não precisa de produtos químicos".

⚠️ **Observação:** não foram localizados nos materiais os 3 criativos equivalentes já finalizados para a **Rainha Modas** (apenas o briefing textual do que deveria ser produzido) — os arquivos de imagem disponíveis cobrem exclusivamente os criativos do Rei do Pano. 🔎 Pendência: confirmar se os criativos estáticos da Rainha Modas já foram produzidos e apenas não foram anexados a este projeto, ou se ainda estão pendentes de produção.

## 6. Roadmap de implementação (cruzamento)

Ver `04-auditoria-comunicacao-redes-sociais.md`, seção 5, para o roadmap completo (Semanas 1 a 5). Pontos relevantes para esta seção:
- **Semanas 3–4:** aprovação do Manual da Marca e criativos — responsável **Kuri & Co. (Renan)**.
- **Semana 4–5:** lançamento da LP e configuração do Linx (página conectada aos WhatsApps; extração de relatórios de clientes inativos para disparo de ofertas).

## 7. Lacunas identificadas

- Copy de anúncios Meta Ads (30+ variações por funil, conforme escopo da skill `ee-s3-copy-anuncios`) não está presente nos materiais — a seção "08 — Copy para Meta Ads" do documento de Tráfego Pago está truncada (ver `05-diagnostico-midia-trafego-pago.md`, seção 6). Apenas os textos de **Google Ads** estão completos. 🔎
- Criativos estáticos finalizados da Rainha Modas não localizados (ver seção 5 acima). 🔎
- Não há confirmação de que a extração/configuração do Linx (pré-requisito citado tanto no roadmap quanto na estratégia de público) já foi concluída. 🔎
- Não há briefing de vídeo/Reels para anúncios (os materiais tratam a estratégia de Reels apenas no âmbito orgânico — ver `04-auditoria-comunicacao-redes-sociais.md`). 🔎

## Fontes consultadas

- `03/03 - Briefing Mestre - Rei do Pano.docx` (seções 04 e 05)
- `05/LINK PARA A LANDING PAGE.docx`
- `05/Criativos KV-assets/001.png`, `002.png`, `003.png`
- `05/KV - Rei do Pano.pdf` (páginas de "Padronização Criativa" / Aplicações)
- Verificação ao vivo de `https://rei-do-pano.vercel.app/` (landing page publicada)
