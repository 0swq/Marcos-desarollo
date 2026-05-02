import {useState} from 'react'

const ITEMS_INICIALES = [
    {
        id: 1,
        nombre: 'Melamina Blanca 18mm',
        categoria: 'Melaminas',
        precio_venta: 85.00,
        cantidad: 2,
        unidad_medida: 'planchas'
    },
    {
        id: 5,
        nombre: 'Bisagra Clip 35mm Blum',
        categoria: 'Herramientas',
        precio_venta: 4.50,
        cantidad: 10,
        unidad_medida: 'unidades'
    },
    {
        id: 8,
        nombre: 'Cola Sintetica 1/4',
        categoria: 'Pegamentos',
        precio_venta: 12.00,
        cantidad: 3,
        unidad_medida: 'unidades'
    },
]

function CarritoVacio() {
    return (
        <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
            <div className="relative mb-8">
                <div className="w-32 h-32 rounded-full bg-[#e3f2fd] flex items-center justify-center">
                    <i className="fas fa-shopping-cart text-5xl text-[#3498db]"></i>
                </div>
                <div
                    className="absolute -top-1 -right-1 w-10 h-10 rounded-full bg-[#3498db] flex items-center justify-center shadow-lg">
                    <text className="text-white font-black text-sm leading-none">:(</text>
                </div>
            </div>
            <h2 className="text-2xl font-black text-[#2c3e50] mb-3 tracking-tight">
                Tu carrito está vacío
            </h2>
            <p className="text-[#7f8c8d] text-sm max-w-xs mb-8 leading-relaxed">
                Aún no has agregado productos. Explora la tienda virtual y encuentra lo que necesitas.
            </p>
            <a href="/tienda" className="inline-flex items-center gap-2 px-7 py-3 bg-[#3498db] text-white font-bold rounded-lg hover:bg-[#2980b9] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg shadow-[0_4px_15px_rgba(52,152,219,0.3)]">
                <i className="fas fa-store"></i> <text className="text-sm" >Ir a la tienda</text>
            </a>
        </div>
    )
}

function ItemCarrito({item, onCantidad, onEliminar}) {
    const subtotal = item.precio_venta * item.cantidad

    return (
        <div
            className="group flex gap-4 sm:gap-6 bg-white rounded-2xl p-4 sm:p-5 border border-[#eee] hover:border-[#3498db] hover:shadow-[0_8px_24px_rgba(52,152,219,0.1)] transition-all duration-300">

            <div
                className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-xl bg-[#f8f9fa] flex items-center justify-center overflow-hidden border border-[#f0f0f0]">
                Imagen del producto
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-between gap-3">
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
            <span
                className="text-[10px] uppercase tracking-widest text-[#3498db] font-bold bg-[#e3f2fd] px-2 py-0.5 rounded-full">
              {item.categoria}
            </span>
                        <h3 className="text-[15px] font-bold text-[#2c3e50] mt-1.5 leading-snug line-clamp-2">
                            {item.nombre}
                        </h3>
                        <p className="text-[13px] text-[#3498db] font-semibold mt-0.5">
                            S/ {item.precio_venta.toFixed(2)} / {item.unidad_medida}
                        </p>
                    </div>

                    <button
                        onClick={() => onEliminar(item.id)}
                        className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[#ccc] hover:text-[#e74c3c] hover:bg-[#fdf0f0] transition-all duration-200"
                        title="Eliminar"
                    >
                        <i className="fas fa-times text-sm"></i>
                    </button>
                </div>

                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-0 border border-[#e0e0e0] rounded-lg overflow-hidden">
                        <button
                            onClick={() => onCantidad(item.id, item.cantidad - 1)}
                            disabled={item.cantidad <= 1}
                            className="w-8 h-8 flex items-center justify-center text-[#555] hover:bg-[#f0f7ff] hover:text-[#3498db] disabled:text-[#ccc] disabled:cursor-not-allowed transition-colors font-bold text-base"
                        >
                            −
                        </button>
                        <span
                            className="w-10 text-center text-sm font-bold text-[#2c3e50] border-x border-[#e0e0e0] h-8 flex items-center justify-center">
              {item.cantidad}
            </span>
                        <button
                            onClick={() => onCantidad(item.id, item.cantidad + 1)}
                            className="w-8 h-8 flex items-center justify-center text-[#555] hover:bg-[#f0f7ff] hover:text-[#3498db] transition-colors font-bold text-base"
                        >
                            +
                        </button>
                    </div>

                    <div className="text-right">
                        <p className="text-[11px] text-[#999] uppercase tracking-wide">Subtotal</p>
                        <p className="text-[17px] font-black text-[#2c3e50]">
                            S/ {subtotal.toFixed(2)}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

function ResumenPedido({items, onVaciar}) {
    const subtotal = items.reduce((acc, i) => acc + i.precio_venta * i.cantidad, 0)
    const totalItems = items.reduce((acc, i) => acc + i.cantidad, 0)

    return (
        <div
            className="bg-white rounded-2xl border border-[#eee] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.06)] sticky top-[100px]">

            <div className="bg-[#3498db] px-6 py-4">
                <h2 className="text-white font-black  tracking-tight flex items-center gap-2">
                    Resumen
                </h2>
            </div>

            <div className="p-6 space-y-4">
                <div className="space-y-3">
                    {items.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm text-[#555]">
                            <span>
                                {item.nombre}
                                <span className="text-[#7f8c8d]">×{item.cantidad}</span>
                            </span>
                            <span className="text-[#7f8c8d]">
                                S/ {(item.precio_venta * item.cantidad).toFixed(2)}
                            </span>
                        </div>
                    ))}
                </div>
                <div className="border-t border-dashed border-[#e0e0e0] pt-4">
                    <div className="flex justify-between text-sm text-[#7f8c8d] mb-1">
                        <span>Productos ({totalItems} {totalItems === 1 ? 'unidad' : 'unidades'})</span>
                        <span>S/ {subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-[#27ae60] font-semibold">
                        <span className="flex items-center gap-1">
                           Envío
                        </span>
                        <span>Indefinido</span>
                    </div>
                </div>
                <div
                    className="bg-[#f0f7ff] rounded-xl px-4 py-3 flex justify-between items-center border border-[#d1ecff]">
                    <span className="font-black text-[#2c3e50] text-base uppercase tracking-wide">Total</span>
                    <span className="font-black text-[#3498db] text-2xl">S/ {subtotal.toFixed(2)}</span>
                </div>

                <a

                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-[#111111] text-white font-black text-sm "
                >
                   Confirmar la compra
                </a>

                <button
                    onClick={onVaciar}
                    className="w-full py-2.5 text-sm text-[#e74c3c] font-semibold hover:bg-[#fdf0f0] rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                >
                    <i className="fas fa-trash-alt text-xs"></i> Vaciar carrito
                </button>

                <a
                    href="/tienda"
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border-2 border-[#3498db] text-[#3498db] font-bold text-sm hover:bg-[#3498db] hover:text-white transition-all duration-300"
                >
                    <i className="fas fa-arrow-left text-xs"></i> Seguir comprando
                </a>
            </div>
        </div>
    )
}

export default function CarritoRest() {
    const [items, setItems] = useState(ITEMS_INICIALES)

    const handleCantidad = (id, nuevaCantidad) => {
        if (nuevaCantidad < 1) return
        setItems((prev) => prev.map((i) => i.id === id ? {...i, cantidad: nuevaCantidad} : i))
    }

    const handleEliminar = (id) => {
        setItems((prev) => prev.filter((i) => i.id !== id))
    }

    const handleVaciar = () => setItems([])

    const totalItems = items.reduce((acc, i) => acc + i.cantidad, 0)

    return (
        <main className="w-[90%] max-w-[1200px] mx-auto py-10 pb-24">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl text-[#2c3e50] tracking-tight leading-none">
                        Mi Carrito
                    </h1>
                    {items.length > 0 && (
                        <p className="text-[#7f8c8d] text-sm mt-1">
                            {totalItems} {totalItems === 1 ? 'producto' : 'productos'} en tu carrito
                        </p>
                    )}
                </div>
                {items.length > 0}
            </div>
            {items.length === 0 ? (
                <CarritoVacio/>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">

                    <div className="flex flex-col gap-4">
                        {items.map((item) => (
                            <ItemCarrito
                                key={item.id}
                                item={item}
                                onCantidad={handleCantidad}
                                onEliminar={handleEliminar}
                            />
                        ))}
                    </div>

                    <ResumenPedido items={items} onVaciar={handleVaciar}/>
                </div>
            )}
        </main>
    )
}