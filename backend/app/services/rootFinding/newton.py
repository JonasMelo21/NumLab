import sympy as sp

eq = input("Digite a equação: ")
print(eq)
print(sp.sympify(eq))

print(eq == sp.simplify(eq))