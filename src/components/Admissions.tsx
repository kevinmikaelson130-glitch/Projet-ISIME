import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Camera, FileText, Home, CreditCard, FolderOpen, CheckCircle2, ArrowRight, Landmark, Copy } from "lucide-react";

const documents = [
  { icon: Camera, label: "4 Photos d'identité" },
  { icon: FileText, label: "Copie du diplôme BACC" },
  { icon: Home, label: "Certificat de résidence" },
  { icon: CreditCard, label: "Copie CIN ou acte de naissance" },
  { icon: FolderOpen, label: "Enveloppe Kraft timbrée" },
];

const steps = [
  { step: "01", title: "Préparez votre dossier", description: "Rassemblez tous les documents requis" },
  { step: "02", title: "Déposez votre candidature", description: "En ligne ou dans l'un de nos campus" },
  { step: "03", title: "Entretien de sélection", description: "Rencontrez notre équipe pédagogique" },
  { step: "04", title: "Confirmation d'inscription", description: "Bienvenue à ISIME !" },
];

export const Admissions = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("00008 00005 05003025616 85");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="admissions" className="section-padding bg-muted/30" ref={ref}>
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Column - Requirements */}
          <div>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="inline-block text-primary font-semibold mb-4"
            >
              Admissions
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold mb-6"
            >
              Rejoignez-nous
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-muted-foreground text-lg mb-8"
            >
              Les inscriptions sont ouvertes toute l'année. Préparez votre dossier et rejoignez notre communauté d'étudiants ambitieux.
            </motion.p>

            {/* Documents Required */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="premium-card p-6 mb-8"
            >
              <h3 className="font-semibold text-lg mb-4">Documents requis</h3>
              <div className="space-y-4">
                {documents.map((doc, index) => (
                  <div key={doc.label} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <doc.icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-foreground">{doc.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* International Support */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="glass-card rounded-2xl p-6 border-l-4 border-primary"
            >
              <h3 className="font-semibold text-lg mb-2">🌍 Études à l'étranger</h3>
              <p className="text-muted-foreground">
                Nous accompagnons nos étudiants dans leurs projets d'études en Europe. 
                Assistance pour les démarches administratives et partenariats universitaires.
              </p>
            </motion.div>
          </div>

          {/* Right Column - Process & CTA */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-8"
            >
              <h3 className="font-semibold text-xl mb-6">Processus d'admission</h3>
              <div className="space-y-6">
                {steps.map((step, index) => (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                      {step.step}
                    </div>
                    <div className="pt-1">
                      <h4 className="font-semibold mb-1">{step.title}</h4>
                      <p className="text-muted-foreground text-sm">{step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Bank Payment Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="premium-card p-6 mb-8 border-l-4 border-primary"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Landmark className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Paiement des frais de scolarité</h3>
              </div>
              <p className="text-muted-foreground text-sm mb-4">
                Le paiement se fera uniquement par dépôt (espèce, chèque) ou virement bancaire auprès de la banque <strong className="text-foreground">BRED</strong>.
              </p>
              <div className="space-y-3 bg-muted/50 rounded-xl p-4">
                <div>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">Numéro de compte</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-mono font-semibold text-foreground">BRED N° 00008 00005 05003025616 85</span>
                    <button
                      onClick={handleCopy}
                      className="p-1.5 rounded-lg hover:bg-primary/10 transition-colors"
                      title="Copier le numéro"
                    >
                      <Copy className="w-4 h-4 text-primary" />
                    </button>
                    {copied && <span className="text-xs text-primary">Copié !</span>}
                  </div>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">Titulaire du compte</span>
                  <p className="font-semibold text-foreground mt-1">LE GENIE DU MEUBLE</p>
                </div>
              </div>
            </motion.div>

            {/* CTA Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-secondary text-secondary-foreground rounded-3xl p-8 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
              <div className="relative z-10">
                <CheckCircle2 className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold text-white mb-3">
                  Prêt à commencer votre aventure ?
                </h3>
                <p className="text-white/70 mb-6">
                  Faites le premier pas vers votre avenir. Notre équipe est là pour vous accompagner.
                </p>
                <a href="#contact" className="btn-primary inline-flex">
                  Démarrer ma candidature
                  <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
