import { Facebook, Phone, Mail, MapPin } from "lucide-react";
import isimeLogo from "@/assets/isime-logo.jpeg";

const footerLinks = {
  formations: [
    { label: "Informatique", href: "#informatique" },
    { label: "Gestion", href: "#gestion" },
    { label: "Multimédia", href: "#multimedia" },
  ],
  institution: [
    { label: "À propos", href: "#about" },
    { label: "Nos campus", href: "#contact" },
    { label: "Accréditations", href: "#" },
    { label: "Actualités", href: "#" },
  ],
  admissions: [
    { label: "Postuler", href: "#admissions" },
    { label: "Documents requis", href: "#admissions" },
    { label: "Frais de scolarité", href: "#" },
    { label: "Bourses", href: "#" },
  ],
};

export const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      {/* Main Footer */}
      <div className="container-custom section-padding pb-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <img
              src={isimeLogo}
              alt="ISIME"
              className="h-24 w-auto mb-6 bg-white rounded-lg p-2"
            />
            <p className="text-white/70 mb-6 max-w-sm leading-relaxed">
              Institut Supérieur de l'Informatique et du Management de l'Entreprise. 
              Former les leaders de demain depuis 2007.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://www.facebook.com/instiut.ISIME"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Formations */}
          <div>
            <h4 className="font-semibold text-white mb-4">Formations</h4>
            <ul className="space-y-3">
              {footerLinks.formations.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-white/70 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Institution */}
          <div>
            <h4 className="font-semibold text-white mb-4">Institution</h4>
            <ul className="space-y-3">
              {footerLinks.institution.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-white/70 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-white/70">
                <Phone className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p>038 15 816 66</p>
                  <p>038 93 946 11</p>
                </div>
              </li>
              <li className="flex items-center gap-3 text-white/70">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <span>universite.isime@gmail.com</span>
              </li>
              <li className="flex items-start gap-3 text-white/70">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p>Campus Betongolo</p>
                  <p>Campus Behoririka</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/60 text-sm">
              © {new Date().getFullYear()} ISIME. Tous droits réservés.
            </p>
            <div className="flex items-center gap-6 text-sm text-white/60">
              <a href="/mentions-legales" className="hover:text-primary transition-colors">
                Mentions légales
              </a>
              <a href="/suivi" className="hover:text-primary transition-colors">Suivi de candidature</a>
              <a href="/confidentialite" className="hover:text-primary transition-colors">
                Politique de confidentialité
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
