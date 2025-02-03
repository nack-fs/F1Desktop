"use strict";

class Pais{
    nombrePais;
    nombreCapital;
    nombreCircuito;
    poblacion;
    formaGobierno;
    coordenadasMeta;
    religion;

    constructor(nombrePais,nombreCapital,poblacion){
        this.nombrePais=nombrePais;
        this.nombreCapital=nombreCapital;
        this.poblacion=poblacion;
    }

    rellenarCampos(nombreCircuito,formaGobierno,coordenadasMeta,religion){
        this.nombreCircuito=nombreCircuito;
        this.formaGobierno=formaGobierno;
        this.coordenadasMeta=coordenadasMeta;
        this.religion=religion;
    }

    showPrincipalNombrePais(){
        document.write("<p>"+this.nombrePais+"</p>");
    }

    showPrincipalCapital(){
        document.write("<p>"+this.nombreCapital+"</p>");
    }

    showSecundary(){
        document.write("<ul>");
        document.write("\n<li>Nombre del Circuito: "+this.nombreCircuito+"</li>");
        document.write("\n<li>Población: "+this.poblacion+" personas </li>");
        document.write("\n<li>Forma de gobierno: "+this.formaGobierno+"</li>");
        document.write("\n<li>Religión: "+this.religion+"</li>");
        document.write("</ul>");
    }

    showCoordenada(){
        document.write("<p> La meta se encuenta en las coordenadas "+this.coordenadasMeta+"</p>");
    }
}

var pais = new Pais("España","Barcelona",48797875);
pais.rellenarCampos("Circuito de Barcelona","Democracia","2.261°-41.570°-120m","No confesional")
pais.showPrincipalNombrePais();
pais.showPrincipalCapital();
pais.showSecundary();
pais.showCoordenada();