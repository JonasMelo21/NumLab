document.addEventListener('DOMContentLoaded', function() {
    const calculateBtn = document.getElementById('calculate-btn');
    const resultsDiv = document.getElementById('results');
    const errorEstimateDiv = document.getElementById('error-estimate');
    const iterativeResultsDiv = document.getElementById('iterative-results');

    calculateBtn.addEventListener('click', function() {
        // Obter valores dos inputs
        const funcStr = document.getElementById('function-input').value;
        const a = parseFloat(document.getElementById('a-input').value);
        const b = parseFloat(document.getElementById('b-input').value);
        const n = parseInt(document.getElementById('n-input').value);

        // Validar entradas
        if (isNaN(a) || isNaN(b) || isNaN(n) || n < 1) {
            resultsDiv.innerHTML = '<div class="alert alert-danger">Por favor, insira valores válidos.</div>';
            return;
        }
        if (a >= b) {
            resultsDiv.innerHTML = '<div class="alert alert-danger">O limite inferior deve ser menor que o superior.</div>';
            return;
        }

        try {
            // Criar função a partir da string
            const f = (x) => math.evaluate(funcStr, {x: x});

            // Calcular derivada segunda numérica para estimativa de erro
            const fSecondDerivative = (x) => {
                const h = 0.001;
                return (f(x + h) - 2*f(x) + f(x - h)) / (h*h);
            };

            // Executar regra do trapézio
            const {integral, iterations} = trapezoidalRule(f, a, b, n);

            // Calcular estimativa de erro
            const h = (b - a)/n;
            // Usamos o máximo da segunda derivada no intervalo como estimativa conservadora
            let maxFSecond = 0;
            const samplePoints = 10; // Número de pontos para amostrar a segunda derivada
            for (let i = 0; i <= samplePoints; i++) {
                const xi = a + i*(b-a)/samplePoints;
                const current = Math.abs(fSecondDerivative(xi));
                if (current > maxFSecond) maxFSecond = current;
            }
            const errorEstimate = Math.abs((b-a)*h*h/12 * maxFSecond);

            // Exibir resultados
            resultsDiv.innerHTML = `
                <div class="alert alert-success">
                    <strong>Valor da Integral:</strong> ${integral.toFixed(8)}<br>
                    <strong>Número de subintervalos:</strong> ${n}<br>
                    <strong>Tamanho do passo (h):</strong> ${h.toFixed(6)}
                </div>
            `;
            
            errorEstimateDiv.innerHTML = `
                <div class="alert alert-info">
                    <strong>Estimativa de Erro:</strong> ±${errorEstimate.toExponential(4)}<br>
                    <small>Baseada no máximo da segunda derivada no intervalo</small>
                </div>
            `;
            
            // Exibir tabela de resultados iterativos (para diferentes valores de n)
            let tableHtml = `
                <h5 class="text-light mt-4 mb-3">Convergência com diferentes números de subintervalos</h5>
                <div class="table-responsive">
                    <table class="table table-dark table-striped table-hover">
                        <thead>
                            <tr>
                                <th>n</th>
                                <th>Integral</th>
                                <th>Erro Absoluto</th>
                                <th>Ordem de Convergência</th>
                            </tr>
                        </thead>
                        <tbody>
            `;
            
            // Calcular para diferentes valores de n (potências de 2)
            const maxPower = Math.ceil(Math.log2(n)) + 2;
            let prevIntegral = 0;
            let prevPrevIntegral = 0;
            
            for (let power = 0; power <= maxPower; power++) {
                const currentN = Math.pow(2, power);
                const currentResult = trapezoidalRule(f, a, b, currentN).integral;
                const error = Math.abs(currentResult - integral);
                
                // Calcular ordem de convergência (apenas a partir do terceiro ponto)
                let convergenceRate = '-';
                if (power >= 2) {
                    const rate = Math.log2(Math.abs((prevPrevIntegral - prevIntegral)/(prevIntegral - currentResult)));
                    convergenceRate = rate.toFixed(2);
                }
                
                tableHtml += `
                    <tr ${currentN === n ? 'class="table-primary"' : ''}>
                        <td>${currentN}</td>
                        <td>${currentResult.toFixed(8)}</td>
                        <td>${error.toExponential(6)}</td>
                        <td>${convergenceRate}</td>
                    </tr>
                `;
                
                prevPrevIntegral = prevIntegral;
                prevIntegral = currentResult;
            }
            
            tableHtml += `
                        </tbody>
                    </table>
                </div>
                <p class="text-muted">A ordem de convergência teórica para a regra do trapézio é 2 (O(h²))</p>
            `;
            
            iterativeResultsDiv.innerHTML = tableHtml;
        } catch (error) {
            resultsDiv.innerHTML = `<div class="alert alert-danger">Erro: ${error.message}</div>`;
            errorEstimateDiv.innerHTML = '';
            iterativeResultsDiv.innerHTML = '';
        }
    });
});

function trapezoidalRule(f, a, b, n) {
    if (n < 1) throw new Error("O número de subintervalos deve ser pelo menos 1");
    
    const h = (b - a) / n;
    let sum = 0.5 * (f(a) + f(b));
    
    // Armazenar iterações para análise
    const iterations = [];
    iterations.push({x: a, fx: f(a)});
    
    for (let i = 1; i < n; i++) {
        const x = a + i * h;
        sum += f(x);
        iterations.push({x, fx: f(x)});
    }
    
    iterations.push({x: b, fx: f(b)});
    
    const integral = h * sum;
    return {integral, iterations};
}