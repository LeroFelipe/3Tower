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

// Para lidar com eventos de pressionar o botão do mouse
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

// Para lidar com eventos do mouse sobre às antenas
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();

// Variável para armazenar a antena atualmente destacada
let highlightedAntena = null;
let originalMaterial = null;
const highlightMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00, emissive: 0x333333 });

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

// Posicionamento da câmera
camera.position.z = 7;

class Antena {
    constructor(operadora, tipo, suporte, fabricante, modelo, portadora, altura, comprimento, largura, profundidade, diametro, azimute, tiltMecanico, status) {
        this.operadora = operadora;
        this.tipo = tipo;
        this.suporte = suporte;
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

            // Salvar dados no local storage
            localStorage.setItem('csvData', JSON.stringify(data));

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
            let emissiveColor;
            switch (antenaData['STATUS']) {
                case 'existente':
                    corMaterial = 0xffffff; // Branco
                    emissiveColor = 0x000000;
                    break;
                case 'a instalar':
                    corMaterial = 0x00ff00;
                    emissiveColor = 0x000000;
                    break;
                case 'a retirar':
                    corMaterial = 0x555555;
                    emissiveColor = 0x333333;
                    break;
                default:
                    corMaterial = 0xffffff; // Branco (padrão)
                    emissiveColor = 0x000000;
                    break;
            }

            newObj.traverse(function (child) {
                if (child.isMesh) {
                    child.material = new THREE.MeshStandardMaterial({ color: corMaterial, emissive: emissiveColor });
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            // Criar uma instância da classe Antena
            const antena = new Antena(
                antenaData['OPERADORA'],
                antenaData['TIPO'],
                antenaData['SUPORTE'],
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
    hidePopup();
    isDragging = true;
    previousMousePosition = { x: event.clientX, y: event.clientY };
}

function onMouseUp() {
    isDragging = false;
}

function onMouseMove(event) {
    // Verificar se está arrastando
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

    const rect = canvas.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / canvas.clientWidth) * 2 - 1;
    mouse.y = - ((event.clientY - rect.top) / canvas.clientHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(torre.children, true);

    if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;
    
        // Verificar se é uma antena
        const antena = intersectedObject.userData?.antena;
    
        if (antena) {
            // Se a antena destacada mudou
            if (highlightedAntena !== intersectedObject) {
                // Reverter o material da antena anteriormente destacada
                if (highlightedAntena) {
                    highlightedAntena.material = originalMaterial;
                }
    
                // Destacar a nova antena
                highlightedAntena = intersectedObject;
                originalMaterial = intersectedObject.material;
                intersectedObject.material = highlightMaterial;
            }
        } else {
            // Se o objeto interseccionado não for uma antena, reverter o material da antena destacada
            if (highlightedAntena) {
                highlightedAntena.material = originalMaterial;
                highlightedAntena = null;
            }
        }
    } else {
        // Se não houver interseção, reverter o material da antena destacada
        if (highlightedAntena) {
            highlightedAntena.material = originalMaterial;
            highlightedAntena = null;
        }
    }
}

function onMouseWheel(event) {

    hidePopup();

    // Verifica se "Shift" está pressionado para rotacionar em relação ao eixo x
    if (event.shiftKey) {
        rotateX += event.deltaY * 0.02; // Ajuste conforme necessário para a velocidade de rotação
        torre.rotation.x = toRadians(rotateX);
    }
    // Verifica se "Alt" está pressionado para rotacionar em relação ao eixo y
    else if (event.altKey) {
        rotateY += event.deltaY * 0.05; // Ajuste conforme necessário para a velocidade de rotação
        torre.rotation.y = toRadians(rotateY);
    }else{
        camera.position.z += event.deltaY * 0.005;
    }
}

function onCanvasMouseClick(event) {
    event.preventDefault();

    // Calcular as coordenadas do mouse em relação ao canvas
    const rect = canvas.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / canvas.clientWidth) * 2 - 1;
    mouse.y = - ((event.clientY - rect.top) / canvas.clientHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(torre.children, true);

    if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;
        const antena = intersectedObject.userData.antena; // Acessar os dados da antena
        if (antena) {
            console.log('Propriedades da Antena:', antena);
            showPopup(event.clientX, event.clientY, antena);
        } else {
            console.log('Objeto intersectado não tem dados de antena:', intersectedObject);
        }
    } else {
        console.log('Nenhuma interseção detectada.');
    }
}

function showPopup(x, y, antena) {
    // Criar ou obter o elemento popup
    let popup = document.getElementById('popup');
    if (!popup) {
        popup = document.createElement('div');
        popup.id = 'popup';
        document.body.appendChild(popup);
    }

    let statusClass = '';
    if (antena.status === 'a retirar') {
        statusClass = 'status-a-retirar';
    } else if (antena.status === 'existente') {
        statusClass = 'status-existente';
    } else if (antena.status === 'a instalar') {
        statusClass = 'status-a-instalar';
    }

    // Preencher o popup com as propriedades da antena
    popup.innerHTML = `
        <strong>Propriedades da Antena:</strong><br>
        ${antena.operadora ? `Operadora: ${antena.operadora}<br>` : ''}
        ${antena.tipo ? `Tipo: ${antena.tipo}<br>` : ''}
        ${antena.suporte ? `Suporte: ${antena.suporte}<br>` : ''}
        ${antena.fabricante ? `Fabricante: ${antena.fabricante}<br>` : ''}
        ${antena.modelo ? `Modelo: ${antena.modelo}<br>` : ''}
        ${antena.portadora ? `Portadora: ${antena.portadora} Mhz<br>` : ''}
        ${antena.altura ? `Altura: ${antena.altura} m<br>` : ''}
        ${antena.comprimento ? `Comprimento: ${antena.comprimento} m<br>` : ''}
        ${antena.largura ? `Largura: ${antena.largura} m<br>` : ''}
        ${antena.profundidade ? `Profundidade: ${antena.profundidade} m<br>` : ''}
        ${antena.diametro ? `Diâmetro: ${antena.diametro} m<br>` : ''}
        ${antena.azimute ? `Azimute: ${antena.azimute}°<br>` : ''}
        ${antena.tiltMecanico ? `Tilt Mecânico: ${antena.tiltMecanico}°<br>` : ''}
        ${antena.status ? `Status: <span class="${statusClass}">${antena.status}</span>` : ''}
    `;

    // Posicionar o popup nas coordenadas do mouse
    popup.style.left = `${x+35}px`;
    popup.style.top = `${y-33}px`;

    // Tornar o popup visível
    popup.style.display = 'block';
}

function hidePopup() {
    const popup = document.getElementById('popup');
    if (popup) {
        popup.style.display = 'none';
    }
}

function toRadians(degrees) {
    return degrees * Math.PI / 180;
}

function salvarDados() {
    localStorage.setItem('tipoTorre', document.getElementById('tipoTorre').value);
    localStorage.setItem('base', document.getElementById('base').value);
    localStorage.setItem('tamanho', document.getElementById('tamanho').value);
    localStorage.setItem('inclinado', document.getElementById('inclinado').value);
    localStorage.setItem('topo', document.getElementById('topo').value);
    localStorage.setItem('diametroBase', document.getElementById('diametroBase').value);
    localStorage.setItem('diametroTopo', document.getElementById('diametroTopo').value);
    localStorage.setItem('diametro', document.getElementById('diametro').value);
}

function carregarDados() {
    if (localStorage.getItem('tipoTorre')) {
        document.getElementById('tipoTorre').value = localStorage.getItem('tipoTorre');
    }
    if (localStorage.getItem('base')) {
        document.getElementById('base').value = localStorage.getItem('base');
    }
    if (localStorage.getItem('tamanho')) {
        document.getElementById('tamanho').value = localStorage.getItem('tamanho');
    }
    if (localStorage.getItem('inclinado')) {
        document.getElementById('inclinado').value = localStorage.getItem('inclinado');
    }
    if (localStorage.getItem('topo')) {
        document.getElementById('topo').value = localStorage.getItem('topo');
    }
    if (localStorage.getItem('diametroBase')) {
        document.getElementById('diametroBase').value = localStorage.getItem('diametroBase');
    }
    if (localStorage.getItem('diametroTopo')) {
        document.getElementById('diametroTopo').value = localStorage.getItem('diametroTopo');
    }
    if (localStorage.getItem('diametro')) {
        document.getElementById('diametro').value = localStorage.getItem('diametro');
    }
}

function validateFields() {
    let isValid = true;

    let tipoTorreError = document.getElementById('tipoTorreError');
    let baseError = document.getElementById('baseError');
    let tamanhoError = document.getElementById('tamanhoError');
    let inclinadoError = document.getElementById('inclinadoError');
    let topoError = document.getElementById('topoError');
    let diametroBaseError = document.getElementById('diametroBaseError');
    let diametroTopoError = document.getElementById('diametroTopoError');
    let diametroError = document.getElementById('diametroError');

    // Reset error messages
    tipoTorreError.style.display = 'none';
    baseError.style.display = 'none';
    tamanhoError.style.display = 'none';
    inclinadoError.style.display = 'none';
    topoError.style.display = 'none';
    diametroBaseError.style.display = 'none';
    diametroTopoError.style.display = 'none';
    diametroError.style.display = 'none';

    if (!tipoTorre) {
        tipoTorreError.innerText = 'Selecione o tipo de torre.';
        tipoTorreError.style.display = 'block';
        isValid = false;
    }

    if (tipoTorre === 'Quadrada' || tipoTorre === 'Triangular') {
        if (isNaN(base) || base <= 0) {
            baseError.innerText = 'Digite um valor válido.';
            baseError.style.display = 'block';
            isValid = false;
        }

        if (isNaN(tamanho) || tamanho <= 0) {
            tamanhoError.innerText = 'Digite um valor válido.';
            tamanhoError.style.display = 'block';
            isValid = false;
        }

        if (isNaN(inclinado) || inclinado <= 0) {
            inclinadoError.innerText = 'Digite um valor válido.';
            inclinadoError.style.display = 'block';
            isValid = false;
        }

        if (isNaN(topo) || topo <= 0) {
            topoError.innerText = 'Digite um valor válido.';
            topoError.style.display = 'block';
            isValid = false;
        }
    }

    if (tipoTorre === 'Poste') {
        if (isNaN(tamanho) || tamanho <= 0) {
            tamanhoError.innerText = 'Digite um valor válido.';
            tamanhoError.style.display = 'block';
            isValid = false;
        }

        if (isNaN(diametroBase) || diametroBase <= 0) {
            diametroBaseError.innerText = 'Digite um valor válido.';
            diametroBaseError.style.display = 'block';
            isValid = false;
        }

        if (isNaN(diametroTopo) || diametroTopo <= 0) {
            diametroTopo.innerText = 'Digite um valor válido.';
            diametroTopoError.style.display = 'block';
            isValid = false;
        }
    }

    if (tipoTorre === 'Mastro') {
        if (isNaN(tamanho) || tamanho <= 0) {
            tamanhoError.innerText = 'Digite um valor válido.';
            tamanhoError.style.display = 'block';
            isValid = false;
        }

        if (isNaN(diametro) || diametro <= 0) {
            diametroError.innerText = 'Digite um valor válido.';
            diametroError.style.display = 'block';
            isValid = false;
        }
    }

    return isValid;

}

function onLoadButtonClick() {

    base = parseFloat(document.getElementById("base").value.replace(',', '.'));
    tamanho = parseFloat(document.getElementById("tamanho").value.replace(',', '.'));
    inclinado = parseFloat(document.getElementById("inclinado").value.replace(',', '.'));
    topo = parseFloat(document.getElementById("topo").value.replace(',', '.'));
    tipoTorre = document.getElementById("tipoTorre").value;
    diametroBase = parseFloat(document.getElementById("diametroBase").value.replace(',', '.'));
    diametroTopo = parseFloat(document.getElementById("diametroTopo").value.replace(',', '.'));
    diametro = parseFloat(document.getElementById("diametro").value.replace(',', '.'));
    const fileInput = document.getElementById('csvFile');
    const file = fileInput.files[0];

    if (!validateFields()) {
        return;
    }

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
            torre = createSqrTower(base, topo, tamanho, inclinado, 0.12, 0.04, 0.06);
            break;
        case 'Triangular':
            torre = createTriTower(base, topo, tamanho, inclinado, 0.12, 0.04, 0.06);
            break;
        case 'Poste':
            torre = createPoste(diametroBase, diametroTopo, tamanho);
            break;
        case 'Estaiada':
            torre = createEstaiada(base, tamanho);
            break;
        case 'Mastro':
            torre = createMastro(diametro, tamanho);
            break;
        default:
            alert('Selecione um tipo de torre!');
            return;
    }

    scene.add(torre);
    //xyzLines();

    if (file) {
        carregarCSV(file).then(data => {
            carregarAntenas(data);
        }).catch(error => {
            console.error('Erro ao carregar o arquivo CSV:', error);
        });
    } else {
        const csvData = localStorage.getItem('csvData');
        if (csvData) {
            carregarAntenas(JSON.parse(csvData));
        } else {
            console.error('Por favor, selecione um arquivo CSV.');
        }
    }   
    
    salvarDados();
}

document.getElementById("loadButton").addEventListener('click', onLoadButtonClick);
canvas.addEventListener('click', onCanvasMouseClick, false);
canvas.addEventListener('wheel', onMouseWheel);
canvas.addEventListener('mousedown', onMouseDown);
canvas.addEventListener('mouseup', onMouseUp);
canvas.addEventListener('mousemove', onMouseMove);

window.onload = function() {
    carregarDados();
    updateForm();
    if (localStorage.getItem('tipoTorre')){
        document.getElementById("loadButton").click(); 
    }       
};

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();