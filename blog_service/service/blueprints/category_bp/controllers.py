from flask import Blueprint, jsonify, current_app, request, session
from service.datamodel.category import Category
from service import db

category_bp = Blueprint('category_bp', __name__)

@category_bp.route('/getCategories', methods=['GET'])                                                                                                                                   
def getCategories():
    categories = []
    for category in db.session.query(Category) \
        .filter(Category.parent_id == None).all():
        categories.append(category.serialize())
    return jsonify(categories)

@category_bp.route('/getCategoryList', methods=['GET'])                                                                                                                                   
def getCategoryList():
    categories = []
    for category in db.session.query(Category) \
        .filter().all():
        categories.append(category.serialize())
    return jsonify(categories)

@category_bp.route('/addCategory', methods=['GET'])                                                                                                                                   
def addCategory():
    #category = Category('test')
    #db.session.add(category)
    #db.session.commit()
    return jsonify({'code': 0})
