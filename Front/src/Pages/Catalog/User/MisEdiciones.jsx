import { useEffect, useState } from 'react'
import { Api_manager } from "@/Service/Api_manager.jsx"
import { Loader, Text } from '@mantine/core'

const ESTADOS = {
    pendiente:   { label: 'Pendiente',   color: '#f59e0b', bg: '#fef3c7' },
    procesando:  { label: 'Procesando',  color: '#3b82f6', bg: '#eff6ff' },
    segmentando: { label: 'Segmentando', color: '#8b5cf6', bg: '#f5f3ff' },
    generando:   { label: 'Generando',   color: '#06b6d4', bg: '#ecfeff' },
    listo:       { label: 'Listo',       color: '#10b981', bg: '#d1fae5' },
    error:       { label: 'Error',       color: '#ef4444', bg: '#fee2e2' },
}

function EstadoBadge({ estado }) {
    const e = ESTADOS[estado] ?? { label: estado, color: '#6b7280', bg: '#f3f4f6' }
    return (
        <span style={{
            display: 'inline-block',
            padding: '2px 10px',
            borderRadius: 99,
            fontSize: 11,
            fontWeight: 600,
            background: e.bg,
            color: e.color,
            letterSpacing: '0.03em',
        }}>
            {e.label}
        </span>
    )
}

function EdicionCard({ item }) {
    const [expandida, setExpandida] = useState(false)

    const fecha = new Date(item.created_at).toLocaleDateString('es-PE', {
        day: '2-digit', month: 'short', year: 'numeric',
    })

    return (
        <div style={{
            border: '0.5px solid var(--color-border-tertiary, #e5e7eb)',
            borderRadius: 12,
            overflow: 'hidden',
            background: 'var(--color-background-primary, #fff)',
            transition: 'box-shadow 0.15s',
        }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
        >
            <div style={{ display: 'flex', height: 160, background: '#f8fafc' }}>
                <div style={{ flex: 1, position: 'relative', borderRight: '0.5px solid #e5e7eb' }}>
                    {item.url_original ? (
                        <img
                            src={item.url_original}
                            alt="Original"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontSize: 11, color: '#9ca3af' }}>Sin imagen</span>
                        </div>
                    )}
                    <span style={{
                        position: 'absolute', bottom: 6, left: 6,
                        background: 'rgba(0,0,0,0.55)', color: '#fff',
                        fontSize: 10, padding: '2px 7px', borderRadius: 99,
                    }}>Original</span>
                </div>

                <div style={{ flex: 1, position: 'relative' }}>
                    {item.url_resultado ? (
                        <>
                            <img
                                src={item.url_resultado}
                                alt="Resultado"
                                style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
                                onClick={() => setExpandida(true)}
                            />
                            <span style={{
                                position: 'absolute', bottom: 6, left: 6,
                                background: 'rgba(24,95,165,0.75)', color: '#fff',
                                fontSize: 10, padding: '2px 7px', borderRadius: 99,
                            }}>Resultado</span>
                        </>
                    ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 6 }}>
                            {['pendiente', 'procesando', 'segmentando', 'generando'].includes(item.estado) && (
                                <Loader size="sm" color="#378ADD" />
                            )}
                            <span style={{ fontSize: 11, color: '#9ca3af' }}>
                                {item.estado === 'error' ? 'Error al generar' : 'Generando...'}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <div style={{ minWidth: 0 }}>
                    <Text size="sm" fw={500} lineClamp={1} style={{ color: 'var(--color-text-primary, #111)' }}>
                        {item.producto_nombre}
                    </Text>
                    <Text size="xs" style={{ color: 'var(--color-text-secondary, #6b7280)' }}>{fecha}</Text>
                </div>
                <EstadoBadge estado={item.estado} />
            </div>

            {expandida && (
                <div
                    style={{
                        position: 'fixed', inset: 0, zIndex: 200,
                        background: 'rgba(0,0,0,0.85)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                    onClick={() => setExpandida(false)}
                >
                    <img
                        src={item.url_resultado}
                        alt="Resultado ampliado"
                        style={{ maxWidth: '90vw', maxHeight: '90vh', borderRadius: 12, boxShadow: '0 8px 40px rgba(0,0,0,0.4)' }}
                        onClick={e => e.stopPropagation()}
                    />
                </div>
            )}
        </div>
    )
}

export default function MisEdiciones() {
    const api = Api_manager()
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [pagina, setPagina] = useState(1)
    const [total, setTotal] = useState(0)
    const POR_PAGINA = 12

    useEffect(() => {
        const cargar = async () => {
            setLoading(true)
            try {
                const data = await api.replicas.historial(pagina, POR_PAGINA)
                setItems(data.items ?? [])
                setTotal(data.total ?? 0)
            } catch (e) {
                console.error('Error cargando ediciones:', e)
            } finally {
                setLoading(false)
            }
        }
        cargar()
    }, [pagina])

    const paginas = Math.ceil(total / POR_PAGINA)

    return (
        <div style={{ padding: '4px 0 16px' }}>
            <div style={{ marginBottom: 16 }}>
                <Text fw={600} size="md" style={{ color: 'var(--color-text-primary, #111)' }}>
                    Mis ediciones con IA
                </Text>
                <Text size="xs" style={{ color: 'var(--color-text-secondary, #6b7280)' }}>
                    Pruebas de textura de melamina que realizaste
                </Text>
            </div>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
                    <Loader size="md" color="#378ADD" />
                </div>
            ) : items.length === 0 ? (
                <div style={{
                    textAlign: 'center', padding: '40px 20px',
                    border: '0.5px dashed #d1d5db', borderRadius: 12,
                    color: '#9ca3af',
                }}>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>0 Resultados.</div>
                    <Text size="sm">Aún no realizaste ninguna prueba de textura.</Text>
                    <Text size="xs" mt={4}>Andá a la tienda, elegí un producto de melamina y probá el botón "Probar textura".</Text>
                </div>
            ) : (
                <>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                        gap: 14,
                    }}>
                        {items.map(item => (
                            <EdicionCard key={item.id} item={item} />
                        ))}
                    </div>

                    {paginas > 1 && (
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 20 }}>
                            {Array.from({ length: paginas }, (_, i) => i + 1).map(p => (
                                <button
                                    key={p}
                                    onClick={() => setPagina(p)}
                                    style={{
                                        width: 32, height: 32, borderRadius: 8,
                                        border: p === pagina ? '2px solid #378ADD' : '1px solid #e5e7eb',
                                        background: p === pagina ? '#E6F1FB' : '#fff',
                                        color: p === pagina ? '#185FA5' : '#6b7280',
                                        fontWeight: p === pagina ? 600 : 400,
                                        cursor: 'pointer', fontSize: 13,
                                    }}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    )
}