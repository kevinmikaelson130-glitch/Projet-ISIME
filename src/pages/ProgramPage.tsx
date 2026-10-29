import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { GraduationCap, BookOpen, Briefcase, Clock, Phone, ArrowRight, ArrowLeft, Wallet, Sparkles } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";
import { getProgram, programs } from "@/data/programs";
import NotFound from "./NotFound";

const ProgramPage = () => {
  const { slug } = useParams();
  const program = getProgram(slug);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!program) return;
    const previous = document.title;
    document.title = `${program.title} — ISIME`;
    return () => { document.title = previous; };
  }, [program]);

  if (!program) return <NotFound />;

  const others = programs.filter((p) => p.id !== program.id);

  return (
    <div className="min-h-screen">
      <Header />
      <ScrollToTop />
      <main>
        {/* Banner */}
        <section className="relative h-[340px] md:h-[420px] overflow-hidden">
          <img src={program.image} alt={`Pôle ${program.title}`} className="absolute inset-0 w-full h-full object-cover" />
          <div className={`absolute inset-0 bg-gradient-to-t ${program.overlay}`} />
          <div className="absolute inset-0 bg-secondary/40" />
          <div className="relative container-custom h-full flex flex-col justify-end pb-10">
            <Link to="/#programmes" reloadDocument className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm mb-6 w-fit">
              <ArrowLeft className="w-4 h-4" />Toutes les formations
            </Link>
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${program.color} flex items-center justify-center shadow-lg`}>
                <program.icon className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-white/80 text-sm font-medium">Pôle</p>
                <h1 className="text-4xl md:text-5xl font-bold text-white">{program.title}</h1>
              </div>
            </div>
            <p className="text-white/90 text-lg mt-4 max-w-2xl">{program.intro}</p>
          </div>
        </section>

        <div className="container-custom py-14 grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-10">
            {/* Diplomas */}
            <section>
              <h2 className="text-2xl font-bold mb-5 flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-primary" />Diplômes et durée
              </h2>
              {program.diplomas.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  {program.diplomas.map((d) => (
                    <div key={d.name} className="premium-card p-5">
                      <p className="font-semibold text-lg">{d.name}</p>
                      <p className="text-primary font-medium text-sm mb-3">{d.level}</p>
                      <div className="space-y-1.5 text-sm text-muted-foreground">
                        <p className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />{d.duration ?? "Durée : nous consulter"}
                        </p>
                        <p className="flex items-center gap-2">
                          <ArrowRight className="w-4 h-4" />{d.access}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="premium-card p-5 text-muted-foreground">
                  Pour connaître les diplômes et la durée des études en {program.title}, appelez l'ISIME au 038 15 816 66 ou 038 93 946 11.
                </div>
              )}
            </section>

            {/* Subjects */}
            <section>
              <h2 className="text-2xl font-bold mb-5 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-primary" />Matières principales
              </h2>
              <ul className="grid sm:grid-cols-2 gap-3">
                {program.subjects.map((s) => (
                  <li key={s} className="flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3">
                    <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Specializations */}
            <section>
              <h2 className="text-2xl font-bold mb-5 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-primary" />Spécialisations
              </h2>
              <div className="flex flex-wrap gap-2">
                {program.specializations.map((s) => (
                  <span key={s} className="px-4 py-2 bg-muted rounded-full text-sm font-medium">{s}</span>
                ))}
              </div>
            </section>

            {/* Careers */}
            <section>
              <h2 className="text-2xl font-bold mb-5 flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-primary" />Débouchés
              </h2>
              <ul className="grid sm:grid-cols-2 gap-3">
                {program.careers.map((c) => (
                  <li key={c} className="flex items-center gap-3 text-muted-foreground">
                    <ArrowRight className="w-4 h-4 text-primary flex-shrink-0" />{c}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Side column */}
          <aside className="space-y-6">
            <div className="premium-card p-6 lg:sticky lg:top-28 space-y-5">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2 mb-2">
                  <Wallet className="w-5 h-5 text-primary" />Frais de scolarité
                </h2>
                <p className="text-sm text-muted-foreground">
                  Pour connaître les frais de l'année en cours, appelez-nous. Le paiement se fait par dépôt ou virement à la BRED.
                </p>
              </div>
              <div className="space-y-2">
                <a href="tel:0381581666" className="flex items-center gap-2 text-sm font-medium hover:text-primary">
                  <Phone className="w-4 h-4 text-primary" />038 15 816 66
                </a>
                <a href="tel:0389394611" className="flex items-center gap-2 text-sm font-medium hover:text-primary">
                  <Phone className="w-4 h-4 text-primary" />038 93 946 11
                </a>
              </div>
              <Link to="/#candidature" reloadDocument className="btn-primary w-full text-center block">
                Postuler en {program.title}
              </Link>
              <Link to="/#admissions" reloadDocument className="block text-center text-sm text-primary hover:underline">
                Voir les conditions d'admission
              </Link>
            </div>

            <div className="premium-card p-6">
              <h2 className="font-semibold mb-3">Autres pôles</h2>
              <div className="space-y-2">
                {others.map((o) => (
                  <Link key={o.id} to={`/formations/${o.id}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors">
                    <img src={o.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                    <span className="font-medium flex-1">{o.title}</span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProgramPage;
