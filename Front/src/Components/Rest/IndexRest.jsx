import {useEffect, useRef} from "react";

const categorias = [
  { img: 'https://arcosac.com/wp-content/uploads/2023/07/NMELTHS001053-HISPANOS-18MM-HABANA-2.14X2.44-1.jpg', titulo: 'MELAMINA HISPANO' },
  { img: 'https://arcosac.com/wp-content/uploads/2022/10/MELVES001056-VESTO-18MM-NOUGAT-SYNCRO-1.83X2.50-1.jpg', titulo: 'MELAMINA VESTO' },
  { img: 'https://arcosac.com/wp-content/uploads/2023/09/TABMDF003046-HDF-SAPELLI-2.80MM-1.85X2.44-DUROLAC-scaled.jpg', titulo: 'DUROLAC' },
  { img: 'https://oechsle.vteximg.com.br/arquivos/ids/21110039-1000-1000/imageUrl_1.jpg?v=638823912203600000', titulo: 'WALL PANEL' },
]

const productosDestacados = [
  { img: 'https://ducasseindustrial.com/pe/wp-content/uploads/sites/18/2020/09/PE_10100710350_IMG_APLI2.jpg', titulo: 'CORREDERAS TELESCÓPICAS', desc: 'Sistema de correderas de alta calidad para todo tipo de muebles' },
  { img: 'https://reyma-mobiliario.com/wp-content/uploads/2021/01/gama-tableros-melamina-reyma-para-hosteleria.jpg', titulo: 'TABLEROS DE MELAMINA', desc: 'Amplia variedad de colores y texturas para tus proyectos' },
  { img: 'https://carpintec.com.pe/cdn/shop/collections/Piston_1_1191x1191.jpg?v=1746656777', titulo: 'ACCESORIOS', desc: 'Todo lo que necesitas para completar tus muebles' },
]

const populares = [
  { img: 'https://cdn.sanity.io/images/599r6htc/regionalized/4e0c7540e060e9a68d0361cd96f888e962046fdf-720x405.png', alt: 'Melamina Blanco' },
  { img: 'https://cdn.sanity.io/images/599r6htc/regionalized/a3f048881f7e417a0fe45c0af7a29ba757403401-720x405.png', alt: 'Melamina Cerezo' },
  { img: 'https://cdn.sanity.io/images/599r6htc/regionalized/cf265aab0d1948f556031a4f4e21aec197911240-720x405.png', alt: 'Melamina Verde Jade' },
  { img: 'https://cdn.sanity.io/images/599r6htc/regionalized/767fedec4c08559e3eea96efb56df056a9ada2f2-720x405.png', alt: 'Melamina Azul Marino' },
]

const porQueElegirnos = [
  { icono: 'fa-warehouse', titulo: 'Stock Permanente', desc: 'Disponibilidad inmediata en melaminas y ferretería.' },
  { icono: 'fa-user-tie', titulo: 'Asesoría Especializada', desc: 'Te ayudamos a elegir el material correcto.' },
  { icono: 'fa-truck', titulo: 'Entrega Rápida', desc: 'Atendemos proyectos y pedidos urgentes.' },
  { icono: 'fa-industry', titulo: 'Atención a Empresas', desc: 'Soluciones para carpinteros y mueblerías.' },
]

const marcas = [
  { img: 'https://media.falabella.com/sodimacPE/4170237_28/w=800,h=800,fit=pad', alt: 'Logo VESTO' },
  { img: 'https://tableroshispanos.es/wp-content/uploads/2023/08/Logo-Tableros-Hispanos.1x1.png', alt: 'Logo HISPANOS' },
  { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmz9a-UCuEpXn-f1SF1-S59im9ZVpz6TJuhA&s', alt: 'Logo DOCATTI' },
]

export default function IndexRest() {
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
      <section className="py-10 text-center">
        <div className="w-[90%] max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-[#2c3e50] mb-16">Categorías Destacadas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {categorias.map((cat) => (
              <div key={cat.titulo}
                ref={addRef}
                className="opacity-0 translate-y-5 transition-all duration-500 bg-white rounded-xl shadow-md overflow-hidden hover:-translate-y-2 hover:shadow-[0_15px_35px_rgba(52,152,219,0.2)]">
                <div className="h-[200px]">
                  <img src={cat.img} alt={cat.titulo} className="w-full h-full object-cover" />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-[#2c3e50]">{cat.titulo}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f8f9fa] py-12 text-center">
        <div className="w-[90%] max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-[#2c3e50] mb-16">Productos Destacados</h2>
          <div className="flex flex-col gap-5 max-w-3xl mx-auto">
            {productosDestacados.map((p) => (
              <div key={p.titulo}
                ref={addRef}
                className="opacity-0 translate-y-5 transition-all duration-500 flex bg-white rounded-xl overflow-hidden shadow-md hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(52,152,219,0.2)]">
                <div className="w-[200px] h-[150px] flex-shrink-0">
                  <img src={p.img} alt={p.titulo} className="w-full h-full object-cover" />
                </div>
                <div className="p-6 text-left">
                  <h3 className="text-[#2c3e50] font-bold mb-2">{p.titulo}</h3>
                  <p className="text-[#7f8c8d]">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Productos_base Populares */}
      <section className="py-10 text-center bg-gradient-to-br from-[#f8f9fa] to-[#ecf0f1]">
        <div className="w-[90%] max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-[#2c3e50] mb-16">Productos más Buscados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {populares.map((p) => (
              <div key={p.alt}
                ref={addRef}
                className="opacity-0 translate-y-5 transition-all duration-500 bg-white p-5 rounded-xl shadow-md hover:-translate-y-1">
                <div className="h-[150px]">
                  <img src={p.img} alt={p.alt} className="w-full h-full object-cover" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#f8f9fa] text-center">
        <div className="w-[90%] max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-[#2c3e50] mb-4">¿Por qué elegir AGLOME?</h2>
          <p className="text-lg text-[#7f8c8d] max-w-xl mx-auto mb-16 leading-relaxed">
            Somos tu aliado en materiales para carpintería
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {porQueElegirnos.map((c) => (
              <div key={c.titulo}
                ref={addRef}
                className="opacity-0 translate-y-5 transition-all duration-500 bg-white px-6 py-9 rounded-2xl text-center shadow-[0_10px_30px_rgba(0,0,0,0.08)] hover:-translate-y-2">
                <i className={`fas ${c.icono} text-4xl text-[#3498db] mb-5 block`}></i>
                <h3 className="text-[#2c3e50] font-bold mb-2">{c.titulo}</h3>
                <p className="text-[#7f8c8d] text-sm">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-5 bg-white flex justify-center items-center">
        <div className="flex justify-center items-center gap-20 flex-wrap">
          {marcas.map((m) => (
            <div key={m.alt}
              ref={addRef}
              className="opacity-0 translate-y-5 transition-all duration-500 flex items-center justify-center h-[70px] translate-y-11">
              <img
                src={m.img}
                alt={m.alt}
                className="max-h-[180px] w-auto grayscale opacity-60 hover:grayscale-0 hover:opacity-100 hover:scale-105 transition-all duration-300"
              />
            </div>
          ))}
        </div>
      </section>
    </>
  )
}