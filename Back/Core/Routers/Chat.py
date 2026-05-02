from fastapi import APIRouter
from fastapi.params import Depends
from groq import Groq
from starlette.responses import StreamingResponse
from pydantic import BaseModel
from Back.Core.Connection.Postgre import db
from Back.Infra.Utils.TOKEN import es_admin

client = Groq(api_key="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")
router = APIRouter(prefix="/chat", tags=["chat"])

PROMPT_SQL = """
Conviertes texto a SQL. Solo generas SELECT válidos para PostgreSQL.
Responde ÚNICAMENTE con el SQL, sin explicaciones, sin markdown, sin ```.
Si la pregunta no requiere datos de BD, responde: NO_SQL
Si requiere INSERT/UPDATE/DELETE/DROP, responde: PROHIBIDO

TABLAS Y COLUMNAS:

- usuario: id (varchar(128) pk), rol ('admin'|'cliente'), tipo_usuario ('minorista'|'mayorista'), creado_en, nivel ('bronce'|'plata'|'oro'|'platino'), nivel_valido_hasta

- categoria: id (uuid), nombre, padre_id (uuid, self-ref), activa (bool)

- proveedor: id (uuid), ruc (varchar 11), telefono

- producto_base: id (uuid), nombre, descripcion, marca, unidades, categoria_id, proveedor_id, publicado (bool)

- tipo_atributo: id (uuid), nombre

- variante: id (uuid), producto_base_id, sku, precio_venta, precio_mayorista, precio_minimo, stock, activa (bool)

- variante_atributo: variante_id, tipo_atributo_id, valor
  [PK compuesta: (variante_id, tipo_atributo_id)]

- direccion: id (uuid), usuario_id, alias, calle, ciudad, referencia, es_principal (bool)

- cupon: id (uuid), codigo, descripcion, tipo_descuento ('porcentaje'|'monto_fijo'), valor, aplica_a ('carrito'|'categoria'|'producto_base'|'variante'), categoria_id, producto_base_id, variante_id, minimo_compra, un_solo_uso (bool), usos_maximos, usos_actuales, combinable_con_promocion (bool), activo (bool), valido_desde, valido_hasta, creado_en

- cupon_usuario: id (uuid), cupon_id, usuario_id, pedido_id, usado_en
  [UNIQUE: (cupon_id, usuario_id)]

- carrito: id (uuid), usuario_id, cupon_id, descuento_total, estado ('activo'|'convertido'|'abandonado'), creado_en

- carrito_item: id (uuid), carrito_id, variante_id, cantidad, precio_unitario, descuento_unitario
  [UNIQUE: (carrito_id, variante_id)]

- promocion: id (uuid), nombre, tipo_descuento ('porcentaje'|'monto_fijo'), valor, aplica_a ('variante'|'producto_base'|'categoria'), categoria_id, producto_base_id, variante_id, activa (bool), valido_desde, valido_hasta

- pedido: id (uuid), usuario_id, carrito_id, cupon_id, descuento_aplicado, subtotal, costo_envio, total, tipo_entrega ('DELIVERY'|'RECOJO'), direccion_id

- detalle_pedido: id (uuid), pedido_id, variante_id, sku_ref, nombre_ref, cantidad, precio_unitario, descuento_unitario

- pago: id (uuid), pedido_id, external_id, metodo ('VISA'|'MASTERCARD'|'YAPE'), estado ('aprobado'|'rechazado'), monto, respuesta_pasarela, fecha

- venta: id (uuid), pedido_id (unique), pago_id (unique), fecha_venta, total, nota

RELACIONES CLAVE:
- producto_base -> categoria (categoria_id)
- producto_base -> proveedor (proveedor_id)
- variante -> producto_base (producto_base_id)
- variante_atributo -> variante, tipo_atributo
- carrito -> usuario, cupon
- carrito_item -> carrito, variante
- pedido -> usuario, carrito, cupon, direccion
- detalle_pedido -> pedido, variante
- pago -> pedido
- venta -> pedido, pago
- cupon_usuario -> cupon, usuario, pedido
- cupon -> categoria, producto_base, variante (según aplica_a)
- promocion -> categoria, producto_base, variante (según aplica_a)
"""

PROMPT_RESPUESTA = """
Eres el asistente interno de Aglome Perú y tu función es ayudar exclusivamente al administrador del negocio.

OBJETIVO PRINCIPAL:
- Brindar información, orientación y respuestas relacionadas con Aglome Perú.
- Solo informas, analizas y explicas.
- No realizas cambios, modificaciones ni acciones en sistemas.

IDIOMA Y ESTILO:
- Responde siempre en español, sin importar el idioma en que te escriban.
- Usa un tono super sarcástico, burlón y con humor super, ultra grosero y molesto.
- Proyecta actitud de fastidio constante, como si todo te diera cólera.
- Sé filoso e irónico, pero sin perder claridad en la respuesta.


LÍMITES TEMÁTICOS:
- Solo hablas de temas relacionados con Aglome Perú, su negocio, ventas, productos, clientes, pedidos, operaciones o gestión.
- Si preguntan algo ajeno al negocio, redirige la conversación hacia Aglome Perú usando humor y sarcasmo.

FORMA DE EXPLICAR:
- El usuario no sabe de programación ni temas técnicos.
- Nunca uses términos técnicos complicados.
- No menciones palabras como: CSS, HTML, frontend, backend, base de datos, SQL, Python, Java o similares.
- Explica todo de forma simple, directa y entendible, como si se lo explicaras a alguien que recién aterriza.

PERSONALIDAD:
- Te comportas como un asistente eficiente pero con paciencia cero.
- Siempre parece que estás renegando, pero igual ayudas.
- Si algo es obvio, lo remarcas con ironía.

REGLA FINAL:
- Si una respuesta puede darse de forma simple o complicada, eliges la simple, pe causa.
"""

class ChatRequest(BaseModel):
    prompt: str
    historial: list = []


@router.post("/stream")
def chat_stream(req: ChatRequest, usuario: dict = Depends(es_admin)):
    sql_response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": PROMPT_SQL},
            {"role": "user", "content": req.prompt},
        ],
        max_tokens=500,
    )
    sql = sql_response.choices[0].message.content.strip()

    datos = ""
    if sql == "PROHIBIDO":
        datos = "El usuario solicitó una operación prohibida (INSERT/UPDATE/DELETE/DROP). Explicar que eres un asistente de soporte para soporte simplificado de obtención de datos no modificacion"
    elif sql == "NO_SQL":
        datos = ""
    elif sql.upper().startswith("SELECT"):
        try:
            cursor = db.execute_sql(sql)
            cols = [desc[0] for desc in cursor.description]
            rows = cursor.fetchall()
            if not rows:
                datos = "La consulta se ejecutó correctamente pero no devolvió resultados."
            else:
                datos = f"Columnas: {cols}\nDatos: {rows}"
        except Exception as e:
            datos = f"La consulta falló y no se obtuvieron datos. Error técnico: {e}"
    else:
        datos = "El modelo generó una respuesta inesperada, no se ejecutó ninguna consulta."

    contexto = f"\n\nDatos obtenidos de la base de datos:\n{datos}" if datos else ""

    historial =  (req.historial[-20] if len(req.historial)>20 else req.historial)
    messages = [
        {"role": "system", "content": PROMPT_RESPUESTA + contexto},
        *historial,
        {"role": "user", "content": req.prompt},
    ]

    def generate():
        stream = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            stream=True,
        )
        for chunk in stream:
            content = chunk.choices[0].delta.content or ""
            yield content

    return StreamingResponse(generate(), media_type="text/plain")