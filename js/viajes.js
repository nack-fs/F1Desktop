"use strict";

class Viajes {
    longitud;
    latitud;
    precision;
    altitud;
    precisionAltitud;

    constructor() {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(this.getPosicion.bind(this), this.isError.bind(this));
        } else {
            $('main').append('<p>Geolocalización no soportada en tu navegador</p>');
        }
    }

    getPosicion(posicion) {
        this.longitud = posicion.coords.longitude; 
        this.latitud = posicion.coords.latitude;
        this.precision = posicion.coords.accuracy;
        this.altitud = posicion.coords.altitude;
        this.precisionAltitud = posicion.coords.altitudeAccuracy;
        this.getMapaEstaticoMapBox();
        this.getMapaDinamicoMapBox();
        this.turnOnCarrusel();
    }

    isError(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                alert("El usuario no permite la petición de geolocalización");
                break;
            case error.POSITION_UNAVAILABLE:
                alert("Información de geolocalización no disponible");
                break;
            case error.TIMEOUT:
                alert("La petición de geolocalización ha caducado");
                break;
            case error.UNKNOWN_ERROR:
                alert("Se ha producido un error desconocido");
                break;
        }
    }

    getMapaEstaticoMapBox() {
        var container = document.querySelector('main');
        var API = "[INSERT-API]";
        var url = "https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/";
        var centro = this.longitud + "," + this.latitud + ",15";
        var tamaño = "800x600";
        var marcador = "pin-s+f00(" + this.longitud + "," + this.latitud + ")";
    
        var parámetros = "?access_token=" + API;
    
        this.imagenMapa = url + marcador + "/" + centro + "/" + tamaño + parámetros;
    
        let title = document.createElement('h3');
        title.textContent = 'Visualizar Mapa Estático';
        const img = document.createElement('img');
        img.setAttribute('src', this.imagenMapa);
        img.setAttribute('alt', "mapa estático mapbox");
        container.appendChild(title);
        container.appendChild(img);
    }              

    getMapaDinamicoMapBox() {
        var container = document.querySelector('main > div');
        mapboxgl.accessToken = 'pk.eyJ1IjoidW8yOTQxNzciLCJhIjoiY20zZXFnYnp2MGVndjJycXVkNmZ3NXVreSJ9.pQBVx0S4-u5R5tHUfaAJkw';
        const mapaGeoposicionado = new mapboxgl.Map({
            container: container,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [this.longitud, this.latitud],
            zoom: 15
        });
    
        const marcador = new mapboxgl.Marker({ color: 'red' })
            .setLngLat([this.longitud, this.latitud])
            .addTo(mapaGeoposicionado);
    
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    mapaGeoposicionado.setCenter([pos.lng, pos.lat]);
                    new mapboxgl.Marker({ color: 'blue' })
                        .setLngLat([pos.lng, pos.lat])
                        .addTo(mapaGeoposicionado);
                    new mapboxgl.Popup()
                        .setLngLat([pos.lng, pos.lat])
                        .setHTML('Localización encontrada')
                        .addTo(mapaGeoposicionado);
                },
                () => {
                    this.handleLocationError(true, mapaGeoposicionado.getCenter());
                }
            );
        } else {
            this.handleLocationError(false, mapaGeoposicionado.getCenter());
        }
    }
    
    handleLocationError(browserHasGeolocation, currentPosition) {
        alert(
            browserHasGeolocation
                ? 'Error: Ha fallado la geolocalización'
                : 'Error: Su navegador no soporta geolocalización'
        );
    }    
    
    turnOnCarrusel(){
        const slides = document.querySelectorAll("h2 + article img");
        const nextSlide = document.querySelector("h2 + article button:nth-of-type(1)");

        let curSlide = 3;
        let maxSlide = slides.length - 1;

        nextSlide.addEventListener("click", function () {
        if (curSlide === maxSlide) {
            curSlide = 0;
        } else {
            curSlide++;
        }

        slides.forEach((slide, indx) => {
            var trans = 100 * (indx - curSlide);
            $(slide).css('transform', 'translateX(' + trans + '%)')
        });
        });

        const prevSlide = document.querySelector("h2 + article button:nth-of-type(2)");

        prevSlide.addEventListener("click", function () {
        if (curSlide === 0) {
            curSlide = maxSlide;
        } else {
            curSlide--;
        }

        slides.forEach((slide, indx) => {
            var trans = 100 * (indx - curSlide);
            $(slide).css('transform', 'translateX(' + trans + '%)')
        });
        });
    }
}

const viajes = new Viajes();