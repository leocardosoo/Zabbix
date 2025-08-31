import requests
import json

url = "http://YOUR SERVER/zabbix/api_jsonrpc.php"
headers = {"Content-Type": "application/json-rpc"}

auth_token = "Your API"


payload = {
    "jsonrpc": "2.0",
    "method": "trigger.get",
    "params": {
        "output": ["triggerid", "description", "priority", "value", "status"],
        "expandDescription": True,
        "selectHosts": ["host"],  
        "limit": 50,             
        "filter": {"value": 1}    
    },
    "auth": auth_token,
    "id": 1
}

response = requests.post(url, headers=headers, json=payload, verify=False)

data = response.json()

if "result" in data:
    for trigger in data["result"]:
        description = trigger.get("description")
        status = "Ativo" if trigger.get("value") == "1" else "Inativo"
        hosts = [host["host"] for host in trigger.get("hosts", [])]
        print(f"Trigger: {description}\nStatus: {status}\nHosts: {', '.join(hosts)}\n{'-'*40}")
else:
    print("Nenhuma trigger encontrada ou token inválido")
