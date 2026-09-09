# Plano de analytics

O projeto emite eventos neutros pela função `analytics()` em `dist/app.js`. Eles alimentam `window.dataLayer` e o evento customizado `voa:analytics`, sem instalar automaticamente fornecedores externos.

## Eventos existentes

| Evento | Momento |
|---|---|
| `whatsapp_click` | Clique em CTA preparado para WhatsApp |
| `coverage_check_start` | Início da consulta preliminar |
| `coverage_check_complete` | Resultado preliminar exibido |
| `calculator_change` | Alteração da calculadora |
| `lead_form_submit` | Envio do formulário comercial |
| `lead_form_prepared` | Mensagem comercial preparada sem número oficial |
| `pilot_volume_select` | Seleção de volume para piloto |
| `decision_shortcut` | Uso de atalho comercial |
| `diagnostic_complete` | Diagnóstico concluído |
| `diagnostic_restart` | Diagnóstico reiniciado |
| `chatbot_open` | Abertura do VOAÍ |
| `chatbot_message` | Pergunta enviada ao VOAÍ |
| `base_photo_open` | Ampliação de imagem da base |
| `social_click` | Clique em rede social |

## Requisitos antes da instalação

- Definir fornecedor e finalidade de cada dado.
- Evitar dados pessoais nos eventos.
- Criar política de consentimento quando aplicável.
- Configurar ambientes de teste e produção separadamente.
- Documentar retenção, acesso e exclusão.
- Validar disparos sem duplicidade.
