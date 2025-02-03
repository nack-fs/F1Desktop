"use strict";

class Semaforo {
    constructor() {
        this.levels = [0.2, 0.5, 0.8];
        this.lights = 4;
        this.unload_moment = null;
        this.clic_moment = null;
        this.difficulty = this.randomLevel();
        this.createStructure();
    }

    randomLevel() {
        return this.levels[Math.floor(Math.random() * this.levels.length)];
    }

    createStructure() {
        const main = document.querySelector('main');
        
        const container = document.createElement('article');
        const h2 = document.createElement('h2');
        h2.textContent = "Juego de Tiempo de Reacción";
        container.append(h2);

        main.appendChild(container);

        for (let i = 0; i < this.lights; i++) {
            const light = document.createElement('div');
            container.appendChild(light);
        }

        const botones = document.createElement('article');
        const h3 = document.createElement('h3');
        h3.textContent = "¡Vamos!";
        botones.appendChild(h3);

        const startButton = document.createElement('button');
        startButton.textContent = 'Arranque';
        startButton.onclick = () => this.start(startButton);
        botones.appendChild(startButton);

        const reactionButton = document.createElement('button');
        reactionButton.textContent = 'Reacción';
        reactionButton.onclick = () => this.stopReaction();
        reactionButton.disabled = true;
        botones.appendChild(reactionButton);

        main.appendChild(botones);
        this.reactionButton = reactionButton;
    }

    start(startButton) {
        this.initSequence();
        startButton.disabled = true;

        this.clearOldData();
    }

    initSequence() {
        this.clearOldData();

        const main = document.querySelector('main');
        main.classList.add('load');
        const lights = document.querySelectorAll('article div');
        var time = 1500 / lights.length;
        
        lights.forEach((light, index) => {
            setTimeout(() => {
                light.classList.remove('inactivo');
                light.classList.add('activo');
            }, time * index);
        });

        setTimeout(() => {
            this.unload_moment = new Date();
            main.classList.remove('load');
            this.endSequence();
        }, this.difficulty * 100 + 2000);
    }    
    
    endSequence() {
        const main = document.querySelector('main');
        main.classList.add('unload');
        const lights = document.querySelectorAll('article div');
        lights.forEach(light => light.classList.remove('activo'));
        lights.forEach(light => light.classList.add('inactivo'));
        this.reactionButton.disabled = false;
    }    

    stopReaction() {
        this.clic_moment = new Date();
        const reactionTime = this.clic_moment - this.unload_moment;
        const reactionTimeRounded = Math.round((reactionTime / 1000) * 1000) / 1000;

        const main = document.querySelector('main');
        main.classList.remove('load');
        main.classList.remove('unload');
        this.reactionButton.disabled = true;
        const startButton = document.querySelector('button:nth-child(2)');
        startButton.disabled = false;

        // Ranking
        this.createRecordForm(reactionTimeRounded);
    }

    // Ejercicio de PHP (Permitido JQuery)
    createRecordForm(reactionTimeRounded) {
        $('main').append('<form action="#" method="post" name="formulario">');
        $('main form').append('<h3>Apuntarse al Ranking:</h3>');
        $('main form').append('<label for="nombre">Nombre:</label>');
        $('main form').append('<input type="text" name="nombre" id="nombre">');
        $('main form').append('<label for="apellido">Apellidos:</label>');
        $('main form').append('<input type="text" name="apellido" id="apellido">');
        $('main form').append('<p>Dificultad: ' + this.difficulty + '</p>');
        $('main form').append(`<p>Tiempo de reacción: ${reactionTimeRounded} segundos</p>`);
        const saveButton = $('<button>', {
            text: 'Guardar',
            type: 'button',
            click: () => this.saveRanking(reactionTimeRounded)
        });
        $('main form').append(saveButton);
        $('main form').append('</form>');
    }

    clearOldData(){
        $('main form').remove();
    }
    
    saveRanking(reactionTimeRounded) {
        const nombre = document.querySelector('input[name="nombre"]').value;
        const apellido = document.querySelector('input[name="apellido"]').value;
    
        if (!nombre || !apellido) {
            $('main').append('<p>Por favor, complete todos los campos.</p>');
            return;
        }
    
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = 'semaforo.php';
    
        const inputNombre = document.createElement('input');
        inputNombre.name = 'nombre';
        inputNombre.value = nombre;
    
        const inputApellido = document.createElement('input');
        inputApellido.name = 'apellido';
        inputApellido.value = apellido;
    
        const inputDifficulty = document.createElement('input');
        inputDifficulty.name = 'difficulty';
        inputDifficulty.value = this.difficulty;
        inputDifficulty.readOnly = true;
    
        const inputReactionTime = document.createElement('input');
        inputReactionTime.name = 'reactionTime';
        inputReactionTime.value = reactionTimeRounded;
        inputReactionTime.readOnly = true;
    
        form.appendChild(inputNombre);
        form.appendChild(inputApellido);
        form.appendChild(inputDifficulty);
        form.appendChild(inputReactionTime);
    
        document.body.appendChild(form);
        form.submit();
    }    
    
    lockButtonSave() {
        $('button:contains("Guardar")').prop('disabled', true);
    }    
}

const juegoSemaforo = new Semaforo();