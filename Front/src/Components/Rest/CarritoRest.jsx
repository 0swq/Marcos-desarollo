import {useEffect, useState} from 'react'
import {Api_manager} from "@/Service/Api_manager.jsx"

const PASOS = ['Entrega', 'Pago', 'Confirmacion']

function Stepper({paso}) {
    return (
        <div style={{display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 32}}>
            {PASOS.map((label, i) => (
                <div key={label} style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '8px 18px', borderRadius: 99,
                    background: i <= paso ? '#185FA5' : '#e5e7eb',
                    color: i <= paso ? '#fff' : '#9ca3af',
                    fontWeight: i === paso ? 700 : 500,
                    fontSize: 13,
                    transition: 'all 0.2s',
                }}>
                    <span style={{
                        width: 22, height: 22, borderRadius: '50%',
                        background: i <= paso ? 'rgba(255,255,255,0.25)' : '#d1d5db',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 12, fontWeight: 700,
                    }}>{i < paso ? 'OK' : i + 1}</span>
                    {label}
                </div>
            ))}
        </div>
    )
}

function PasoEntrega({tipoEntrega, setTipoEntrega, onSiguiente}) {
    return (
        <div style={{maxWidth: 480, margin: '0 auto'}}>
            <h2 style={{fontSize: 20, fontWeight: 700, color: '#2c3e50', marginBottom: 20}}>
                Como queres recibir tu pedido?
            </h2>

            <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
                <button
                    onClick={() => setTipoEntrega('RECOJO')}
                    style={{
                        padding: 20, borderRadius: 12,
                        border: tipoEntrega === 'RECOJO' ? '2px solid #185FA5' : '2px solid #e5e7eb',
                        background: tipoEntrega === 'RECOJO' ? '#f0f7ff' : '#fff',
                        textAlign: 'left', cursor: 'pointer',
                    }}>
                    <div style={{fontWeight: 700, fontSize: 16, color: '#2c3e50'}}>Recojo en tienda</div>
                    <div style={{fontSize: 13, color: '#7f8c8d', marginTop: 4}}>
                        Retiras tu pedido en nuestra tienda de Chimbote sin costo adicional.
                    </div>
                </button>

                <button
                    onClick={() => setTipoEntrega('DELIVERY')}
                    style={{
                        padding: 20, borderRadius: 12,
                        border: tipoEntrega === 'DELIVERY' ? '2px solid #185FA5' : '2px solid #e5e7eb',
                        background: tipoEntrega === 'DELIVERY' ? '#f0f7ff' : '#fff',
                        textAlign: 'left', cursor: 'pointer',
                    }}>
                    <div style={{fontWeight: 700, fontSize: 16, color: '#2c3e50'}}>Delivery a domicilio</div>
                    <div style={{fontSize: 13, color: '#7f8c8d', marginTop: 4}}>
                        Te lo llevamos. Costo de envio por definir segun zona.
                    </div>
                </button>
            </div>

            {tipoEntrega === 'DELIVERY' && (
                <div style={{
                    marginTop: 20, padding: 16, borderRadius: 12,
                    background: '#f3f4f6', border: '1px solid #e5e7eb',
                    fontSize: 13, color: '#6b7280',
                }}>
                    Esta parte le toca a Dalia por lo que no hay direcciones que seleccionar porque se pasara directamente al metodo de pago
                </div>
            )}

            <button
                onClick={onSiguiente}
                style={{
                    marginTop: 24, width: '100%', padding: 14, borderRadius: 10,
                    background: '#185FA5', color: '#fff', fontWeight: 700, fontSize: 15,
                    border: 'none', cursor: 'pointer',
                }}>
                Continuar al pago
            </button>
        </div>
    )
}

function PasoPago({onSiguiente, onAtras, errorMsg}) {
    return (
        <div style={{maxWidth: 520, margin: '0 auto'}}>
            <h2 style={{fontSize: 20, fontWeight: 700, color: '#2c3e50', marginBottom: 8}}>
                Datos de pago
            </h2>

            <div style={{
                padding: 20, borderRadius: 10, marginBottom: 24,
                background: '#fef3c7', border: '1px solid #fcd34d',
                fontSize: 14, color: '#92400e', lineHeight: 1.8,
            }}>
                Quise implementar aqui una pasarela pero una pedia foto y la otra tenia muchas trabas con respecto a llamar a soporte para que te den cuenta de desarollador y asi
            </div>

            {errorMsg && (
                <div style={{
                    padding: 12, borderRadius: 8, marginBottom: 16,
                    background: '#fee2e2', border: '1px solid #fecaca',
                    fontSize: 13, color: '#dc2626',
                }}>
                    {errorMsg}
                </div>
            )}

            <div style={{display: 'flex', gap: 12}}>
                <button
                    onClick={onAtras}
                    style={{
                        flex: 1, padding: 14, borderRadius: 10,
                        background: '#f3f4f6', color: '#374151', fontWeight: 600, fontSize: 14,
                        border: '1px solid #e5e7eb', cursor: 'pointer',
                    }}>
                    Atras
                </button>
                <button
                    onClick={onSiguiente}
                    style={{
                        flex: 2, padding: 14, borderRadius: 10,
                        background: '#185FA5', color: '#fff', fontWeight: 700, fontSize: 15,
                        border: 'none', cursor: 'pointer',
                    }}>
                    Finalizar compra
                </button>
            </div>
        </div>
    )
}

function PasoConfirmacion({tipoEntrega}) {
    return (
        <div style={{maxWidth: 480, margin: '0 auto', textAlign: 'center'}}>
            <div style={{
                width: 80, height: 80, borderRadius: '50%', background: '#d1fae5',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px', fontSize: 36,
            }}>
                OK
            </div>
            <h2 style={{fontSize: 22, fontWeight: 700, color: '#2c3e50', marginBottom: 8}}>
                Pedido confirmado!
            </h2>
            <p style={{fontSize: 14, color: '#7f8c8d', lineHeight: 1.7, marginBottom: 8}}>
                {tipoEntrega === 'RECOJO'
                    ? 'Tu pedido estara listo para recoger en nuestra tienda de Chimbote. Te enviaremos un correo cuando este disponible.'
                    : 'Tu pedido sera enviado a tu domicilio. Te enviaremos un correo con los detalles del envio.'}
            </p>
            <p style={{fontSize: 13, color: '#185FA5', fontWeight: 600}}>
                Se ha enviado la factura a tu correo electronico.
            </p>
            <a
                href="/tienda"
                style={{
                    display: 'inline-block', marginTop: 24, padding: '12px 32px', borderRadius: 10,
                    background: '#185FA5', color: '#fff', fontWeight: 700, fontSize: 15,
                    textDecoration: 'none',
                }}>
                Seguir comprando
            </a>
        </div>
    )
}

// ═══ Componentes del carrito ═══
function CarritoVacio() {
    return (
        <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
            <div className="relative mb-8">
                <div className="w-32 h-32 rounded-full bg-[#e3f2fd] flex items-center justify-center">
                    <i className="fas fa-shopping-cart text-5xl text-[#3498db]"></i>
                </div>
                <div className="absolute -top-1 -right-1 w-10 h-10 rounded-full bg-[#3498db] flex items-center justify-center shadow-lg">
                    <span className="text-white font-black text-sm leading-none">:(</span>
                </div>
            </div>
            <h2 className="text-2xl font-black text-[#2c3e50] mb-3 tracking-tight">Tu carrito esta vacio</h2>
            <p className="text-[#7f8c8d] text-sm max-w-xs mb-8 leading-relaxed">
                Aun no has agregado productos. Explora la tienda virtual y encuentra lo que necesitas.
            </p>
            <a href="/tienda"
               className="inline-flex items-center gap-2 px-7 py-3 bg-[#3498db] text-white font-bold rounded-lg hover:bg-[#2980b9] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg shadow-[0_4px_15px_rgba(52,152,219,0.3)]">
                <i className="fas fa-store"></i> <span className="text-sm">Ir a la tienda</span>
            </a>
        </div>
    )
}

function ItemCarrito({item, onCantidad, onEliminar}) {
    const subtotal = item.precio_venta * item.cantidad
    return (
        <div className="group flex gap-4 sm:gap-6 bg-white rounded-2xl p-4 sm:p-5 border border-[#eee] hover:border-[#3498db] hover:shadow-[0_8px_24px_rgba(52,152,219,0.1)] transition-all duration-300">
            <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-xl bg-[#f8f9fa] flex items-center justify-center overflow-hidden border border-[#f0f0f0]">
                {item.producto_base_id ? (
                    <img src={`${import.meta.env.VITE_API_URL}/producto/${item.producto_base_id}/foto`}
                         alt={item.nombre} className="w-full h-full object-cover"
                         onError={(e) => { e.target.style.display = 'none' }}/>
                ) : (
                    <i className="fas fa-image text-3xl text-[#ccc]"></i>
                )}
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-between gap-3">
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                        <span className="text-[10px] uppercase tracking-widest text-[#3498db] font-bold bg-[#e3f2fd] px-2 py-0.5 rounded-full">
                            {item.categoria}
                        </span>
                        <h3 className="text-[15px] font-bold text-[#2c3e50] mt-1.5 leading-snug line-clamp-2">{item.nombre}</h3>
                        <p className="text-[13px] text-[#3498db] font-semibold mt-0.5">
                            S/ {item.precio_venta.toFixed(2)} / unidad
                        </p>
                        {item.sku && <p className="text-[11px] text-[#999] mt-0.5">SKU: {item.sku}</p>}
                        {item.atributos && <p className="text-[11px] text-[#999]">{item.atributos}</p>}
                    </div>
                    <button onClick={() => onEliminar(item.id)}
                            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[#ccc] hover:text-[#e74c3c] hover:bg-[#fdf0f0] transition-all duration-200"
                            title="Eliminar">
                        <i className="fas fa-times text-sm"></i>
                    </button>
                </div>
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-0 border border-[#e0e0e0] rounded-lg overflow-hidden">
                        <button onClick={() => onCantidad(item.id, item.cantidad - 1)} disabled={item.cantidad <= 1}
                                className="w-8 h-8 flex items-center justify-center text-[#555] hover:bg-[#f0f7ff] hover:text-[#3498db] disabled:text-[#ccc] disabled:cursor-not-allowed transition-colors font-bold text-base">-</button>
                        <span className="w-10 text-center text-sm font-bold text-[#2c3e50] border-x border-[#e0e0e0] h-8 flex items-center justify-center">{item.cantidad}</span>
                        <button onClick={() => onCantidad(item.id, item.cantidad + 1)}
                                className="w-8 h-8 flex items-center justify-center text-[#555] hover:bg-[#f0f7ff] hover:text-[#3498db] transition-colors font-bold text-base">+</button>
                    </div>
                    <div className="text-right">
                        <p className="text-[11px] text-[#999] uppercase tracking-wide">Subtotal</p>
                        <p className="text-[17px] font-black text-[#2c3e50]">S/ {subtotal.toFixed(2)}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

function ResumenPedido({items, onVaciar, onCheckout}) {
    const subtotal = items.reduce((acc, i) => acc + i.precio_venta * i.cantidad, 0)
    const totalItems = items.reduce((acc, i) => acc + i.cantidad, 0)
    return (
        <div className="bg-white rounded-2xl border border-[#eee] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.06)] sticky top-[100px]">
            <div className="bg-[#3498db] px-6 py-4">
                <h2 className="text-white font-black tracking-tight flex items-center gap-2">Resumen</h2>
            </div>
            <div className="p-6 space-y-4">
                <div className="space-y-3">
                    {items.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm text-[#555]">
                            <span>{item.nombre}<span className="text-[#7f8c8d]"> x{item.cantidad}</span></span>
                            <span className="text-[#7f8c8d]">S/ {(item.precio_venta * item.cantidad).toFixed(2)}</span>
                        </div>
                    ))}
                </div>
                <div className="border-t border-dashed border-[#e0e0e0] pt-4">
                    <div className="flex justify-between text-sm text-[#7f8c8d] mb-1">
                        <span>Productos ({totalItems} {totalItems === 1 ? 'unidad' : 'unidades'})</span>
                        <span>S/ {subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-[#27ae60] font-semibold">
                        <span>Envio</span>
                        <span>Indefinido</span>
                    </div>
                </div>
                <div className="bg-[#f0f7ff] rounded-xl px-4 py-3 flex justify-between items-center border border-[#d1ecff]">
                    <span className="font-black text-[#2c3e50] text-base uppercase tracking-wide">Total</span>
                    <span className="font-black text-[#3498db] text-2xl">S/ {subtotal.toFixed(2)}</span>
                </div>
                <button onClick={onCheckout}
                        className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-[#111111] text-white font-black text-sm hover:bg-[#333] transition-colors">
                    Continuar con la compra
                </button>
                <button onClick={onVaciar}
                        className="w-full py-2.5 text-sm text-[#e74c3c] font-semibold hover:bg-[#fdf0f0] rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
                    <i className="fas fa-trash-alt text-xs"></i> Vaciar carrito
                </button>
                <a href="/tienda"
                   className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border-2 border-[#3498db] text-[#3498db] font-bold text-sm hover:bg-[#3498db] hover:text-white transition-all duration-300">
                    <i className="fas fa-arrow-left text-xs"></i> Seguir comprando
                </a>
            </div>
        </div>
    )
}

// ═══ Main ═══
export default function CarritoRest() {
    const api = Api_manager()
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [checkout, setCheckout] = useState(false)
    const [paso, setPaso] = useState(0)
    const [tipoEntrega, setTipoEntrega] = useState('RECOJO')

    const cargarItems = async () => {
        setLoading(true)
        try {
            const data = await api.carrito.items.listar()
            setItems(data.map(it => ({
                id: it.id,
                variante_id: it.variante,
                producto_base_id: it.producto_base?.id,
                nombre: it.producto_base?.nombre ?? 'Producto',
                sku: it.variante_obj?.sku ?? '',
                atributos: (it.variante_obj?.atributos ?? []).map(a =>
                    `${a.tipo_atributo?.nombre ?? ''}: ${a.valor}`
                ).join(' | '),
                categoria: it.producto_base?.categoria_nombre ?? 'General',
                precio_venta: Number(it.precio_unitario),
                cantidad: it.cantidad,
            })))
        } catch (err) {
            console.error("Error cargando carrito:", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { cargarItems() }, [])

    const handleCantidad = async (id, nuevaCantidad) => {
        if (nuevaCantidad < 1) return handleEliminar(id)
        try {
            await api.carrito.items.actualizar(id, nuevaCantidad)
            await cargarItems()
        } catch (err) {
            console.error("Error actualizando cantidad:", err)
        }
    }

    const handleEliminar = async (id) => {
        try {
            await api.carrito.items.eliminar(id)
            await cargarItems()
        } catch (err) {
            console.error("Error eliminando item:", err)
        }
    }

    const handleVaciar = async () => {
        for (const item of items) {
            try { await api.carrito.items.eliminar(item.id) } catch (e) {}
        }
        setItems([])
    }

    const [errorMsg, setErrorMsg] = useState('')

    const handleFinalizar = async () => {
        setErrorMsg('')
        try {
            const pedido = await api.pedidos.crear(tipoEntrega)
            await api.pagos.crear(pedido.id, "tarjeta")
            setPaso(2)
        } catch (err) {
            setErrorMsg(err.message || 'Error al procesar')
        }
    }

    const totalItems = items.reduce((acc, i) => acc + i.cantidad, 0)

    if (!checkout) {
        return (
            <main className="w-[90%] max-w-[1200px] mx-auto py-10 pb-24">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl text-[#2c3e50] tracking-tight leading-none">Mi Carrito</h1>
                        {items.length > 0 && (
                            <p className="text-[#7f8c8d] text-sm mt-1">
                                {totalItems} {totalItems === 1 ? 'producto' : 'productos'} en tu carrito
                            </p>
                        )}
                    </div>
                </div>
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-10 h-10 border-4 border-[#3498db] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : items.length === 0 ? (
                    <CarritoVacio/>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
                        <div className="flex flex-col gap-4">
                            {items.map((item) => (
                                <ItemCarrito key={item.id} item={item}
                                             onCantidad={handleCantidad}
                                             onEliminar={handleEliminar}/>
                            ))}
                        </div>
                        <ResumenPedido items={items} onVaciar={handleVaciar}
                                       onCheckout={() => setCheckout(true)}/>
                    </div>
                )}
            </main>
        )
    }

    return (
        <main className="w-[90%] max-w-[800px] mx-auto py-10 pb-24">
            <Stepper paso={paso}/>

            {paso === 0 && (
                <PasoEntrega tipoEntrega={tipoEntrega} setTipoEntrega={setTipoEntrega}
                             onSiguiente={() => setPaso(1)}/>
            )}

            {paso === 1 && (
                <PasoPago onSiguiente={handleFinalizar} onAtras={() => setPaso(0)} errorMsg={errorMsg}/>
            )}

            {paso === 2 && (
                <PasoConfirmacion tipoEntrega={tipoEntrega}/>
            )}
        </main>
    )
}
