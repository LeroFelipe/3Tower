import * as THREE from './node_modules/three/build/three.module.js';

const windowSize = 0.95;

// Configuração da cena, câmera e renderizador
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth * windowSize, window.innerHeight * windowSize);
renderer.setClearColor(0xffffff);
renderer.shadowMap.enabled = true; // Habilitar mapeamento de sombras
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Tipo de sombra suave
document.body.appendChild(renderer.domElement);

// Variáveis para controlar a rotação da cena em relação aos eixos X e Y
let rotateX = 0;
let rotateY = 0;

var torre = new THREE.Group();

var h; // para adicionar o terreno em relação a altura da torre 

// Função para criar torre quadrada
function createSqrTower() {

    var b = 1.8;
    var c = 0.5;
    h = 8.5;
    var h1 = 6;

    var y = -h/2;
    var y2 = h1 - (h/2);
    
    var raioCanto = 0.06
    var raioFace = 0.02;
    var raioCantoFinal = 0.03

    var incremento = b;

    // Definir as posições dos vértices da torre
    var vertices = [

        // BASE
        new THREE.Vector3(b/2, (-h/2), b/2), // A
        new THREE.Vector3(-b/2, (-h/2), b/2), // B
        new THREE.Vector3(-b/2, (-h/2), -b/2), // C
        new THREE.Vector3(b/2, (-h/2), -b/2), // D

        // MEIO 
        new THREE.Vector3(c/2, (h1-(h/2)), c/2), // A
        new THREE.Vector3(-c/2, (h1-(h/2)), c/2), // B
        new THREE.Vector3(-c/2, (h1-(h/2)), -c/2), // C
        new THREE.Vector3(c/2, (h1-(h/2)), -c/2), // D        

        // TOPO
        new THREE.Vector3(c/2, (h-(h/2)), c/2), // A
        new THREE.Vector3(-c/2, (h-(h/2)), c/2), // B
        new THREE.Vector3(-c/2, (h-(h/2)), -c/2), // C
        new THREE.Vector3(c/2, (h-(h/2)), -c/2), // D              

    ];

    // Definir as arestas da Torre
    var edges = [

        // Canto A
        [0, 4], [4, 8],

        // Canto B
        [1, 5], [5, 9],
        
        // Canto C
        [2, 6], [6, 10],

        // Canto D        
        [3, 7], [7, 11]   

    ];

    // Adicionar os cilindros dos cantos à cena
    for (var i = 0; i < edges.length; i++) {
        var verticesIndex1 = edges[i][0];
        var verticesIndex2 = edges[i][1];

        var start = vertices[verticesIndex1];
        var end = vertices[verticesIndex2];

        if(verticesIndex1 >= 4){
            cilindro(start, end, raioCantoFinal, raioCantoFinal);
        }else{
            cilindro(start, end, raioCanto, raioCantoFinal);
        };     
    };

    // Adicionar os cilindros das faces à cena
    while (y + incremento <= (h1 - (h/2))){

        var x = (b/2) + ((y+(h/2))/h1)*((c-b)/2);
        var z = x;

        var x1 = (b/2) + (((y+incremento)+(h/2))/h1)*((c-b)/2);
        var z1 = x1;

        var xk = x/2;
        var zk = (b/2) + (((y+(incremento/2))+(h/2))/h1)*((c-b)/2);

        var xk1 = (b/2) + (((y+(incremento/2))+(h/2))/h1)*((c-b)/2);
        var zk1 = x/2;

        var start = new THREE.Vector3(x, y, z);
        var end = new THREE.Vector3(-x1, y + incremento, z1);
        var endk = new THREE.Vector3(0, y + incremento, z1);
        
        var start1 = new THREE.Vector3(-x, y, z);
        var end1 = new THREE.Vector3(x1, y + incremento, z1);
        var endk1 = new THREE.Vector3(-x1, y + incremento, 0);

        var start2 = new THREE.Vector3(-x, y, -z);
        var end2 = new THREE.Vector3(x1, y + incremento, -z1);
        var endk2 = new THREE.Vector3(0, y + incremento, -z1);

        var start3 = new THREE.Vector3(x, y, -z);
        var end3 = new THREE.Vector3(-x1, y + incremento, -z1);
        var endk3 = new THREE.Vector3(x1, y + incremento, 0);

        var endMeio = new THREE.Vector3(xk, y + incremento/2, zk);
        var endMeio1 = new THREE.Vector3(-xk, y + incremento/2, zk);
        var endMeio2 = new THREE.Vector3(-xk1, y + incremento/2, zk1);
        var endMeio3 = new THREE.Vector3(-xk1, y + incremento/2, -zk1);
        var endMeio4 = new THREE.Vector3(-xk, y + incremento/2, -zk);
        var endMeio5 = new THREE.Vector3(xk, y + incremento/2, -zk);
        var endMeio6 = new THREE.Vector3(xk1, y + incremento/2, -zk1);
        var endMeio7 = new THREE.Vector3(xk1, y + incremento/2, zk1);

        // FACE A
        cilindro(start, endk, raioFace, raioFace); // Barra transversal 'direita'
        cilindro(start1, endk, raioFace, raioFace); // Barra transversal 'esquerda'
        cilindro(end1, end, raioFace, raioFace); // Barra reta
        cilindro(end1, endMeio, raioFace, raioFace); // Barra 'K'
        cilindro(end, endMeio1, raioFace, raioFace); // Barra 'K'
        cilindro(endMeio, new THREE.Vector3(xk1, y+(incremento/2), zk), raioFace, raioFace); // Barra reta 'K'
        cilindro(endMeio1, new THREE.Vector3(-xk1, y+(incremento/2), zk), raioFace, raioFace); // Barra reta 'K'

        // FACE B
        cilindro(start1, endk1, raioFace, raioFace); // Barra transversal 'direita'
        cilindro(start2, endk1, raioFace, raioFace); // Barra transversal 'esquerda'
        cilindro(end, end3, raioFace, raioFace); // Barra reta
        cilindro(end, endMeio2, raioFace, raioFace); // Barra 'K'
        cilindro(end3, endMeio3, raioFace, raioFace); // Barra 'K'
        cilindro(endMeio2, new THREE.Vector3(-xk1, y+(incremento/2), zk), raioFace, raioFace); // Barra reta 'K'
        cilindro(endMeio3, new THREE.Vector3(-xk1, y+(incremento/2), -zk), raioFace, raioFace); // Barra reta 'K'

        // FACE C
        cilindro(start2, endk2, raioFace, raioFace); // Barra transversal 'direita'
        cilindro(start3, endk2, raioFace, raioFace); // Barra transversal 'esquerda'
        cilindro(end3, end2, raioFace, raioFace); // Barra reta
        cilindro(end3, endMeio4, raioFace, raioFace); // Barra 'K'
        cilindro(end2, endMeio5, raioFace, raioFace); // Barra 'K'
        cilindro(endMeio4, new THREE.Vector3(-xk1, y+(incremento/2), -zk), raioFace, raioFace); // Barra reta 'K'
        cilindro(endMeio5, new THREE.Vector3(xk1, y+(incremento/2), -zk), raioFace, raioFace); // Barra reta 'K'

        // FACE D
        cilindro(start3, endk3, raioFace, raioFace); // Barra transversal 'direita'
        cilindro(start, endk3, raioFace, raioFace); // Barra transversal 'esquerda'
        cilindro(end2, end1, raioFace, raioFace); // Barra reta
        cilindro(end2, endMeio6, raioFace, raioFace); // Barra 'K'
        cilindro(end1, endMeio7, raioFace, raioFace); // Barra 'K'
        cilindro(endMeio6, new THREE.Vector3(xk1, y+(incremento/2), -zk), raioFace, raioFace); // Barra reta 'K'
        cilindro(endMeio7, new THREE.Vector3(xk1, y+(incremento/2), zk), raioFace, raioFace); // Barra reta 'K'

        y = y + incremento;

        incremento = x1 * 2;

    };

    while (y2 + ((h - h1) / Math.floor(h - h1)) <=  h/2){

        //FACE A
        cilindro(new THREE.Vector3(-c/2, y2, c/2), new THREE.Vector3(c/2, y2 +((h - h1) / Math.floor(h - h1)), c/2), raioFace, raioFace);
        cilindro(new THREE.Vector3(c/2, y2, c/2), new THREE.Vector3(-c/2, y2 +((h - h1) / Math.floor(h - h1)), c/2), raioFace, raioFace);
        cilindro(new THREE.Vector3(-c/2, y2 +((h - h1) / Math.floor(h - h1)), c/2), new THREE.Vector3(c/2, y2 +((h - h1) / Math.floor(h - h1)), c/2), raioFace, raioFace);

        //FACE B
        cilindro(new THREE.Vector3(-c/2, y2, c/2), new THREE.Vector3(-c/2, y2 +((h - h1) / Math.floor(h - h1)), -c/2), raioFace, raioFace);
        cilindro(new THREE.Vector3(-c/2, y2, -c/2), new THREE.Vector3(-c/2, y2 +((h - h1) / Math.floor(h - h1)), c/2), raioFace, raioFace);
        cilindro(new THREE.Vector3(-c/2, y2 +((h - h1) / Math.floor(h - h1)), -c/2), new THREE.Vector3(-c/2, y2 +((h - h1) / Math.floor(h - h1)), c/2), raioFace, raioFace);

        //FACE C
        cilindro(new THREE.Vector3(-c/2, y2, -c/2), new THREE.Vector3(c/2, y2 +((h - h1) / Math.floor(h - h1)), -c/2), raioFace, raioFace);
        cilindro(new THREE.Vector3(c/2, y2, -c/2), new THREE.Vector3(-c/2, y2 +((h - h1) / Math.floor(h - h1)), -c/2), raioFace, raioFace);
        cilindro(new THREE.Vector3(c/2, y2 +((h - h1) / Math.floor(h - h1)), -c/2), new THREE.Vector3(-c/2, y2 +((h - h1) / Math.floor(h - h1)), -c/2), raioFace, raioFace);

        //FACE D
        cilindro(new THREE.Vector3(c/2, y2, -c/2), new THREE.Vector3(c/2, y2 +((h - h1) / Math.floor(h - h1)), c/2), raioFace, raioFace);
        cilindro(new THREE.Vector3(c/2, y2, c/2), new THREE.Vector3(c/2, y2 +((h - h1) / Math.floor(h - h1)), -c/2), raioFace, raioFace);
        cilindro(new THREE.Vector3(c/2, y2 +((h - h1) / Math.floor(h - h1)), c/2), new THREE.Vector3(c/2, y2 +((h - h1) / Math.floor(h - h1)), -c/2), raioFace, raioFace);


        y2 = y2 + ((h - h1) / Math.floor(h - h1));

    }; 

}

function cilindro(start, end, raioFinal, raio){
    var edgeVector = end.clone().sub(start);
    var edgeLength = edgeVector.length();

    var cylinderMaterial = new THREE.MeshPhongMaterial({ color: 0xd3d3d3 });
    var edgeGeometry = new THREE.CylinderGeometry(raio, raioFinal, edgeLength, 16);
    var edge = new THREE.Mesh(edgeGeometry, cylinderMaterial);

    edge.position.set((start.x + end.x)/2 , (start.y + end.y)/2 , (start.z + end.z)/2 );

    // Calcular a orientação do cilindro
    edge.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), edgeVector.clone().normalize());
    
    edge.castShadow = true; // Permitir que o cilindro emita sombras
    edge.receiveShadow = true; // Permitir que o cilindro receba sombras

    torre.add(edge);
}

function planeXY(){
    // Definir as dimensões do plano
    const larguraPlano = 100; // Largura do plano
    const alturaPlano = 100; // Altura do plano

    // Criar a geometria do plano
    const planeGeometry = new THREE.PlaneGeometry(larguraPlano, alturaPlano);

    // Criar um material branco
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

        var dashedLineMaterial = new THREE.LineDashedMaterial({ color: 0x000000, dashSize: 0.1, gapSize: 0.05 });
        var dashedLine = new THREE.Line(dashedLineGeometry, dashedLineMaterial);
        dashedLine.computeLineDistances(); // Computar distâncias para definir o padrão tracejado

        torre.add(dashedLine);
    };
}

createSqrTower();
scene.add(torre);
//xyzLines();
//planeXY();

// Posicionamento da câmera para visualizar o cubo
camera.position.z = 3.1;
scene.position.y = 2.5;

// Adicionar uma luz direcional para gerar sombras
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(8, 10, 10); // Posição da luz
light.castShadow = true; // Permitir que a luz gere sombras
scene.add(light);

// Configurar as propriedades de sombra da luz
light.shadow.mapSize.width = 1024; // Largura do mapa de sombras
light.shadow.mapSize.height = 1024; // Altura do mapa de sombras
light.shadow.camera.near = 0.5; // Distância próxima para renderização de sombra
light.shadow.camera.far = 50; // Distância distante para renderização de sombra

// Função para lidar com eventos de pressionar o botão do mouse
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

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
        rotateY += event.deltaY * 0.02; // Ajuste conforme necessário para a velocidade de rotação
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

// Renderização da cena
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();