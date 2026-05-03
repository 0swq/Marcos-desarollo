import React from 'react';
import Footer from "../../Components/Catalog/Footer.jsx";
import Header from "../../Components/Catalog/Header.jsx";
import BotonesEmergentes from "../../Components/Catalog/Botones emergentes.jsx";
import Hero from "../../Components/Catalog/Hero.jsx";
import MetodoPagoRest from "../../Components/Rest/MetodosRest.jsx";

export default function MetodoPago() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero
          titulo="Métodos de Pago"
          icono="fa-credit-card"
          subtitulo="En AGLOME PERÚ ofrecemos diversas opciones para que puedas realizar tus pagos de manera segura y conveniente"
          bg="https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"
        />
        <MetodoPagoRest />
      </main>
      <Footer />
      <BotonesEmergentes />
    </div>
  )
}