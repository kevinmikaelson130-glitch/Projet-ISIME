import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Code, TrendingUp, Palette, ArrowRight } from "lucide-react";

const programs = [
  {
    id: "informatique",
    icon: Code,
    title: "Informatique",
    description: "Formez-vous aux technologies de demain",
    specializations: ["Génie Logiciel", "Réseaux & Systèmes", "Développement Web & Mobile"],
    careers: ["Développeur Full Stack", "Ingénieur Réseaux", "Analyste Programmeur", "Chef de Projet IT"],
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "gestion",
    icon: TrendingUp,
    title: "Gestion",
    description: "Devenez un leader du management",
    specializations: ["Finance & Comptabilité", "Marketing Digital", "Commerce International"],
    careers: ["Directeur Marketing", "Entrepreneur", "Analyste Financier", "Responsable Commercial"],
    color: "from-emerald-500 to-teal-500",
  },
  {
    id: "multimedia",
    icon: Palette,
    title: "Multimédia",
    description: "Libérez votre créativité digitale",
    specializations: ["Design 3D", "Montage Vidéo", "Photographie", "Web Design"],
    careers: ["Designer Graphique", "Community Manager", "Motion Designer", "Directeur Artistique"],
    color: "from-purple-500 to-pink-500",
  },
];

export const Programs = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="programmes" className="section-padding" ref={ref}>
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-block text-primary font-semibold mb-4"
          >
            Nos formations
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
          >
            3 pôles d'excellence
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            Des programmes adaptés aux besoins du marché, dispensés par des experts reconnus
          </motion.p>
        </div>

        {/* Programs Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {programs.map((program, index) => (
            <motion.div
              key={program.id}
              id={program.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 * (index + 1) }}
              className="group"
            >
              <div className="premium-card h-full p-8 flex flex-col">
                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${program.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <program.icon className="w-8 h-8 text-white" />
                </div>

                {/* Title & Description */}
                <h3 className="text-2xl font-bold mb-3">{program.title}</h3>
                <p className="text-muted-foreground mb-6">{program.description}</p>

                {/* Specializations */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-foreground/80 mb-3">Spécialisations</h4>
                  <div className="flex flex-wrap gap-2">
                    {program.specializations.map((spec) => (
                      <span
                        key={spec}
                        className="px-3 py-1.5 bg-muted rounded-full text-sm text-muted-foreground"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Careers */}
                <div className="mb-8 flex-grow">
                  <h4 className="text-sm font-semibold text-foreground/80 mb-3">Débouchés</h4>
                  <ul className="space-y-2">
                    {program.careers.map((career) => (
                      <li key={career} className="text-muted-foreground text-sm flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {career}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <a
                  href="#admissions"
                  className="inline-flex items-center gap-2 text-primary font-medium group/link"
                >
                  En savoir plus
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
