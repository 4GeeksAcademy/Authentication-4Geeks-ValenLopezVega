"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from api.utils import set_password, check_password
from base64 import b64encode
import os
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/healt-check', methods=['GET'])
def handle_hello():

    return jsonify("ok"), 200


@api.route('/register', methods=['POST'])
def create_user():
    data = request.json 
    required_fields = ['email', 'name', 'lastname', 'password']
    missing_fields = [field for field in required_fields if not data.get(field)]
    
    if missing_fields:
        return jsonify({'error': f'Missing fields: {", ".join(missing_fields)}'}), 400

    email = data['email']
    name = data['name']
    lastname = data['lastname']
    password = data['password']

    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already registered'}), 409

    salt = b64encode(os.urandom(32)).decode("utf-8")
    hashed_password = set_password(password, salt)

    user = User(email=email, name=name, lastname=lastname, password=hashed_password, salt=salt)
    db.session.add(user)

    try:
        db.session.commit()
        return jsonify({'message': 'User created successfully'}), 201
    except Exception as error:
        db.session.rollback()
        return jsonify({'error': 'Internal server error'}), 500

    
@api.route("/login", methods=["POST"])
def handle_login():
    data = request.json

    email = data.get("email")
    password = data.get("password")

    # Validación básica
    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    # Buscar el usuario
    user = User.query.filter_by(email=email).one_or_none()

    if user is None:
        return jsonify({'error': 'Invalid credentials'}), 401  # No decir cuál falló

    # Verificar la contraseña
    if not check_password(user.password, password, user.salt):
        return jsonify({'error': 'Invalid credentials'}), 401

    # Generar token
    token = create_access_token(identity=str(user.id))

    return jsonify({'token': token}), 200


@api.route('/private', methods=['GET'])
@jwt_required()
def private():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if user is None:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    return jsonify({"msg": f"Hola {user.name}, accediste a una ruta protegida."}), 200