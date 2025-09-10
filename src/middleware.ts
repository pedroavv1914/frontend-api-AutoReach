import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rotas que não precisam de autenticação
const publicRoutes = ['/login', '/register', '/'];

// Rotas de autenticação (redirecionam se já logado)
const authRoutes = ['/login', '/register'];

// Rotas protegidas que precisam de autenticação
const protectedRoutes = ['/dashboard', '/posts', '/accounts', '/analytics'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth_token')?.value;
  const hostname = request.headers.get('host') || '';
  
  // Extrair tenant do subdomínio ou usar header para desenvolvimento
  let tenantId: string | null = null;
  
  if (hostname.includes('aithosreach.com')) {
    // Produção: extrair do subdomínio
    const subdomain = hostname.split('.')[0];
    if (subdomain && subdomain !== 'www' && subdomain !== 'api') {
      tenantId = subdomain;
    }
  } else {
    // Desenvolvimento: usar header ou padrão
    tenantId = request.headers.get('x-tenant-host') || 'dev';
  }

  // Verificar se é uma rota de API
  if (pathname.startsWith('/api/')) {
    const response = NextResponse.next();
    
    // Adicionar headers de tenant para APIs
    if (tenantId) {
      response.headers.set('x-tenant-id', tenantId);
    }
    
    return response;
  }

  // Verificar se é uma rota pública
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Se não tem token e está tentando acessar rota protegida
  if (!token && protectedRoutes.some(route => pathname.startsWith(route))) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Se tem token e está tentando acessar rota de auth
  if (token && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Verificar tenant válido para rotas protegidas
  if (!tenantId && protectedRoutes.some(route => pathname.startsWith(route))) {
    return new NextResponse('Tenant não encontrado', { status: 400 });
  }

  // Adicionar headers de tenant para todas as requisições
  const response = NextResponse.next();
  
  if (tenantId) {
    response.headers.set('x-tenant-id', tenantId);
  }
  
  // Headers de segurança adicionais
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};