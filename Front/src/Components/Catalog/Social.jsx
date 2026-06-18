import {useState, useEffect} from 'react'
import {NavLink} from "react-router-dom";

export default function SocialButtons() {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const handleScroll = () => setVisible(window.scrollY > 300)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const scrollToTop = () => window.scrollTo({top: 0, behavior: 'smooth'})

    return (
        <>
            <NavLink
                to="/carrito"
                className="fixed bottom-24 right-7 w-14 h-14 bg-gradient-to-br from-[#32a8a6] to-[#73c7c6] text-white rounded-full flex items-center justify-center text-3xl shadow-lg hover:scale-110 hover:shadow-[0_6px_20px_rgba(37,211,102,0.6)] transition-all duration-300 z-50 animate-pulse"
                aria-label="Ir al carrito">
                <i className="fas fa-shopping-cart"></i>
            </NavLink>
            <button
                onClick={scrollToTop}
                className={`fixed bottom-7 right-7 w-12 h-12 bg-gradient-to-br from-[#3498db] to-[#2980b9] text-white rounded-full flex items-center justify-center text-xl shadow-lg hover:-translate-y-1 hover:shadow-[0_6px_20px_rgba(52,152,219,0.6)] transition-all duration-300 z-50
          ${visible ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                aria-label="Volver arriba">
                <i className="fas fa-arrow-up"></i>
            </button>
        </>
    )
}