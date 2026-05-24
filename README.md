# Cartera de Mateo · BETA

Dashboard sencillo para que Mateo (12 años) siga su cartera de **10 acciones** repartidas en **$1.000**.

Las 10 son marcas que conoce: Apple, Microsoft, NVIDIA, Alphabet (YouTube), Amazon, Disney, Nintendo, Roblox, Nike y McDonald's.

**Versión beta**: muestra **solo el precio de cierre actual** de cada acción (sin gráficos, sin histórico, sin %día). Lo justo para que vea cuánto vale su cartera hoy y cuánto ha ganado/perdido desde que compró.

Stack: **Next.js 14 (App Router) + TypeScript + Tailwind**. Fuente de precios: **Stooq** (gratis, sin clave de API, sin rate-limit problemático).

---

## Cómo correr en local

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

Compilar para producción:

```bash
npm run build && npm start
```

---

## Cómo registrar la compra real

Cuando Mateo ejecute la compra, edita [data/portfolio.json](data/portfolio.json) y rellena para cada posición:

- `shares`: cuántas acciones (o fracciones) compró. Ej: `0.4567`.
- `buyPrice`: precio medio al que las compró en USD. Ej: `175.32`.
- `buyDate`: fecha de la compra.

Mientras `shares` o `buyPrice` estén en `0`, el dashboard muestra precios en vivo como referencia y los pesos asumen reparto equitativo. En cuanto se rellene, calcula valor de mercado, P&L absoluto/porcentual y peso real.

---

## Deploy en Vercel

1. Sube el repo a GitHub:
   ```bash
   git init
   git add .
   git commit -m "init: cartera de Mateo (beta)"
   git branch -M main
   git remote add origin git@github.com:<tu-user>/cartera-mateo.git
   git push -u origin main
   ```
2. Entra en [vercel.com](https://vercel.com), `Add New… → Project`, importa el repo.
3. No hace falta configurar variables de entorno — Stooq es público.
4. Deploy. En 1-2 minutos tienes una URL pública tipo `cartera-mateo.vercel.app` que Mateo puede abrir desde el móvil.

Cada vez que hagas `git push` a `main`, Vercel re-despliega automáticamente. Si solo cambias `data/portfolio.json` (p.ej. corregir un precio de compra), también basta con un commit.

---

## ¿Cómo refresca los precios?

`app/page.tsx` usa `export const revalidate = 60`. Vercel re-genera la página cada 60 segundos en segundo plano (ISR). Recargar la pestaña fuerza ver la última versión disponible.

Los datos vienen del endpoint público de Stooq, una petición por ticker:

```
https://stooq.com/q/l/?s=aapl.us&f=sd2t2ohlcv&h&e=csv
```

Devuelve un CSV con `Symbol, Date, Time, Open, High, Low, Close, Volume`. Usamos `Close` como precio actual.

> Nota: los datos son de cierre de sesión USA. Para "precio actual" durante el horario de mercado, esto puede ir con varios minutos de retraso. Suficiente para una cartera de seguimiento.

---

## Estructura

```
.
├── app/
│   ├── layout.tsx        # layout raíz + metadata
│   ├── page.tsx          # dashboard (Server Component)
│   └── globals.css       # Tailwind + tema oscuro
├── components/
│   ├── PortfolioHeader.tsx
│   ├── StockCard.tsx
│   └── WeightDonut.tsx   # SVG inline
├── data/
│   └── portfolio.json    # las 10 posiciones (editable)
├── lib/
│   ├── yahoo.ts          # cliente Stooq (nombre histórico)
│   └── portfolio.ts      # carga JSON + cálculos
└── package.json
```

---

## Roadmap (v2)

- Sparklines con histórico 1 mes
- Cambio del día (%)
- Comparativa vs S&P500
- Curva de equity de la cartera completa

---

## Aviso

Esto no es asesoramiento financiero. Es una cartera educativa para un chaval de 12 años — el objetivo es que entienda qué es una acción, qué significa el precio que sube y baja, y por qué tiene sentido diversificar.
