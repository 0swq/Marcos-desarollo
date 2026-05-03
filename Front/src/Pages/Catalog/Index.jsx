import React from 'react'
import Footer from "../../Components/Catalog/Footer.jsx"
import Header from "../../Components/Catalog/Header.jsx"
import IndexRest from "../../Components/Rest/IndexRest.jsx"
import HeroCarrusel from "../../Components/Catalog/Hero Carrusel.jsx"
import BotonesEmergentes from "../../Components/Catalog/Botones emergentes.jsx"

export default function Index() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header/>
            <HeroCarrusel/>
            <IndexRest/>
            <BotonesEmergentes/>
            <Footer/>
        </div>
    )
}