from flask import Blueprint, jsonify, current_app, request
from service.datamodel.article import Article
from service import db
from werkzeug.utils import secure_filename
from os import path
import random
import string
from service.datamodel.textArticlePart import TextArticlePart
from service.datamodel.imageArticlePart import ImageArticlePart
from service.datamodel.codeArticlePart import CodeArticlePart
from service.datamodel.category import Category

article_bp = Blueprint('article_bp', __name__)

@article_bp.route('/getArticles', methods=['GET'])                                                                                                                                   
def getArticles():
    articles = []
    startId = request.args.get('startId')
    step = request.args.get('step')
    category = request.args.get('categoryFilter')
    searchFilter = request.args.get('searchFilter')
    query = db.session.query(Article)
    if searchFilter != '':
        query = query.filter(Article.name.like('%' + searchFilter + '%'))
    else:  
        if int(category) > 0:
            query = query.filter(Article.category_id == category)
    for article in query.order_by(Article.time_created.desc()).\
        offset(startId).limit(step):
        article_info = article.serialize()
        articles.append(article_info)
    return jsonify(articles)

@article_bp.route('/getArticleById', methods=['GET'])                                                                                                                                   
def getArticleById():
    articles = []
    id = request.args.get('id')
    query = db.session.query(Article).filter(Article.id == id)
    return jsonify(query.one().serialize())

@article_bp.route('/addArticle', methods=['POST'])                                                                                                                                   
def addArticle():
    data = request.get_json(force=True)
    article = Article(data.get('name'), data.get('category'), data.get('image'))
    for element in data.get('content'):
        if element['type'] == 'text':
            part = TextArticlePart(element['order'], element['text'])
            article.addContentPart(part)
        if element['type'] == 'code':
            part = CodeArticlePart(element['order'], element['code'])
            article.addContentPart(part)
        if element['type'] == 'image':
            part = ImageArticlePart(element['order'], element['image'])
            article.addContentPart(part)
    db.session.add(article)
    db.session.commit()
    return jsonify({'code': 0, 'id': article.id})

@article_bp.route('/uploadImage', methods=['POST'])                                                                                                                                   
def uploadImage():
    if 'file' not in request.files:
        return jsonify({'code': 1})
    file = request.files['file']
    ext = secure_filename(file.filename).split('.')[-1]
    filename = ''.join(random.choices(string.ascii_uppercase + string.digits, k=16)) + '.' + ext
    file.save(path.join(current_app.LOCAL_WEB_STORAGE, filename))
    return jsonify({'code': 0, 'filename': filename})

@article_bp.route('/updateArticle', methods=['POST'])                                                                                                                                   
def updateArticle():
    data = request.get_json(force=True)
    article = db.session.query(Article).filter(Article.id == data.get('id')).one()
    article.name = data.get('name')
    article.category = db.session.query(Category).filter(Category.id == data.get('category')).one()
    article.image = data.get('image')
    article.clearContent()
    for element in data.get('content'):
        if element['type'] == 'text':
            part = TextArticlePart(element['order'], element['text'])
            article.addContentPart(part)
        if element['type'] == 'code':
            part = CodeArticlePart(element['order'], element['code'])
            article.addContentPart(part)
        if element['type'] == 'image':
            part = ImageArticlePart(element['order'], element['image'])
            article.addContentPart(part)
    db.session.commit()
    return jsonify({'code': 0})