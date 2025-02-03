"use strict";

class Fondo {
    constructor(nombrePais, nombreCapital, nombreCircuito) {
        this.nombrePais = nombrePais;
        this.nombreCapital = nombreCapital;
        this.nombreCircuito = nombreCircuito;
    }

    fetchFlickrImages() {
        const flickrAPI = "https://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";
        const tags = "F1,Barcelona Circuit";
        $.getJSON(flickrAPI, {
            tags: tags,
            tagmode: "all",
            format: "json"
        })
        .done((data) => {
            if (data.items.length > 0) {
                let imageUrl = data.items[0].media.m.replace("_m", "_b");

                $("body").css({
                    "background-image": `url(${imageUrl})`,
                    "background-size": "cover",
                    "background-position": "center center",
                    "background-repeat": "no-repeat",
                    "background-attachment": "fixed",
                    "min-height": "100vh",
                    "height": "auto",
                    "width": "100vw",
                    "position": "relative",
                    "overflow": "hidden"
                });

                $("main").css({
                    "position": "relative",
                    "z-index": "2",
                });
            }
        });
    }
}

const background = new Fondo("España", "Montmeló", "Circuito de Barcelona");
    background.fetchFlickrImages();