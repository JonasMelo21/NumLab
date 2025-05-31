document.addEventListener('DOMContentLoaded', function() {
    const problemType = document.getElementById('problem-type');
    const calculateBtn = document.getElementById('calculate-btn');
    const resultsDiv = document.getElementById('results');
    const meshVisualization = document.getElementById('mesh-visualization');
    const poissonParams = document.getElementById('poisson-params');
    const heatParams = document.getElementById('heat-params');

    // Mostrar/ocultar parâmetros específicos do problema
    problemType.addEventListener('change', function() {
        if (this.value === 'poisson') {
            poissonParams.classList.remove('d-none');
            heatParams.classList.add('d-none');
        } else if (this.value === 'heat') {
            poissonParams.classList.add('d-none');
            heatParams.classList.remove('d-none');
        } else {
            poissonParams.classList.add('d-none');
            heatParams.classList.add('d-none');
        }
    });

    calculateBtn.addEventListener('click', function() {
        const type = problemType.value;
        const numElements = parseInt(document.getElementById('elements-input').value);
        const bcType = document.getElementById('boundary-condition').value;

        try {
            let solution;
            switch(type) {
                case 'poisson':
                    const sourceTerm = document.getElementById('source-term').value;
                    solution = solvePoisson1D(numElements, sourceTerm, bcType);
                    break;
                case 'heat':
                    const conductivity = parseFloat(document.getElementById('conductivity').value);
                    solution = solveHeat2D(numElements, conductivity, bcType);
                    break;
                case 'elasticity':
                    solution = solveElasticity2D(numElements, bcType);
                    break;
            }

            displayResults(solution, type);
            visualizeMesh(numElements, type);
        } catch (error) {
            resultsDiv.innerHTML = `<div class="alert alert-danger">Erro: ${error.message}</div>`;
            console.error(error);
        }
    });

    function solvePoisson1D(numElements, sourceTerm, bcType) {
        const L = 1; // Comprimento do domínio
        const h = L / numElements;
        const nodes = Array.from({length: numElements + 1}, (_, i) => i * h);
        
        // Inicializa matriz global e vetor de carga
        const K = new Array(numElements + 1).fill().map(() => new Array(numElements + 1).fill(0));
        const F = new Array(numElements + 1).fill(0);
        
        // Montagem da matriz de rigidez e vetor de carga
        for (let e = 0; e < numElements; e++) {
            // Matriz de rigidez elementar
            const Ke = [[1/h, -1/h], [-1/h, 1/h]];
            
            // Vetor de carga elementar
            const fe = [h/2, h/2].map(val => {
                const x = nodes[e] + h/2; // Ponto médio do elemento
                const scope = {x};
                return val * math.evaluate(sourceTerm, scope);
            });
            
            // Montagem global
            for (let i = 0; i < 2; i++) {
                const gi = e + i;
                F[gi] += fe[i];
                for (let j = 0; j < 2; j++) {
                    const gj = e + j;
                    K[gi][gj] += Ke[i][j];
                }
            }
        }
        
        // Aplicação das condições de contorno
        if (bcType === 'dirichlet' || bcType === 'mixed') {
            // Dirichlet à esquerda (u(0) = 0)
            K[0][0] = 1; K[0][1] = 0;
            F[0] = 0;
            
            if (bcType === 'dirichlet') {
                // Dirichlet à direita (u(L) = 0)
                K[numElements][numElements] = 1; K[numElements][numElements-1] = 0;
                F[numElements] = 0;
            }
        }
        
        // Resolve o sistema
        const u = solveLinearSystem(K, F);
        
        return {
            nodes,
            solution: u,
            stiffnessMatrix: K,
            loadVector: F
        };
    }

    function solveHeat2D(numElements, conductivity, bcType) {
        // Implementação simplificada para 2D
        // Neste exemplo, usaremos uma malha estruturada quadrada
        
        const nx = numElements;
        const ny = numElements;
        const Lx = 1;
        const Ly = 1;
        const hx = Lx / nx;
        const hy = Ly / ny;
        
        const numNodes = (nx + 1) * (ny + 1);
        const K = new Array(numNodes).fill().map(() => new Array(numNodes).fill(0));
        const F = new Array(numNodes).fill(0);
        
        // Coordenadas dos nós
        const nodes = [];
        for (let j = 0; j <= ny; j++) {
            for (let i = 0; i <= nx; i++) {
                nodes.push({x: i * hx, y: j * hy});
            }
        }
        
        // Para simplificar, vamos pular a montagem completa da matriz 2D
        // e apenas retornar uma solução de exemplo
        const u = nodes.map((node, i) => {
            return Math.sin(Math.PI * node.x) * Math.sin(Math.PI * node.y);
        });
        
        return {
            nodes,
            solution: u,
            nx,
            ny
        };
    }

    function solveElasticity2D(numElements, bcType) {
        // Implementação simplificada - apenas para demonstração
        return {
            message: "Solução de elasticidade linear 2D - Implementação não disponível nesta demonstração"
        };
    }

    function solveLinearSystem(A, b) {
        // Implementação simplificada - na prática use uma biblioteca numérica
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

    function displayResults(solution, type) {
        if (type === 'poisson') {
            let tableHtml = `
                <div class="alert alert-success">
                    <h5>Solução da Equação de Poisson 1D</h5>
                    <div class="table-responsive">
                        <table class="table table-sm table-bordered">
                            <thead>
                                <tr>
                                    <th>Nó</th>
                                    <th>Posição (x)</th>
                                    <th>Valor (u)</th>
                                </tr>
                            </thead>
                            <tbody>
            `;
            
            solution.nodes.forEach((node, i) => {
                tableHtml += `
                    <tr>
                        <td>${i}</td>
                        <td>${node.toFixed(4)}</td>
                        <td>${solution.solution[i].toFixed(6)}</td>
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
            
            // Plot da solução
            const plotDiv = document.createElement('div');
            plotDiv.id = 'solution-plot';
            resultsDiv.appendChild(plotDiv);
            
            Plotly.newPlot('solution-plot', [{
                x: solution.nodes,
                y: solution.solution,
                type: 'scatter',
                mode: 'lines+markers',
                line: {color: '#1f77b4', width: 2}
            }], {
                title: 'Solução da Equação de Poisson',
                xaxis: {title: 'Posição (x)'},
                yaxis: {title: 'u(x)'}
            });
            
        } else if (type === 'heat') {
            // Visualização 2D para transferência de calor
            const plotDiv = document.createElement('div');
            plotDiv.id = 'solution-plot';
            resultsDiv.innerHTML = '';
            resultsDiv.appendChild(plotDiv);
            
            // Prepara os dados para o plot de contorno
            const x = [], y = [], z = [];
            for (let j = 0; j <= solution.ny; j++) {
                const row = [];
                for (let i = 0; i <= solution.nx; i++) {
                    const idx = j * (solution.nx + 1) + i;
                    x.push(solution.nodes[idx].x);
                    y.push(solution.nodes[idx].y);
                    row.push(solution.solution[idx]);
                }
                z.push(row);
            }
            
            const data = {
                x: [...new Set(x)].sort((a,b) => a-b),
                y: [...new Set(y)].sort((a,b) => a-b),
                z: z,
                type: 'contour'
            };
            
            Plotly.newPlot('solution-plot', [data], {
                title: 'Distribuição de Temperatura',
                xaxis: {title: 'x'},
                yaxis: {title: 'y'}
            });
        } else {
            resultsDiv.innerHTML = `
                <div class="alert alert-info">
                    <i class="fas fa-info-circle me-2"></i>
                    ${solution.message}
                </div>
            `;
        }
    }

    function visualizeMesh(numElements, type) {
        if (type === 'poisson') {
            // Visualização simples para 1D
            meshVisualization.classList.add('d-none');
        } else {
            // Visualização da malha para 2D
            meshVisualization.classList.remove('d-none');
            
            const nx = type === 'heat' ? numElements : 2;
            const ny = type === 'heat' ? numElements : 2;
            
            // Gera coordenadas dos nós
            const nodes = [];
            for (let j = 0; j <= ny; j++) {
                for (let i = 0; i <= nx; i++) {
                    nodes.push({x: i/nx, y: j/ny});
                }
            }
            
            // Gera conectividade dos elementos
            const elements = [];
            for (let j = 0; j < ny; j++) {
                for (let i = 0; i < nx; i++) {
                    const n1 = j * (nx + 1) + i;
                    const n2 = j * (nx + 1) + i + 1;
                    const n3 = (j + 1) * (nx + 1) + i + 1;
                    const n4 = (j + 1) * (nx + 1) + i;
                    elements.push([n1, n2, n3, n4]);
                }
            }
            
            // Cria o plot da malha
            const traces = elements.map(el => {
                const x = [nodes[el[0]].x, nodes[el[1]].x, nodes[el[2]].x, nodes[el[3]].x, nodes[el[0]].x];
                const y = [nodes[el[0]].y, nodes[el[1]].y, nodes[el[2]].y, nodes[el[3]].y, nodes[el[0]].y];
                
                return {
                    x,
                    y,
                    mode: 'lines',
                    line: {color: '#888', width: 1},
                    type: 'scatter',
                    showlegend: false
                };
            });
            
            // Adiciona nós
            traces.push({
                x: nodes.map(n => n.x),
                y: nodes.map(n => n.y),
                mode: 'markers',
                marker: {color: '#1f77b4', size: 5},
                type: 'scatter',
                showlegend: false
            });
            
            Plotly.newPlot('mesh-plot', traces, {
                title: 'Malha de Elementos Finitos',
                xaxis: {scaleanchor: 'y'},
                yaxis: {scaleratio: 1}
            });
        }
    }
});