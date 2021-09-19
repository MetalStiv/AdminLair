from service.datamodel.abstractArticlePart import AbstractArticlePart
from service import db

class CodeArticlePart(AbstractArticlePart):
    __tablename__ = 'code_article_part'

    code = db.Column(
        db.Text
    )

    def __init__(self, order, code):
        self.order = order
        self.code = code

    def serialize(self):
        return {
            'order': self.order,
            'code': self.code,
            'type': 'code'
        }