<!DOCTYPE HTML>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <meta name="author" content="Ignacio Fernández Suárez - UO294177" />
    <meta name="description" content="Consulta los viajes" />
    <meta name="keywords" content="viajes,travel" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Viajes</title>

    <link rel="preload" href="https://api.mapbox.com/mapbox-gl-js/v2.9.0/mapbox-gl.css" as="style">
    <link href="https://api.mapbox.com/mapbox-gl-js/v2.9.0/mapbox-gl.css" rel="stylesheet" />
    
    <link rel="stylesheet" type="text/css" href="../estilo/estilo.css"/>
    <link rel="stylesheet" type="text/css" href="../estilo/layout.css"/>
    <link rel="icon" href="../multimedia/LogotipoF1Desktop.ico">

    <script src="https://code.jquery.com/jquery-3.7.1.min.js" async></script>
    <script src="https://api.mapbox.com/mapbox-gl-js/v2.9.0/mapbox-gl.js" defer></script>
</head>

<body>
    <header>
        <img alt="logotipo_F1Desktop" src="../multimedia/Logotipo_F1_Desktop_Sized.png"/>
        <h1><a href="../index.html">F1 Desktop</a></h1>
        <nav>
            <a href="../calendario.html">Calendario</a>
            <a href="../circuito.html">Circuito</a>
            <a href="../juegos.html">Juegos</a>
            <a href="../meteorologia.html">Meteorología</a>
            <a href="../noticias.html">Noticias</a>
            <a href="../piloto.html">Piloto</a>
            <a href="viajes.php" class="active">Viajes</a>
        </nav>
    </header>

    <p>Estás en: <a href="../index.html">Inicio</a> >> Viajes</p>

    <h2>Viajes</h2>
    <main>
        <?php
        class Carrusel {
            private $capital;
            private $pais;
            private $imagenes = [];

            public function __construct($capital, $pais) {
                $this->capital = $capital;
                $this->pais = $pais;
                $this->imagenes = $this->obtenerFotos();
            }

            public function obtenerFotos() {
                $apiKey = '[INSERT-API]';

                $params = [
                    'api_key' => $apiKey,
                    'method' => 'flickr.photos.search',
                    'tags' => 'F1,'.'Circuit,'.$this->capital.','.$this->pais,
                    'format' => 'php_serial',
                    'per_page' => 10
                ];

                $encoded_params = [];
                foreach ($params as $k => $v) {
                    $encoded_params[] = urlencode($k) . '=' . urlencode($v);
                }

                $url = "https://api.flickr.com/services/rest/?" . implode('&', $encoded_params);
                $response = file_get_contents($url);
                $response_obj = unserialize($response);

                $imagenes = [];
                if ($response_obj['stat'] == 'ok') {
                    $photos = $response_obj['photos']['photo'];
                    foreach ($photos as $photo) {
                        $farm_id = $photo['farm'];
                        $server_id = $photo['server'];
                        $photo_id = $photo['id'];
                        $secret_id = $photo['secret'];
                        $photo_url = "https://farm{$farm_id}.staticflickr.com/{$server_id}/{$photo_id}_{$secret_id}.jpg";
                        $imagenes[] = $photo_url;
                    }
                }
                return $imagenes;
            }

            public function getImagenes() {
                return $this->imagenes;
            }

            public function loadCarrusel($imagenes){
                echo "<h2>Carrusel</h2>";
                echo "<article>";
                echo "<h3>Imágenes de {$this->capital},{$this->pais}</h3>";
                foreach($imagenes as $image){
                    echo "<img alt='imagen {$this->capital} {$this->pais}' src='{$image}' loading='lazy'/>";
                }
                echo "<button> &gt; </button>";
                echo "<button> &lt; </button>";
                echo "</article>";
            }
        }

        $carrusel = new Carrusel('Barcelona', 'Spain');
        $imagenes = $carrusel->getImagenes();
        $carrusel->loadCarrusel($imagenes);
        ?>

        <?php
            class Moneda {
                private $local;
                private $foreign;

                public function __construct($local,$foreign){
                    $this->local = $local;
                    $this->foreign = $foreign;
                }

                public function getLocal() {
                    return $this->local;
                }
            
                public function getForeign() {
                    return $this->foreign;
                }

                public function getCurrency() {
                    $url = "https://api.exchangerate-api.com/v4/latest/{$this->local}";
                    $json = file_get_contents($url);
                    $data = json_decode($json, true);
            
                    if (isset($data['rates'][$this->foreign])) {
                        return $data['rates'][$this->foreign];
                    } else {
                        return null;
                    }
                }
            }

            $moneda = new Moneda('EUR','USD');
            $tasa = $moneda->getCurrency();

            if($tasa!==null){
                echo "<h2>Tasa de Cambio Actual</h2>";
                echo '<img src="../multimedia/ExchangeImg.png" alt="Image of money exchange">';
                echo "<p>La tasa de cambio de {$moneda->getLocal()} a {$moneda->getForeign()} es: " . $tasa."</p>";
            }else {
                echo "<p>No se ha podido obtener la tasa de cambio...</p>";
            }
        ?>

        <h3>Visualizar Mapa Dinámico</h3>
        <div></div>
    </main>

    <footer>
        <picture>
            <source srcset="../multimedia/Footter_Partners_max465px.png" media="(max-width: 465px)">
            <source srcset="../multimedia/Footter_Partners_max799px.png" media="(max-width: 799px)">
            <source srcset="../multimedia/Footter_Partners.png">
            <img src="../multimedia/Footter_Partners.png" alt="Footer of the Partners">
        </picture>
    </footer>

    <script src="../js/viajes.js" defer></script>
</body>
</html>