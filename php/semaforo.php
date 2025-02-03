<!DOCTYPE HTML>

<html lang="es">
<head>
    <meta charset="UTF-8" />
    <meta name ="author" content ="Ignacio Fernández Suárez - UO294177" />
    <meta name ="description" content ="Juego del Semaforo" />
    <meta name ="keywords" content ="juego,game,semaforo,light" />
    <meta name ="viewport" content ="width=device-width, initial-scale=1.0" />
    <title>Semaforo</title>
    <link rel="stylesheet" type="text/css" href="../estilo/estilo.css"/>
    <link rel="stylesheet" type="text/css" href="../estilo/layout.css"/>
    <link rel="stylesheet" type="text/css" href="../estilo/semaforo_grid.css"/>
    <link rel="icon" href="../multimedia/LogotipoF1Desktop.ico">
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
</head>

<body>
    <header>
    <img alt="logotipo_F1Desktop" src="../multimedia/Logotipo_F1_Desktop_Sized.png"/>
    <h1> <a href="../index.html">F1 Desktop</a></h1>
    <nav>
        <a href="../calendario.html">Calendario</a>
        <a href="../circuito.html">Circuito</a>
        <a href="../juegos.html" class="active">Juegos</a>
        <a href="../meteorologia.html">Meteorología</a>
        <a href="../noticias.html">Noticias</a>
        <a href="../piloto.html">Piloto</a>
        <a href="viajes.php">Viajes</a>
    </nav>
    </header>
    <p>Estás en: <a href="../juegos.html">Juegos</a> >> Semaforo</p>
    <section>
        <h3>Selecciona un juego:</h3>
        <nav>
            <a href="../memoria.html">Memoria</a>
            <a href="semaforo.php">Semáforo</a>
            <a href="../api.html">Visualizador 3D</a>
            <a href="elige.php">Elige</a>
        </nav>
    </section>

    <main>
        <script src="../js/semaforo.js"></script>

        <?php
        class Record {
            protected $server;
            protected $user;
            protected $pass;
            protected $dbname;
            protected $db;

            public $connectionError = false;

            public function __construct() {
                $this->server = "localhost";
                $this->user = "DBUSER2024";
                $this->pass = "DBPSWD2024";
                $this->dbname = "records";

                $this->db = new mysqli($this->server, $this->user, $this->pass, $this->dbname);

                if ($this->db->connect_error) {
                    $this->connectionError = true;
                }
            }

            public function saveRecord($nombre, $apellido, $difficulty, $reactionTime) {
                $stmt = $this->db->prepare("INSERT INTO registro (nombre, apellidos, nivel, tiempo) VALUES (?, ?, ?, ?)");
                $stmt->bind_param('ssdd', $nombre, $apellido, $difficulty, $reactionTime);
                $stmt->execute();
            }

            public function getTopScores($difficulty) {
                $query = $this->db->prepare("SELECT nombre, apellidos, nivel, tiempo FROM registro WHERE nivel = ? ORDER BY tiempo ASC LIMIT 10");
                $query->bind_param('d', $difficulty);
                $query->execute();
                $result = $query->get_result();

                if ($result->num_rows > 0) {
                    echo "<h3>Este es el TOP 10 para la dificultad ".$difficulty."</h3>";
                    echo "<table><tr><th>Nombre</th><th>Apellidos</th><th>Dificultad</th><th>Tiempo</th></tr>";
                    while ($row = $result->fetch_assoc()) {
                        echo "<tr><td>{$row['nombre']}</td><td>{$row['apellidos']}</td><td>{$row['nivel']}</td><td>{$row['tiempo']}</td></tr>";
                    }
                    echo "</table>";
                } else {
                    echo "<p>No hay registros para esta dificultad.</p>";
                }
            }

            public function closeConnection() {
                $this->db->close();
            }
        }

        $record = new Record();

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {            
            if (!empty($_POST['nombre']) && !empty($_POST['apellido']) && !empty($_POST['difficulty']) && !empty($_POST['reactionTime'])) {
                $record->saveRecord($_POST['nombre'], $_POST['apellido'], $_POST['difficulty'], $_POST['reactionTime']);
                $record->getTopScores($_POST['difficulty']);
            }
        }

        $record->closeConnection();
        ?>

    </main>

    <footer>
        <picture>
            <source srcset="../multimedia/Footter_Partners_max465px.png" media="(max-width: 465px)">
            <source srcset="../multimedia/Footter_Partners_max799px.png" media="(max-width: 799px)">
            <source srcset="../multimedia/Footter_Partners.png">
            <img src="../multimedia/Footter_Partners.png" alt="Footer of the Partners">
        </picture>
    </footer>
</body>
</html>