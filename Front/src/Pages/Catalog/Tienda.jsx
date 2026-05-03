import Header from '../../Components/Catalog/Header.jsx'
import Footer from '../../Components/Catalog/Footer.jsx'
import BotonesEmergentes from '../../Components/Catalog/Botones emergentes.jsx'
import Hero from '../../Components/Catalog/Hero.jsx'
import TiendaRest from '../../Components/Rest/TiendaRest.jsx'

export default function Tienda() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header/>
            <Hero
                titulo="Explora nuestro catálogo de productos"
                subtitulo="Encuentra todo lo que necesitas en AGLOME PERU. Calidad garantizada en cada producto."
                bg="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1400&q=80"
            />
            <TiendaRest/>
            <Footer/>
            <BotonesEmergentes/>
        </div>
    )
}