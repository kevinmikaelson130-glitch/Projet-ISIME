import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, CheckCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const applicationSchema = z.object({
  first_name: z.string().min(2, "Le prénom doit contenir au moins 2 caractères").max(50),
  last_name: z.string().min(2, "Le nom doit contenir au moins 2 caractères").max(50),
  email: z.string().email("Adresse email invalide").max(100),
  phone: z.string().min(8, "Numéro de téléphone invalide").max(20),
  date_of_birth: z.string().min(1, "La date de naissance est requise"),
  nationality: z.string().min(2, "La nationalité est requise").max(50),
  address: z.string().min(5, "L'adresse est requise").max(200),
  program: z.string().min(1, "Veuillez sélectionner un programme"),
  education_level: z.string().min(1, "Veuillez sélectionner votre niveau d'études"),
  previous_school: z.string().max(100).optional(),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

const programs = [
  "Licence en Informatique",
  "Licence en Management",
  "Master en Informatique",
  "Master en Management",
  "MBA",
];

const educationLevels = [
  "Baccalauréat",
  "Bac +2 (DTS)",
  "Licence (Bac+3)",
  "Master 1 (Bac+4)",
  "Master 2 (Bac+5)",
  "Autre",
];

export const ApplicationForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      date_of_birth: "",
      nationality: "",
      address: "",
      program: "",
      education_level: "",
      previous_school: "",
    },
  });

  const onSubmit = async (data: ApplicationFormData) => {
    setIsLoading(true);
    
    const { error } = await supabase.from("applications").insert({
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      phone: data.phone,
      date_of_birth: data.date_of_birth,
      nationality: data.nationality,
      address: data.address,
      city: "N/A",
      country: "N/A",
      program: data.program,
      education_level: data.education_level,
      previous_school: data.previous_school || null,
      motivation: "N/A",
    });

    setIsLoading(false);

    if (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
      });
      return;
    }

    setIsSubmitted(true);
    toast({
      title: "Candidature envoyée !",
      description: "Nous avons bien reçu votre candidature.",
    });
  };

  if (isSubmitted) {
    return (
      <section id="candidature" className="py-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto text-center py-16"
          >
            <CheckCircle className="w-20 h-20 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Candidature Envoyée !
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Merci pour votre candidature. Notre équipe l'examinera dans les plus brefs délais. 
              Vous recevrez une réponse par email.
            </p>
            <Button onClick={() => setIsSubmitted(false)} variant="outline">
              Soumettre une autre candidature
            </Button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="candidature" className="py-20 bg-gradient-to-b from-primary/5 to-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Inscrivez-vous
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 text-foreground">
            Formulaire de Candidature
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Rejoignez l'ISIME et donnez un nouvel élan à votre carrière. Remplissez le formulaire ci-dessous pour postuler.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto bg-card rounded-2xl shadow-xl p-8 md:p-12"
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b">
                  Informations Personnelles
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prénom *</FormLabel>
                        <FormControl>
                          <Input placeholder="Jean" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="last_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom *</FormLabel>
                        <FormControl>
                          <Input placeholder="Dupont" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="jean.dupont@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Téléphone *</FormLabel>
                        <FormControl>
                          <Input placeholder="+261 34 12 345 67" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="date_of_birth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date de naissance *</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="nationality"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nationalité *</FormLabel>
                        <FormControl>
                          <Input placeholder="Malagasy" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b">
                  Adresse
                </h3>
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adresse complète *</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Avenue de l'Université, Kinshasa" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Academic Information */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b">
                  Informations Académiques
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="program"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Programme souhaité *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez un programme" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {programs.map((program) => (
                              <SelectItem key={program} value={program}>
                                {program}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="education_level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Niveau d'études actuel *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez votre niveau" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {educationLevels.map((level) => (
                              <SelectItem key={level} value={level}>
                                {level}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="previous_school"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Établissement précédent</FormLabel>
                        <FormControl>
                          <Input placeholder="Nom de votre école/université précédente" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex justify-center pt-4">
                <Button
                  type="submit"
                  size="lg"
                  className="px-12"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Soumettre ma candidature
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </motion.div>
      </div>
    </section>
  );
};