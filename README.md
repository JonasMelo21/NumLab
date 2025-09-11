
```
NumLab
├─ README.md
├─ backend
│  ├─ app
│  │  ├─ __init__.py
│  │  ├─ __pycache__
│  │  │  ├─ __init__.cpython-313.pyc
│  │  │  └─ main.cpython-313.pyc
│  │  ├─ api
│  │  │  ├─ __init__.py
│  │  │  ├─ __pycache__
│  │  │  │  └─ __init__.cpython-313.pyc
│  │  │  ├─ routers
│  │  │  │  ├─ __init__.py
│  │  │  │  ├─ __pycache__
│  │  │  │  │  ├─ __init__.cpython-313.pyc
│  │  │  │  │  ├─ animations.cpython-313.pyc
│  │  │  │  │  └─ root_finding.cpython-313.pyc
│  │  │  │  ├─ animations.py
│  │  │  │  └─ root_finding.py
│  │  │  └─ schemas
│  │  │     ├─ __init__.py
│  │  │     ├─ __pycache__
│  │  │     │  ├─ __init__.cpython-313.pyc
│  │  │     │  ├─ animations.cpython-313.pyc
│  │  │     │  └─ root_finding.cpython-313.pyc
│  │  │     ├─ animations.py
│  │  │     └─ root_finding.py
│  │  ├─ main.py
│  │  ├─ media
│  │  │  └─ animations
│  │  │     └─ newton_972fe7506a4e4420b72af252df004b7ad267e377.mp4
│  │  └─ services
│  │     ├─ animations
│  │     │  ├─ __init__.py
│  │     │  ├─ __pycache__
│  │     │  │  ├─ __init__.cpython-313.pyc
│  │     │  │  ├─ newton_anim.cpython-313.pyc
│  │     │  │  └─ utils.cpython-313.pyc
│  │     │  ├─ newton_anim.py
│  │     │  └─ utils.py
│  │     └─ rootFinding
│  │        ├─ __init__.py
│  │        ├─ __pycache__
│  │        │  ├─ __init__.cpython-313.pyc
│  │        │  ├─ bisection.cpython-313.pyc
│  │        │  ├─ muller.cpython-313.pyc
│  │        │  ├─ newton.cpython-313.pyc
│  │        │  └─ secant.cpython-313.pyc
│  │        ├─ bisection.py
│  │        ├─ muller.py
│  │        ├─ newton.py
│  │        └─ secant.py
│  ├─ media
│  │  └─ videos
│  │     └─ 1080p60
│  │        ├─ NewtonScene.mp4
│  │        └─ partial_movie_files
│  │           └─ NewtonScene
│  │              ├─ 2852726489_1121873893_288049839.mp4
│  │              ├─ 2852726489_1330478031_2745993707.mp4
│  │              ├─ 2852726489_1503166646_723781143.mp4
│  │              ├─ 2852726489_1558848115_3530104714.mp4
│  │              ├─ 2852726489_2166783919_2258751637.mp4
│  │              ├─ 2852726489_2266878640_2983048214.mp4
│  │              ├─ 2852726489_2297410101_883564186.mp4
│  │              ├─ 2852726489_2572222260_3001179627.mp4
│  │              ├─ 2852726489_2579215482_3822852380.mp4
│  │              ├─ 2852726489_2698258729_4211838674.mp4
│  │              ├─ 2852726489_2949676138_3592216945.mp4
│  │              ├─ 2852726489_3117156166_2316298733.mp4
│  │              ├─ 2852726489_3392407244_3262042695.mp4
│  │              ├─ 2852726489_3501512112_3972621471.mp4
│  │              ├─ 2852726489_3516965167_1686669346.mp4
│  │              ├─ 2852726489_3593470018_2842492926.mp4
│  │              ├─ 2852726489_3659241139_2191441477.mp4
│  │              ├─ 2852726489_421143107_364078340.mp4
│  │              ├─ 2852726489_542898307_2021009981.mp4
│  │              ├─ 2852726489_609459381_2407112736.mp4
│  │              ├─ 2852726489_671919876_375626774.mp4
│  │              ├─ 2852726489_807188262_1605401971.mp4
│  │              ├─ 3977891868_2807086086_223132457.mp4
│  │              └─ partial_movie_file_list.txt
│  └─ requirements.txt
├─ frontend
│  ├─ .env.development
│  ├─ README.md
│  ├─ eslint.config.js
│  ├─ index.html
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ postcss.config.cjs
│  ├─ public
│  │  └─ faviconNumLab.png
│  ├─ setup_rf_arch.sh
│  ├─ src
│  │  ├─ App.css
│  │  ├─ App.tsx
│  │  ├─ app
│  │  │  ├─ AppShell.tsx
│  │  │  ├─ i18n
│  │  │  │  └─ LangProvider.tsx
│  │  │  └─ router.tsx
│  │  ├─ assets
│  │  │  └─ react.svg
│  │  ├─ components
│  │  │  ├─ common
│  │  │  │  └─ MethodCard.tsx
│  │  │  ├─ layout
│  │  │  │  ├─ Footer.tsx
│  │  │  │  └─ Navbar.tsx
│  │  │  └─ ui
│  │  │     ├─ button.tsx
│  │  │     ├─ card.tsx
│  │  │     ├─ input.tsx
│  │  │     ├─ label.tsx
│  │  │     ├─ separator.tsx
│  │  │     └─ table.tsx
│  │  ├─ index.css
│  │  ├─ layouts
│  │  │  └─ SiteLayout.tsx
│  │  ├─ lib
│  │  │  ├─ animations.ts
│  │  │  └─ api.ts
│  │  ├─ main.tsx
│  │  ├─ pages
│  │  │  ├─ home
│  │  │  │  ├─ HomePage.tsx
│  │  │  │  └─ components
│  │  │  │     ├─ HomeHero.tsx
│  │  │  │     └─ MainContent.tsx
│  │  │  └─ root-finding
│  │  │     ├─ RootFindingPage.tsx
│  │  │     └─ components
│  │  │        ├─ ComparisonSection.tsx
│  │  │        ├─ MathKeyboard.tsx
│  │  │        ├─ MethodContent.tsx
│  │  │        ├─ MethodSelector.tsx
│  │  │        ├─ NewtonAnimation.tsx
│  │  │        ├─ RootFindingContent.tsx
│  │  │        └─ RootFindingHero.tsx
│  │  ├─ styles
│  │  │  ├─ components.css
│  │  │  └─ global.css
│  │  └─ vite-env.d.ts
│  ├─ tsconfig.app.json
│  ├─ tsconfig.json
│  ├─ tsconfig.node.json
│  └─ vite.config.ts
├─ run_linux.sh
└─ run_windows.sh

```