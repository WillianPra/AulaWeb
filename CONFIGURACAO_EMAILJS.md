# 📧 Configuração do EmailJS

## Como configurar o EmailJS para o formulário de contato

### 1️⃣ Criar conta no EmailJS

1. Acesse: https://www.emailjs.com/
2. Clique em "Sign Up" para criar uma conta gratuita
3. Confirme seu e-mail

### 2️⃣ Obter suas credenciais

#### **Public Key (User ID)**

1. No painel do EmailJS, vá em **Account** > **General**
2. Copie o **Public Key** (ex: `user_abc123def456`)

#### **Service ID**

1. Vá em **Email Services**
2. Clique em "Add New Service"
3. Escolha seu provedor de e-mail (Gmail, Outlook, etc.)
4. Configure e copie o **Service ID** (ex: `service_xyz789`)

#### **Template ID**

1. Vá em **Email Templates**
2. Clique em "Create New Template"
3. Configure o template com os campos do formulário:
   - `{{nome}}` - Nome do usuário
   - `{{email}}` - E-mail do usuário
   - `{{telefone}}` - Telefone (opcional)
   - `{{assunto}}` - Assunto da mensagem
   - `{{mensagem}}` - Conteúdo da mensagem
   - `{{preferencia_contato}}` - Preferência de contato
   - `{{newsletter}}` - Aceite de newsletter
4. Copie o **Template ID** (ex: `template_abc123`)

### 3️⃣ Atualizar o código

Abra o arquivo `assets/js/email.js` e substitua:

```javascript
// Linha 3: Substitua YOUR_PUBLIC_KEY pela sua Public Key
emailjs.init("YOUR_PUBLIC_KEY");

// Linha 29: Substitua pelos seus IDs
emailjs.sendForm("SEU_SERVICE_ID", "SEU_TEMPLATE_ID", form);
```

### 4️⃣ Exemplo de Template EmailJS

**Assunto do e-mail:**

```
Nova mensagem de contato: {{assunto}}
```

**Corpo do e-mail:**

```html
<h2>Nova mensagem do site Conexão Solidária</h2>

<p><strong>Nome:</strong> {{nome}}</p>
<p><strong>E-mail:</strong> {{email}}</p>
<p><strong>Telefone:</strong> {{telefone}}</p>
<p><strong>Assunto:</strong> {{assunto}}</p>

<h3>Mensagem:</h3>
<p>{{mensagem}}</p>

<hr />

<p><strong>Preferência de contato:</strong> {{preferencia_contato}}</p>
<p><strong>Deseja receber newsletter:</strong> {{newsletter}}</p>

<hr />
<p><em>Mensagem enviada através do formulário de contato</em></p>
```

### 5️⃣ Testar o formulário

1. Salve todas as alterações
2. Abra `contato.html` no navegador
3. Preencha o formulário
4. Clique em "Enviar Mensagem"
5. Verifique se recebeu o e-mail

### ⚠️ Observações Importantes

- **Limite gratuito:** 200 e-mails/mês
- **Validação de domínio:** Configure o domínio permitido nas configurações do EmailJS
- **Segurança:** Nunca exponha chaves privadas no código front-end
- **Teste:** Sempre teste em ambiente local antes de publicar

### 🔧 Troubleshooting

**Erro 403 Forbidden:**

- Verifique se a Public Key está correta
- Confirme que o domínio está autorizado no painel do EmailJS

**Erro 412 Precondition Failed:**

- Verifique se o Service ID e Template ID estão corretos
- Confirme que o template está ativo

**E-mail não chega:**

- Verifique a pasta de spam
- Confirme que o serviço de e-mail está conectado
- Teste com outro endereço de e-mail

### 📚 Documentação Oficial

- Site: https://www.emailjs.com/
- Docs: https://www.emailjs.com/docs/
- Exemplos: https://www.emailjs.com/docs/examples/

---

**Última atualização:** Outubro 2025
