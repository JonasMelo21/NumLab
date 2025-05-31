document.addEventListener('DOMContentLoaded', function() {
    console.log("Script carregado!"); // Verificação inicial

    const basisType = document.getElementById('basis-type');
    const spectralEquation = document.getElementById('spectral-equation');
    const calculateBtn = document.getElementById('calculate-btn');
    const resultsDiv = document.getElementById('results');
    const convergencePlot = document.getElementById('convergence-plot');
    const sourceTermGroup = document.getElementById('source-term-group');
    const alphaGroup = document.getElementById('alpha-group');

    // Verifica se todos elementos foram encontrados
    if (!basisType || !spectralEquation || !calculateBtn || !resultsDiv) {
        console.error("Elementos essenciais não encontrados!");
        return;
    }

    // Mostrar/ocultar parâmetros específicos
    spectralEquation.addEventListener('change', function() {
        try {
            if (this.value === 'poisson') {
                sourceTermGroup.classList.remove('d-none');
                alphaGroup.classList.add('d-none');
            } else {
                sourceTermGroup.classList.add('d-none');
                alphaGroup.classList.remove('d-none');
            }
        } catch (error) {
            console.error("Erro ao mudar parâmetros:", error);
        }
    });

    calculateBtn.addEventListener('click', function() {
        console.log("Botão Resolver clicado!"); // Verificação
        
        try {
            const basis = basisType.value;
            const N = parseInt(document.getElementById('modes-input').value);
            const equationType = spectralEquation.value;
            
            console.log(`Parâmetros: basis=${basis}, N=${N}, equation=${equationType}`);

            // Validação básica
            if (isNaN(N) || N < 4) {
                throw new Error("Número de modos inválido. Use N ≥ 4");
            }

            let solution;
            switch(equationType) {
                case 'poisson':
                    const f = document.getElementById('source-term').value;
                    if (!f) throw new Error("Termo fonte não especificado");
                    solution = solveSpectralPoisson(basis, N, f);
                    break;
                case 'heat':
                    const alpha = parseFloat(document.getElementById('alpha-input').value);
                    if (isNaN(alpha)) throw new Error("Coeficiente α inválido");
                    solution = solveSpectralHeat(basis, N, alpha);
                    break;
                case 'wave':
                    solution = solveSpectralWave(basis, N);
                    break;
                default:
                    throw new Error("Tipo de equação desconhecido");
            }
            
            displayResults(solution, equationType, basis);
            plotConvergence(basis);
            
        } catch (error) {
            console.error("Erro durante o cálculo:", error);
            resultsDiv.innerHTML = `<div class="alert alert-danger">
                <i class="fas fa-exclamation-triangle me-2"></i>
                <strong>Erro:</strong> ${error.message}
            </div>`;
        }
    });

    function chebyshevPoints(N) {
        return Array.from({length: N+1}, (_, i) => Math.cos(i * Math.PI / N));
    }

    function chebyshevDiffMatrix(N) {
        try {
            const x = chebyshevPoints(N);
            const D = math.zeros(N+1, N+1).toArray();
            const c = x.map((_, i) => i === 0 || i === N ? 2 : 1);
            
            for (let i = 0; i <= N; i++) {
                for (let j = 0; j <= N; j++) {
                    if (i === j) {
                        if (i === 0) D[i][j] = (2*N*N + 1)/6;
                        else if (i === N) D[i][j] = -(2*N*N + 1)/6;
                        else D[i][j] = -x[i]/(2*(1 - x[i]*x[i]));
                    } else {
                        D[i][j] = (c[i]/c[j]) * Math.pow(-1, i+j) / (x[i] - x[j]);
                    }
                }
            }
            
            return D;
        } catch (error) {
            console.error("Erro ao criar matriz de diferenciação:", error);
            throw new Error("Falha ao construir matriz de diferenciação");
        }
    }

    function solveSpectralPoisson(basis, N, fStr) {
        console.log(`Resolvendo Poisson com ${N} modos...`);
        
        if (basis !== 'chebyshev') {
            throw new Error("Implementação disponível apenas para base de Chebyshev");
        }
        
        try {
            const x = chebyshevPoints(N);
            const D = chebyshevDiffMatrix(N);
            
            // Matriz de segunda derivada
            const D2 = math.multiply(D, D);
            
            // Aplica condições de contorno
            const D2_int = D2.slice(1, -1).map(row => row.slice(1, -1));
            
            // Avalia termo fonte
            const f = x.slice(1, -1).map(xi => {
                try {
                    return math.evaluate(fStr, {x: xi, pi: Math.PI});
                } catch (e) {
                    throw new Error(`Erro ao avaliar termo fonte em x=${xi}: ${e.message}`);
                }
            });
            
            // Resolve sistema
            const u_int = math.lusolve(D2_int, f).flat();
            const u = [0, ...u_int, 0];
            
            console.log("Solução calculada com sucesso!");
            return {x, u};
            
        } catch (error) {
            console.error("Erro em solveSpectralPoisson:", error);
            throw new Error(`Falha ao resolver equação de Poisson: ${error.message}`);
        }
    }

    function solveSpectralHeat(basis, N, alpha) {
        // Implementação simplificada
        return {
            message: "Simulação de equação do calor não implementada nesta demonstração"
        };
    }

    function solveSpectralWave(basis, N) {
        // Implementação simplificada
        return {
            message: "Simulação de equação de onda não implementada nesta demonstração"
        };
    }

    function displayResults(solution, equationType, basis) {
        try {
            if (equationType === 'poisson' && solution.x && solution.u) {
                let html = `<div class="alert alert-success">
                    <h5><i class="fas fa-check-circle me-2"></i>Solução para ${basis} (N=${solution.x.length-1})</h5>
                    <div id="solution-plot" style="height: 300px;"></div>`;
                
                resultsDiv.innerHTML = html;
                
                Plotly.newPlot('solution-plot', [{
                    x: solution.x,
                    y: solution.u,
                    type: 'scatter',
                    mode: 'lines+markers',
                    line: {color: '#1f77b4', width: 2}
                }], {
                    title: 'Solução Numérica',
                    xaxis: {title: 'x'},
                    yaxis: {title: 'u(x)'}
                });
                
            } else if (solution.message) {
                resultsDiv.innerHTML = `<div class="alert alert-info">${solution.message}</div>`;
            } else {
                throw new Error("Formato de solução desconhecido");
            }
        } catch (error) {
            console.error("Erro ao exibir resultados:", error);
            resultsDiv.innerHTML = `<div class="alert alert-danger">
                Erro ao exibir resultados: ${error.message}
            </div>`;
        }
    }

    function plotConvergence(basis) {
        try {
            const Nvalues = [4, 8, 16, 32, 64];
            const error = Nvalues.map(N => Math.exp(-0.5*N));
            
            Plotly.newPlot('convergence-plot', [{
                x: Nvalues,
                y: error,
                type: 'scatter',
                mode: 'lines+markers'
            }], {
                title: 'Convergência Espectral',
                xaxis: {title: 'Número de modos (N)'},
                yaxis: {title: 'Erro (simulado)', type: 'log'}
            });
        } catch (error) {
            console.error("Erro ao plotar convergência:", error);
        }
    }

    // Inicialização
    console.log("Métodos Espectrais inicializado!");
});