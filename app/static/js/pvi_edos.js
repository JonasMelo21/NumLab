document.addEventListener('DOMContentLoaded', function() {
    const methodSelect = document.getElementById('method-select');
    const calculateBtn = document.getElementById('calculate-btn');
    const resultsDiv = document.getElementById('results');
    const methodDescriptionDiv = document.getElementById('method-description');
    const methodTitle = document.getElementById('method-title');
    const methodContentDiv = document.getElementById('method-content');

    // Conteúdo dos métodos
    const methodsContent = {
        euler: {
            title: "Método de Euler",
            description: `
                <div class="alert alert-info">
                    <i class="fas fa-info-circle me-2"></i>
                    O método de Euler é o mais simples para resolver EDOs, mas possui baixa precisão.
                </div>
                <h3 class="border-bottom pb-2 mb-3">Algoritmo</h3>
                <p>Para resolver y' = f(x,y) com condição inicial y(x₀) = y₀:</p>
                <ol>
                    <li>Defina o passo h</li>
                    <li>Calcule yₙ₊₁ = yₙ + h·f(xₙ, yₙ)</li>
                    <li>Calcule xₙ₊₁ = xₙ + h</li>
                    <li>Repita até atingir o número desejado de pontos</li>
                </ol>
                <h3 class="border-bottom pb-2 mb-3 mt-4">Implementação</h3>
                <div class="bg-dark p-3 rounded mb-4">
                    <pre class="text-light mb-0"><code>function eulerMethod(f, x0, y0, h, numPoints) {
    const points = [{x: x0, y: y0}];
    
    for (let i = 1; i < numPoints; i++) {
        const prev = points[i-1];
        const yNext = prev.y + h * f(prev.x, prev.y);
        const xNext = prev.x + h;
        points.push({x: xNext, y: yNext});
    }
    
    return points;
}</code></pre>
                </div>
            `
        },
        'runge-kutta': {
            title: "Método de Runge-Kutta (4ª Ordem)",
            description: `
                <div class="alert alert-info">
                    <i class="fas fa-info-circle me-2"></i>
                    O método RK4 é muito mais preciso que Euler, com erro da ordem de h⁴.
                </div>
                <h3 class="border-bottom pb-2 mb-3">Algoritmo</h3>
                <p>Para resolver y' = f(x,y) com condição inicial y(x₀) = y₀:</p>
                <ol>
                    <li>Defina o passo h</li>
                    <li>Calcule:
                        <ul>
                            <li>k₁ = h·f(xₙ, yₙ)</li>
                            <li>k₂ = h·f(xₙ + h/2, yₙ + k₁/2)</li>
                            <li>k₃ = h·f(xₙ + h/2, yₙ + k₂/2)</li>
                            <li>k₄ = h·f(xₙ + h, yₙ + k₃)</li>
                        </ul>
                    </li>
                    <li>Calcule yₙ₊₁ = yₙ + (k₁ + 2k₂ + 2k₃ + k₄)/6</li>
                    <li>Repita até atingir o número desejado de pontos</li>
                </ol>
                <h3 class="border-bottom pb-2 mb-3 mt-4">Implementação</h3>
                <div class="bg-dark p-3 rounded mb-4">
                    <pre class="text-light mb-0"><code>function rungeKutta4(f, x0, y0, h, numPoints) {
    const points = [{x: x0, y: y0}];
    
    for (let i = 1; i < numPoints; i++) {
        const prev = points[i-1];
        const k1 = h * f(prev.x, prev.y);
        const k2 = h * f(prev.x + h/2, prev.y + k1/2);
        const k3 = h * f(prev.x + h/2, prev.y + k2/2);
        const k4 = h * f(prev.x + h, prev.y + k3);
        
        const yNext = prev.y + (k1 + 2*k2 + 2*k3 + k4)/6;
        points.push({x: prev.x + h, y: yNext});
    }
    
    return points;
}</code></pre>
                </div>
            `
        },
        'predictor-corrector': {
            title: "Método Preditor-Corretor (Adams-Bashforth-Moulton)",
            description: `
                <div class="alert alert-info">
                    <i class="fas fa-info-circle me-2"></i>
                    Combina um método explícito (preditor) com um implícito (corretor) para melhor precisão.
                </div>
                <h3 class="border-bottom pb-2 mb-3">Algoritmo</h3>
                <p>Usando Adams-Bashforth (4 passos) como preditor e Adams-Moulton (3 passos) como corretor:</p>
                <ol>
                    <li>Calcule os primeiros pontos com Runge-Kutta</li>
                    <li>Preditor (Adams-Bashforth):
                        <p>yₙ₊₁ᵖ = yₙ + h(55fₙ - 59fₙ₋₁ + 37fₙ₋₂ - 9fₙ₋₃)/24</p>
                    </li>
                    <li>Corretor (Adams-Moulton):
                        <p>yₙ₊₁ = yₙ + h(9fₙ₊₁ᵖ + 19fₙ - 5fₙ₋₁ + fₙ₋₂)/24</p>
                    </li>
                    <li>Repita até atingir o número desejado de pontos</li>
                </ol>
                <h3 class="border-bottom pb-2 mb-3 mt-4">Implementação</h3>
                <div class="bg-dark p-3 rounded mb-4">
                    <pre class="text-light mb-0"><code>function predictorCorrector(f, x0, y0, h, numPoints) {
    // Primeiros pontos com RK4
    let points = rungeKutta4(f, x0, y0, h, 4);
    
    for (let i = 4; i < numPoints; i++) {
        const [p3, p2, p1, p0] = points.slice(-4);
        
        // Preditor (Adams-Bashforth)
        const f0 = f(p0.x, p0.y);
        const f1 = f(p1.x, p1.y);
        const f2 = f(p2.x, p2.y);
        const f3 = f(p3.x, p3.y);
        
        const yPred = p0.y + h*(55*f0 - 59*f1 + 37*f2 - 9*f3)/24;
        const xNext = p0.x + h;
        
        // Corretor (Adams-Moulton)
        const fPred = f(xNext, yPred);
        const yCorr = p0.y + h*(9*fPred + 19*f0 - 5*f1 + f2)/24;
        
        points.push({x: xNext, y: yCorr});
    }
    
    return points;
}</code></pre>
                </div>
            `
        }
    };

    // Atualiza o conteúdo quando o método é alterado
    methodSelect.addEventListener('change', function() {
        updateMethodContent(this.value);
    });

    // Inicializa com o método padrão
    updateMethodContent(methodSelect.value);

    // Configura o botão de cálculo
    calculateBtn.addEventListener('click', function() {
        const method = methodSelect.value;
        const equation = document.getElementById('equation-input').value;
        const x0 = parseFloat(document.getElementById('x0-input').value);
        const y0 = parseFloat(document.getElementById('y0-input').value);
        const h = parseFloat(document.getElementById('step-input').value);
        const numPoints = parseInt(document.getElementById('points-input').value);

        try {
            // Cria a função a partir da string de equação
            const f = (x, y) => {
                const scope = {x, y};
                return math.evaluate(equation, scope);
            };

            let solution;
            switch(method) {
                case 'euler':
                    solution = eulerMethod(f, x0, y0, h, numPoints);
                    break;
                case 'runge-kutta':
                    solution = rungeKutta4(f, x0, y0, h, numPoints);
                    break;
                case 'predictor-corrector':
                    solution = predictorCorrector(f, x0, y0, h, numPoints);
                    break;
            }

            // Exibe os resultados
            displayResults(solution, method);
        } catch (error) {
            resultsDiv.innerHTML = `<div class="alert alert-danger">Erro: ${error.message}</div>`;
        }
    });

    function updateMethodContent(method) {
        const content = methodsContent[method];
        methodTitle.textContent = content.title;
        methodContentDiv.innerHTML = content.description;
    }

    function displayResults(points, method) {
        // Cria tabela com os resultados
        let tableHtml = `
            <div class="alert alert-success">
                <h5>Solução Numérica (${methodsContent[method].title})</h5>
                <div class="table-responsive">
                    <table class="table table-sm table-bordered text-light">
                        <thead>
                            <tr>
                                <th>Iteração</th>
                                <th>x</th>
                                <th>y(x)</th>
                            </tr>
                        </thead>
                        <tbody>
        `;
        
        points.forEach((point, i) => {
            tableHtml += `
                <tr>
                    <td>${i}</td>
                    <td>${point.x.toFixed(4)}</td>
                    <td>${point.y.toFixed(6)}</td>
                </tr>
            `;
        });
        
        tableHtml += `
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        
        resultsDiv.innerHTML = tableHtml;
        
        // Cria gráfico com Plotly
        const xValues = points.map(p => p.x);
        const yValues = points.map(p => p.y);
        
        const plotDiv = document.createElement('div');
        plotDiv.id = 'solution-plot';
        resultsDiv.appendChild(plotDiv);
        
        const trace = {
            x: xValues,
            y: yValues,
            mode: 'lines+markers',
            type: 'scatter',
            name: 'Solução Numérica'
        };
        
        Plotly.newPlot('solution-plot', [trace], {
            title: 'Solução da EDO',
            xaxis: {title: 'x'},
            yaxis: {title: 'y(x)'}
        });
    }

    // Implementações dos métodos numéricos
    function eulerMethod(f, x0, y0, h, numPoints) {
        const points = [{x: x0, y: y0}];
        
        for (let i = 1; i < numPoints; i++) {
            const prev = points[i-1];
            const yNext = prev.y + h * f(prev.x, prev.y);
            const xNext = prev.x + h;
            points.push({x: xNext, y: yNext});
        }
        
        return points;
    }

    function rungeKutta4(f, x0, y0, h, numPoints) {
        const points = [{x: x0, y: y0}];
        
        for (let i = 1; i < numPoints; i++) {
            const prev = points[i-1];
            const k1 = h * f(prev.x, prev.y);
            const k2 = h * f(prev.x + h/2, prev.y + k1/2);
            const k3 = h * f(prev.x + h/2, prev.y + k2/2);
            const k4 = h * f(prev.x + h, prev.y + k3);
            
            const yNext = prev.y + (k1 + 2*k2 + 2*k3 + k4)/6;
            points.push({x: prev.x + h, y: yNext});
        }
        
        return points;
    }

    function predictorCorrector(f, x0, y0, h, numPoints) {
        // Primeiros pontos com RK4
        let points = rungeKutta4(f, x0, y0, h, 4);
        
        for (let i = 4; i < numPoints; i++) {
            const [p3, p2, p1, p0] = points.slice(-4);
            
            // Preditor (Adams-Bashforth)
            const f0 = f(p0.x, p0.y);
            const f1 = f(p1.x, p1.y);
            const f2 = f(p2.x, p2.y);
            const f3 = f(p3.x, p3.y);
            
            const yPred = p0.y + h*(55*f0 - 59*f1 + 37*f2 - 9*f3)/24;
            const xNext = p0.x + h;
            
            // Corretor (Adams-Moulton)
            const fPred = f(xNext, yPred);
            const yCorr = p0.y + h*(9*fPred + 19*f0 - 5*f1 + f2)/24;
            
            points.push({x: xNext, y: yCorr});
        }
        
        return points;
    }
});