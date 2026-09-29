import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contacto — enITma",
  description: "Cuéntanos sobre tu organización y nuestro equipo se pondrá en contacto contigo."
};

export default function ContactoPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contacto"
        title="Hablemos sobre tu organización"
        description="Cuéntanos qué necesitas y nuestro equipo se pondrá en contacto contigo."
      />
      <section className="container-enitma section max-w-2xl">
        <ContactForm />
      </section>
    </>
  );
}
