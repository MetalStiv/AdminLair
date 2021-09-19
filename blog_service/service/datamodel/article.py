from service import db
from sqlalchemy.sql import func
from service.datamodel.textArticlePart import TextArticlePart
from service.datamodel.imageArticlePart import ImageArticlePart
from service.datamodel.codeArticlePart import CodeArticlePart
from sqlalchemy import delete, update

class Article(db.Model):
    __tablename__ = 'article'

    id = db.Column(
        db.Integer,
        primary_key=True
    )
    name = db.Column(
        db.String(80),
        index=True,
        nullable=False
    )
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'),
        nullable=False)
    image = db.Column(
        db.String(60),
        nullable=True
    )
    time_created = db.Column(db.DateTime(timezone=True), server_default=func.now())
    time_updated = db.Column(db.DateTime(timezone=True), onupdate=func.now())

    text = db.relationship("TextArticlePart")
    images = db.relationship("ImageArticlePart")
    code = db.relationship("CodeArticlePart")

    def getContent(self):
        data = []
        for item in self.text:
            data.append(item.serialize())
        for item in self.images:
            data.append(item.serialize())
        for item in self.code:
            data.append(item.serialize())
        return data

    def addContentPart(self, part):
        if type(part) is TextArticlePart:
            self.text.append(part)
        if type(part) is ImageArticlePart:
            self.images.append(part)
        if type(part) is CodeArticlePart:
            self.code.append(part)

    def clearContent(self):
        db.session.execute(update(Article).where(Article.id == self.id))
        db.session.execute(delete(TextArticlePart).where(TextArticlePart.article_id == self.id))
        db.session.execute(delete(CodeArticlePart).where(CodeArticlePart.article_id == self.id))
        db.session.execute(delete(ImageArticlePart).where(ImageArticlePart.article_id == self.id))

    def __init__(self, name, category_id=None, image=None):
        self.name = name
        self.category_id = category_id
        self.image = image

    def serialize(self):
        if not self.time_updated:
            self.time_updated = self.time_created
        return {
            'id': self.id,
            'name': self.name,
            'image': self.image,
            'content': self.getContent(),
            'time_created': self.time_created.strftime('%d-%m-%Y %H:%M:%S'),
            'time_updated': self.time_updated.strftime('%d-%m-%Y %H:%M:%S'),
            'category': self.category_id
        }