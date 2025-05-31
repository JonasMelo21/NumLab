document.addEventListener('DOMContentLoaded', function() {
    const calculateBtn = document.getElementById('calculate-btn');
    const resultsDiv = document.getElementById('results');

    calculateBtn.addEventListener('click', function() {
        // Obter valores dos inputs
        const funcStr = document.getElementById('function-input').value;
        const x = parseFloat(document.getElementById('x-input').value);
        const h = parseFloat(document.getElementById('h-input').value);
        const method = document.getElementById('method-select').value;

        // Validar entradas
        if (isNaN(x) || isNaN(h) || h <= 0) {
            resultsDiv.innerHTML = '<div class="alert alert-danger">Por favor, insira valores válidos.</div>';
            return;
        }

        try {
            // Criar função a partir da string
            const f = (x) => math.evaluate(funcStr, {x: x});
            
            let derivative, methodName;
            
            // Calcular derivada conforme método selecionado
            switch(method) {
                case 'forward':
                    derivative = (f(x + h) - f(x)) / h;
                    methodName = "Diferença Progressiva";
                    break;
                case 'backward':
                    derivative = (f(x) - f(x - h)) / h;
                    methodName = "Diferença Regressiva";
                    break;
                case 'central':
                    derivative = (f(x + h) - f(x - h)) / (2 * h);
                    methodName = "Diferença Central";
                    break;
                case 'second':
                    derivative = (f(x + h) - 2 * f(x) + f(x - h)) / (h * h);
                    methodName = "Segunda Derivada";
                    break;
                default:
                    throw new Error("Método desconhecido");
            }
            
            // Exibir resultados
            resultsDiv.innerHTML = `
                <div class="alert alert-success">
                    <strong>${methodName}</strong><br>
                    <strong>f(x) = ${funcStr}</strong><br>
                    <strong>No ponto x = ${x}</strong><br>
                    <strong>Resultado:</strong> ${derivative.toFixed(8)}<br>
                    <strong>Passo h:</strong> ${h}
                </div>
            `;
        } catch (error) {
            resultsDiv.innerHTML = `<div class="alert alert-danger">Erro: ${error.message}</div>`;
        }
    });
});