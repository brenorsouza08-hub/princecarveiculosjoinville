# Princecar Veículos — Proposta de novo site

Demonstração conceitual, completa e navegável, de uma nova experiência digital para a **Princecar Veículos** (seminovos multimarcas, Joinville/SC).

> **Importante:** o estoque, os preços, as quilometragens e as especificações exibidos são **fictícios**. As fotos foram recortadas de publicações do Instagram da loja ([@princecarveiculosjoinville](https://www.instagram.com/princecarveiculosjoinville/)) e usadas apenas como referência visual. A assinatura “PRINCECAR.” é tipográfica e provisória — não substitui o logotipo oficial. Não há backend, banco de dados nem integração com sistemas de estoque, financiamento ou agendamento.

---

## Como executar

Requisitos: **Node.js 20 ou superior** (testado com Node 22) e npm.

```bash
npm install
npm run dev        # servidor de desenvolvimento → http://localhost:5173
```

Para a versão otimizada (a mais indicada para apresentar ao cliente):

```bash
npm run build      # checagem de tipos + build de produção em dist/
npm run preview    # serve o build → http://localhost:4173
```

Os dois servidores aceitam conexões da rede local (`host: true`), então é possível abrir a demonstração no celular conectado ao mesmo Wi-Fi usando o endereço “Network” exibido no terminal.

A pasta `dist/` é estática e pode ser publicada em qualquer hospedagem (Vercel, Netlify, Cloudflare Pages, servidor próprio etc.).

### Roteiro sugerido para a apresentação

1. **Hero** — slideshow cinematográfico com fotos do pátio, navegação pelos indicadores.
2. **Destaques** — vitrine editorial com setas e rolagem lateral.
3. **Estoque** — busque “corolla”, filtre por SUV, ordene por menor preço, favorite dois carros e use “Enviar lista” (WhatsApp).
4. **Detalhes** — abra um veículo: galeria (setas, miniaturas, teclado e gesto de deslizar), ficha técnica, botões de WhatsApp com mensagem pronta e sugestões semelhantes. O botão “voltar” do navegador fecha o detalhe, e o link pode ser compartilhado.
5. **Encontre seu próximo carro** — responda as 4 perguntas; teste uma combinação sem resultados (ex.: Utilitário + acima de R$ 120 mil) para ver as alternativas e o envio do perfil ao consultor.
6. **A Princecar**, **Como funciona** e **Contato** — indicadores animados, área preparada para avaliações reais, mapa carregado sob demanda e rota.

---

## O que foi implementado

| Recurso | Detalhes |
| --- | --- |
| Hero cinematográfico | Layout editorial assimétrico, tipografia expandida, slideshow com transição e Ken Burns, indicadores de progresso clicáveis, pista de rolagem |
| Estoque inteligente | Busca por texto (ignora acentos), filtros de marca, faixa de preço, ano, categoria, câmbio e combustível, ordenação por preço/ano/km, chips de filtros ativos, “limpar filtros”, paginação “mostrar mais”, estado vazio com ajuda via WhatsApp |
| Filtros no celular | Painel inferior (bottom sheet) com contagem de resultados; categorias rápidas roláveis |
| Favoritos | Salvos no navegador (localStorage); filtro “somente favoritos”; envio da lista pelo WhatsApp |
| Detalhe do veículo | Modal com galeria navegável, ficha técnica, preço demonstrativo identificado, consultar disponibilidade, negociar, ligar, compartilhar link (`#veiculo/<id>`), veículos semelhantes, barra fixa de ações no celular |
| Experiência guiada | 4 perguntas, avanço automático, voltar/editar etapas, resultados por compatibilidade, alternativas quando não há correspondência exata, “Ver no estoque” (aplica os filtros) e envio do perfil ao consultor |
| Confiança | Indicadores com contagem animada, selo atual da marca, layout de avaliações sem frases inventadas e link para o Google |
| Contato | Endereço, telefone, WhatsApp, Instagram, horário marcado como “a confirmar”, mapa do Google carregado somente quando solicitado, link de rotas |
| Experiência premium | Cabeçalho que muda ao rolar, menu mobile, microinterações, revelação discreta ao rolar, botão flutuante de WhatsApp, aviso de demonstração dispensável |
| Acessibilidade | Navegação por teclado, foco visível, foco preso em diálogos, Esc para fechar, rótulos ARIA, link “pular para o estoque”, respeito a `prefers-reduced-motion` |
| Estados | Skeleton durante o carregamento das fotos, fallback de imagem indisponível, estados vazios |

### WhatsApp

Os links usam `https://wa.me/<número>?text=<mensagem>` com mensagens pré-preenchidas por contexto (geral, visita, disponibilidade, negociação, lista de favoritos, perfil da experiência guiada). O número é validado (formato E.164 brasileiro: `55` + DDD válido + 8 dígitos de fixo ou 9 de celular) em `src/lib/whatsapp.ts`. Se o número for inválido, os links de WhatsApp são substituídos por ligação telefônica.

---

## Estrutura

```
src/
  config/business.ts        ← dados institucionais (endereço, telefone, WhatsApp, horários, indicadores)
  data/vehicles.demo.ts     ← ESTOQUE DEMONSTRATIVO (substituir pela integração real)
  data/types.ts             ← tipos do veículo
  lib/inventory.ts          ← filtros, ordenação, semelhantes e lógica da experiência guiada
  lib/whatsapp.ts           ← validação do número e montagem dos links
  lib/format.ts, lib/ui.ts  ← formatação (R$, km) e classes de botões
  hooks/                    ← favoritos, animações, acessibilidade de diálogos
  components/               ← card, modal de detalhes, imagem, selects, ícones, assinatura
  sections/                 ← Header, Hero, Destaques, Estoque, Encontre, A Princecar, Como funciona, Contato, Rodapé
public/img/cars/            ← fotos dos veículos (560 px e 1120 px, WebP, proporção 4:5)
```

Stack: **React 19 + TypeScript + Vite + Tailwind CSS 4 + Lucide**. Fontes auto-hospedadas (Archivo com eixo de largura e Inter, via Fontsource) — o site não depende de CDNs externas, exceto o mapa do Google quando o visitante o carrega.

### Sobre as fotos

Como não havia arquivos originais disponíveis, as imagens foram recortadas das capturas de tela do Instagram enviadas para o projeto (≈280 px de largura) e ampliadas 4× com o modelo Real-ESRGAN. Elas servem bem para a demonstração, mas **a versão final deve usar as fotos originais em alta resolução**. Recomendações para a produção: proporção 4:5 (ou 4:3) padronizada, mesmo enquadramento (3/4 dianteira), sem textos sobrepostos, várias fotos por veículo (a galeria já suporta N imagens).

---

## Informações a confirmar antes da publicação

- [ ] **WhatsApp:** o número usado é o telefone informado, (47) 3435-6262 — um fixo. Confirmar se é a linha do WhatsApp Business da loja ou informar o número correto (`src/config/business.ts → whatsappE164`).
- [ ] **Telefone** (47) 3435-6262.
- [ ] **Endereço** Rua XV de Novembro, 2734 — Glória, Joinville/SC, e **CEP** (não informado).
- [ ] **Horário de funcionamento** (não informado; hoje aparece “A confirmar com a loja”).
- [ ] **Indicadores:** “26 anos de confiança”, “mais de 5.000 carros vendidos”, “nota 4,7 no Google com cerca de 150 avaliações” — confirmar os valores atuais.
- [ ] **Avaliações:** definir se serão exibidas avaliações reais (com autorização/integração ao Perfil da Empresa no Google).
- [ ] **Instagram** @princecarveiculosjoinville.
- [ ] **Identidade visual:** aprovar a direção (preto, grafite e vermelho) e decidir entre manter o selo atual, adaptar a marca ou desenvolver um novo logotipo.
- [ ] **Estoque real:** origem dos dados (sistema de gestão, planilha, integração com portais), atualização de disponibilidade e fotos originais.
- [ ] **Preços e condições:** política de exibição de preços, financiamento, troca e garantia — nada disso foi incluído por não ter sido confirmado.
- [ ] **Textos institucionais** (seção “A Princecar”) e marcas exibidas.
- [ ] **Aspectos legais:** política de privacidade/LGPD e aviso de cookies, caso sejam adicionadas ferramentas de análise ou formulários.
- [ ] Remover o aviso de demonstração e a meta tag `noindex` (`index.html`) ao publicar.

## Próximos passos sugeridos

- Integração do estoque com o sistema da loja e páginas próprias por veículo (SEO, compartilhamento com prévia).
- Painel administrativo para cadastro de veículos e fotos.
- Formulário de proposta/financiamento com envio para o CRM ou WhatsApp.
- Analytics de conversão (cliques em WhatsApp por veículo).
