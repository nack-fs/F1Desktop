/*  info (Renderizado con WebGLRender)
    ---------------------------------------------------------------------------------
    El rendimiento en LightHouse influye en función del equipo en el que
    se ejecute, ya que se renderiza el modelo en 3d con la textura, iluminación,...

    APIs empleadas:
    - WebGL API
    - Fullscreen API
    - Pointer Lock API
*/

class API {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.model = null;
        this.movementX = 0;
        this.movementY = 0;
        this.init();
    }

    init() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 1, 4);

        this.renderer = new THREE.WebGLRenderer({
            canvas: document.querySelector("canvas"),
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor(0xffffff);

        const loader = new THREE.GLTFLoader();
        loader.load(
            'multimedia/F1.glb',
            (gltf) => {
                this.model = gltf.scene;
                this.scene.add(this.model);
            }
        );

       // Iluminación Global
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
        this.scene.add(ambientLight);

        // Iluminación Direccional
        const directionalLight = new THREE.DirectionalLight(0xffffff, 10);
        directionalLight.position.set(5, 10, 5);
        this.scene.add(directionalLight);

        // Iluminación Área
        const pointLight = new THREE.PointLight(0xffffff, 0.5, 1000);
        pointLight.position.set(0, 5, 5);
        this.scene.add(pointLight);

        this.animate();

        window.addEventListener('resize', this.onWindowResize.bind(this), false);

        document.querySelector("button").addEventListener('click', this.toggleFullscreen.bind(this));
        document.querySelector("canvas").addEventListener('click', this.enablePointerLock.bind(this));
        document.addEventListener('mousemove', this.onMouseMove.bind(this));
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        if (document.pointerLockElement === this.renderer.domElement && this.model) {
            const rotationSpeed = 0.01;
            this.model.rotation.y += rotationSpeed * this.movementX;

            const maxRotationX = Math.PI / 4;
            const minRotationX = -Math.PI / 4;
            this.model.rotation.x = THREE.MathUtils.clamp(
                this.model.rotation.x + rotationSpeed * this.movementY,
                minRotationX,
                maxRotationX
            );
        }

        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch((err) => {
                $('main').append('<p>Error al salir de pantalla completa</p>');
            });
        } else {
            document.exitFullscreen().catch((err) => {
                $('main').append('<p>Error al salir de pantalla completa</p>'); 
            });
        }
    }

    enablePointerLock() {
        this.renderer.domElement.requestPointerLock();
    }

    onMouseMove(event) {
        if (document.pointerLockElement === this.renderer.domElement) {
            this.movementX = event.movementX || 0;
            this.movementY = event.movementY || 0;
        }
    }
}

const apiInstance = new API();