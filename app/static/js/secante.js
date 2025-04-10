document.addEventListener('DOMContentLoaded', function() {
    const calculateBtn = document.getElementById('calculate-btn');
    const resultsDiv = document.getElementById('results');
    const iterationsDiv = document.getElementById('iterations');

    calculateBtn.addEventListener('click', function() {
        // Obter valores dos inputs
        const funcStr = document.getElementById('function-input').value;
        const x0 = parseFloat(document.getElementById('x0-input').value);
        const x1 = parseFloat(document.getElementById('x1-input').value);
        const tol = parseFloat(document.getElementById('tol-input').value);
        const maxIter = parseInt(document.getElementById('maxiter-input').value);

        // Validar entradas
        if (isNaN(x0) || isNaN(x1) || isNaN(tol) || isNaN(maxIter)) {
            resultsDiv.innerHTML = '<div class="alert alert-danger">Por favor, insira valores válidos.</div>';
            return;
        }

        try {
            // Criar função a partir da string
            const f = (x) => math.evaluate(funcStr, {x: x});

            // Executar método da secante
            const {root, iterations, message} = secanteMethod(f, x0, x1, tol, maxIter);

            // Exibir resultados
            if (root !== null) {
                resultsDiv.innerHTML = `
                    <div class="alert alert-success">
                        <strong>Raiz encontrada:</strong> ${root.toFixed(8)}<br>
                        <strong>Iterações:</strong> ${iterations.length}<br>
                        <strong>f(x):</strong> ${f(root).toExponential(4)}<br>
                        <strong>Erro final:</strong> ${iterations.length > 1 ? 
                            Math.abs(iterations[iterations.length-1].x - iterations[iterations.length-2].x).toExponential(4) : 'N/A'}
                    </div>
                `;
                
                // Exibir tabela de iterações
                let tableHtml = `
                    <h5 class="text-light mt-4 mb-3">Detalhes das Iterações</h5>
                    <div class="table-responsive">
                        <table class="table table-dark table-striped table-hover">
                            <thead>
                                <tr>
                                    <th>Iteração</th>
                                    <th>x</th>
                                    <th>f(x)</th>
                                    <th>Erro</th>
                                    <th>Taxa Converg.</th>
                                </tr>
                            </thead>
                            <tbody>
                `;
                
                iterations.forEach((iter, idx) => {
                    const error = idx > 0 ? Math.abs(iter.x - iterations[idx-1].x) : '-';
                    const convRate = idx > 1 ? 
                        (Math.abs(iter.x - iterations[idx-1].x) / Math.abs(iterations[idx-1].x - iterations[idx-2].x)).toFixed(4) : '-';
                    
                    tableHtml += `
                        <tr>
                            <td>${idx}</td>
                            <td>${iter.x.toFixed(8)}</td>
                            <td>${iter.fx.toExponential(6)}</td>
                            <td>${error !== '-' ? error.toExponential(6) : error}</td>
                            <td>${convRate}</td>
                        </tr>
                    `;
                });
                
                tableHtml += `
                            </tbody>
                        </table>
                    </div>
                `;
                
                iterationsDiv.innerHTML = tableHtml;
            } else {
                resultsDiv.innerHTML = `<div class="alert alert-warning">${message}</div>`;
                iterationsDiv.innerHTML = '';
            }
        } catch (error) {
            resultsDiv.innerHTML = `<div class="alert alert-danger">Erro: ${error.message}</div>`;
            iterationsDiv.innerHTML = '';
        }
    });
});

function secanteMethod(f, x0, x1, tol, maxIter) {
    let iterations = [];
    let message = '';
    
    // Primeira iteração (x0)
    iterations.push({x: x0, fx: f(x0)});
    
    // Segunda iteração (x1)
    iterations.push({x: x1, fx: f(x1)});
    
    for (let i = 2; i <= maxIter; i++) {
        const xn = iterations[i-1].x;
        const xn_1 = iterations[i-2].x;
        const fxn = iterations[i-1].fx;
        const fxn_1 = iterations[i-2].fx;
        
        // Verificar convergência
        if (Math.abs(fxn) < tol) {
            message = `Convergência alcançada após ${i} iterações.`;
            return {root: xn, iterations, message};
        }
        
        // Calcular derivada aproximada
        const df = (fxn - fxn_1) / (xn - xn_1);
        
        if (Math.abs(df) < 1e-10) {
            message = `Derivada aproximada muito pequena na iteração ${i}.`;
            return {root: null, iterations, message};
        }
        
        // Calcular novo x
        const xNew = xn - fxn / df;
        
        // Armazenar nova iteração
        iterations.push({x: xNew, fx: f(xNew)});
        
        // Verificar convergência pelo erro
        if (Math.abs(xNew - xn) < tol) {
            message = `Convergência alcançada após ${i} iterações.`;
            return {root: xNew, iterations, message};
        }
    }
    
    message = `Máximo de iterações (${maxIter}) alcançado sem convergência.`;
    return {root: iterations[iterations.length-1].x, iterations, message};
}