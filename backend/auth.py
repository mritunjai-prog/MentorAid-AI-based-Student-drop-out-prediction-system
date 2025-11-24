"""
Authentication utilities for Google OAuth and JWT
"""

from functools import wraps
from flask import request, jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from google.oauth2 import id_token
from google.auth.transport import requests
import logging

logger = logging.getLogger(__name__)


def verify_google_token(token, client_id):
    """Verify Google OAuth token"""
    try:
        idinfo = id_token.verify_oauth2_token(token, requests.Request(), client_id)

        # Verify token issuer
        if idinfo["iss"] not in ["accounts.google.com", "https://accounts.google.com"]:
            raise ValueError("Wrong issuer.")

        # Extract user info
        user_info = {
            "google_id": idinfo["sub"],
            "email": idinfo["email"],
            "name": idinfo.get("name", ""),
            "picture": idinfo.get("picture", ""),
            "email_verified": idinfo.get("email_verified", False),
        }

        return user_info
    except ValueError as e:
        logger.error(f"Token verification failed: {e}")
        return None


def token_required(fn):
    """Decorator to require JWT token for protected routes"""

    @wraps(fn)
    def wrapper(*args, **kwargs):
        try:
            verify_jwt_in_request()
            return fn(*args, **kwargs)
        except Exception as e:
            return (
                jsonify({"error": "Invalid or missing token", "message": str(e)}),
                401,
            )

    return wrapper


def get_current_user_id():
    """Get current user ID from JWT token"""
    try:
        return get_jwt_identity()
    except:
        return None


def role_required(required_role):
    """Decorator to require specific role"""

    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            try:
                verify_jwt_in_request()
                user_id = get_jwt_identity()
                # Here you would typically fetch user role from database
                # For now, we'll allow all authenticated users
                return fn(*args, **kwargs)
            except Exception as e:
                return jsonify({"error": "Unauthorized", "message": str(e)}), 403

        return wrapper

    return decorator
