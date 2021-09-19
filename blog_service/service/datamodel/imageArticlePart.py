from service.datamodel.abstractArticlePart import AbstractArticlePart
from service import db

class ImageArticlePart(AbstractArticlePart):
    __tablename__ = 'image_article_part'

    image = db.Column(
        db.String(50)
    )

    def __init__(self, order, image):
        self.order = order
        self.image = image

    def serialize(self):
        return {
            'order': self.order,
            'image': self.image,
            'type': 'image'
        }