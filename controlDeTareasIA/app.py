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
Eres un asistente experto en gestión de proyectos. A partir de la siguiente descripción, genera una lista de tareas claras, breves y sin explicaciones adicionales.

DESCRIPCIÓN:
{descripcion}

LISTA DE SUBTAREAS:
"""

prompt = ChatPromptTemplate.from_template(prompt_template)
chain = prompt | llm | StrOutputParser()

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


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)


