from service.datamodel.abstractArticlePart import AbstractArticlePart
from service import db

class TextArticlePart(AbstractArticlePart):
    __tablename__ = 'text_article_part'

    text = db.Column(
        db.Text
    )

    def __init__(self, order, text):
        self.order = order
        self.text = text

    def serialize(self):
        return {
            'order': self.order,
            'text': self.text,
            'type': 'text'
        }