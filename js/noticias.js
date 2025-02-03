"use strict";

class Noticias{
    previousNum=0;

    constructor(){
        this.isSupported();
        this.createButton();
        this.buttonsPropierties();
        this.container = $("main article").first();
    }

    isSupported(){
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            $('main').append('<p>Este navegador soporta el API File </p>'); 
        }else {
            $('main').append('<p>¿Vaya!...Este navegador no soporta el API File...</p>'); 
        }
    }

    createButton(){
        $('main').append('<p><input type="file" id="file-input"></p>');
        $('main').append('<label for="file-input">Seleccionar archivo</label>');
        $('input').on('change', (event) => {
            this.readInputFile(event.target.files);
        });
    }

    readInputFile(files){
        if (files.length > 0) {
            const archivo = files[0];
            var tipoTexto = /text.*/;
            var strictedName = "noticias.txt";
            if(archivo.type.match(tipoTexto) && archivo.name==strictedName){
                const fileReader = new FileReader();

                fileReader.onload = (e) => {
                    const content = e.target.result;
                    this.processNews(content);
                };
    
                fileReader.readAsText(archivo);   
            }else {
                $('main').append('<p>El archivo no es noticias.txt ...</p>'); 
            }
        }else {
            $('main').append('<p>No se seleccionó ningún archivo...</p>'); 
        }
    }

    processNews(data){
        $("main article h3").hide();
        let news = data.split("\n");
        for (let n of news){
            let newParts = n.split("_");
            this.createNew(newParts[0],newParts[1],newParts[2]);
        }
        $("main section").show();
    }

    createNew(title,text,author){
        let num;
        do {
            num = Math.floor(Math.random() * 5) + 1;
        } while (num === this.previousNum);
        this.previousNum = num;

        let imagen = `multimedia/iconNewRandom_${num}.png`;

        let articulo = $("<article>").append(
            $("<img>").attr("src", imagen).attr("alt", "icon for news"),
            $("<h3>").text(title),
            $("<p>").text(text),
            $("<p>").text(author),
        );
        this.container.append(articulo);
    }

    buttonsPropierties(){
        let boton = $('main section button');
        boton.click(() => {
            this.userCreateNews();
        });
        $("main section").hide();
    }

    userCreateNews(){
        var titulo = $('input').eq(0).val();
        var texto = $('input').eq(1).val();
        var autor = $('input').eq(2).val();

        if(titulo && texto && autor){
            this.createNew(titulo,texto,autor);
        }else {
            $('main').append('<p>Rellena todos los campos</p>'); 
        }

        $('input').val('');
    }

}

$(document).ready(function() {
    const noticia = new Noticias();
});

