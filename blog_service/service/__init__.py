from flask import Flask, current_app
from flask_cors import CORS

from service.database import db
from service.blueprints.category_bp.controllers import category_bp
from service.blueprints.article_bp.controllers import article_bp
from service.datamodel.category import Category
from service.datamodel.article import Article
from service.datamodel.textArticlePart import TextArticlePart
from service.datamodel.imageArticlePart import ImageArticlePart
from service.datamodel.codeArticlePart import CodeArticlePart

def create_app(config):
    app = Flask(__name__)
    app.config.from_object(config)

    app_ctx = app.app_context()
    app_ctx.push()
    current_app.LOCAL_WEB_STORAGE = app.config['LOCAL_WEB_STORAGE']

    CORS(app, supports_credentials=True, origins=app.config['ORIGINS'])

    db.init_app(app)
    with app.app_context():
        db.create_all()
    current_app.db = db
    
    app.register_blueprint(category_bp)
    app.register_blueprint(article_bp)
    return app