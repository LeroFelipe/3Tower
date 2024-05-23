import * as THREE from './lib/three.module.js';
import * as GLTFLoader from './lib/GLTFLoader.js';
import { createSqrTower} from './lib/Towers.js';

const windowSize = 0.95;
export var torre = new THREE.Group();

// Variáveis para controlar a rotação da cena em relação aos eixos X e Y
let rotateX = 0;
let rotateY = 0;

var h = 8.5; // para adicionar o terreno em relação a altura da torre 

// Configuração da cena, câmera e renderizador
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const canvas = document.querySelector("canvas.webgl");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
const gltfLoader = new GLTFLoader.GLTFLoader();

renderer.setSize(window.innerWidth * windowSize, window.innerHeight * windowSize);
renderer.setClearColor(0x1e1e1e);
renderer.shadowMap.enabled = true; // Habilitar mapeamento de sombras
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Tipo de sombra suave
document.body.appendChild(renderer.domElement);

// Adicionar uma luz direcional para gerar sombras
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(8, 10, 10); // Posição da luz
light.castShadow = true; // Permitir que a luz gere sombras
scene.add(light);

// Configurar as propriedades de sombra da luz
light.shadow.mapSize.width = 1024; // Largura do mapa de sombras
light.shadow.mapSize.height = 1024; // Altura do mapa de sombras
light.shadow.camera.near = 1; // Distância próxima para renderização de sombra
light.shadow.camera.far = 50; // Distância distante para renderização de sombra

// Para lidar com eventos de pressionar o botão do mouse
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

// Posicionamento da câmera
camera.position.z = 7;

function planeXY(){
    // Definir as dimensões do plano
    const larguraPlano = 100; // Largura do plano
    const alturaPlano = 100; // Altura do plano

    // Criar a geometria do plano
    const planeGeometry = new THREE.PlaneGeometry(larguraPlano, alturaPlano);

    // Criar um material
    const whiteMaterial = new THREE.MeshPhongMaterial({ color: 0x7CFC00 });

    // Criar o plano usando a geometria e o material
    const shadowPlane = new THREE.Mesh(planeGeometry, whiteMaterial);

    // Rotacionar o plano para que fique no plano XY
    shadowPlane.rotation.x = -Math.PI / 2; // Rotação de -90 graus no eixo X

    // Definir a posição do plano (opcional, dependendo da sua cena)
    shadowPlane.position.set(0, -h/2, 0); // Coloque o plano no centro da cena ou na posição desejada

    // Permitir que o plano receba sombras
    shadowPlane.receiveShadow = true;

    // Adicionar o plano à cena
    torre.add(shadowPlane);
}

function xyzLines(){
    var dashedLines = [
        // Eixo x
        [new THREE.Vector3(-20, 0, 0), new THREE.Vector3(20, 0, 0)], // x = -1 to x = 1
        // Eixo y
        [new THREE.Vector3(0, -20, 0), new THREE.Vector3(0, 20, 0)], // y = -1 to y = 2
        // Eixo z
        [new THREE.Vector3(0, 0, -20), new THREE.Vector3(0, 0, 20)]  // z = -1 to z = 1
    ];

    // Adicionar as linhas tracejadas dos eixos à cena
    for (var k = 0; k < dashedLines.length; k++) {
        var dashedLineStart = dashedLines[k][0];
        var dashedLineEnd = dashedLines[k][1];

        var dashedLineGeometry = new THREE.BufferGeometry().setFromPoints([dashedLineStart, dashedLineEnd]);

        var dashedLineMaterial = new THREE.LineDashedMaterial({ color: 0xffffff, dashSize: 0.1, gapSize: 0.05 });
        var dashedLine = new THREE.Line(dashedLineGeometry, dashedLineMaterial);
        dashedLine.computeLineDistances(); // Computar distâncias para definir o padrão tracejado

        torre.add(dashedLine);
    };
}

function carregarAntenas(){

    gltfLoader.load(
    './antenas/MWantena.glb',
    function (gltf) {
        gltf.scene.traverse(function (child) {
            if (child.isMesh) {
                child.castShadow = true; // Permitir que a malha emita sombras
                child.receiveShadow = true; // Permitir que a malha receba sombras
                child.material = new THREE.MeshStandardMaterial({ color: 0xffffff});
            }
        });

        var transforms = [
            { position: { x: 0, y: 0.5, z: 0.75 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 0.5 } },
            { position: { x: 0, y: 2.8, z: -0.6 }, rotation: { x: 0, y: 180, z: 0 }, scale: { x: 0.9, y: 0.9, z: 0.5 } },
            { position: { x: 0.6, y: 2, z: 0 }, rotation: { x: 0, y: 90, z: 0 }, scale: { x: 1, y: 1, z: 0.5 } },
            { position: { x: -0.4, y: 2.5, z: 0.4 }, rotation: { x: 0, y: -45, z: 0 }, scale: { x: 0.6, y: 0.6, z: 0.3 } }
        ];

        transforms.forEach(function (transform) {
            var newObj = gltf.scene.clone();
            newObj.position.set(transform.position.x, transform.position.y, transform.position.z);

            var rotationInRadians = {
                x: transform.rotation.x * Math.PI / 180,
                y: transform.rotation.y * Math.PI / 180,
                z: transform.rotation.z * Math.PI / 180
            };
            newObj.rotation.set(rotationInRadians.x, rotationInRadians.y, rotationInRadians.z);
            newObj.scale.set(transform.scale.x, transform.scale.y, transform.scale.z);

            torre.add(newObj);
        });
    },
    function (xhr) {
        console.log('Antenas de MW',(xhr.loaded / xhr.total * 100) + '% carregadas');
    },
    function (error) {
        console.error('Erro ao carregar antenas!', error);
    }
);

gltfLoader.load(
    './antenas/RFantena.glb',
    function (gltf) {
        gltf.scene.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
                child.castShadow = true; // Permitir que a malha emita sombras
                child.receiveShadow = true; // Permitir que a malha receba sombras
                child.material = new THREE.MeshStandardMaterial({ color: 0xffffff }); // Vermelho
            }
        });

        var transforms = [
            { position: { x: 0.35, y: 3.7, z: 0.35 }, rotation: { x: 5, y: 45, z: 0 }, scale: { x: 0.15, y: 0.8, z: 0.05 } },
            { position: { x: -0.35, y: 3.7, z: 0.35 }, rotation: { x: 5, y: -45, z: 0 }, scale: { x: 0.15, y: 0.8, z: 0.05 } },
            { position: { x: -0.35, y: 3.7, z: -0.35 }, rotation: { x: -5, y: 225, z: 0 }, scale: { x: 0.15, y: 0.8, z: 0.05 } },
            { position: { x: 0.35, y: 3.7, z: -0.35 }, rotation: { x: -5, y: -225, z: 0 }, scale: { x: 0.15, y: 0.8, z: 0.05 } }
          
        ];

        transforms.forEach(function (transform) {
            var newObj = gltf.scene.clone();
            newObj.position.set(transform.position.x, transform.position.y, transform.position.z);

            var rotationInRadians = {
                x: transform.rotation.x * Math.PI / 180,
                y: transform.rotation.y * Math.PI / 180,
                z: transform.rotation.z * Math.PI / 180
            };
            newObj.rotation.set(rotationInRadians.x, rotationInRadians.y, rotationInRadians.z);
            newObj.scale.set(transform.scale.x, transform.scale.y, transform.scale.z);

            torre.add(newObj);
        });
    },
    function (xhr) {
        console.log('Antenas de RF',(xhr.loaded / xhr.total * 100) + '% carregadas');
    },
    function (error) {
        console.error('Erro ao carregar antenas!', error);
    }
);

}

function onMouseDown(event) {
    isDragging = true;
    previousMousePosition = { x: event.clientX, y: event.clientY };
}

function onMouseUp() {
    isDragging = false;
}

function onMouseMove(event) {
    if (isDragging) {
        if (event.ctrlKey) {
            // Ajustar a orientação da cena
            const deltaMove = { x: event.clientX - previousMousePosition.x, y: event.clientY - previousMousePosition.y };
            const deltaRotationQuaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(
                toRadians(deltaMove.y * 1), toRadians(deltaMove.x * 1), 0, 'XYZ'
            ));
            torre.quaternion.multiplyQuaternions(deltaRotationQuaternion, torre.quaternion);
        } else {
            // Movimentar a cena em relação aos eixos X e Y
            const deltaX = event.clientX - previousMousePosition.x;
            const deltaY = event.clientY - previousMousePosition.y;
            torre.position.x += deltaX * 0.02; // Ajuste conforme necessário
            torre.position.y -= deltaY * 0.02; // Ajuste conforme necessário
        }
        previousMousePosition = { x: event.clientX, y: event.clientY };
    }
}

function onMouseWheel(event) {

    // Verifica se "Ctrl" está pressionado para rotacionar em relação ao eixo X
    if (event.shiftKey) {
        rotateX += event.deltaY * 0.02; // Ajuste conforme necessário para a velocidade de rotação
        torre.rotation.x = toRadians(rotateX);
    }
    // Verifica se "Shift" está pressionado para rotacionar em relação ao eixo Y
    else if (event.altKey) {
        rotateY += event.deltaY * 0.05; // Ajuste conforme necessário para a velocidade de rotação
        torre.rotation.y = toRadians(rotateY);
    }else{
        camera.position.z += event.deltaY * 0.005;
    }
}

function toRadians(degrees) {
    return degrees * Math.PI / 180;
}

document.addEventListener('wheel', onMouseWheel);
document.addEventListener('mousedown', onMouseDown);
document.addEventListener('mouseup', onMouseUp);
document.addEventListener('mousemove', onMouseMove);

document.getElementById("buttonCarregar").addEventListener("click", carregarTorre);

torre = createSqrTower( 1.8, 0.5, 9, 6.5, 0.06, 0.02, 0.03);
scene.add(torre);
carregarAntenas();
//planeXY();
//xyzLines(); 

function carregarTorre() {
    // Obter os valores dos campos de entrada
    var base = parseFloat(document.getElementById("base").value);
    var altura = parseFloat(document.getElementById("altura").value);
    var inclinado = parseFloat(document.getElementById("inclinado").value);
    var topo = parseFloat(document.getElementById("topo").value);
    var tipoTorre = document.getElementById("tipoTorre").value;

    // Limpar a torre anterior, se houver
    if (torre.children.length > 0) {
        torre.remove(...torre.children);
    }    

    // Verificar se os campos não estão vazios e se são números positivos
    if (base > 0 && topo > 0 && altura > 0 && inclinado > 0 && tipoTorre !== '') {
        torre = createSqrTower( base, topo, altura, inclinado, 0.06, 0.02, 0.03);
        scene.add(torre);
       //carregarAntenas();
    } else {
        console.log('Preencha todos os campos com números positivos.');
    }
}

// Renderização da cena
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();