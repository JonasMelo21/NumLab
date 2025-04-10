document.addEventListener('DOMContentLoaded', function() {
    const calculateBtn = document.getElementById('calculate-btn');
    const resultsDiv = document.getElementById('results');
    const iterationsDiv = document.getElementById('iterations');

    calculateBtn.addEventListener('click', function() {
        // Obter valores dos inputs
        const funcStr = document.getElementById('function-input').value;
        const x0 = parseFloat(document.getElementById('x0-input').value);
        const x1 = parseFloat(document.getElementById('x1-input').value);
        const x2 = parseFloat(document.getElementById('x2-input').value);
        const tol = parseFloat(document.getElementById('tol-input').value);
        const maxIter = parseInt(document.getElementById('maxiter-input').value);

        // Validar entradas
        if (isNaN(x0) || isNaN(x1) || isNaN(x2) || isNaN(tol) || isNaN(maxIter)) {
            resultsDiv.innerHTML = '<div class="alert alert-danger">Por favor, insira valores válidos.</div>';
            return;
        }

        try {
            // Criar função a partir da string
            const f = (x) => math.evaluate(funcStr, {x: x});

            // Executar método de Müller
            const {root, iterations, message} = mullerMethod(f, x0, x1, x2, tol, maxIter);

            // Exibir resultados
            if (root !== null) {
                const isComplex = math.typeOf(root) === 'Complex';
                const rootStr = isComplex ? 
                    `${math.format(root.re, {precision: 6})} + ${math.format(root.im, {precision: 6})}i` : 
                    math.format(root, {precision: 8});
                
                resultsDiv.innerHTML = `
                    <div class="alert alert-success">
                        <strong>Raiz encontrada:</strong> ${rootStr}<br>
                        <strong>Iterações:</strong> ${iterations.length}<br>
                        <strong>f(x):</strong> ${math.format(f(root), {notation: 'exponential', precision: 4})}<br>
                        <strong>Tipo:</strong> ${isComplex ? 'Complexa' : 'Real'}
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
                                </tr>
                            </thead>
                            <tbody>
                `;
                
                iterations.forEach((iter, idx) => {
                    const xStr = math.typeOf(iter.x) === 'Complex' ? 
                        `${math.format(iter.x.re, 6)} + ${math.format(iter.x.im, 6)}i` : 
                        math.format(iter.x, 6);
                    
                    const error = idx > 0 ? math.abs(math.subtract(iter.x, iterations[idx-1].x)) : '-';
                    const errorStr = error !== '-' ? math.format(error, {notation: 'exponential', precision: 4}) : error;
                    
                    tableHtml += `
                        <tr>
                            <td>${idx}</td>
                            <td>${xStr}</td>
                            <td>${math.format(iter.fx, {notation: 'exponential', precision: 4})}</td>
                            <td>${errorStr}</td>
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
            console.error(error);
        }
    });
});

function mullerMethod(f, x0, x1, x2, tol, maxIter) {
    let iterations = [];
    let message = '';
    
    // Função para formatar número complexo
    const formatComplex = (x) => {
        if (math.typeOf(x) === 'Complex') {
            return `${math.format(x.re, 6)} + ${math.format(x.im, 6)}i`;
        }
        return math.format(x, 6);
    };
    
    // Adicionar pontos iniciais
    iterations.push({x: x0, fx: f(x0)});
    iterations.push({x: x1, fx: f(x1)});
    iterations.push({x: x2, fx: f(x2)});
    
    for (let i = 3; i <= maxIter + 2; i++) {
        const xn0 = iterations[i-3].x;
        const xn1 = iterations[i-2].x;
        const xn2 = iterations[i-1].x;
        
        const fn0 = iterations[i-3].fx;
        const fn1 = iterations[i-2].fx;
        const fn2 = iterations[i-1].fx;
        
        // Calcular diferenças divididas
        const h0 = math.subtract(xn1, xn0);
        const h1 = math.subtract(xn2, xn1);
        
        const δ0 = math.divide(math.subtract(fn1, fn0), h0);
        const δ1 = math.divide(math.subtract(fn2, fn1), h1);
        
        // Coeficientes da parábola
        const a = math.divide(math.subtract(δ1, δ0), math.add(h1, h0));
        const b = math.add(math.multiply(a, h1), δ1);
        const c = fn2;
        
        // Calcular discriminante
        const discriminant = math.sqrt(math.subtract(math.pow(b, 2), math.multiply(4, a, c)));
        
        // Escolher denominador para minimizar erro de cancelamento
        let denominator;
        if (math.abs(math.add(b, discriminant)) > math.abs(math.subtract(b, discriminant))) {
            denominator = math.add(b, discriminant);
        } else {
            denominator = math.subtract(b, discriminant);
        }
        
        // Calcular nova aproximação
        const xNew = math.subtract(xn2, math.divide(math.multiply(2, c), denominator));
        
        // Avaliar função no novo ponto
        const fxNew = f(xNew);
        
        // Armazenar iteração
        iterations.push({x: xNew, fx: fxNew});
        
        // Verificar convergência
        const error = math.abs(math.subtract(xNew, xn2));
        if (error < tol) {
            message = `Convergência alcançada após ${i-2} iterações.`;
            return {root: xNew, iterations, message};
        }
        
        // Verificar se a função é próxima de zero
        if (math.abs(fxNew) < tol) {
            message = `f(x) ≈ 0 alcançado após ${i-2} iterações.`;
            return {root: xNew, iterations, message};
        }
    }
    
    message = `Máximo de iterações (${maxIter}) alcançado sem convergência.`;
    return {root: iterations[iterations.length-1].x, iterations, message};
}