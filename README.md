# GymScore (site estático)

GymScore é um gerador de treino **sem IA**, baseado em regras e score.  
Funciona em PT/EN, com preferência salva no `localStorage`.

## Estrutura (não mudar)
GymScore/
  index.html
  form.html
  final.html
  result.html
  README.md
  assets/
    css/styles.css
    js/i18n.js
    js/plans.js
    js/score.js
    js/app.js
    js/pdf.js

## Publicar no GitHub Pages (passo a passo)
1. Crie um repositório no GitHub (ex: `GymScore`).
2. Envie esses arquivos exatamente nessa estrutura (raiz do repo).
3. Vá em **Settings → Pages**.
4. Em **Build and deployment**:
   - Source: **Deploy from a branch**
   - Branch: **main** (ou master) e folder **/(root)**
5. Salve. O GitHub vai gerar o link do site (pode levar alguns minutos).
