import React from 'react';
import Footer from "../../Components/Catalog/Footer.jsx";
import Header from "../../Components/Catalog/Header.jsx";
import Hero from "../../Components/Catalog/Hero.jsx";
import NosotrosRest from "../../Components/Rest/NosotrosRest.jsx";
import BotonesEmergentes from "../../Components/Catalog/Botones emergentes.jsx";
import aglome_fondo from "../../assets/aglome_fondo.png"

export default function Nosotros() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header/>
            <Hero titulo="" subtitulo="" bg={aglome_fondo}/>
            <NosotrosRest/>
            <BotonesEmergentes/>
            <Footer/>
        </div>
    )
}