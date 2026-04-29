import {AppShell, Burger, NavLink} from '@mantine/core'
import logo from '../../assets/aglome _copy.png'
import {useDisclosure} from '@mantine/hooks'
import {Outlet, useNavigate} from 'react-router-dom'

export default function Admin() {
    const [opened, {toggle}] = useDisclosure()
    const navigate = useNavigate()

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

                    <span className="font-semibold text-[#2c3e50] text-xl">
                        Panel de control
                    </span>

                </div>
            </AppShell.Header>

            <AppShell.Navbar p="md" >
                <NavLink
                    label="Dashboard"
                    fz="xl"
                    leftSection={<i className="fas fa-gauge text-[#3498db]"/>}
                    onClick={() => navigate('/admin')}
                />
                <NavLink
                    label="Productos"
                    fz="xl"
                    leftSection={<i className="fas fa-box text-[#3498db]"/>}
                    onClick={() => navigate('/admin/productos')}
                />
                <NavLink
                    label="Pedidos"
                    fz="xl"
                    leftSection={<i className="fas fa-shopping-cart text-[#3498db]"/>}
                    onClick={() => navigate('/admin/pedidos')}
                />
                <NavLink
                    label="Usuarios"
                    fz="xl"
                    leftSection={<i className="fas fa-users text-[#3498db]"/>}
                    onClick={() => navigate('/admin/usuarios')}
                />
                <NavLink
                    label="Cupones"
                    fz="xl"
                    leftSection={<i className="fas fa-ticket text-[#3498db]"/>}
                    onClick={() => navigate('/admin/cupones')}
                />
                <NavLink
                    label="Promociones"
                    fz="xl"
                    leftSection={<i className="fas fa-tag text-[#3498db]"/>}
                    onClick={() => navigate('/admin/promociones')}
                />
                <NavLink
                    label="Chatbot"
                    fz="xl"
                    leftSection={<i className="fas fa-robot text-[#3498db]"/>}
                    onClick={() => navigate('/admin/chatbot')}
                />
                <NavLink
                    label="Config"
                    fz="xl"
                    leftSection={<i className="fas fa-gear text-[#3498db]"/>}
                    onClick={() => navigate('/admin/config')}
                />
            </AppShell.Navbar>

<AppShell.Main style={{ height: 'calc(100vh - 60px)', display: 'flex', flexDirection: 'column', padding: 0 }}>
    <div style={{ flex: 1, overflow: 'hidden', height: '100%' }}>
        <Outlet/>
    </div>
</AppShell.Main>
        </AppShell>
    )
}