from service import create_app

class Config(object):
    DEBUG = False
    TESTING = False
    SECRET_KEY = 'SecretKeyqwerty12345!!'

class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'mysql://root:m121144169@localhost/sysadmin?charset=utf8'
    LOCAL_WEB_STORAGE = 'D:\\Programs\\wamp\\www\\sysadmin'
    MAX_CONTENT_LENGTH = 10 * 1024 * 1024
    #PRIVATE_KEY1 = b"-----BEGIN PRIVATE KEY-----\nMIGEAgEAMBAGByqGSM49AgEGBS..."
    PUBLIC_KEY1 = b"-----BEGIN PUBLIC KEY-----\nMHYwEAYHKoZIzj0CAQYFK4EEAC..."
    #PRIVATE_KEY2 = b"-----BEGIN PRIVATE KEY-----\nMIGEAgEAMBAGByqGSM49AgEGBS..."
    #PUBLIC_KEY2 = b"-----BEGIN PUBLIC KEY-----\nMHYwEAYHKoZIzj0CAQYFK4EEAC..."
    ORIGINS=['http://localhost:3000']

app = create_app(DevelopmentConfig)
app.run('0.0.0.0', '8093')