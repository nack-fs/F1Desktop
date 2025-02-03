"use strict";

class Agenda {
    URL;
    hasClicked=false;
    
    constructor(URL) {
        this.URL=URL;
    }

    obtenerCarreras() {
        $.ajax({
            url: this.URL,
            method: "GET",
            dataType: "json",
            success: function(datos) {
                let tabla = $("<table>");
                let thead = $("<thead>");
                let tbody = $("<tbody>");
            
                let filaCabecera = $("<tr>");
                filaCabecera.append(
                    $("<th>").attr("scope", "col").text("Carrera"),
                    $("<th>").attr("scope", "col").text("Circuito"),
                    $("<th>").attr("scope", "col").text("Coordenadas"),
                    $("<th>").attr("scope", "col").text("Fecha y Hora")
                );
                thead.append(filaCabecera);
            
                datos.MRData.RaceTable.Races.forEach(function(carrera) {
                    let filaCarrera = $("<tr>");
                    filaCarrera.append(
                        $("<td>").text(carrera.raceName),
                        $("<td>").text(carrera.Circuit.circuitName),
                        $("<td>").text(carrera.Circuit.Location.lat + ", " + carrera.Circuit.Location.long),
                        $("<td>").text(carrera.date + " " + (carrera.time ? carrera.time : "No disponible"))
                    );
                    tbody.append(filaCarrera);
                });
            
                tabla.append(thead, tbody);
                $("main").append(tabla);
            },
        });
    }

    crearBoton() {
        let boton = $("<button>").text("Toca para ver la Temporada")
        $("main").prepend(boton);
        boton.click(() => {
            if(!this.hasClicked){
                this.obtenerCarreras();
                this.hasClicked=true;
            }
        });
    }
}
const agenda = new Agenda("http://ergast.com/api/f1/current.json");
agenda.crearBoton();