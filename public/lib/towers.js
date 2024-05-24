import * as THREE from './three.module.js';
import { torre } from '../script.js';

// Função para criar torre quadrada
export function createSqrTower(b, c, h, h1, raioCanto, raioFace, raioCantoFinal){

    var y = -h/2;
    var y2 = h1 - (h/2);
    
    var raioCanto = 0.06
    var raioFace = 0.02;
    var raioCantoFinal = 0.03

    var incremento = b;
    var dif;

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

    for (var n = 0; y + incremento <= (h1 - (h/2)) + 0.01; n++ ){

        var dist = (b/2) + (((y+incremento)+(h/2))/h1)*((c-b)/2);

        y = y + incremento;

        incremento = dist * 2;
    }

    console.log(n, y, h1 - (h/2));
    dif = ((h1-(h/2)) - y) / (n - 1);
    incremento = b + dif;
    y = -h/2;

    // Adicionar os cilindros das faces à cena
    while (y + incremento <= (h1 - (h/2)) + 0.01){

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

        incremento = (x1 * 2) + dif;

    };

    while (y2 + ((h - h1) / Math.floor(h - h1)) <=  h/2 + 0.01){ // Trecho reto '0.01' de tolerância

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

    return torre;
}

export function createTriTower(b, c, h, h1, raioCanto, raioFace, raioCantoFinal){

    var y = -h/2;
    var y2 = h1 - (h/2);
    
    var raioCanto = 0.06
    var raioFace = 0.02;
    var raioCantoFinal = 0.03

    var incremento = b;
    var dif;

    const raiz3 = Math.sqrt(3);

    // Definir as posições dos vértices da torre
    var vertices = [

        // BASE
        new THREE.Vector3(b/2, (-h/2), (b * raiz3) / 6), // A
        new THREE.Vector3(-b/2, (-h/2), (b * raiz3) / 6), // B
        new THREE.Vector3(0, (-h/2), -((b * raiz3) / 3)), // C

        // MEIO 
        new THREE.Vector3(c/2, (h1-(h/2)), (c * raiz3) / 6), // A
        new THREE.Vector3(-c/2, (h1-(h/2)), (c * raiz3) / 6), // B
        new THREE.Vector3(0, (h1-(h/2)), -((c * raiz3) / 3)), // C      

        // TOPO
        new THREE.Vector3(c/2, (h-(h/2)), (c * raiz3) / 6), // A
        new THREE.Vector3(-c/2, (h-(h/2)), (c * raiz3) / 6), // B
        new THREE.Vector3(0, (h-(h/2)), -((c * raiz3) / 3)) // C             

    ];

    // Definir as arestas da Torre
    var edges = [

        // Canto A
        [0, 3], [3, 6],

        // Canto B
        [1, 4], [4, 7],

        // Canto C
        [2, 5], [5, 8]

    ];

    // Adicionar os cilindros dos cantos à cena
    for (var i = 0; i < edges.length; i++) {
        var verticesIndex1 = edges[i][0];
        var verticesIndex2 = edges[i][1];

        var start = vertices[verticesIndex1];
        var end = vertices[verticesIndex2];

        if(verticesIndex1 >= 3){
            cilindro(start, end, raioCantoFinal, raioCantoFinal);
        }else{
            cilindro(start, end, raioCanto, raioCantoFinal);
        };     
    };

    for (var n = 0; y + incremento <= (h1 - (h/2)) + 0.01; n++ ){

        var dist = (b/2) + (((y+incremento)+(h/2))/h1)*((c-b)/2);
        

        y = y + incremento;

        incremento = dist * 2;
    };

    dif = ((h1-(h/2)) - y) / (n - 1);
    incremento = b + dif;
    y = -h/2;

    // Adicionar os cilindros das faces à cena
    while (y + incremento <= (h1 - (h/2)) + 0.01){

        var x = (b/2) + ((((2*y) + h)*(c-b))/(4*h1));
        var z = ((b*raiz3*h1) + (y*(c-b)*raiz3) + ((h*(c-b)*raiz3)/2)) / ( 6 * h1);

        var x1 = (b/2) + ((((2*(y + incremento)) + h)*(c-b))/(4*h1));
        var z1 = ((b*raiz3*h1) + ((y + incremento)*(c-b)*raiz3) + ((h*(c-b)*raiz3)/2)) / ( 6 * h1);

        var z0 = -((b*raiz3)/3)- ((((y + incremento)*(c-b) + ((h*(c-b))/2))*raiz3)/(3*h1));

        var start = new THREE.Vector3(x1, y + incremento, z1);
        var end = new THREE.Vector3(-x1, y + incremento, z1);

        var end1 = new THREE.Vector3(0, y + incremento, z0);

        // TESTE
        cilindro(start, end, raioFace, raioFace);
        cilindro(start, end1, raioFace, raioFace);
        cilindro(end, end1, raioFace, raioFace);

        y = y + incremento;

        incremento = (x1 * 2) + dif;

    };
      

    return torre;

}

export function createMastro(raio, h){


}

export function createPoste(b, c, h){


}

function cilindro(start, end, raioFinal, raio){
    var edgeVector = end.clone().sub(start);
    var edgeLength = edgeVector.length();

    var cylinderMaterial = new THREE.MeshStandardMaterial({ color: 0xffa500 });
    var edgeGeometry = new THREE.CylinderGeometry(raio, raioFinal, edgeLength, 16);
    var edge = new THREE.Mesh(edgeGeometry, cylinderMaterial);

    edge.position.set((start.x + end.x)/2 , (start.y + end.y)/2 , (start.z + end.z)/2 );

    // Calcular a orientação do cilindro
    edge.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), edgeVector.clone().normalize());
    
    edge.castShadow = true; // Permitir que o cilindro emita sombras
    edge.receiveShadow = true; // Permitir que o cilindro receba sombras

    torre.add(edge);
}