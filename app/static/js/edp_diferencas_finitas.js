document.addEventListener('DOMContentLoaded', function() {
    const equationType = document.getElementById('equation-type');
    const calculateBtn = document.getElementById('calculate-btn');
    const resultsDiv = document.getElementById('results');
    const stabilityInfo = document.getElementById('stability-info');
    const stabilityMessage = document.getElementById('stability-message');

    calculateBtn.addEventListener('click', function() {
        const type = equationType.value;
        const alpha = parseFloat(document.getElementById('alpha-input').value);
        const dx = parseFloat(document.getElementById('dx-input').value);
        const dt = parseFloat(document.getElementById('dt-input').value);
        const steps = parseInt(document.getElementById('steps-input').value);
        const initialCondition = document.getElementById('initial-condition').value;

        // Verifica estabilidade para equação do calor
        if (type === 'heat') {
            const r = alpha * dt / (dx * dx);
            if (r > 0.5) {
                stabilityMessage.textContent = `Condição de estabilidade violada (r = ${r.toFixed(3)} > 0.5). Resultados podem ser instáveis.`;
                stabilityInfo.classList.remove('d-none');
            } else {
                stabilityInfo.classList.add('d-none');
            }
        }

        try {
            let solution;
            switch(type) {
                case 'heat':
                    solution = solveHeatEquation(alpha, dx, dt, steps, initialCondition);
                    break;
                case 'wave':
                    solution = solveWaveEquation(alpha, dx, dt, steps, initialCondition);
                    break;
                case 'laplace':
                    solution = solveLaplaceEquation(dx, steps, initialCondition);
                    break;
            }

            displayResults(solution, type);
        } catch (error) {
            resultsDiv.innerHTML = `<div class="alert alert-danger">Erro: ${error.message}</div>`;
            console.error(error);
        }
    });

    function solveHeatEquation(alpha, dx, dt, steps, initialCondition) {
        const L = 1; // Comprimento do domínio
        const nx = Math.floor(L / dx) + 1;
        const x = Array.from({length: nx}, (_, i) => i * dx);
        
        // Condição inicial
        let u = new Array(nx).fill(0);
        switch(initialCondition) {
            case 'pulse':
                u[Math.floor(nx/2)] = 1;
                break;
            case 'sin':
                u = x.map(xi => Math.sin(Math.PI * xi / L));
                break;
            case 'gaussian':
                const center = L/2;
                const sigma = 0.1;
                u = x.map(xi => Math.exp(-Math.pow(xi - center, 2) / (2 * sigma * sigma)));
                break;
        }
        
        const r = alpha * dt / (dx * dx);
        const solutions = [u.slice()];
        
        // Solução explícita
        for (let n = 0; n < steps; n++) {
            const newU = new Array(nx).fill(0);
            
            // Condições de contorno (Dirichlet)
            newU[0] = 0;
            newU[nx-1] = 0;
            
            for (let i = 1; i < nx-1; i++) {
                newU[i] = u[i] + r * (u[i+1] - 2*u[i] + u[i-1]);
            }
            
            solutions.push(newU.slice());
            u = newU;
        }
        
        return {
            x,
            t: Array.from({length: steps+1}, (_, i) => i * dt),
            u: solutions
        };
    }

    function solveWaveEquation(alpha, dx, dt, steps, initialCondition) {
        const L = 1;
        const nx = Math.floor(L / dx) + 1;
        const x = Array.from({length: nx}, (_, i) => i * dx);
        
        // Condição inicial
        let u = new Array(nx).fill(0);
        let uPrev = new Array(nx).fill(0);
        
        switch(initialCondition) {
            case 'pulse':
                u[Math.floor(nx/2)] = 1;
                break;
            case 'sin':
                u = x.map(xi => Math.sin(Math.PI * xi / L));
                uPrev = u.map(ui => ui);
                break;
            case 'gaussian':
                const center = L/2;
                const sigma = 0.1;
                u = x.map(xi => Math.exp(-Math.pow(xi - center, 2) / (2 * sigma * sigma)));
                uPrev = u.map(ui => ui);
                break;
        }
        
        const c = alpha; // Velocidade da onda
        const r = c * dt / dx;
        const solutions = [u.slice()];
        
        // Primeiro passo (usando condição inicial para derivada temporal)
        const uNext = new Array(nx).fill(0);
        for (let i = 1; i < nx-1; i++) {
            uNext[i] = u[i] + 0.5 * r * r * (u[i+1] - 2*u[i] + u[i-1]);
        }
        solutions.push(uNext.slice());
        
        // Passos subsequentes
        for (let n = 1; n < steps; n++) {
            const newU = new Array(nx).fill(0);
            
            // Condições de contorno (Dirichlet)
            newU[0] = 0;
            newU[nx-1] = 0;
            
            for (let i = 1; i < nx-1; i++) {
                newU[i] = 2*u[i] - uPrev[i] + r * r * (u[i+1] - 2*u[i] + u[i-1]);
            }
            
            solutions.push(newU.slice());
            uPrev = u.slice();
            u = newU.slice();
        }
        
        return {
            x,
            t: Array.from({length: steps+1}, (_, i) => i * dt),
            u: solutions
        };
    }

    function solveLaplaceEquation(dx, steps, initialCondition) {
        const L = 1;
        const nx = Math.floor(L / dx) + 1;
        const x = Array.from({length: nx}, (_, i) => i * dx);
        const y = Array.from({length: nx}, (_, i) => i * dx);
        
        // Inicializa a matriz de solução
        let u = Array.from({length: nx}, () => new Array(nx).fill(0));
        
        // Condições de contorno
        switch(initialCondition) {
            case 'pulse':
                // Bordas a 0, exceto centro da borda superior
                for (let i = 0; i < nx; i++) {
                    u[0][i] = 0;           // Borda inferior
                    u[nx-1][i] = i === Math.floor(nx/2) ? 1 : 0; // Borda superior
                    u[i][0] = 0;           // Borda esquerda
                    u[i][nx-1] = 0;        // Borda direita
                }
                break;
            case 'sin':
                // Bordas sinusoidais
                for (let i = 0; i < nx; i++) {
                    u[0][i] = Math.sin(2 * Math.PI * x[i] / L); // Borda inferior
                    u[nx-1][i] = 0;                            // Borda superior
                    u[i][0] = 0;                               // Borda esquerda
                    u[i][nx-1] = 0;                            // Borda direita
                }
                break;
            case 'gaussian':
                // Bordas com pulso gaussiano no centro
                const center = L/2;
                const sigma = 0.1;
                for (let i = 0; i < nx; i++) {
                    u[0][i] = 0;
                    u[nx-1][i] = Math.exp(-Math.pow(x[i] - center, 2) / (2 * sigma * sigma));
                    u[i][0] = 0;
                    u[i][nx-1] = 0;
                }
                break;
        }
        
        // Solução por relaxação
        for (let iter = 0; iter < steps; iter++) {
            const newU = Array.from({length: nx}, (_, i) => u[i].slice());
            
            for (let i = 1; i < nx-1; i++) {
                for (let j = 1; j < nx-1; j++) {
                    newU[i][j] = 0.25 * (u[i+1][j] + u[i-1][j] + u[i][j+1] + u[i][j-1]);
                }
            }
            
            u = newU;
        }
        
        return {
            x,
            y,
            u
        };
    }

    function displayResults(solution, type) {
        if (type === 'laplace') {
            // Plot 2D para equação de Laplace
            const plotDiv = document.createElement('div');
            plotDiv.id = 'solution-plot';
            resultsDiv.innerHTML = '';
            resultsDiv.appendChild(plotDiv);
            
            const data = {
                x: solution.x,
                y: solution.y,
                z: solution.u,
                type: 'contour'
            };
            
            Plotly.newPlot('solution-plot', [data], {
                title: 'Solução da Equação de Laplace',
                xaxis: {title: 'x'},
                yaxis: {title: 'y'}
            });
        } else {
            // Plot 3D para equações de calor e onda
            const plotDiv = document.createElement('div');
            plotDiv.id = 'solution-plot';
            resultsDiv.innerHTML = '';
            resultsDiv.appendChild(plotDiv);
            
            const frames = [];
            for (let n = 0; n < solution.u.length; n += Math.max(1, Math.floor(solution.u.length/20))) {
                frames.push({
                    name: `frame${n}`,
                    data: [{
                        x: solution.x,
                        y: solution.u[n],
                        type: 'scatter',
                        mode: 'lines'
                    }]
                });
            }
            
            Plotly.newPlot('solution-plot', [{
                x: solution.x,
                y: solution.u[0],
                type: 'scatter',
                mode: 'lines',
                line: {color: '#1f77b4', width: 2}
            }], {
                title: `Solução da ${type === 'heat' ? 'Equação do Calor' : 'Equação da Onda'}`,
                xaxis: {title: 'Posição (x)'},
                yaxis: {title: 'u(x,t)', range: [0, 1.1]},
                updatemenus: [{
                    buttons: [{
                        method: 'animate',
                        args: [null, {
                            frame: {duration: 50, redraw: false},
                            fromcurrent: true,
                            transition: {duration: 0}
                        }],
                        label: 'Play'
                    }, {
                        method: 'animate',
                        args: [[null], {
                            frame: {duration: 0, redraw: false},
                            mode: 'immediate',
                            transition: {duration: 0}
                        }],
                        label: 'Pause'
                    }]
                }]
            }).then(function() {
                Plotly.addFrames('solution-plot', frames);
            });
        }
    }
});