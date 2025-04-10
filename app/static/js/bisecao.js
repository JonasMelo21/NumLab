document.getElementById("calculate-btn").addEventListener("click", function () {
    const funcInput = document.getElementById("function-input").value;
    const aInput = parseFloat(document.getElementById("a-input").value);
    const bInput = parseFloat(document.getElementById("b-input").value);
    const tolInput = parseFloat(document.getElementById("tol-input").value);
    const maxIterInput = parseInt(document.getElementById("maxiter-input").value);

    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";

    // Substitui ** por ^ para compatibilidade com math.js
    const fixedFuncStr = funcInput.replace(/\*\*/g, "^");

    let f;
    try {
        f = math.compile(fixedFuncStr);
    } catch (err) {
        resultsDiv.innerHTML = `<div class="alert alert-danger">Erro na função: ${err.message}</div>`;
        return;
    }

    function evaluate(x) {
        try {
            return f.evaluate({ x: x });
        } catch (err) {
            resultsDiv.innerHTML = `<div class="alert alert-danger">Erro ao avaliar f(${x}): ${err.message}</div>`;
            throw err;
        }
    }

    function bissecao(f, a, b, tol, maxIter) {
        const steps = [];
        if (evaluate(a) * evaluate(b) >= 0) {
            throw new Error("f(a) e f(b) devem ter sinais opostos.");
        }

        let iter = 0;
        while ((b - a) / 2 > tol && iter < maxIter) {
            const c = (a + b) / 2;
            const fc = evaluate(c);
            steps.push({ iter, a, b, c, fc });

            if (Math.abs(fc) < tol) {
                return { root: c, iterations: iter, steps };
            }

            if (evaluate(a) * fc < 0) {
                b = c;
            } else {
                a = c;
            }

            iter++;
        }

        const finalC = (a + b) / 2;
        return { root: finalC, iterations: iter, steps };
    }

    try {
        const result = bissecao(f, aInput, bInput, tolInput, maxIterInput);

        resultsDiv.innerHTML = `
            <div class="alert alert-success">
                <strong>Raiz aproximada:</strong> ${result.root.toFixed(10)}<br>
                <strong>Iterações:</strong> ${result.iterations}
            </div>
        `;
    } catch (error) {
        resultsDiv.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
    }
});
