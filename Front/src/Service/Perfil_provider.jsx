// Perfil_provider.jsx
import { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "@clerk/clerk-react"

const PerfilContext = createContext(null)
const BASE_URL = import.meta.env.VITE_API_URL

export function PerfilProvider({ children }) {
    const { isSignedIn, getToken } = useAuth()
    const [perfil, setPerfil] = useState(null)

    useEffect(() => {
        if (!isSignedIn) return
        getToken().then(token =>
            fetch(`${BASE_URL}/usuario/perfil_privado`, {
                headers: { Authorization: `Bearer ${token}` }
            }).then(r => r.json()).then(setPerfil)
        ).catch(console.error)
    }, [isSignedIn])

    return (
        <PerfilContext.Provider value={perfil}>
            {children}
        </PerfilContext.Provider>
    )
}

export function usePerfil() {
    return useContext(PerfilContext)
}