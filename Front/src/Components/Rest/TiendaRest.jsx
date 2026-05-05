import {useEffect, useRef, useState} from 'react'
import {
    ActionIcon, Badge, Box, Button, Card, Divider, Group, Image, Modal, NavLink, Pagination,
    ScrollArea, Skeleton, Text, TextInput, Title, UnstyledButton, Collapse
} from '@mantine/core'
import {
    IconBoxOff, IconBrandWhatsapp, IconChevronDown, IconMenu2, IconSearch, IconShoppingCart, IconX
} from '@tabler/icons-react'
import {Api_manager} from "@/Service/Api_manager.jsx";
import {useSearchParams} from 'react-router-dom'
import {DataTable} from "mantine-datatable";

function EmptyState() {
    return (
        <div className="col-span-full flex flex-col items-center justify-center py-20 px-6 text-center gap-4">
            <Box className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center mb-4 ">
                <IconBoxOff size={48} className="text-[#3498db]"/>
            </Box>
            <Title order={3} className="text-[#2c3e50] mb-2">
                No hay productos disponibles
            </Title>
            <Text size="sm" c="dimmed" className="max-w-xs mb-6">
                En este momento no hay productos registrados. Vuelve pronto o contáctanos para más información.
            </Text>
            <Button
                component="a"
                href="https://wa.me/51923197032"
                target="_blank"
                rel="noreferrer"
                leftSection={<IconBrandWhatsapp size={18}/>}
                className="bg-[#25D366] hover:bg-[#1ebe5d] text-white font-semibold"
                styles={{root: {backgroundColor: '#25D366', '&:hover': {backgroundColor: '#1ebe5d'}}}}
            >
                Consultar por WhatsApp
            </Button>
        </div>
    )
}


function SkeletonCard() {
    return (
        <Card withBorder radius="md" padding={0} className="overflow-hidden">
            <Skeleton height={208} radius={0}/>
            <Box className="p-4 space-y-3">
                <Skeleton height={14} width="75%" mx="auto" radius="sm"/>
                <Skeleton height={12} width="50%" mx="auto" radius="sm"/>
                <Skeleton height={12} radius="sm"/>
                <Skeleton height={36} radius="sm" mt={8}/>
            </Box>
        </Card>
    )
}


function ProductoCard({producto}) {

    return (
        <Card
            withBorder
            radius="md"
            padding={0}
            className="translate-y-4 transition-all duration-500 flex flex-col cursor-pointer
                hover:-translate-y-1 hover:shadow-lg hover:border-[#3498db] overflow-hidden">

            <Box
                className="h-52 flex items-center justify-center p-5 border-b border-gray-100 bg-white relative overflow-hidden">
                <Image
                    alt={producto.nombre}
                    fit="contain"
                    h={180}
                    className="transition-transform duration-300 hover:scale-105"
                />
                <Badge
                    color="gray"
                    variant="filled"
                    size="sm"
                    className="absolute top-2 right-2 text-[11px] font-bold uppercase"
                >
                </Badge>
            </Box>

            <Box className="p-4 flex flex-col flex-1 text-center">
                <Text fw={600} size="sm" c="#333" className="mb-2 leading-snug min-h-[42px]">
                    {producto.nombre}
                </Text>

                <Badge
                    variant="light"
                    color="gray"
                    size="xs"
                    className="mx-auto mb-3 uppercase text-[11px]"
                >
                </Badge>

                <Divider className="mb-3"/>


                <Button
                    onClick={(e) => {
                        e.stopPropagation()
                    }}
                    fullWidth
                    radius="sm"
                    size="sm"
                    className={'border-[#3498db] text-[#3498db] hover:bg-[#3498db] hover:text-white transition-all'}
                    styles={{root: {backgroundColor: '#bdc3c7', borderColor: '#bdc3c7'}}}
                >
                </Button>
            </Box>
        </Card>
    )
}

function GridProductos({cargando, productos}) {
    return (
        <div className="grid gap-6" style={{gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))'}}>
            {cargando
                ? Array.from({length: 8}).map((_, i) => <SkeletonCard key={i}/>)
                : productos.length === 0
                    ? <EmptyState/>
                    : productos.map((p) => (
                        <ProductoCard key={p.id} producto={p}/>
                    ))
            }
        </div>
    )
}

function BarraBusqueda({busqueda, setBusqueda, onSubmit}) {
    return (
        <Card
            withBorder={false}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 bg-white p-5 rounded shadow-sm"
            padding={0}
            style={{padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)'}}
        >
            <Title
                order={2}
                className="text-[#2c3e50] uppercase border-l-[5px] border-[#3498db] pl-4 m-0"
                style={{fontSize: '1.4rem'}}
            >
                Nuestros Productos
            </Title>

            <form onSubmit={onSubmit} className="flex gap-2">
                <TextInput
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    placeholder="Buscar productos..."
                    radius="md"
                    size="sm"
                    className="w-56"
                    styles={{
                        input: {
                            borderColor: '#ddd',
                            '&:focus': {borderColor: '#3498db'},
                        },
                    }}
                />
                <ActionIcon
                    type="submit"
                    size="lg"
                    radius="md"
                    className="bg-[#3498db] hover:bg-[#2980b9] text-white"
                    styles={{root: {backgroundColor: '#3498db', '&:hover': {backgroundColor: '#2980b9'}}}}
                >
                    <IconSearch size={16}/>
                </ActionIcon>
            </form>
        </Card>
    )
}

function TablaCategorias({
                             categoriasPadre,
                             categoriaSeleccionada,
                             subCategoriaSeleccionada,
                             handleCategoria,
                             handleSubCategoria
                         }) {
    const [expandidosPadre, setExpandidosPadre] = useState([1])
    const [expandidosHijos, setExpandidosHijos] = useState([])

    return (
        <div className="w-full">
            <div className="flex justify-center">
                <DataTable
                    records={[{id: 1, nombre: "Categorías"}]}
                    columns={[{
                        accessor: 'nombre',
                        render: (record) => (
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                <span>{record.nombre}</span>
                                <i className="fas fa-chevron-down"></i>
                            </div>
                        ),
                        width: 200,
                        cellsStyle: () => ({
                            fontSize: '15px',
                            fontWeight: 500,
                            fontFamily: 'Inter, sans-serif',
                            color: '#2c3e50',
                            letterSpacing: '0.6px',
                        }),
                    }]}
                    classNames={{header: 'hidden'}}
                    styles={{
                        header: {display: 'none'},
                        table: {width: '300px'},
                        root: {width: '300px'},
                    }}
                    rowStyle={(record, index) => ({
                        backgroundColor: "#3498db",
                        cursor: 'pointer',
                    })}
                    rowExpansion={{

                        allowMultiple: false,
                        expanded: {
                            recordIds: expandidosPadre,
                            onRecordIdsChange: setExpandidosPadre,
                        },
                        content: () => (

                            <DataTable
                                records={[{id: -1, nombre: "Todos"}, ...categoriasPadre]}
                                columns={[{
                                    accessor: 'nombre',
                                    render: (record) => (
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between'
                                        }}>
                                            <span>{record.nombre}</span>
                                            {record.hijos?.length > 0 &&
                                                <i className="fas fa-chevron-down"></i>}
                                        </div>
                                    ),
                                }]}
                                styles={{header: {display: 'none'}}}
                                onRowClick={({record, event}) => {
                                    event.stopPropagation()
                                    handleCategoria(record)
                                    if (record.id !== -1 && record.hijos?.length > 0) {
                                        setExpandidosHijos(prev =>
                                            prev.includes(record.id)
                                                ? prev.filter(id => id !== record.id)
                                                : [record.id]
                                        )
                                    }
                                }}
                                rowStyle={(record, index) => ({
                                    backgroundColor: record.id === categoriaSeleccionada?.id
                                        ? '#2980b9'
                                        : undefined,
                                    cursor: 'pointer',
                                })}
                                rowExpansion={{
                                    trigger: 'never',
                                    allowMultiple: false,
                                    expanded: {
                                        recordIds: expandidosHijos,
                                        onRecordIdsChange: setExpandidosHijos,
                                    },
                                    content: ({record}) => (
                                        <DataTable
                                            records={record.hijos ?? []}
                                            columns={[{accessor: 'nombre'}]}
                                            styles={{header: {display: 'none'}}}
                                            onRowClick={({record: hijo, event}) => {
                                                event.stopPropagation()
                                                handleSubCategoria(hijo)

                                            }}
                                            rowStyle={(record, index) => ({
                                                backgroundColor: record.id === subCategoriaSeleccionada?.id
                                                    ? '#2980b9'
                                                    : undefined,
                                                cursor: 'pointer',
                                                paddingLeft: '24px',
                                            })}
                                        />
                                    )
                                }}
                            />
                        )
                    }}
                />
            </div>
        </div>
    )
}


export default function TiendaRest() {
    const api = Api_manager()
    const [categoriasPadre, setCategoriasPadre] = useState([])
    const [busqueda, setBusqueda] = useState('')
    const [paginaActual, setPaginaActual] = useState(1)
    const [sidebarAbierto, setSidebarAbierto] = useState(true)
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(-1)
    const [subCategoriaSeleccionada, setSubCategoriaSeleccionada] = useState(null)
    const [loading, setLoading] = useState(null)
    const [expandidosPadre, setExpandidosPadre] = useState([1])
    const [productos, setProductos] = useState([])

    const cargarCategorias = async () => {
        const padres = await api.categorias.listar_padres()
        console.log(padres)
        setCategoriasPadre(padres)
    }

    const handleCambiarPagina = () => {
        console.log(112)
    }

    const handleBusqueda = (e) => {
        e.preventDefault()
        setPaginaActual(1)
    }

    const handleCategoria = (cat) => {
        setCategoriaSeleccionada(cat)
        setSubCategoriaSeleccionada(null)
        setPaginaActual(1)
    }
    const handleSubCategoria = (sub) => {
        setSubCategoriaSeleccionada(sub)
        setPaginaActual(1)
    }

    useEffect(() => {
        cargarCategorias()
        setProductos([{"id":"asd","nombre":"ads"}])
    }, [])

    return (
        <>
            <main className="w-[90%] max-w-[1400px] mx-auto py-10 pb-20">
                <div className="flex flex-col flex-1 md:flex-row gap-6 relative items-start">
                    <div className="w-full md:w-90 md:shrink-0">
                        <TablaCategorias
                            categoriasPadre={categoriasPadre}
                            categoriaSeleccionada={categoriaSeleccionada}
                            handleCategoria={handleCategoria}
                            handleSubCategoria={handleSubCategoria}
                            subCategoriaSeleccionada={subCategoriaSeleccionada}
                        />
                    </div>
                    <div className="w-full md:flex-1 md:min-w-0">
                        <GridProductos cargando={loading} productos={productos}/>
                    </div>
                </div>
            </main>

        </>
    )

}