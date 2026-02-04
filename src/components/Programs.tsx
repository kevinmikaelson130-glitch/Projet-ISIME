import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Code, TrendingUp, Palette, ArrowRight } from "lucide-react";

// Import images
import programInformatique from "@/assets/program-informatique.jpg";
import programGestion from "@/assets/program-gestion.jpg";
import programMultimedia from "@/assets/program-multimedia.jpg";

const programs = [
  {
    id: "informatique",
    icon: Code,
    title: "Informatique",
    description: "Formez-vous aux technologies de demain",
    image: programInformatique,
    specializations: ["Génie Logiciel", "Réseaux & Systèmes", "Développement Web & Mobile"],
    careers: ["Développeur Full Stack", "Ingénieur Réseaux", "Analyste Programmeur", "Chef de Projet IT"],
    color: "from-blue-500 to-cyan-500",
    overlay: "from-blue-900/80 via-blue-900/60 to-transparent",
  },
  {
    id: "gestion",
    icon: TrendingUp,
    title: "Gestion",
    description: "Devenez un leader du management",
    image: programGestion,
    specializations: ["Finance & Comptabilité", "Marketing Digital", "Commerce International"],
    careers: ["Directeur Marketing", "Entrepreneur", "Analyste Financier", "Responsable Commercial"],
    color: "from-emerald-500 to-teal-500",
    overlay: "from-emerald-900/80 via-emerald-900/60 to-transparent",
  },
  {
    id: "multimedia",
    icon: Palette,
    title: "Multimédia",
    description: "Libérez votre créativité digitale",
    image: programMultimedia,
    specializations: ["Design 3D", "Montage Vidéo", "Photographie", "Web Design"],
    careers: ["Designer Graphique", "Community Manager", "Motion Designer", "Directeur Artistique"],
    color: "from-purple-500 to-pink-500",
    overlay: "from-purple-900/80 via-purple-900/60 to-transparent",
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
              <div className="premium-card h-full overflow-hidden flex flex-col">
                {/* Image Header */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={program.image}
                    alt={program.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t ${program.overlay}`} />
                  
                  {/* Icon Badge */}
                  <div className="absolute bottom-4 left-6">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${program.color} flex items-center justify-center shadow-lg backdrop-blur-sm`}>
                      <program.icon className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  
                  {/* Title on Image */}
                  <div className="absolute bottom-4 left-24">
                    <h3 className="text-2xl font-bold text-white drop-shadow-lg">{program.title}</h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
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
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
