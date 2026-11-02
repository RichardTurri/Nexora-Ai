# Approach A: Tawk.to Setup Guide for HVAC Clients

> **Goal**: Configure Tawk.to for a demo site in 2 hours, then replicate for paying clients in 30 min each.

---

## 1. Create Your Tawk.to Account (10 min)

1. Go to **tawk.to** → Sign up free
2. Property name: `Nexora AI Demo` (or client's company name)
3. Website: `https://richardturri.github.io/Nexora-Ai/`
4. Skip "Add team members" for now

---

## 2. Widget Customization (15 min)

### Appearance Tab
- **Widget position**: Bottom right
- **Primary color**: `#1565c0` (Nexora blue)
- **Greeting**: "Olá! Sou o assistente da [Empresa]. Em que posso ajudar?"
- **Display**: "Show widget on all pages"
- **Mobile**: Enable "Minimize on mobile"

### Behavior Tab
- **Auto-popup**: Disable (annoying)
- **Trigger**: "Visitor clicks widget"
- **Sound**: Enable notification sound
- **Language**: Portuguese (add English as second)

### Advanced
- **Departments**: Create "Vendas", "Suporte Técnico", "Agendamento"
- **Shortcuts**: Pre-write 10 common responses (see below)

---

## 3. HVAC-Specific Shortcuts (Pre-written Rules)

Create these in **Shortcuts** (Admin → Shortcuts → Add Shortcut):

| Shortcut | Trigger | Response |
|----------|---------|----------|
| `horario` | "horário", "abre", "fecha" | "Funcionamos **segunda a sexta, 7h–19h** e **sábados 8h–14h**. Emergências 24/7 pelo WhatsApp: (XX) XXXX-XXXX" |
| `areas` | "atendem", "área", "cidade", "região" | "Atendemos **Toronto, Mississauga, Brampton, Vaughan, Markham, Richmond Hill, Oakville, Burlington**. Fora dessa região? Me diga seu CEP que verifico." |
| `servicos` | "serviço", "fazem", "instalação", "manutenção" | "**Serviços:** Instalação, manutenção preventiva, reparo de emergência, limpeza de dutos, troca de filtros. **Equipamentos:** Ar central, split, bomba de calor, forno, aquecedor de água. Qual equipamento precisa?" |
| `garantia` | "garantia", "warranty" | "Todas instalações têm **1 ano de mão de obra** + garantia do fabricante (5-10 anos no compressor). Manutenções têm 90 dias de garantia no serviço executado." |
| `pagamento` | "pagamento", "cartão", "pix", "financiamento" | "Aceitamos: **Cartão (crédito/débito), Transferência, PIX, Financiamento parceiro (sujeito à aprovação)**. Orçamento gratuito no local." |
| `emergencia` | "emergência", "urgente", "parou", "quebrou" | "🚨 **Emergência detectada!** Me passa: 1) Endereço completo 2) Tipo de equipamento 3) Sintoma (não liga, vazando, barulho estranho). Equipe sai em até 2h." |
| `orcamento` | "orçamento", "preço", "quanto custa" | "Orçamento **gratuito e sem compromisso**. Preciso: 1) Endereço 2) Tipo de serviço 3) Equipamento (marca/modelo se souber). Agendo visita técnica?" |
| `agendamento` | "agendar", "marcar", "visita" | "Perfeito! Me confirma: 1) Endereço 2) Melhor dia/período (manhã/tarde) 3) Contato WhatsApp. Te retorno em 15 min com confirmação." |
| `marcas` | "marca", "carrier", "lennox", "trane", "goodman" | "Trabalhamos com **todas as marcas**: Carrier, Lennox, Trane, Goodman, Rheem, York, Bryant, Ruud, Daikin, Mitsubishi. Peças originais sob encomenda." |
| `manutencao` | "manutenção preventiva", "plano", "contrato" | "**Plano Preventivo:** 2 visitas/ano (pré-verão + pré-inverno) = $299/ano. Inclui: limpeza, verificação gás, testes elétricos, relatório fotográfico. 10% desconto em reparos." |

---

## 4. Knowledge Base (FAQ Articles)

Create in **Knowledge Base** → **Add Article**:

| Title | Content Summary |
|-------|-----------------|
| "Como funciona o atendimento 24/7" | Chatbot coleta dados → resume → envia pra equipe → equipe liga/WhatsApp |
| "Quanto tempo pra resposta?" | Chat: segundos. Ligação da equipe: <30 min horário comercial, <2h emergência |
| "Vocês fazem instalação completa?" | Sim: cálculo de carga, dutos, elétrica, partida, orientação cliente |
| "Atendem condomínio/prédio?" | Sim, com autorização do síndico. Elevador, área comum, gás central. |
| "Como sei se meu equipamento precisa trocar?" | Idade >12 anos, contas altas, reparos frequentes, ruído, resfriamento fraco |

---

## 5. Lead Capture Form (Pre-chat Form)

**Admin → Widget → Pre-chat form** → Enable:
- Nome (obrigatório)
- Telefone/WhatsApp (obrigatório)
- Email (opcional)
- Endereço (obrigatório)
- Tipo de serviço (dropdown: Instalação / Manutenção / Reparo / Orçamento)
- Urgência (dropdown: Emergência / Esta semana / Flexível)

---

## 6. Notifications Setup (Critical)

### Email Notifications
**Admin → Notifications → Email**:
- ✅ New chat started
- ✅ Chat ended (with transcript)
- ✅ Missed chat
- Send to: `seu-email@gmail.com` + client's email

### Mobile App
- Install **Tawk.to app** (iOS/Android)
- Enable push notifications
- Test: chat as visitor → see push on phone

### Webhook (for Zapier/Make)
**Admin → Developers → Webhooks**:
- Event: `chat_ended`
- URL: Your Make/Zapier webhook URL (set up in automation guide)
- Secret: Generate random string for verification

---

## 7. Test Checklist (Before Demo)

- [ ] Widget loads on your site
- [ ] Pre-chat form appears
- [ ] Shortcuts work (type `/horario` in agent panel)
- [ ] Knowledge base articles show in widget
- [ ] Email notification arrives with transcript
- [ ] Mobile push works
- [ ] Webhook fires (check Make/Zapier)
- [ ] Lead data captured: name, phone, address, service, urgency

---

## 8. Replicate for Client (30 min Process)

When you close a client:

1. **New property** in your Tawk.to account (or create their account)
2. **Copy shortcuts** → Edit company name, phone, areas
3. **Update pre-chat form** with their fields
4. **Add their team emails** to notifications
5. **Send them**: Widget code + Mobile app login + Shortcut cheat sheet
6. **Schedule 15-min training call** (screen share)

---

## 9. Widget Code for Client Site

```html
<!-- Paste in <head> of client's site -->
<script type="text/javascript">
var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
(function(){
var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
s1.async=true; s1.src='https://embed.tawk.to/YOUR_PROPERTY_ID/DEFAULT';
s1.charset='UTF-8'; s1.setAttribute('crossorigin','*'); s0.parentNode.insertBefore(s1,s0);
})();
</script>
```

---

## 10. Your Demo Site Widget

Add to **your** GitHub Pages site (`index.html` `<head>`):

```html
<!-- Nexora Demo Widget -->
<script type="text/javascript">
var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
(function(){
var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
s1.async=true; s1.src='https://embed.tawk.to/YOUR_DEMO_PROPERTY_ID/DEFAULT';
s1.charset='UTF-8'; s1.setAttribute('crossorigin','*'); s0.parentNode.insertBefore(s1,s0);
})();
</script>
```

> Replace `YOUR_DEMO_PROPERTY_ID` with your actual Tawk.to property ID.

---

## 🎯 Next Steps

1. **Today**: Create Tawk.to account + configure shortcuts above
2. **Tomorrow**: Add widget to your demo site + test end-to-end
3. **Day 3**: Record 2-min Loom demo video
4. **Day 4**: Build outreach list (see `OUTREACH_LIST_TEMPLATE.csv`)
5. **Day 5**: Send first 50 cold emails

---

*File created for Nexora AI Approach A implementation. Update as you learn what works.*