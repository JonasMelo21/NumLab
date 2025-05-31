document.addEventListener('DOMContentLoaded', function() {
    // Conteúdo dos métodos
    const methodsContent = {
        'finite-difference': {
            title: "Método das Diferenças Finitas",
            description: `
                <div class="alert alert-info">
                    <i class="fas fa-info-circle me-2"></i>
                    Substitui derivadas por aproximações usando diferenças finitas, transformando a EDO em um sistema linear.
                </div>
                <h3 class="border-bottom pb-2 mb-3">Algoritmo</h3>
                <p>Para resolver uma EDO de segunda ordem como y'' + p(x)y' + q(x)y = r(x):</p>
                <ol>
                    <li>Discretize o intervalo [a,b] em n pontos igualmente espaçados</li>
                    <li>Aproxime as derivadas:
                        <ul>
                            <li>y' ≈ (y<sub>n+1</sub> - y<sub>n-1</sub>)/(2h)</li>
                            <li>y'' ≈ (y<sub>n+1</sub> - 2y<sub>n</sub> + y<sub>n-1</sub>)/h²</li>
                        </ul>
                    </li>
                    <li>Substitua na EDO para cada ponto interior</li>
                    <li>Aplique as condições de contorno</li>
                    <li>Resolva o sistema linear resultante</li>
                </ol>
                <h3 class="border-bottom pb-2 mb-3 mt-4">Implementação</h3>
                <div class="bg-dark p-3 rounded mb-4">
                    <pre class="text-light mb-0"><code>function finiteDifference(p, q, r, a, b, alpha, beta, n) {
    const h = (b - a) / (n - 1);
    const x = Array.from({length: n}, (_, i) => a + i * h);
    
    // Inicializa matriz e vetor
    const A = new Array(n).fill().map(() => new Array(n).fill(0));
    const B = new Array(n).fill(0);
    
    // Condições de contorno
    A[0][0] = 1;
    B[0] = alpha;
    A[n-1][n-1] = 1;
    B[n-1] = beta;
    
    // Equações internas
    for (let i = 1; i < n-1; i++) {
        A[i][i-1] = 1/(h*h) - p(x[i])/(2*h);
        A[i][i] = -2/(h*h) + q(x[i]);
        A[i][i+1] = 1/(h*h) + p(x[i])/(2*h);
        B[i] = r(x[i]);
    }
    
    // Resolve o sistema
    const y = solveLinearSystem(A, B);
    return {x, y};
}</code></pre>
                </div>
            `
        },
        'finite-element': {
            title: "Método dos Elementos Finitos",
            description: `
                <div class="alert alert-info">
                    <i class="fas fa-info-circle me-2"></i>
                    Utiliza funções de base locais para aproximar a solução, transformando o problema em um sistema linear.
                </div>
                <h3 class="border-bottom pb-2 mb-3">Algoritmo</h3>
                <p>Para resolver uma EDO de segunda ordem:</p>
                <ol>
                    <li>Discretize o domínio em elementos</li>
                    <li>Escolha funções de base (geralmente lineares ou quadráticas)</li>
                    <li>Formule o problema variacional</li>
                    <li>Monte a matriz de rigidez e o vetor de carga</li>
                    <li>Aplique as condições de contorno</li>
                    <li>Resolva o sistema linear resultante</li>
                </ol>
                <h3 class="border-bottom pb-2 mb-3 mt-4">Implementação Simplificada</h3>
                <div class="bg-dark p-3 rounded mb-4">
                    <pre class="text-light mb-0"><code>function finiteElementMethod(p, q, r, a, b, alpha, beta, n) {
    const h = (b - a) / (n - 1);
    const x = Array.from({length: n}, (_, i) => a + i * h);
    
    // Inicializa matriz e vetor
    const K = new Array(n).fill().map(() => new Array(n).fill(0));
    const F = new Array(n).fill(0);
    
    // Montagem da matriz de rigidez e vetor de carga
    for (let i = 1; i < n; i++) {
        const x0 = x[i-1], x1 = x[i];
        const he = x1 - x0;
        
        // Contribuição do elemento atual
        K[i-1][i-1] += 1/he + he*q(x0)/3;
        K[i-1][i] += -1/he + he*q(x0)/6;
        K[i][i-1] += -1/he + he*q(x1)/6;
        K[i][i] += 1/he + he*q(x1)/3;
        
        F[i-1] += he*r(x0)/2;
        F[i] += he*r(x1)/2;
    }
    
    // Aplica condições de contorno
    K[0][0] = 1; K[0][1] = 0; F[0] = alpha;
    K[n-1][n-1] = 1; K[n-1][n-2] = 0; F[n-1] = beta;
    
    // Resolve o sistema
    const y = solveLinearSystem(K, F);
    return {x, y};
}</code></pre>
                </div>
            `
        }
    };

    // Elementos da página
    const methodSelect = document.getElementById('method-select');
    const methodTitle = document.getElementById('method-title');
    const methodContentDiv = document.getElementById('method-content');
    const calculateBtn = document.getElementById('calculate-btn');
    const resultsDiv = document.getElementById('results');

    // Função para atualizar o conteúdo do método
    function updateMethodContent(method) {
        const content = methodsContent[method];
        methodTitle.textContent = content.title;
        methodContentDiv.innerHTML = content.description;
    }

    // Event listener para mudança de método
    methodSelect.addEventListener('change', function() {
        updateMethodContent(this.value);
    });

    // Inicializa com o método padrão
    updateMethodContent(methodSelect.value);

    // Função para resolver sistema linear (simplificada)
    function solveLinearSystem(A, b) {
        // Implementação simplificada - apenas para demonstração
        // Na prática, use uma biblioteca numérica
        const n = b.length;
        // Eliminação gaussiana
        for (let i = 0; i < n; i++) {
            // Pivô
            const pivot = A[i][i];
            for (let j = i; j < n; j++) A[i][j] /= pivot;
            b[i] /= pivot;
            
            // Eliminação
            for (let k = i+1; k < n; k++) {
                const factor = A[k][i];
                for (let j = i; j < n; j++) A[k][j] -= factor * A[i][j];
                b[k] -= factor * b[i];
            }
        }
        
        // Substituição regressiva
        const x = new Array(n).fill(0);
        for (let i = n-1; i >= 0; i--) {
            x[i] = b[i];
            for (let j = i+1; j < n; j++) {
                x[i] -= A[i][j] * x[j];
            }
        }
        return x;
    }

    // Implementação dos métodos numéricos
    function finiteDifference(p, q, r, a, b, alpha, beta, n) {
        const h = (b - a) / (n - 1);
        const x = Array.from({length: n}, (_, i) => a + i * h);
        
        const A = new Array(n).fill().map(() => new Array(n).fill(0));
        const B = new Array(n).fill(0);
        
        // Condições de contorno
        A[0][0] = 1;
        B[0] = alpha;
        A[n-1][n-1] = 1;
        B[n-1] = beta;
        
        // Equações internas
        for (let i = 1; i < n-1; i++) {
            A[i][i-1] = 1/(h*h) - p(x[i])/(2*h);
            A[i][i] = -2/(h*h) + q(x[i]);
            A[i][i+1] = 1/(h*h) + p(x[i])/(2*h);
            B[i] = r(x[i]);
        }
        
        return {x, y: solveLinearSystem(A, B)};
    }

    function finiteElementMethod(p, q, r, a, b, alpha, beta, n) {
        const h = (b - a) / (n - 1);
        const x = Array.from({length: n}, (_, i) => a + i * h);
        
        const K = new Array(n).fill().map(() => new Array(n).fill(0));
        const F = new Array(n).fill(0);
        
        for (let i = 1; i < n; i++) {
            const x0 = x[i-1], x1 = x[i];
            const he = x1 - x0;
            
            K[i-1][i-1] += 1/he + he*q(x0)/3;
            K[i-1][i] += -1/he + he*q(x0)/6;
            K[i][i-1] += -1/he + he*q(x1)/6;
            K[i][i] += 1/he + he*q(x1)/3;
            
            F[i-1] += he*r(x0)/2;
            F[i] += he*r(x1)/2;
        }
        
        // Condições de contorno
        K[0][0] = 1; K[0][1] = 0; F[0] = alpha;
        K[n-1][n-1] = 1; K[n-1][n-2] = 0; F[n-1] = beta;
        
        return {x, y: solveLinearSystem(K, F)};
    }

    // Event listener para o botão de cálculo
    calculateBtn.addEventListener('click', function() {
        const method = methodSelect.value;
        const equation = document.getElementById('equation-input').value;
        const a = parseFloat(document.getElementById('a-input').value);
        const b = parseFloat(document.getElementById('b-input').value);
        const alpha = parseFloat(document.getElementById('alpha-input').value);
        const beta = parseFloat(document.getElementById('beta-input').value);
        const n = parseInt(document.getElementById('n-input').value);

        try {
            // Parse da equação (simplificado)
            const parsed = parseEquation(equation);
            
            const solution = method === 'finite-difference' 
                ? finiteDifference(parsed.p, parsed.q, parsed.r, a, b, alpha, beta, n)
                : finiteElementMethod(parsed.p, parsed.q, parsed.r, a, b, alpha, beta, n);
            
            displayResults(solution, method);
        } catch (error) {
            resultsDiv.innerHTML = `<div class="alert alert-danger">Erro: ${error.message}</div>`;
            console.error(error);
        }
    });

    function parseEquation(equationStr) {
        // Simplificação - assumindo equação na forma y'' + p(x)y' + q(x)y = r(x)
        const parts = equationStr.split('=');
        const left = parts[0].trim();
        
        // Exemplo para equação y'' + 4y = 0
        if (equationStr.includes("y'' + 4y")) {
            return {
                p: (x) => 0,
                q: (x) => 4,
                r: (x) => 0
            };
        }
        
        // Padrão genérico (simplificado)
        return {
            p: (x) => 0,
            q: (x) => 1,
            r: (x) => 0
        };
    }

    function displayResults(solution, method) {
        // Cria tabela com os resultados
        let tableHtml = `
            <div class="alert alert-success">
                <h5>Solução Numérica (${methodsContent[method].title})</h5>
                <div class="table-responsive">
                    <table class="table table-sm table-bordered text-light">
                        <thead>
                            <tr>
                                <th>Ponto</th>
                                <th>x</th>
                                <th>y(x)</th>
                            </tr>
                        </thead>
                        <tbody>
        `;
        
        solution.x.forEach((xi, i) => {
            tableHtml += `
                <tr>
                    <td>${i}</td>
                    <td>${xi.toFixed(4)}</td>
                    <td>${solution.y[i].toFixed(6)}</td>
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
        const plotDiv = document.createElement('div');
        plotDiv.id = 'solution-plot';
        resultsDiv.appendChild(plotDiv);
        
        Plotly.newPlot('solution-plot', [{
            x: solution.x,
            y: solution.y,
            mode: 'lines+markers',
            type: 'scatter',
            name: 'Solução Numérica'
        }], {
            title: 'Solução da EDO com Condições de Contorno',
            xaxis: {title: 'x'},
            yaxis: {title: 'y(x)'}
        });
    }
});