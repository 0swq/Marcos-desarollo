import {useEffect, useState, useRef} from 'react'
import {
    ActionIcon, Box, Button, Modal, Skeleton, Text, TextInput, Title,
    Loader, FileInput
} from '@mantine/core'
import {
    IconBoxOff, IconBrandWhatsapp, IconSearch, IconShoppingCart, IconX,
    IconWand  // ícono para el botón "Probar"
} from '@tabler/icons-react'
import {Api_manager} from "@/Service/Api_manager.jsx"

function fotoUrl(id) {
    return `${import.meta.env.VITE_API_URL}/producto/${id}/foto`
}

function EmptyState() {
    return (
        <div className="col-span-full flex flex-col items-center justify-center py-20 gap-4 text-center">
            <Box style={{
                width: 80, height: 80, borderRadius: '50%',
                background: 'var(--color-background-secondary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
                <IconBoxOff size={40} color="var(--color-text-tertiary)"/>
            </Box>
            <Title order={3} style={{color: 'var(--color-text-primary)'}}>
                No hay productos disponibles
            </Title>
            <Text size="sm" style={{color: 'var(--color-text-secondary)', maxWidth: 280}}>
                En este momento no hay productos en esta categoría.
            </Text>
            <Button
                component="a"
                href="https://wa.me/51923197032"
                target="_blank"
                rel="noreferrer"
                leftSection={<IconBrandWhatsapp size={18}/>}
                styles={{root: {backgroundColor: '#25D366', color: '#fff'}}}
            >
                Consultar por WhatsApp
            </Button>
        </div>
    )
}

function SkeletonCard() {
    return (
        <div style={{
            background: 'var(--color-background-primary)',
            border: '0.5px solid var(--color-border-tertiary)',
            borderRadius: 'var(--border-radius-lg)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
        }}>
            <Skeleton height={180} radius={0}/>
            <div style={{
                padding: '12px 14px 14px',
                borderTop: '0.5px solid var(--color-border-tertiary)',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
            }}>
                <Skeleton height={14} radius={4} width="75%"/>
                <Skeleton height={11} radius={4} width="45%"/>
            </div>
        </div>
    )
}

function ProductoCard({producto, onClick}) {
    const [imgError, setImgError] = useState(false)

    return (
        <div
            onClick={onClick}
            style={{
                background: 'var(--color-background-primary)',
                border: '0.5px solid var(--color-border-tertiary)',
                borderRadius: 'var(--border-radius-lg)',
                cursor: 'pointer',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'border-color 0.15s, transform 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#378ADD'
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(55,138,221,0.12)'
            }}
            onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--color-border-tertiary)'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
            }}
        >
            <div style={{
                height: 180,
                background: 'var(--color-background-secondary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: 20,
            }}>
                {!imgError
                    ? <img
                        src={fotoUrl(producto.id)}
                        alt={producto.nombre}
                        onError={() => setImgError(true)}
                        style={{height: '100%', width: '100%', objectFit: 'contain'}}
                    />
                    : <IconBoxOff size={44} color="var(--color-text-tertiary)"/>
                }
            </div>
            <div style={{
                padding: '12px 14px 14px',
                borderTop: '0.5px solid var(--color-border-tertiary)',
                display: 'flex', flexDirection: 'column', gap: 4,
            }}>
                <Text fw={500} size="sm" lineClamp={2}
                      style={{color: 'var(--color-text-primary)', lineHeight: 1.4}}>
                    {producto.nombre}
                </Text>
                {producto.marca && (
                    <Text size="xs" style={{color: 'var(--color-text-secondary)'}}>
                        {producto.marca}
                    </Text>
                )}
            </div>
        </div>
    )
}

// ---------- Modal de prueba de textura (Replicate) ----------
function ReplicaModal({productoId, onClose, api}) {
    const [file, setFile] = useState(null)
    const [uploading, setUploading] = useState(false)
    const [replicaId, setReplicaId] = useState(null)
    const [estado, setEstado] = useState(null) // 'processing', 'ready', 'error'
    const [resultadoUrl, setResultadoUrl] = useState(null)
    const [errorMsg, setErrorMsg] = useState('')
    const pollingRef = useRef(null)

    const limpiarPolling = () => {
        if (pollingRef.current) {
            clearInterval(pollingRef.current)
            pollingRef.current = null
        }
    }

    useEffect(() => {
        return () => limpiarPolling()
    }, [])

    const handleUpload = async () => {
        if (!file) {
            setErrorMsg('Selecciona una imagen primero')
            return
        }
        setUploading(true)
        setErrorMsg('')
        try {
            const resp = await api.replicas.replicar(productoId, file)
            const {replica_id} = resp
            setReplicaId(replica_id)
            setEstado('processing')

            limpiarPolling()
            pollingRef.current = setInterval(async () => {
                try {
                    const estadoResp = await api.replicas.estado(replica_id)
                    if (estadoResp.estado === 'listo') {
                        setEstado('ready')
                        setResultadoUrl(estadoResp.url_resultado)
                        limpiarPolling()
                    } else if (estadoResp.estado === 'error') {
                        setEstado('error')
                        setErrorMsg('Error al procesar la imagen')
                        limpiarPolling()
                    }
                } catch (err) {
                    console.error('Error polling:', err)
                    setEstado('error')
                    setErrorMsg('Error consultando estado')
                    limpiarPolling()
                }
            }, 3000)
        } catch (err) {
            console.error('Error al replicar:', err)
            setErrorMsg(err.message || 'Error al iniciar la réplica')
            setEstado('error')
        } finally {
            setUploading(false)
        }
    }

    return (
        <Modal
            opened={true}
            onClose={() => {
                limpiarPolling()
                onClose()
            }}
            size="lg"
            radius="lg"
            title="Probar textura melamina"
            centered
        >
            <div style={{padding: '0 8px 16px'}}>
                {!replicaId && (
                    <>
                        <FileInput
                            label="Sube una foto de tu ambiente (cocina, sala, etc.)"
                            placeholder="Haz clic o arrastra una imagen"
                            accept="image/png,image/jpeg,image/jpg"
                            value={file}
                            onChange={setFile}
                            required
                        />
                        <Button
                            fullWidth
                            mt="md"
                            onClick={handleUpload}
                            loading={uploading}
                            disabled={!file}
                        >
                            Probar textura
                        </Button>
                        {errorMsg && <Text color="red" size="sm" mt="sm">{errorMsg}</Text>}
                    </>
                )}

                {replicaId && estado === 'processing' && (
                    <div style={{textAlign: 'center', padding: '20px'}}>
                        <Loader size="lg"/>
                        <Text mt="md">Procesando imagen... esto puede tomar unos segundos</Text>
                        <Text size="xs" color="dimmed">ID: {replicaId}</Text>
                    </div>
                )}

                {estado === 'ready' && resultadoUrl && (
                    <div style={{textAlign: 'center'}}>
                        <Text mb="sm" fw={500}>¡Listo! Así se vería con la textura melamina:</Text>
                        <img
                            src={resultadoUrl}
                            alt="Resultado"
                            style={{
                                maxWidth: '100%',
                                maxHeight: '60vh',
                                borderRadius: 12,
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                            }}
                        />
                        <Button fullWidth mt="lg" onClick={onClose} variant="light">
                            Cerrar
                        </Button>
                    </div>
                )}

                {estado === 'error' && (
                    <div>
                        <Text color="red" size="sm">Ocurrió un error: {errorMsg}</Text>
                        <Button fullWidth mt="md" onClick={() => window.location.reload()}>Intentar de nuevo</Button>
                    </div>
                )}
            </div>
        </Modal>
    )
}

// ---------- Modal principal del producto (con botón Probar) ----------
function ModalProducto({producto, onClose, api}) {
    const [varianteIdx, setVarianteIdx] = useState(0)
    const [cantidad, setCantidad] = useState(1)
    const [imgError, setImgError] = useState(false)
    const [agregado, setAgregado] = useState(false)
    const [replicaModalOpen, setReplicaModalOpen] = useState(false)
    const [agregando, setAgregando] = useState(false)
    const [enCarrito, setEnCarrito] = useState({})  // { variante_id: cantidad }

    useEffect(() => {
        if (producto) {
            setVarianteIdx(0)
            setCantidad(1)
            setImgError(false)
            setAgregado(false)
            setReplicaModalOpen(false)
            // Cargar items actuales del carrito
            api.carrito.items.listar().then(data => {
                const mapa = {}
                data.forEach(it => {
                    const vid = it.variante  // FK a variante
                    if (vid) mapa[vid] = (mapa[vid] || 0) + it.cantidad
                })
                setEnCarrito(mapa)
            }).catch(() => {})
        }
    }, [producto?.id])

    if (!producto) return null

    const variantes = (producto.variantes ?? []).filter(v => v.activa !== false)
    const variante = variantes[varianteIdx] ?? null
    const stockDisponible = variante?.stock ?? 0
    const precioVenta = variante ? Number(variante.precio_venta) : null
    const precioMayorista = variante ? Number(variante.precio_mayorista) : null
    const sinStock = stockDisponible === 0

    const tiposAtributo = [...new Set(
        variantes.flatMap(v => (v.atributos ?? []).map(a => a.tipo))
    )]

    const atributosVariante = variante?.atributos ?? []

    const handleAgregar = async () => {
        if (!variante || sinStock || agregando) return
        setAgregando(true)
        try {
            await api.carrito.items.agregar(variante.id, cantidad)
            // Actualizar contador
            setEnCarrito(prev => ({
                ...prev,
                [variante.id]: (prev[variante.id] || 0) + cantidad,
            }))
            setAgregado(true)
            setTimeout(() => setAgregado(false), 2000)
        } catch (err) {
            console.error("Error al agregar al carrito:", err)
        } finally {
            setAgregando(false)
        }
    }

    // Mostrar botón solo si el producto fue marcado como melamina
    const mostrarBotonProbar = producto.esMelamina === true

    return (
        <>
            <Modal
                opened={!!producto}
                onClose={onClose}
                centered
                size="xl"
                radius="lg"
                padding={0}
                title={null}
                withCloseButton={false}
                styles={{
                    body: {padding: 0},
                    content: {overflow: 'hidden'},
                }}
            >
                <div style={{display: 'flex', flexDirection: 'column', minHeight: 480}}>

                    {/* Header */}
                    <div style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                        padding: '20px 24px 16px',
                        borderBottom: '0.5px solid var(--color-border-tertiary)',
                    }}>
                        <div>
                            <Text fw={500} size="lg"
                                  style={{color: 'var(--color-text-primary)', lineHeight: 1.3}}>
                                {producto.nombre}
                            </Text>
                            {(producto.marca || producto.unidades) && (
                                <Text size="xs" style={{color: 'var(--color-text-secondary)'}} mt={2}>
                                    {[producto.marca, producto.unidades].filter(Boolean).join(' · ')}
                                </Text>
                            )}
                        </div>
                        <ActionIcon variant="subtle" color="gray" onClick={onClose} mt={2}>
                            <IconX size={16}/>
                        </ActionIcon>
                    </div>

                    {/* Cuerpo */}
                    <div style={{
                        display: 'flex',
                        flex: 1,
                        minHeight: 0,
                        flexDirection: 'column',
                    }}>
                        <div style={{
                            display: 'flex',
                            flex: 1,
                            minHeight: 0,
                            flexWrap: 'wrap',
                        }}>
                            {/* Imagen */}
                            <div style={{
                                flex: '0 0 38%',
                                minWidth: 220,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                padding: 32,
                                background: 'var(--color-background-secondary)',
                                borderRight: '0.5px solid var(--color-border-tertiary)',
                                borderBottom: '0.5px solid var(--color-border-tertiary)',
                            }}>
                                {!imgError
                                    ? <img
                                        src={fotoUrl(producto.id)}
                                        alt={producto.nombre}
                                        onError={() => setImgError(true)}
                                        style={{maxHeight: 220, width: '100%', objectFit: 'contain'}}
                                    />
                                    : <IconBoxOff size={56} color="var(--color-text-tertiary)"/>
                                }
                            </div>

                            {/* Panel derecho */}
                            <div style={{
                                flex: '1 1 260px',
                                display: 'flex', flexDirection: 'column',
                                padding: '20px 24px', gap: 14, overflowY: 'auto',
                            }}>
                                {/* Tabla variantes */}
                                <div>
                                    <Text size="xs" fw={500} style={{
                                        color: 'var(--color-text-secondary)', marginBottom: 8,
                                        textTransform: 'uppercase', letterSpacing: '0.05em',
                                    }}>
                                        Variantes
                                    </Text>
                                    <div style={{
                                        border: '0.5px solid var(--color-border-tertiary)',
                                        borderRadius: 'var(--border-radius-md)',
                                        overflow: 'auto',
                                    }}>
                                        <table style={{width: '100%', borderCollapse: 'collapse', fontSize: 13}}>
                                            <thead>
                                            <tr style={{background: 'var(--color-background-secondary)'}}>
                                                <th style={{
                                                    padding: '8px 12px',
                                                    textAlign: 'left',
                                                    fontWeight: 500,
                                                    color: 'var(--color-text-secondary)',
                                                    borderBottom: '0.5px solid var(--color-border-tertiary)'
                                                }}>SKU
                                                </th>
                                                <th style={{
                                                    padding: '8px 12px',
                                                    textAlign: 'right',
                                                    fontWeight: 500,
                                                    color: 'var(--color-text-secondary)',
                                                    borderBottom: '0.5px solid var(--color-border-tertiary)',
                                                    whiteSpace: 'nowrap'
                                                }}>Precio
                                                </th>
                                                <th style={{
                                                    padding: '8px 12px',
                                                    textAlign: 'center',
                                                    fontWeight: 500,
                                                    color: 'var(--color-text-secondary)',
                                                    borderBottom: '0.5px solid var(--color-border-tertiary)',
                                                    whiteSpace: 'nowrap'
                                                }}>Stock
                                                </th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {variantes.map((v, i) => {
                                                const sel = varianteIdx === i
                                                const sinStockVar = v.stock === 0
                                                return (
                                                    <tr
                                                        key={v.id}
                                                        onClick={() => {
                                                            if (!sinStockVar) {
                                                                setVarianteIdx(i);
                                                                setCantidad(1)
                                                            }
                                                        }}
                                                        style={{
                                                            cursor: sinStockVar ? 'not-allowed' : 'pointer',
                                                            background: sel ? '#E6F1FB' : 'var(--color-background-primary)',
                                                            opacity: sinStockVar ? 0.5 : 1,
                                                            borderBottom: i < variantes.length - 1 ? '0.5px solid var(--color-border-tertiary)' : 'none',
                                                            transition: 'background 0.1s',
                                                        }}
                                                        onMouseEnter={e => {
                                                            if (!sel && !sinStockVar) e.currentTarget.style.background = 'var(--color-background-secondary)'
                                                        }}
                                                        onMouseLeave={e => {
                                                            if (!sel) e.currentTarget.style.background = 'var(--color-background-primary)'
                                                        }}
                                                    >
                                                        <td style={{
                                                            padding: '9px 12px',
                                                            color: sel ? '#185FA5' : 'var(--color-text-primary)',
                                                            fontWeight: sel ? 500 : 400,
                                                            fontFamily: 'var(--font-mono)',
                                                            fontSize: 12,
                                                            whiteSpace: 'nowrap'
                                                        }}>{v.sku}</td>
                                                        <td style={{
                                                            padding: '9px 12px',
                                                            textAlign: 'right',
                                                            color: sel ? '#185FA5' : 'var(--color-text-primary)',
                                                            fontWeight: sel ? 500 : 400,
                                                            whiteSpace: 'nowrap'
                                                        }}>S/ {Number(v.precio_venta).toFixed(2)}</td>
                                                        <td style={{padding: '9px 12px', textAlign: 'center'}}>
                                                                <span style={{
                                                                    display: 'inline-block',
                                                                    padding: '2px 8px',
                                                                    borderRadius: 99,
                                                                    fontSize: 11,
                                                                    fontWeight: 500,
                                                                    background: sinStockVar ? 'var(--color-background-danger)' : v.stock <= 10 ? 'var(--color-background-warning)' : 'var(--color-background-success)',
                                                                    color: sinStockVar ? 'var(--color-text-danger)' : v.stock <= 10 ? 'var(--color-text-warning)' : 'var(--color-text-success)'
                                                                }}>
                                                                    {sinStockVar ? 'Sin stock' : v.stock}
                                                                </span>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Especificaciones */}
                                {atributosVariante.length > 0 && (
                                    <div>
                                        <Text size="xs" fw={500} style={{
                                            color: 'var(--color-text-secondary)',
                                            marginBottom: 8,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em'
                                        }}>Especificaciones</Text>
                                        <div style={{display: 'flex', flexWrap: 'wrap', gap: 6}}>
                                            {atributosVariante.map((atr, i) => (
                                                <div key={i} style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 4,
                                                    padding: '4px 10px',
                                                    borderRadius: 99,
                                                    background: 'var(--color-background-secondary)',
                                                    border: '0.5px solid var(--color-border-tertiary)',
                                                    fontSize: 12
                                                }}>
                                                    <span style={{
                                                        color: 'var(--color-text-secondary)',
                                                        fontWeight: 500
                                                    }}>{atr.tipo}:</span>
                                                    <span
                                                        style={{color: 'var(--color-text-primary)'}}>{atr.valor}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Precios */}
                                {variante && (
                                    <div style={{display: 'flex', alignItems: 'baseline', gap: 16}}>
                                        <div>
                                            <Text size="xs" style={{color: 'var(--color-text-secondary)'}}>Precio
                                                unitario</Text>
                                            <Text fw={500} size="xl"
                                                  style={{color: 'var(--color-text-primary)'}}>S/ {precioVenta?.toFixed(2)}</Text>
                                        </div>
                                        {precioMayorista > 0 && (
                                            <div>
                                                <Text size="xs"
                                                      style={{color: 'var(--color-text-secondary)'}}>Mayorista</Text>
                                                <Text fw={500} size="sm"
                                                      style={{color: 'var(--color-text-secondary)'}}>S/ {precioMayorista.toFixed(2)}</Text>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Descripción */}
                                {producto.descripcion && (
                                    <div>
                                        <Text size="xs" fw={500} style={{
                                            color: 'var(--color-text-secondary)',
                                            marginBottom: 6,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em'
                                        }}>Descripción</Text>
                                        <Text size="sm" style={{
                                            color: 'var(--color-text-primary)',
                                            lineHeight: 1.6,
                                            whiteSpace: 'pre-line'
                                        }}>{producto.descripcion}</Text>
                                    </div>
                                )}

                                {/* Cantidad + botones */}
                                <div style={{marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 10}}>
                                    {!sinStock && variante && (
                                        <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                                            <Text size="xs" fw={500} style={{
                                                color: 'var(--color-text-secondary)',
                                                minWidth: 60
                                            }}>Cantidad</Text>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                border: '0.5px solid var(--color-border-secondary)',
                                                borderRadius: 'var(--border-radius-md)',
                                                overflow: 'hidden'
                                            }}>
                                                <button onClick={() => setCantidad(c => Math.max(1, c - 1))}
                                                        disabled={cantidad <= 1} style={{
                                                    width: 32,
                                                    height: 32,
                                                    border: 'none',
                                                    borderRight: '0.5px solid var(--color-border-tertiary)',
                                                    background: 'var(--color-background-secondary)',
                                                    cursor: cantidad <= 1 ? 'not-allowed' : 'pointer',
                                                    color: 'var(--color-text-primary)',
                                                    fontSize: 16,
                                                    lineHeight: 1
                                                }}>−
                                                </button>
                                                <span style={{
                                                    minWidth: 40,
                                                    textAlign: 'center',
                                                    fontSize: 14,
                                                    fontWeight: 500,
                                                    color: 'var(--color-text-primary)'
                                                }}>{cantidad}</span>
                                                <button
                                                    onClick={() => setCantidad(c => Math.min(stockDisponible, c + 1))}
                                                    disabled={cantidad >= stockDisponible} style={{
                                                    width: 32,
                                                    height: 32,
                                                    border: 'none',
                                                    borderLeft: '0.5px solid var(--color-border-tertiary)',
                                                    background: 'var(--color-background-secondary)',
                                                    cursor: cantidad >= stockDisponible ? 'not-allowed' : 'pointer',
                                                    color: 'var(--color-text-primary)',
                                                    fontSize: 16,
                                                    lineHeight: 1
                                                }}>+
                                                </button>
                                            </div>
                                            <Text size="xs"
                                                  style={{color: 'var(--color-text-tertiary)'}}>máx. {stockDisponible}</Text>
                                        </div>
                                    )}

                                    {/* Indicador de unidades en carrito */}
                                    {variante && enCarrito[variante.id] > 0 && (
                                        <div style={{
                                            display: 'flex', alignItems: 'center', gap: 8,
                                            padding: '8px 12px', borderRadius: 8,
                                            background: '#e3f2fd', border: '1px solid #bbdefb',
                                            fontSize: 13, color: '#1565c0', fontWeight: 500,
                                        }}>
                                            <i className="fas fa-check-circle" style={{color: '#1565c0'}}></i>
                                            Ya tenés {enCarrito[variante.id]} en tu carrito
                                        </div>
                                    )}

                                    <Button fullWidth size="md" leftSection={<IconShoppingCart size={17}/>}
                                            disabled={sinStock || !variante} onClick={handleAgregar} styles={{
                                        root: {
                                            backgroundColor: agregado ? '#0F6E56' : '#185FA5',
                                            transition: 'background-color 0.2s'
                                        }
                                    }}>
                                        {agregado ? '¡Agregado al carrito!' : sinStock ? 'Sin stock' : 'Agregar al carrito'}
                                    </Button>

                                    <Button fullWidth size="sm" variant="outline" component="a"
                                            href={`https://wa.me/51923197032?text=${encodeURIComponent(`Hola, me interesa: ${producto.nombre}${variante ? ` (${variante.sku})` : ''}`)}`}
                                            target="_blank" rel="noreferrer"
                                            leftSection={<IconBrandWhatsapp size={15}/>}
                                            styles={{root: {borderColor: '#25D366', color: '#0F6E56'}}}>
                                        Consultar por WhatsApp
                                    </Button>

                                    {/* Botón Probar textura (solo si el producto es melamina) */}
                                    {mostrarBotonProbar && (
                                        <Button
                                            fullWidth size="md"
                                            variant="outline"
                                            leftSection={<IconWand size={18}/>}
                                            onClick={() => setReplicaModalOpen(true)}
                                            styles={{root: {borderColor: '#378ADD', color: '#378ADD'}}}
                                        >
                                            Probar textura
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Modal de prueba (Replicate) */}
            {replicaModalOpen && (
                <ReplicaModal
                    productoId={producto.id}
                    onClose={() => setReplicaModalOpen(false)}
                    api={api}
                />
            )}
        </>
    )
}

function GridProductos({cargando, productos, onVerProducto}) {
    return (
        <div className="grid gap-5"
             style={{gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))'}}>
            {cargando
                ? Array.from({length: 8}).map((_, i) => <SkeletonCard key={i}/>)
                : productos.length === 0
                    ? <EmptyState/>
                    : productos.map(p => (
                        <ProductoCard key={p.id} producto={p} onClick={() => onVerProducto(p)}/>
                    ))
            }
        </div>
    )
}

function BarraBusqueda({busqueda, setBusqueda, onSubmit}) {
    return (
        <div style={{
            display: 'flex', flexWrap: 'wrap',
            alignItems: 'center', justifyContent: 'space-between',
            gap: 16, marginBottom: 24,
            background: 'var(--color-background-primary)',
            padding: '18px 20px',
            borderRadius: 'var(--border-radius-lg)',
            border: '0.5px solid var(--color-border-tertiary)',
        }}>
            <Title order={2} style={{
                fontSize: '1.25rem', fontWeight: 500,
                borderLeft: '4px solid #378ADD', paddingLeft: 14,
                color: 'var(--color-text-primary)', margin: 0,
            }}>
                Nuestros Productos
            </Title>
            <form onSubmit={onSubmit} style={{display: 'flex', gap: 8}}>
                <TextInput
                    value={busqueda}
                    onChange={e => setBusqueda(e.target.value)}
                    placeholder="Buscar por nombre, marca o atributo..."
                    radius="md" size="sm"
                    style={{width: 260}}
                />
                <ActionIcon
                    type="submit" size="lg" radius="md"
                    styles={{root: {backgroundColor: '#378ADD', color: '#fff'}}}
                >
                    <IconSearch size={16}/>
                </ActionIcon>
            </form>
        </div>
    )
}

function SidebarCategorias({
                               categoriasPadre, categoriaSeleccionada, subCategoriaSeleccionada,
                               onCategoria, onSubCategoria,
                           }) {
    const [expandidos, setExpandidos] = useState([])

    const togglePadre = (id) =>
        setExpandidos(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

    return (
        <div style={{
            borderRadius: 'var(--border-radius-lg)',
            overflow: 'hidden',
            border: '0.5px solid var(--color-border-tertiary)',
            background: 'var(--color-background-primary)',
        }}>
            <div style={{
                padding: '11px 16px',
                background: '#185FA5',
                color: '#E6F1FB',
                fontWeight: 500, fontSize: 13,
                letterSpacing: '0.06em', textTransform: 'uppercase',
            }}>
                Categorías
            </div>

            <button
                onClick={() => onCategoria(null)}
                style={{
                    width: '100%', textAlign: 'left',
                    padding: '10px 16px', fontSize: 13, border: 'none',
                    borderBottom: '0.5px solid var(--color-border-tertiary)',
                    background: !categoriaSeleccionada ? '#E6F1FB' : 'var(--color-background-primary)',
                    color: !categoriaSeleccionada ? '#185FA5' : 'var(--color-text-primary)',
                    fontWeight: !categoriaSeleccionada ? 500 : 400,
                    cursor: 'pointer', transition: 'background 0.1s',
                }}
            >
                Todos
            </button>

            {categoriasPadre.map(padre => {
                const tieneHijos = (padre.hijos ?? []).length > 0
                const expandido = expandidos.includes(padre.id)
                const sel = categoriaSeleccionada?.id === padre.id && !subCategoriaSeleccionada

                return (
                    <div key={padre.id}>
                        <button
                            onClick={() => {
                                onCategoria(padre)
                                if (tieneHijos) togglePadre(padre.id)
                            }}
                            style={{
                                width: '100%', textAlign: 'left',
                                padding: '10px 16px', fontSize: 13, border: 'none',
                                borderBottom: '0.5px solid var(--color-border-tertiary)',
                                background: sel ? '#E6F1FB' : 'var(--color-background-primary)',
                                color: sel ? '#185FA5' : 'var(--color-text-primary)',
                                fontWeight: sel ? 500 : 400,
                                cursor: 'pointer',
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                transition: 'background 0.1s',
                            }}
                        >
                            {padre.nombre}
                            {tieneHijos && (
                                <span style={{
                                    fontSize: 10, color: '#378ADD',
                                    display: 'inline-block',
                                    transform: expandido ? 'rotate(180deg)' : 'rotate(0deg)',
                                    transition: 'transform 0.2s',
                                }}>▼</span>
                            )}
                        </button>

                        {tieneHijos && expandido && (padre.hijos ?? []).map(hijo => {
                            const selH = subCategoriaSeleccionada?.id === hijo.id
                            return (
                                <button
                                    key={hijo.id}
                                    onClick={() => onSubCategoria(hijo)}
                                    style={{
                                        width: '100%', textAlign: 'left',
                                        padding: '8px 16px 8px 28px',
                                        fontSize: 12, border: 'none',
                                        borderBottom: '0.5px solid var(--color-border-tertiary)',
                                        background: selH ? '#E6F1FB' : 'var(--color-background-secondary)',
                                        color: selH ? '#185FA5' : 'var(--color-text-secondary)',
                                        fontWeight: selH ? 500 : 400,
                                        cursor: 'pointer', transition: 'background 0.1s',
                                    }}
                                >
                                    {hijo.nombre}
                                </button>
                            )
                        })}
                    </div>
                )
            })}
        </div>
    )
}

export default function TiendaRest() {
    const api = Api_manager()

    const [categoriasPadre, setCategoriasPadre] = useState([])
    const [productosBase, setProductosBase] = useState([])
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null)
    const [subCategoriaSeleccionada, setSubCategoriaSeleccionada] = useState(null)
    const [busqueda, setBusqueda] = useState('')
    const [busquedaActiva, setBusquedaActiva] = useState('')
    const [loading, setLoading] = useState(true)
    const [productoDetalle, setProductoDetalle] = useState(null)

    useEffect(() => {
        const init = async () => {
            setLoading(true)
            try {
                const [cats, prods] = await Promise.all([
                    api.categorias.listar_padres(),
                    api.productos.listar_todos(),
                ])
                setCategoriasPadre(cats ?? [])

                // ---- Construir conjunto de IDs de categorías que son "melamina" (case-insensitive) ----
                const melaminaIds = new Set()
                ;(cats ?? []).forEach(padre => {
                    if (padre.nombre?.toLowerCase() === 'melamina') {
                        melaminaIds.add(padre.id)
                        padre.hijos?.forEach(hijo => melaminaIds.add(hijo.id))
                    } else {
                        padre.hijos?.forEach(hijo => {
                            if (hijo.nombre?.toLowerCase() === 'melamina') {
                                melaminaIds.add(hijo.id)
                            }
                        })
                    }
                })

                const normalizados = await Promise.all(
                    (prods ?? [])
                        .filter(p => p.ProductoBase?.publicado)
                        .map(async p => {
                            const base = p.ProductoBase
                            const variantes = await Promise.all(
                                (p.VariantesCompletas ?? [])
                                    .filter(vc => vc.Variante?.activa)
                                    .map(async vc => ({
                                        id: vc.Variante.id,
                                        sku: vc.Variante.sku,
                                        precio_venta: Number(vc.Variante.precio_venta ?? 0),
                                        precio_mayorista: Number(vc.Variante.precio_mayorista ?? 0),
                                        stock: vc.Variante.stock ?? 0,
                                        activa: vc.Variante.activa,
                                        atributos: (vc.Atributos ?? []).map(a => ({
                                            tipo: a.tipo_atributo?.nombre ?? a.tipo_atributo,
                                            valor: a.valor,
                                        })),
                                    }))
                            )
                            return {
                                id: base.id,
                                nombre: base.nombre,
                                marca: base.marca,
                                descripcion: base.descripcion,
                                unidades: base.unidades,
                                categoria_id: base.categoria,
                                variantes,
                                esMelamina: melaminaIds.has(base.categoria),   // ← flag para mostrar botón
                            }
                        })
                )
                setProductosBase(normalizados)
            } catch (e) {
                console.error('Error cargando tienda:', e)
            } finally {
                setLoading(false)
            }
        }
        init()
    }, [])

    const productosFiltrados = productosBase.filter(p => {
        if (busquedaActiva) {
            const q = busquedaActiva.toLowerCase()
            const valoresAtributos = (p.variantes ?? []).flatMap(v =>
                (v.atributos ?? []).map(a => (a.valor ?? '').toLowerCase())
            )
            const coincide =
                (p.nombre ?? '').toLowerCase().includes(q) ||
                (p.marca ?? '').toLowerCase().includes(q) ||
                valoresAtributos.some(val => val.includes(q))
            if (!coincide) return false
        }

        if (subCategoriaSeleccionada) return p.categoria_id === subCategoriaSeleccionada.id
        if (categoriaSeleccionada) {
            const ids = [categoriaSeleccionada.id, ...(categoriaSeleccionada.hijos ?? []).map(h => h.id)]
            return ids.includes(p.categoria_id)
        }
        return true
    })

    const handleBusqueda = (e) => {
        e.preventDefault()
        setBusquedaActiva(busqueda)
    }

    return (
        <>
            <style>{`
                @media (max-width: 640px) {
                    .tienda-layout {
                        flex-direction: column !important;
                    }
                    .tienda-sidebar {
                        width: 100% !important;
                    }
                }
            `}</style>

            <main style={{
                width: '90%', maxWidth: 1400,
                margin: '0 auto', padding: '40px 0 80px',
            }}>
                <BarraBusqueda busqueda={busqueda} setBusqueda={setBusqueda} onSubmit={handleBusqueda}/>

                <div className="tienda-layout" style={{display: 'flex', gap: 24, alignItems: 'flex-start'}}>
                    <div className="tienda-sidebar" style={{width: 210, flexShrink: 0}}>
                        <SidebarCategorias
                            categoriasPadre={categoriasPadre}
                            categoriaSeleccionada={categoriaSeleccionada}
                            subCategoriaSeleccionada={subCategoriaSeleccionada}
                            onCategoria={(cat) => {
                                setCategoriaSeleccionada(cat)
                                setSubCategoriaSeleccionada(null)
                            }}
                            onSubCategoria={setSubCategoriaSeleccionada}
                        />
                    </div>

                    <div style={{flex: 1, minWidth: 0}}>
                        <GridProductos
                            cargando={loading}
                            productos={productosFiltrados}
                            onVerProducto={setProductoDetalle}
                        />
                    </div>
                </div>

                <ModalProducto
                    producto={productoDetalle}
                    onClose={() => setProductoDetalle(null)}
                    api={api}
                />
            </main>
        </>
    )
}