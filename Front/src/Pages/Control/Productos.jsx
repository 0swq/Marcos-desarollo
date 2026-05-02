import {
    Badge, Group, Box, Text, TextInput, Button, Modal,
    Stack, Switch, Select, NumberInput, Textarea, ActionIcon, LoadingOverlay
} from "@mantine/core";
import {DataTable} from "mantine-datatable";
import {useState, useEffect} from "react";
import {Api_manager} from "@/Service/Api_manager.jsx";
import {LoadingProvider, useLoading} from "../../Service/LoadingContext.jsx";
import {noti_util} from "@/Utils/Toast.jsx";

const emptyAtr = {nombre: ""};
const emptyProd = {nombre: "", marca: "", categoria_id: null, unidades: "UNIDADES", descripcion: "", publicado: false};
const emptyVar = {
    sku: "",
    precio_venta: "",
    precio_mayorista: "",
    precio_minimo: "",
    stock: 0,
    activa: true,
    atributos: []
};

const opsUnd = [
    {value: "UNIDADES", label: "Unidades"},
    {value: "CAJA x100", label: "Caja x100"},
    {value: "METRO", label: "Metro"},
    {value: "KG", label: "Kilogramo"},
];

// ══════════════════════════════════════════════════════════════════════════════
// SECCIÓN CATEGORÍAS
// ══════════════════════════════════════════════════════════════════════════════
function ModalCategoria({modal, form, setForm, onClose, onGuardar, saving}) {
    return (
        <Modal opened={modal.open} onClose={onClose} centered size="sm"
               title={<Text fw={700}>{modal.data ? "Editar Categoria" : "Nueva Categoria"}</Text>}>
            <Stack gap="sm">
                <TextInput label="Nombre" placeholder="Ej. Tableros" required value={form.nombre}
                           onChange={e => setForm({...form, nombre: e.currentTarget.value})}
                />
                <Switch label="Categoria activa" checked={form.activa ?? true}
                        onChange={e => setForm({...form, activa: e.currentTarget.checked})}
                />
                <Group justify="flex-end" mt="sm">
                    <Button variant="default" onClick={onClose}>Cancelar</Button>
                    <Button color="green" loading={saving}
                            onClick={onGuardar}>{modal.data ? "Guardar cambios" : "Crear categoria"}</Button>
                </Group>
            </Stack>
        </Modal>
    );
}

function ModalSubcategorias({
                                modal,
                                subsList,
                                nuevaSub,
                                setNuevaSub,
                                onAgregar,
                                onEliminar,
                                onClose,
                                onGuardar,
                                onEditarNombre,
                                soloActivas,
                                setSoloActivas
                            }) {
    const lista = soloActivas ? subsList.filter(s => s.activa) : subsList;
    return (
        <Modal opened={modal.open} onClose={onClose} centered size="md"
               title={<Text fw={700}>Subcategorias de {modal.data?.nombre}</Text>}>
            <Stack gap="sm">
                <Group gap="xs">
                    <TextInput placeholder="Nueva subcategoria..." value={nuevaSub} style={{flex: 1}}
                               onChange={e => setNuevaSub(e.currentTarget.value)}
                               onKeyDown={e => e.key === "Enter" && onAgregar()}/>
                    <Button color="green" onClick={onAgregar}><i className="fas fa-plus"/></Button>
                    <Switch label="Solo activas" checked={soloActivas}
                            onChange={e => setSoloActivas(e.currentTarget.checked)}/>

                </Group>

                {lista.map(s => (
                    <Group key={s.id} justify="space-between" px="xs" py={4}
                           style={{
                               border: "1px solid #e9ecef", borderRadius: 6,
                               opacity: !s.activa ? 0.5 : 1
                           }}>
                        <Text size="sm">{s.nombre}</Text>
                        <Group gap={4}>
                            <Badge size="xs" color={!s.activa ? "gray" : "green"}>
                                {!s.activa ? "Oculta" : "Activa"}
                            </Badge>
                            <ActionIcon color="blue" variant="light" size="sm" onClick={() => onEditarNombre(s)}>
                                <i className="fas fa-edit" style={{fontSize: 11}}/>
                            </ActionIcon>
                            <ActionIcon color={s.activa ? "orange" : "green"} variant="light" size="sm"
                                        onClick={() => onEliminar(s.id)}>
                                <i className={`fas ${s.activa ? "fa-eye-slash" : "fa-eye"}`} style={{fontSize: 11}}/>
                            </ActionIcon>
                        </Group>
                    </Group>
                ))}

                <Group justify="flex-end" mt="sm">
                    <Button variant="default" onClick={onClose}>Cancelar</Button>

                </Group>
            </Stack>
        </Modal>
    );
}

function TablaCategorias({records, searchCat, setSearchCat, onCrear, onEditar, onSubs, soloActivas, setSoloActivas}) {
    return (
        <div className="flex flex-1 flex-col border px-4 py-4 rounded-2xl">
            <div className="flex justify-between items-center mb-3">
                <div className="flex gap-3">
                    <Text fw={700} size="xl">Categorias</Text>
                    <Button color="green" onClick={onCrear}><i className="fas fa-plus"/></Button>
                </div>
                <Switch label="Solo activas" checked={soloActivas}
                        onChange={e => setSoloActivas(e.currentTarget.checked)}/>
                <TextInput placeholder="Buscar categoria..." value={searchCat}
                           onChange={e => setSearchCat(e.currentTarget.value)}/>
            </div>
            <div className="h-[200px]">
                <DataTable noRecordsText="Sin resultados" withTableBorder withColumnBorders striped
                           highlightOnHover idAccessor="id"
                           columns={[
                               {accessor: "nombre", title: "Nombre"},
                               {
                                   accessor: "hijos", title: "N Subcategorias",
                                   render: ({hijos}) => <Badge color="blue"
                                                               variant="light">{(hijos ?? []).length}</Badge>
                               },
                               {
                                   accessor: "activa", title: "Estado",
                                   render: ({activa}) => <Badge
                                       color={activa ? "green" : "gray"}>{activa ? "Activa" : "Oculta"}</Badge>
                               },
                           ]}
                           records={records}
                           rowExpansion={{
                               allowMultiple: false,
                               content: ({record}) => (
                                   <Box p="sm" bg="gray.0">
                                       <div className="flex justify-between items-center mb-3">
                                           <Text size="xs" fw={600} tt="uppercase" c="dimmed">
                                               Subcategorias de {record.nombre}
                                           </Text>
                                           <div className="flex gap-2">
                                               <Button color="blue" size="xs" onClick={() => onSubs(record)}>
                                                   <i className="fas fa-list" style={{marginRight: 4}}/>Subcategorias
                                               </Button>
                                               <Button color="dark" size="xs" onClick={() => onEditar(record)}>
                                                   <i className="fas fa-edit"/>
                                               </Button>
                                           </div>
                                       </div>
                                       <DataTable withTableBorder withColumnBorders idAccessor="id" fontSize="xs"
                                                  columns={[{accessor: "nombre", title: "Subcategoria"}]}
                                                  records={record.hijos}/>
                                   </Box>
                               ),
                           }}
                />
            </div>
        </div>
    );
}

// ══════════════════════════════════════════════════════════════════════════════
// SECCIÓN ATRIBUTOS
// ══════════════════════════════════════════════════════════════════════════════
function ModalAtributo({modal, form, setForm, saving, onClose, onGuardar}) {
    return (
        <Modal opened={modal.open} onClose={onClose} centered size="sm"
               title={<Text fw={700}>{modal.data ? "Editar Atributo" : "Nuevo Atributo"}</Text>}>
            <Stack gap="sm">
                <TextInput label="Nombre del atributo" placeholder="Ej. Grosor, Color" required
                           value={form.nombre}
                           onChange={e => setForm({...form, nombre: e.currentTarget.value})}
                />
                <Group justify="flex-end" mt="sm">
                    <Button variant="default" onClick={onClose}>Cancelar</Button>
                    <Button color="green" loading={saving} onClick={onGuardar}>
                        {modal.data ? "Guardar cambios" : "Crear atributo"}
                    </Button>
                </Group>
            </Stack>
        </Modal>
    );
}

function TablaAtributos({records, searchAtr, setSearchAtr, onCrear, onEditar}) {
    return (
        <div className="flex flex-1 flex-col border px-4 py-4 rounded-2xl">
            <div className="flex justify-between items-center mb-3">
                <div className="flex gap-3">
                    <Text fw={700} size="xl">Atributos</Text>
                    <Button color="green" onClick={onCrear}><i className="fas fa-plus"/></Button>
                </div>
                <TextInput placeholder="Buscar atributo..." value={searchAtr}
                           onChange={e => setSearchAtr(e.currentTarget.value)}/>
            </div>
            <div className="h-[200px]">
                <DataTable noRecordsText="Sin resultados" withTableBorder withColumnBorders striped
                           highlightOnHover idAccessor="id"
                           columns={[
                               {accessor: "nombre", title: "Nombre", width: 300},
                               {
                                   accessor: "acciones", title: "",
                                   render: (a) => (
                                       <Button color="dark" size="xs" onClick={() => onEditar(a)}>
                                           <i className="fas fa-edit"/>
                                       </Button>
                                   ),
                               },
                           ]}
                           records={records}
                />
            </div>
        </div>
    );
}

// ══════════════════════════════════════════════════════════════════════════════
// SECCIÓN PRODUCTOS
// ══════════════════════════════════════════════════════════════════════════════
function ModalProducto({modal, form, setForm, saving, opsCat, onClose, onGuardar}) {
    return (
        <Modal opened={modal.open} onClose={onClose} centered size="lg"
               title={<Text fw={700}>{modal.data ? "Editar Producto" : "Nuevo Producto"}</Text>}>
            <Stack gap="sm">
                <Group grow>
                    <TextInput
                        label="Nombre"
                        placeholder="Ej. Tablero MDF"
                        required
                        value={form.nombre}
                        onChange={(e) => setForm({...form, nombre: e.currentTarget.value})}
                    />
                    <TextInput
                        label="Marca"
                        placeholder="Ej. Arauco"
                        value={form.marca}
                        onChange={(e) => setForm({...form, marca: e.currentTarget.value})}
                    />
                </Group>

                <Group grow>
                    <Select
                        label="Categoria"
                        placeholder="Seleccionar..."
                        searchable
                        data={opsCat}
                        value={form.categoria_id}
                        onChange={(val) => setForm({...form, categoria_id: val})}
                    />

                    <Select
                        label="Unidades"
                        data={opsUnd}
                        value={form.unidades}
                        onChange={(val) => setForm({...form, unidades: val})}
                    />
                </Group>

                <Textarea
                    label="Descripcion"
                    placeholder="Descripcion del producto..."
                    rows={3}
                    value={form.descripcion}
                    onChange={(e) => setForm({...form, descripcion: e.currentTarget.value})}
                />

                <Switch
                    label="Publicado"
                    checked={form.publicado}
                    onChange={e => setForm({...form, publicado: e.currentTarget.checked})}
                />

                <Group justify="flex-end" mt="sm">
                    <Button variant="default" onClick={onClose}>Cancelar</Button>
                    <Button color="green" loading={saving} onClick={onGuardar}>
                        {modal.data ? "Guardar cambios" : "Crear producto"}
                    </Button>
                </Group>
            </Stack>
        </Modal>
    );
}

function TablaProductos({
                            records,
                            tiposAtributo,
                            searchProd,
                            setSearchProd,
                            onCrear,
                            onEditar,
                            onCrearVar,
                            onEditarVar,
                            onExpandir,
                            soloActivos,
                            setSoloActivos,
                            soloActivosVar,
                            setSoloActivosVar
                        }) {
    return (
        <div className="flex flex-col border px-4 py-4 rounded-2xl">
            <div className="flex justify-between items-center mb-3">
                <div className="flex gap-3">
                    <Text fw={700} size="xl">Productos</Text>
                    <Button color="green" onClick={onCrear}><i className="fas fa-plus"/></Button>
                </div>
                <Switch label="Solo publicados" checked={soloActivos}
                        onChange={e => setSoloActivos(e.currentTarget.checked)}/>
                <TextInput placeholder="Buscar producto..." value={searchProd}
                           onChange={e => setSearchProd(e.currentTarget.value)}/>
            </div>
            <div className="h-[300px]">
                <DataTable noRecordsText="Sin resultados" withTableBorder withColumnBorders striped
                           highlightOnHover idAccessor="id"
                           columns={[
                               {accessor: "nombre", title: "Nombre", width: 220},
                               {accessor: "marca", title: "Marca"},
                               {
                                   accessor: "categoria", title: "Categoria",
                                   render: ({categoria}) => <Badge variant="light">{categoria}</Badge>
                               },
                               {accessor: "unidades", title: "Unidades"},
                               {
                                   accessor: "variantes", title: "Variantes",
                                   render: ({variantes}) => {
                                       const inactivas = variantes.filter(v => !v.activa).length;
                                       const sinStock = variantes.filter(v => v.stock === 0).length;
                                       return (
                                           <Group gap={4}>
                                               <Badge color="gray" variant="outline">{variantes.length} total</Badge>
                                               {inactivas > 0 && <Badge
                                                   color="yellow">{inactivas} inactiva{inactivas > 1 ? "s" : ""}</Badge>}
                                               {sinStock > 0 && <Badge color="red">{sinStock} sin stock</Badge>}
                                           </Group>
                                       );
                                   }
                               },
                               {
                                   accessor: "publicado", title: "Publicado",
                                   render: ({publicado}) => (
                                       <Badge
                                           color={publicado ? "green" : "gray"}>{publicado ? "Publicado" : "Borrador"}</Badge>
                                   ),
                               },
                           ]}
                           records={records}
                           rowExpansion={{
                               allowMultiple: false,
                               onExpand: ({record}) => onExpandir(record.id),
                               content: ({record}) => (
                                   <Box p="sm" bg="gray.0">
                                       <div className="flex justify-between items-center mb-3">
                                           <div className="flex flex-col gap-1">
                                               <Text size="xs" fw={600} tt="uppercase" c="dimmed">Variantes
                                                   de {record.nombre}</Text>
                                               <Text size="xs" c="dimmed">{record.descripcion}</Text>
                                           </div>
                                           <Switch label="Solo activas" checked={soloActivosVar}
                                                   onChange={e => setSoloActivosVar(e.currentTarget.checked)}/>
                                           <div className="flex gap-2">
                                               <Button color="green" size="xs" onClick={() => onCrearVar(record)}>
                                                   <i className="fas fa-plus" style={{marginRight: 4}}/>Variante
                                               </Button>
                                               <Button color="dark" size="xs" onClick={() => onEditar(record)}>
                                                   <i className="fas fa-edit"/>
                                               </Button>
                                           </div>
                                       </div>
                                       <DataTable withTableBorder withColumnBorders idAccessor="id" fontSize="xs"
                                                  columns={[
                                                      {accessor: "sku", title: "SKU"},
                                                      {
                                                          accessor: "atributos", title: "Atributos",
                                                          render: ({atributos}) => (
                                                              <Group gap={4}>
                                                                  {atributos.map((a, i) => {
                                                                      const tipo = tiposAtributo.find(t => t.id === a.tipo);
                                                                      return (
                                                                          <Badge key={i} variant="light" color="blue"
                                                                                 size="sm">
                                                                              {tipo?.nombre ?? a.tipo}: {a.valor}
                                                                          </Badge>
                                                                      );
                                                                  })}
                                                              </Group>
                                                          )
                                                      },
                                                      {
                                                          accessor: "precio_venta",
                                                          title: "Venta",
                                                          render: ({precio_venta}) => "S/ " + precio_venta.toFixed(2)
                                                      },
                                                      {
                                                          accessor: "precio_mayorista",
                                                          title: "Mayorista",
                                                          render: ({precio_mayorista}) => "S/ " + precio_mayorista.toFixed(2)
                                                      },
                                                      {
                                                          accessor: "precio_minimo",
                                                          title: "Minimo",
                                                          render: ({precio_minimo}) => "S/ " + precio_minimo.toFixed(2)
                                                      },
                                                      {
                                                          accessor: "stock", title: "Stock",
                                                          render: ({stock}) => (
                                                              <Badge
                                                                  color={stock === 0 ? "red" : stock <= 10 ? "yellow" : "green"}>
                                                                  {stock === 0 ? "Sin stock" : stock + " u."}
                                                              </Badge>
                                                          )
                                                      },
                                                      {
                                                          accessor: "activa", title: "Estado",
                                                          render: ({activa}) => (
                                                              <Badge
                                                                  color={activa ? "green" : "gray"}>{activa ? "Activa" : "Inactiva"}</Badge>
                                                          )
                                                      },
                                                      {
                                                          accessor: "acciones", title: "",
                                                          render: (variante) => (
                                                              <Button color="dark" size="xs"
                                                                      onClick={() => onEditarVar(variante, record)}>
                                                                  <i className="fas fa-edit"/>
                                                              </Button>
                                                          )
                                                      },
                                                  ]}
                                                  records={soloActivosVar ? record.variantes.filter(v => v.activa) : record.variantes}
                                       />
                                   </Box>
                               ),
                           }}
                />
            </div>
        </div>
    );
}

// ══════════════════════════════════════════════════════════════════════════════
// SECCIÓN VARIANTES
// ══════════════════════════════════════════════════════════════════════════════
function ModalVariante({modal, form, setForm, saving, opsTipoAtr, onClose, onGuardar}) {
    const agregarAtr = () => setForm(f => ({...f, atributos: [...f.atributos, {tipo: "", valor: ""}]}));
    const actualizarAtr = (i, k, val) => setForm(f => {
        const a = [...f.atributos];
        a[i] = {...a[i], [k]: val};
        return {...f, atributos: a};
    });
    const eliminarAtr = (i) => setForm(f => ({...f, atributos: f.atributos.filter((_, idx) => idx !== i)}));

    return (
        <Modal opened={modal.open} onClose={onClose} centered size="lg"
               title={<Text fw={700}>{modal.data ? "Editar Variante" : "Nueva Variante"}
                   {modal.producto && <Text span c="dimmed" fw={400}> — {modal.producto.nombre}</Text>}
               </Text>}>
            <Stack gap="sm">
                <TextInput label="SKU" placeholder="Ej. MDF-15-120" required value={form.sku}
                           onChange={e => setForm({...form, sku: e.currentTarget.value})}/>
                <Group grow>
                    <NumberInput label="Precio venta (S/)" step={10} decimalScale={2} min={0} required
                                 value={form.precio_venta} onChange={val => setForm(f => ({...f, precio_venta: val}))}/>
                    <NumberInput label="Precio mayorista (S/)" step={10} decimalScale={2} min={0}
                                 value={form.precio_mayorista}
                                 onChange={val => setForm(f => ({...f, precio_mayorista: val}))}/>
                    <NumberInput label="Precio minimo (S/)" step={10} decimalScale={2} min={0}
                                 value={form.precio_minimo}
                                 onChange={val => setForm(f => ({...f, precio_minimo: val}))}/>
                </Group>
                <Group grow align="flex-end">
                    {/* FIX: ...f en lugar de ...val */}
                    <NumberInput label="Stock" step={10} min={0} value={form.stock}
                                 onChange={val => setForm(f => ({...f, stock: val}))}/>
                    <Switch label="Variante activa" checked={form.activa} mb={6}
                            onChange={e => setForm({...form, activa: e.currentTarget.checked})}/>
                </Group>
                <div>
                    <Group justify="space-between" mb={6}>
                        <Text size="sm" fw={600}>Atributos</Text>
                        <Button size="xs" variant="light" color="blue" onClick={agregarAtr}>
                            <i className="fas fa-plus" style={{marginRight: 4}}/> Agregar
                        </Button>
                    </Group>
                    <Stack gap={6}>
                        {form.atributos.length === 0
                            ? <Text size="xs" c="dimmed">Sin atributos.</Text>
                            : form.atributos.map((a, i) => (
                                <Group key={i} gap="xs">
                                    <Select placeholder="Tipo de atributo" searchable style={{flex: 1}}
                                            data={opsTipoAtr} value={a.tipo}
                                            onChange={val => actualizarAtr(i, "tipo", val)}/>
                                    <TextInput size="xs" placeholder="Valor (ej. 15mm)" value={a.valor}
                                               style={{flex: 1}}
                                               onChange={e => actualizarAtr(i, "valor", e.currentTarget.value)}/>
                                    <ActionIcon color="red" variant="light" size="sm" onClick={() => eliminarAtr(i)}>
                                        <i className="fas fa-trash" style={{fontSize: 11}}/>
                                    </ActionIcon>
                                </Group>
                            ))
                        }
                    </Stack>
                </div>
                <Group justify="flex-end" mt="sm">
                    <Button variant="default" onClick={onClose}>Cancelar</Button>
                    <Button color="green" loading={saving} onClick={onGuardar}>
                        {modal.data ? "Guardar cambios" : "Crear variante"}
                    </Button>
                </Group>
            </Stack>
        </Modal>
    );
}

export default function Productos() {
    const api = Api_manager();
    const {setLoading} = useLoading();
    const [tiposAtributo, setTiposAtributo] = useState([]);
    const [productosBase, setProductosBase] = useState([]);
    const [variantesCache, setVariantesCache] = useState({});

    const [categorias, setCategorias] = useState([]);

    const [searchCat, setSearchCat] = useState("");
    const [searchAtr, setSearchAtr] = useState("");
    const [searchProd, setSearchProd] = useState("");

    useEffect(() => {
        cargarTodo();
    }, []);

    const cargarTodo = async () => {
        setLoading(true);
        try {
            const [prods, attrs, cats] = await Promise.all([
                api.productos.listar_todos(),
                api.productos.listar_tipos_atributo(),
                api.categorias.listar_padres(),
            ]);
            setProductosBase(prods ?? []);
            setTiposAtributo(attrs ?? []);
            setCategorias(cats ?? []);

            console.log(prods)
        } catch (e) {
            noti_util('error', "Error cargando datos" + e)
        } finally {
            setLoading(false);
        }
    };

    const cargarVariantes = async (producto_id) => {
        try {
            const data = await api.productos.obtener(producto_id);
            const variantes = (data.VariantesCompletas ?? []).map(vc => ({
                id: vc.Variante.id,
                sku: vc.Variante.sku,
                precio_venta: Number(vc.Variante.precio_venta),
                precio_mayorista: Number(vc.Variante.precio_mayorista),
                precio_minimo: Number(vc.Variante.precio_minimo),
                stock: vc.Variante.stock,
                activa: vc.Variante.activa,
                atributos: (vc.Atributos ?? []).map(a => ({tipo: a.tipo_atributo_id, valor: a.valor})),
            }));
            setVariantesCache(prev => ({...prev, [producto_id]: variantes}));
        } catch (e) {
            noti_util('error', "Error cargando variantes" + e)
        }
    };

    const adaptarProducto = (p) => {
        const base = p.ProductoBase;
        let catNombre = "—";
        for (const padre of categorias) {
            if (padre.id === base.categoria) {
                catNombre = padre.nombre;
                break;
            }
            const hijo = (padre.hijos ?? []).find(h => h.id === base.categoria);
            if (hijo) {
                catNombre = padre.nombre + " > " + hijo.nombre;
                break;
            }
        }
        return {
            id: base.id,
            nombre: base.nombre,
            marca: base.marca,
            categoria: catNombre,
            categoria_id: base.categoria,
            unidades: base.unidades,
            publicado: base.publicado,
            descripcion: base.descripcion,
            variantes: variantesCache[base.id] ?? [],
        };
    };

    const productos = productosBase.map(adaptarProducto);

    const [modalCat, setModalCat] = useState({open: false, data: null});
    const [formCat, setFormCat] = useState({nombre: "", activa: true});
    const [modalSub, setModalSub] = useState({open: false, data: null});
    const [subsList, setSubsList] = useState([]);
    const [nuevaSub, setNuevaSub] = useState("");
    const [modalAtr, setModalAtr] = useState({open: false, data: null});
    const [formAtr, setFormAtr] = useState(emptyAtr);
    const [savingAtr, setSavingAtr] = useState(false);
    const [savingCat, setSavingCat] = useState(false);
    const [modalProd, setModalProd] = useState({open: false, data: null});
    const [formProd, setFormProd] = useState(emptyProd);
    const [savingProd, setSavingProd] = useState(false);
    const [modalVar, setModalVar] = useState({open: false, data: null, producto: null});
    const [formVar, setFormVar] = useState(emptyVar);
    const [savingVar, setSavingVar] = useState(false);
    const [soloActivasCat, setSoloActivasCat] = useState(true);
    const [soloActivasSub, setSoloActivasSub] = useState(true);
    const [soloActivosProd, setSoloActivosProd] = useState(true);
    const [soloActivosVar, setSoloActivasVar] = useState(true);

    const abrirCrearCat = () => {
        setFormCat({nombre: "", activa: true});
        setModalCat({open: true, data: null});
    };
    const abrirEditarCat = (c) => {
        setFormCat({nombre: c.nombre, activa: c.activa});
        setModalCat({open: true, data: c});
    };
    const cerrarCat = () => setModalCat({open: false, data: null});
    const guardarCat = async () => {
        setSavingCat(true);
        try {
            if (modalCat.data) {
                await api.categorias.cambiar_estado(modalCat.data.id, formCat.nombre);
            } else {
                await api.categorias.registrar_padre(formCat.nombre);
            }
            await cargarTodo();
            cerrarCat();
        } catch (e) {
            noti_util('error', "Error guardando categoria" + e)
            ;
        } finally {
            setSavingCat(false);
        }
    };

    const abrirSubs = (c) => {
        setSubsList([...(c.hijos ?? [])]);
        setNuevaSub("");
        setModalSub({open: true, data: c});
    };

    const cerrarSubs = () => setModalSub({open: false, data: null});


    const agregarSub = async () => {
        if (!nuevaSub.trim()) return;
        await api.categorias.registrar_hijo(nuevaSub.trim(), modalSub.data.id);
        const hijos = await api.categorias.listar_hijos(modalSub.data.id);
        setSubsList(hijos ?? []);
        setNuevaSub("");
        const cats = await api.categorias.listar_padres();
        setCategorias(cats ?? []);
    };

    const eliminarSub = async (id) => {
        await api.categorias.cambiar_estado(id);
        const cats = await api.categorias.listar_padres();
        setCategorias(cats ?? []);
        const padre = cats.find(c => (c.hijos ?? []).some(h => h.id === id));
        setSubsList([...(padre?.hijos ?? [])]);
    };
    const editarNombreSub = async (s) => {
        const nuevoNombre = prompt("Nuevo nombre:", s.nombre);
        if (!nuevoNombre || nuevoNombre.trim() === s.nombre) return;
        await api.categorias.actualizar(s.id, nuevoNombre.trim());
        const hijos = await api.categorias.listar_hijos(modalSub.data.id);
        setSubsList(hijos ?? []);
        const cats = await api.categorias.listar_padres();
        setCategorias(cats ?? []);
    };
    const guardarSubs = () => cerrarSubs();

    const abrirCrearAtr = () => {
        setFormAtr(emptyAtr);
        setModalAtr({open: true, data: null});
    };
    const abrirEditarAtr = (a) => {
        setFormAtr({nombre: a.nombre});
        setModalAtr({open: true, data: a});
    };
    const cerrarAtr = () => setModalAtr({open: false, data: null});
    const guardarAtr = async () => {
        setSavingAtr(true);
        try {
            if (modalAtr.data) await api.productos.actualizar_tipo_atributo(modalAtr.data.id, formAtr);
            else await api.productos.crear_tipo_atributo(formAtr);
            await cargarTodo();
            cerrarAtr();
        } catch (e) {
            noti_util('error', "Error  guardando atributo" + e)

        } finally {
            setSavingAtr(false);
        }
    };

    // ── Handlers producto ─────────────────────────────────────────────────────
    const abrirCrearProd = () => {
        setFormProd(emptyProd);
        setModalProd({open: true, data: null});
    };
    const abrirEditarProd = (p) => {
        setFormProd({
            nombre: p.nombre,
            marca: p.marca,
            categoria_id: p.categoria_id ? String(p.categoria_id) : null,
            unidades: p.unidades,
            descripcion: p.descripcion,
            publicado: p.publicado
        });
        setModalProd({open: true, data: p});
    };
    const cerrarProd = () => setModalProd({open: false, data: null});
    const guardarProd = async () => {
        setSavingProd(true);
        try {
            if (modalProd.data) await api.productos.actualizar(modalProd.data.id, formProd);
            else await api.productos.crear(formProd);
            await cargarTodo();

            cerrarProd();
        } catch (e) {
            noti_util('error', "Error guardando producto" + e)
        } finally {
            setSavingProd(false);
        }
    };

    // ── Handlers variante ─────────────────────────────────────────────────────
    const abrirCrearVar = (prod) => {
        setFormVar(emptyVar);
        setModalVar({open: true, data: null, producto: prod});
    };
    const abrirEditarVar = (v, prod) => {
        setFormVar({
            sku: v.sku,
            precio_venta: v.precio_venta,
            precio_mayorista: v.precio_mayorista,
            precio_minimo: v.precio_minimo,
            stock: v.stock,
            activa: v.activa,
            atributos: v.atributos.map(a => ({...a}))
        });
        setModalVar({open: true, data: v, producto: prod});
    };
    const cerrarVar = () => setModalVar({open: false, data: null, producto: null});
    const guardarVar = async () => {
        setSavingVar(true);
        try {
            const {atributos, ...datosVariante} = formVar;
            if (modalVar.data) {
                await api.productos.actualizar_variante(modalVar.data.id, datosVariante);
                for (const viejo of (modalVar.data.atributos ?? []))
                    await api.productos.eliminar_atributo(modalVar.data.id, viejo.tipo);
                for (const atr of atributos)
                    if (atr.tipo && atr.valor)
                        await api.productos.agregar_atributo({
                            variante_id: modalVar.data.id,
                            tipo_atributo_id: atr.tipo,
                            valor: atr.valor
                        });
            } else {
                const nueva = await api.productos.agregar_variante({
                    ...datosVariante,
                    producto_base_id: modalVar.producto.id
                });
                for (const atr of atributos)
                    if (atr.tipo && atr.valor)
                        await api.productos.agregar_atributo({
                            variante_id: nueva.id,
                            tipo_atributo_id: atr.tipo,
                            valor: atr.valor
                        });
            }
            await cargarTodo();
            cerrarVar();
        } catch (e) {
            noti_util('error', "Error guardando variante" + e)

        } finally {
            setSavingVar(false);
        }
    };

    // ── Opciones ──────────────────────────────────────────────────────────────
    const opsCat = categorias.flatMap(c => {
        const hijos = c.hijos ?? [];
        return hijos.length > 0
            ? hijos.map(h => ({value: String(h.id), label: c.nombre + " > " + h.nombre}))
            : [{value: String(c.id), label: c.nombre}];
    });

    const opsTipoAtr = tiposAtributo.map(a => ({value: a.id, label: a.nombre}));

    const recordsCat = categorias
        .filter(c => c.nombre.toLowerCase().includes(searchCat.toLowerCase()))
        .filter(c => !soloActivasCat || c.activa)
        .map(c => ({
            ...c,
            hijos: soloActivasCat ? (c.hijos ?? []).filter(h => h.activa) : (c.hijos ?? [])
        }));

    const recordsAtr = tiposAtributo.filter(a => a.nombre.toLowerCase().includes(searchAtr.toLowerCase()));

    const recordsProd = productos
        .filter(p => !soloActivosProd || p.publicado)
        .filter(p => (p.nombre ?? "").toLowerCase().includes(searchProd.toLowerCase()) || (p.marca ?? "").toLowerCase().includes(searchProd.toLowerCase()));    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div className="flex flex-col gap-6" style={{position: "relative"}}>

            <ModalCategoria modal={modalCat} form={formCat} setForm={setFormCat} onClose={cerrarCat}
                            onGuardar={guardarCat} saving={savingCat}/>
            <ModalSubcategorias modal={modalSub} subsList={subsList} nuevaSub={nuevaSub} setNuevaSub={setNuevaSub}
                                onAgregar={agregarSub} onEliminar={eliminarSub} onClose={cerrarSubs}
                                onGuardar={guardarSubs} onEditarNombre={editarNombreSub} soloActivas={soloActivasSub}
                                setSoloActivas={setSoloActivasSub}/>
            <ModalAtributo modal={modalAtr} form={formAtr} setForm={setFormAtr} saving={savingAtr} onClose={cerrarAtr}
                           onGuardar={guardarAtr}/>
            <ModalProducto modal={modalProd} form={formProd} setForm={setFormProd} saving={savingProd} opsCat={opsCat}
                           onClose={cerrarProd} onGuardar={guardarProd}/>
            <ModalVariante modal={modalVar} form={formVar} setForm={setFormVar} saving={savingVar}
                           opsTipoAtr={opsTipoAtr} onClose={cerrarVar} onGuardar={guardarVar}/>

            <div className="flex flex-1 justify-between gap-6">
                <TablaCategorias records={recordsCat} searchCat={searchCat} setSearchCat={setSearchCat}
                                 onCrear={abrirCrearCat} onEditar={abrirEditarCat} onSubs={abrirSubs}
                                 soloActivas={soloActivasCat} setSoloActivas={setSoloActivasCat}/>
                <TablaAtributos records={recordsAtr} searchAtr={searchAtr} setSearchAtr={setSearchAtr}
                                onCrear={abrirCrearAtr} onEditar={abrirEditarAtr}/>
            </div>

            <TablaProductos records={recordsProd} tiposAtributo={tiposAtributo} searchProd={searchProd}
                            setSearchProd={setSearchProd} onCrear={abrirCrearProd} onEditar={abrirEditarProd}
                            onCrearVar={abrirCrearVar} onEditarVar={abrirEditarVar} onExpandir={cargarVariantes}
                            soloActivos={soloActivosProd} setSoloActivos={setSoloActivosProd}
                            soloActivosVar={soloActivosVar} setSoloActivosVar={setSoloActivasVar}/>
        </div>
    );
}