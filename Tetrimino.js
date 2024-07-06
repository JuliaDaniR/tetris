function crearMapeoBaseTetriminos() {
  tetriminosBase = {
    Z: {
      color: "red",
      mapa: [
        createVector(),
        createVector(-1, -1),
        createVector(0, -1),
        createVector(1, 0),
      ],
    },
    S: {
      color: "green",
      mapa: [
        createVector(),
        createVector(1, -1),
        createVector(0, -1),
        createVector(-1, 0),
      ],
    },
    J: {
      color: "orange",
      mapa: [
        createVector(),
        createVector(-1, 0),
        createVector(-1, -1),
        createVector(1, 0),
      ],
    },
    L: {
      color: "dodgerblue",
      mapa: [
        createVector(),
        createVector(-1, 0),
        createVector(1, -1),
        createVector(1, 0),
      ],
    },
    T: {
      color: "magenta",
      mapa: [
        createVector(),
        createVector(-1, 0),
        createVector(1, 0),
        createVector(0, -1),
      ],
    },
    O: {
      color: "yellow",
      mapa: [
        createVector(),
        createVector(0, -1),
        createVector(1, -1),
        createVector(1, 0),
      ],
    },
    I: {
      color: "cyan",
      mapa: [
        createVector(),
        createVector(-1, 0),
        createVector(1, 0),
        createVector(2, 0),
      ],
    },
  };
}

class Tetrimino {
  constructor(nombre = random(["Z", "S", "J", "L", "T", "O", "I"])) {
    this.nombre = nombre;
    let base = tetriminosBase[nombre];
    this.color = base.color;
    this.mapa = [];
    for (const pmino of base.mapa) {
      this.mapa.push(pmino.copy());
    }
    this.posicion = createVector(int(tablero.columnas / 2), 0);
  }

  moverDerecha() {
    this.posicion.x++;
    if (this.movimientoErroneo) {
      this.moverIzquierda();
    }
  }
  
  moverIzquierda() {
    this.posicion.x--;
    if (this.movimientoErroneo) {
      this.moverDerecha();
    }
  }
  
  moverArriba() {
    this.posicion.y--;
  }

  moverAbajo() {
    this.posicion.y++;
    if (this.movimientoErroneo) {
      this.moverArriba();
      if (tetrimino == this) {
        tablero.almacenarMinos = this;
        tetrimino = new Tetrimino();
      }
      return false;
    }
    return true;
  }

  ponerEnElFondo() {
    this.posicion = this.espectro.posicion;
    this.moverAbajo();
  }

  girar() {
    for (const pmino of this.mapa) {
      pmino.set(pmino.y, -pmino.x);
    }
    if (this.movimientoErroneo) {
      this.desgirar();
    }
  }

  desgirar() {
    for (const pmino of this.mapa) {
      pmino.set(-pmino.y, pmino.x);
    }
  }

  get movimientoErroneo() {
    let salioDelTablero = !this.estaDentroDelTablero;
    return salioDelTablero || this.colisionConMinosAlmacenados;
  }

  get colisionConMinosAlmacenados() {
    for (const pmino of this.mapaTablero) {
      if (tablero.minosAlmacenados[pmino.x][pmino.y]) {
        return true;
      }
    }

    return false;
  }

  get estaDentroDelTablero() {
    for (const pmino of this.mapaTablero) {
      if (pmino.x < 0) {
        return false;
      }
      if (pmino.x >= tablero.columnas) {
        return false;
      }
      if (pmino.y >= tablero.filas) {
        return false;
      }
    }
    return true;
  }

  get mapaTablero() {
    let retorno = [];
    for (const pmino of this.mapa) {
      let copy = pmino.copy().add(this.posicion);
      retorno.push(copy);
    }
    return retorno;
  }
  
  get mapaCanvas() {
    let retorno = [];
    for (const pmino of this.mapa) {
      let copy = pmino.copy().add(this.posicion);
      retorno.push(tablero.coordenada(copy.x, copy.y));
    }
    return retorno;
  }

  dibujar() {
    push();
    fill(this.color);
    for (let pmino of this.mapaCanvas) {
      Tetrimino.dibujarMino(pmino);
    }
    pop();
    if (tetrimino == this) {
      this.dibujarEspectro();
    }
  }

  dibujarEspectro() {
    this.espectro = new Tetrimino(this.nombre);
    this.espectro.posicion = this.posicion.copy();
    for (let i = 0; i < this.mapa.length; i++) {
      this.espectro.mapa[i] = this.mapa[i].copy();
    }
    while (this.espectro.moverAbajo());
    push();
    drawingContext.globalAlpha = 0.3;
    this.espectro.dibujar();
    pop();
  }

  static dibujarMino(pmino) {
    rect(pmino.x, pmino.y, tablero.lado_celda);
    push();
    noStroke();
    fill(255, 255, 255, 100);
    beginShape();
    vertex(pmino.x, pmino.y);
    vertex(pmino.x, pmino.y + tablero.lado_celda);
    vertex(pmino.x + tablero.lado_celda, pmino.y + tablero.lado_celda);
    endShape(CLOSE);
    beginShape();
    fill(0, 0, 0, 80);
    vertex(pmino.x, pmino.y);
    vertex(pmino.x, pmino.y + tablero.lado_celda);
    vertex(pmino.x + tablero.lado_celda, pmino.y + tablero.lado_celda);
    endShape(CLOSE);
    pop();
  }
}
