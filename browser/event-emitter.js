// Event Emitters: http://bootcamp.plataforma5.la/modules/5cedcfd1-6d39-40b2-8876-d60ecbe1e4ab/contents/28744c13-7c40-46d6-80e1-b8e751acd4a3
// more articles : https://guide.freecodecamp.org/nodejs/event-emitters/ || https://guide.freecodecamp.org/nodejs/event-emitters/ || https://medium.freecodecamp.org/how-to-code-your-own-event-emitter-in-node-js-a-step-by-step-guide-e13b7e7908e1
// Aquí esta nuestra función constructora, disponible globalmente
// (seteada al objeto window!)
window.EventEmitter = function () {
  this.subscribers = {};
};

(function (EE) {
  // Para ser usada como:
  // instanceOfEE.on('touchdown', cheerFn);
  EE.prototype.on = function (eventName, eventListener) {
    // Si el objeto subscribers de la instancia no tiene todavía
    // la key que matche el nombre del evento dado, creá el
    // key y asignale el valor de un arreglo vacio
    if (!this.subscribers[eventName]) {
      this.subscribers[eventName] = [];
    }

    // Pusheá la función listener dada al arreglo
    // localizado en el objeto subscribers de la instancia
    this.subscribers[eventName].push(eventListener);
  };

  // Para ser usado como:
  // instanceOfEE.emit('codec', 'Hey Snake, Otacon is calling!');
  EE.prototype.emit = function (eventName) {
    // Si no hay subscribers al nombre de este evento, para que molestarse
    if (!this.subscribers[eventName]) {
      return;
    }

    // Toma los argumentos restantes de nuestra función emit
    const remainingArgs = [].slice.call(arguments, 1); // https://stackoverflow.com/questions/2125714/explanation-of-slice-call-in-javascript

    // Para cada suscriptor, llamalo con nuestros argumentos
    this.subscribers[eventName].forEach(function (listener) {
      listener.apply(null, remainingArgs); //https://www.w3schools.com/js/js_function_apply.asp
    });
  };
})(window.EventEmitter);
