![logo](https://github.com/witrixs/MonitoringCloud/blob/main/frontend/public/favicon.png)

# 📊 MonitoringCloud 

> Мониторинг для облачного сервера на Python и React.js

## Requirements

1. Pyhton 3.8+
2. Node.js 16.11.0 or newer

## 🚀 Getting Started

>Backend
```sh
cd Backend
pip install -r requirements.txt
python app.py
```

>Frontend
```sh
cd Frontend
npm install
npm start
```

Для того что бы использовать фронтенд на проде `npm run build` и папку build закинуть в backend.

## ⚙️ Configuration

Скопировать и переименовать `.env.example` в `.env` и заполните значения:

⚠️ **Примечание. Никогда не делитесь публично своим токеном или ключами API.** ⚠️

```.env
FLASK_ENV=development или prodaction
NEXTCLOUD_URL=https://your-server/ocs/v2.php/apps/serverinfo/api/v1/info
NEXTCLOUD_USERNAME=Ваш логин от облака
NEXTCLOUD_PASSWORD=Ваш пароль
```
⚠️ **Примечание. FLASK_ENV=prodaction будет использовать папку build а так же сертификат SSL.** ⚠️

## ⚙️ Доп. Настройка

⚠️ **Пароль от Дашборда по дефолту 0000** ⚠️
>Расположение frontend/src/App.js
```
const correctPinCode = 'Ваш пароль';
```
⚠️ **Установка порта и сертификата в режиме prodaction** ⚠️
>Расположение backend/app.py
```
app.run(ssl_context=('путь до вашего сертификата/cert.pem', 'путь до вашего сертификата/key.pem'), host='0.0.0.0', port=443)
```
## ❤️ Dev by witrix
