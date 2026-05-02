import {Api_manager} from "@/Service/Api_manager.jsx";

export default function MisCupones() {
    const api = Api_manager()
    const ble  =api.usuarios.obtener_perfil()
    console.log(ble)
    return (
        <div className=" h-screen border">
            <div className=""></div>
        </div>
    )
}