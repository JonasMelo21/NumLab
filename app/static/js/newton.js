document.addEventListener('DOMContentLoaded', function() {
    const calculateBtn = document.getElementById('calculate-btn');
    const resultsDiv = document.getElementById('results');
    const iterationsDiv = document.getElementById('iterations');

    calculateBtn.addEventListener('click', function() {
        // Obter valores dos inputs
        const funcStr = document.getElementById('function-input').value;
        const derivStr = document.getElementById('derivative-input').value;
        const x0 = parseFloat(document.getElementById('x0-input').value);
        const tol = parseFloat(document.getElementById('tol-input').value);
        const maxIter = parseInt(document.getElementById('maxiter-input').value);

        // Validar entradas
        if (isNaN(x0) || isNaN(tol) || isNaN(maxIter)) {
            resultsDiv.innerHTML = '<div class="alert alert-danger">Por favor, insira valores válidos.</div>';
            return;
        }

        try {
            // Criar funções a partir das strings
            const f = (x) => math.evaluate(funcStr, {x: x});
            const df = (x) => math.evaluate(derivStr, {x: x});

            // Executar método de Newton
            const {root, iterations, message} = newtonMethod(f, df, x0, tol, maxIter);

            // Exibir resultados
            if (root !== null) {
                resultsDiv.innerHTML = `
                <div class="alert alert-success">
                    <strong>Raiz encontrada:</strong> ${root.toFixed(8)}<br>
                    <strong>Número de iterações:</strong> ${iterations.length}<br>
                    <strong>f(x):</strong> ${f(root).toExponential(4)}
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
                                    <th>f'(x)</th>
                                    <th>Erro</th>
                                </tr>
                            </thead>
                            <tbody>
                `;
                
                iterations.forEach((iter, idx) => {
                    tableHtml += `
                        <tr>
                            <td>${idx}</td>
                            <td>${iter.x.toFixed(8)}</td>
                            <td>${iter.fx.toExponential(6)}</td>
                            <td>${iter.dfx.toExponential(6)}</td>
                            <td>${idx > 0 ? Math.abs(iter.x - iterations[idx-1].x).toExponential(6) : '-'}</td>
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

function newtonMethod(f, df, x0, tol, maxIter) {
    let x = x0;
    let iterations = [];
    let message = '';
    
    for (let i = 0; i < maxIter; i++) {
        const fx = f(x);
        const dfx = df(x);
        
        // Armazenar dados da iteração
        iterations.push({x, fx, dfx});
        
        // Verificar convergência
        if (Math.abs(fx) < tol) {
            message = `Convergência alcançada após ${i+1} iterações.`;
            return {root: x, iterations, message};
        }
        
        // Verificar derivada zero
        if (dfx === 0) {
            message = `Derivada zero encontrada na iteração ${i+1}.`;
            return {root: null, iterations, message};
        }
        
        // Calcular próximo x
        const xNew = x - fx / dfx;
        
        // Verificar convergência pelo erro
        if (Math.abs(xNew - x) < tol) {
            iterations.push({x: xNew, fx: f(xNew), dfx: df(xNew)});
            message = `Convergência alcançada após ${i+1} iterações.`;
            return {root: xNew, iterations, message};
        }
        
        x = xNew;
    }
    
    message = `Máximo de iterações (${maxIter}) alcançado sem convergência.`;
    return {root: x, iterations, message};
}