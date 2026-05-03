import Header from '../../Components/Catalog/Header.jsx'
import Footer from '../../Components/Catalog/Footer.jsx'
import BotonesEmergentes from "../../Components/Catalog/Botones emergentes.jsx";
import Hero from "../../Components/Catalog/Hero.jsx";
import ContactanosRest from "../../Components/Rest/ContactanosRest.jsx";

export default function Contactanos() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
        <Hero
          titulo="Aquí encontrarás ubicación, horarios de atención y teléfonos de contacto directo."
          subtitulo="Estamos aquí para ayudarte. Ponte en contacto con nosotros en cualquiera de nuestras sucursales."
          bg="https://hips.hearstapps.com/hmg-prod/images/casa-lago-madera-moderna-luminosa-salon-techo-sofa-blanco-64e4917bbd854.jpg?crop=1xw:0.7093125xh;center,top&resize=1200:*"
        />
        <ContactanosRest />

      <Footer />
      <BotonesEmergentes />
    </div>
  )
}