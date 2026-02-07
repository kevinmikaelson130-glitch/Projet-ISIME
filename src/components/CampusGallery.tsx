import { motion } from "framer-motion";
import campusGraduation from "@/assets/campus-graduation.jpeg";
import campusStudents from "@/assets/campus-students.jpeg";
import campusCeremony from "@/assets/campus-ceremony.jpg";

const galleryImages = [
  {
    src: campusGraduation,
    alt: "Cérémonie de remise des diplômes ISIME",
    title: "Remise des Diplômes"
  },
  {
    src: campusStudents,
    alt: "Étudiants ISIME en groupe",
    title: "Vie Étudiante"
  },
  {
    src: campusCeremony,
    alt: "Cérémonie officielle ISIME",
    title: "Cérémonie Officielle"
  }
];

export const CampusGallery = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Galerie <span className="text-primary">Campus</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Découvrez la vie quotidienne de nos étudiants et les moments forts de notre communauté ISIME.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {galleryImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-2xl shadow-lg cursor-pointer"
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white text-xl font-semibold">{image.title}</h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
