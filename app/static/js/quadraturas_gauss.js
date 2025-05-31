document.addEventListener('DOMContentLoaded', function() {
    const calculateBtn = document.getElementById('calculate-btn');
    const resultsDiv = document.getElementById('results');
    const pointsInfoDiv = document.getElementById('points-info');
    const comparisonResultsDiv = document.getElementById('comparison-results');

    calculateBtn.addEventListener('click', function() {
        // Obter valores dos inputs
        const funcStr = document.getElementById('function-input').value;
        const a = parseFloat(document.getElementById('a-input').value);
        const b = parseFloat(document.getElementById('b-input').value);
        const n = parseInt(document.getElementById('n-input').value);

        // Validar entradas
        if (isNaN(a) || isNaN(b) || isNaN(n) || n < 1 || n > 6) {
            resultsDiv.innerHTML = '<div class="alert alert-danger">Por favor, insira valores válidos (n entre 1 e 6).</div>';
            return;
        }
        if (a >= b) {
            resultsDiv.innerHTML = '<div class="alert alert-danger">O limite inferior deve ser menor que o superior.</div>';
            return;
        }

        try {
            // Criar função a partir da string
            const f = (x) => math.evaluate(funcStr, {x: x});

            // Executar quadratura de Gauss
            const {integral, points, weights} = gaussQuadrature(f, a, b, n);

            // Exibir resultados
            resultsDiv.innerHTML = `
                <div class="alert alert-success">
                    <strong>Valor da Integral:</strong> ${integral.toFixed(8)}<br>
                    <strong>Número de pontos:</strong> ${n}<br>
                    <strong>Grau exato para polinômios:</strong> ${2*n-1}
                </div>
            `;
            
            // Exibir informações sobre os pontos e pesos
            let pointsHtml = `
                <div class="alert alert-info">
                    <h5><i class="fas fa-table me-2"></i>Pontos e Pesos Usados</h5>
                    <div class="table-responsive">
                        <table class="table table-sm table-borderless text-light">
                            <thead>
                                <tr>
                                    <th>Ponto (xᵢ)</th>
                                    <th>Peso (wᵢ)</th>
                                    <th>f(xᵢ)</th>
                                </tr>
                            </thead>
                            <tbody>
            `;
            
            for (let i = 0; i < n; i++) {
                const xTransformed = 0.5*(b-a)*points[i] + 0.5*(a+b);
                pointsHtml += `
                    <tr>
                        <td>${xTransformed.toFixed(6)}</td>
                        <td>${weights[i].toFixed(6)}</td>
                        <td>${f(xTransformed).toExponential(6)}</td>
                    </tr>
                `;
            }
            
            pointsHtml += `
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
            
            pointsInfoDiv.innerHTML = pointsHtml;
            
            // Exibir comparação com outros métodos
            let comparisonHtml = `
                <h5 class="text-light mt-4 mb-3">Comparação com Outros Métodos</h5>
                <div class="table-responsive">
                    <table class="table table-dark table-striped table-hover">
                        <thead>
                            <tr>
                                <th>Método</th>
                                <th>Integral</th>
                                <th>Avaliações de f(x)</th>
                                <th>Erro Relativo</th>
                            </tr>
                        </thead>
                        <tbody>
            `;
            
            // Resultado de referência (usando quadratura de maior ordem disponível - n=6)
            const reference = gaussQuadrature(f, a, b, 6).integral;
            
            // Gauss
            comparisonHtml += `
                <tr class="table-primary">
                    <td>Gauss (n=${n})</td>
                    <td>${integral.toFixed(8)}</td>
                    <td>${n}</td>
                    <td>${Math.abs((integral - reference)/reference).toExponential(4)}</td>
                </tr>
            `;
            
            // Trapézio (n+1 pontos para comparação justa)
            const trapezoidResult = trapezoidalRule(f, a, b, n).integral;
            comparisonHtml += `
                <tr>
                    <td>Trapézio (n=${n+1})</td>
                    <td>${trapezoidResult.toFixed(8)}</td>
                    <td>${n+1}</td>
                    <td>${Math.abs((trapezoidResult - reference)/reference).toExponential(4)}</td>
                </tr>
            `;
            
            // Simpson (n+1 pontos, n deve ser ímpar)
            if (n >= 2) {
                const simpsonResult = simpsonsRule(f, a, b, n).integral;
                comparisonHtml += `
                    <tr>
                        <td>Simpson (n=${n+1})</td>
                        <td>${simpsonResult.toFixed(8)}</td>
                        <td>${n+1}</td>
                        <td>${Math.abs((simpsonResult - reference)/reference).toExponential(4)}</td>
                    </tr>
                `;
            }
            
            comparisonHtml += `
                        </tbody>
                    </table>
                </div>
                <p class="text-muted">* Erro relativo calculado em relação a uma quadratura de Gauss com 6 pontos</p>
            `;
            
            comparisonResultsDiv.innerHTML = comparisonHtml;
        } catch (error) {
            resultsDiv.innerHTML = `<div class="alert alert-danger">Erro: ${error.message}</div>`;
            pointsInfoDiv.innerHTML = '';
            comparisonResultsDiv.innerHTML = '';
        }
    });
});

// Pontos e pesos pré-computados para quadraturas de Gauss-Legendre (n=1 a 6)
const GAUSS_LEGENDRE = {
    1: {
        points: [0],
        weights: [2]
    },
    2: {
        points: [-0.5773502691896257, 0.5773502691896257],
        weights: [1, 1]
    },
    3: {
        points: [-0.7745966692414834, 0, 0.7745966692414834],
        weights: [0.5555555555555556, 0.8888888888888888, 0.5555555555555556]
    },
    4: {
        points: [-0.8611363115940526, -0.3399810435848563, 0.3399810435848563, 0.8611363115940526],
        weights: [0.3478548451374538, 0.6521451548625461, 0.6521451548625461, 0.3478548451374538]
    },
    5: {
        points: [-0.9061798459386640, -0.5384693101056831, 0, 0.5384693101056831, 0.9061798459386640],
        weights: [0.2369268850561891, 0.4786286704993665, 0.5688888888888889, 0.4786286704993665, 0.2369268850561891]
    },
    6: {
        points: [-0.9324695142031521, -0.6612093864662645, -0.2386191860831969, 
                 0.2386191860831969, 0.6612093864662645, 0.9324695142031521],
        weights: [0.1713244923791704, 0.3607615730481386, 0.4679139345726910,
                  0.4679139345726910, 0.3607615730481386, 0.1713244923791704]
    }
};

function gaussQuadrature(f, a, b, n) {
    if (!GAUSS_LEGENDRE[n]) {
        throw new Error(`Número de pontos não suportado: ${n}. Use n entre 1 e 6.`);
    }
    
    const {points, weights} = GAUSS_LEGENDRE[n];
    let sum = 0;
    
    for (let i = 0; i < n; i++) {
        // Transformar do intervalo [-1,1] para [a,b]
        const xTransformed = 0.5*(b-a)*points[i] + 0.5*(a+b);
        sum += weights[i] * f(xTransformed);
    }
    
    const integral = 0.5*(b-a) * sum;
    return {integral, points, weights};
}

// Funções auxiliares para comparação
function trapezoidalRule(f, a, b, n) {
    const h = (b - a) / n;
    let sum = 0.5 * (f(a) + f(b));
    
    for (let i = 1; i < n; i++) {
        sum += f(a + i * h);
    }
    
    return {integral: h * sum};
}

function simpsonsRule(f, a, b, n) {
    if (n % 2 !== 0) n++; // Garantir que n é par
    
    const h = (b - a) / n;
    let sum = f(a) + f(b);
    
    for (let i = 1; i < n; i++) {
        const x = a + i * h;
        sum += (i % 2 === 0) ? 2 * f(x) : 4 * f(x);
    }
    
    return {integral: (h / 3) * sum};
}