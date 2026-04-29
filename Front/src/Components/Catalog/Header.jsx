import {useState} from 'react'
import {NavLink, useNavigate} from 'react-router-dom'
import {useUser, useClerk, UserProfile} from '@clerk/clerk-react'
import logo from '../../assets/aglome _copy.png'
import {noti_util} from "../../Utils/Toast.jsx";

export default function Header() {
    const [menuAbierto, setMenuAbierto] = useState(false)
    const [menuUsuario, setMenuUsuario] = useState(false)
    const [perfilAbierto, setPerfilAbierto] = useState(false)


    const navigate = useNavigate()
    const {isSignedIn, user} = useUser()
    const {signOut, openSignIn} = useClerk()
    const esAdmin = true
    //const esAdmin = user?.publicMetadata?.role === "admin"


    const handleSearch = (e) => {
        e.preventDefault()
        const q = e.target.q.value
        navigate(`/tienda?q=${q}`)
    }

    const handleClickUsuario = () => {
        if (isSignedIn) {
            setMenuUsuario(!menuUsuario)
        } else {
            openSignIn()
        }
    }

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="w-full pl-5">
                <div className="flex items-center gap-5 py-4 min-h-[70px] flex-wrap">

                    <NavLink to="/"
                             className="flex items-center gap-2 text-[#2c3e50] font-bold text-2xl no-underline hover:opacity-90 transition-opacity">
                        <img src={logo} alt="AGLOME" className="w-12 h-12 object-contain"/>
                        <div className="text-2xl font-bold text-[#2c3e50] whitespace-nowrap">
                            AGLO<span className="text-[#3498db]">ME</span>
                            <span className="text-[#3498db] text-xs font-bold ml-0.5 align-super">PERU</span>
                        </div>
                    </NavLink>

                    <button
                        className="md:hidden ml-auto w-11 h-11 flex items-center justify-center bg-gray-100 rounded-md text-xl text-[#2c3e50] hover:bg-gray-200 transition-colors"
                        onClick={() => setMenuAbierto(!menuAbierto)}
                        aria-label="Abrir menú"
                    >
                        <i className={`fas ${menuAbierto ? 'fa-times' : 'fa-bars'}`}></i>
                    </button>

                    <nav
                        className={`${menuAbierto ? 'flex' : 'hidden'} md:flex flex-col md:flex-row w-full md:w-auto md:flex-1 md:justify-center`}>
                        <ul className="flex flex-col md:flex-row gap-0 md:gap-10 list-none p-0 m-0 w-full md:w-auto border-t md:border-none border-gray-100 mt-2 md:mt-0">
                            {[
                                {to: '/', label: 'INICIO'},
                                {to: '/nosotros', label: 'NOSOTROS'},
                                {to: '/tienda', label: 'TIENDA'},
                                {to: '/reclamaciones', label: 'LIBRO DE RECLAMACIONES'},
                                {to: '/contactanos', label: 'CONTACTANOS'},
                            ].map(({to, label}) => (
                                <li key={to} className="border-b md:border-none border-gray-100">
                                    <NavLink
                                        to={to}
                                        end={to === '/'}
                                        className={({isActive}) =>
                                            `block px-4 md:px-0 py-3 md:py-2 text-sm font-semibold uppercase tracking-wide transition-colors duration-300 relative
                      ${isActive ? 'text-[#3498db] font-bold' : 'text-[#2c3e50] hover:text-[#3498db]'}`
                                        }
                                    >
                                        {({isActive}) => (
                                            <>
                                                {label}
                                                {isActive && (
                                                    <span
                                                        className="hidden md:block absolute bottom-0 left-0 w-full h-[3px] bg-[#3498db] rounded"/>
                                                )}
                                            </>
                                        )}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </nav>
                    <form
                        onSubmit={handleSearch}
                        className={`${menuAbierto ? 'flex' : 'hidden'} md:flex items-center bg-gray-50 rounded-full px-3 py-1 shadow-sm focus-within:shadow-blue-200 focus-within:bg-white transition-all max-w-[350px] w-full md:w-auto`}
                    >
                        <input
                            type="text"
                            name="q"
                            placeholder="Buscar productos..."
                            className="border-none bg-transparent px-3 py-2 text-sm outline-none flex-1 text-[#2c3e50] placeholder-gray-400"
                        />
                        <button
                            type="submit"
                            className="bg-[#3498db] text-white px-3 py-2 rounded-full hover:bg-[#2980b9] transition-colors flex items-center justify-center"
                        >
                            <i className="fas fa-search text-sm"></i>
                        </button>
                    </form>

                    <div className="relative mr-5 ml-auto md:ml-0">
                        <button
                            onClick={handleClickUsuario}
                            className="flex items-center gap-2 rounded-full focus:outline-none group"
                            aria-label="Menú de usuario"
                        >
                            {isSignedIn ? (
                                <img src={user.imageUrl} alt={user.firstName}
                                     className="w-10 h-10 rounded-full object-cover border-2 border-[#3498db] shadow-sm group-hover:border-[#2980b9] transition-colors"/>
                            ) : (
                                <div
                                    className="w-10 h-10 rounded-full bg-[#3498db] flex items-center justify-center shadow-sm hover:bg-[#2980b9] transition-colors">
                                    <i className="fas fa-user text-white text-base"></i>
                                </div>
                            )}
                            {isSignedIn && (
                                <span
                                    className="hidden md:block text-sm font-semibold text-[#2c3e50] group-hover:text-[#3498db] transition-colors">
                                    {user.firstName}
                                </span>
                            )}
                            {isSignedIn && (
                                <i className={`fas fa-chevron-down text-xs text-gray-400 hidden md:block transition-transform duration-200 ${menuUsuario ? 'rotate-180' : ''}`}></i>
                            )}
                        </button>

                        {isSignedIn && menuUsuario && (
                            <div
                                className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                                <div className="px-4 py-2 border-b border-gray-100">
                                    <p className="text-sm font-semibold text-[#2c3e50]">{user.firstName} {user.lastName}</p>
                                    <p className="text-xs text-gray-400">{user.primaryEmailAddress?.emailAddress}</p>
                                </div>
                                <button
                                    onClick={() => {
                                        setPerfilAbierto(true);
                                        setMenuUsuario(false)
                                    }}
                                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#2c3e50] hover:bg-blue-50 hover:text-[#3498db] transition-colors"
                                >
                                    <i className="fas fa-user-circle w-4"></i>
                                    Mi perfil
                                </button>
                                {esAdmin ? <button
                                    onClick={() => {
                                        setPerfilAbierto(true);
                                        setMenuUsuario(false)
                                        navigate('/admin')
                                    }}
                                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#2c3e50] hover:bg-blue-50 hover:text-[#3498db] transition-colors"
                                >
                                    <i className="fas fa-dashboard w-4"></i>
                                    Panel de control

                                </button> : null
                                }
                                <button
                                    onClick={() => {
                                        setMenuUsuario(false)
                                        noti_util("advertencia", "Cerrando sesión...")
                                        setTimeout(() => {
                                            signOut()
                                        }, 2500)
                                    }}
                                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                                >
                                    <i className="fas fa-sign-out-alt w-4"></i>
                                    Cerrar sesión
                                </button>
                            </div>
                        )}
                    </div>

                    {perfilAbierto && (
                        <div
                            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50"
                            onClick={() => setPerfilAbierto(false)}
                        >
                            <div
                                onClick={e => e.stopPropagation()}
                                className="max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl"
                                style={{maxWidth: "900px", width: "95vw"}}
                            >
                                <UserProfile
                                    appearance={{
                                        elements: {
                                            card: {height: "100%", boxShadow: "none"},
                                            scrollBox: {height: "100%", overflowY: "auto"}
                                        }
                                    }}>
                                    <UserProfile.Page
                                        label="Mis Pedidos"
                                        url="pedidos"
                                        labelIcon={<i className="fas fa-box"/>}
                                    >
                                        <h1>sdsas</h1>
                                    </UserProfile.Page>

                                    <UserProfile.Page
                                        label="Cupones"
                                        url="cupones"
                                        labelIcon={<i className="fas fa-ticket"/>}
                                    >
                                        <div>Contenido de cupones aquí</div>
                                    </UserProfile.Page>

                                    <UserProfile.Page
                                        label="Direcciones"
                                        url="direcciones"
                                        labelIcon={<i className="fas fa-house"/>}
                                    >
                                        <div>Contenido de direcciones aquí</div>
                                    </UserProfile.Page>

                                </UserProfile>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </header>
    )
}