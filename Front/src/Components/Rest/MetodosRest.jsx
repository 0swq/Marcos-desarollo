import { useRef, useEffect, useState } from 'react'

const tarjetasCredito = [
  { img: 'https://1000marcas.net/wp-content/uploads/2019/12/VISA-Logo.jpg', nombre: 'VISA' },
  { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfXGWP1Yl3UbHpGI4d7Rx_2Sg08Vm5mRIqbQ&s', nombre: 'American Express' },
  { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9sjRswrzitSNR2m7lgjeU0cPgq_dWMVV6ww&s', nombre: 'Diners Club' },
  { img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/2560px-Mastercard-logo.svg.png', nombre: 'Mastercard' },
]
const billeterasMoviles = [
  { img: 'https://www.bbva.pe/content/dam/public-web/peru/images/promo-sliders/promo-plin.png', nombre: 'Plin' },
  { img: 'https://startupeable.com/directorio/wp-content/uploads/2021/03/yape.png', nombre: 'Yape' },
  { img: 'https://i.pinimg.com/474x/ba/08/4a/ba084a5473fc679885a5ab2958baba0a.jpg', nombre: 'Tunki' },
]
const opcionesBancarias = [
  { img: 'https://yt3.googleusercontent.com/v-PEEMoBel089hJXySyR7rJjOwzmWEAzgquul5X4YjWe9Br8Tn7j9N8jNQkOCBtyZ20orEgX590=s900-c-k-c0x00ffffff-no-rj', nombre: 'Scotiabank' },
  { img: 'https://play-lh.googleusercontent.com/gBpVaCpZsbBrLufT06aRpuLQvsUq1KAZUCEof_ps76mtB8_llJg3xv24mey8I0m3dUE', nombre: 'Banco BCP' },
  { img: 'https://www.bbva.com/wp-content/uploads/2019/11/transferencias2.jpg', nombre: 'Transferencia' },
  { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAJkSeKuRiS16GABxAZkGJhx3_7UIrav5Q-Q&s', nombre: 'Interbank' },
]
function MetodoItem({ img, nombre }) {
  return (
    <div className="bg-[#f8f9fa] px-4 py-6 rounded-xl text-center transition-all duration-300 border-2 border-transparent hover:-translate-y-1 hover:shadow-lg hover:border-[#3498db] flex flex-col items-center justify-between min-h-[150px]">
      <div className="h-[70px] flex items-center justify-center w-full overflow-hidden mb-3">
        <img src={img} alt={nombre} className="max-w-[120px] max-h-[50px] w-auto h-auto object-contain hover:scale-105 transition-transform duration-300" />
      </div>
      <h4 className="text-[#2c3e50] text-base font-bold uppercase tracking-wide">{nombre}</h4>
    </div>
  )
}

export default function MetodoPagoRest() {
  const animablesRef = useRef([])
  const [copiado, setCopiado] = useState(false)

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

  const copiarCCI = () => {
    navigator.clipboard.writeText('00231000111063605718').then(() => {
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    })
  }

  return (
    <>
      <section className="py-10 bg-[#f8f9fa]">
        <div className="max-w-6xl mx-auto px-5">
          <div
            ref={addRef}
            className="opacity-0 translate-y-5 transition-all duration-500 bg-white p-8 rounded-xl shadow-md border-l-[5px] border-[#3498db]">
            <h2 className="text-2xl font-bold text-[#2c3e50] mb-5 flex items-center gap-3">
              <i className="fas fa-balance-scale text-[#3498db]"></i> Comunicado Legal
            </h2>
            <p className="text-[#7f8c8d] leading-relaxed text-sm">
              <strong className="text-[#2c3e50]">DE CONFORMIDAD CON EL ARTÍCULO 7° DEL CÓDIGO DE PROTECCIÓN Y DEFENSA DEL CONSUMIDOR, LEY Nº 29571,</strong>{' '}
              CUMPLIMOS CON INFORMAR QUE LOS PAGOS QUE SE REALICEN CON TARJETA DE CRÉDITO Y/O DÉBITO TENDRÁN UN RECARGO APLICADO,
              DE ACUERDO CON LO ESTABLECIDO EN LA LEY.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-10 items-start">

            <div
              ref={addRef}
              className="opacity-0 translate-y-5 transition-all duration-500 bg-white p-10 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
              <h2 className="text-3xl font-bold text-[#2c3e50] mb-8 pb-4 border-b-4 border-[#3498db] flex items-center gap-3">
                <i className="fas fa-money-check-alt text-[#3498db]"></i> Formas de Pago Aceptadas
              </h2>

              <div className="mb-10">
                <h3 className="text-xl font-bold text-[#2c3e50] mb-5 flex items-center gap-3">
                  <i className="fas fa-credit-card text-[#3498db]"></i> Tarjetas de Crédito
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                  {tarjetasCredito.map(m => <MetodoItem key={m.nombre} {...m} />)}
                </div>
              </div>

              <div className="mb-10">
                <h3 className="text-xl font-bold text-[#2c3e50] mb-5 flex items-center gap-3">
                  <i className="fas fa-mobile-alt text-[#3498db]"></i> Billeteras Móviles
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                  {billeterasMoviles.map(m => <MetodoItem key={m.nombre} {...m} />)}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-[#2c3e50] mb-5 flex items-center gap-3">
                  <i className="fas fa-university text-[#3498db]"></i> Opciones Bancarias
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                  {opcionesBancarias.map(m => <MetodoItem key={m.nombre} {...m} />)}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-8">
              <div
                ref={addRef}
                className="opacity-0 translate-y-5 transition-all duration-500 bg-white p-8 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
                <h3 className="text-xl font-bold text-[#2c3e50] mb-5 flex items-center gap-3">
                  <i className="fas fa-info-circle text-[#3498db]"></i> Datos para Transferencia
                </h3>
                <ul className="mb-6">
                  {[
                    ['Banco', 'BCP'],
                    ['Tipo de Cuenta', 'Cuenta Corriente'],
                    ['Número de Cuenta', '310-1110636-0-57'],
                    ['CCI', '00231000111063605718'],
                    ['Nombre', 'AGLOME PERÚ'],
                  ].map(([k, v]) => (
                    <li key={k} className="py-2 border-b border-gray-100 last:border-none text-[#7f8c8d] text-sm">
                      <strong className="text-[#2c3e50] inline-block min-w-[140px]">{k}:</strong> {v}
                    </li>
                  ))}
                </ul>

                {/* Copiar CCI */}
                <div className="bg-[#e8f4fc] p-5 rounded-lg mb-5">
                  <div className="flex justify-between items-center gap-4 mb-2">
                    <span className="text-[#2c3e50] text-sm">
                      CCI: <strong className="text-[#3498db]">00231000111063605718</strong>
                    </span>
                    <button
                      onClick={copiarCCI}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 whitespace-nowrap
                        ${copiado ? 'bg-[#27ae60]' : 'bg-[#2c3e50] hover:bg-[#3498db]'}`}>
                      <i className={`${copiado ? 'fas fa-check' : 'far fa-copy'}`}></i>
                      {copiado ? 'Copiado' : 'Copiar'}
                    </button>
                  </div>
                  {copiado && (
                    <p className="text-[#27ae60] text-xs text-center">¡Código copiado al portapapeles!</p>
                  )}
                </div>

                {/* Importante */}
                <div className="bg-[#fff8e1] p-4 rounded-lg border-l-4 border-[#f39c12]">
                  <h4 className="font-bold text-[#2c3e50] mb-2 flex items-center gap-2">
                    <i className="fas fa-exclamation-triangle text-[#f39c12]"></i> Importante
                  </h4>
                  <p className="text-[#7f8c8d] text-sm leading-relaxed">
                    Los pagos con tarjeta de crédito/débito tienen un recargo del 5% según Ley Nº 29571. Transferencias y billeteras móviles no tienen recargo adicional.
                  </p>
                </div>
              </div>

              {/* ¿Necesitas ayuda? */}
              <div
                ref={addRef}
                className="opacity-0 translate-y-5 transition-all duration-500 bg-white p-8 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
                <h3 className="text-xl font-bold text-[#2c3e50] mb-5 flex items-center gap-3">
                  <i className="fas fa-headset text-[#3498db]"></i> ¿Necesitas ayuda?
                </h3>
                <div className="flex flex-col gap-3 mb-4">
                  <a href="https://wa.me/51923197032?text=Hola%20AGLOME%20PERU,%20tengo%20una%20consulta%20sobre%20métodos%20de%20pago"
                    target="_blank" rel="noreferrer"
                    className="flex items-center justify-center gap-3 py-3 px-5 rounded-lg font-bold text-white bg-[#25D366] border-2 border-[#25D366] hover:bg-[#128C7E] hover:border-[#128C7E] hover:-translate-y-1 transition-all duration-300">
                    <i className="fab fa-whatsapp"></i> WhatsApp
                  </a>
                  <a href="tel:+51923197032"
                    className="flex items-center justify-center gap-3 py-3 px-5 rounded-lg font-bold text-white bg-[#3498db] border-2 border-[#3498db] hover:bg-[#2980b9] hover:-translate-y-1 transition-all duration-300">
                    <i className="fas fa-phone-alt"></i> Llamar por Teléfono
                  </a>
                  <a href="mailto:Aglome.peru@hotmail.com?subject=Consulta%20sobre%20pagos%20-%20AGLOME%20PERU"
                    className="flex items-center justify-center gap-3 py-3 px-5 rounded-lg font-bold text-[#3498db] bg-[#f0f7ff] border-2 border-[#3498db] hover:bg-[#3498db] hover:text-white hover:-translate-y-1 transition-all duration-300">
                    <i className="far fa-envelope"></i> Enviar Correo
                  </a>
                </div>
                <div className="bg-[#f8f9fa] px-4 py-3 rounded-lg flex items-center gap-3 text-sm text-[#7f8c8d]">
                  <i className="fas fa-clock text-[#3498db]"></i>
                  <span><strong className="text-[#2c3e50]">Horario de atención:</strong> Lunes a Viernes 8:00 AM - 6:00 PM</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  )
}