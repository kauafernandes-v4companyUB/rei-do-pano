# Tagueamento Rei do Pano: orientações para o gestor de tráfego

**Contêiner GTM:** `GTM-KFKG4QMG`, o mesmo nas duas páginas
**Atualizado em:** 25/09/2026

| Página | URL | Papel |
| --- | --- | --- |
| LP institucional | https://lp.reidopano.com.br | Página completa: 13 botões de WhatsApp e formulário de cotação |
| LP do crediário | https://crediario.reidopano.com.br | Página curta de mídia: pré-cadastro do Crediário Fácil |
| Painel de leads do crediário | https://crediario.reidopano.com.br/leads-panel | Lista, edição e exportação CSV dos pré-cadastros (acesso de admin) |

As duas páginas já estão prontas. Cada interação envia um evento padronizado ao `dataLayer`, e sua parte é configurar o GTM para repassar esses eventos ao **Meta**, ao **Clarity**, ao **GA4** e ao **Google Ads**.

**Regras que valem para tudo**

- **Não cole nenhum código de Pixel, Clarity, GA4 ou Google Ads no HTML das páginas.** Tudo passa pelo GTM. Código colado direto dispara em dobro e ignora o aviso de cookies.
- **Não crie acionadores por texto do botão, classe CSS ou URL clicada.** Use só os eventos deste documento. Os botões têm identificadores fixos, então mudar copy ou layout não quebra a medição.
- **Separe as páginas pelo hostname.** Como o contêiner é o mesmo, todo acionador de evento leva a condição `Page Hostname` igual a `lp.reidopano.com.br` ou `crediario.reidopano.com.br`.

---

## 1. O que cada página envia

### 1.1 LP institucional (`lp.reidopano.com.br`)

| Evento | Quando dispara | Conversão? |
| --- | --- | --- |
| `whatsapp_click` | Clique em qualquer um dos 13 botões de WhatsApp | **Sim, principal** |
| `generate_lead` | Formulário de cotação validado e enviado (abre o WhatsApp com os dados) | **Sim** |
| `quote_cta_click` | Clique em "Solicitar Cotação" (só rola até o formulário) | Não |
| `quote_form_view` | Formulário apareceu na tela (1x por visita) | Não |
| `form_start` | Primeiro campo do formulário tocado (1x por visita) | Não |
| `form_error` | Tentou enviar com campo inválido | Não |
| `navigation_click` | Links do menu, do rodapé e "Ver Vantagens" | Não |
| `faq_open` | Pergunta do FAQ aberta | Não |
| `gallery_open` | Foto da galeria ampliada | Não |

`whatsapp_click` e `generate_lead` **nunca disparam juntos**. O formulário abre o WhatsApp sem passar por um link, então um lead não conta duas vezes.

**Parâmetros**

| Parâmetro | Exemplo | Presente em |
| --- | --- | --- |
| `event_id` | `wa_1790341595_k3f9` | `whatsapp_click`, `generate_lead` |
| `cta_id` | `produto_cortinas` | cliques e formulário |
| `cta_text` | `Cotar Cortina Sob Medida →` | cliques |
| `cta_section` | `produtos` | cliques |
| `cta_type` | `whatsapp`, `scroll`, `form` | cliques |
| `branch` | `central`, `vilhena`, `colorado`, `cerejeiras` | `whatsapp_click`, `generate_lead` |
| `interest` | `tecidos_aviamentos`, `cama_mesa_banho`, `eletros_utilidades`, `cortinas`, `crediario`, `geral` | `whatsapp_click`, `generate_lead` |
| `form_id` | `quote_whatsapp` | eventos do formulário |
| `lead_city` / `lead_uf` | `Vilhena` / `RO` | `generate_lead` |
| `field` | `f-tel` | `form_error` |
| `question` | texto da pergunta | `faq_open` |
| `utm_source` … `utm_term`, `fbclid`, `gclid` | valores da campanha | todos, quando existirem |

Nesta página as UTMs e os click IDs ficam guardados no navegador. Se a pessoa voltar depois sem UTM, a última campanha continua associada.

**Mapa dos botões**

| cta_id | Botão | Evento | branch |
| --- | --- | --- | --- |
| `hero_whatsapp` | Falar com um Vendedor no WhatsApp (topo) | `whatsapp_click` | central |
| `vantagens_whatsapp` | Falar com Nossos Vendedores | `whatsapp_click` | central |
| `produto_cama_mesa_banho` | Ver Cama, Mesa & Banho | `whatsapp_click` | central |
| `produto_tecidos_aviamentos` | Ver Tecidos & Aviamentos | `whatsapp_click` | central |
| `produto_eletros_utilidades` | Ver Eletros & Utilidades | `whatsapp_click` | central |
| `produto_cortinas` | Cotar Cortina Sob Medida | `whatsapp_click` | central |
| `depoimentos_duvidas` | Tirar Dúvidas no WhatsApp | `whatsapp_click` | central |
| `loja_vilhena_whatsapp` | Falar com Vilhena | `whatsapp_click` | vilhena |
| `loja_colorado_whatsapp` | Falar com Colorado | `whatsapp_click` | colorado |
| `loja_cerejeiras_whatsapp` | Falar com Cerejeiras | `whatsapp_click` | cerejeiras |
| `final_whatsapp` | Falar no WhatsApp Comercial | `whatsapp_click` | central |
| `footer_whatsapp` | (65) 99927-9546 no rodapé | `whatsapp_click` | central |
| `floating_whatsapp` | Botão flutuante | `whatsapp_click` | central |
| `form_submit_whatsapp` | Envio do formulário | `generate_lead` | central |
| `header_solicitar_cotacao` | Solicitar Cotação | `quote_cta_click` | — |

Toda mensagem de WhatsApp desta página abre com `NÃO APAGUE ESSA MENSAGEM!` e termina com o código de origem, por exemplo `Código de origem: LP-produto_cortinas | meta/vilhena_trafego`. Na conversa, o vendedor vê de qual botão e de qual campanha veio o contato.

### 1.2 LP do crediário (`crediario.reidopano.com.br`)

Tem um único formulário de pré-cadastro. O envio válido grava o lead no banco (visível no painel) e abre o WhatsApp `5565999279546` com os dados preenchidos.

| Evento | Quando dispara | Parâmetros | Conversão? |
| --- | --- | --- | --- |
| `form_start_crediario` | Primeiro toque em um campo (1x por visita) | `form_id` = `form-pre-cadastro` | Não |
| `lead` | Formulário válido enviado | `form_id`, `interesse`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term` | **Sim, principal** |
| `click_whatsapp` | Logo depois do `lead`, no mesmo envio | `whatsapp_number` = `5565999279546`, `origin` = `form_submit` | Secundária |

Valores de `interesse`: `Cama, Mesa & Banho`, `Tecidos & Aviamentos`, `Eletros & Utilidades`, `Cortinas Sob Medida`, `Quero conhecer as opções`, `Outro` ou `Não informado`.

**Atenção:** `lead` e `click_whatsapp` disparam **sempre juntos** no mesmo envio. Use só um deles como conversão principal (o `lead`), senão cada pré-cadastro conta duas vezes. Envio inválido não gera nenhum dos dois.

Nesta página as UTMs são lidas só da URL no momento do envio e não ficam guardadas no navegador. **O anúncio precisa levar direto para a URL com UTM**, por exemplo:

```
https://crediario.reidopano.com.br/?utm_source=meta&utm_medium=paid&utm_campaign={{campaign.name}}&utm_content={{ad.name}}
```

---

## 2. Aviso de cookies (Consent Mode v2)

As duas páginas mostram um aviso com **Aceitar** e **Recusar**. O link "Preferências de cookies", no rodapé, reabre o aviso. Antes do GTM carregar, a página já envia o consentimento padrão:

| Sinal | Antes da escolha | Aceitou | Recusou |
| --- | --- | --- | --- |
| `analytics_storage` | denied | granted | denied |
| `ad_storage`, `ad_user_data`, `ad_personalization` | denied | granted | denied |
| `functionality_storage`, `security_storage` | granted | granted | granted |

Na escolha, a página envia `gtag('consent', 'update', ...)` e o evento **`cookie_consent_update`**, com `cookie_consent` = `aceito` ou `recusado`. A escolha fica salva no navegador, e o aviso não reaparece nas próximas visitas. Toda página também envia `cookie_consent` = `pendente`, `aceito` ou `recusado` no carregamento.

O que isso significa para a medição:

- **GA4 e Google Ads** respeitam o Consent Mode sozinhos. Sem aceite, eles mandam só sinais sem cookies, e o Google usa esses sinais para modelar conversões.
- **Meta e Clarity** não leem o Consent Mode. Você precisa travar essas tags no GTM (seções 6 e 7).
- **O GTM não dispara depois uma tag que foi bloqueada.** Por isso as tags base do Meta e do Clarity também disparam no evento `cookie_consent_update`: quem aceita passa a ser medido na hora, sem recarregar a página.
- Eventos que aconteceram antes do aceite (um clique no WhatsApp, por exemplo) não chegam ao Meta depois. Isso é esperado.
- Os números do Meta e do Clarity vão cair na proporção de quem recusa ou ignora o aviso.

---

## 3. Antes de abrir o GTM

- [ ] **ID do Pixel** do Rei do Pano (Business Manager → Gerenciador de Eventos)
- [ ] **ID do projeto no Clarity**: criar em https://clarity.microsoft.com e copiar em Configurações → Visão geral. Um projeto serve para as duas páginas; separe por URL nos filtros.
- [ ] **ID de medição do GA4** (`G-…`), se for usar
- [ ] **ID e rótulos de conversão do Google Ads** (`AW-…/…`), se houver campanha no Google
- [ ] Acesso de **Publicar** no contêiner `GTM-KFKG4QMG`
- [ ] No GTM, em **Admin → Configurações do contêiner**, marcar **"Ativar visão geral do consentimento"**

---

## 4. Variáveis

Em **Variáveis → Variáveis definidas pelo usuário → Nova**:

| Nome | Tipo | Configuração |
| --- | --- | --- |
| `CONST - Meta Pixel ID` | Constante | ID do Pixel |
| `CONST - Clarity ID` | Constante | ID do projeto Clarity |
| `CONST - GA4 ID` | Constante | `G-…` |
| `DLV - event_id` | Variável da camada de dados | `event_id` |
| `DLV - cta_id` | Variável da camada de dados | `cta_id` |
| `DLV - cta_section` | Variável da camada de dados | `cta_section` |
| `DLV - interest` | Variável da camada de dados | `interest` (LP institucional) |
| `DLV - interesse` | Variável da camada de dados | `interesse` (crediário) |
| `DLV - branch` | Variável da camada de dados | `branch` |
| `DLV - form_id` | Variável da camada de dados | `form_id` |
| `DLV - cookie_consent` | Variável da camada de dados | `cookie_consent` |

Em **Variáveis integradas → Configurar**, ative `Event` e `Page Hostname`.

---

## 5. Acionadores

Em **Acionadores → Novo → Evento personalizado**. Todos com "Alguns eventos personalizados" e a condição de hostname indicada.

| Nome | Nome do evento | Regex? | Condição |
| --- | --- | --- | --- |
| `CE - LP - whatsapp_click` | `whatsapp_click` | Não | `Page Hostname` igual a `lp.reidopano.com.br` |
| `CE - LP - generate_lead` | `generate_lead` | Não | `Page Hostname` igual a `lp.reidopano.com.br` |
| `CE - LP - quote_form_view` | `quote_form_view` | Não | `Page Hostname` igual a `lp.reidopano.com.br` |
| `CE - LP - comportamento` | `^(quote_cta_click\|form_start\|form_error\|navigation_click\|faq_open\|gallery_open)$` | **Sim** | `Page Hostname` igual a `lp.reidopano.com.br` |
| `CE - CRED - form_start` | `form_start_crediario` | Não | `Page Hostname` igual a `crediario.reidopano.com.br` |
| `CE - CRED - lead` | `lead` | Não | `Page Hostname` igual a `crediario.reidopano.com.br` |
| `CE - CRED - click_whatsapp` | `click_whatsapp` | Não | `Page Hostname` igual a `crediario.reidopano.com.br` |
| `CE - clarity` | `^(whatsapp_click\|generate_lead\|quote_cta_click\|quote_form_view\|form_start\|form_error\|form_start_crediario\|lead\|click_whatsapp)$` | **Sim** | — |
| `CE - cookies aceitos` | `cookie_consent_update` | Não | `DLV - cookie_consent` igual a `aceito` |

Nas regex, digite **sem** as barras invertidas antes do `|`. Elas só estão aqui por causa da tabela.

---

## 6. Meta Pixel

### 6.1 Tags

Em todas as tags do Meta: **Configurações avançadas → Configurações de consentimento → "Exigir consentimento adicional para o disparo da tag"** → `ad_storage`.

**`Meta - Base + PageView`**
- Tipo: HTML personalizado
- Acionadores: **Initialization - All Pages** e **`CE - cookies aceitos`**
- Opções de disparo: **"Uma vez por página"**

```html
<script>
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
  n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
  document,'script','https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', '{{CONST - Meta Pixel ID}}');
  fbq('track', 'PageView');
</script>
```

As tags de evento abaixo usam **Sequenciamento de tags → "Disparar uma tag antes"**: `Meta - Base + PageView`.

| Tag | Acionador | Código |
| --- | --- | --- |
| `Meta - LP - Contact` | `CE - LP - whatsapp_click` | `fbq('track', 'Contact', { content_name: '{{DLV - cta_id}}', content_category: '{{DLV - interest}}' }, { eventID: '{{DLV - event_id}}' });` |
| `Meta - LP - Lead` | `CE - LP - generate_lead` | `fbq('track', 'Lead', { content_name: 'form_cotacao_lp', content_category: '{{DLV - interest}}' }, { eventID: '{{DLV - event_id}}' });` |
| `Meta - LP - ViewContent` | `CE - LP - quote_form_view` | `fbq('track', 'ViewContent', { content_name: 'formulario_lp' });` |
| `Meta - CRED - Lead` | `CE - CRED - lead` | `fbq('track', 'Lead', { content_name: 'pre_cadastro_crediario', content_category: '{{DLV - interesse}}' });` |
| `Meta - CRED - Contact` | `CE - CRED - click_whatsapp` | `fbq('track', 'Contact', { content_name: 'crediario_whatsapp' });` |

Em cada tag, envolva o código em `<script>` … `</script>`.

### 6.2 No Gerenciador de Eventos (fora do GTM)

- [ ] **Verificar o domínio** `reidopano.com.br` na Business Manager (Configurações do negócio → Segurança da marca → Domínios). Vale para os dois subdomínios.
- [ ] No Pixel → Configurações, **desligar** "Rastrear eventos automaticamente sem código". Senão o Meta registra cliques por conta própria e duplica eventos.
- [ ] **Não usar** a "Ferramenta de configuração de eventos" do Meta, que marca cliques por URL e texto, pelo mesmo motivo.
- [ ] Criar **conversões personalizadas** para separar as páginas: `Lead` com URL contendo `crediario.reidopano.com.br` = "Pré-cadastro crediário", e `Contact` com URL contendo `lp.reidopano.com.br` = "WhatsApp LP".

### 6.3 Nas campanhas

- **Campanhas para a LP institucional:** otimizar por **Contact** (clique no WhatsApp), que concentra o volume. `Lead` fica como secundária até o formulário passar de cerca de 50 envios por semana.
- **Campanhas para o crediário:** otimizar por **Lead** ("Pré-cadastro crediário"). O `Contact` do crediário é o mesmo momento do lead e não deve ser usado como otimização.
- UTM padrão nos anúncios: `?utm_source=meta&utm_medium=paid&utm_campaign={{campaign.name}}&utm_content={{ad.name}}`. A campanha aparece no código de origem das mensagens da LP e fica gravada nos leads do crediário.

---

## 7. Microsoft Clarity

Em todas as tags do Clarity: **Configurações de consentimento → exigir** `analytics_storage`.

**`Clarity - Base`**
- Tipo: modelo da galeria **"Microsoft Clarity - Official"** (Modelos → Galeria de modelos da comunidade → buscar "Clarity")
- Project ID: `{{CONST - Clarity ID}}`
- Acionadores: **Initialization - All Pages** e **`CE - cookies aceitos`**
- Opções de disparo: "Uma vez por página"

**`Clarity - eventos`**
- Tipo: HTML personalizado
- Acionador: `CE - clarity`
- Sequenciamento: `Clarity - Base` antes

```html
<script>
  if (window.clarity) {
    clarity('event', '{{Event}}');
    if ('{{DLV - cta_id}}') clarity('set', 'cta_id', '{{DLV - cta_id}}');
    var conv = ['whatsapp_click', 'generate_lead', 'lead'];
    if (conv.indexOf('{{Event}}') !== -1) clarity('upgrade', '{{Event}}');
  }
</script>
```

- `event` permite filtrar gravações e mapas de calor pelo evento.
- `set` permite filtrar pelo botão clicado.
- `upgrade` garante que as gravações de quem converteu não sejam descartadas.

**No painel do Clarity**
- [ ] Mascaramento: manter **"Balanceado"** (padrão), que esconde o que a pessoa digita.
- [ ] Funil da LP: `quote_form_view` → `form_start` → `generate_lead`.
- [ ] Funil do crediário: `form_start_crediario` → `lead`.
- [ ] Filtros salvos de abandono: `form_start` **sem** `generate_lead` (LP) e `form_start_crediario` **sem** `lead` (crediário).

---

## 8. GA4 (recomendado)

As tags do Google já respeitam o Consent Mode, então **não** exija consentimento adicional nelas.

| Tag | Tipo | Acionador | Configuração |
| --- | --- | --- | --- |
| `GA4 - Google tag` | Tag do Google | Initialization - All Pages | `{{CONST - GA4 ID}}` |
| `GA4 - LP - whatsapp_click` | Evento GA4 `whatsapp_click` | `CE - LP - whatsapp_click` | `cta_id`, `cta_section`, `branch`, `interest` |
| `GA4 - LP - generate_lead` | Evento GA4 `generate_lead` | `CE - LP - generate_lead` | `cta_id`, `interest`, `form_id` |
| `GA4 - LP - comportamento` | Evento GA4 com nome `{{Event}}` | `CE - LP - comportamento` | `cta_id`, `cta_section`, `form_id` |
| `GA4 - CRED - form_start` | Evento GA4 `form_start` | `CE - CRED - form_start` | `form_id` |
| `GA4 - CRED - generate_lead` | Evento GA4 `generate_lead` | `CE - CRED - lead` | `form_id`, `interesse` |
| `GA4 - CRED - click_whatsapp` | Evento GA4 `click_whatsapp` | `CE - CRED - click_whatsapp` | `origin` |

No GA4 (Admin):
- **Eventos-chave:** `whatsapp_click` e `generate_lead`. **Não** marque `click_whatsapp`, que no crediário acontece junto com o lead.
- **Dimensões personalizadas** (escopo evento): `cta_id`, `cta_section`, `branch`, `interest`, `interesse`, `form_id`.
- **Medição otimizada:** desligar "Rolagens", "Interações com formulários" e "Cliques de saída", para não duplicar.
- Use a dimensão **Nome do host** para separar as duas páginas nos relatórios.

---

## 9. Google Ads (se houver campanha no Google)

| Conversão | Tipo | Acionador | Classificação |
| --- | --- | --- | --- |
| `Lead \| WhatsApp LP` | Acompanhamento de conversões, ID da transação `{{DLV - event_id}}` | `CE - LP - whatsapp_click` | Principal |
| `Lead \| Formulário LP` | Acompanhamento de conversões, ID da transação `{{DLV - event_id}}` | `CE - LP - generate_lead` | Principal |
| `Lead \| Pré-cadastro crediário` | Acompanhamento de conversões | `CE - CRED - lead` | Principal |

- Adicione também a tag **Vinculador de conversões** com acionador Initialization - All Pages.
- **Não** crie conversão para o `click_whatsapp` do crediário, que duplicaria o pré-cadastro.
- **Não** importe as mesmas conversões do GA4, que duplicariam as tags nativas.
- Contagem: **"Uma"** por clique.

---

## 10. Validação antes de publicar o contêiner

No GTM, clique em **Visualizar**. Em cada página, **clique em Aceitar no aviso de cookies** antes de testar; senão Meta e Clarity ficam bloqueados de propósito.

**LP institucional:** `https://lp.reidopano.com.br/?utm_source=teste&utm_campaign=qa`
- [ ] Antes de aceitar: `Meta - Base` e `Clarity - Base` aparecem como **bloqueadas por consentimento**.
- [ ] Ao aceitar: `cookie_consent_update` dispara e as tags base carregam na hora.
- [ ] Clique em um botão de cada tipo (topo, produto, loja, flutuante): `whatsapp_click` com o `cta_id` certo; disparam `Meta - LP - Contact`, `GA4 - LP - whatsapp_click` e `Clarity - eventos`.
- [ ] Nenhum evento com `cta_id` = `nao_mapeado`. Se aparecer, existe um botão sem marcação: avise o dev.
- [ ] Formulário vazio: `form_error`, sem `Meta - LP - Lead`.
- [ ] Formulário preenchido: **um** `generate_lead`, dispara `Meta - LP - Lead` e **não** dispara `Meta - LP - Contact`.
- [ ] A mensagem do WhatsApp chega com `NÃO APAGUE ESSA MENSAGEM!` e `Código de origem: LP-... | teste/qa`.

**Crediário:** `https://crediario.reidopano.com.br/?utm_source=teste&utm_medium=qa&utm_campaign=qa_crediario&utm_content=gtm&utm_term=validacao`
- [ ] Tocar no primeiro campo: **um** `form_start_crediario`.
- [ ] Enviar vazio: nenhum `lead` e nenhum `click_whatsapp`.
- [ ] Enviar preenchido: **um** `lead` seguido de **um** `click_whatsapp`; disparam `Meta - CRED - Lead`, `GA4 - CRED - generate_lead` e a conversão do Ads.
- [ ] O lead de teste aparece no painel `/leads-panel` com as 5 UTMs. **Exclua o lead de teste** depois.

**Nas plataformas**
- [ ] Gerenciador de Eventos → **Testar eventos**: `PageView`, `Contact`, `Lead` e `ViewContent`, das duas URLs.
- [ ] GA4 → **DebugView**: eventos das duas páginas com os parâmetros.
- [ ] Clarity, depois de cerca de 1 a 2 horas: gravações filtráveis pelos eventos.
- [ ] Tudo certo → **Enviar → Publicar** com o nome `v1 - LP + Crediário + consentimento`.

---

## 11. Pontos de atenção

- **O site não sabe se a mensagem foi enviada no WhatsApp**, só que o WhatsApp abriu. `Contact` e `Lead` medem intenção. Quem confirma a conversa é o vendedor, com o código de origem (LP) ou com o painel de pré-cadastros (crediário).
- **Os leads do crediário ficam no painel** `crediario.reidopano.com.br/leads-panel`, com exportação CSV para Excel e outra para Meta/ferramentas. O CSV serve para públicos personalizados, respeitando o consentimento que a pessoa deu.
- **Cerejeiras** usa o mesmo WhatsApp de Vilhena, (65) 99927-9546. Confirmar com o cliente se é intencional.
- **Novo botão na LP?** Peça ao dev para seguir o padrão `data-track="cta"` + `data-cta-id`. Nada precisa mudar no GTM.
- **Consentimento:** não remova as travas de `ad_storage` e `analytics_storage` das tags do Meta e do Clarity. Sem elas, o aviso de cookies deixa de ter efeito.
