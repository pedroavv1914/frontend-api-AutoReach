# Configuração do Frontend Multi-Tenant

## Variáveis de Ambiente Necessárias

Crie um arquivo `.env.local` na raiz do frontend com:

```env
# Backend API URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001

# Para desenvolvimento local sem subdomínios (opcional)
# Especifica qual tenant usar quando não estiver em um subdomínio real
NEXT_PUBLIC_TENANT_HOST=dev.aithosreach.com
```

## Como Funciona o Sistema Multi-Tenant

### 1. Identificação de Tenant
- **Produção**: O backend identifica o tenant pelo hostname (ex: `cliente1.aithosreach.com`)
- **Desenvolvimento**: Usa o header `x-tenant-host` para simular o tenant

### 2. Autenticação
- JWT token salvo no localStorage como `auth_token`
- Dados do usuário e tenant salvos como `user_data`
- Interceptor automático adiciona `Authorization: Bearer <token>`

### 3. Headers Automáticos
- `Authorization`: JWT token (se disponível)
- `x-tenant-host`: Para desenvolvimento local (se configurado)

## Próximos Passos

1. **Configure as variáveis de ambiente** criando `.env.local`
2. **Certifique-se que o backend está rodando** na porta 3001
3. **Teste a conexão** - o sistema agora está preparado para multi-tenancy

## Estrutura Criada

- `src/lib/api.ts` - Cliente HTTP com interceptors para JWT e tenant
- `src/lib/types.ts` - Types TypeScript para o sistema
- `src/lib/auth-api.ts` - Funções específicas de autenticação
