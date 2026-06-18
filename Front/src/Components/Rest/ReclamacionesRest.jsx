import {useRef, useEffect, useState} from 'react'

const tiposReclamo = [
    {valor: 'queja', icono: 'fa-comment-dots', titulo: 'Queja', desc: 'Malestar o insatisfacción con el servicio'},
    {
        valor: 'reclamo',
        icono: 'fa-exclamation-triangle',
        titulo: 'Reclamo',
        desc: 'Solicitud de solución o compensación'
    },
    {valor: 'sugerencia', icono: 'fa-lightbulb', titulo: 'Sugerencia', desc: 'Propuesta para mejorar nuestro servicio'},
]

const infoLegal = [
    {
        icono: 'fa-shield-alt',
        titulo: 'Derechos del Consumidor',
        desc: 'De acuerdo a la Ley 29571 (Código de Protección y Defensa del Consumidor)'
    },
    {icono: 'fa-clock', titulo: 'Plazo de Respuesta', desc: '15 días hábiles para responder formalmente a tu reclamo'},
    {
        icono: 'fa-file-contract',
        titulo: 'Constancia Digital',
        desc: 'Recibirás un código de seguimiento y constancia de tu reclamo'
    },
]

export default function ReclamacionesRest() {
    const animablesRef = useRef([])
    const [tipoSeleccionado, setTipoSeleccionado] = useState('queja')
    const [confirmado, setConfirmado] = useState(false)

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('opacity-100', 'translate-y-0')
                    entry.target.classList.remove('opacity-0', 'translate-y-5')
                    observer.unobserve(entry.target)
                }
            })
        }, {threshold: 0.1, rootMargin: '0px 0px -100px 0px'})

        animablesRef.current.forEach(el => {
            if (el) observer.observe(el)
        })
        return () => observer.disconnect()
    }, [])

    const addRef = (el) => {
        if (el && !animablesRef.current.includes(el)) animablesRef.current.push(el)
    }

    const limpiarFormulario = () => {
        document.getElementById('form-reclamo').reset()
        setTipoSeleccionado('queja')
        setConfirmado(false)
    }

    return (
        <>
            <section className="py-10 bg-[#f8f9fa]">
                <div className="max-w-6xl mx-auto px-5">
                    <div
                        ref={addRef}
                        className="opacity-0 translate-y-5 transition-all duration-500 bg-white p-8 rounded-xl shadow-md border-l-[5px] border-[#3498db]">
                        <h2 className="text-2xl font-bold text-[#2c3e50] mb-6 flex items-center gap-3">
                            <i className="fas fa-info-circle "></i> Información Legal
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                            {infoLegal.map((item) => (
                                <div key={item.titulo}
                                     className="bg-[#f8f9fa] p-5 rounded-xl text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                                    <i className={`fas ${item.icono} text-4xl text-[#3498db] mb-4 block`}></i>
                                    <h3 className="text-lg font-bold text-[#2c3e50] mb-2">{item.titulo}</h3>
                                    <p className="text-[#7f8c8d] text-sm leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <main className="max-w-6xl mx-auto px-5 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-10">

                    <form
                        id="form-reclamo"
                        ref={addRef}
                        className="opacity-0 translate-y-5 transition-all duration-500 bg-white p-10 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
                        onSubmit={(e) => e.preventDefault()}>

                        <h2 className="text-3xl font-bold text-[#2c3e50] mb-8 pb-4 border-b-3 border-[#3498db] flex items-center gap-3">
                            <i className="fas fa-edit "></i> Presentar Reclamo
                        </h2>

                        <div className="mb-10 pb-6 border-b border-gray-100">
                            <h3 className="text-xl font-bold text-[#2c3e50] mb-5">1. Tipo de Reclamo</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {tiposReclamo.map((t) => (
                                    <label key={t.valor} className="cursor-pointer">
                                        <input type="radio" name="tipo" value={t.valor} className="hidden"
                                               checked={tipoSeleccionado === t.valor}
                                               onChange={() => setTipoSeleccionado(t.valor)}/>
                                        <div className={`p-5 rounded-xl border-2 text-center transition-all duration-300
                      ${tipoSeleccionado === t.valor
                                            ? 'bg-[#e8f4fc] border-[#3498db] -translate-y-1 shadow-[0_5px_15px_rgba(52,152,219,0.2)]'
                                            : 'bg-[#f8f9fa] border-transparent hover:border-gray-200'}`}>
                                            <i className={`fas ${t.icono} text-3xl text-[#3498db] mb-3 block`}></i>
                                            <h4 className="font-bold text-[#2c3e50] mb-1">{t.titulo}</h4>
                                            <p className="text-[#7f8c8d] text-xs leading-relaxed">{t.desc}</p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="mb-10 pb-6 border-b border-gray-100">
                            <h3 className="text-xl font-bold text-[#2c3e50] mb-5">2. Datos del Reclamante</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                    {label: 'Nombres Completos *', id: 'nombres', type: 'text', required: true},
                                    {label: 'Apellidos Completos *', id: 'apellidos', type: 'text', required: true},
                                    {label: 'DNI o CE *', id: 'dni', type: 'text', required: true},
                                    {label: 'Teléfono *', id: 'telefono', type: 'tel', required: true},
                                    {label: 'Correo Electrónico *', id: 'email', type: 'email', required: true},
                                    {label: 'Dirección', id: 'direccion', type: 'text', required: false},
                                ].map((field) => (
                                    <div key={field.id}>
                                        <label htmlFor={field.id}
                                               className="block mb-2 font-semibold text-[#2c3e50] text-sm">{field.label}</label>
                                        <input
                                            type={field.type} id={field.id} name={field.id} required={field.required}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-base focus:outline-none focus:border-[#3498db] transition-colors"/>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Paso 3: Detalles */}
                        <div className="mb-10 pb-6 border-b border-gray-100">
                            <h3 className="text-xl font-bold text-[#2c3e50] mb-5">3. Detalles del Reclamo</h3>

                            <div className="mb-5">
                                <label htmlFor="fecha-incidente"
                                       className="block mb-2 font-semibold text-[#2c3e50] text-sm">Fecha del incidente
                                    *</label>
                                <input type="date" id="fecha-incidente" name="fecha_incidente" required
                                       className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#3498db] transition-colors"/>
                            </div>

                            <div className="mb-5">
                                <label htmlFor="producto-servicio"
                                       className="block mb-2 font-semibold text-[#2c3e50] text-sm">Producto/Servicio
                                    involucrado *</label>
                                <select id="producto-servicio" name="producto_servicio" required
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#3498db] transition-colors">
                                    <option value="">Seleccione</option>
                                    {['Melaminas', 'Maderas', 'Herramientas', 'Accesorios', 'Servicio Técnico', 'Entrega a domicilio', 'Atención al cliente', 'Otro'].map(o => (
                                        <option key={o} value={o.toLowerCase()}>{o}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-5">
                                <label htmlFor="detalle" className="block mb-2 font-semibold text-[#2c3e50] text-sm">Descripción
                                    detallada *</label>
                                <textarea id="detalle" name="detalle" rows={5} required
                                          placeholder="Describa claramente el problema, incluyendo fechas, productos, personas involucradas y lo que espera como solución."
                                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#3498db] transition-colors resize-y min-h-[100px]"/>
                                <small className="text-[#7f8c8d] text-xs mt-1 block">Máximo 5000 caracteres</small>
                            </div>

                            <div>
                                <label htmlFor="pedido" className="block mb-2 font-semibold text-[#2c3e50] text-sm">Pedido/Solución
                                    esperada *</label>
                                <textarea id="pedido" name="pedido" rows={3} required
                                          placeholder="¿Qué solución espera recibir? Ej: Cambio del producto, devolución, disculpas, etc."
                                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#3498db] transition-colors resize-y min-h-[100px]"/>
                            </div>
                        </div>

                        {/* Paso 4: Archivos */}
                        <div className="mb-10 pb-6 border-b border-gray-100">
                            <h3 className="text-xl font-bold text-[#2c3e50] mb-5">4. Archivos Adjuntos (Opcional)</h3>
                            <div className="flex flex-col gap-4">
                                {[
                                    {
                                        id: 'fotos',
                                        icono: 'fa-camera',
                                        label: 'Fotos del producto/incidente',
                                        accept: 'image/*',
                                        small: 'Máximo 5 fotos, 5MB cada una'
                                    },
                                    {
                                        id: 'documentos',
                                        icono: 'fa-file-pdf',
                                        label: 'Facturas o documentos',
                                        accept: '.pdf,.jpg,.png',
                                        small: 'PDF, JPG o PNG, máximo 10MB'
                                    },
                                ].map((f) => (
                                    <div key={f.id}
                                         className="bg-[#f8f9fa] p-4 rounded-lg border-2 border-dashed border-gray-300">
                                        <label htmlFor={f.id}
                                               className="flex items-center gap-3 cursor-pointer font-semibold text-[#2c3e50] text-sm">
                                            <i className={`fas ${f.icono} text-[#3498db] text-lg`}></i>
                                            {f.label}
                                            <input type="file" id={f.id} name={`${f.id}[]`} accept={f.accept} multiple
                                                   className="hidden"/>
                                        </label>
                                        <small className="text-[#7f8c8d] text-xs mt-1 block ml-7">{f.small}</small>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Confirmación y botones */}
                        <div>
                            <div className="bg-[#f8f9fa] p-4 rounded-lg mb-6">
                                <label
                                    className="flex items-start gap-3 cursor-pointer text-[#2c3e50] text-sm leading-relaxed">
                                    <input type="checkbox" required
                                           checked={confirmado}
                                           onChange={() => setConfirmado(!confirmado)}
                                           className="mt-1"/>
                                    <span>Declaro que la información proporcionada es verídica y autorizo el tratamiento de mis datos personales para el procesamiento de mi reclamo, de acuerdo a la Ley 29733.</span>
                                </label>
                            </div>
                            <div className="flex gap-4">
                                <button type="button" onClick={limpiarFormulario}
                                        className="flex-1 py-4 rounded-lg font-bold text-white bg-[#95a5a6] hover:bg-[#7f8c8d] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-3">
                                    <i className="fas fa-eraser"></i> Limpiar Formulario
                                </button>
                                <button type="submit"
                                        className="flex-1 py-4 rounded-lg font-bold text-white bg-[#27ae60] hover:bg-[#219653] hover:-translate-y-0.5 hover:shadow-[0_5px_15px_rgba(39,174,96,0.2)] transition-all duration-300 flex items-center justify-center gap-3">
                                    <i className="fas fa-paper-plane"></i> Enviar Reclamo
                                </button>
                            </div>
                        </div>
                    </form>

                    {/* Sidebar */}
                    <aside className="flex flex-col gap-6">

                        {/* Datos empresa */}
                        <div ref={addRef}
                             className="opacity-0 translate-y-5 transition-all duration-500 bg-white p-6 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
                            <h3 className="text-lg font-bold text-[#2c3e50] mb-5 flex items-center gap-3">
                                <i className="fas fa-building"></i> Datos de la Empresa
                            </h3>
                            <ul>
                                {[
                                    ['Razón Social', 'AGLOME PERU E.I.R.L.'],
                                    ['RUC', '20605337792'],
                                    ['Dirección', 'Jr. Libertad Nro.538 - Miramar Alto'],
                                    ['Teléfono', '923-197-032'],
                                    ['Correo', '@AglomePeru'],
                                ].map(([k, v]) => (
                                    <li key={k}
                                        className="py-2 border-b border-gray-100 last:border-none text-[#7f8c8d] text-sm">
                                        <strong className="text-[#2c3e50] inline-block min-w-[110px]">{k}:</strong> {v}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Proceso */}
                        <div ref={addRef}
                             className="opacity-0 translate-y-5 transition-all duration-500 bg-white p-6 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
                            <h3 className="text-lg font-bold text-[#2c3e50] mb-5 flex items-center gap-3">
                                <i className="fas fa-list-ol text-[#3498db]"></i> Proceso del Reclamo
                            </h3>
                            <ol className="pl-5 space-y-3">
                                {[
                                    ['Envío', 'Recibimos tu reclamo'],
                                    ['Evaluación', 'Analizamos tu caso (3-5 días)'],
                                    ['Solución', 'Te contactamos con una propuesta'],
                                    ['Cierre', 'Resolución formal en 15 días hábiles'],
                                ].map(([k, v]) => (
                                    <li key={k} className="text-[#7f8c8d] text-sm leading-relaxed">
                                        <strong className="text-[#2c3e50]">{k}:</strong> {v}
                                    </li>
                                ))}
                            </ol>
                        </div>

                        {/* Ayuda */}
                        <div ref={addRef}
                             className="opacity-0 translate-y-5 transition-all duration-500 bg-white p-6 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
                            <h3 className="text-lg font-bold text-[#2c3e50] mb-5 flex items-center gap-3">
                                <i className="fas fa-headset "></i> ¿Necesitas ayuda?
                            </h3>
                            <div className="flex flex-col gap-3 mb-4">
                                <a href="tel:+51923197032"
                                   className="flex items-center justify-center gap-3 py-3 px-4 rounded-lg font-bold text-white bg-[#3498db] border-2 border-[#3498db] hover:bg-[#2980b9] hover:-translate-y-1 transition-all duration-300 text-sm">
                                    <i className="fas fa-phone-alt"></i> Llamar por Teléfono
                                </a>
                                <a href="mailto:reclamos@aglomeperu.com?subject=Consulta%20sobre%20reclamo%20-%20AGLOME%20PERU"
                                   className="flex items-center justify-center gap-3 py-3 px-4 rounded-lg font-bold text-[#3498db] bg-[#f0f7ff] border-2 border-[#3498db] hover:bg-[#3498db] hover:text-white hover:-translate-y-1 transition-all duration-300 text-sm">
                                    <i className="far fa-envelope"></i> Enviar Correo
                                </a>
                            </div>
                            <div
                                className="bg-[#f8f9fa] px-4 py-3 rounded-lg flex items-center gap-3 text-sm text-[#7f8c8d]">
                                <i className="fas fa-clock text-[#3498db] flex-shrink-0"></i>
                                <span><strong className="text-[#2c3e50]">Horario atención reclamos:</strong> Lunes a Viernes 8:00 AM - 6:00 PM</span>
                            </div>
                        </div>

                    </aside>
                </div>
            </main>
        </>
    )
}