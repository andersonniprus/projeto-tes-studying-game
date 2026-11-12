# Studying game

Plataforma de estudos estilo Duolingo para vestibulares e concursos.

**Equipe Cachorro** — Anderson Niprus, Tiago Barbi, Iuri Henrique  
Disciplina: Testes de Software I — Univille

## Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Persistência local (localStorage)

## Como rodar

```bash
npm install
npm run dev
```

Abra http://localhost:3000

## Funcionalidades (v0.1)

- Cadastro / login local
- Home com pontos, streak e progresso
- Banco de questões com filtros
- Responder questão + feedback com explicação
- Cálculo de pontuação (RN-001) e streak (RN-002)
- Simulado personalizado (RN-004)
- Perfil com estatísticas (RN-003)

## Estrutura

```
app/          # páginas
components/   # Header, ProgressBar
lib/          # scoring, streak, storage, simulado, types
data/         # questoes.json
```
