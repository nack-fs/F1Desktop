"use strict";
class Meteo {
    constructor(){
        this.apikey = "[INSERT-API]";
        this.ciudad = "Barcelona";
        this.unidades = "&units=metric";
        this.idioma = "&lang=es";
        this.url = "https://api.openweathermap.org/data/2.5/forecast?q=" + this.ciudad + this.unidades + this.idioma + "&APPID=" + this.apikey;
    }

    cargarDatos() {
        $.ajax({
            dataType: "json",
            url: this.url,
            method: 'GET',
            success: function(datos) {
                $("section").empty();

                let pronostico = datos.list;
                let segundoArticulo = $("main article");
                const opciones = {
                    weekday: 'long',
                    day: '2-digit',
                    month: 'short',
                };

                for (let i = 0; i < pronostico.length; i += 8) {
                    let dia = pronostico[i];
                    let fecha = new Date(dia.dt * 1000);
                    let maxTemp = dia.main.temp_max;
                    let minTemp = dia.main.temp_min;
                    let humedad = dia.main.humidity;
                    let lluvia = dia.rain ? dia.rain["3h"] : 0;
                    let descripcion = dia.weather[0].description;

                    let imagen;
                    if (descripcion.includes("claro") || descripcion.includes("clear")) {
                        imagen = "multimedia/iconSol.gif";
                    } else if (descripcion.includes("nubes") || descripcion.includes("clouds")) {
                        imagen = "multimedia/iconoNubes.gif";
                    }else if (descripcion.includes("lluvia") || descripcion.includes("rain")) {
                        imagen = "multimedia/iconoLluvia.gif";
                    } else if (descripcion.includes("tormenta") || descripcion.includes("storm")) {
                        imagen = "multimedia/iconoTormenta.gif";
                    } else if (descripcion.includes("parcialmente") || descripcion.includes("partly cloudy")) {
                        imagen = "multimedia/iconoNubladoSol.gif";
                    } else {
                        imagen = "multimedia/iconoNubes.gif";
                    }

                    let articulo = $("<article>").append(
                        $("<img>").attr("src", imagen).attr("alt", descripcion),
                        $("<h3>").text(fecha.toLocaleDateString('es-ES', opciones).toUpperCase()),
                        $("<p>").text("Temperatura máxima: " + maxTemp + "°C"),
                        $("<p>").text("Temperatura mínima: " + minTemp + "°C"),
                        $("<p>").text("Humedad: " + humedad + "%"),
                        $("<p>").text("Lluvia: " + lluvia + "mm"),
                        $("<p>").text("Descripción: " + descripcion)
                    );
                    segundoArticulo.append(articulo);
                }
            }
        });
    }
}

var meteo = new Meteo();
meteo.cargarDatos();