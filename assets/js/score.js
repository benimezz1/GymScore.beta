/* GymScore scoring engine (no AI) */

function computeScores(profile, finalAnswers) {
  // Base scores
  const scores = {
    FB3: 0,
    HOME3: 0
  };

  const place = profile.place;
  const goal = profile.goal;
  const days = Number(profile.days || 0);
  const age = Number(profile.age || 0);

  // Place rules (strong)
  if (place === "home") scores.HOME3 += 50;
  if (place === "gym") scores.FB3 += 50;

  // Days: MVP is 3-day template
  if (days === 3) { scores.FB3 += 15; scores.HOME3 += 15; }
  if (days < 3)  { scores.FB3 += 5;  scores.HOME3 += 5; }
  if (days > 3)  { scores.FB3 += 6;  scores.HOME3 += 6; }

  // Goal tweaks
  if (goal === "calisthenics") scores.HOME3 += 25;
  if (goal === "health" || goal === "posture") { scores.FB3 += 8; scores.HOME3 += 8; }

  if (goal === "strength") scores.FB3 += 8;
  if (goal === "hypertrophy") scores.FB3 += 6;

  // Under 18 => slightly conservative, no aggressive bias
  if (age > 0 && age < 18) {
    scores.FB3 += 4;
    scores.HOME3 += 4;
  }

  // Injuries => nudge to "simpler" environment (home slightly) but keep balanced
  const inj = Array.isArray(profile.injuries) ? profile.injuries : [];
  if (inj.length >= 2) {
    scores.HOME3 += 4;
    scores.FB3 += 2;
  }

  // Cardio (beta): does not change plan much, but can nudge to more general plan
  const cardio = finalAnswers?.cardio || "none";
  if (cardio === "mod") { scores.FB3 += 2; scores.HOME3 += 2; }

  // Determine winner
  let bestId = "FB3";
  if (scores.HOME3 > scores.FB3) bestId = "HOME3";

  // Safety fallback
  if (place === "home") bestId = "HOME3";
  if (place === "gym") bestId = "FB3";

  return { bestId, scores };
}
