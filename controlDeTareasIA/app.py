import os
from flask_sqlalchemy import SQLAlchemy
from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, Tarea, User
from datetime import datetime
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_google_genai import ChatGoogleGenerativeAI

# Configuración inicial
app = Flask(__name__)
CORS(app)

# Conexión a tu base de datos PostgreSQL (misma usada por Spring Boot)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get("DATABASE_URL") or \
    "postgresql+psycopg2://postgres:nieves@localhost:5432/controlTareas_db"
db.init_app(app)

# Inicializar LLM
llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash",
    temperature=0.7,
    google_api_key="AIzaSyDUgVmBEG942y2MfTIYaPPwnLHx8THStM0"
)

# Prompt especializado
prompt_template = """
Actúa como un asistente virtual con sólida experiencia en gestión de proyectos, capaz de analizar descripciones generales e identificar los pasos necesarios para convertirlas en tareas ejecutables.

A partir de la siguiente descripción, genera únicamente una lista clara, ordenada y accionable de tareas necesarias para desarrollar el proyecto.

Cada tarea debe estar redactada en una sola línea, utilizando un lenguaje directo, profesional y enfocado en la acción.

No incluyas explicaciones adicionales, introducciones ni conclusiones.

Al final de cada tarea, agrega un guion seguido exactamente del título del prompt original que el usuario proporcione (es decir, la descripción inicial del proyecto).

Ejemplo de formato deseado:
1. Crear esquema inicial del sistema - [Título del prompt]

Aquí está la descripción del proyecto:


DESCRIPCIÓN:
{descripcion}

LISTA DE SUBTAREAS:
"""

prompt = ChatPromptTemplate.from_template(prompt_template)
chain = prompt | llm | StrOutputParser()

# Prompt para detectar tareas duplicadas o similares
prompt_duplicadas_template = """
Actúa como un asistente experto en productividad.

Analiza la siguiente lista de tareas y encuentra aquellas que son duplicadas o muy similares. 
Para cada grupo de tareas similares, sugiere si deberían combinarse o eliminarse y justifica brevemente.

Devuelve el resultado como una lista en formato JSON así:

[
  {{
    "tareas_similares": ["Tarea A", "Tarea B"],
    "sugerencia": "Combinar ambas como '...'"
  }},
  ...
]

Si no hay tareas similares, responde con una lista vacía: []
TAREAS:
{tareas}
"""

prompt_duplicadas = ChatPromptTemplate.from_template(prompt_duplicadas_template)
chain_duplicadas = prompt_duplicadas | llm | StrOutputParser()


@app.route('/generar', methods=['POST'])
def generar_subtareas():
    data = request.get_json()
    descripcion = data.get('descripcion', '')
    if not descripcion:
        return jsonify({"error": "Falta la descripción"}), 400

    resultado = chain.invoke({"descripcion": descripcion})
    # Convertimos el resultado a lista si es una cadena con guiones o números
    tareas = [line.strip("- ").strip() for line in resultado.strip().split("\n") if line.strip()]
    return jsonify({"tareas": tareas})


@app.route('/guardar', methods=['POST'])
def guardar_subtareas():
    data = request.get_json()
    email = data.get('email')
    tareas = data.get('tareas', [])

    if not email or not tareas:
        return jsonify({"error": "Faltan datos"}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    try:
        for t in tareas:
            nueva = Tarea(
                tarea=t,
                estado='pendiente',
                fechacreacion=datetime.utcnow(),
                usuario_id=user.id
            )
            db.session.add(nueva)
        db.session.commit()
        return jsonify({"mensaje": "tareas guardadas"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    
@app.route('/detectar-duplicadas', methods=['POST'])
def detectar_duplicadas():
    data = request.get_json()
    tareas = data.get('tareas', [])

    if not tareas or not isinstance(tareas, list):
        return jsonify({"error": "Lista de tareas vacía o inválida"}), 400

    # Convertimos la lista a un string enumerado para mejorar el análisis
    lista_tareas = "\n".join(f"- {t}" for t in tareas)
    resultado = chain_duplicadas.invoke({"tareas": lista_tareas})

    try:
        # Intentamos interpretar la respuesta como JSON directamente
        import json
        sugerencias = json.loads(resultado)
    except Exception as e:
        # En caso de error, devolvemos el resultado crudo
        sugerencias = resultado

    return jsonify({"sugerencias": sugerencias})


@app.errorhandler(405)
def method_not_allowed(e):
    return jsonify(error="Método no permitido"), 405


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)


