import {AppShell, Burger, NavLink, LoadingOverlay} from '@mantine/core'
import logo from '../../assets/aglome _copy.png'
import {useDisclosure} from '@mantine/hooks'
import {Outlet, useNavigate, useLocation} from 'react-router-dom'
import {LoadingProvider, useLoading} from "../../Service/LoadingContext.jsx"

function AdminInner() {
    const [opened, {toggle}] = useDisclosure()
    const navigate = useNavigate()
    const location = useLocation()
    const {loading} = useLoading()

    const activo = (path) => location.pathname === path

    return (
        <AppShell
            header={{height: 60}}
            navbar={{width: 250, breakpoint: 'sm', collapsed: {mobile: !opened}}}
            padding="md"
        >
            <AppShell.Header className="flex items-center px-4">
                <Burger onClick={toggle} hiddenFrom="sm"/>
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
                        <img src={logo} alt="AGLOME" className="w-10 h-10 object-contain"/>
                        <span className="font-bold text-[#2c3e50]">
                            AGLO
                            <span className="text-[#3498db]">ME</span>
                            <span className="text-[#3498db] text-[10px] ml-0.5 align-super">PERU</span>
                        </span>
                    </div>
                    <span className="font-semibold text-[#2c3e50] text-xl">Panel de control</span>
                </div>
            </AppShell.Header>

            <AppShell.Navbar p="md">
                <NavLink active={activo('/admin')} label="Dashboard" fz="xl"
                         leftSection={<i className="fas fa-gauge text-[#3498db]"/>}
                         onClick={() => navigate('/admin')}/>

                <NavLink active={activo('/proveedores')} label="Proveedores" fz="xl"
                         leftSection={<i className="fas fa-box text-[#3498db]"/>}
                         onClick={() => navigate('/admin/proveedores')}/>

                <NavLink active={activo('/admin/productos')} label="Productos" fz="xl"
                         leftSection={<i className="fas fa-box text-[#3498db]"/>}
                         onClick={() => navigate('/admin/productos')}/>
                <NavLink active={activo('/admin/pedidos')} label="Pedidos" fz="xl"
                         leftSection={<i className="fas fa-shopping-cart text-[#3498db]"/>}
                         onClick={() => navigate('/admin/pedidos')}/>
                <NavLink active={activo('/admin/usuarios')} label="Usuarios" fz="xl"
                         leftSection={<i className="fas fa-users text-[#3498db]"/>}
                         onClick={() => navigate('/admin/usuarios')}/>
                <NavLink active={activo('/admin/cupones')} label="MisCupones" fz="xl"
                         leftSection={<i className="fas fa-ticket text-[#3498db]"/>}
                         onClick={() => navigate('/admin/cupones')}/>
                <NavLink active={activo('/admin/promociones')} label="Promociones" fz="xl"
                         leftSection={<i className="fas fa-tag text-[#3498db]"/>}
                         onClick={() => navigate('/admin/promociones')}/>
                <NavLink active={activo('/admin/chatbot')} label="Chatbot" fz="xl"
                         leftSection={<i className="fas fa-robot text-[#3498db]"/>}
                         onClick={() => navigate('/admin/chatbot')}/>
            </AppShell.Navbar>

            <AppShell.Main style={{overflow: 'auto', position: 'relative'}}>
                <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{radius: "sm", blur: 2}}/>
                <Outlet/>
            </AppShell.Main>
        </AppShell>
    )
}

export default function Admin() {
    return (
        <LoadingProvider>
            <AdminInner/>
        </LoadingProvider>
    )
}