import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const content = {
  confidentialite: {
    title: 'Politique de confidentialité',
    sections: [
      ['Données collectées', "Lorsque vous remplissez le formulaire de candidature ou de contact, nous recueillons : nom, prénom, email, téléphone, date de naissance, nationalité, niveau d'études, formation souhaitée et votre message."],
      ['Utilisation', "Ces informations servent uniquement à traiter votre candidature et à vous répondre (par téléphone, WhatsApp ou email). Elles ne sont jamais vendues ni partagées avec des tiers."],
      ['Accès et sécurité', "Seuls les administrateurs autorisés d'ISIME peuvent consulter vos données. Elles sont stockées sur un serveur sécurisé avec connexion chiffrée (HTTPS)."],
      ['Durée de conservation', "Les données sont conservées le temps nécessaire au traitement de votre dossier, puis supprimées sur simple demande."],
      ['Vos droits', "Vous pouvez demander à consulter, corriger ou supprimer vos données en écrivant à universite.isime@gmail.com."],
    ],
  },
  mentions: {
    title: 'Mentions légales',
    sections: [
      ['Éditeur du site', "ISIME — Institut Supérieur de l'Informatique et Management de l'Entreprise, Antananarivo, Madagascar. Campus de Betongolo et Behoririka."],
      ['Contact', "Email : universite.isime@gmail.com — Téléphone : 038 15 816 66 / 038 93 946 11."],
      ['Hébergement', "Le site est hébergé par Lovable (lovable.app)."],
      ['Propriété intellectuelle', "Les textes, photos, logos et vidéos de ce site appartiennent à ISIME. Toute reproduction sans autorisation est interdite."],
    ],
  },
};

const Legal = ({ page }: { page: keyof typeof content }) => {
  const c = content[page];
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container-custom pt-36 pb-20 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">{c.title}</h1>
        <div className="space-y-6">
          {c.sections.map(([h, t]) => (
            <section key={h}>
              <h2 className="text-xl font-semibold text-primary mb-2">{h}</h2>
              <p className="text-muted-foreground leading-relaxed">{t}</p>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Legal;
