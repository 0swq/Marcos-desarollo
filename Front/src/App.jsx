import {BrowserRouter as Router, Routes, Route, useNavigate, Navigate, useSearchParams} from "react-router-dom"
import {SignedIn, SignedOut, RedirectToSignIn, AuthenticateWithRedirectCallback, useClerk} from "@clerk/clerk-react"

import Index from "./Pages/Catalog/Index.jsx"
import Nosotros from "./Pages/Catalog/Nosotros.jsx"
import Metodos from "./Pages/Catalog/Metodos.jsx"
import Reclamaciones from "./Pages/Catalog/Reclamaciones.jsx"
import Contactanos from "./Pages/Catalog/Contactanos.jsx"
import Tienda from "./Pages/Catalog/Tienda.jsx"
import Carrito from "./Pages/Catalog/Carrito.jsx"
import {ToastContainer} from "react-toastify"
import {useAuth, SignInButton} from '@clerk/clerk-react'
import {useEffect} from "react";
import Admin from "./Components/Control/Admin.jsx";
import Chatbot from "./Pages/Control/Chatbot.jsx";
import Pedidos from "./Pages/Control/Pedidos.jsx";
import Dashboard from "./Pages/Control/Dashboard.jsx";
import Productos from "./Pages/Control/Productos.jsx";
import Usuarios from "./Pages/Control/Usuarios.jsx";
import Cupones from "./Pages/Control/Cupones.jsx";
import Promociones from "./Pages/Control/Promociones.jsx";
import Proveedores from "@/Pages/Control/Proveedores.jsx";


function RutaProtegida({ children }) {
    const { isSignedIn, isLoaded } = useAuth()
    const { openSignIn } = useClerk()
    const navigate = useNavigate()

    useEffect(() => {
        if (!isLoaded || isSignedIn) return

        openSignIn({
            afterSignInUrl: window.location.href,
            afterSignUpUrl: window.location.href,
        })

        const timeout = setTimeout(() => {
            const interval = setInterval(() => {
                const modal = document.querySelector('.cl-modalBackdrop')
                if (!modal) {
                    clearInterval(interval)
                    navigate('/')
                }
            }, 200)
        }, 500)

        return () => clearTimeout(timeout)
    }, [isLoaded, isSignedIn])

    if (!isLoaded) return <Index/>
    if (!isSignedIn) return <Index/>

    return children
}


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Index/>}/>
                <Route path="/nosotros" element={
                    <Nosotros/>
                }/>
                <Route path="/metodos" element={<Metodos/>}/>
                <Route path="/reclamaciones" element={<Reclamaciones/>}/>
                <Route path="/contactanos" element={<Contactanos/>}/>
                <Route path="/tienda" element={<Tienda/>}/>
                <Route path="/sso-callback" element={<AuthenticateWithRedirectCallback/>}/>
                <Route path="/carrito" element={
                    <RutaProtegida>
                        <Carrito/>
                    </RutaProtegida>
                }/>
                //Admin
                <Route path="/admin" element={<Admin/>}>
                    <Route index element={<Dashboard/>}/>
                    <Route path="productos" element={<Productos/>}/>
                    <Route path="pedidos" element={<Pedidos/>}/>
                    <Route path="usuarios" element={<Usuarios/>}/>
                    <Route path="cupones" element={<Cupones/>}/>
                    <Route path="promociones" element={<Promociones/>}/>
                    <Route path="chatbot" element={<Chatbot/>}/>
                     <Route path="proveedores" element={<Proveedores/>}/>
                </Route>
            </Routes>
            <ToastContainer
                position="bottom-left"
                autoClose={5000}
                icon={false}
                hideProgressBar={false}
                toastClassName="toast-quicksand"
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
        </Router>
    )
}

export default App