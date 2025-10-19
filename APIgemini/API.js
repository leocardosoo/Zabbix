var Gemini = {
    params: {},
    setParams: function(params) {
        if (typeof params !== 'object') {
            return;
        }
        Gemini.params = params;
        if (typeof Gemini.params.api_key !== 'string' || Gemini.params.api_key === '') {
            throw 'API key for Gemini is required.';
        }
        Gemini.params.url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
    },
    request: function(data) {
        if (!Gemini.params.api_key) {
            throw 'API key is missing.';
        }
        var request = new HttpRequest();
        request.addHeader('Content-Type: application/json');
        
        // Construir URL com a API
        var urlWithKey = Gemini.params.url + '?key=' + Gemini.params.api_key;
        
        Zabbix.log(4, '[ Gemini Webhook ] Sending request: ' + urlWithKey + '\n' + JSON.stringify(data));
        var response = request.post(urlWithKey, JSON.stringify(data));
        Zabbix.log(4, '[ Gemini Webhook ] Received response with status code ' + request.getStatus() + '\n' + response);
        
        if (request.getStatus() < 200 || request.getStatus() >= 300) {
            throw 'Gemini API request failed with status code ' + request.getStatus() + '.';
        }
        
        try {
            response = JSON.parse(response);
        } catch (error) {
            Zabbix.log(4, '[ Gemini Webhook ] Failed to parse response from Gemini.');
            response = null;
        }
        return response;
    }
};

try {
    var params = JSON.parse(value),
        data = {},
        result = "",
        required_params = ['alert_subject'];
    
    Object.keys(params).forEach(function(key) {
        if (required_params.indexOf(key) !== -1 && params[key] === '') {
            throw 'Parameter "' + key + '" cannot be empty.';
        }
    });

    // Formatatar para o gemini
     data = {
        contents: [{
            parts: [{
                text: "Alerta: " + params.alert_subject + " ocorreu no Zabbix. " +
                      "Sugira possíveis causas e soluções para resolver este problema, não faça um texto grande, " +
                      "apenas cerca de 10 linhas com causas, ideias, comandos para debug e medidas para prevenir futuros incidentes."
            }]
        }]
    };

    // Configurar a api no zabbix
    Gemini.setParams({ api_key: params.api_key });
    
    // Hacer la solicitud a Gemini
    var response = Gemini.request(data);
    
    if (response && response.candidates && response.candidates.length > 0) {
        result = response.candidates[0].content.parts[0].text.trim();
    } else {
        throw 'No response from Gemini.';
    }
    
    return result;
    
} catch (error) {
    Zabbix.log(3, '[ Gemini Webhook ] ERROR: ' + error);
    throw 'Sending failed: ' + error;
}