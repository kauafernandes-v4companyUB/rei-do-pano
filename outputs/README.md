# Outputs das Skills — Rei do Pano & Rainha Modas

Esta pasta é o destino oficial dos outputs estruturados (`{skill-name}.json`) de cada skill da Estruturação Estratégica, conforme o padrão do sistema `v4-estruturacao-ia` (`client.json` é a verdade, o JSON de cada skill em `outputs/` é o registro versionado, e o HTML renderizado a partir dele é a visualização).

## Status atual

Esta pasta está **vazia propositalmente**. O conteúdo estratégico já produzido para este cliente (persona/ICP, SWOT, posicionamento, manual de marca, auditoria de comunicação, diagnóstico de mídia, landing page/copy/criativos) foi reconstruído retroativamente a partir dos materiais brutos do projeto e está consolidado em **`../base-de-conhecimento/`**, em formato Markdown — não no formato JSON validado por schema que as skills geram quando rodadas interativamente com o operador.

`../client.json` (`progress.skills`) reflete esse estado: skills marcadas `"completed"` ou `"in_progress"` têm conteúdo substancial já disponível em `base-de-conhecimento/`, mas ainda não passaram pelo fluxo formal de geração + auto-validação + checkpoint com o operador que cada skill exige (ex.: `ee-s1-persona-icp/schema.json`).

## Próximo passo

Para popular esta pasta corretamente, rode cada skill normalmente (ex. `/ee-s1-persona-icp`) — o agente deve ler `base-de-conhecimento/` como fonte de conhecimento já disponível (reduzindo drasticamente as perguntas ao operador, já que a maior parte da informação já foi extraída e cruzada), gerar o JSON validado pelo `schema.json` da skill, apresentar para validação do operador, e só então salvar aqui.
