<!DOCTYPE HTML>

<html lang="es">
<head>
    <meta charset="UTF-8" />
    <meta name ="author" content ="Ignacio Fernández Suárez - UO294177" />
    <meta name ="description" content ="Elige" />
    <meta name ="keywords" content ="juego,elige,choose" />
    <meta name ="viewport" content ="width=device-width, initial-scale=1.0" />
    <title>Album</title>
    <link rel="stylesheet" type="text/css" href="../estilo/estilo.css"/>
    <link rel="stylesheet" type="text/css" href="../estilo/layout.css"/>
    <link rel="stylesheet" type="text/css" href="../estilo/elige.css"/>
    <link rel="icon" href="../multimedia/LogotipoF1Desktop.ico">
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
    <p>Estás en: <a href="../juegos.html">Juegos</a> >> Elige</p>
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
    <?php
        /*
            Se importa el .CSV de forma automática y transparente para el usuario.
            Cada tabla tiene un .csv en la carpeta /php. Para exportar los .cvs es desde
            la base de datos.

            -> Preparamos las quieres cuando trabajamos con datos externos para evitar
               inyecciones SQL. Como en importCSV, showDriver...
        */
        class Elige {
            private $server;
            private $user;
            private $pass;
            private $dbname;
            private $db;

            public function __construct() {
                $this->server = "localhost";
                $this->user = "DBUSER2024";
                $this->pass = "DBPSWD2024";
                $this->dbname = "elige";

                $this->db = new mysqli($this->server, $this->user, $this->pass);

                if ($this->db->connect_error) {
                    die("Connection failed: " . $this->db->connect_error);
                }
            }

            public function createDatabase() {
                $createDbQuery = "CREATE DATABASE IF NOT EXISTS {$this->dbname}";
                if ($this->db->query($createDbQuery) === TRUE) {
                    $this->db->select_db($this->dbname);
                    $this->executeSQLFile("elige.sql");
                } else {
                    die("Error creating database: " . $this->db->error);
                }
            }

            private function executeSQLFile($filePath) {
                if (!file_exists($filePath)) {
                    die("SQL file not found: " . $filePath);
                }

                $sqlContent = file_get_contents($filePath);
                $queries = array_filter(array_map('trim', explode(';', $sqlContent)));

                foreach ($queries as $query) {
                    if (!empty($query)) {
                        if ($this->db->query($query) === FALSE) {
                            echo "Error executing query: " . $this->db->error . "<br>";
                        }
                    }
                }
            }            

            public function importFromCSV($tableName, $csvFilePath) {
                if (!file_exists($csvFilePath)) {
                    die("CSV file not found: " . $csvFilePath);
                }
            
                $file = fopen($csvFilePath, "r");
            
                $headers = fgetcsv($file);
                $columns = implode(",", $headers);
            
                while (($row = fgetcsv($file)) !== FALSE) {
                    $escapedValues = array_map([$this->db, 'real_escape_string'], $row);
                    $values = implode(",", array_fill(0, count($escapedValues), '?'));
            
                    $checkQuery = "SELECT COUNT(*) AS count FROM {$tableName} WHERE ";
                    $conditions = [];
            
                    foreach ($headers as $index => $column) {
                        if ($index < count($row)) {
                            $conditions[] = "{$column} = ?";
                        }
                    }
                    $checkQuery .= implode(" AND ", $conditions);
            
                    $stmt = $this->db->prepare($checkQuery);
                    if ($stmt === false) {
                        die("Error preparing check query: " . $this->db->error);
                    }
            
                    $types = str_repeat('s', count($row));
                    $stmt->bind_param($types, ...$escapedValues);
                    $stmt->execute();
                    $result = $stmt->get_result();
                    $exists = $result->fetch_assoc()['count'] > 0;
            
                    if (!$exists) {
                        $insertQuery = "INSERT INTO {$tableName} ({$columns}) VALUES ({$values})";
                        $stmt = $this->db->prepare($insertQuery);
                        if ($stmt === false) {
                            die("Error preparing insert query: " . $this->db->error);
                        }
                        $stmt->bind_param($types, ...$escapedValues);
                        $stmt->execute();
                    }
                    $stmt->close();
                }
                fclose($file);
            }            

            public function showDriverInfo($driverId, $redOrBlue) {
                $query = "SELECT d.first_name, d.last_name, d.birth_year, e.earnings_millions, t.name AS team_name, c.name AS country_name
                          FROM Drivers d
                          JOIN Earnings e ON d.id = e.driver_id
                          JOIN Teams t ON d.team_id = t.id
                          JOIN Countries c ON d.country_id = c.id
                          WHERE d.id = ?";
            
                $stmt = $this->db->prepare($query);
                if ($stmt === false) {
                    die("Error preparing query: " . $this->db->error);
                }
                $stmt->bind_param('i', $driverId);
                $stmt->execute();
                $result = $stmt->get_result();
            
                if ($result && $result->num_rows > 0) {
                    $driver = $result->fetch_assoc();
                    echo "<article>";
                    echo "<h3>¿Preferirías ser la opción {$redOrBlue}?</h3>";
                    echo "<img src='../multimedia/img_driver_id_{$driverId}.png' alt='img_{$driver['first_name']}'/>";
                    echo "<p>Nombre del piloto: " . $driver['first_name'] . " " . $driver['last_name'] . "</p>";
                    echo "<p>Equipo: " . $driver['team_name'] . "</p>";
                    echo "<p>País: " . $driver['country_name'] . "</p>";
                    echo "<p>Año de nacimiento: " . $driver['birth_year'] . "</p>";
                    echo "<p>Earnings: $" . $driver['earnings_millions'] . " millones</p>";
                    echo "</article>";
                }
                $stmt->close();
            }            

            public function getDriverCount() {
                $query = "SELECT COUNT(*) AS total FROM Drivers";
                $result = $this->db->query($query);
                $count = $result->fetch_assoc();
                return $count['total'];
            }

            public function showTeams($actualRed, $actualBlue){
                echo "<article>";
                echo "<h3>ELIGE:</h3>";
                $this->showDriverInfo($actualRed,'RED');
                $this->showDriverInfo($actualBlue,'BLUE');
                echo "</article>";
            }

            public function createButtons($actualRed, $actualBlue) {
                echo "<article>";
                echo "<h3>Selecciona tu elección: </h3>";
                echo "<form method='post'>
                        <input type='hidden' name='actualRed' value='{$actualRed}'>
                        <input type='hidden' name='actualBlue' value='{$actualBlue}'>
                        <button type='submit' name='chooseRed'>Elige RED</button>
                        <button type='submit' name='chooseBlue'>Elige BLUE</button>
                    </form>";
                echo "</article>";
            }
        }

        $elige = new Elige();
        $elige->createDatabase();

        $elige->importFromCSV("Teams", "Teams.csv");
        $elige->importFromCSV("Countries", "Countries.csv");
        $elige->importFromCSV("Drivers", "Drivers.csv");
        $elige->importFromCSV("Earnings", "Earnings.csv");
        $elige->importFromCSV("Championships", "Championships.csv");
        $elige->importFromCSV("InitialTeams", "InitialTeams.csv");

        $driverCount = $elige->getDriverCount();

        $actualRed = random_int(1, $driverCount);
        $actualBlue = random_int(1, $driverCount);

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $actualRed = $_POST['actualRed'];
            $actualBlue = $_POST['actualBlue'];
            if (isset($_POST['chooseRed'])) {
                $actualRed = $actualRed;
                do {
                    $actualBlue = random_int(1, $driverCount);
                } while ($actualRed == $actualBlue);
            } elseif (isset($_POST['chooseBlue'])) {
                $actualRed= $actualBlue;
                do {
                    $actualBlue = random_int(1, $driverCount);
                } while ($actualBlue == $actualRed);
            }
        } else {
            $actualRed = random_int(1, $driverCount);
            do {
                $actualBlue = random_int(1, $driverCount);
            } while ($actualBlue == $actualRed);
        }
        $elige->showTeams($actualRed,$actualBlue);
        $elige->createButtons($actualRed,$actualBlue);
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