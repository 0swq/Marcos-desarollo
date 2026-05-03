import Header from '../../Components/Catalog/Header.jsx'
import Footer from '../../Components/Catalog/Footer.jsx'
import BotonesEmergentes from '../../Components/Catalog/Botones emergentes.jsx'
import CarritoRest from '../../Components/Rest/CarritoRest.jsx'

export default function Carrito() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f4f6f8]">
      <Header />
      <CarritoRest />
      <Footer />
      <BotonesEmergentes />
    </div>
  )
}