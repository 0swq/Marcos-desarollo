import { useEffect, useRef } from 'react'

const datosRegistrales = [
  { label: 'RUC', icono: 'fa-id-card', valor: '20605337792' },
  { label: 'Razón Social', icono: 'fa-signature', valor: 'AGLOME PERÚ S.R.L.' },
  { label: 'Tipo de Empresa', icono: 'fa-store', valor: 'SOC.COM.RESPONS. LTDA' },
  { label: 'Fecha de Inscripción', icono: 'fa-calendar-check', valor: '02/10/2019' },
  { label: 'Inicio de Actividades', icono: 'fa-play-circle', valor: '02/10/2019' },
  { label: 'Estado', icono: 'fa-check-circle', valor: 'ACTIVO', badge: 'activo' },
  { label: 'Condición', icono: 'fa-certificate', valor: 'HABIDO', badge: 'habido' },
]

const valores = [
  { icono: 'fa-medal', titulo: 'Calidad comprobada', desc: 'Materiales duraderos y confiables para que tu proyecto salga bien desde el inicio.' },
  { icono: 'fa-clock', titulo: 'Cumplimos lo que prometemos', desc: 'Respetamos tiempos de entrega y condiciones acordadas.' },
  { icono: 'fa-user-tie', titulo: 'Asesoría honesta', desc: 'Te orientamos para que compres lo que realmente necesitas.' },
  { icono: 'fa-tags', titulo: 'Precios transparentes', desc: 'Sin costos ocultos. Claridad total en cada compra.' },
]

export default function NosotrosRest() {
  const animablesRef = useRef([])

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0')
          entry.target.classList.remove('opacity-0', 'translate-y-5')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' })

    animablesRef.current.forEach(el => { if (el) observer.observe(el) })
    return () => observer.disconnect()
  }, [])

  const addRef = (el) => {
    if (el && !animablesRef.current.includes(el)) animablesRef.current.push(el)
  }

  return (
    <>
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Texto */}
            <div>
              <h2 className="text-4xl font-bold text-[#2c3e50] mb-6 flex items-center gap-4">
                <i className="fas fa-building "></i>
                Sobre AGLOME PERÚ S.R.L.
              </h2>
              <p className="text-lg leading-relaxed text-[#555] mb-10 pl-4 border-l-4 border-[#3498db]">
                <strong>AGLOME PERÚ S.R.L.</strong> es una empresa peruana con sede en Chimbote, Áncash,
                dedicada a la comercialización de materiales para proyectos y servicios especializados,
                posicionándose como un proveedor relevante en la región.
              </p>

              <div
                ref={addRef}
                className="opacity-0 translate-y-5 transition-all duration-500 flex gap-5 p-6 bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef] rounded-xl border-l-[5px] border-[#e74c3c] mb-10">
                <div className="w-14 h-14 rounded-full bg-[#e74c3c] text-white flex items-center justify-center text-2xl flex-shrink-0">
                  <i className="fas fa-calendar-alt"></i>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#2c3e50] mb-2">Fundación</h3>
                  <p className="text-[#555]"><strong>02 de Octubre del 2019</strong> - Inicio de actividades económicas y comerciales</p>
                  <p className="text-sm text-[#777] italic mt-1">La empresa fue inscrita como SOC.COM.RESPONS. LTDA. el mismo día de su fundación</p>
                </div>
              </div>
            </div>

            <div
              ref={addRef}
              className="opacity-0 translate-y-5 transition-all duration-500 relative rounded-2xl overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.1)]">
              <img
                src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Fábrica de muebles"
                className="w-full h-auto block hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[rgba(44,62,80,0.9)] to-transparent text-white text-center p-8 text-lg font-medium">
                Comprometidos con la calidad desde 2019
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
            <div
              ref={addRef}
              className="opacity-0 translate-y-5 transition-all duration-500 p-6 bg-white rounded-xl shadow-sm border-t-4 border-[#3498db] hover:-translate-y-1">
              <h3 className="text-xl font-bold text-[#2c3e50] mb-4 flex items-center gap-3">
                <i className="fas fa-bullseye text-[#3498db]"></i> Nuestra Misión
              </h3>
              <p className="text-[#555] leading-relaxed">Proveer materiales de calidad y servicios especializados para proyectos de construcción y remodelación, atendiendo las necesidades específicas de nuestros clientes con excelencia.</p>
            </div>
            <div
              ref={addRef}
              className="opacity-0 translate-y-5 transition-all duration-500 p-6 bg-white rounded-xl shadow-sm border-t-4 border-[#27ae60] hover:-translate-y-1">
              <h3 className="text-xl font-bold text-[#2c3e50] mb-4 flex items-center gap-3">
                <i className="fas fa-eye text-[#27ae60]"></i> Nuestra Visión
              </h3>
              <p className="text-[#555] leading-relaxed">Ser la empresa líder en provisión de materiales para proyectos en la región Áncash, reconocida por nuestra calidad, servicio y compromiso con el desarrollo de nuestra comunidad.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#f8f9fa]">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            <div ref={addRef} className="opacity-0 translate-y-5 transition-all duration-500 bg-white p-8 rounded-xl shadow-md">
              <h3 className="text-2xl font-bold text-[#2c3e50] mb-6 pb-4 border-b-2 border-gray-100 flex items-center gap-3">
                <i className="fas fa-file-contract "></i> Datos Generales
              </h3>
              <ul>
                {datosRegistrales.map((d) => (
                  <li key={d.label} className="grid grid-cols-[220px_auto] items-center py-3 border-b border-gray-100 last:border-none">
                    <strong className="flex items-center gap-2 text-[#2c3e50]">
                      <i className={`fas ${d.icono} `}></i> {d.label}:
                    </strong>
                    {d.badge === 'activo' && (
                      <span className="text-[#27ae60] font-bold bg-[#d4edda] px-3 py-1 rounded-full text-sm w-fit">{d.valor}</span>
                    )}
                    {d.badge === 'habido' && (
                      <span className="text-[#3498db] font-bold bg-[#e8f4fc] px-3 py-1 rounded-full text-sm w-fit">{d.valor}</span>
                    )}
                    {!d.badge && <span className="text-[#555]">{d.valor}</span>}
                  </li>
                ))}
              </ul>
            </div>

            <div ref={addRef} className="opacity-0 translate-y-5 transition-all duration-500 bg-white p-8 rounded-xl shadow-md">
              <h3 className="text-2xl font-bold text-[#2c3e50] mb-6 pb-4 border-b-2 border-gray-100 flex items-center gap-3">
                <i className="fas fa-industry"></i> Actividad Económica Principal
              </h3>
              <div className="flex gap-5 mb-8 pb-6 border-b-2 border-gray-100">
                <div className="w-16 h-16 rounded-full bg-[#3498db] text-white flex items-center justify-center text-3xl flex-shrink-0">
                  <i className="fas fa-couch"></i>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-[#2c3e50] mb-2">FABRICACIÓN DE MUEBLES</h4>
                  <p className="text-[#555]">Especialistas en materiales y servicios para proyectos, atendiendo las necesidades de construcción o remodelación.</p>
                </div>
              </div>
              <h4 className="font-bold text-[#2c3e50] mb-3 flex items-center gap-2">
                <i className="fas fa-map-marker-alt "></i> Sector y Localización
              </h4>
              <ul className="space-y-2">
                {[['Sector', 'FABRICACIÓN DE MUEBLES'], ['Localidad', 'CHIMBOTE'], ['Provincia', 'SANTA'], ['Región', 'ANCASH']].map(([k, v]) => (
                  <li key={k} className="text-[#555] py-2 border-b border-gray-100 last:border-none">
                    <strong className="text-[#2c3e50] inline-block min-w-[100px]">{k}:</strong> {v}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-5">
          <h2 className="text-4xl font-bold text-[#2c3e50] text-center mb-3 flex items-center justify-center gap-4">
            <i className="fas fa-map-marked-alt"></i> Nuestras Ubicaciones
          </h2>
          <p className="text-center text-[#666] text-lg mb-12">Encuéntranos en nuestros diferentes establecimientos en Chimbote</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {[
              {
                icono: 'fa-home', titulo: 'Sede Principal',
                dirs: [{ titulo: 'Dirección', texto: 'JR. LIBERTAD NRO. 538\nP.J. MIRAMAR ALTO\n(COSTADO DE CEVICHERIA LOS DELFINES)\nCHIMBOTE, SANTA, ANCASH' }],
                contacto: '923197032'
              },
              {
                icono: 'fa-store', titulo: 'Sucursales',
                dirs: [
                  { titulo: 'Dirección', texto: 'JR. INDEPENDENCIA NRO. 331\nP.J. EL PROGRESO\nANCASH, SANTA, CHIMBOTE' },
                  { titulo: 'Dirección', texto: 'Calle 4 MZ.G LT. 10\nZONA CENTRO SUR BELLAVISTA\nANCASH, SANTA, Nv.CHIMBOTE' },
                ]
              }
            ].map((sede) => (
              <div key={sede.titulo}
                ref={addRef}
                className="opacity-0 translate-y-5 transition-all duration-500 bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 hover:-translate-y-2 hover:shadow-lg">
                <div className="bg-gradient-to-r from-[#2c3e50] to-[#1a252f] text-white px-6 py-6 flex items-center gap-4">
                  <i className={`fas ${sede.icono} text-3xl`}></i>
                  <h3 className="text-2xl font-bold">{sede.titulo}</h3>
                </div>
                <div className="p-5">
                  {sede.dirs.map((d, i) => (
                    <div key={i} className="mb-6 last:mb-0">
                      <h4 className="font-bold text-[#2c3e50] mb-2 flex items-center gap-2">
                        <i className="fas fa-map-pin "></i> {d.titulo}
                      </h4>
                      <p className="text-[#555] leading-relaxed ml-7 whitespace-pre-line">{d.texto}</p>
                    </div>
                  ))}
                  {sede.contacto && (
                    <div>
                      <h4 className="font-bold text-[#2c3e50] mb-2 flex items-center gap-2">
                        <i className="fas fa-phone "></i> Contacto
                      </h4>
                      <p className="text-[#555] ml-7"><strong>Teléfono:</strong> {sede.contacto}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div
            ref={addRef}
            className="opacity-0 translate-y-5 transition-all duration-500 bg-white rounded-xl overflow-hidden shadow-md border border-gray-100">
            <div className="bg-gradient-to-r from-[#3498db] to-[#2980b9] text-white px-6 py-6 flex items-center gap-4">
              <i className="fas fa-chart-line text-3xl"></i>
              <h3 className="text-2xl font-bold">Presencia Empresarial</h3>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                {[
                  { icono: 'fa-users', titulo: '40+ Visitas', desc: 'Nuestra información ha sido consultada' },
                  { icono: 'fa-thumbs-up', titulo: 'Empresa Habilitada', desc: 'Estado ACTIVO y HABIDO' },
                ].map((s) => (
                  <div key={s.titulo} className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#f0f7ff] text-[#3498db] flex items-center justify-center text-2xl flex-shrink-0">
                      <i className={`fas ${s.icono}`}></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-[#2c3e50]">{s.titulo}</h4>
                      <p className="text-[#666] text-sm">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <h4 className="font-bold text-[#2c3e50] mb-2 flex items-center gap-2">
                <i className="fas fa-globe text-[#3498db]"></i> Nuestra Presencia Online
              </h4>
              <p className="text-[#555] mb-4">La página de Facebook de la empresa funciona como nuestro principal canal de comunicación y exhibición de productos.</p>
              <div className="flex justify-center">
                <a href="https://www.facebook.com/AglomePeru/?locale=es_LA"
                  target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-3 bg-[#1877f2] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#0d65d9] hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                  <i className="fab fa-facebook-f"></i> Visitar Facebook
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#f8f9fa]">
        <div className="max-w-6xl mx-auto px-5">
          <h2 className="text-4xl font-bold text-[#2c3e50] text-center mb-12 flex items-center justify-center gap-4">
            <i className="fas fa-handshake text-[#3498db]"></i> Nuestros Valores
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {valores.map((v) => (
              <div
                key={v.titulo}
                ref={addRef}
                className="opacity-0 translate-y-5 transition-all duration-500 bg-white px-6 py-10 rounded-xl text-center shadow-md border-t-4 border-transparent hover:-translate-y-2 hover:shadow-lg hover:border-[#3498db]">
                <div className="text-4xl text-[#3498db] mb-5">
                  <i className={`fas ${v.icono}`}></i>
                </div>
                <h3 className="text-xl font-bold text-[#2c3e50] mb-3">{v.titulo}</h3>
                <p className="text-[#666] leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}