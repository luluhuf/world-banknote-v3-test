
/* World Banknote Collector — Scanner Gemini */
(() => {
  const button = document.getElementById("analyze");
  if (!button || !window.supabase) return;

  const originalAnalyze = button.onclick;

  button.onclick = async () => {
    if (!photos.front || !photos.back) {
      $("status").textContent =
        "Photographie le recto et le verso.";
      return;
    }

    button.disabled = true;
    $("status").textContent =
      "🤖 Gemini analyse ton billet…";

    try {
      const { data: sessionData, error: sessionError } =
        await client.auth.getSession();

      if (sessionError || !sessionData.session) {
        throw new Error("Connecte-toi à ton compte.");
      }

      const response = await fetch(
        URL_BASE + "/functions/v1/identify-banknote",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: PUBLIC_KEY,
            Authorization:
              "Bearer " + sessionData.session.access_token
          },
          body: JSON.stringify({
            front: photos.front,
            back: photos.back
          })
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Analyse indisponible"
        );
      }

      $("country").value = result.country || "";
      $("currency").value = result.currency || "";
      $("amount").value = result.amount || "";
      $("year").value = result.year || "";
      $("era").value = result.era || "unknown";

      currentBio = result.history || "";
      $("bio").textContent =
        currentBio || "Histoire à vérifier.";

      const confidenceLabels = {
        high: "Élevée",
        medium: "Moyenne",
        low: "Faible"
      };

      $("confidence").textContent =
        "Analyse Gemini — confiance : " +
        (confidenceLabels[result.confidence] || "Faible") +
        (result.needs_review
          ? " · Vérification nécessaire"
          : " · Vérifie les informations avant d'enregistrer");

      $("result").classList.remove("hidden");
      $("status").textContent =
        "✅ Analyse terminée ! Vérifie la fiche.";

    } catch (error) {
      console.error("Gemini scanner:", error);
      $("status").textContent =
        "Gemini indisponible : " + error.message +
        ". Passage à l'ancien scanner…";

      button.disabled = false;

      if (typeof originalAnalyze === "function") {
        await originalAnalyze();
      }
    } finally {
      button.disabled = false;
    }
  };
})();
