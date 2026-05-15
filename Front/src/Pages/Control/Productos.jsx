import {
    ActionIcon, Badge, Box, Button, Group, Image, Modal, NumberInput,
    Radio, Select, Stack, Switch, Text, Textarea, TextInput
} from "@mantine/core";
import {DataTable} from "mantine-datatable";
import {useEffect, useRef, useState} from "react";
import {Api_manager} from "@/Service/Api_manager.jsx";
import {useLoading} from "../../Context/LoadingContext.jsx";
import {noti_util} from "@/Utils/Toast.jsx";

const emptyAtr = {nombre: ""};
const emptyProd = {nombre: "", marca: "", categoria_id: null, unidades: "UNIDADES", descripcion: "", publicado: false};
const emptyVar = {
    sku: "", precio_venta: "", precio_mayorista: "", precio_minimo: "",
    stock: 0, activa: true, atributos: []
};

const opsUnd = [
    {value: "UNIDADES", label: "Unidades"},
    {value: "CAJA x100", label: "Caja x100"},
    {value: "METRO", label: "Metro"},
    {value: "KG", label: "Kilogramo"},
];

const mapearVariante = (vc) => ({
    id: vc.Variante.id,
    sku: vc.Variante.sku,
    precio_venta: Number(vc.Variante.precio_venta),
    precio_mayorista: Number(vc.Variante.precio_mayorista),
    precio_minimo: Number(vc.Variante.precio_minimo),
    stock: vc.Variante.stock,
    activa: vc.Variante.activa,
    atributos: (vc.Atributos ?? []).map(a => ({tipo: a.tipo_atributo, valor: a.valor})).filter(a => a.tipo),
});

function useModal(emptyForm) {
    const [modal, setModal] = useState({open: false, data: null});
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);

    const abrir = (data = null, formInicial = emptyForm, extra = {}) => {
        setForm(formInicial);
        setModal({
            open: true, data, ...ext
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

    function CabeceraTabla({titulo, onCrear, search, setSearch, placeholder, children}) {
        return (
            <div className="flex justify-between items-center mb-3">
                <div className="flex gap-3">
                    <Text fw={700} size="xl">{titulo}</Text>
                    <Button color="green" onClick={onCrear}><i className="fas fa-plus"/></Button>
                </div>
                {children}
                <TextInput placeholder={placeholder} value={search} onChange={e => setSearch(e.currentTarget.value)}/>
            </div>
        );
    }

    function ModalFoto({opened, onClose, fotoUrl, onCambiarFoto, saving, titulo}) {
        const inputRef = useRef();
        const [preview, setPreview] = useState(null);
        const [archivo, setArchivo] = useState(null);

        const handleArchivo = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            setArchivo(file);
            setPreview(URL.createObjectURL(file));
        };

        const handleGuardar = async () => {
            if (!archivo) return;
            await onCambiarFoto(archivo);
            setArchivo(null);
            setPreview(null);
        };

        const handleCerrar = () => {
            setArchivo(null);
            setPreview(null);
            onClose();
        };

        return (
            <Modal opened={opened} onClose={handleCerrar} centered size="md"
                   title={<Text fw={700}>Foto — {titulo}</Text>}>
                <Stack gap="md" align="center">
                    <Box style={{
                        width: 300,
                        height: 300,
                        background: "#f1f3f5",
                        borderRadius: 12,
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}>
                        {preview || fotoUrl
                            ? <img src={preview ?? fotoUrl} alt="foto"
                                   style={{width: "100%", height: "100%", objectFit: "cover"}}
                                   onError={e => e.target.style.display = "none"}/>
                            : <Text c="dimmed" size="sm">Sin foto</Text>
                        }
                    </Box>
                    <input ref={inputRef} type="file" accept="image/*" style={{display: "none"}}
                           onChange={handleArchivo}/>
                    <Group>
                        <Button variant="light" color="blue" onClick={() => inputRef.current.click()}>
                            <i className="fas fa-upload" style={{marginRight: 6}}/>Seleccionar foto
                        </Button>
                        {archivo && (
                            <Button color="green" loading={saving} onClick={handleGuardar}>
                                <i className="fas fa-save" style={{marginRight: 6}}/>Guardar
                            </Button>
                        )}
                    </Group>
                </Stack>
            </Modal>
        );
    }

    function ModalCategoria({modal, form, setForm, saving, onClose, onGuardar}) {
        return (
            <Modal opened={modal.open} onClose={onClose} centered size="sm"
                   title={<Text fw={700}>{modal.data ? "Editar Categoria" : "Nueva Categoria"}</Text>}>
                <Stack gap="sm">
                    <TextInput label="Nombre" placeholder="Ej. Tableros" required
                               value={form.nombre} onChange={e => setForm({...form, nombre: e.currentTarget.value})}/>
                    <Switch label="Categoria activa" checked={form.activa ?? true}
                            onChange={e => setForm({...form, activa: e.currentTarget.checked})}/>
                    <BotonesModal onClose={onClose} onGuardar={onGuardar} saving={saving} esEdicion={!!modal.data}/>
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
                               style={{border: "1px solid #e9ecef", borderRadius: 6, opacity: !s.activa ? 0.5 : 1}}>
                            <Text size="sm">{s.nombre}</Text>
                            <Group gap={4}>
                                <Badge size="xs"
                                       color={s.activa ? "green" : "gray"}>{s.activa ? "Activa" : "Oculta"}</Badge>
                                <ActionIcon color="blue" variant="light" size="sm" onClick={() => onEditarNombre(s)}>
                                    <i className="fas fa-edit" style={{fontSize: 11}}/>
                                </ActionIcon>
                                <ActionIcon color={s.activa ? "orange" : "green"} variant="light" size="sm"
                                            onClick={() => onEliminar(s.id)}>
                                    <i className={`fas ${s.activa ? "fa-eye-slash" : "fa-eye"}`}
                                       style={{fontSize: 11}}/>
                                </ActionIcon>
                            </Group>
                        </Group>
                    ))}
                    <Group justify="flex-end" mt="sm">
                        <Button variant="default" onClick={onClose}>Cerrar</Button>
                    </Group>
                </Stack>
            </Modal>
        );
    }

    function TablaCategorias({
                                 records,
                                 searchCat,
                                 setSearchCat,
                                 onCrear,
                                 onEditar,
                                 onSubs,
                                 soloActivas,
                                 setSoloActivas
                             }) {
        return (
            <div className="flex flex-1 flex-col border px-4 py-4 rounded-2xl">
                <CabeceraTabla titulo="Categorias" onCrear={onCrear} search={searchCat} setSearch={setSearchCat}
                               placeholder="Buscar categoria...">
                    <Switch label="Solo activas" checked={soloActivas}
                            onChange={e => setSoloActivas(e.currentTarget.checked)}/>
                </CabeceraTabla>
                <div className="h-[200px]">
                    <DataTable noRecordsText="Sin resultados" withTableBorder withColumnBorders striped highlightOnHover
                               idAccessor="id"
                               columns={[
                                   {accessor: "nombre", title: "Nombre"},
                                   {
                                       accessor: "hijos",
                                       title: "Subcategorias",
                                       render: ({hijos}) => <Badge color="blue"
                                                                   variant="light">{(hijos ?? []).length}</Badge>
                                   },
                                   {
                                       accessor: "activa",
                                       title: "Estado",
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
                                               <Text size="xs" fw={600} tt="uppercase" c="dimmed">Subcategorias
                                                   de {record.nombre}</Text>
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

    function ModalAtributo({modal, form, setForm, saving, onClose, onGuardar}) {
        return (
            <Modal opened={modal.open} onClose={onClose} centered size="sm"
                   title={<Text fw={700}>{modal.data ? "Editar Atributo" : "Nuevo Atributo"}</Text>}>
                <Stack gap="sm">
                    <TextInput label="Nombre del atributo" placeholder="Ej. Grosor, Color" required
                               value={form.nombre} onChange={e => setForm({...form, nombre: e.currentTarget.value})}/>
                    <BotonesModal onClose={onClose} onGuardar={onGuardar} saving={saving} esEdicion={!!modal.data}/>
                </Stack>
            </Modal>
        );
    }

    function TablaAtributos({records, searchAtr, setSearchAtr, onCrear, onEditar}) {
        return (
            <div className="flex flex-1 flex-col border px-4 py-4 rounded-2xl">
                <CabeceraTabla titulo="Atributos" onCrear={onCrear} search={searchAtr} setSearch={setSearchAtr}
                               placeholder="Buscar atributo..."/>
                <div className="h-[200px]">
                    <DataTable noRecordsText="Sin resultados" withTableBorder withColumnBorders striped highlightOnHover
                               idAccessor="id"
                               columns={[
                                   {accessor: "nombre", title: "Nombre", width: 300},
                                   {
                                       accessor: "acciones",
                                       title: "",
                                       render: (a) => <Button color="dark" size="xs" onClick={() => onEditar(a)}><i
                                           className="fas fa-edit"/></Button>
                                   },
                               ]}
                               records={records}
                    />
                </div>
            </div>
        );
    }

    function ModalProducto({modal, form, setForm, saving, opsCat, onClose, onGuardar}) {
        return (
            <Modal opened={modal.open} onClose={onClose} centered size="lg"
                   title={<Text fw={700}>{modal.data ? "Editar Producto" : "Nuevo Producto"}</Text>}>
                <Stack gap="sm">
                    <Group grow>
                        <TextInput label="Nombre" placeholder="Ej. Tablero MDF" required
                                   value={form.nombre}
                                   onChange={e => setForm({...form, nombre: e.currentTarget.value})}/>
                        <TextInput label="Marca" placeholder="Ej. Arauco"
                                   value={form.marca} onChange={e => setForm({...form, marca: e.currentTarget.value})}/>
                    </Group>
                    <Group grow>
                        <Select label="Categoria" placeholder="Seleccionar..." searchable data={opsCat}
                                value={form.categoria_id} onChange={val => setForm({...form, categoria_id: val})}
                                renderOption={({option}) => (
                                    <Group gap="xs">
                                        <Text size="sm">{option.label}</Text>
                                        {option.inactiva &&
                                            <Badge size="xs" color="red" variant="light">(inactivo)</Badge>}
                                    </Group>
                                )}/>
                        <Select label="Unidades" data={opsUnd} value={form.unidades}
                                onChange={val => setForm({...form, unidades: val})}/>
                    </Group>
                    <Textarea label="Descripcion" placeholder="Descripcion del producto..." rows={3}
                              value={form.descripcion}
                              onChange={e => setForm({...form, descripcion: e.currentTarget.value})}/>
                    <Switch label="Publicado" checked={form.publicado}
                            onChange={e => setForm({...form, publicado: e.currentTarget.checked})}/>
                    <BotonesModal onClose={onClose} onGuardar={onGuardar} saving={saving} esEdicion={!!modal.data}/>
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
                                onModificarStock,
                                onVerFoto,
                                onVerFotoVariante,
                                onExpandir,
                                soloActivos,
                                setSoloActivos,
                                soloActivosVar,
                                setSoloActivosVar,
                                variantesCache
                            }) {
        return (
            <div className="flex flex-col border px-4 py-4 rounded-2xl">
                <CabeceraTabla titulo="Productos" onCrear={onCrear} search={searchProd} setSearch={setSearchProd}
                               placeholder="Buscar producto...">
                    <Switch label="Solo publicados" checked={soloActivos}
                            onChange={e => setSoloActivos(e.currentTarget.checked)}/>
                </CabeceraTabla>
                <div className="h-[300px]">
                    <DataTable noRecordsText="Sin resultados" withTableBorder withColumnBorders striped highlightOnHover
                               idAccessor="id"
                               columns={[
                                   {accessor: "nombre", title: "Nombre", width: 220},
                                   {accessor: "marca", title: "Marca"},
                                   {
                                       accessor: "categoria", title: "Categoria",
                                       render: ({categoria, categoriaActiva}) => (
                                           <Group gap={4}>
                                               <Badge variant="light"
                                                      color={categoriaActiva === false ? "red" : "blue"}>{categoria}</Badge>
                                               {categoriaActiva === false &&
                                                   <Badge size="xs" color="red" variant="light">(inactivo)</Badge>}
                                           </Group>
                                       )
                                   },
                                   {accessor: "unidades", title: "Unidades"},
                                   {
                                       accessor: "variantes", title: "Variantes",
                                       render: ({variantes}) => {
                                           const inactivas = variantes.filter(v => !v.activa).length;
                                           const sinStock = variantes.filter(v => v.stock === 0).length;
                                           return (
                                               <Group gap={4}>
                                                   <Badge color="gray"
                                                          variant="outline">{variantes.length} total</Badge>
                                                   {inactivas > 0 && <Badge
                                                       color="yellow">{inactivas} inactiva{inactivas > 1 ? "s" : ""}</Badge>}
                                                   {sinStock > 0 && <Badge color="red">{sinStock} sin stock</Badge>}
                                               </Group>
                                           );
                                       }
                                   },
                                   {
                                       accessor: "publicado",
                                       title: "Publicado",
                                       render: ({publicado}) => <Badge
                                           color={publicado ? "green" : "gray"}>{publicado ? "Publicado" : "Borrador"}</Badge>
                                   },
                               ]}
                               records={records}
                               rowExpansion={{
                                   allowMultiple: false,
                                   onExpand: ({record}) => onExpandir(record.id),
                                   content: ({record}) => {
                                       const variantes = variantesCache[record.id] ?? [];
                                       const variantesFiltradas = soloActivosVar ? variantes.filter(v => v.activa) : variantes;
                                       return (
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
                                                       <Button color="violet" size="xs"
                                                               onClick={() => onVerFoto(record)}>
                                                           <i className="fas fa-image" style={{marginRight: 4}}/>Foto
                                                       </Button>
                                                       <Button color="green" size="xs"
                                                               onClick={() => onCrearVar(record)}>
                                                           <i className="fas fa-plus" style={{marginRight: 4}}/>Variante
                                                       </Button>
                                                       <Button color="dark" size="xs" onClick={() => onEditar(record)}>
                                                           <i className="fas fa-edit"/>
                                                       </Button>
                                                   </div>
                                               </div>
                                               <DataTable key={`${record.id}-${variantesFiltradas.length}`}
                                                          withTableBorder withColumnBorders idAccessor="id"
                                                          fontSize="xs"
                                                          columns={[
                                                              {accessor: "sku", title: "SKU"},
                                                              {
                                                                  accessor: "atributos", title: "Atributos",
                                                                  render: ({atributos}) => (
                                                                      <Group gap={4}>
                                                                          {(atributos ?? []).length === 0
                                                                              ? <Text size="xs" c="dimmed">Sin
                                                                                  atributos</Text>
                                                                              : atributos.map((a, i) => {
                                                                                  const tipo = tiposAtributo.find(t => t.id === a.tipo);
                                                                                  return <Badge key={i} variant="light"
                                                                                                color="blue"
                                                                                                size="sm">{tipo?.nombre ?? "?"}: {a.valor}</Badge>;
                                                                              })}
                                                                      </Group>
                                                                  )
                                                              },
                                                              {
                                                                  accessor: "precio_venta",
                                                                  title: "Venta",
                                                                  render: ({precio_venta}) => "S/ " + Number(precio_venta).toFixed(2)
                                                              },
                                                              {
                                                                  accessor: "precio_mayorista",
                                                                  title: "Mayorista",
                                                                  render: ({precio_mayorista}) => "S/ " + Number(precio_mayorista).toFixed(2)
                                                              },
                                                              {
                                                                  accessor: "precio_minimo",
                                                                  title: "Minimo",
                                                                  render: ({precio_minimo}) => "S/ " + Number(precio_minimo).toFixed(2)
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
                                                                  accessor: "activa",
                                                                  title: "Estado",
                                                                  render: ({activa}) => <Badge
                                                                      color={activa ? "green" : "gray"}>{activa ? "Activa" : "Inactiva"}</Badge>
                                                              },
                                                              {
                                                                  accessor: "acciones", title: "",
                                                                  render: (variante) => (
                                                                      <Group gap={4}>
                                                                          <Button color="violet" size="xs"
                                                                                  onClick={() => onVerFotoVariante(variante)}>
                                                                              <i className="fas fa-image"/>
                                                                          </Button>
                                                                          <Button color="dark" size="xs"
                                                                                  onClick={() => onEditarVar(variante, record)}>
                                                                              <i className="fas fa-edit"/>
                                                                          </Button>
                                                                          <Button color="teal" size="xs"
                                                                                  onClick={() => onModificarStock(variante)}>
                                                                              <i className="fas fa-boxes"/>
                                                                          </Button>
                                                                      </Group>
                                                                  )
                                                              },
                                                          ]}
                                                          records={variantesFiltradas}
                                               />
                                           </Box>
                                       );
                                   },
                               }}
                    />
                </div>
            </div>
        );
    }

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
                    <TextInput label="SKU" placeholder="Ej. MDF-15-120" required
                               value={form.sku} onChange={e => setForm({...form, sku: e.currentTarget.value})}/>
                    <Group grow>
                        <NumberInput label="Precio venta (S/)" step={10} decimalScale={2} min={0} required
                                     value={form.precio_venta}
                                     onChange={val => setForm(f => ({...f, precio_venta: val}))}/>
                        <NumberInput label="Precio mayorista (S/)" step={10} decimalScale={2} min={0}
                                     value={form.precio_mayorista}
                                     onChange={val => setForm(f => ({...f, precio_mayorista: val}))}/>
                        <NumberInput label="Precio minimo (S/)" step={10} decimalScale={2} min={0}
                                     value={form.precio_minimo}
                                     onChange={val => setForm(f => ({...f, precio_minimo: val}))}/>
                    </Group>
                    <Switch label="Variante activa" checked={form.activa} mb={6}
                            onChange={e => setForm({...form, activa: e.currentTarget.checked})}/>
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
                                        <ActionIcon color="red" variant="light" size="sm"
                                                    onClick={() => eliminarAtr(i)}>
                                            <i className="fas fa-trash" style={{fontSize: 11}}/>
                                        </ActionIcon>
                                    </Group>
                                ))
                            }
                        </Stack>
                    </div>
                    <BotonesModal onClose={onClose} onGuardar={onGuardar} saving={saving} esEdicion={!!modal.data}/>
                </Stack>
            </Modal>
        );
    }

    function ModalStock({modal, onClose, onGuardar, saving}) {
        const stockActual = modal.data?.stock ?? 0;
        const [operacion, setOperacion] = useState("aumentar");
        const [cantidad, setCantidad] = useState(1);

        useEffect(() => {
            if (modal.open) {
                setOperacion("aumentar");
                setCantidad(1);
            }
        }, [modal.open]);

        const maxCantidad = operacion === "disminuir" ? stockActual : undefined;
        const nuevoStock = operacion === "aumentar" ? stockActual + (cantidad || 0) : Math.max(0, stockActual - (cantidad || 0));
        const invalido = operacion === "disminuir" && (cantidad || 0) > stockActual;

        return (
            <Modal opened={modal.open} onClose={onClose} centered size="sm"
                   title={<Text fw={700}>Modificar Stock — Actual: <Text span c="teal"
                                                                         fw={800}>{stockActual}</Text></Text>}>
                <Stack gap="md">
                    <Radio.Group value={operacion} onChange={setOperacion} label="Operación">
                        <Group mt="xs" gap="lg">
                            <Radio value="aumentar" label="Aumentar" color="green"/>
                            <Radio value="disminuir" label="Disminuir" color="red"/>
                        </Group>
                    </Radio.Group>
                    <NumberInput label="Cantidad" min={1} max={maxCantidad} value={cantidad} onChange={setCantidad}
                                 error={invalido ? `No puede superar el stock actual (${stockActual})` : undefined}/>
                    <Group gap="xs" align="center">
                        <Text size="sm" c="dimmed">Nuevo stock:</Text>
                        <Badge size="lg" color={nuevoStock === 0 ? "red" : nuevoStock <= 10 ? "yellow" : "green"}>
                            {nuevoStock} u.
                        </Badge>
                    </Group>
                    <BotonesModal onClose={onClose} onGuardar={() => !invalido && onGuardar(operacion, cantidad)}
                                  saving={saving} esEdicion={true}/>
                </Stack>
            </Modal>
        );
    }

    function ModalVerificacion({opened, onClose, onConfirmar, loading, error, codigo, setCodigo}) {
        return (
            <Modal opened={opened} onClose={onClose} centered size="xs"
                   title={<Text fw={700}>Verificación requerida</Text>}
                   closeOnClickOutside={false}>
                <Stack gap="md">
                    <Text size="sm" c="dimmed">Ingresa el código de 6 dígitos enviado por WhatsApp.</Text>
                    <TextInput label="Código de verificación" placeholder="000000" maxLength={6} value={codigo}
                               onChange={e => setCodigo(e.currentTarget.value.replace(/\D/g, ""))}
                               error={error} onKeyDown={e => e.key === "Enter" && codigo.length === 6 && onConfirmar()}
                               autoFocus/>
                    <Group justify="flex-end">
                        <Button variant="default" onClick={onClose}>Cancelar</Button>
                        <Button color="teal" loading={loading} disabled={codigo.length !== 6}
                                onClick={onConfirmar}>Confirmar</Button>
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
        const [soloActivasCat, setSoloActivasCat] = useState(true);
        const [soloActivasSub, setSoloActivasSub] = useState(true);
        const [soloActivosProd, setSoloActivosProd] = useState(true);
        const [soloActivosVar, setSoloActivosVar] = useState(true);

        const cat = useModal({nombre: "", activa: true});
        const atr = useModal(emptyAtr);
        const prod = useModal(emptyProd);
        const vari = useModal(emptyVar);
        const stock = useModal(null);

        const [modalSub, setModalSub] = useState({open: false, data: null});
        const [subsList, setSubsList] = useState([]);
        const [nuevaSub, setNuevaSub] = useState("");

        const [modalVerif, setModalVerif] = useState(false);
        const [codigoVerif, setCodigoVerif] = useState("");
        const [verifError, setVerifError] = useState("");
        const [verifLoading, setVerifLoading] = useState(false);
        const [pendienteStock, setPendienteStock] = useState(null);
        const [codigoStock, setCodigoStock] = useState(null);

        const [modalFoto, setModalFoto] = useState({open: false, id: null, tipo: null, titulo: "", url: ""});
        const [savingFoto, setSavingFoto] = useState(false);

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
                const cache = {};
                for (const p of (prods ?? [])) {
                    const base = p.ProductoBase;
                    cache[base.id] = (p.VariantesCompletas ?? []).map(mapearVariante);
                }
                setVariantesCache(cache);
            } catch (e) {
                noti_util("error", "Error cargando datos: " + e);
            } finally {
                setLoading(false);
            }
        };

        const cargarVariantes = async (producto_id) => {
            try {
                const data = await api.productos.obtener(producto_id);
                const variantes = (data.VariantesCompletas ?? []).map(mapearVariante);
                setVariantesCache(prev => ({...prev, [producto_id]: variantes}));
            } catch (e) {
                noti_util("error", "Error cargando variantes: " + e);
            }
        };

        const adaptarProducto = (p) => {
            const base = p.ProductoBase;
            let catNombre = "—", categoriaActiva = null;
            for (const padre of categorias) {
                if (padre.id === base.categoria) {
                    catNombre = padre.nombre;
                    categoriaActiva = padre.activa;
                    break;
                }
                const hijo = (padre.hijos ?? []).find(h => h.id === base.categoria);
                if (hijo) {
                    catNombre = padre.nombre + " > " + hijo.nombre;
                    categoriaActiva = hijo.activa;
                    break;
                }
            }
            return {
                id: base.id, nombre: base.nombre, marca: base.marca,
                categoria: catNombre, categoriaActiva, categoria_id: base.categoria,
                unidades: base.unidades, publicado: base.publicado, descripcion: base.descripcion,
                variantes: variantesCache[base.id] ?? [],
            };
        };

        const productos = productosBase.map(adaptarProducto);

        const abrirFotoProducto = (record) => setModalFoto({
            open: true, id: record.id, tipo: "producto",
            titulo: record.nombre,
            url: api.productos.obtener_foto(record.id) + "?t=" + Date.now()
        });

        const abrirFotoVariante = (variante) => setModalFoto({
            open: true, id: variante.id, tipo: "variante",
            titulo: variante.sku,
            url: api.productos.obtener_foto_variante(variante.id) + "?t=" + Date.now()
        });

        const guardarFoto = async (archivo) => {
            setSavingFoto(true);
            try {
                if (modalFoto.tipo === "producto") await api.productos.actualizar_foto(modalFoto.id, archivo);
                else await api.productos.actualizar_foto_variante(modalFoto.id, archivo);
                setModalFoto(prev => ({
                    ...prev,
                    url: (modalFoto.tipo === "producto" ? api.productos.obtener_foto(modalFoto.id) : api.productos.obtener_foto_variante(modalFoto.id)) + "?t=" + Date.now()
                }));
            } finally {
                setSavingFoto(false);
            }
        };

        const guardarCat = () => cat.guardar(async () => {
            if (cat.modal.data) await api.categorias.cambiar_estado(cat.modal.data.id, cat.form.nombre);
            else await api.categorias.registrar_padre(cat.form.nombre);
            await cargarTodo();
        });

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
            setCategorias(await api.categorias.listar_padres() ?? []);
        };

        const eliminarSub = async (id) => {
            await api.categorias.cambiar_estado(id);
            const cats = await api.categorias.listar_padres() ?? [];
            setCategorias(cats);
            const padre = cats.find(c => (c.hijos ?? []).some(h => h.id === id));
            setSubsList([...(padre?.hijos ?? [])]);
        };

        const editarNombreSub = async (s) => {
            const nuevoNombre = prompt("Nuevo nombre:", s.nombre);
            if (!nuevoNombre || nuevoNombre.trim() === s.nombre) return;
            await api.categorias.actualizar(s.id, nuevoNombre.trim());
            setSubsList(await api.categorias.listar_hijos(modalSub.data.id) ?? []);
            setCategorias(await api.categorias.listar_padres() ?? []);
        };

        const guardarAtr = () => atr.guardar(async () => {
            if (atr.modal.data) await api.productos.actualizar_tipo_atributo(atr.modal.data.id, atr.form);
            else await api.productos.crear_tipo_atributo(atr.form);
            await cargarTodo();
        });

        const guardarProd = () => prod.guardar(async () => {
            if (prod.modal.data) await api.productos.actualizar(prod.modal.data.id, prod.form);
            else await api.productos.crear(prod.form);
            await cargarTodo();
        });

        const guardarVar = () => vari.guardar(async () => {
            const {atributos, ...datosVariante} = vari.form;
            if (vari.modal.data) {
                await api.productos.actualizar_variante(vari.modal.data.id, datosVariante);
                for (const viejo of (vari.modal.data.atributos ?? []))
                    if (viejo.tipo) await api.productos.eliminar_atributo(vari.modal.data.id, viejo.tipo);
                for (const a of atributos)
                    if (a.tipo && a.valor) await api.productos.agregar_atributo({
                        variante_id: vari.modal.data.id,
                        tipo_atributo_id: a.tipo,
                        valor: a.valor
                    });
            } else {
                const nueva = await api.productos.agregar_variante({
                    ...datosVariante,
                    producto_base_id: vari.modal.producto.id
                });
                for (const a of atributos)
                    if (a.tipo && a.valor) await api.productos.agregar_atributo({
                        variante_id: nueva.id,
                        tipo_atributo_id: a.tipo,
                        valor: a.valor
                    });
            }
            await cargarTodo();
        });

        const guardarStock = async (operacion, cantidad) => {
            setPendienteStock({operacion, cantidad});
            if (codigoStock) {
                ejecutarCambioStock(operacion, cantidad, codigoStock);
                return;
            }
            try {
                await api.productos.solicitar_codigo_stock();
                setCodigoVerif("");
                setVerifError("");
                setModalVerif(true);
            } catch (e) {
                noti_util("error", "No se pudo enviar el código: " + (e?.message ?? e));
            }
        };

        const ejecutarCambioStock = async (operacion, cantidad, codigo) => {
            const delta = operacion === "disminuir" ? -cantidad : cantidad;
            try {
                await api.productos.actualizar_stock_variante(stock.modal.data.id, delta, codigo);
                stock.cerrar();
                await cargarTodo();
                noti_util("success", "Stock actualizado correctamente");
            } catch (e) {
                const msg = e?.message ?? "Código incorrecto";
                if (msg.includes("expirado")) {
                    setCodigoStock(null);
                    noti_util("error", "El código expiró, se enviará uno nuevo");
                    guardarStock(operacion, cantidad);
                } else {
                    setCodigoStock(null);
                    setCodigoVerif("");
                    setVerifError(msg);
                    setModalVerif(true);
                }
            }
        };

        const confirmarVerificacion = async () => {
            setVerifLoading(true);
            setVerifError("");
            try {
                const {operacion, cantidad} = pendienteStock;
                await ejecutarCambioStock(operacion, cantidad, codigoVerif);
                setCodigoStock(codigoVerif);
                setModalVerif(false);
            } catch (e) {
                setVerifError(e?.message ?? "Código incorrecto");
            } finally {
                setVerifLoading(false);
            }
        };

        const opsCat = categorias.flatMap(c => {
            const hijos = c.hijos ?? [];
            if (hijos.length > 0) return hijos.map(h => ({
                value: String(h.id),
                label: `${c.nombre} > ${h.nombre}${h.activa ? "" : " (inactivo)"}`,
                inactiva: !h.activa
            }));
            return [{value: String(c.id), label: c.nombre, inactiva: false}];
        });
        const opsTipoAtr = tiposAtributo.map(a => ({value: a.id, label: a.nombre}));
        const recordsCat = categorias.filter(c => c.nombre.toLowerCase().includes(searchCat.toLowerCase())).filter(c => !soloActivasCat || c.activa).map(c => ({
            ...c,
            hijos: soloActivasCat ? (c.hijos ?? []).filter(h => h.activa) : (c.hijos ?? [])
        }));
        const recordsAtr = tiposAtributo.filter(a => a.nombre.toLowerCase().includes(searchAtr.toLowerCase()));
        const recordsProd = productos.filter(p => !soloActivosProd || p.publicado).filter(p => (p.nombre ?? "").toLowerCase().includes(searchProd.toLowerCase()) || (p.marca ?? "").toLowerCase().includes(searchProd.toLowerCase()));

        return (
            <div className="flex flex-col gap-6" style={{position: "relative"}}>
                <ModalCategoria modal={cat.modal} form={cat.form} setForm={cat.setForm} saving={cat.saving}
                                onClose={cat.cerrar} onGuardar={guardarCat}/>
                <ModalSubcategorias modal={modalSub} subsList={subsList} nuevaSub={nuevaSub} setNuevaSub={setNuevaSub}
                                    onAgregar={agregarSub} onEliminar={eliminarSub} onClose={cerrarSubs}
                                    onEditarNombre={editarNombreSub} soloActivas={soloActivasSub}
                                    setSoloActivas={setSoloActivasSub}/>
                <ModalAtributo modal={atr.modal} form={atr.form} setForm={atr.setForm} saving={atr.saving}
                               onClose={atr.cerrar} onGuardar={guardarAtr}/>
                <ModalProducto modal={prod.modal} form={prod.form} setForm={prod.setForm} saving={prod.saving}
                               onClose={prod.cerrar} onGuardar={guardarProd} opsCat={opsCat}/>
                <ModalVariante modal={vari.modal} form={vari.form} setForm={vari.setForm} saving={vari.saving}
                               onClose={vari.cerrar} onGuardar={guardarVar} opsTipoAtr={opsTipoAtr}/>
                <ModalStock modal={stock.modal} onClose={stock.cerrar}
                            onGuardar={(op, cant) => guardarStock(op, cant)}/>
                <ModalVerificacion opened={modalVerif} onClose={() => setModalVerif(false)}
                                   onConfirmar={confirmarVerificacion}
                                   loading={verifLoading} error={verifError} codigo={codigoVerif}
                                   setCodigo={setCodigoVerif}/>
                <ModalFoto opened={modalFoto.open} onClose={() => setModalFoto(prev => ({...prev, open: false}))}
                           fotoUrl={modalFoto.url} onCambiarFoto={guardarFoto} saving={savingFoto}
                           titulo={modalFoto.titulo}/>
                <div className="flex flex-1 justify-between gap-6">
                    <TablaCategorias records={recordsCat} searchCat={searchCat} setSearchCat={setSearchCat}
                                     onCrear={() => cat.abrir(null, {nombre: "", activa: true})}
                                     onEditar={c => cat.abrir(c, {nombre: c.nombre, activa: c.activa})}
                                     onSubs={abrirSubs} soloActivas={soloActivasCat}
                                     setSoloActivas={setSoloActivasCat}/>
                    <TablaAtributos records={recordsAtr} searchAtr={searchAtr} setSearchAtr={setSearchAtr}
                                    onCrear={() => atr.abrir(null, emptyAtr)}
                                    onEditar={a => atr.abrir(a, {nombre: a.nombre})}/>
                </div>
                <TablaProductos
                    records={recordsProd} tiposAtributo={tiposAtributo} searchProd={searchProd}
                    setSearchProd={setSearchProd}
                    onCrear={() => prod.abrir(null, emptyProd)}
                    onEditar={p => prod.abrir(p, {
                        nombre: p.nombre,
                        marca: p.marca,
                        categoria_id: p.categoria_id ? String(p.categoria_id) : null,
                        unidades: p.unidades,
                        descripcion: p.descripcion,
                        publicado: p.publicado
                    })}
                    onCrearVar={p => vari.abrir(null, emptyVar, { producto: p })}
                    onEditarVar={(v, p) => {
                        vari.abrir(
                            v,
                            {
                                sku: v.sku,
                                precio_venta: v.precio_venta,
                                precio_mayorista: v.precio_mayorista,
                                precio_minimo: v.precio_minimo,
                                activa: v.activa,
                                atributos: (v.atributos ?? []).map(a => ({...a}))
                            },
                            {producto: p}
                        );
                    }}
                    onModificarStock={v => stock.abrir(v, v)}
                    onVerFoto={abrirFotoProducto}
                    onVerFotoVariante={abrirFotoVariante}
                    onExpandir={cargarVariantes}
                    soloActivos={soloActivosProd} setSoloActivos={setSoloActivosProd}
                    soloActivosVar={soloActivosVar} setSoloActivosVar={setSoloActivosVar}
                    variantesCache={variantesCache}
                />
            </div>
        );
    }