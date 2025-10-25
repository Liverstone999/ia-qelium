// app/simulateur/page.tsx
"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Simulateur() {
  const [heures, setHeures] = useState(10);
  const [coutAnnuel, setCoutAnnuel] = useState(40000);
  const [tauxAuto, setTauxAuto] = useState(80);
  const [email, setEmail] = useState("");
  const [nom, setNom] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Calculs
  const heuresAn = heures * 52;
  const heuresEcoAn = heuresAn * tauxAuto / 100;
  const etp = heuresAn / 1607;
  const etpEco = Math.round((heuresEcoAn / 1607) * 10) / 10;
  const coutActuel = etp * coutAnnuel;
  const coutActuelFormatted = (etp * coutAnnuel).toLocaleString("fr-FR")
  const coutApresAuto = coutActuel * (1 - tauxAuto / 100);
  const economie = coutActuel - coutApresAuto;
  const coutIA = 7 * heuresAn;
  const gainNetAn = (coutActuel * tauxAuto / 100) - coutIA;
  const roi = coutActuel > 0 ? Math.round((gainNetAn / coutIA) * 100) : 0;
  const rentab = Math.round((roi / 100) * 100) / 100;
  const delaiROI = Math.round(coutIA / (coutActuel * tauxAuto / 100) * 12 * 10) / 10;
  const ecoAn = Math.round((coutActuel * tauxAuto / 100) * 100) / 100;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // fetch webhook...
  };

  // Graph params
  const containerHeightPx = 160; // hauteur fixe du container graphique (px)
  const percentAvant = 100;
  // Calcule un % "après" lisible, borne 5..100
  const rawPercentApres = 100 - tauxAuto * 0.8;
  const percentApres = Math.max(5, Math.min(100, Math.round(rawPercentApres)));

  // Convert percent -> px
  const pxAvant = Math.round((percentAvant / 100) * containerHeightPx);
  const pxApres = Math.round((percentApres / 100) * containerHeightPx);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-[#176be0] mb-6">
          Simulateur d'intégration IA
        </h1>

        {/* Formulaire principal */}
        <div className="space-y-4">
          <InputField
            label="Heures passées par semaine sur la tâche (estimation)"
            value={heures}
            onChange={(v) => setHeures(v)}
          />
          <InputField
            label="Coût annuel chargé par employé (€)"
            value={coutAnnuel}
            onChange={(v) => setCoutAnnuel(v)}
          />
          <InputField
            label="Taux d’automatisation estimé (%)"
            value={tauxAuto}
            onChange={(v) => setTauxAuto(v)}
          />
        </div>

        {/* Résultats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-8 bg-blue-50 rounded-xl p-6 text-center"
        >
          <h2 className="text-xl font-semibold mb-2 text-[#176be0]">
            Résultats (estimation)<br></br><br></br>
          </h2>
          <p className="text-gray-700">
            <strong>Coût de la tâche (avant solution IA)  :</strong> {coutActuel.toFixed(0)} €<br />
            <strong>Coût de la tâche (après solution IA) :</strong> {coutApresAuto.toFixed(0)} €<br />
            <strong>Gain :</strong>{" "}
            <span className="text-green-600 font-bold">
              {economie.toFixed(0)} €
            </span><br />
            <strong>ROI :</strong> {roi.toFixed(0)} %<br></br>
            <br/>
          </p>
          <p className="text-gray-700 text-left leading-relaxed">
            Votre solution IA d'automatisation de vos flux vous permettrait de :<br></br><br></br>
            
            🔹 Générer un ROI de <strong>+{roi}</strong> % dès la 1ère année. Chaque euro investi rapporterait  <strong>{rentab}</strong> € de bénéfice net.<br></br><br></br>
            🔹 Réduire de <strong>{tauxAuto}</strong> % le temps passé sur votre tâche, soit près de <strong>{heuresEcoAn}</strong> heures économisées par an.<br></br><br></br>
            🔹 Libérer <strong>{etpEco}</strong> employé(es) à temps plein pour des tâches à plus forte valeur.<br></br><br></br>
            🔹 Augmenter la rapidité, la fiabilité et la qualité de vos processus.<br></br><br></br>
            🔹 Réduire de <strong>95</strong> % les erreurs manuelles<br></br><br></br>
            🔹 Rembourser totalement votre investissement en <strong>{delaiROI}</strong> mois par les économies réalisées. Ensuite, tout ce qui est gagné sur l’année <strong>{ecoAn}</strong> € devient du bénéfice net.
          </p>
          <br></br>
          {/* Graphique — container en px pour garantir visibilité */}
          <div
            className="flex justify-center items-end mt-6 space-x-6"
            style={{ height: containerHeightPx }}
          >
            <AnimatedBar label="Coût tâche (actuel)" heightPx={pxAvant} color="#176be0" />
            <AnimatedBar label="Coût tâche (IA)" heightPx={pxApres} color="#22c55e" />
          </div>
        </motion.div>

        {/* Capture lead */}
        <div className="mt-8 text-center">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">
                Envoyer votre estimation par email 📩
              </h3>
              <input
                type="text"
                placeholder="Votre prénom (facultatif)"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                className="w-full p-2 border border-gray-300 bg-white text-gray-900 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#176be0]"
              />
              <input
                type="email"
                placeholder="Votre adresse email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 bg-white text-gray-900 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#176be0]"
              />
              <button
                type="submit"
                className="w-full bg-[#176be0] text-white py-3 rounded-lg shadow hover:bg-blue-600 transition"
              >
                Recevoir mon résultat
              </button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-green-50 text-green-700 rounded-lg p-4 font-medium"
            >
              ✅ Merci {nom || ""}! Votre estimation a bien été envoyée.
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- InputField ---------- */
function InputField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type="number"
        min="0"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full mt-1 p-2 border border-gray-300 bg-white text-gray-900 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#176be0]"
      />
    </div>
  );
}

/* ---------- AnimatedBar ---------- */
/* animation: height transition + small pop */
function AnimatedBar({
  label,
  heightPx,
  color,
}: {
  label: string;
  heightPx: number;
  color: string;
}) {
  const [currentPx, setCurrentPx] = useState(0);

  // animate on change
  useEffect(() => {
    // small timeout so transition triggers from 0 -> new value
    const t = setTimeout(() => setCurrentPx(heightPx), 20);
    return () => clearTimeout(t);
  }, [heightPx]);

  return (
    <div className="flex flex-col items-center">
      <div
        aria-hidden
        className="w-14 rounded-t-xl transition-[height,transform] duration-700 ease-out"
        style={{
          height: `${currentPx}px`,
          backgroundColor: color,
          transform: `translateY(0)`,
        }}
      />
      <span className="text-sm mt-2 text-gray-600">{label}</span>
    </div>
  );
}
