import React from 'react'
import Footer from "../../Components/Catalog/Footer.jsx"
import Header from "../../Components/Catalog/Header.jsx"
import IndexRest from "../../Components/Rest/IndexRest.jsx"
import HeroCarrusel from "../../Components/Catalog/Hero Carrusel.jsx"
import SocialButtons from "../../Components/Catalog/Social.jsx"

export default function Index() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header/>
            <HeroCarrusel/>
            <IndexRest/>
            <SocialButtons/>
            <Footer/>
        </div>
    )
}