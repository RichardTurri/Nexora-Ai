# Automation Setup: Lead Delivery (Tawk.to → WhatsApp/Email/Sheets)

> **Goal**: When chat ends → formatted lead sent to client's WhatsApp + email + Google Sheets log
> **Tools**: Make (Integromat) - free 1000 ops/mo | Zapier - free 100 tasks/mo

---

## Option A: Make (Recommended - More Powerful, Free Tier Better)

### 1. Create Make Account
- Go to **make.com** → Sign up free
- 1000 operations/month free
- More flexible than Zapier

### 2. Get Tawk.to Webhook URL
In Tawk.to Admin:
1. **Developers** → **Webhooks** → **Add Webhook**
2. Event: `chat_ended`
3. URL: (paste your Make webhook URL after step 4)
4. Secret: Generate random string (save it!)

### 3. Build Make Scenario

#### Step 1: Webhook Trigger
- **Module**: Webhooks → Custom webhook
- **Create webhook** → Name: "Tawk.to Chat Ended"
- Copy the generated URL → paste in Tawk.to webhook config
- **Data structure**: Auto-detect (run test chat first)

#### Step 2: Filter Qualified Leads
- **Module**: Tools → Filter
- **Condition**: 
  - `visitor.name` EXISTS
  - `visitor.phone` OR `visitor.email` EXISTS
  - `tags` CONTAINS "qualified" OR `prechat.servico` EXISTS
- **Continue only if**: All conditions met

#### Step 3: Format Lead Message
- **Module**: Tools → Set variable (or use Text parser)
- **Variable name**: `lead_message`
- **Value**:
```
🔥 **NOVO LEAD - {{company_name}}**

👤 **Nome**: {{visitor.name}}
📱 **WhatsApp**: {{visitor.phone}}
📧 **Email**: {{visitor.email}}
📍 **Endereço**: {{prechat.endereco}}
❄️ **Equipamento**: {{prechat.equipamento}}
🚨 **Urgência**: {{prechat.urgencia}}
💬 **Serviço**: {{prechat.servico}}

📝 **Conversa**:
{{chat.transcript}}

---
Responda diretamente no WhatsApp ou ligue para o cliente.
```

#### Step 4: Send WhatsApp (Option 1: Twilio)
- **Module**: Twilio → Send a Message
- **From**: Your Twilio WhatsApp number
- **To**: Client's WhatsApp (store in scenario variables)
- **Body**: `{{lead_message}}`

#### Step 4b: Send WhatsApp (Option 2: CallMeBot - FREE)
- **Module**: HTTP → Make a request
- **URL**: `https://api.callmebot.com/whatsapp.php`
- **Method**: GET
- **Query String**:
  - `phone`: `{{client_whatsapp}}` (format: 5511999999999)
  - `text`: `{{encodeURL(lead_message)}}`
  - `apikey`: `YOUR_CALLMEBOT_APIKEY` (get from callmebot.com)

#### Step 5: Send Email
- **Module**: Email → Send an email (or Gmail/Outlook module)
- **To**: Client's email + your email
- **Subject**: `🔥 Novo Lead: {{visitor.name}} - {{prechat.servico}} - {{prechat.urgencia}}`
- **Content**: `{{lead_message}}` (HTML formatted)

#### Step 6: Log to Google Sheets
- **Module**: Google Sheets → Add a row
- **Spreadsheet**: Your master leads tracker
- **Sheet**: "Leads"
- **Mapping**:
  - Date: `{{now}}`
  - Company: `{{company_name}}`
  - Client Name: `{{visitor.name}}`
  - Phone: `{{visitor.phone}}`
  - Email: `{{visitor.email}}`
  - Address: `{{prechat.endereco}}`
  - Equipment: `{{prechat.equipamento}}`
  - Urgency: `{{prechat.urgencia}}`
  - Service: `{{prechat.servico}}`
  - Transcript: `{{chat.transcript}}`
  - Status: "Novo"

#### Step 7: Slack/Telegram Notification (Optional)
- **Module**: Slack → Post a message / Telegram → Send a message
- **Channel**: Your team channel
- **Text**: `🔔 New lead for {{company_name}}: {{visitor.name}} ({{prechat.urgencia}})`

---

## Option B: Zapier (Simpler, Less Free Ops)

### 1. Create Zap
**Trigger**: Webhooks by Zapier → Catch Hook
- Copy webhook URL → paste in Tawk.to

### 2. Filter (Paths)
**Filter by Zapier** → Only continue if:
- `visitor.name` (Text) Exists
- `visitor.phone` OR `visitor.email` Exists

### 3. Formatter → Text → Replace
Format the transcript (replace `\n` with `<br>` for HTML email)

### 4. Action 1: Email by Zapier
- To: Client + you
- Subject: `Novo Lead: {{visitor.name}} - {{prechat.servico}}`
- Body: Formatted template

### 5. Action 2: Google Sheets
- Create row in Leads tracker

### 6. Action 3: Twilio/WhatsApp (if paid) or Webhooks → CallMeBot

---

## CallMeBot Setup (FREE WhatsApp - No Twilio Needed)

### 1. Get API Key
1. Go to **callmebot.com/whatsapp-api/**
2. Enter your WhatsApp number
3. Get API key via "I allow callmebot to send me messages"
4. Save the API key

### 2. Test
```
https://api.callmebot.com/whatsapp.php?phone=5511999999999&text=Teste%20Nexora&apikey=YOUR_KEY
```
(Format: country code + area code + number, no + or spaces)

### 3. Limitations
- Must message the bot first to "activate"
- Rate limited (~10-20/min)
- Good for low volume (<50 leads/day)

---

## Google Sheets Template

Create spreadsheet: **Nexora Leads Tracker**

### Sheet 1: "Leads"
| A | B | C | D | E | F | G | H | I | J | K | L |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Date | Company | Client | Phone | Email | Address | Equipment | Urgency | Service | Transcript | Status | Notes |

### Sheet 2: "Clients"
| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| Company | Contact | Email | WhatsApp | Plan | Webhook URL | Active |

### Sheet 3: "Metrics"
| A | B | C | D | E |
|---|---|---|---|---|
| Week | Leads Generated | Qualified | Converted | Revenue |

---

## Tawk.to Tags for Auto-Qualification

Train your clients (or you) to tag chats:
- `qualified` - Has address + phone + service
- `emergency` - Urgency = emergency
- `quote` - Just wants pricing
- `spam` - Ignore
- `follow-up` - Needs callback

In Make/Zapier: **Filter by tag = "qualified"**

---

## Client Onboarding: What You Give Them

### 1. WhatsApp Group
Create: "Nexora Leads - [Client Name]"
- Add: Client owner, main tech, you
- All leads post here instantly

### 2. Lead Cheat Sheet (PDF)
```
LEAD FORMAT:
🔥 NOVO LEAD - [Empresa]
👤 Nome: [Nome]
📱 WhatsApp: [Telefone]
📍 Endereço: [Endereço completo]
❄️ Equipamento: [Tipo/Marca]
🚨 Urgência: [Emergência/Esta semana/Flexível]
💬 Serviço: [Instalação/Manutenção/Reparo/Orçamento]

AÇÃO: Responder no WhatsApp em <30 min (horário comercial)
      Emergências: ligar em <15 min
```

### 3. Weekly Report Template
Auto-generate from Google Sheets:
- Total leads this week
- By urgency (Emergency/Week/Flexible)
- By service type
- Conversion: leads → quotes → jobs
- Revenue attributed

---

## Testing Checklist

- [ ] Test chat on demo site → ends → webhook fires
- [ ] Make scenario runs → no errors
- [ ] WhatsApp received (formatted correctly)
- [ ] Email received (HTML renders)
- [ ] Google Sheets row added
- [ ] Slack/Telegram notification works
- [ ] Tag "qualified" filters correctly
- [ ] Test with "spam" tag → nothing sent

---

## Scaling: Multi-Client Setup

### Make: One Scenario, Multiple Clients
Use **Router** module:
- Filter: `company_name` = "Client A" → WhatsApp A, Email A, Sheet A
- Filter: `company_name` = "Client B" → WhatsApp B, Email B, Sheet B
- Default: Your master sheet

### Data Store (Make) for Client Config
**Data Store** → "Client Config" → Records:
| Key | Webhook Secret | WhatsApp | Email | Sheet ID | Active |
|-----|----------------|----------|-------|----------|--------|
| client_a | secret123 | 5511... | a@a.com | sheet_id_1 | true |
| client_b | secret456 | 5511... | b@b.com | sheet_id_2 | true |

Then use **Get record** → map dynamically.

---

## Cost Breakdown

| Component | Cost |
|-----------|------|
| Make (1000 ops/mo) | FREE |
| CallMeBot WhatsApp | FREE |
| Gmail/Outlook SMTP | FREE |
| Google Sheets | FREE |
| Twilio WhatsApp (if needed) | ~$0.005/msg |
| **Total** | **$0/month** |

---

## Next Steps

1. **Today**: Create Make account + build scenario above
2. **Test**: Run 3 test chats on your demo site
3. **Verify**: WhatsApp + Email + Sheets all work
4. **Document**: Save scenario as template for new clients
5. **Client 1**: Duplicate scenario, update their WhatsApp/email

---

*Zero monthly cost. Scales to 50+ clients on free tier. Upgrade Make only when >1000 ops/mo.*