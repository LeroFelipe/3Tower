import * as THREE from './lib/three.module.js';
import * as GLTFLoader from './lib/GLTFLoader.js';
import { createSqrTower, createTriTower, createMastro, createPoste} from './lib/towers.js';

const windowSize = 0.95;
export var torre = new THREE.Group();

// Variáveis para controlar a rotação da cena em relação aos eixos X e Y
let rotateX = 0;
let rotateY = 0;

// Variáveir da Torre
let base, tamanho, inclinado, topo, tipoTorre, diametroBase, diametroTopo, diametro;

// Configuração da cena, câmera e renderizador
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const canvas = document.querySelector("canvas.webgl");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });

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

// Para lidar com eventos do mouse sobre às antenas
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

// Posicionamento da câmera
camera.position.z = 7;

class Antena {
    constructor(operadora, tipo, fabricante, modelo, portadora, altura, comprimento, largura, profundidade, diametro, azimute, tiltMecanico, status) {
        this.operadora = operadora;
        this.tipo = tipo;
        this.fabricante = fabricante;
        this.modelo = modelo;
        this.portadora = portadora;
        this.altura = altura;       
        this.comprimento = comprimento;
        this.largura = largura;
        this.profundidade = profundidade;
        this.diametro = diametro;
        this.azimute = azimute;   
        this.tiltMecanico = tiltMecanico;
        this.status = status;
    }
}

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

function carregarCSV(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const contents = e.target.result;
            const lines = contents.split('\n');

            const data = [];
            const headers = lines[0].split(',').map(header => header.trim());

            for (let i = 1; i < lines.length; i++) {
                const values = lines[i].split(',').map(value => value.trim());

                if (values.length === 1 && values[0] === '') continue;

                const rowData = {};
                headers.forEach((header, index) => {
                    rowData[header] = values[index] || null;
                });

                data.push(rowData);
            }

            resolve(data);
        };
        reader.onerror = function(error) {
            reject(error);
        };
        reader.readAsText(file);
    });
}

function carregarAntenas(data) {
    const gltfLoader = new GLTFLoader.GLTFLoader();

    const carregarModelo = (path) => {
        return new Promise((resolve, reject) => {
            gltfLoader.load(
                path,
                function (gltf) {
                    gltf.scene.traverse(function (child) {
                        if (child.isMesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                            child.material = new THREE.MeshStandardMaterial({ color: 0xffffff });
                        }
                    });
                    resolve(gltf);
                },
                function (xhr) {
                    console.log(`${path} ${(xhr.loaded / xhr.total * 100)}% carregado`);
                },
                function (error) {
                    console.error(`Erro ao carregar ${path}!`, error);
                    reject(error);
                }
            );
        });
    };

    Promise.all([
        carregarModelo('./antenas/MWantena.glb'),
        carregarModelo('./antenas/RFantena.glb')
    ]).then(([MWgltf, RFgltf]) => {
        data.forEach(antenaData => {
            let gltf;
            if (antenaData.TIPO === 'MW') {
                gltf = MWgltf;
            } else if (antenaData.TIPO === 'RF') {
                gltf = RFgltf;
            }else{
                return;
            }

            const newObj = gltf.scene.clone();

            let posX = 0;
            let posZ = 0;

            const azimute = parseFloat(antenaData['AZIMUTE']);

            if (azimute <= 45 || azimute > 315) {
                posX = 0;
                posZ = topo;
            } else if (azimute <= 135) {
                posX = -topo;
                posZ = 0;
            } else if (azimute <= 225) {
                posX = 0;
                posZ = -topo;
            } else if (azimute <= 315) {
                posX = topo;
                posZ = 0;
            }

            if (tipoTorre === "Quadrada"){
                newObj.position.set(posX, parseFloat(antenaData['ALTURA [m]']) - (tamanho/2), posZ);
            }else{
                newObj.position.set(0, parseFloat(antenaData['ALTURA [m]']) - (tamanho/2), 0);
            }

            const rotationInRadians = {
                x: 0,
                y: -parseFloat(antenaData['AZIMUTE']) * Math.PI / 180,
                z: 0
            };
            newObj.rotation.set(rotationInRadians.x, rotationInRadians.y, rotationInRadians.z);
            newObj.scale.set(
                parseFloat(antenaData['LARGURA [m]']) || parseFloat(antenaData['DIÂMETRO [m]']) || 1,
                parseFloat(antenaData['COMPRIMENTO [m]']) || parseFloat(antenaData['DIÂMETRO [m]']) || 1,
                parseFloat(antenaData['PROFUNDIDADE [m]']) || 0.5
            );

            let corMaterial;
            switch (antenaData['STATUS']) {
                case 'existente':
                    corMaterial = 0xffffff; // Branco
                    break;
                case 'a instalar':
                    corMaterial = 0xff0000; // Vermelho
                    break;
                case 'a retirar':
                    corMaterial = 0xff00ff; // Magenta
                    break;
                default:
                    corMaterial = 0xffffff; // Branco (padrão)
                    break;
            }

            newObj.traverse(function (child) {
                if (child.isMesh) {
                    child.material = new THREE.MeshStandardMaterial({ color: corMaterial });
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            // Criar uma instância da classe Antena
            const antena = new Antena(
                antenaData['OPERADORA'],
                antenaData['TIPO'],
                antenaData['FABRICANTE'],
                antenaData['MODELO'],
                antenaData['PORTADORA [Mhz]'],
                antenaData['ALTURA [m]'],
                antenaData['COMPRIMENTO [m]'],
                antenaData['LARGURA [m]'],                
                antenaData['PROFUNDIDADE [m]'],
                antenaData['DIÂMETRO [m]'],
                antenaData['AZIMUTE'],                
                antenaData['TILT. MECÂNICO'],
                antenaData['STATUS']
            );

            // Associar a antena ao objeto 3D
            newObj.userData.antena = antena;
            newObj.traverse(child => {
                if (child.isMesh) {
                    child.userData.antena = antena;
                }
            });

            torre.add(newObj);
        });
    }).catch(error => {
        console.error('Erro ao carregar modelos de antenas:', error);
    });
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

function onDocumentMouseClick(event) {
    event.preventDefault();

    // Calcular as coordenadas do mouse em relação ao canvas
    const rect = canvas.getBoundingClientRect();
    const mouseX = ((event.clientX - rect.left) / canvas.clientWidth) * 2 - 1;
    const mouseY = - ((event.clientY - rect.top) / canvas.clientHeight) * 2 + 1;

    mouse.x = mouseX;
    mouse.y = mouseY;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(torre.children, true);

    if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;
        const antena = intersectedObject.userData.antena; // Acessar os dados da antena
        if (antena) {
            console.log('Propriedades da Antena:', antena);
        } else {
            console.log('Objeto intersectado não tem dados de antena:', intersectedObject);
        }
    } else {
        console.log('Nenhuma interseção detectada.');
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

canvas.addEventListener('click', onDocumentMouseClick, false);
canvas.addEventListener('wheel', onMouseWheel);
canvas.addEventListener('mousedown', onMouseDown);
canvas.addEventListener('mouseup', onMouseUp);
canvas.addEventListener('mousemove', onMouseMove);

torre = createSqrTower( 1.8, 0.5, 9, 6.5, 0.12, 0.04, 0.06);
//torre = createTriTower( 1.8, 0.5, 9, 6.5, 0.06, 0.02, 0.03);

scene.add(torre);
//planeXY();
//xyzLines(); 

document.getElementById("loadButton").addEventListener("click", function() {
    base = parseFloat(document.getElementById("base").value);
    tamanho = parseFloat(document.getElementById("tamanho").value);
    inclinado = parseFloat(document.getElementById("inclinado").value);
    topo = parseFloat(document.getElementById("topo").value);
    tipoTorre = document.getElementById("tipoTorre").value;
    diametroBase = parseFloat(document.getElementById("diametroBase").value);
    diametroTopo = parseFloat(document.getElementById("diametroTopo").value);
    diametro = parseFloat(document.getElementById("diametro").value);
    const fileInput = document.getElementById('csvFile');
    const file = fileInput.files[0];

    // Verificar os campos comuns a todos os tipos de torres
    if (base <= 0 || tamanho <= 0) {
        alert('Preencha os campos "Base" e "Tamanho" com números positivos.');
        return;
    }

    // Limpar a torre anterior, se houver
    if (torre.children.length > 0) {
        torre.remove(...torre.children);
    }

    // Verificar os campos de acordo com o tipo de torre selecionado
    switch (tipoTorre) {
        case 'Quadrada':
            if (topo <= 0 || inclinado <= 0) {
                alert('Preencha os campos "Topo" e "Inclinado" com números positivos.');
                return;
            }
            torre = createSqrTower(base, topo, tamanho, inclinado, 0.12, 0.04, 0.06);
            break;
        case 'Triangular':
            if (topo <= 0 || inclinado <= 0) {
                alert('Preencha os campos "Topo" e "Inclinado" com números positivos.');
                return;
            }
            torre = createTriTower(base, topo, tamanho, inclinado, 0.12, 0.04, 0.06);
            break;
        case 'Poste':
            if (diametroBase <= 0 || diametroTopo <= 0) {
                alert('Preencha os campos "Diâmetro da Base" e "Diâmetro do Topo" com números positivos.');
                return;
            }
            torre = createPoste(diametroBase, diametroTopo, tamanho);
            break;
        case 'Estaiada':
            if (tamanho <= 0) {
                alert('Preencha o campo "Tamanho" com um número positivo.');
                return;
            }
            torre = createEstaiada(base, tamanho);
            break;
        case 'Mastro':
            if (diametro <= 0) {
                alert('Preencha o campo "Diâmetro" com um número positivo.');
                return;
            }
            torre = createMastro(diametro, tamanho);
            break;
        default:
            alert('Selecione um tipo de torre válido.');
            return;
    }

    // Adicionar a torre à cena
    scene.add(torre);

    if (file) {
        carregarCSV(file).then(data => {
            carregarAntenas(data);
        }).catch(error => {
            console.error('Erro ao carregar o arquivo CSV:', error);
        });
    } else {
        console.error('Por favor, selecione um arquivo CSV.');
    }    
});  

// Renderização da cena
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();