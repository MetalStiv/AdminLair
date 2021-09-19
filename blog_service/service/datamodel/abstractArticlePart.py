from service import db
from sqlalchemy.ext.declarative import declared_attr

class AbstractArticlePart(db.Model):
    __abstract__ = True

    id = db.Column(
        db.Integer,
        primary_key=True
    )
    order = db.Column(
        db.Integer,
        nullable=False
    )

    @declared_attr
    def article_id(cls):
        return db.Column(
            db.Integer, 
            db.ForeignKey('article.id'),
            nullable = False
        )

    def serialize(self):
        raise NotImplementedError('AbstractArticlePart is abstract class!')