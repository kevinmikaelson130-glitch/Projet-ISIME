import { Code, TrendingUp, Palette, type LucideIcon } from "lucide-react";
import programInformatique from "@/assets/program-informatique.jpg";
import programGestion from "@/assets/program-gestion.jpg";
import programMultimedia from "@/assets/program-multimedia.jpg";

export interface Diploma {
  name: string;
  level: string;
  duration?: string;
  access: string;
}

export interface Program {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  intro: string;
  image: string;
  diplomas: Diploma[];
  subjects: string[];
  specializations: string[];
  careers: string[];
  color: string;
  overlay: string;
}

export const programs: Program[] = [
  {
    id: "informatique",
    icon: Code,
    title: "Informatique",
    description: "Formez-vous aux technologies de demain",
    intro:
      "Le pôle Informatique forme des développeurs, des techniciens réseaux et des chefs de projet capables de concevoir, programmer et sécuriser les outils numériques des entreprises.",
    image: programInformatique,
    diplomas: [
      { name: "Licence en Informatique", level: "Bac+3", duration: "3 ans", access: "Après le Baccalauréat" },
      { name: "Master en Informatique", level: "Bac+5", duration: "2 ans", access: "Après une Licence" },
    ],
    subjects: [
      "Algorithmique et programmation",
      "Bases de données et SQL",
      "Développement web et mobile",
      "Réseaux et administration système",
      "Génie logiciel et UML",
      "Sécurité informatique",
      "Mathématiques pour l'informatique",
      "Anglais technique",
      "Gestion de projet informatique",
      "Stage en entreprise",
    ],
    specializations: ["Génie Logiciel", "Réseaux & Systèmes", "Développement Web & Mobile"],
    careers: [
      "Développeur Full Stack",
      "Ingénieur Réseaux",
      "Analyste Programmeur",
      "Chef de Projet IT",
      "Administrateur de bases de données",
      "Technicien support informatique",
    ],
    color: "from-blue-500 to-cyan-500",
    overlay: "from-blue-900/80 via-blue-900/60 to-transparent",
  },
  {
    id: "gestion",
    icon: TrendingUp,
    title: "Gestion",
    description: "Devenez un leader du management",
    intro:
      "Le pôle Gestion prépare aux métiers de la finance, du marketing, du commerce et du management, pour piloter une entreprise ou créer la sienne.",
    image: programGestion,
    diplomas: [
      { name: "Licence en Management", level: "Bac+3", duration: "3 ans", access: "Après le Baccalauréat" },
      { name: "Master en Management", level: "Bac+5", duration: "2 ans", access: "Après une Licence" },
      { name: "MBA", level: "Cadres et professionnels", access: "Après un Bac+4 ou une expérience professionnelle" },
    ],
    subjects: [
      "Comptabilité générale et analytique",
      "Finance d'entreprise",
      "Marketing et marketing digital",
      "Gestion des ressources humaines",
      "Droit des affaires",
      "Commerce international",
      "Économie et statistiques",
      "Informatique de gestion",
      "Communication et anglais des affaires",
      "Stage en entreprise",
    ],
    specializations: ["Finance & Comptabilité", "Marketing Digital", "Commerce International"],
    careers: [
      "Directeur Marketing",
      "Entrepreneur",
      "Analyste Financier",
      "Responsable Commercial",
      "Comptable",
      "Responsable des ressources humaines",
    ],
    color: "from-emerald-500 to-teal-500",
    overlay: "from-emerald-900/80 via-emerald-900/60 to-transparent",
  },
  {
    id: "multimedia",
    icon: Palette,
    title: "Multimédia",
    description: "Libérez votre créativité digitale",
    intro:
      "Le pôle Multimédia forme aux métiers de la création numérique : graphisme, vidéo, 3D, photographie et design de sites web.",
    image: programMultimedia,
    diplomas: [],
    subjects: [
      "Infographie (Photoshop, Illustrator)",
      "Modélisation et animation 3D",
      "Montage vidéo et effets spéciaux",
      "Photographie",
      "Web design et UX/UI",
      "Motion design",
      "Culture visuelle et histoire de l'art",
      "Communication digitale et réseaux sociaux",
      "Stage en entreprise",
    ],
    specializations: ["Design 3D", "Montage Vidéo", "Photographie", "Web Design"],
    careers: [
      "Designer Graphique",
      "Community Manager",
      "Motion Designer",
      "Directeur Artistique",
      "Monteur vidéo",
      "Photographe",
    ],
    color: "from-purple-500 to-pink-500",
    overlay: "from-purple-900/80 via-purple-900/60 to-transparent",
  },
];

export const getProgram = (id: string | undefined) => programs.find((p) => p.id === id);
