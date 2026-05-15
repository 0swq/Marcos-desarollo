import {Badge, Box, Group, Loader, Modal, Stack, Text, Timeline} from "@mantine/core";
import {useEffect, useState} from "react";
import {Api_manager} from "@/Service/Api_manager.jsx";
import {noti_util} from "@/Utils/Toast.jsx";


const fmt_precio = (v) => "S/ " + Number(v ?? 0).toFixed(2);

const fmt_fecha = (f) => f ? new Date(f).toLocaleDateString("es-PE", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
}) : "—";

function BadgeEstado({estado}) {
    const colores = {
        pendiente: "yellow",
        confirmado: "blue",
        completado: "green",
        cancelado: "red",
    };
    return (
        <Badge color={colores[estado] ?? "gray"} variant="light">
            {estado?.charAt(0).toUpperCase() + estado?.slice(1)}
        </Badge>
    );
}

function BadgePago({estado, metodo}) {
    if (!estado) return <Badge color="gray" variant="outline">Sin pago</Badge>;
    return (
        <Group gap={4}>
            <Badge color={estado === "aprobado" ? "green" : "red"} variant="light">
                {estado.charAt(0).toUpperCase() + estado.slice(1)}
            </Badge>
            {metodo && <Badge color="gray" variant="outline" size="xs">{metodo}</Badge>}
        </Group>
    );
}

function BadgeEntrega({tipo}) {
    return (
        <Badge color={tipo === "DELIVERY" ? "blue" : "teal"} variant="light">
            {tipo === "DELIVERY" ? "🚚 Delivery" : "🏪 Recojo en tienda"}
        </Badge>
    );
}


function ModalDetalle({pedido_id, onClose}) {
    const api = Api_manager();
    const [detalle, setDetalle] = useState(null);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        if (!pedido_id) return;
        setCargando(true);
        api.pedidos.mi_detalle(pedido_id)
            .then(setDetalle)
            .catch(() => noti_util("error", "No se pudo cargar el detalle"))
            .finally(() => setCargando(false));
    }, [pedido_id]);

    return (
        <Modal
            opened={!!pedido_id}
            onClose={onClose}
            centered
            size="lg"
            title={<Text fw={700}>Detalle del pedido</Text>}
        >
            {cargando
                ? <Group justify="center" py="xl"><Loader size="sm"/></Group>
                : detalle && (
                    <Stack gap="md">
                        {/* Info general */}
                        <Box style={{background: "var(--mantine-color-gray-0)", borderRadius: 8, padding: 12}}>
                            <Group justify="space-between" mb={6}>
                                <Text size="xs" c="dimmed" ff="monospace">{detalle.id}</Text>
                                <BadgeEstado estado={detalle.estado}/>
                            </Group>
                            <Group justify="space-between">
                                <Text size="sm" c="dimmed">{fmt_fecha(detalle.fecha)}</Text>
                                <BadgeEntrega tipo={detalle.tipo_entrega}/>
                            </Group>
                        </Box>

                        {/* Dirección si es delivery */}
                        {detalle.tipo_entrega === "DELIVERY" && detalle.direccion_calle && (
                            <Box>
                                <Text size="xs" fw={600} tt="uppercase" c="dimmed" mb={4}>Dirección de entrega</Text>
                                <Text size="sm">{detalle.direccion_calle}, {detalle.direccion_ciudad}</Text>
                                {detalle.direccion_referencia && (
                                    <Text size="xs" c="dimmed">Ref: {detalle.direccion_referencia}</Text>
                                )}
                            </Box>
                        )}

                        {/* Items */}
                        <Box>
                            <Text size="xs" fw={600} tt="uppercase" c="dimmed" mb={8}>Productos</Text>
                            <Stack gap={6}>
                                {(detalle.items ?? []).map((item, i) => (
                                    <Group key={i} justify="space-between"
                                           style={{borderBottom: "1px solid var(--mantine-color-gray-2)", paddingBottom: 6}}>
                                        <Box>
                                            <Text size="sm" fw={500}>{item.nombre_ref}</Text>
                                            <Text size="xs" c="dimmed">SKU: {item.sku_ref} · x{item.cantidad}</Text>
                                        </Box>
                                        <Box ta="right">
                                            <Text size="sm" fw={500}>{fmt_precio(item.precio_unitario * item.cantidad)}</Text>
                                            {item.descuento_unitario > 0 && (
                                                <Text size="xs" c="green">
                                                    -{fmt_precio(item.descuento_unitario * item.cantidad)}
                                                </Text>
                                            )}
                                        </Box>
                                    </Group>
                                ))}
                            </Stack>
                        </Box>

                        {/* Resumen de precios */}
                        <Box style={{borderTop: "1px solid var(--mantine-color-gray-2)", paddingTop: 12}}>
                            <Group justify="space-between">
                                <Text size="sm" c="dimmed">Subtotal</Text>
                                <Text size="sm">{fmt_precio(detalle.subtotal)}</Text>
                            </Group>
                            {detalle.descuento_aplicado > 0 && (
                                <Group justify="space-between">
                                    <Text size="sm" c="dimmed">
                                        Descuento {detalle.cupon_codigo && `(${detalle.cupon_codigo})`}
                                    </Text>
                                    <Text size="sm" c="green">-{fmt_precio(detalle.descuento_aplicado)}</Text>
                                </Group>
                            )}
                            {detalle.costo_envio > 0 && (
                                <Group justify="space-between">
                                    <Text size="sm" c="dimmed">Envío</Text>
                                    <Text size="sm">{fmt_precio(detalle.costo_envio)}</Text>
                                </Group>
                            )}
                            <Group justify="space-between" mt={6}>
                                <Text fw={600}>Total</Text>
                                <Text fw={600} size="lg">{fmt_precio(detalle.total)}</Text>
                            </Group>
                        </Box>

                        {/* Pago */}
                        <Box>
                            <Text size="xs" fw={600} tt="uppercase" c="dimmed" mb={6}>Pago</Text>
                            <BadgePago estado={detalle.pago_estado} metodo={detalle.pago_metodo}/>
                        </Box>
                    </Stack>
                )
            }
        </Modal>
    );
}


function TarjetaPedido({pedido, onClick}) {
    return (
        <Box
            onClick={onClick}
            style={{
                border: "1px solid var(--mantine-color-gray-3)",
                borderRadius: 12,
                padding: 16,
                cursor: "pointer",
                transition: "box-shadow 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.08)"}
            onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
        >
            <Group justify="space-between" mb={8}>
                <Text size="xs" c="dimmed" ff="monospace">
                    #{pedido.id.slice(0, 8).toUpperCase()}
                </Text>
                <BadgeEstado estado={pedido.estado}/>
            </Group>

            <Group justify="space-between" mb={6}>
                <BadgeEntrega tipo={pedido.tipo_entrega}/>
                <BadgePago estado={pedido.pago_estado} metodo={pedido.pago_metodo}/>
            </Group>

            <Group justify="space-between" mt={8}>
                <Text size="xs" c="dimmed">{fmt_fecha(pedido.fecha)}</Text>
                <Text fw={600} size="md">{fmt_precio(pedido.total)}</Text>
            </Group>
        </Box>
    );
}


export default function MisPedidos() {
    const api = Api_manager();
    const [pedidos, setPedidos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);

    useEffect(() => {
        api.pedidos.mis_pedidos()
            .then(data => setPedidos(data ?? []))
            .catch(() => noti_util("error", "No se pudieron cargar tus pedidos"))
            .finally(() => setCargando(false));
    }, []);

    return (
        <Box>
            <ModalDetalle
                pedido_id={pedidoSeleccionado}
                onClose={() => setPedidoSeleccionado(null)}
            />

            {cargando
                ? <Group justify="center" py="xl"><Loader/></Group>
                : pedidos.length === 0
                    ? (
                        <Stack align="center" py="xl" gap="xs">
                            <Text size="xl">🛒</Text>
                            <Text fw={500}>Aún no tienes pedidos</Text>
                            <Text size="sm" c="dimmed">Cuando realices una compra aparecerá aquí.</Text>
                        </Stack>
                    )
                    : (
                        <Stack gap="sm">
                            {pedidos.map(p => (
                                <TarjetaPedido
                                    key={p.id}
                                    pedido={p}
                                    onClick={() => setPedidoSeleccionado(p.id)}
                                />
                            ))}
                        </Stack>
                    )
            }
        </Box>
    );
}
