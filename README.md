# Desenho Assinado

Página que recebe um número inteiro entre 1 e 100 e devolve uma figura em SVG, assinada com o e-mail da conta Google usada no login.

A figura é a tabuada modular no círculo: 240 pontos igualmente espaçados numa circunferência, com cada ponto `i` ligado ao ponto `(k * i) mod 240`, em que `k = número + 1`. O número 1 produz uma cardioide, o 2 uma nefroide, e cada valor gera uma figura diferente.

## Como funciona

O desenho é gerado no servidor, por uma Pages Function do Cloudflare. O usuário entra com a conta Google (Google Identity Services), e o navegador envia o número e o `id_token` para `POST /api/desenho`. O servidor valida o token no endpoint `tokeninfo` do Google (status 200, `aud` igual ao Client ID e `email_verified` igual a `"true"`) e assina o desenho com o e-mail do token, e não com um dado digitado no formulário.

Respostas da API: 200 (SVG), 400 (corpo ou número inválido), 401 (token ausente ou inválido) e 405 (método diferente de POST).

## Estrutura

```
public/
  index.html    formulário com o número e o botão de login do Google
  style.css     aparência da página
  script.js     envia número e token para /api/desenho e exibe o SVG
lib/
  desenho.js    função que gera o SVG (só roda no servidor)
functions/
  api/
    desenho.js  Pages Function que valida o token e devolve o SVG
evidencias/
  exemplo.svg   desenho gerado pelo site publicado
```

## Publicação no Cloudflare Pages

Framework preset: `None`. Build command: vazio. Build output directory: `public`.
Variável de ambiente: `GOOGLE_CLIENT_ID`.

## Identificação

Nome: Kauã Fernando Fuckner
RA: 2026108321
URL: https://desenho-assinado-1h3.pages.dev