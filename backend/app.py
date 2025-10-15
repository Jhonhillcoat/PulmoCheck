from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import sqlite3
from datetime import datetime
import json
from pathlib import Path
import hashlib

app = Flask(__name__)
CORS(app, origins=["https://pulmocheck-96f8f.web.app", "https://pulmocheck-96f8f.firebaseapp.com"])

# Configuración
UPLOAD_FOLDER = 'uploads'
DB_PATH = 'pulmocheck.db'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'dcm', 'dicom'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  # 50MB max

# Crear carpetas necesarias
Path(UPLOAD_FOLDER).mkdir(exist_ok=True)

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Tabla de pacientes y evaluaciones
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS assessments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            patient_name TEXT NOT NULL,
            patient_email TEXT,
            age INTEGER NOT NULL,
            gender TEXT NOT NULL,
            years_smoking INTEGER NOT NULL,
            cigarettes_per_day INTEGER NOT NULL,
            family_history BOOLEAN NOT NULL,
            persistent_cough BOOLEAN NOT NULL,
            dyspnea BOOLEAN NOT NULL,
            hemoptysis BOOLEAN NOT NULL,
            last_ct TEXT,
            asbestos_exposure BOOLEAN NOT NULL,
            copd_emphysema BOOLEAN NOT NULL,
            risk_score REAL NOT NULL,
            risk_level TEXT NOT NULL,
            recommendation TEXT NOT NULL,
            image_path TEXT,
            ml_analysis TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Tabla de comentarios médicos
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS doctor_comments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            assessment_id INTEGER NOT NULL,
            doctor_name TEXT NOT NULL,
            comment TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (assessment_id) REFERENCES assessments (id)
        )
    ''')
    
    # Tabla de usuarios médicos (simple)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS doctors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            name TEXT NOT NULL
        )
    ''')
    
    # Crear doctor de demo si no existe
    cursor.execute('SELECT * FROM doctors WHERE username = ?', ('doctor',))
    if not cursor.fetchone():
        # Password: doctor123
        password_hash = hashlib.sha256('doctor123'.encode()).hexdigest()
        cursor.execute('INSERT INTO doctors (username, password_hash, name) VALUES (?, ?, ?)',
                      ('doctor', password_hash, 'Dr. Demo'))
    
    conn.commit()
    conn.close()

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def calculate_risk_score(data):
    """
    Calcula el score de riesgo basado en factores NCCN/USPSTF
    Score máximo: 100 puntos
    """
    score = 0
    factors = []
    
    # Edad (0-20 puntos)
    age = int(data['age'])
    if age >= 50 and age < 55:
        score += 10
        factors.append("Edad 50-54 años: +10")
    elif age >= 55 and age < 65:
        score += 15
        factors.append("Edad 55-64 años: +15")
    elif age >= 65:
        score += 20
        factors.append("Edad 65+ años: +20")
    
    # Años fumando (0-25 puntos)
    years_smoking = int(data['years_smoking'])
    if years_smoking >= 10 and years_smoking < 20:
        score += 10
        factors.append("10-19 años fumando: +10")
    elif years_smoking >= 20 and years_smoking < 30:
        score += 15
        factors.append("20-29 años fumando: +15")
    elif years_smoking >= 30:
        score += 25
        factors.append("30+ años fumando: +25")
    
    # Cigarrillos por día (0-20 puntos)
    cigarettes = int(data['cigarettes_per_day'])
    if cigarettes >= 10 and cigarettes < 20:
        score += 10
        factors.append("10-19 cigarrillos/día: +10")
    elif cigarettes >= 20:
        score += 20
        factors.append("20+ cigarrillos/día: +20")
    
    # Antecedentes familiares (0-10 puntos)
    if data['family_history']:
        score += 10
        factors.append("Antecedentes familiares: +10")
    
    # Síntomas (0-15 puntos cada uno, máximo 25 si tiene múltiples)
    symptoms_count = 0
    if data['persistent_cough']:
        score += 8
        factors.append("Tos persistente: +8")
        symptoms_count += 1
    if data['dyspnea']:
        score += 8
        factors.append("Disnea: +8")
        symptoms_count += 1
    if data['hemoptysis']:
        score += 15
        factors.append("Hemoptisis: +15")
        symptoms_count += 1
    
    # Ajuste si tiene múltiples síntomas
    if symptoms_count > 1:
        bonus = min(10, (symptoms_count - 1) * 5)
        score += bonus
        factors.append(f"Múltiples síntomas: +{bonus}")
    
    # Exposición a asbestos (0-10 puntos)
    if data['asbestos_exposure']:
        score += 10
        factors.append("Exposición a asbestos: +10")
    
    # EPOC/Enfisema (0-10 puntos)
    if data['copd_emphysema']:
        score += 10
        factors.append("EPOC/Enfisema: +10")
    
    # Determinar nivel de riesgo
    if score < 30:
        risk_level = "Bajo"
        recommendation = "Su riesgo es bajo. Mantenga hábitos saludables y considere dejar de fumar si aún lo hace."
    elif score < 60:
        risk_level = "Moderado"
        recommendation = "Su riesgo es moderado. Se recomienda consultar con su médico sobre la conveniencia de realizar una tomografía computada de tórax de baja dosis (LDCT)."
    else:
        risk_level = "Alto"
        recommendation = "Su riesgo es alto. Es altamente recomendable realizar una tomografía computada de tórax de baja dosis (LDCT) y consultar con un especialista lo antes posible."
    
    return {
        'score': min(score, 100),  # Cap at 100
        'risk_level': risk_level,
        'recommendation': recommendation,
        'factors': factors
    }

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok', 'message': 'PulmoCheck API is running'})

@app.route('/api/assessment', methods=['POST'])
def create_assessment():
    try:
        data = request.json
        
        # Validar datos requeridos
        required_fields = ['patient_name', 'age', 'gender', 'years_smoking', 
                          'cigarettes_per_day', 'family_history', 'persistent_cough',
                          'dyspnea', 'hemoptysis', 'asbestos_exposure', 'copd_emphysema']
        
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Campo requerido: {field}'}), 400
        
        # Calcular score de riesgo
        risk_data = calculate_risk_score(data)
        
        # Guardar en base de datos
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO assessments (
                patient_name, patient_email, age, gender, years_smoking,
                cigarettes_per_day, family_history, persistent_cough, dyspnea,
                hemoptysis, last_ct, asbestos_exposure, copd_emphysema,
                risk_score, risk_level, recommendation
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            data['patient_name'],
            data.get('patient_email', ''),
            data['age'],
            data['gender'],
            data['years_smoking'],
            data['cigarettes_per_day'],
            data['family_history'],
            data['persistent_cough'],
            data['dyspnea'],
            data['hemoptysis'],
            data.get('last_ct', ''),
            data['asbestos_exposure'],
            data['copd_emphysema'],
            risk_data['score'],
            risk_data['risk_level'],
            risk_data['recommendation']
        ))
        
        assessment_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'assessment_id': assessment_id,
            'risk_score': risk_data['score'],
            'risk_level': risk_data['risk_level'],
            'recommendation': risk_data['recommendation'],
            'factors': risk_data['factors']
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/upload/<int:assessment_id>', methods=['POST'])
def upload_image(assessment_id):
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No se encontró archivo'}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({'error': 'Nombre de archivo vacío'}), 400
        
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            filename = f"{assessment_id}_{timestamp}_{filename}"
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            
            file.save(filepath)
            
            # Actualizar base de datos
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute('UPDATE assessments SET image_path = ? WHERE id = ?',
                          (filepath, assessment_id))
            conn.commit()
            conn.close()
            
            return jsonify({
                'success': True,
                'message': 'Imagen subida exitosamente',
                'filename': filename
            })
        
        return jsonify({'error': 'Tipo de archivo no permitido'}), 400
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/analyze/<int:assessment_id>', methods=['POST'])
def analyze_image(assessment_id):
    """
    Análisis ML placeholder - simula detección de nódulos
    En producción, aquí se conectaría el modelo real (LUNA16, nnUNet, etc.)
    """
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('SELECT image_path FROM assessments WHERE id = ?', (assessment_id,))
        result = cursor.fetchone()
        
        if not result or not result['image_path']:
            return jsonify({'error': 'No se encontró imagen para este assessment'}), 404
        
        # Simulación de análisis ML (placeholder)
        import random
        
        # Generar resultados simulados
        has_nodule = random.random() > 0.6  # 40% de probabilidad de detectar nódulo
        
        if has_nodule:
            nodule_size = random.uniform(4, 15)  # mm
            confidence = random.uniform(0.65, 0.95)
            malignancy_risk = random.uniform(0.2, 0.8)
            
            analysis = {
                'status': 'completed',
                'nodules_detected': True,
                'nodule_count': random.randint(1, 3),
                'largest_nodule_mm': round(nodule_size, 1),
                'confidence': round(confidence, 2),
                'malignancy_risk': round(malignancy_risk, 2),
                'recommendation': 'Se detectaron uno o más nódulos pulmonares. Se recomienda evaluación médica inmediata.',
                'note': 'IMPORTANTE: Este es un análisis preliminar automatizado. El diagnóstico definitivo debe ser realizado por un radiólogo certificado.'
            }
        else:
            analysis = {
                'status': 'completed',
                'nodules_detected': False,
                'nodule_count': 0,
                'confidence': round(random.uniform(0.75, 0.95), 2),
                'recommendation': 'No se detectaron nódulos significativos en el análisis preliminar.',
                'note': 'Este resultado no descarta completamente la presencia de anomalías. Se recomienda revisión médica profesional.'
            }
        
        # Guardar análisis en base de datos
        cursor.execute('UPDATE assessments SET ml_analysis = ? WHERE id = ?',
                      (json.dumps(analysis), assessment_id))
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'analysis': analysis
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/doctor/login', methods=['POST'])
def doctor_login():
    try:
        data = request.json
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({'error': 'Usuario y contraseña requeridos'}), 400
        
        password_hash = hashlib.sha256(password.encode()).hexdigest()
        
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM doctors WHERE username = ? AND password_hash = ?',
                      (username, password_hash))
        doctor = cursor.fetchone()
        conn.close()
        
        if doctor:
            return jsonify({
                'success': True,
                'doctor': {
                    'id': doctor['id'],
                    'name': doctor['name'],
                    'username': doctor['username']
                }
            })
        else:
            return jsonify({'error': 'Credenciales inválidas'}), 401
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/doctor/assessments', methods=['GET'])
def get_assessments():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT a.*, 
                   (SELECT COUNT(*) FROM doctor_comments WHERE assessment_id = a.id) as comment_count
            FROM assessments a
            ORDER BY a.created_at DESC
        ''')
        
        assessments = []
        for row in cursor.fetchall():
            assessment = dict(row)
            
            # Parsear análisis ML si existe
            if assessment['ml_analysis']:
                assessment['ml_analysis'] = json.loads(assessment['ml_analysis'])
            
            assessments.append(assessment)
        
        conn.close()
        
        return jsonify({
            'success': True,
            'assessments': assessments
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/doctor/assessment/<int:assessment_id>', methods=['GET'])
def get_assessment_detail(assessment_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM assessments WHERE id = ?', (assessment_id,))
        assessment = cursor.fetchone()
        
        if not assessment:
            return jsonify({'error': 'Assessment no encontrado'}), 404
        
        assessment_dict = dict(assessment)
        
        # Parsear análisis ML
        if assessment_dict['ml_analysis']:
            assessment_dict['ml_analysis'] = json.loads(assessment_dict['ml_analysis'])
        
        # Obtener comentarios
        cursor.execute('''
            SELECT * FROM doctor_comments 
            WHERE assessment_id = ? 
            ORDER BY created_at DESC
        ''', (assessment_id,))
        
        comments = [dict(row) for row in cursor.fetchall()]
        assessment_dict['comments'] = comments
        
        conn.close()
        
        return jsonify({
            'success': True,
            'assessment': assessment_dict
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/doctor/comment', methods=['POST'])
def add_comment():
    try:
        data = request.json
        
        required_fields = ['assessment_id', 'doctor_name', 'comment']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Campo requerido: {field}'}), 400
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO doctor_comments (assessment_id, doctor_name, comment)
            VALUES (?, ?, ?)
        ''', (data['assessment_id'], data['doctor_name'], data['comment']))
        
        comment_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'comment_id': comment_id
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/report/<int:assessment_id>', methods=['GET'])
def generate_report(assessment_id):
    """
    Genera reporte PDF del assessment
    """
    try:
        from reportlab.lib.pagesizes import letter
        from reportlab.pdfgen import canvas
        from reportlab.lib.units import inch
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM assessments WHERE id = ?', (assessment_id,))
        assessment = cursor.fetchone()
        
        if not assessment:
            return jsonify({'error': 'Assessment no encontrado'}), 404
        
        # Obtener comentarios
        cursor.execute('SELECT * FROM doctor_comments WHERE assessment_id = ?', (assessment_id,))
        comments = cursor.fetchall()
        
        conn.close()
        
        # Crear PDF
        pdf_path = f"uploads/report_{assessment_id}.pdf"
        c = canvas.Canvas(pdf_path, pagesize=letter)
        width, height = letter
        
        # Encabezado
        c.setFont("Helvetica-Bold", 20)
        c.drawString(1*inch, height - 1*inch, "PulmoCheck 🫁")
        
        c.setFont("Helvetica", 12)
        c.drawString(1*inch, height - 1.3*inch, "Reporte de Evaluación de Riesgo")
        c.drawString(1*inch, height - 1.5*inch, f"Fecha: {assessment['created_at']}")
        
        # Datos del paciente
        y = height - 2*inch
        c.setFont("Helvetica-Bold", 14)
        c.drawString(1*inch, y, "Datos del Paciente")
        y -= 0.3*inch
        
        c.setFont("Helvetica", 11)
        c.drawString(1*inch, y, f"Nombre: {assessment['patient_name']}")
        y -= 0.25*inch
        c.drawString(1*inch, y, f"Edad: {assessment['age']} años")
        y -= 0.25*inch
        c.drawString(1*inch, y, f"Género: {assessment['gender']}")
        
        # Score de riesgo
        y -= 0.5*inch
        c.setFont("Helvetica-Bold", 14)
        c.drawString(1*inch, y, "Evaluación de Riesgo")
        y -= 0.3*inch
        
        c.setFont("Helvetica", 11)
        c.drawString(1*inch, y, f"Score de Riesgo: {assessment['risk_score']}/100")
        y -= 0.25*inch
        c.drawString(1*inch, y, f"Nivel de Riesgo: {assessment['risk_level']}")
        y -= 0.25*inch
        
        # Recomendación
        y -= 0.3*inch
        c.setFont("Helvetica-Bold", 12)
        c.drawString(1*inch, y, "Recomendación:")
        y -= 0.25*inch
        
        c.setFont("Helvetica", 10)
        # Wrap text
        recommendation = assessment['recommendation']
        max_width = width - 2*inch
        words = recommendation.split()
        lines = []
        current_line = []
        
        for word in words:
            current_line.append(word)
            if c.stringWidth(' '.join(current_line), "Helvetica", 10) > max_width:
                current_line.pop()
                lines.append(' '.join(current_line))
                current_line = [word]
        if current_line:
            lines.append(' '.join(current_line))
        
        for line in lines:
            c.drawString(1*inch, y, line)
            y -= 0.2*inch
        
        # Análisis ML si existe
        if assessment['ml_analysis']:
            ml_data = json.loads(assessment['ml_analysis'])
            y -= 0.3*inch
            c.setFont("Helvetica-Bold", 12)
            c.drawString(1*inch, y, "Análisis de Imagen (IA):")
            y -= 0.25*inch
            
            c.setFont("Helvetica", 10)
            c.drawString(1*inch, y, f"Nódulos detectados: {'Sí' if ml_data.get('nodules_detected') else 'No'}")
            y -= 0.2*inch
            if ml_data.get('nodules_detected'):
                c.drawString(1*inch, y, f"Tamaño mayor: {ml_data.get('largest_nodule_mm')} mm")
                y -= 0.2*inch
        
        # Comentarios médicos
        if comments:
            y -= 0.3*inch
            c.setFont("Helvetica-Bold", 12)
            c.drawString(1*inch, y, "Comentarios Médicos:")
            y -= 0.25*inch
            
            for comment in comments:
                c.setFont("Helvetica-Bold", 10)
                c.drawString(1*inch, y, f"{comment['doctor_name']} - {comment['created_at']}")
                y -= 0.2*inch
                c.setFont("Helvetica", 10)
                c.drawString(1.2*inch, y, comment['comment'])
                y -= 0.3*inch
        
        # Disclaimer
        y -= 0.5*inch
        c.setFont("Helvetica-Oblique", 8)
        disclaimer = "IMPORTANTE: Este reporte es orientativo y educativo. No reemplaza el diagnóstico médico profesional."
        c.drawString(1*inch, y, disclaimer)
        
        c.save()
        
        return send_file(pdf_path, as_attachment=True, download_name=f"reporte_pulmocheck_{assessment_id}.pdf")
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    init_db()
    print("🫁 PulmoCheck API iniciada")
    print("📊 Base de datos inicializada")
    print("🔐 Usuario demo: doctor / doctor123")
    
    # Usar puerto del entorno o 5000 por defecto
    import os
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV', 'development') == 'development'
    
    app.run(debug=debug, host='0.0.0.0', port=port)

