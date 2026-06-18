import { useRef, useEffect, useState } from 'react'
import MiramarAlto from '../../assets/MiramarAlto.png'
import ElProgreso from '../../assets/ELProgreso.png'
import NvChimbote from '../../assets/Nv.Chimbote.jpeg'

const correos = [
  { icono: 'fa-envelope', titulo: 'Hotmail', valor: 'Aglome.peru@hotmail.com' },
  { icono: 'fa-building', titulo: 'Correo Empresarial', valor: '@AglomePeru' },
]

const sucursales = [
  {
    nombre: 'Miramar Alto',
    direccion: 'Jr. Libertad Nro. 538 - Miramar Alto',
    horarios: [
      { dia: 'Lunes a Viernes', hora: '8:00 a.m. – 1:00 p.m. / 2:30 p.m. – 7:00 p.m.' },
      { dia: 'Sábado', hora: '9:00 a.m. – 1:00 p.m.' },
    ],
    img: MiramarAlto,
    alt: 'Sucursal Miramar Alto',
  },
  {
    nombre: 'El Progreso',
    direccion: 'Jr. Independencia Nro. 331 - El Progreso',
    horarios: [
      { dia: 'Lunes a Viernes', hora: '8:00 a.m. – 1:00 p.m. / 2:30 p.m. – 6:30 p.m.' },
      { dia: 'Sábado', hora: '9:00 a.m. – 1:00 p.m.' },
    ],
    img: ElProgreso,
    alt: 'Sucursal El Progreso',
  },
  {
    nombre: 'Nuevo Chimbote',
    direccion: 'Calle 4 MZ.G LT. 10 - Zona Centro Sur Bellavista',
    horarios: [
      { dia: 'Lunes a Sábado', hora: '8:00 a.m. – 1:00 p.m. / 3:00 p.m. – 6:00 p.m.' },
    ],
    img: NvChimbote,
    alt: 'Sucursal Nuevo Chimbote',
  },
]

export default function ContactanosRest() {
  const animablesRef = useRef([])
  const [modalImg, setModalImg] = useState(null)

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
      <main className="max-w-6xl mx-auto px-5 py-10 pb-20">

        {/* Correos */}
        <h2 className="text-2xl font-bold text-[#2c3e50] mt-10 mb-6 pb-3 border-b-[3px] border-[#3498db]">
          CORREOS:
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-5">
          {correos.map((c) => (
            <div
              key={c.titulo}
              ref={addRef}
              className="opacity-0 translate-y-5 transition-all duration-500 bg-[#f8f9fa] p-6 rounded-xl border-l-4 border-[#3498db] hover:-translate-y-1 hover:shadow-[0_5px_15px_rgba(52,152,219,0.1)]">
              <div className="flex items-center gap-3 font-semibold text-[#2c3e50] text-lg mb-3">
                <i className={`fas ${c.icono} text-[#3498db] w-6`}></i>
                {c.titulo}:
              </div>
              <div className="text-[#3498db] font-semibold pl-9 text-lg">{c.valor}</div>
            </div>
          ))}
        </div>

        {/* Ubicaciones y Horarios */}
        <h2 className="text-2xl font-bold text-[#2c3e50] mt-10 mb-6 pb-3 border-b-[3px] border-[#3498db]">
          UBICACIONES Y HORARIOS
        </h2>
        <div className="flex flex-col gap-6">
          {sucursales.map((s) => (
            <div
              key={s.nombre}
              ref={addRef}
              className="opacity-0 translate-y-5 transition-all duration-500 grid grid-cols-[2fr_1fr] gap-8 bg-[#f8f9fa] p-8 rounded-2xl border-l-4 border-[#3498db] shadow-[0_6px_20px_rgba(0,0,0,0.08)] items-center hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(0,0,0,0.12)]">
              <div>
                <h3 className="text-2xl font-bold text-[#2c3e50] mb-2">{s.nombre}</h3>
                <p className="text-[#555] mb-5">{s.direccion}</p>
                <div className="space-y-3">
                  {s.horarios.map((h) => (
                    <p key={h.dia} className="text-[#444] text-sm leading-relaxed">
                      <strong className="text-[#2c3e50] block mb-1">{h.dia}:</strong>
                      {h.hora}
                    </p>
                  ))}
                </div>
              </div>
              <div>
                <img
                  src={s.img}
                  alt={s.alt}
                  onClick={() => setModalImg(s.img)}
                  className="w-full h-[160px] rounded-xl object-cover shadow-md cursor-pointer hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          ))}
        </div>
        <h2 className="text-2xl font-bold text-[#2c3e50] mt-10 mb-6 pb-3 border-b-[3px] border-[#3498db]">
          CONTACTO DIRECTO:
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          <div
            ref={addRef}
            className="opacity-0 translate-y-5 transition-all duration-500 bg-[#f8f9fa] p-6 rounded-xl border-l-4 border-[#3498db]">
            <div className="flex items-center gap-3 font-semibold text-[#2c3e50] text-lg mb-4">
              <i className="fas fa-phone text-[#3498db] w-6"></i> Teléfono
            </div>
            <a href="tel:+51923197032"
              className="flex items-center justify-center gap-3 w-full py-3 px-5 rounded-lg font-semibold text-[#3498db] bg-[#f0f7ff] border border-[#d1ecff] hover:bg-[#3498db] hover:text-white transition-all duration-300">
              <i className="fas fa-phone-alt"></i> +51 923 197 032
            </a>
          </div>

          <div
            ref={addRef}
            className="opacity-0 translate-y-5 transition-all duration-500 bg-[#f8f9fa] p-6 rounded-xl border-l-4 border-[#3498db]">
            <div className="flex items-center gap-3 font-semibold text-[#2c3e50] text-lg mb-4">
              <i className="fab fa-whatsapp text-[#3498db] w-6"></i> WhatsApp
            </div>
            <a href="https://wa.me/51923197032?text=Hola%20AGLOME%20PERU"
              target="_blank" rel="noreferrer"
              className="flex items-center justify-center gap-3 w-full py-3 px-5 rounded-lg font-semibold text-[#25D366] bg-[#f0fff4] border border-[#d4f8d4] hover:bg-[#25D366] hover:text-white transition-all duration-300">
              <i className="fab fa-whatsapp"></i> Escribir por WhatsApp
            </a>
          </div>
        </div>

      </main>

      {modalImg && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999] animate-fadeIn"
          onClick={() => setModalImg(null)}>
          <span
            className="absolute top-8 right-10 text-5xl text-white cursor-pointer"
            onClick={() => setModalImg(null)}>
            &times;
          </span>
          <img
            src={modalImg}
            alt="Vista ampliada"
            className="max-w-[90%] max-h-[90%] rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}