/* GymScore Plans (MVP) */
/* Workout content can be "fixed text" (not translated), as requested. */

const PLANS = {
  FB3: {
    id: "FB3",
    name: "FB3 (Full Body 3x)",
    warmup: [
      "5 min caminhada leve ou bike",
      "Mobilidade: ombros + quadril (1–2 min)",
      "2 séries leves do 1º exercício do dia"
    ],
    // Each day is a list of exercises
    week: [
      {
        title: "Full Body A",
        ex: [
          { n: "Agachamento (ou Leg Press)", s: 3, r: "8–12", rest: "Médio" },
          { n: "Supino (halter/barra) ou Máquina", s: 3, r: "8–12", rest: "Médio" },
          { n: "Remada (cabo/halter) ", s: 3, r: "10–12", rest: "Médio" },
          { n: "Elevação lateral", s: 2, r: "12–15", rest: "Curto" },
          { n: "Prancha", s: 2, r: "30–45s", rest: "Curto" }
        ]
      },
      {
        title: "Full Body B",
        ex: [
          { n: "Levantamento terra romeno (ou mesa flexora)", s: 3, r: "8–12", rest: "Médio" },
          { n: "Desenvolvimento (máquina/halter)", s: 3, r: "8–12", rest: "Médio" },
          { n: "Puxada na barra (ou puxador)", s: 3, r: "8–12", rest: "Médio" },
          { n: "Rosca bíceps", s: 2, r: "10–14", rest: "Curto" },
          { n: "Tríceps corda", s: 2, r: "10–14", rest: "Curto" }
        ]
      },
      {
        title: "Full Body C",
        ex: [
          { n: "Passada / Afundo", s: 3, r: "8–12", rest: "Médio" },
          { n: "Supino inclinado (ou máquina)", s: 3, r: "8–12", rest: "Médio" },
          { n: "Remada baixa (ou remada máquina)", s: 3, r: "10–12", rest: "Médio" },
          { n: "Panturrilha", s: 3, r: "12–20", rest: "Curto" },
          { n: "Abdominal (crunch/cabo)", s: 2, r: "10–15", rest: "Curto" }
        ]
      }
    ]
  },

  HOME3: {
    id: "HOME3",
    name: "HOME3 (Casa 3x)",
    warmup: [
      "3–5 min polichinelo leve ou caminhada no lugar",
      "Mobilidade: coluna torácica + quadril (1–2 min)",
      "1–2 séries leves do 1º exercício do dia"
    ],
    week: [
      {
        title: "Home A",
        ex: [
          { n: "Agachamento livre (ou com halteres)", s: 3, r: "10–15", rest: "Médio" },
          { n: "Flexão de braços (variação)", s: 3, r: "6–12", rest: "Médio" },
          { n: "Remada com elástico/halter", s: 3, r: "10–15", rest: "Médio" },
          { n: "Ponte de glúteo", s: 2, r: "12–20", rest: "Curto" },
          { n: "Prancha", s: 2, r: "30–45s", rest: "Curto" }
        ]
      },
      {
        title: "Home B",
        ex: [
          { n: "Avanço (passada) alternado", s: 3, r: "8–12", rest: "Médio" },
          { n: "Desenvolvimento com halteres (ou elástico)", s: 3, r: "8–12", rest: "Médio" },
          { n: "Barra fixa (ou puxada no elástico)", s: 3, r: "4–10", rest: "Longo" },
          { n: "Rosca bíceps (halter/elástico)", s: 2, r: "10–14", rest: "Curto" },
          { n: "Tríceps (mergulho em banco ou elástico)", s: 2, r: "10–14", rest: "Curto" }
        ]
      },
      {
        title: "Home C",
        ex: [
          { n: "Terra romeno com halteres (ou good morning)", s: 3, r: "8–12", rest: "Médio" },
          { n: "Flexão inclinada (ou supino com halteres)", s: 3, r: "8–12", rest: "Médio" },
          { n: "Remada unilateral (halter/elástico)", s: 3, r: "10–12", rest: "Médio" },
          { n: "Panturrilha em pé", s: 3, r: "12–20", rest: "Curto" },
          { n: "Abdominal (dead bug / crunch)", s: 2, r: "10–15", rest: "Curto" }
        ]
      }
    ]
  }
};

function getPlanById(id) {
  return PLANS[id] || PLANS.FB3;
}
