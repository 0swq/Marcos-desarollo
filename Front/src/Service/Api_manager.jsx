import {useApi} from "@/Service/Api_model.jsx";

export function Api_manager() {
    const api = useApi()

    const usuarios = {
        listar: () => api.get("/usuario/listar"),
        listar_activos: () => api.get("/usuario/listar/activos"),
        buscar: (busqueda) => api.get(`/usuario/buscar?busqueda=${encodeURIComponent(busqueda)}`),
        obtener_perfil: () => api.get("/usuario/perfil_privado"),
        actualizar: (usuario_id, datos) => api.patch(`/usuario/${usuario_id}`, datos),
        cambiar_rol: (usuario_id) => api.patch(`/usuario/${usuario_id}/rol`),
        cambiar_nivel: (usuario_id, nivel, valido_hasta) => api.patch(`/usuario/${usuario_id}/nivel`, {
            nivel,
            valido_hasta
        }),
        activar: (usuario_id) => api.patch(`/usuario/${usuario_id}/activar`),
        desactivar: (usuario_id) => api.patch(`/usuario/${usuario_id}/desactivar`),

    }

    const productos = {
        listar_publicos: () => api.get("/producto/"),
        listar_todos: () => api.get("/producto/todos"),
        obtener: (producto_base_id) => api.get(`/producto/${producto_base_id}`),
        crear: (datos) => api.post("/producto/", datos),
        actualizar: (producto_base_id, datos) => api.patch(`/producto/${producto_base_id}`, datos),
        cambiar_estado: (producto_base_id) => api.patch(`/producto/${producto_base_id}/estado`),

        agregar_variante: (datos) => api.post(`/producto/${datos.producto_base_id}/variantes`, datos),
        obtener_variante: (variante_id) => api.get(`/producto/variantes/${variante_id}`),
        actualizar_variante: (variante_id, datos) => api.patch(`/producto/variantes/${variante_id}`, datos),
        cambiar_estado_variante: (variante_id) => api.patch(`/producto/variantes/${variante_id}/estado`),

        agregar_atributo: (datos) => api.post(`/producto/variantes/${datos.variante_id}/atributos`, datos),
        actualizar_atributo: (variante_id, tipo_atributo_id, datos) => api.patch(`/producto/variantes/${variante_id}/atributos/${tipo_atributo_id}`, datos),
        eliminar_atributo: (variante_id, tipo_atributo_id) => api.delete(`/producto/variantes/${variante_id}/atributos/${tipo_atributo_id}`),

        listar_tipos_atributo: () => api.get("/producto/tipo-atributo/"),
        obtener_tipo_atributo: (tipo_atributo_id) => api.get(`/producto/tipo-atributo/${tipo_atributo_id}`),
        crear_tipo_atributo: (datos) => api.post(`/producto/tipo-atributo/?nombre=${encodeURIComponent(datos.nombre)}`),
        actualizar_tipo_atributo: (tipo_atributo_id, datos) => api.patch(`/producto/tipo-atributo/${tipo_atributo_id}?nombre=${encodeURIComponent(datos.nombre)}`),
        solicitar_codigo_stock: () => api.post("/producto/stock/solicitarCodigo"),
        actualizar_stock_variante: (variante_id, cantidad, codigo) => api.patch(`/producto/variantes/${variante_id}/stock`, {
            cantidad,
            codigo
        }),
        obtener_foto: (producto_base_id) => `${import.meta.env.VITE_API_URL}/producto/${producto_base_id}/foto`,
        actualizar_foto: (producto_base_id, foto) => {
            const form = new FormData()
            form.append("foto", foto)
            return api.upload(`/producto/${producto_base_id}/foto`, form)
        },

        obtener_foto_variante: (variante_id) => `${import.meta.env.VITE_API_URL}/producto/variantes/${variante_id}/foto`,
        actualizar_foto_variante: (variante_id, foto) => {
            const form = new FormData()
            form.append("foto", foto)
            return api.upload(`/producto/variantes/${variante_id}/foto`, form)
        },

    }

    const categorias = {
        registrar_padre: (nombre) => api.post(`/categoria/padre?nombre=${encodeURIComponent(nombre)}`),
        registrar_hijo: (nombre, padre_id) => api.post(`/categoria/hijo?nombre=${encodeURIComponent(nombre)}&padre_id=${padre_id}`),
        obtener: (categoria_id) => api.get(`/categoria/${categoria_id}`),
        listar_padres: () => api.get("/categoria/"),
        listar_hijos: (padre_id) => api.get(`/categoria/${padre_id}/hijos`),
        actualizar: (categoria_id, nombre = null, padre = null) => api.patch(`/categoria/${categoria_id}?${nombre ? `nombre=${encodeURIComponent(nombre)}` : ''}&${padre ? `padre=${padre}` : ''}`),
        cambiar_estado: (categoria_id) => api.patch(`/categoria/${categoria_id}/estado`),
    }

    const chat = {
        stream: (prompt, historial, abortSignal) =>
            api.stream("/chat/stream", {prompt, historial}, abortSignal),
    }

    const replicas = {
        replicar: (producto_base_id, imagen) => {
            const form = new FormData()
            form.append("producto_base_id", producto_base_id)
            form.append("imagen", imagen)
            console.log("producto_base_id:", producto_base_id)
            console.log("imagen:", imagen, typeof imagen)
            return api.upload("/replicador/replicar", form, 'POST', true)
        },
        estado: (replica_id) => api.get(`/replicador/estado/${replica_id}`),
        historial: (pagina = 1, por_pagina = 12) =>
            api.get(`/replicador/historial?pagina=${pagina}&por_pagina=${por_pagina}`),
    }
    const carrito = {
        obtener_activo: () => api.get("/carrito/activo"),
        crear: () => api.post("/carrito/"),
        completar: (carrito_id) => api.patch(`/carrito/${carrito_id}/completar`),
        abandonar: (carrito_id) => api.patch(`/carrito/${carrito_id}/abandonar`),
        eliminar: (carrito_id) => api.delete(`/carrito/${carrito_id}`),

        items: {
            agregar: (variante_id, cantidad = 1) =>
                api.post("/carrito/items/", { variante_id, cantidad }),
            listar: () => api.get("/carrito/items/"),
            actualizar: (item_id, cantidad) =>
                api.patch(`/carrito/items/${item_id}`, { cantidad }),
            eliminar: (item_id) => api.delete(`/carrito/items/${item_id}`),
        },
    }

    const pedidos = {
        crear: (tipo_entrega = "RECOJO") =>
            api.post("/pedido/crear", { tipo_entrega }),
        listar: () => api.get("/pedido/"),
        obtener: (pedido_id) => api.get(`/pedido/${pedido_id}`),
    }

    const pagos = {
        crear: (pedido_id, metodo = "tarjeta") =>
            api.post("/pago/crear", { pedido_id, metodo }),
        obtener: (pago_id) => api.get(`/pago/${pago_id}`),
    }

    return {usuarios, productos, categorias, chat, replicas, carrito, pedidos, pagos}
}