import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const figures = [
  { value: 95, suffix: "%", label: "Diplômés trouvent un emploi l'année suivante" },
  { value: 90, suffix: "%", label: "Stagiaires reçoivent des propositions d'embauche" },
  { value: 90, suffix: "%", label: "Anciens étudiants satisfaits de leur diplôme" },
  { value: 80, suffix: "%", label: "Trouvent un stage grâce à notre renom" },
];

const CountUp = ({ end, suffix, isInView }: { end: number; suffix: string; isInView: boolean }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    
    let startTime: number;
    const duration = 2000;
    
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * end));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [end, isInView]);

  return (
    <span className="stat-number">
      {count}{suffix}
    </span>
  );
};

export const KeyFigures = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="section-padding bg-secondary text-secondary-foreground relative overflow-hidden" ref={ref}>
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary/50 rounded-full blur-3xl" />
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
            En chiffres
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white"
          >
            ISIME en quelques chiffres
          </motion.h2>
        </div>

        {/* Figures Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {figures.map((figure, index) => (
            <motion.div
              key={figure.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
              className="text-center"
            >
              <CountUp end={figure.value} suffix={figure.suffix} isInView={isInView} />
              <p className="text-white/70 mt-3 text-sm md:text-base">{figure.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
