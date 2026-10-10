# Sarah 16 anos — Sakura

Site Next.js de página única com pétalas animadas e lista de itens via Google Sheets.

## Começar

1. `npm install`
2. Copie `.env.example` para `.env.local` e configure `GOOGLE_SCRIPT_URL` com o link `/exec` da implantação pública do Apps Script.
3. Na planilha, mantenha as colunas `id | item | status | nome | imagem` (a última aceita URL pública direta de imagem).
4. Substitua o código do Apps Script pelo conteúdo de `GOOGLE_APPS_SCRIPT.gs`, implante como aplicativo web **executado como você**, acesso **qualquer pessoa** e use a URL da nova implantação.
5. `npm run dev` e abra `http://localhost:3000`.
6. Na Vercel, configure `GOOGLE_SCRIPT_URL` nas variáveis de ambiente.

**Importante:** teste uma reserva e uma tentativa repetida antes de compartilhar. O Apps Script usa LockService para impedir que duas pessoas reservem o mesmo item simultaneamente. A planilha deve ser mantida privada; a implantação pública permite consultar e reservar itens, sem autenticação.

Dados e textos ficam em `config/convite.ts`. A lista vem exclusivamente da planilha, sem banco de dados. A página tem layout responsivo, animação de flores, modal e lembrete PNG.
