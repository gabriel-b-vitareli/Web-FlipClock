# 🕰️ Web Flip Clock

Clique [aqui](https://gabriel-b-vitareli.github.io/relogio-digital/) para acessar o site do relógio.

Este é um projeto de relógio digital com efeito **Flip** (folheado), inspirado nos clássicos relógios analógicos de aeroportos e estações de trem. Ele utiliza transições 3D para criar uma experiência visual fluida e moderna.

---

## 🚀 Tecnologias Utilizadas

O projeto foi construído utilizando o "trio de ferro" do desenvolvimento web:

* ![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white) **HTML5**: Estruturação semântica dos containers de tempo.
* ![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white) **CSS3**: Estilização, variáveis globais e animações de rotação 3D (`preserve-3d` e `rotateX`).
* ![JavaScript](https://img.shields.io/badge/javascript-%23F7DF1E.svg?style=for-the-badge&logo=javascript&logoColor=black) **JavaScript**: Lógica de atualização em tempo real, manipulação do DOM e controle dos ciclos de animação.

---

## 🛠️ Como Funciona?

O funcionamento do código é dividido em três camadas principais:

### 1. Estrutura Dinâmica
O arquivo **HTML** fornece apenas os containers principais (`#h`, `#m`, `#s`). O **JavaScript** entra em ação criando dinamicamente os "cards" (cartões) para cada dígito através da função `buildUnit`, injetando as metades superior e inferior que compõem o visual.

### 2. O Efeito de "Corte" (CSS)
Para criar a ilusão de que o número está dividido ao meio, o **CSS** utiliza:
* **Overflow Hidden**: Essencial para esconder a metade do número que não deve aparecer em cada parte do card.
* **Posicionamento Absoluto**: O `span` que contém o número é deslocado negativamente nas metades inferiores para exibir apenas a parte de baixo.
* **3D Perspective**: Adicionado ao container `.card` para que a rotação pareça realista.

### 3. Sincronização do Tempo
A função `tick()` no **JavaScript**:
* Captura a hora atual do sistema através do objeto `new Date()`.
* Compara o tempo atual com o objeto `state` (estado anterior).
* Se um dígito mudou, a função `flipDigit` é acionada para executar a transição de rotação.

---

## 📂 Estrutura de Arquivos

```text
Relógio/
├── index.html       # Estrutura principal e importação de fontes.
├── css/
│   └── style.css    # Variáveis, animações 3D e layout Flexbox.
└── js/
    └── script.js    # Lógica do relógio e geração de elementos.
```

## 🎨 Personalização
Você pode alterar facilmente o visual editando as Variáveis CSS no topo do arquivo style.css:

```CSS
:root {
  --bg: #0e0e0e;      /* Cor de fundo da página */
  --card: #1a1a1a;    /* Cor da metade superior do card */
  --text: #f0f0f0;    /* Cor dos números */
}
```

Nota: Este projeto foi otimizado para navegadores modernos que suportam transformações 3D e propriedades de flexbox.

## 🛜 Navegadores com Suporte:

### 💻 Navegadores para Computadores:

- Google Chrome: (Versão 36+ para Flexbox, 12+ para 3D)
- Mozilla Firefox: (Versão 22+ para Flexbox, 10+ para 3D)
- Microsoft Edge: (Versão 12+ para ambos)
- Safari (Desktop e iOS): (Suporte robusto desde versões antigas)
- Opera: (Versão 15+ para ambos) 

### 📱 Navegadores Mobile:

- Android Browser: Versões 4.4+
- Chrome para Android: Suporte total
- Safari no iOS: Suporte total

## Metas Futuras:

Com o projeto em andamento, mais funcionalidades serão adicionadas com o tempo. No momento, as metas de funções a serem adicionadas são as seguintes:

- [X] Relógio de Horas, Minutos e Segundos em tempo real.
- [X] Data em tempo real.
- [X] Cronômetro.
- [X] Temporizador.
- [ ] Temas (Para o usuário poder selecionar entre diferentes cores de fundo, imagens de fundo, fontes do relógio, estilo do relógio, etc).
- [ ] Diferentes linguagens.
