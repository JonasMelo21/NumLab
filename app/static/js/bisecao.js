document.addEventListener('DOMContentLoaded', function() {
    const calculateBtn = document.getElementById('calculate-btn');
    const resultsDiv = document.getElementById('results');
    const iterationsDiv = document.getElementById('iterations');
    const iterationsTableBody = document.getElementById('iterationsTableBody');
    const iterationsModal = new bootstrap.Modal(document.getElementById('iterationsModal'));

    calculateBtn.addEventListener('click', function() {
        // Obter valores dos inputs
        const funcStr = document.getElementById('function-input').value;
        const a = parseFloat(document.getElementById('a-input').value);
        const b = parseFloat(document.getElementById('b-input').value);
        const tol = parseFloat(document.getElementById('tol-input').value);
        const maxIter = parseInt(document.getElementById('maxiter-input').value);

        // Validar entradas
        if (isNaN(a) || isNaN(b) || isNaN(tol) || isNaN(maxIter)) {
            resultsDiv.innerHTML = '<div class="alert alert-danger">Por favor, insira valores válidos.</div>';
            return;
        }

        try {
            // Criar função a partir da string
            const f = (x) => math.evaluate(funcStr, {x: x});

            // Executar método da bisseção
            const {root, iterations, message} = bissecaoMethod(f, a, b, tol, maxIter);

            // Exibir resultados
            if (root !== null) {
                resultsDiv.innerHTML = `
                    <div class="alert alert-success">
                        <strong>Raiz encontrada:</strong> ${root.toFixed(8)}<br>
                        <strong>Iterações:</strong> ${iterations.length}<br>
                        <strong>f(x):</strong> ${f(root).toExponential(4)}<br>
                        <button class="btn btn-sm btn-outline-light mt-2" id="showIterationsBtn">
                            <i class="fas fa-history me-1"></i> Ver Histórico de Iterações
                        </button>
                    </div>
                `;

                // Preencher tabela de iterações
                iterationsTableBody.innerHTML = '';
                iterations.forEach((iter, idx) => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${idx + 1}</td>
                        <td>${iter.a.toFixed(6)}</td>
                        <td>${iter.b.toFixed(6)}</td>
                        <td>${iter.c.toFixed(6)}</td>
                        <td>${iter.fc.toExponential(4)}</td>
                        <td>${iter.error.toExponential(4)}</td>
                    `;
                    iterationsTableBody.appendChild(row);
                });

                // Botão para mostrar o modal
                document.getElementById('showIterationsBtn').addEventListener('click', function() {
                    iterationsModal.show();
                });
            } else {
                resultsDiv.innerHTML = `<div class="alert alert-warning">${message}</div>`;
            }
        } catch (error) {
            resultsDiv.innerHTML = `<div class="alert alert-danger">Erro: ${error.message}</div>`;
        }
    });
});

function bissecaoMethod(f, a, b, tol, maxIter) {
    if (f(a) * f(b) >= 0) {
        throw new Error("A função deve ter sinais opostos em a e b");
    }

    let iterations = [];
    let message = '';
    let iter = 0;
    
    while ((b - a)/2 > tol && iter < maxIter) {
        const c = (a + b)/2;
        const fc = f(c);
        const error = (b - a)/2;
        
        // Armazenar dados da iteração
        iterations.push({
            a: a,
            b: b,
            c: c,
            fc: fc,
            error: error
        });

        if (fc === 0 || Math.abs(fc) < tol) {
            message = `Convergência alcançada após ${iter + 1} iterações.`;
            return {root: c, iterations, message};
        }

        if (f(a) * fc < 0) {
            b = c;
        } else {
            a = c;
        }

        iter++;
    }

    message = iter === maxIter ? 
        `Máximo de iterações (${maxIter}) alcançado sem convergência.` :
        `Convergência alcançada após ${iter} iterações.`;
    
    return {root: (a + b)/2, iterations, message};
}