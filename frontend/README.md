# Frontend - Sistema de Eventos

Frontend simples em HTML/CSS/JavaScript para o sistema de gerenciamento de eventos.

## 🏗️ Estrutura

```
frontend/
├── index.html      # Interface principal
├── styles.css      # Estilos customizados
├── api.js          # Comunicação com backend
├── app.js          # Lógica da aplicação
└── README.md       # Este arquivo
```

## 🚀 Como Funciona

### 1. **Hot Reload**
- ✅ **Alterações detectadas automaticamente**: O sistema monitora mudanças nos arquivos `.html`, `.css`, `.js`
- ✅ **Recarregamento manual**: Recarregue o navegador (F5) para ver as mudanças
- ✅ **Logs no console**: Alterações são exibidas no terminal do Docker

### 2. **Autenticação**
- 🔓 **Modo Desenvolvimento**: Acesso público permitido (`AllowAny`)
- 🔐 **Modo Produção**: Autenticação via sessão Django
- 👤 **Admin**: `http://localhost:8000/admin` (admin/admin123)

### 3. **Endpoints da API**
- **Eventos**: `http://localhost:8000/api/eventos/`
- **Participantes**: `http://localhost:8000/api/participantes/`
- **Ingressos**: `http://localhost:8000/api/ingressos/`

## 🛠️ Desenvolvimento

### Alterações no Frontend
1. **Edite os arquivos** no diretório `frontend/`
2. **Salve o arquivo** - o sistema detecta automaticamente
3. **Recarregue o navegador** em `http://localhost:8080`
4. **Veja as mudanças** instantaneamente

### Alterações no Backend
1. **Edite os arquivos** no diretório `backend/`
2. **O Django recarrega automaticamente** (desenvolvimento)
3. **Teste via API** em `http://localhost:8000/`

## 📱 Interface

### Seções Disponíveis
- **Home**: Página inicial com resumo
- **Eventos**: CRUD completo de eventos
- **Ingressos**: CRUD completo de ingressos
- **Participantes**: CRUD completo de participantes

### Funcionalidades
- ✅ **Listagem** com cards responsivos
- ✅ **Criação** via modais
- ✅ **Edição** inline
- ✅ **Exclusão** com confirmação
- ✅ **Mensagens** de feedback
- ✅ **Loading** states
- ✅ **Responsivo** para mobile

## 🔧 Configuração

### URLs da API
```javascript
// Em api.js
const API_BASE_URL = 'http://localhost:8000/api';
```

### CORS
Configurado no Django para permitir:
- `http://localhost:8080`
- `http://127.0.0.1:8080`

## 🎨 Estilização

### Tailwind CSS
- **Via CDN**: Carregado do CDN oficial
- **Classes utilitárias**: Flexbox, Grid, Cores, etc.
- **Responsivo**: Mobile-first design

### CSS Customizado
- **Modais**: Overlay e animações
- **Cards**: Hover effects
- **Formulários**: Validação visual
- **Mensagens**: Toast notifications

## 🚨 Troubleshooting

### Problemas Comuns

1. **Alterações não aparecem**
   - Recarregue o navegador (F5)
   - Verifique o console do navegador (F12)
   - Verifique os logs do Docker

2. **Erro de CORS**
   - Verifique se o backend está rodando
   - Confirme as URLs no `docker-compose.yml`

3. **API não responde**
   - Verifique se o MongoDB está rodando
   - Confirme as migrações foram executadas
   - Verifique os logs do backend

### Logs Úteis
```bash
# Ver logs do frontend
docker logs sistema_eventos_app

# Ver logs do backend
docker logs sistema_eventos_app | grep "Backend"

# Ver logs do MongoDB
docker logs sistema_eventos_mongodb
```

## 📚 Próximos Passos

### Melhorias Sugeridas
- [ ] **PWA**: Progressive Web App
- [ ] **Cache**: Service Workers
- [ ] **Offline**: Funcionalidade offline
- [ ] **PWA**: Push notifications
- [ ] **Tema**: Modo escuro/claro
- [ ] **Internacionalização**: Múltiplos idiomas

### Produção
- [ ] **Minificação**: CSS/JS minificados
- [ ] **CDN**: Assets em CDN
- [ ] **Cache**: Headers de cache
- [ ] **HTTPS**: Certificado SSL
- [ ] **Monitoramento**: Logs estruturados 