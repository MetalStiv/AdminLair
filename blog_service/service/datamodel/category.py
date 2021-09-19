from service import db

class Category(db.Model):
    __tablename__ = 'category'

    id = db.Column(
        db.Integer,
        primary_key=True
    )
    name = db.Column(
        db.String(80),
        index=True,
        unique=True,
        nullable=False
    )
    parent_id = db.Column(db.Integer, db.ForeignKey('category.id'),
        nullable=True)
    
    articles = db.relationship('Article', backref='category', lazy='dynamic')
    
    def __init__(self, name, parent_id=None):
        self.name = name
        self.parent_id = parent_id

    def serialize(self):
        children = []
        children_data = Category.query.filter_by(parent_id=self.id).all()
        for child in children_data:
            children.append(child.serialize())
        return {
            'id': self.id,
            'name': self.name,
            'children'  : children
        }

Category.parent = db.relationship('Category', lazy='joined',
    backref=db.backref('child', lazy='joined'), remote_side=Category.id)