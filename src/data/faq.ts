export interface FaqItem {
  question: string;
  answer: string;
  link?: { label: string; href: string };
}

export interface FaqGroup {
  title: string;
  items: FaqItem[];
}

export const faqGroups: FaqGroup[] = [
  {
    title: "Inscription",
    items: [
      {
        question: "Quand peut-on s'inscrire à l'ISIME ?",
        answer:
          "Les inscriptions sont ouvertes toute l'année. Vous pouvez déposer votre candidature en ligne à tout moment, ou venir dans l'un de nos deux campus.",
        link: { label: "Déposer ma candidature", href: "/#candidature" },
      },
      {
        question: "Quels documents faut-il fournir ?",
        answer:
          "Le dossier comprend : 4 photos d'identité, une copie du diplôme du BACC, un certificat de résidence, une copie de la CIN ou de l'acte de naissance, et une enveloppe Kraft timbrée.",
        link: { label: "Voir les documents requis", href: "/#admissions" },
      },
      {
        question: "Peut-on envoyer les pièces du dossier en ligne ?",
        answer:
          "Oui. Le formulaire de candidature permet d'envoyer la photo, le diplôme du BACC, le certificat de résidence et la CIN (PDF, JPG, PNG ou WEBP, 5 Mo maximum par fichier). Seule l'enveloppe Kraft timbrée est à déposer au campus.",
      },
      {
        question: "Comment se passe l'admission ?",
        answer:
          "Vous préparez votre dossier, vous déposez votre candidature, puis vous passez un entretien de sélection avec notre équipe pédagogique. Votre inscription est ensuite confirmée.",
      },
      {
        question: "Comment savoir où en est ma candidature ?",
        answer:
          "Après l'envoi du formulaire, vous recevez un numéro de suivi (par exemple ISIME-1A2B3C4D). Entrez-le sur la page de suivi pour voir l'état de votre dossier et la réponse de l'ISIME.",
        link: { label: "Suivre ma candidature", href: "/suivi" },
      },
    ],
  },
  {
    title: "Frais et paiement",
    items: [
      {
        question: "Combien coûtent les frais de scolarité ?",
        answer:
          "Les frais dépendent de la formation et du niveau. Appelez-nous au 038 15 816 66 ou au 038 93 946 11 pour connaître le montant exact.",
      },
      {
        question: "Comment payer les frais de scolarité ?",
        answer:
          "Le paiement se fait uniquement par dépôt (espèces ou chèque) ou par virement à la banque BRED, sur le compte N° 00008 00005 05003025616 85 au nom de LE GENIE DU MEUBLE.",
        link: { label: "Voir les coordonnées bancaires", href: "/#admissions" },
      },
    ],
  },
  {
    title: "Formations",
    items: [
      {
        question: "Quelles formations propose l'ISIME ?",
        answer:
          "L'ISIME propose trois pôles : Informatique, Gestion et Multimédia. Chaque pôle a sa page avec les matières, les spécialisations et les débouchés.",
        link: { label: "Voir les formations", href: "/#programmes" },
      },
      {
        question: "Quel niveau faut-il pour entrer ?",
        answer:
          "La Licence (Bac+3) est accessible après le Baccalauréat. Le Master (Bac+5) est accessible après une Licence. Le MBA s'adresse aux titulaires d'un Bac+4 ou aux personnes ayant une expérience professionnelle.",
      },
      {
        question: "Les diplômes de l'ISIME sont-ils reconnus ?",
        answer:
          "Oui. Les formations de l'ISIME sont reconnues par le Ministère de l'Éducation Nationale (MEN), le MESupRes et la CNEAT/FOP.",
      },
    ],
  },
  {
    title: "Vie à l'ISIME",
    items: [
      {
        question: "Où se trouvent les campus ?",
        answer:
          "L'ISIME a deux campus à Antananarivo : Betongolo et Behoririka. Nos bureaux sont ouverts du lundi au vendredi, de 8h00 à 17h00.",
        link: { label: "Voir les campus", href: "/#contact" },
      },
      {
        question: "L'ISIME aide-t-il pour les études à l'étranger ?",
        answer:
          "Oui. Nous accompagnons nos étudiants dans leurs projets d'études en Europe : aide pour les démarches administratives et partenariats avec des universités.",
      },
    ],
  },
];
