import {
    Badge, Button, Group, Modal, NumberInput, Select,
    Stack, Switch, Text, TextInput
} from "@mantine/core";
import {DateTimePicker} from "@mantine/dates";
import {DataTable} from "mantine-datatable";
import {useEffect, useState} from "react";
import {Api_manager} from "@/Service/Api_manager.jsx";
import {useLoading} from "../../Context/LoadingContext.jsx";
import {noti_util} from "@/Utils/Toast.jsx";

const TIPOS_DESCUENTO = [
    {value: "porcentaje", label: "Porcentaje (%)"},
    {value: "monto_fijo", label: "Monto fijo (S/)"},
];

const APLICA_A = [
    {value: "variante", label: "Variante"},
    {value: "producto_base", label: "Producto"},
    {value: "categoria", label: "Categoría"},
];

const emptyForm = {
    nombre: "",
    tipo_descuento: "porcentaje",
    valor: "",
    aplica_a: "variante",
    categoria_id: null,
    producto_base_id: null,
    variante_id: null,
    valido_desde: null,
    valido_hasta: null,
};

function useModal(emptyForm) {
    const [modal, setModal] = useState({open: false, data: null});
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const abrir = (data = null, formInicial = emptyForm) => {
        setForm(formInicial);
        setModal({open: true, data});
    };
    const cerrar = () => setModal({open: false, data: null});
    const guardar = async (fn) => {
        setSaving(true);
        try {
            await fn();
            cerrar();
        } catch (e) {
            noti_util("error", e?.message ?? String(e));
        } finally {
            setSaving(false);
        }
    };
    return {modal, form, setForm, saving, abrir, cerrar, guardar};
}

function BotonesModal({onClose, onGuardar, saving, esEdicion}) {
    return (
        <Group justify="flex-end" mt="sm">
            <Button variant="default" onClick={onClose}>Cancelar</Button>
            <Button color="green" loading={saving} onClick={onGuardar}>
                {esEdicion ? "Guardar cambios" : "Crear"}
            </Button>
        </Group>
    );
}

// ── Badge helpers ─────────────────────────────────────────────────────────────
function BadgeTipo({tipo}) {
    return (
        <Badge color={tipo === "porcentaje" ? "blue" : "teal"} variant="light">
            {tipo === "porcentaje" ? "%" : "S/"}
        </Badge>
    );
}

function BadgeAplica({aplica}) {
    const colores = {variante: "violet", producto_base: "blue", categoria: "orange"};
    const labels = {variante: "Variante", producto_base: "Producto", categoria: "Categoría"};
    return <Badge color={colores[aplica] ?? "gray"} variant="light">{labels[aplica] ?? aplica}</Badge>;
}

function BadgeVigencia({desde, hasta}) {
    const ahora = new Date();
    const fin = new Date(hasta);
    const inicio = new Date(desde);
    let color = "green", label = "Vigente";
    if (ahora < inicio) {color = "blue"; label = "Próxima";}
    else if (ahora > fin) {color = "red"; label = "Expirada";}
    return <Badge color={color} variant="light">{label}</Badge>;
}

const fmt_fecha = (f) => f ? new Date(f).toLocaleDateString("es-PE", {
    day: "2-digit", month: "short", year: "numeric"
}) : "—";

// ── Modal confirmación eliminar ───────────────────────────────────────────────
function ModalEliminar({opened, onClose, onConfirmar, saving, nombre}) {
    return (
        <Modal opened={opened} onClose={onClose} centered size="sm"
               title={<Text fw={700}>Eliminar promoción</Text>}>
            <Stack gap="sm">
                <Text size="sm">¿Estás seguro de eliminar <Text span fw={600}>"{nombre}"</Text>? Esta acción no se puede deshacer.</Text>
                <Group justify="flex-end" mt="sm">
                    <Button variant="default" onClick={onClose}>Cancelar</Button>
                    <Button color="red" loading={saving} onClick={onConfirmar}>Eliminar</Button>
                </Group>
            </Stack>
        </Modal>
    );
}

// ── Modal crear/editar ────────────────────────────────────────────────────────
function ModalPromocion({modal, form, setForm, saving, onClose, onGuardar, opsCat, opsProd, opsVar}) {
    const esEdicion = !!modal.data;

    const targetOps = form.aplica_a === "categoria" ? opsCat
        : form.aplica_a === "producto_base" ? opsProd
            : opsVar;

    const targetLabel = form.aplica_a === "categoria" ? "Categoría"
        : form.aplica_a === "producto_base" ? "Producto"
            : "Variante (SKU)";

    const targetValue = form.aplica_a === "categoria" ? form.categoria_id
        : form.aplica_a === "producto_base" ? form.producto_base_id
            : form.variante_id;

    const setTarget = (val) => {
        if (form.aplica_a === "categoria") setForm({...form, categoria_id: val, producto_base_id: null, variante_id: null});
        else if (form.aplica_a === "producto_base") setForm({...form, producto_base_id: val, categoria_id: null, variante_id: null});
        else setForm({...form, variante_id: val, categoria_id: null, producto_base_id: null});
    };

    return (
        <Modal opened={modal.open} onClose={onClose} centered size="lg"
               title={<Text fw={700}>{esEdicion ? "Editar promoción" : "Nueva promoción"}</Text>}>
            <Stack gap="sm">
                <TextInput label="Nombre" placeholder="Ej. Descuento verano" required
                           value={form.nombre} onChange={e => setForm({...form, nombre: e.currentTarget.value})}/>

                <Group grow>
                    <Select label="Tipo de descuento" data={TIPOS_DESCUENTO}
                            value={form.tipo_descuento}
                            onChange={val => setForm({...form, tipo_descuento: val})}/>
                    <NumberInput
                        label={form.tipo_descuento === "porcentaje" ? "Valor (%)" : "Valor (S/)"}
                        placeholder={form.tipo_descuento === "porcentaje" ? "Ej. 15" : "Ej. 20.00"}
                        min={0} max={form.tipo_descuento === "porcentaje" ? 100 : undefined}
                        decimalScale={2} step={form.tipo_descuento === "porcentaje" ? 1 : 10}
                        value={form.valor} onChange={val => setForm({...form, valor: val})}/>
                </Group>

                <Group grow>
                    <Select label="Aplica a" data={APLICA_A}
                            value={form.aplica_a}
                            onChange={val => setForm({...form, aplica_a: val, categoria_id: null, producto_base_id: null, variante_id: null})}/>
                    <Select label={targetLabel} placeholder="Seleccionar..." searchable clearable
                            data={targetOps} value={targetValue} onChange={setTarget}/>
                </Group>

                <Group grow>
                    <DateTimePicker label="Válido desde" placeholder="Seleccionar fecha..."
                                   value={form.valido_desde}
                                   onChange={val => setForm({...form, valido_desde: val})}
                                   minDate={new Date()}/>
                    <DateTimePicker label="Válido hasta" placeholder="Seleccionar fecha..."
                                   value={form.valido_hasta}
                                   onChange={val => setForm({...form, valido_hasta: val})}
                                   minDate={form.valido_desde ?? new Date()}/>
                </Group>



                <BotonesModal onClose={onClose} onGuardar={onGuardar} saving={saving} esEdicion={esEdicion}/>
            </Stack>
        </Modal>
    );
}

// ── Tabla ─────────────────────────────────────────────────────────────────────
function TablaPromociones({records, search, setSearch, soloActivas, setSoloActivas, onCrear, onEditar, onToggleEstado, onEliminar}) {
    return (
        <div className="flex flex-col border px-4 py-4 rounded-2xl">
            <div className="flex justify-between items-center mb-3 flex-wrap gap-3">
                <div className="flex gap-3 items-center">
                    <Text fw={700} size="xl">Promociones</Text>
                    <Button color="green" onClick={onCrear}><i className="fas fa-plus"/></Button>
                </div>
                <Group gap="sm">
                    <Switch label="Solo activas" checked={soloActivas}
                            onChange={e => setSoloActivas(e.currentTarget.checked)}/>
                    <TextInput placeholder="Buscar promoción..." value={search}
                               onChange={e => setSearch(e.currentTarget.value)}/>
                </Group>
            </div>

            <DataTable
                noRecordsText="Sin resultados"
                withTableBorder withColumnBorders striped highlightOnHover idAccessor="id"
                columns={[
                    {accessor: "nombre", title: "Nombre", width: 200},
                    {
                        accessor: "tipo_descuento", title: "Tipo",
                        render: ({tipo_descuento, valor}) => (
                            <Group gap={4}>
                                <BadgeTipo tipo={tipo_descuento}/>
                                <Text size="sm" fw={500}>
                                    {tipo_descuento === "porcentaje"
                                        ? `${Number(valor).toFixed(0)}%`
                                        : `S/ ${Number(valor).toFixed(2)}`}
                                </Text>
                            </Group>
                        )
                    },
                    {
                        accessor: "aplica_a", title: "Aplica a",
                        render: ({aplica_a}) => <BadgeAplica aplica={aplica_a}/>
                    },
                    {
                        accessor: "valido_desde", title: "Desde",
                        render: ({valido_desde}) => <Text size="sm">{fmt_fecha(valido_desde)}</Text>
                    },
                    {
                        accessor: "valido_hasta", title: "Hasta",
                        render: ({valido_hasta}) => <Text size="sm">{fmt_fecha(valido_hasta)}</Text>
                    },
                    {
                        accessor: "vigencia", title: "Vigencia",
                        render: ({valido_desde, valido_hasta}) => (
                            <BadgeVigencia desde={valido_desde} hasta={valido_hasta}/>
                        )
                    },
                    {
                        accessor: "activa", title: "Estado",
                        render: ({activa}) => (
                            <Badge color={activa ? "green" : "gray"} variant="light">
                                {activa ? "Activa" : "Inactiva"}
                            </Badge>
                        )
                    },
                    {
                        accessor: "acciones", title: "",
                        render: (p) => (
                            <Group gap={4}>
                                <Button size="xs" color="dark" onClick={() => onEditar(p)}>
                                    <i className="fas fa-edit"/>
                                </Button>
                                <Button size="xs" color={p.activa ? "orange" : "green"}
                                        onClick={() => onToggleEstado(p)}>
                                    <i className={`fas ${p.activa ? "fa-eye-slash" : "fa-eye"}`}/>
                                </Button>
                                <Button size="xs" color="red" onClick={() => onEliminar(p)}>
                                    <i className="fas fa-trash"/>
                                </Button>
                            </Group>
                        )
                    },
                ]}
                records={records}
            />
        </div>
    );
}

// ── Página principal ──────────────────────────────────────────────────────────
export default function Promociones() {
    const api = Api_manager();
    const {setLoading} = useLoading();

    const [promociones, setPromociones] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [productos, setProductos] = useState([]);
    const [variantes, setVariantes] = useState([]);
    const [search, setSearch] = useState("");
    const [soloActivas, setSoloActivas] = useState(false);
    const [eliminar, setEliminar] = useState({open: false, data: null, saving: false});

    const promo = useModal(emptyForm);

    useEffect(() => {
        cargarTodo();
    }, []);

    const cargarTodo = async () => {
        setLoading(true);
        try {
            const [promos, cats, prods] = await Promise.all([
                api.promociones.listar(),
                api.categorias.listar_padres(),
                api.productos.listar_todos(),
            ]);
            setPromociones(promos ?? []);

            // Opciones categorías (padres e hijos)
            const opsCat = (cats ?? []).flatMap(c => {
                const hijos = c.hijos ?? [];
                if (hijos.length > 0) return hijos.map(h => ({value: h.id, label: `${c.nombre} > ${h.nombre}`}));
                return [{value: c.id, label: c.nombre}];
            });
            setCategorias(opsCat);

            // Opciones productos y variantes
            const opsProd = [];
            const opsVar = [];
            for (const p of (prods ?? [])) {
                const base = p.ProductoBase;
                opsProd.push({value: base.id, label: base.nombre});
                for (const vc of (p.VariantesCompletas ?? [])) {
                    opsVar.push({value: vc.Variante.id, label: `${base.nombre} — ${vc.Variante.sku}`});
                }
            }
            setProductos(opsProd);
            setVariantes(opsVar);
        } catch (e) {
            noti_util("error", "Error cargando datos: " + e);
        } finally {
            setLoading(false);
        }
    };

    // ── Acciones ──────────────────────────────────────────────────────────────
    const guardarPromo = () => promo.guardar(async () => {
        const payload = {
            ...promo.form,
            valido_desde: promo.form.valido_desde?.toISOString(),
            valido_hasta: promo.form.valido_hasta?.toISOString(),
        };
        if (promo.modal.data) await api.promociones.actualizar(promo.modal.data.id, payload);
        else await api.promociones.crear(payload);
        await cargarTodo();
    });

    const toggleEstado = async (p) => {
        try {
            await api.promociones.cambiar_estado(p.id);
            await cargarTodo();
        } catch (e) {
            noti_util("error", e?.message ?? String(e));
        }
    };

    const confirmarEliminar = async () => {
        setEliminar(prev => ({...prev, saving: true}));
        try {
            await api.promociones.eliminar(eliminar.data.id);
            setEliminar({open: false, data: null, saving: false});
            await cargarTodo();
        } catch (e) {
            noti_util("error", e?.message ?? String(e));
            setEliminar(prev => ({...prev, saving: false}));
        }
    };

    // ── Filtros ───────────────────────────────────────────────────────────────
    const records = promociones
        .filter(p => !soloActivas || p.activa)
        .filter(p => !search.trim() || p.nombre.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="flex flex-col gap-6" style={{position: "relative"}}>
            <ModalPromocion
                modal={promo.modal} form={promo.form} setForm={promo.setForm}
                saving={promo.saving} onClose={promo.cerrar} onGuardar={guardarPromo}
                opsCat={categorias} opsProd={productos} opsVar={variantes}
            />
            <ModalEliminar
                opened={eliminar.open}
                onClose={() => setEliminar({open: false, data: null, saving: false})}
                onConfirmar={confirmarEliminar}
                saving={eliminar.saving}
                nombre={eliminar.data?.nombre ?? ""}
            />
            <TablaPromociones
                records={records}
                search={search} setSearch={setSearch}
                soloActivas={soloActivas} setSoloActivas={setSoloActivas}
                onCrear={() => promo.abrir(null, emptyForm)}
                onEditar={p => promo.abrir(p, {
                    nombre: p.nombre,
                    tipo_descuento: p.tipo_descuento,
                    valor: Number(p.valor),
                    aplica_a: p.aplica_a,
                    categoria_id: p.categoria_id ?? null,
                    producto_base_id: p.producto_base_id ?? null,
                    variante_id: p.variante_id ?? null,

                    valido_desde: p.valido_desde ? new Date(p.valido_desde) : null,
                    valido_hasta: p.valido_hasta ? new Date(p.valido_hasta) : null,
                })}
                onToggleEstado={toggleEstado}
                onEliminar={p => setEliminar({open: true, data: p, saving: false})}
            />
        </div>
    );
}