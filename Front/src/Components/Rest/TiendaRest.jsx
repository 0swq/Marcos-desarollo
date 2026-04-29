import {useEffect, useRef, useState} from 'react'

const ITEMS_POR_PAGINA = 20

function EmptyState() {
    return (
        <div className="col-span-full flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-24 h-24 rounded-full bg-[#e3f2fd] flex items-center justify-center mb-6">
                <i className="fas fa-box-open text-4xl text-[#3498db]"></i>
            </div>
            <h3 className="text-xl font-bold text-[#2c3e50] mb-2">
                No hay productos disponibles
            </h3>
            <p className="text-[#7f8c8d] text-sm max-w-xs">
                En este momento no hay productos registrados. Vuelve pronto o contáctanos para más información.
            </p>
            <a
                href="https://wa.me/51923197032"
                target="_blank"
                rel="noreferrer"
                className="mt-6 flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#25D366] text-white font-semibold text-sm hover:bg-[#1ebe5d] transition-colors duration-300"
            >
                <i className="fab fa-whatsapp"></i> Consultar por WhatsApp
            </a>
        </div>
    )
}

function SkeletonCard() {
    return (
        <div className="bg-white border border-[#eee] rounded-xl overflow-hidden animate-pulse">
            <div className="h-52 bg-[#f0f0f0]"/>
            <div className="p-4 space-y-3">
                <div className="h-4 bg-[#e8e8e8] rounded w-3/4 mx-auto"/>
                <div className="h-3 bg-[#e8e8e8] rounded w-1/2 mx-auto"/>
                <div className="h-3 bg-[#e8e8e8] rounded w-full"/>
                <div className="h-9 bg-[#e8e8e8] rounded w-full mt-2"/>
            </div>
        </div>
    )
}

function ProductoModal({ producto, onClose }) {
    useEffect(() => {
        const esc = (e) => e.key === 'Escape' && onClose()
        window.addEventListener('keydown', esc)
        return () => window.removeEventListener('keydown', esc)
    }, [onClose])

    if (!producto) return null

    const agotado = producto.stock <= 0

    return (
        <div className=" fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] animate-fadeIn" onClick={onClose}>
            <div className="border-red-500 bg-white rounded-2xl shadow-2xl max-w-3xl w-[95%] max-h-[90vh] overflow-hidden flex flex-col sm:flex-row relative" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-3 right-3 w-8 h-8 bg-[#f0f0f0] hover:bg-[#e0e0e0] rounded-full flex items-center justify-center text-[#666] text-xl z-10 transition-colors">
                    &times;
                </button>
                <div className="sm:w-[55%] bg-[#fafafa] flex items-center justify-center p-8 relative min-h-[240px]">
                    <img src={producto.img} alt={producto.nombre} className="max-w-full max-h-64 object-contain" />
                    {agotado && <span className="absolute top-3 left-3 bg-[#999] text-white text-xs font-bold px-2 py-1 rounded">AGOTADO</span>}
                </div>
                <div className="flex-1 p-7 flex flex-col justify-center">
                    <span className="text-[11px] uppercase bg-[#f5f5f5] text-[#999] px-2 py-1 rounded-full inline-block w-fit mb-3">{producto.categoria}</span>
                    <h2 className="text-xl font-bold text-[#2c3e50] mb-4 leading-tight">{producto.nombre}</h2>

                    <div className="space-y-2 border-t border-[#f0f0f0] pt-4 mb-5">
                        <div className="flex justify-between text-sm">
                            <span className="font-semibold text-[#2c3e50]">Stock:</span>
                            <span className="text-[#666]">{producto.stock} {producto.unidad_medida}</span>
                        </div>
                        <div className="flex justify-between text-sm font-bold">
                            <span className="text-[#2c3e50]">Precio:</span>
                            <span className="text-[#3498db] text-base">S/ {Number(producto.precio_venta).toFixed(2)}</span>
                        </div>
                    </div>

                    {agotado ? (
                        <button disabled className="w-full py-2.5 rounded-lg bg-[#bdc3c7] text-white font-bold text-sm flex items-center justify-center gap-2 cursor-not-allowed">
                            <i className="fas fa-times" /> AGOTADO
                        </button>
                    ) : (
                        <button onClick={onClose} className="w-full py-2.5 rounded-lg border-2 border-[#3498db] text-[#3498db] font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#3498db] hover:text-white transition-all duration-300">
                            <i className="fas fa-shopping-cart" /> AGREGAR AL CARRITO
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default function TiendaRest() {
    const [productos, setProductos] = useState([])
    const [categorias, setcategorias] = useState([])
    const [categoriaActiva, setCategoriaActiva] = useState('')
    const [busqueda, setBusqueda] = useState('')
    const [paginaActual, setPaginaActual] = useState(1)
    const [totalPaginas, setTotalPaginas] = useState(1)
    const [cargando, setCargando] = useState(true)
    const [modalProducto, setModalProducto] = useState(null)
    const [sidebarAbierto, setSidebarAbierto] = useState(true)
    const [megaMenuGrupo, setMegaMenuGrupo] = useState(null)
    const animablesRef = useRef([])
    const megaMenuRef = useRef(null)
    const megaMenuTimeout = useRef(null)

    useEffect(() => {
        const controller = new AbortController()
        setCargando(true)

        const cargar = async () => {
            try {
                await new Promise((r) => setTimeout(r, 800))
                setProductos([
                    {
                        id: 1,
                        nombre: 'Melamina Blanca 18mm',
                        categoria: 'Melaminas',
                        stock: 50,
                        unidad_medida: 'planchas',
                        precio_venta: 85.00,
                        img: 'https://placehold.co/300x300?text=Melamina+Blanca'
                    },
                    {
                        id: 2,
                        nombre: 'Melamina Nogal Oscuro 15mm',
                        categoria: 'Melaminas',
                        stock: 30,
                        unidad_medida: 'planchas',
                        precio_venta: 92.50,
                        img: 'https://placehold.co/300x300?text=Melamina+Nogal'
                    },
                    {
                        id: 3,
                        nombre: 'Triplay Lupuna 4mm',
                        categoria: 'Maderas',
                        stock: 0,
                        unidad_medida: 'planchas',
                        precio_venta: 38.00,
                        img: 'https://placehold.co/300x300?text=Triplay+Lupuna'
                    },
                    {
                        id: 4,
                        nombre: 'MDF Standard 9mm',
                        categoria: 'Maderas',
                        stock: 20,
                        unidad_medida: 'planchas',
                        precio_venta: 55.00,
                        img: 'https://placehold.co/300x300?text=MDF+9mm'
                    },
                    {
                        id: 5,
                        nombre: 'Bisagra Clip 35mm Blum',
                        categoria: 'Herrajes',
                        stock: 200,
                        unidad_medida: 'unidades',
                        precio_venta: 4.50,
                        img: 'https://placehold.co/300x300?text=Bisagra+Blum'
                    },
                    {
                        id: 6,
                        nombre: 'Corredera Telescópica 45cm',
                        categoria: 'Herrajes',
                        stock: 80,
                        unidad_medida: 'pares',
                        precio_venta: 18.00,
                        img: 'https://placehold.co/300x300?text=Corredera'
                    },
                    {
                        id: 7,
                        nombre: 'Pegamento de Contacto 1L',
                        categoria: 'Pegamentos',
                        stock: 0,
                        unidad_medida: 'galones',
                        precio_venta: 28.00,
                        img: 'https://placehold.co/300x300?text=Pegamento'
                    },
                    {
                        id: 8,
                        nombre: 'Cola Sintetica 1/4',
                        categoria: 'Pegamentos',
                        stock: 60,
                        unidad_medida: 'unidades',
                        precio_venta: 12.00,
                        img: 'https://placehold.co/300x300?text=Cola+Sintetica'
                    },
                    {
                        id: 9,
                        nombre: 'Melamina Cerezo 18mm',
                        categoria: 'Melaminas',
                        stock: 15,
                        unidad_medida: 'planchas',
                        precio_venta: 95.00,
                        img: 'https://placehold.co/300x300?text=Melamina+Cerezo'
                    },
                    {
                        id: 10,
                        nombre: 'Jalador Aluminio 96mm',
                        categoria: 'Herrajes',
                        stock: 150,
                        unidad_medida: 'unidades',
                        precio_venta: 6.50,
                        img: 'https://placehold.co/300x300?text=Jalador'
                    },
                    {
                        id: 11,
                        nombre: 'Madera Cedro 2x4x10',
                        categoria: 'Maderas',
                        stock: 40,
                        unidad_medida: 'piezas',
                        precio_venta: 22.00,
                        img: 'https://placehold.co/300x300?text=Cedro'
                    },
                    {
                        id: 12,
                        nombre: 'Tapa Canto PVC Blanco 22mm',
                        categoria: 'Accesorios',
                        stock: 500,
                        unidad_medida: 'metros',
                        precio_venta: 1.20,
                        img: 'https://placehold.co/300x300?text=Tapa+Canto'
                    },
                ])
                setTotalPaginas(1)
                setcategorias([
                    {
                        grupo: 'Melaminas',
                        subs: ['Melamina Blanca', 'Melamina Nogal', 'Melamina Cerezo', 'Melamina Wengue', 'Melamina Roble']
                    },
                    {grupo: 'Maderas', subs: ['Triplay', 'MDF', 'Cedro', 'Caoba', 'Tornillo']},
                    {grupo: 'Herrajes', subs: ['Bisagras', 'Correderas', 'Jaladores', 'Cerraduras', 'Patas']},
                    {nombre: 'Pegamentos'},
                    {nombre: 'Accesorios'},
                ])
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error('Error cargando productos:', err)
                    setProductos([])
                }
            } finally {
                setCargando(false)
            }
        }

        cargar()
        return () => controller.abort()
    }, [paginaActual, busqueda, categoriaActiva])

    useEffect(() => {
        if (cargando) return
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('opacity-100', 'translate-y-0')
                        entry.target.classList.remove('opacity-0', 'translate-y-4')
                        observer.unobserve(entry.target)
                    }
                })
            },
            {threshold: 0.1, rootMargin: '0px 0px -60px 0px'}
        )
        animablesRef.current.forEach((el) => el && observer.observe(el))
        return () => observer.disconnect()
    }, [cargando, productos])

    const addRef = (el) => {
        if (el && !animablesRef.current.includes(el)) animablesRef.current.push(el)
    }

    const handleBusqueda = (e) => {
        e.preventDefault()
        setPaginaActual(1)
    }

    const handleCategoria = (cat) => {
        setCategoriaActiva(cat)
        setPaginaActual(1)
        setMegaMenuGrupo(null)
    }

    const onGrupoEnter = (grupo, e) => {
        clearTimeout(megaMenuTimeout.current)
        setMegaMenuGrupo(grupo)
        if (megaMenuRef.current) {
            const rect = e.currentTarget.getBoundingClientRect()
            megaMenuRef.current.style.top = `${rect.top}px`
            megaMenuRef.current.style.left = `${rect.right + 4}px`
        }
    }

    const onGrupoLeave = () => {
        megaMenuTimeout.current = setTimeout(() => setMegaMenuGrupo(null), 180)
    }

    const onMegaEnter = () => clearTimeout(megaMenuTimeout.current)
    const onMegaLeave = () => {
        megaMenuTimeout.current = setTimeout(() => setMegaMenuGrupo(null), 180)
    }

    const grupos = categorias.filter((c) => c.subs && c.subs.length > 0)
    const otras = categorias.filter((c) => !c.subs || c.subs.length === 0)

    return (
        <>
            <main className="w-[90%] max-w-[1400px] mx-auto py-10 pb-20">
                <div className="flex gap-8 relative items-start">

                    {/* ── Sidebar ─────────────────────────────────────────────────────── */}
                    <aside className="flex items-start relative flex-shrink-0" style={{minWidth: 280}}>
                        <div
                            className="w-[280px] bg-white shadow-[0_4px_12px_rgba(0,0,0,0.08)] rounded sticky top-[100px] z-10">
                            <div
                                className="bg-[#3498db] text-white px-5 py-4 flex items-center justify-between font-bold uppercase text-base cursor-pointer select-none"
                                onClick={() => setSidebarAbierto((v) => !v)}
                            >
                <span className="flex items-center gap-2">
                  <i className="fas fa-bars"></i> Categorías
                </span>
                                <i className={`fas fa-chevron-down transition-transform duration-300 ${sidebarAbierto ? 'rotate-180' : ''}`}></i>
                            </div>

                            <div
                                className="overflow-y-auto transition-all duration-300 scrollbar-thin"
                                style={{
                                    maxHeight: sidebarAbierto ? 450 : 0,
                                    overflow: sidebarAbierto ? 'auto' : 'hidden',
                                    opacity: sidebarAbierto ? 1 : 0
                                }}
                            >
                                <ul className="list-none p-0 m-0">
                                    <li
                                        className={`border-b border-[#eee] transition-all ${categoriaActiva === '' ? 'bg-[#e3f2fd] border-l-4 border-l-[#3498db]' : 'hover:bg-[#f0f7fd]'}`}
                                        onClick={() => handleCategoria('')}
                                    >
                    <span
                        className={`block px-5 py-3 text-sm font-semibold cursor-pointer transition-all ${categoriaActiva === '' ? 'text-[#3498db]' : 'text-[#333] hover:text-[#3498db] hover:pl-6'}`}>
                      TODOS
                    </span>
                                    </li>

                                    {grupos.map((g) => (
                                        <li
                                            key={g.grupo}
                                            className={`border-b border-[#eee] transition-all ${categoriaActiva === g.grupo ? 'bg-[#e3f2fd] border-l-4 border-l-[#3498db]' : 'hover:bg-[#f0f7fd]'}`}
                                            onMouseEnter={(e) => onGrupoEnter(g.grupo, e)}
                                            onMouseLeave={onGrupoLeave}
                                            onClick={() => handleCategoria(g.grupo)}
                                        >
                      <span
                          className={`block px-5 py-3 text-sm font-semibold cursor-pointer transition-all ${categoriaActiva === g.grupo ? 'text-[#3498db]' : 'text-[#333] hover:text-[#3498db] hover:pl-6'}`}>
                        {g.grupo}
                      </span>
                                        </li>
                                    ))}

                                    {otras.map((c) => (
                                        <li
                                            key={c.nombre}
                                            className={`border-b border-[#eee] last:border-none transition-all ${categoriaActiva === c.nombre ? 'bg-[#e3f2fd] border-l-4 border-l-[#3498db]' : 'hover:bg-[#f0f7fd]'}`}
                                            onClick={() => handleCategoria(c.nombre)}
                                        >
                      <span
                          className={`block px-5 py-3 text-sm font-semibold cursor-pointer transition-all ${categoriaActiva === c.nombre ? 'text-[#3498db]' : 'text-[#333] hover:text-[#3498db] hover:pl-6'}`}>
                        {c.nombre.toUpperCase()}
                      </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {megaMenuGrupo && (
                            <div
                                ref={megaMenuRef}
                                className="fixed bg-white shadow-[0_8px_24px_rgba(0,0,0,0.15)] rounded border border-[#eee] p-5 z-[9999] min-w-[400px] max-w-[520px] transition-all"
                                style={{top: megaMenuRef.current?.style.top, left: megaMenuRef.current?.style.left}}
                                onMouseEnter={onMegaEnter}
                                onMouseLeave={onMegaLeave}
                            >
                                {(() => {
                                    const grupo = grupos.find((g) => g.grupo === megaMenuGrupo)
                                    if (!grupo) return null
                                    const cols = []
                                    for (let i = 0; i < grupo.subs.length; i += 5) cols.push(grupo.subs.slice(i, i + 5))
                                    return (
                                        <div className="grid gap-6"
                                             style={{gridTemplateColumns: `repeat(${cols.length}, minmax(130px, 1fr))`}}>
                                            {cols.map((col, ci) => (
                                                <div key={ci} className="flex flex-col gap-2">
                                                    {col.map((sub) => (
                                                        <span
                                                            key={sub}
                                                            className="text-[14px] text-[#333] py-1 cursor-pointer hover:text-[#3498db] hover:font-semibold transition-colors capitalize"
                                                            onClick={() => handleCategoria(sub)}
                                                        >
                              {sub}
                            </span>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    )
                                })()}
                            </div>
                        )}
                    </aside>

                    <div className="flex-1 min-w-0">
                        <div
                            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 bg-white p-5 rounded shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
                            <h1 className="text-2xl font-bold text-[#2c3e50] uppercase border-l-[5px] border-[#3498db] pl-4 m-0">
                                Nuestros Productos
                            </h1>
                            <form onSubmit={handleBusqueda} className="flex gap-2">
                                <input
                                    type="text"
                                    value={busqueda}
                                    onChange={(e) => setBusqueda(e.target.value)}
                                    placeholder="Buscar productos..."
                                    className="border border-[#ddd] rounded-lg px-4 py-2 text-sm outline-none focus:border-[#3498db] transition-colors w-56"
                                />
                                <button
                                    type="submit"
                                    className="bg-[#3498db] text-white px-4 py-2 rounded-lg hover:bg-[#2980b9] transition-colors"
                                ><i className="fas fa-search"></i>
                                </button>
                            </form>
                        </div>

                        <div className="grid gap-6"
                             style={{gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))'}}>
                            {cargando ? Array.from({length: 8}).map((_, i) => <SkeletonCard key={i}/>)
                                : productos.length === 0
                                    ? <EmptyState/>
                                    : productos.map((p) => (
                                        <div
                                            key={p.id}
                                            ref={addRef}
                                            onClick={() => setModalProducto(p)}
                                            className="opacity-0 translate-y-4 transition-all duration-500 bg-white border border-[#eee] rounded-xl overflow-hidden flex flex-col cursor-pointer hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:border-[#3498db]"
                                        >
                                            <div
                                                className="h-52 flex items-center justify-center p-5 border-b border-[#f0f0f0] relative overflow-hidden">
                                                <img
                                                    src={p.img}
                                                    alt={p.nombre}
                                                    className="max-w-full max-h-full object-contain transition-transform duration-300 hover:scale-105"
                                                />
                                                {p.stock <= 0 && (
                                                    <span
                                                        className="absolute top-2 right-2 bg-[#999] text-white text-[11px] font-bold px-2 py-0.5 rounded uppercase">
                                                        Agotado
                                                    </span>
                                                )}
                                            </div>

                                            {/* Info */}
                                            <div className="p-4 flex flex-col flex-1 text-center">
                                                <h3 className="text-[15px] font-semibold text-[#333] mb-2 leading-snug min-h-[42px]">
                                                    {p.nombre}
                                                </h3>
                                                <span
                                                    className="text-[11px] text-[#999] bg-[#f5f5f5] px-2 py-0.5 rounded-full inline-block w-fit mx-auto mb-3 uppercase">
                                                    {p.categoria} </span>
                                                <div
                                                    className="mt-auto border-t border-[#f0f0f0] pt-3 space-y-1 text-sm mb-3">
                                                    <div className="flex justify-between text-[#666]">
                                                        <span className="font-semibold text-[#2c3e50]">Stock:</span>
                                                        <span>{p.stock} {p.unidad_medida}</span>
                                                    </div>
                                                    <div className="flex justify-between font-bold">
                                                        <span className="text-[#2c3e50]">Precio:</span>
                                                        <span
                                                            className="text-[#3498db] text-[15px]">S/ {Number(p.precio_venta).toFixed(2)}</span>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        // TODO: conectar con lógica de carrito
                                                    }}
                                                    disabled={p.stock <= 0}
                                                    className={`w-full py-2.5 rounded border-2 font-bold text-[13px] uppercase flex items-center justify-center gap-2 transition-all duration-300 ${
                                                        p.stock <= 0
                                                            ? 'bg-[#bdc3c7] border-[#bdc3c7] text-white cursor-not-allowed'
                                                            : 'border-[#3498db] text-[#3498db] hover:bg-[#3498db] hover:text-white'
                                                    }`}
                                                >
                                                    <i className={`fas ${p.stock <= 0 ? 'fa-times' : 'fa-shopping-cart'}`}></i>
                                                    {p.stock <= 0 ? 'AGOTADO' : 'AGREGAR'}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                        </div>
                        {totalPaginas > 1 && (
                            <div className="mt-10 pt-5 flex justify-center items-center gap-4 flex-wrap">
                                <button
                                    disabled={paginaActual === 1}
                                    onClick={() => setPaginaActual((p) => p - 1)}
                                    className={`font-semibold text-base px-3 py-2 transition-colors ${paginaActual === 1 ? 'text-[#ccc] cursor-not-allowed' : 'text-[#333] hover:text-[#3498db]'}`}
                                >
                                    ← Anterior
                                </button>

                                <div className="flex gap-2">
                                    {Array.from({length: Math.min(totalPaginas, 10)}, (_, i) => i + 1).map((n) => (
                                        <button
                                            key={n}
                                            onClick={() => setPaginaActual(n)}
                                            className={`w-9 h-9 rounded font-semibold text-base transition-all ${n === paginaActual ? 'text-[#3498db] font-extrabold text-lg' : 'text-[#333] hover:text-[#3498db]'}`}
                                        >
                                            {n}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    disabled={paginaActual === totalPaginas}
                                    onClick={() => setPaginaActual((p) => p + 1)}
                                    className={`font-semibold text-base px-3 py-2 transition-colors ${paginaActual === totalPaginas ? 'text-[#ccc] cursor-not-allowed' : 'text-[#333] hover:text-[#3498db]'}`}
                                >
                                    Siguiente →
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {modalProducto && (
                <ProductoModal producto={modalProducto} onClose={() => setModalProducto(null)}/>
            )}
        </>
    )
}