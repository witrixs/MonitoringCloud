import os
import requests
import xml.etree.ElementTree as ET
from dotenv import load_dotenv

load_dotenv()

NEXTCLOUD_URL = os.getenv('NEXTCLOUD_URL')
USERNAME = os.getenv('NEXTCLOUD_USERNAME')
PASSWORD = os.getenv('NEXTCLOUD_PASSWORD')

def get_server_info():
    response = requests.get(NEXTCLOUD_URL, auth=(USERNAME, PASSWORD))
    print(response.text)  # Для отладки
    if response.status_code == 200:
        root = ET.fromstring(response.content)

        # Извлечение данных
        cpu_load_elements = []
        for elem in root.findall('./data/nextcloud/system/cpuload/element'):
            try:
                cpu_load_elements.append(float(elem.text.strip()))  # Удаляем пробелы и символы новой строки
            except ValueError:
                print(f"Skipping invalid CPU load value: '{elem.text}'")  # Отладочная информация

        cpu_load_percentage = sum(cpu_load_elements) * 100  # Преобразуем в проценты

        total_memory = int(root.find('./data/nextcloud/system/mem_total').text.strip()) // (1024 * 1024)  # В мегабайтах
        free_memory = int(root.find('./data/nextcloud/system/mem_free').text.strip()) // (1024 * 1024)  # В мегабайтах

        info = {
            'status': root.find('./meta/status').text.strip(),
            'version': root.find('./data/nextcloud/system/version').text.strip(),
            'cpuload': cpu_load_percentage,  # В процентах
            'mem_total': total_memory,  # В мегабайтах
            'mem_free': free_memory,  # В мегабайтах
            'swap_total': int(root.find('./data/nextcloud/system/swap_total').text.strip()) // (1024 * 1024),  # В мегабайтах
            'swap_free': int(root.find('./data/nextcloud/system/swap_free').text.strip()) // (1024 * 1024),  # В мегабайтах
            'num_users': root.find('./data/nextcloud/storage/num_users').text.strip(),
            'num_files': root.find('./data/nextcloud/storage/num_files').text.strip(),
            'webserver': root.find('./data/server/webserver').text.strip(),
            'php_version': root.find('./data/server/php/version').text.strip(),
            'database_type': root.find('./data/server/database/type').text.strip(),
            'active_users': {
                'last5minutes': root.find('./data/activeUsers/last5minutes').text.strip(),
                'last1hour': root.find('./data/activeUsers/last1hour').text.strip(),
                'last24hours': root.find('./data/activeUsers/last24hours').text.strip(),
            },
        }
        return info
    else:
        raise Exception(f"Error: {response.status_code} - {response.text}")

if __name__ == "__main__":
    try:
        server_info = get_server_info()
        print(server_info)
    except Exception as e:
        print(e)
