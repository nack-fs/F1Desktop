class Circuito {
    constructor() {
        this.createButton('xml');
        this.createButton('kml');
        this.createButton('svg');
    }

    createButton(type) {
        let nombre = 'Subir archivo ' + type;
        const button = $(`<button type="button">${nombre}</button>`);
        $('main').append(button);
    
        button.data('input', null);
        button.data('label', null);
    
        button.on('click', () => { 
            this.openFileDialog(type, button, nombre.replace(/ /g, '-'));
        });
    }

    openFileDialog(type, button, nombre) {
        const inputFile = $('<input type="file" id="'+nombre+'" >');
        inputFile.on('change', (event) => {
            this.handleFileSelect(type, event.target.files, button);
        });
        const label = $('<label for="' + nombre + '">Subir archivo ' + type + '</label>');
    
        button.data('input', inputFile);
        button.data('label', label);
    
        $('body').append(inputFile);
        $('body').append(label);
    
        inputFile.click();
    }

    handleFileSelect(type, files, button) {
        const file = files[0];
        if (!file) {
            $('main').append('<p>Por favor, seleccione un archivo...</p>'); 
            return;
        }

        if (type === 'xml') {
            if (file.name !== "circuitoEsquema.xml") {
                $('main').append('<p>El archivo debe ser de tipo XML y debe llamarse "circuitoEsquema.xml".</p>');
                return;
            }
            this.readXMLFile(file, button);
        } else if (type === 'kml') {
            if (!file.name.endsWith('.kml')) {
                $('main').append('<p>El archivo debe ser de tipo KML.</p>');
                return;
            }
            this.readKMLFile(file, button);
        } else if (type === 'svg') {
            if (!file.name.endsWith('.svg')) {
                $('main').append('<p>El archivo debe ser de tipo SVG.</p>');
                return;
            }
            this.readSVGFile(file, button);
        }
    }

    removeButton(button) {
        const input = button.data('input');
        const label = button.data('label');
        if (input) input.remove();
        if (label) label.remove();
    
        button.remove();
    }

    readXMLFile(file, button) {
        this.removeButton(button);

        const reader = new FileReader();
        reader.onload = (e) => {
            var content = e.target.result;
            var parser = new DOMParser();
            var xml = parser.parseFromString(content, "application/xml");
            this.showXML(xml);
        };
        reader.readAsText(file);
    }

    showXML(xml) {
        let contenido = "<h2>Contenido del archivo XML:</h2>";
        const nombre = xml.getElementsByTagName('nombre')[0].textContent;
        contenido += `<h3>${nombre}</h3>`;
        contenido += "<ul>";

        const longitudGlobal = xml.getElementsByTagName('longitudGlobal')[0];
        const anchuraGlobal = xml.getElementsByTagName('anchuraGlobal')[0];
        const fecha = xml.getElementsByTagName('fecha')[0].textContent;
        const hora = xml.getElementsByTagName('hora')[0].textContent;
        const localidad = xml.getElementsByTagName('localidad')[0].textContent;

        contenido += `<li>Longitud del circuito: ${longitudGlobal.textContent} (${longitudGlobal.getAttribute('unidad')})</li>`;
        contenido += `<li>Anchura del circuito: ${anchuraGlobal.textContent} (${anchuraGlobal.getAttribute('unidad')})</li>`;
        contenido += `<li>Fecha: ${fecha}</li>`;
        contenido += `<li>Hora: ${hora}</li>`;
        contenido += `<li>Localidad: ${localidad}</li>`;
        contenido += "</ul>";

        const referencias = xml.getElementsByTagName('referencia');
        contenido += "<h3>Referencias:</h3>";
        contenido += "<ul>";
        for (let i = 0; i < referencias.length; i++) {
            const url = referencias[i].getAttribute('URL');
            const texto = referencias[i].textContent;
            contenido += `<li><a href="${url}">${texto}</a></li>`;
        }
        contenido += "</ul>";

        const imagenes = xml.getElementsByTagName('imagen');
        for (let i = 0; i < imagenes.length; i++) {
            const href = imagenes[i].getAttribute('href');
            const texto = imagenes[i].textContent;
            contenido += `<img src="xml/${href}" alt="${texto}"/>`;
        }

        const coordenadaMeta = xml.getElementsByTagName('coordenada')[0];
        const longitudMeta = coordenadaMeta.getElementsByTagName('longitud')[0].textContent;
        const latitudMeta = coordenadaMeta.getElementsByTagName('latitud')[0].textContent;
        const altitudMeta = coordenadaMeta.getElementsByTagName('altitud')[0].textContent;

        contenido += `<h3>Coordenada de la Meta</h3> <p>[${longitudMeta}°, ${latitudMeta}°, ${altitudMeta}°]</p>`;

        const puntos = xml.getElementsByTagName('punto');
        contenido += "<h3>Coordenadas del Circuito</h3>";
        for (let i = 0; i < puntos.length; i++) {
            const coordenadas = puntos[i].getElementsByTagName('coordenada');
            contenido += `<h4>Tramo ${i + 1}</h4>`;
            contenido += "<ul>";
            for (let j = 0; j < coordenadas.length; j++) {
                const longitud = coordenadas[j].getElementsByTagName('longitud')[0].textContent;
                const latitud = coordenadas[j].getElementsByTagName('latitud')[0].textContent;
                const altitud = coordenadas[j].getElementsByTagName('altitud')[0].textContent;
                contenido += `<li>[${longitud}°, ${latitud}°, ${altitud}]</li>`;
            }
            contenido += "</ul>";
        }
        $('main').append(contenido);
    }

    readKMLFile(file, button) {
        this.removeButton(button);

        const reader = new FileReader();
        reader.onload = (e) => {
            const kmlContent = e.target.result;
            this.showKMLOnMap(kmlContent);
        };
        reader.readAsText(file);
    }

    showKMLOnMap(kmlContent) {
        const mapContainer = '<div></div>';
        $('main').append(mapContainer);
        
        mapboxgl.accessToken = '[INSERT-API]';
        const div = document.querySelector('main > div');
        const map = new mapboxgl.Map({
            container: div,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [2.261219193083508, 41.57002187570426],
            zoom: 15
        });
    
        map.on('load', () => {
            this.initMap(map, kmlContent);
        });
    }
    
    initMap(map, kmlContent) {
        const coordinates = this.extractCoordinates(kmlContent);
        this.addMarkersAndPolyline(map, coordinates);
    }
    
    extractCoordinates(kmlContent) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(kmlContent, "application/xml");
        const coordinatesText = xmlDoc.querySelectorAll('coordinates');
        const coordinates = [];
    
        coordinatesText.forEach(coord => {
            const coordArray = coord.textContent.trim().split(/\s+/);
            coordArray.forEach(item => {
                const [lng, lat] = item.split(',').map(Number);
                coordinates.push([lng, lat]);
            });
        });
    
        return coordinates;
    }
    
    addMarkersAndPolyline(map, coordinates) {
        const path = [];
        coordinates.forEach((coord, index) => {
            new mapboxgl.Marker()
                .setLngLat(coord)
                .setPopup(new mapboxgl.Popup().setHTML(`Punto ${index + 1}`))
                .addTo(map);
            path.push(coord);
        });
    
        map.addSource('route', {
            'type': 'geojson',
            'data': {
                'type': 'Feature',
                'geometry': {
                    'type': 'LineString',
                    'coordinates': coordinates
                }
            }
        });
    
        map.addLayer({
            'id': 'route',
            'type': 'line',
            'source': 'route',
            'layout': {
                'line-join': 'round',
                'line-cap': 'round'
            },
            'paint': {
                'line-color': '#FF0000',
                'line-width': 4
            }
        });
    }        

    readSVGFile(file, button) {
        this.removeButton(button);

        const reader = new FileReader();
        reader.onload = (e) => {
            const svgContent = e.target.result;
            this.showSVG(svgContent);
        };
        reader.readAsText(file);
    }

    showSVG(svgContent) {
        const svgContainer = `<article><h2>Altimetría</h2>${svgContent}</article>`;
        $('main').append(svgContainer);
    }
}

const circuito = new Circuito();