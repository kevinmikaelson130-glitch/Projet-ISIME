import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, HelpCircle, MessageSquare, Phone } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { faqGroups } from "@/data/faq";

export const FAQ = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="faq" className="section-padding" ref={ref}>
      <div className="container-custom">
        <div className="grid lg:grid-cols-[1fr_2fr] gap-12 lg:gap-16 items-start">
          {/* Intro + help card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="lg:sticky lg:top-28"
          >
            <span className="inline-flex items-center gap-2 text-primary font-semibold mb-4">
              <HelpCircle className="w-5 h-5" />
              Questions fréquentes
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Vous avez une question ?</h2>
            <p className="text-muted-foreground text-lg mb-8">
              Inscription, frais, formations, campus : voici les réponses aux questions qu'on nous pose le plus souvent.
            </p>

            <div className="bg-secondary text-secondary-foreground rounded-3xl p-6 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
              <div className="relative z-10">
                <h3 className="font-semibold text-lg mb-2">Vous ne trouvez pas votre réponse ?</h3>
                <p className="text-secondary-foreground/70 text-sm mb-5">
                  Appelez-nous du lundi au vendredi, de 8h00 à 17h00, ou écrivez-nous.
                </p>
                <div className="flex flex-col gap-3">
                  <a href="tel:0381581666" className="btn-primary justify-center">
                    <Phone className="w-4 h-4" />
                    038 15 816 66
                  </a>
                  <a
                    href="/#contact"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-secondary-foreground/20 px-4 py-3 font-medium hover:bg-secondary-foreground/10 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Envoyer un message
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Questions */}
          <div className="space-y-8">
            {faqGroups.map((group, groupIndex) => (
              <motion.div
                key={group.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 + groupIndex * 0.1 }}
              >
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  {group.title}
                </h3>
                <Accordion type="single" collapsible className="premium-card px-6">
                  {group.items.map((item, index) => (
                    <AccordionItem
                      key={item.question}
                      value={`${groupIndex}-${index}`}
                      className={index === group.items.length - 1 ? "border-b-0" : ""}
                    >
                      <AccordionTrigger className="text-left text-base font-semibold hover:no-underline hover:text-primary">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                        <p>{item.answer}</p>
                        {item.link && (
                          <a
                            href={item.link.href}
                            className="inline-flex items-center gap-1 mt-3 font-medium text-primary hover:underline"
                          >
                            {item.link.label}
                            <ArrowRight className="w-4 h-4" />
                          </a>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
