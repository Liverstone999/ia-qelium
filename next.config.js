/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // ⬅️ indique à Next de générer un site statique
  images: {
    unoptimized: true, // ⬅️ indispensable pour l’export statique (désactive l'optimisation d'images côté serveur)
  },
  trailingSlash: true, // optionnel, utile sur hébergements mutualisés (ajoute un / à la fin des URLs)
};

module.exports = nextConfig;
