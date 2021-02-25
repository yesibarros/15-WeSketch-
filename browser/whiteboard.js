window.whiteboard = new window.EventEmitter();

(function () {
  //Immediately invoked function expression, https://en.wikipedia.org/wiki/Immediately_invoked_function_expression

  // El color de nuestro pincel
  let color;

  // Los elementos para seleccionar colores del DOM.
  const colorElements = [].slice.call(document.querySelectorAll(".marker"));

  colorElements.forEach(function (el) {
    // Setea el background color de este elemento
    // a su id (purple, red, blue, etc).
    el.style.backgroundColor = el.id;

    // Adjunta un click handler que va a setear nuestra variable
    // de color al id del elemento, remueve la clase selected de
    // todos los colores, y luego agrega la clase selected al color
    // clickeado.
    el.addEventListener("click", function () {
      color = this.id;
      document.querySelector(".selected").classList.remove("selected");
      this.classList.add("selected");
    });
  });

  const canvas = document.getElementById("paint");

  const ctx = canvas.getContext("2d");

  function resize() {
    // Desescala el canvas (si fue previamente escalado)
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    // El pixel ratio del dispositvo es el multiplicador
    // entre pixeles CSS y pixels del dispositivo.
    const pixelRatio = window.devicePixelRatio || 1;

    // Asigna un store de back-up lo suficientemente grande para darnos
    // un 1:1 pixel del dispositivo a un canvas pixel ratio
    const w = canvas.clientWidth * pixelRatio,
      h = canvas.clientHeight * pixelRatio;
    if (w !== canvas.width || h !== canvas.height) {
      // Resizing el canvas destruye el contenido actual
      // Por lo tento, guardalo
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      canvas.width = w;
      canvas.height = h;

      // ...luego restauralo
      ctx.putImageData(imgData, 0, 0);
    }

    // Escala las coordenadas internas del sitema canvas por
    // el pixel del ratio del dispositivo para asegurarse que
    // 1 unidad del canvas = 1 pixel css, incluso aunque nuestro
    // store de back-up sea mas grande

    ctx.scale(pixelRatio, pixelRatio);

    ctx.lineWidth = 5;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
  }

  resize();
  window.addEventListener("resize", resize);

  const currentMousePosition = { x: 0, y: 0 };
  const lastMousePosition = { x: 0, y: 0 };

  let drawing = false;

  canvas.addEventListener("mousedown", function (e) {
    drawing = true;
    currentMousePosition.x = e.pageX - this.offsetLeft;
    currentMousePosition.y = e.pageY - this.offsetTop;
  });

  canvas.addEventListener("mouseup", function () {
    drawing = false;
  });

  canvas.addEventListener("mousemove", function (e) {
    if (!drawing) return;

    lastMousePosition.x = currentMousePosition.x;
    lastMousePosition.y = currentMousePosition.y;

    currentMousePosition.x = e.pageX - this.offsetLeft;
    currentMousePosition.y = e.pageY - this.offsetTop;

    whiteboard.draw(lastMousePosition, currentMousePosition, color, true);
  });

  whiteboard.draw = function (start, end, strokeColor, shouldBroadcast) {
    // Dibuja la linea entre la posición de start y de end
    // que es coloreada con el color dado.
    ctx.beginPath();
    ctx.strokeStyle = strokeColor || "black";
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.closePath();
    ctx.stroke();

    // Si shouldBroadcas es verdadero, vamos a emitir un evento draw
    // a los listeners, con el start, end y color data.
    if (shouldBroadcast) {
      whiteboard.emit("draw", start, end, strokeColor);
    }
  };
})();
