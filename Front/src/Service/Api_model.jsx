import {useNavigate} from "react-router-dom";
import {useAuth, useClerk} from "@clerk/clerk-react";
import {noti_util} from "@/Utils/Toast.jsx";

export function useApi() {
    const {getToken} = useAuth()
    const navigate = useNavigate()
    const {signOut} = useClerk()
    const BASE_URL = import.meta.env.VITE_API_URL

    const request = async (url, options = {}) => {
        const token = await getToken()
        const method = options.method ?? 'GET'
        const res = await fetch(`${BASE_URL}${url}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                ...options.headers,
            }
        })

        if (res.status === 401) {
            noti_util('error', 'Sesión expirada, inicia sesión nuevamente...')
            signOut()
            navigate('/')
            throw new Error('No autenticado')
        }

        if (res.status === 403) {
            noti_util('advertencia', 'No deberías estar aquí, redirigiendo...')
            navigate('/')
            throw new Error('Sin permisos')
        }

        if (!res.ok) {
            noti_util('error', 'Error en el servidor')
            throw new Error('Error en el servidor')
        } else if (method !== 'GET') {
        noti_util("exito", "Completado")
    }

        return res.json()
    }

    const stream = async function* (url, body, abortSignal) {
        const token = await getToken()
        const res = await fetch(`${BASE_URL}${url}`, {
            method: 'POST',
            signal: abortSignal,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        })

        if (res.status === 401) {
            noti_util('error', 'Sesión expirada, inicia sesión nuevamente...')
            signOut()
            navigate('/')
            throw new Error('No autenticado')
        }

        if (res.status === 403) {
            noti_util('advertencia', 'No deberías estar aquí, redirigiendo...')
            navigate('/')
            throw new Error('Sin permisos')
        }

        if (!res.ok) {
            noti_util('error', 'Error en el servidor')
            throw new Error('Error en el servidor')
        }

        const reader = res.body.getReader()
        const decoder = new TextDecoder()

        try {
            while (true) {
                const {done, value} = await reader.read()
                if (done) break
                yield decoder.decode(value, {stream: true})
            }
        } finally {
            reader.cancel()
        }
    }

    return {
        get: (url) => request(url),
        post: (url, body) => request(url, {method: 'POST', body: JSON.stringify(body)}),
        patch: (url, body) => request(url, {method: 'PATCH', body: JSON.stringify(body)}),
        put: (url, body) => request(url, {method: 'PUT', body: JSON.stringify(body)}),
        delete: (url) => request(url, {method: 'DELETE'}),
        stream: (url, body, abortSignal) => stream(url, body, abortSignal),
    }
}