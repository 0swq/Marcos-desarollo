import Header from '../../Components/Catalog/Header.jsx'
import Footer from '../../Components/Catalog/Footer.jsx'


import ReclamacionesRest from "../../Components/Rest/ReclamacionesRest.jsx";
import Hero from "../../Components/Catalog/Hero.jsx";
import BotonesEmergentes from "../../Components/Catalog/Botones emergentes.jsx";


export default function Reclamaciones() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero
          titulo="Libro de Reclamaciones"
          icono="fa-book"
          subtitulo="Canal oficial para presentar quejas, reclamos o sugerencias sobre nuestros productos o servicios"
          bg="https://wallpapers.com/images/hd/open-book-pictures-3g8vdtp71nmbgs35.jpg"
        />
        <ReclamacionesRest />
      </main>
      <Footer />
      <BotonesEmergentes />
    </div>
  )
}