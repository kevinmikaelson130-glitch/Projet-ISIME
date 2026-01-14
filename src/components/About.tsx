import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { History, Target, Heart } from "lucide-react";

export const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="section-padding bg-secondary text-secondary-foreground relative overflow-hidden" ref={ref}>
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-block text-primary font-semibold mb-4"
          >
            Notre histoire
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6"
          >
            À propos d'ISIME
          </motion.h2>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* History Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card bg-white/5 backdrop-blur-xl border-white/10 rounded-3xl p-8"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mb-6">
              <History className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Notre Histoire</h3>
            <p className="text-white/70 leading-relaxed">
              Fondé en 2007 par M. David et Mme Yolande Claudia RAKOTOARISOA, ISIME est né 
              d'une vision ambitieuse : rendre l'excellence académique accessible à tous les 
              Malgaches passionnés par l'informatique et le management.
            </p>
          </motion.div>

          {/* Mission Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="glass-card bg-white/5 backdrop-blur-xl border-white/10 rounded-3xl p-8"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mb-6">
              <Target className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Notre Mission</h3>
            <p className="text-white/70 leading-relaxed">
              Former des professionnels compétents, innovants et éthiques, capables de 
              répondre aux défis du monde moderne. Nous préparons nos étudiants à devenir 
              les acteurs du changement dans leurs domaines respectifs.
            </p>
          </motion.div>

          {/* Values Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="glass-card bg-white/5 backdrop-blur-xl border-white/10 rounded-3xl p-8"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mb-6">
              <Heart className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Nos Valeurs</h3>
            <p className="text-white/70 leading-relaxed">
              Excellence, innovation, intégrité et solidarité. Ces valeurs guident chaque 
              aspect de notre enseignement et de notre accompagnement, créant un environnement 
              propice à l'épanouissement de chaque étudiant.
            </p>
          </motion.div>
        </div>

        {/* Accreditations */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <h3 className="text-xl font-semibold text-white mb-6">Accréditations et reconnaissances</h3>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="glass-card bg-white/5 border-white/10 rounded-2xl px-6 py-4">
              <span className="text-white/90 font-medium">MEN</span>
              <p className="text-white/60 text-sm">Ministère de l'Éducation Nationale</p>
            </div>
            <div className="glass-card bg-white/5 border-white/10 rounded-2xl px-6 py-4">
              <span className="text-white/90 font-medium">MESupRes</span>
              <p className="text-white/60 text-sm">Enseignement Supérieur et Recherche</p>
            </div>
            <div className="glass-card bg-white/5 border-white/10 rounded-2xl px-6 py-4">
              <span className="text-white/90 font-medium">CNEAT/FOP</span>
              <p className="text-white/60 text-sm">Formation Professionnelle</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
