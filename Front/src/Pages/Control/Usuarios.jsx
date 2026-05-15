import {
    Badge, Button, Group, Modal, Select, Stack, Text, TextInput
} from "@mantine/core";

import {DatePickerInput} from "@mantine/dates";
import {DataTable} from "mantine-datatable";
import {useEffect, useState} from "react";
import {Api_manager} from "@/Service/Api_manager.jsx";
import {useLoading} from "../../Context/LoadingContext.jsx";
import {noti_util} from "@/Utils/Toast.jsx";

const ROLES = ["admin", "cliente"];
const TIPOS = ["minorista", "mayorista"];
const NIVELES = [
    {value: "bronce", label: "Bronce"},
    {value: "plata", label: "Plata"},
    {value: "oro", label: "Oro"},
    {value: "platino", label: "Platino"},
];

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


function BadgeRol({rol}) {
    return <Badge color={rol === "admin" ? "violet" : "blue"} variant="light">{rol}</Badge>;
}

function BadgeTipo({tipo}) {
    return <Badge color={tipo === "mayorista" ? "teal" : "gray"} variant="light">{tipo}</Badge>;
}

function BadgeNivel({nivel, validoHasta}) {
    if (!nivel) return <Badge color="gray" variant="outline">Sin nivel</Badge>;
    const colores = {bronce: "orange", plata: "gray", oro: "yellow", platino: "cyan"};
    const expirado = validoHasta && new Date(validoHasta) < new Date();
    return (
        <Group gap={4}>
            <Badge color={expirado ? "red" : (colores[nivel] ?? "blue")} variant="light">
                {nivel.charAt(0).toUpperCase() + nivel.slice(1)}
            </Badge>
            {expirado && <Badge size="xs" color="red" variant="outline">Expirado</Badge>}
        </Group>
    );
}

function BadgeEstado({activo}) {
    return <Badge color={activo ? "green" : "red"} variant="light">{activo ? "Activo" : "Inactivo"}</Badge>;
}


function ModalNivel({modal, form, setForm, saving, onClose, onGuardar}) {
    return (
        <Modal opened={modal.open} onClose={onClose} centered size="sm"
               title={<Text fw={700}>Cambiar nivel — <Text span c="dimmed" fw={400}>{modal.data?.id}</Text></Text>}>
            <Stack gap="sm">
                <Select
                    label="Nivel"
                    placeholder="Seleccionar nivel..."
                    data={NIVELES}
                    value={form.nivel}
                    onChange={val => setForm({...form, nivel: val})}
                    clearable
                />
                <DatePickerInput
                    label="Válido hasta"
                    placeholder="Seleccionar fecha..."
                    value={form.valido_hasta}
                    onChange={val => setForm({...form, valido_hasta: val})}
                    minDate={new Date()}
                    clearable
                />
                <BotonesModal onClose={onClose} onGuardar={onGuardar} saving={saving} esEdicion={true}/>
            </Stack>
        </Modal>
    );
}


function ModalDetalle({modal, onClose, onCambiarRol, onCambiarNivel, onToggleEstado, savingRol, savingEstado}) {
    const u = modal.data;
    if (!u) return null;
    const nivelExpirado = u.nivel_valido_hasta && new Date(u.nivel_valido_hasta) < new Date();

    return (
        <Modal opened={modal.open} onClose={onClose} centered size="md"
               title={<Text fw={700}>Detalle de usuario</Text>}>
            <Stack gap="xs">
                {/* ID */}
                <Group justify="space-between">
                    <Text size="sm" c="dimmed">ID</Text>
                    <Text size="sm" ff="monospace" style={{wordBreak: "break-all", maxWidth: 280}}>{u.id}</Text>
                </Group>

                {/* Creado */}
                <Group justify="space-between">
                    <Text size="sm" c="dimmed">Registrado</Text>
                    <Text size="sm">{u.creado_en ? new Date(u.creado_en).toLocaleDateString("es-PE", {
                        day: "2-digit", month: "short", year: "numeric"
                    }) : "—"}</Text>
                </Group>

                {/* Rol */}
                <Group justify="space-between">
                    <Text size="sm" c="dimmed">Rol</Text>
                    <Group gap={8}>
                        <BadgeRol rol={u.rol}/>
                        <Button size="xs" variant="light" color="violet" loading={savingRol}
                                onClick={() => onCambiarRol(u)}>
                            <i className="fas fa-exchange-alt" style={{marginRight: 4}}/>
                            {u.rol === "admin" ? "Quitar admin" : "Hacer admin"}
                        </Button>
                    </Group>
                </Group>

                {/* Tipo */}
                <Group justify="space-between">
                    <Text size="sm" c="dimmed">Tipo</Text>
                    <BadgeTipo tipo={u.tipo_usuario}/>
                </Group>

                {/* Nivel */}
                <Group justify="space-between">
                    <Text size="sm" c="dimmed">Nivel</Text>
                    <Group gap={8}>
                        <BadgeNivel nivel={u.nivel} validoHasta={u.nivel_valido_hasta}/>
                        <Button size="xs" variant="light" color="teal"
                                onClick={() => onCambiarNivel(u)}>
                            <i className="fas fa-medal" style={{marginRight: 4}}/>Cambiar
                        </Button>
                    </Group>
                </Group>

                {/* Nivel válido hasta */}
                {u.nivel && (
                    <Group justify="space-between">
                        <Text size="sm" c="dimmed">Nivel válido hasta</Text>
                        <Text size="sm" c={nivelExpirado ? "red" : undefined}>
                            {u.nivel_valido_hasta
                                ? new Date(u.nivel_valido_hasta).toLocaleDateString("es-PE", {
                                    day: "2-digit", month: "short", year: "numeric"
                                })
                                : "Sin vencimiento"}
                        </Text>
                    </Group>
                )}

                {/* Estado */}
                <Group justify="space-between">
                    <Text size="sm" c="dimmed">Estado</Text>
                    <Group gap={8}>
                        <BadgeEstado activo={u.activo}/>
                        <Button size="xs" variant="light" color={u.activo ? "red" : "green"}
                                loading={savingEstado} onClick={() => onToggleEstado(u)}>
                            <i className={`fas ${u.activo ? "fa-ban" : "fa-check"}`} style={{marginRight: 4}}/>
                            {u.activo ? "Desactivar" : "Activar"}
                        </Button>
                    </Group>
                </Group>

                <Group justify="flex-end" mt="sm">
                    <Button variant="default" onClick={onClose}>Cerrar</Button>
                </Group>
            </Stack>
        </Modal>
    );
}

// Tabla principal
function TablaUsuarios({records, search, setSearch, filtroRol, setFiltroRol, filtroTipo, setFiltroTipo, onVerDetalle}) {
    return (
        <div className="flex flex-col border px-4 py-4 rounded-2xl">
            {/* Cabecera */}
            <div className="flex justify-between items-center mb-3 flex-wrap gap-3">
                <Text fw={700} size="xl">Usuarios</Text>
                <Group gap="sm">
                    <Select
                        placeholder="Todos los roles"
                        data={ROLES.map(r => ({value: r, label: r.charAt(0).toUpperCase() + r.slice(1)}))}
                        value={filtroRol}
                        onChange={setFiltroRol}
                        clearable
                        size="xs"
                        style={{width: 140}}
                    />
                    <Select
                        placeholder="Todos los tipos"
                        data={TIPOS.map(t => ({value: t, label: t.charAt(0).toUpperCase() + t.slice(1)}))}
                        value={filtroTipo}
                        onChange={setFiltroTipo}
                        clearable
                        size="xs"
                        style={{width: 150}}
                    />
                    <TextInput
                        placeholder="Buscar usuario..."
                        value={search}
                        onChange={e => setSearch(e.currentTarget.value)}
                        size="xs"
                        style={{width: 200}}
                    />
                </Group>
            </div>

            {/* Tabla */}
            <DataTable
                noRecordsText="Sin resultados"
                withTableBorder
                withColumnBorders
                striped
                highlightOnHover
                idAccessor="id"
                columns={[
                    {
                        accessor: "id",
                        title: "ID",
                        width: 200,
                        render: ({id}) => (
                            <Text size="xs" ff="monospace" style={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                maxWidth: 180
                            }} title={id}>{id}</Text>
                        )
                    },
                    {
                        accessor: "rol",
                        title: "Rol",
                        render: ({rol}) => <BadgeRol rol={rol}/>
                    },
                    {
                        accessor: "tipo_usuario",
                        title: "Tipo",
                        render: ({tipo_usuario}) => <BadgeTipo tipo={tipo_usuario}/>
                    },
                    {
                        accessor: "nivel",
                        title: "Nivel",
                        render: ({nivel, nivel_valido_hasta}) => (
                            <BadgeNivel nivel={nivel} validoHasta={nivel_valido_hasta}/>
                        )
                    },
                    {
                        accessor: "activo",
                        title: "Estado",
                        render: ({activo}) => <BadgeEstado activo={activo}/>
                    },
                    {
                        accessor: "creado_en",
                        title: "Registro",
                        render: ({creado_en}) => (
                            <Text size="xs" c="dimmed">
                                {creado_en ? new Date(creado_en).toLocaleDateString("es-PE", {
                                    day: "2-digit", month: "short", year: "numeric"
                                }) : "—"}
                            </Text>
                        )
                    },
                    {
                        accessor: "acciones",
                        title: "",
                        render: (u) => (
                            <Button size="xs" color="dark" onClick={() => onVerDetalle(u)}>
                                <i className="fas fa-eye"/>
                            </Button>
                        )
                    },
                ]}
                records={records}
            />
        </div>
    );
}

// Página principal
export default function Usuarios() {
    const api = Api_manager();
    const {setLoading} = useLoading();

    const [usuarios, setUsuarios] = useState([]);
    const [search, setSearch] = useState("");
    const [filtroRol, setFiltroRol] = useState(null);
    const [filtroTipo, setFiltroTipo] = useState(null);
    const [savingRol, setSavingRol] = useState(false);
    const [savingEstado, setSavingEstado] = useState(false);

    const detalle = useModal(null);
    const nivel = useModal({nivel: null, valido_hasta: null});

    useEffect(() => {
        cargarUsuarios();
    }, []);

    const cargarUsuarios = async () => {
        setLoading(true);
        try {
            const data = await api.usuarios.listar();
            // Normalizar campo activo (algunos backends lo omiten si siempre es true)
            setUsuarios((data ?? []).map(u => ({...u, activo: u.activo ?? true})));
        } catch (e) {
            noti_util("error", "Error cargando usuarios: " + e);
        } finally {
            setLoading(false);
        }
    };

    // Acciones
    const cambiarRol = async (u) => {
        setSavingRol(true);
        try {
            await api.usuarios.cambiar_rol(u.id);
            await cargarUsuarios();
            // Actualizar dato del modal si sigue abierto
            detalle.setForm(prev => prev);
            const updated = {...u, rol: u.rol === "admin" ? "cliente" : "admin"};
            detalle.abrir(updated, updated);
            noti_util("success", "Rol actualizado");
        } catch (e) {
            noti_util("error", e?.message ?? String(e));
        } finally {
            setSavingRol(false);
        }
    };

    const abrirCambioNivel = (u) => {
        nivel.abrir(u, {
            nivel: u.nivel ?? null,
            valido_hasta: u.nivel_valido_hasta ? new Date(u.nivel_valido_hasta) : null,
        });
    };

    const guardarNivel = () => nivel.guardar(async () => {
        const {nivel: nv, valido_hasta} = nivel.form;
        await api.usuarios.cambiar_nivel(
            nivel.modal.data.id,
            nv,
            valido_hasta ? valido_hasta.toISOString() : null
        );
        await cargarUsuarios();
        noti_util("success", "Nivel actualizado");
        // Refrescar modal de detalle si está abierto sobre el mismo usuario
        if (detalle.modal.open && detalle.modal.data?.id === nivel.modal.data.id) {
            const updated = {...detalle.modal.data, nivel: nv, nivel_valido_hasta: valido_hasta?.toISOString() ?? null};
            detalle.abrir(updated, updated);
        }
    });

    const toggleEstado = async (u) => {
        setSavingEstado(true);
        try {
            if (u.activo) await api.usuarios.desactivar(u.id);
            else await api.usuarios.activar(u.id);
            await cargarUsuarios();
            const updated = {...u, activo: !u.activo};
            detalle.abrir(updated, updated);
            noti_util("success", `Usuario ${u.activo ? "desactivado" : "activado"}`);
        } catch (e) {
            noti_util("error", e?.message ?? String(e));
        } finally {
            setSavingEstado(false);
        }
    };

    //  Filtros
    const records = usuarios
        .filter(u => !filtroRol || u.rol === filtroRol)
        .filter(u => !filtroTipo || u.tipo_usuario === filtroTipo)
        .filter(u => {
            if (!search.trim()) return true;
            const q = search.toLowerCase();
            return u.id.toLowerCase().includes(q)
                || (u.rol ?? "").toLowerCase().includes(q)
                || (u.tipo_usuario ?? "").toLowerCase().includes(q)
                || (u.nivel ?? "").toLowerCase().includes(q);
        });

    return (
        <div className="flex flex-col gap-6" style={{position: "relative"}}>
            {/* Modales */}
            <ModalDetalle
                modal={detalle.modal}
                onClose={detalle.cerrar}
                onCambiarRol={cambiarRol}
                onCambiarNivel={abrirCambioNivel}
                onToggleEstado={toggleEstado}
                savingRol={savingRol}
                savingEstado={savingEstado}
            />
            <ModalNivel
                modal={nivel.modal}
                form={nivel.form}
                setForm={nivel.setForm}
                saving={nivel.saving}
                onClose={nivel.cerrar}
                onGuardar={guardarNivel}
            />

            {/* Tabla */}
            <TablaUsuarios
                records={records}
                search={search}
                setSearch={setSearch}
                filtroRol={filtroRol}
                setFiltroRol={setFiltroRol}
                filtroTipo={filtroTipo}
                setFiltroTipo={setFiltroTipo}
                onVerDetalle={u => detalle.abrir(u, u)}
            />
        </div>
    );
}