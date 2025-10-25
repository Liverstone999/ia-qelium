// pages/simulateur.tsx
"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Simulateur() {
  const [heures, setHeures] = useState(10);
  const [coutAnnuel, setCoutAnnuel] = useState(40000);
  const [tauxAuto, setTauxAuto] = useState(80);
  const [email, setEmail] = useState("");
  const [nom, setNom] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Handlers typés
  const handleChangeHeures = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHeures(Number(e.target.value));
  };
  const handleChangeCoutAnnuel = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCoutAnnuel(Number(e.target.value));
  };
  const handleChangeTauxAuto = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTauxAuto(Number(e.target.value));
  };
  const handleChangeNom = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNom(e.target.value);
  };
  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  // Calculs
  const heuresAn = heures * 52;
  const etp = heuresAn / 1607;
  const coutActuel = etp * coutAnnuel;
  const coutApresAuto = coutActuel * (1 - tauxAuto / 100);
  const economie = coutActuel - coutApresAuto;
  const roi = (economie / coutActuel) * 100;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    // 🔗 Connexion à un webhook n8n / CRM possible ici
    // fetch("/api/saveLead", { method: "POST", body: JSON.stringify({ nom, email, heures, coutAnnuel, economie }) })
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-[#176be0] mb-6">
          Simulateur d’économies grâce à l’automatisation IA
        </h1>

        {/* Formulaire principal */}
        <div className="space-y-4">
          <InputField
            label="Heures passées par semaine sur la tâche"
            value={heures}
            onChange={handleChangeHeures}
          />
          <InputField
            label="Coût annuel chargé par employé (€)"
            value={coutAnnuel}
            onChange={handleChangeCoutAnnuel}
          />
          <InputField
            label="Taux d’automatisation estimé (%)"
            value={tauxAuto}
            onChange={handleChangeTauxAuto}
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
            Résultats estimés
          </h2>
          <p className="text-gray-700">
            <strong>Coût annuel actuel :</strong> {coutActuel.toFixed(0)} €<br />
            <strong>Coût après automatisation :</strong> {coutApresAuto.toFixed(0)} €<br />
            <strong>Économie annuelle :</strong>{" "}
            <span className="text-green-600 font-bold">
              {economie.toFixed(0)} €
            </span><br />
            <strong>ROI :</strong> {roi.toFixed(0)} %
          </p>

          {/* Graphique simple */}
          <div className="flex justify-center items-end mt-6 space-x-6 h-32">
            <Bar label="Avant" height="100%" color="#176be0" />
            <Bar label="Après" height={`${100 - tauxAuto * 0.8}%`} color="#22c55e" />
          </div>
        </motion.div>

        {/* Capture lead */}
        <div className="mt-8 text-center">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">
                Recevez votre estimation par email 📩
              </h3>
              <input
                type="text"
                placeholder="Votre prénom (facultatif)"
                value={nom}
                onChange={handleChangeNom}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#176be0]"
              />
              <input
                type="email"
                placeholder="Votre adresse email"
                value={email}
                onChange={handleChangeEmail}
                required
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#176be0]"
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
              ✅ Merci {nom || ""}! Votre estimation a bien été enregistrée.
              <br />
              Vous allez recevoir un récapitulatif par email.
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

// Sous-composants
function InputField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type="number"
        min="0"
        value={value}
        onChange={onChange}
        className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#176be0]"
      />
    </div>
  );
}

function Bar({
  label,
  height,
  color,
}: {
  label: string;
  height: string;
  color: string;
}) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="w-10 rounded-t-xl"
        style={{ height, backgroundColor: color }}
      ></div>
      <span className="text-sm mt-2 text-gray-600">{label}</span>
    </div>
  );
}
