import psutil
from pyzabbix import ZabbixMetric, ZabbixSender
import time

HOST = "Your host"
# KEY = "cpu.usage"
ZABBIX_SERVER = "Your ip address"


stop = 'q'
while True:
    if True != 'q':
        cpu = psutil.cpu_percent()
        disk = psutil.disk_usage('/').percent
        packet = [
            ZabbixMetric(HOST, "cpu.usage", cpu),
            ZabbixMetric(HOST, "disk.usage", disk)
        ]
        result = ZabbixSender(zabbix_server=ZABBIX_SERVER, zabbix_port=10051).send(packet)
        print(f"CPU: {cpu}% → {result}")
        print(f"DISK: {disk}% → {result}")
        time.sleep(60)
