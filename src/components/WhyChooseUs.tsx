import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Award, Users, BookOpen, Globe } from "lucide-react";

const reasons = [
  {
    icon: Award,
    title: "Programmes Accrédités",
    description:
      "Formations reconnues par le Ministère de l'Éducation Nationale, le MESupRes et la CNEAT/FOP. Diplômes validés à l'échelle nationale et internationale.",
  },
  {
    icon: Users,
    title: "Environnement Stimulant",
    description:
      "Un cadre d'apprentissage moderne avec 15 clubs étudiants, des laboratoires équipés et un accompagnement personnalisé vers la réussite.",
  },
  {
    icon: BookOpen,
    title: "Excellence Pédagogique",
    description:
      "Des enseignants experts et des programmes constamment mis à jour pour répondre aux exigences du marché du travail.",
  },
  {
    icon: Globe,
    title: "Ouverture Internationale",
    description:
      "10% de nos étudiants partent à l'international. Partenariats avec des universités européennes pour élargir vos horizons.",
  },
];

export const WhyChooseUs = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="section-padding bg-muted/30 texture-overlay" ref={ref}>
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-block text-primary font-semibold mb-4"
          >
            Pourquoi nous choisir
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
          >
            4 raisons de choisir{" "}
            <span className="gradient-text">ISIME</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            Depuis 2007, nous formons les leaders de demain avec excellence et passion
          </motion.p>
        </div>

        {/* Reasons Grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {reasons.map((reason, index) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
              className="premium-card p-8 group"
            >
              <div className="flex items-start gap-5">
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:shadow-glow transition-all duration-300">
                  <reason.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">{reason.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {reason.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
