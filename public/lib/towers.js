import * as THREE from './three.module.js';
import { torre } from '../script.js';

// Função para criar torre quadrada
export function createSqrTower(b, c, h, h1, diametroCanto, diametroFace, diametroCantoFinal){

    let y = -h/2;
    let y2 = h1 - (h/2);
    
    let incremento = b;
    const inc = Math.floor(((h / 2) - y2) / c);
    const resto = ((h / 2) - y2) % c;

    let dif;

    const raiz3 = Math.sqrt(3);
    let checkbase = true;

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
            cilindro(start, end, diametroCantoFinal, diametroCantoFinal);
        }else{
            cilindro(start, end, diametroCanto, diametroCantoFinal);
        };     
    };

    while (y + incremento <= y2 + 0.01){

        var dist = (b/2) + (((y+incremento)+(h/2))/h1)*((c-b)/2);

        y = y + incremento;

        incremento = dist * 2;
    };

    dif = ((h1-(h/2)) - y);
    incremento = b;
    y = -h/2;

    // Adicionar os cilindros das faces à cena
    while (y + incremento + dif <= y2 + 0.01){

        let A, B, C, D, x, z, k, k1, k2, k3, k4, k5, k6, k7, AA1d2, BB1d2, CC1d2, DD1d2;

        const x0 = (b/2) + (((y+incremento)+(h/2))/h1)*((c-b)/2);
        const x1 = (b/2) + (((y+incremento+dif)+(h/2))/h1)*((c-b)/2);
        const z1 = x1;
        
        if(checkbase){
            x = (b/2) + ((y+(h/2))/h1)*((c-b)/2);
            z = x;

            A = new THREE.Vector3(x, y, z);
            B = new THREE.Vector3(-x, y, z);
            C = new THREE.Vector3(-x, y, -z);
            D = new THREE.Vector3(x, y, -z);
            k =  new THREE.Vector3(x/2, y + ((incremento + dif)/2), (z + z1)/2);
            k1 = new THREE.Vector3(-x/2, y + ((incremento + dif)/2), (z + z1)/2);
            k2 = new THREE.Vector3(-(x + x1)/2, y + (incremento + dif)/2, z/2);
            k3 = new THREE.Vector3(-(x + x1)/2, y + (incremento + dif)/2, -z/2);
            k4 = new THREE.Vector3(-x/2, y + ((incremento + dif)/2), -(z + z1)/2);
            k5 = new THREE.Vector3(x/2, y + ((incremento + dif)/2), -(z + z1)/2);
            k6 = new THREE.Vector3((x + x1)/2, y + (incremento + dif)/2, -z/2);
            k7 = new THREE.Vector3((x + x1)/2, y + (incremento + dif)/2, z/2);
            AA1d2 = new THREE.Vector3((x + x1)/2, y + ((incremento+dif)/2), (z + z1)/2);
            BB1d2 = new THREE.Vector3(-(x + x1)/2, y + ((incremento+dif)/2), (z + z1)/2);
            CC1d2 = new THREE.Vector3(-(x + x1)/2, y + ((incremento+dif)/2), -(z + z1)/2);
            DD1d2 = new THREE.Vector3((x + x1)/2, y + ((incremento+dif)/2), -(z + z1)/2);

        }else{
            x = (b/2) + (((y+dif)+(h/2))/h1)*((c-b)/2);
            z = x;

            A = new THREE.Vector3(x, y + dif, z);
            B = new THREE.Vector3(-x, y + dif, z);
            C = new THREE.Vector3(-x, y + dif, -z);
            D = new THREE.Vector3(x, y + dif, -z); 
            k =  new THREE.Vector3(x/2, y + ((incremento + dif*2)/2), (z + z1)/2);      
            k1 =  new THREE.Vector3(-x/2, y + ((incremento + dif*2)/2), (z + z1)/2);
            k2 = new THREE.Vector3(-(x + x1)/2, y + (incremento + dif*2)/2, z/2);
            k3 = new THREE.Vector3(-(x + x1)/2, y + (incremento + dif*2)/2, -z/2);
            k4 =  new THREE.Vector3(-x/2, y + ((incremento + dif*2)/2), -(z + z1)/2); 
            k5 =  new THREE.Vector3(x/2, y + ((incremento + dif*2)/2), -(z + z1)/2); 
            k6 = new THREE.Vector3((x + x1)/2, y + (incremento + dif*2)/2, -z/2); 
            k7 = new THREE.Vector3((x + x1)/2, y + (incremento + dif*2)/2, z/2);
            AA1d2 = new THREE.Vector3((x + x1)/2, y + ((incremento+dif*2)/2), (z + z1)/2);   
            BB1d2 = new THREE.Vector3(-(x + x1)/2, y + ((incremento+dif*2)/2), (z + z1)/2);   
            CC1d2 = new THREE.Vector3(-(x + x1)/2, y + ((incremento+dif*2)/2), -(z + z1)/2);  
            DD1d2 = new THREE.Vector3((x + x1)/2, y + ((incremento+dif*2)/2), -(z + z1)/2); 

        }
        
        const A1 = new THREE.Vector3(x1, y + incremento + dif, z1);
        const B1 = new THREE.Vector3(-x1, y + incremento + dif, z1);
        const C1 = new THREE.Vector3(-x1, y + incremento + dif, -z1);
        const D1 = new THREE.Vector3(x1, y + incremento + dif, -z1);

        const A1B1d2 = new THREE.Vector3(0, y + incremento + dif, z1);
        const B1C1d2 = new THREE.Vector3(-x1, y + incremento + dif, 0);
        const C1D1d2 = new THREE.Vector3(0, y + incremento + dif, -z1);
        const A1D1d2 = new THREE.Vector3(x1, y + incremento + dif, 0);

        // FACE A
        cilindro(A1, B1, diametroFace, diametroFace); // LINHA RETA
        cilindro(A, A1B1d2, diametroFace, diametroFace); // LINHA DIAGONAL DIREITA
        cilindro(B, A1B1d2, diametroFace, diametroFace); // LINHA DIAGONAL ESQUERDA
        cilindro(A1, k, diametroFace, diametroFace); // LINHA 'K' DIREITA
        cilindro(k, AA1d2, diametroFace, diametroFace); // LINHA 'K' DIREITA RETA  
        cilindro(B1, k1, diametroFace, diametroFace); // LINHA 'K' ESQUERDA
        cilindro(k1, BB1d2, diametroFace, diametroFace); // LINHA 'K' ESQUERDA RETA

        // FACE B
        cilindro(B1, C1, diametroFace, diametroFace); // LINHA RETA
        cilindro(B, B1C1d2, diametroFace, diametroFace); // LINHA DIAGONAL DIREITA
        cilindro(C, B1C1d2, diametroFace, diametroFace); // LINHA DIAGONAL ESQUERDA
        cilindro(B1, k2, diametroFace, diametroFace); // LINHA 'K' DIREITA
        cilindro(k2, BB1d2, diametroFace, diametroFace); // LINHA 'K' DIREITA RETA 
        cilindro(C1, k3, diametroFace, diametroFace); // LINHA 'K' ESQUERDA
        cilindro(k3, CC1d2, diametroFace, diametroFace); // LINHA 'K' ESQUERDA RETA

        // FACE C
        cilindro(C1, D1, diametroFace, diametroFace); // LINHA RETA
        cilindro(C, C1D1d2, diametroFace, diametroFace); // LINHA DIAGONAL DIREITA
        cilindro(D, C1D1d2, diametroFace, diametroFace); // LINHA DIAGONAL ESQUERDA
        cilindro(C1, k4, diametroFace, diametroFace); // LINHA 'K' DIREITA
        cilindro(k4, CC1d2, diametroFace, diametroFace); // LINHA 'K' DIREITA RETA 
        cilindro(D1, k5, diametroFace, diametroFace); // LINHA 'K' ESQUERDA
        cilindro(k5, DD1d2, diametroFace, diametroFace); // LINHA 'K' ESQUERDA RETA

        // FACE D
        cilindro(D1, A1, diametroFace, diametroFace); // LINHA RETA
        cilindro(D, A1D1d2, diametroFace, diametroFace); // LINHA DIAGONAL DIREITA
        cilindro(A, A1D1d2, diametroFace, diametroFace); // LINHA DIAGONAL ESQUERDA
        cilindro(D1, k6, diametroFace, diametroFace); // LINHA 'K' DIREITA
        cilindro(k6, DD1d2, diametroFace, diametroFace); // LINHA 'K' DIREITA RETA
        cilindro(A1, k7, diametroFace, diametroFace); // LINHA 'K' ESQUERDA
        cilindro(k7, AA1d2, diametroFace, diametroFace); // LINHA 'K' ESQUERDA RETA
        
        y += incremento;

        incremento = x0 * 2;
        checkbase = false;

    };

    while (y2 + c + (resto/inc) <=  h/2 + 0.01){ // Trecho reto '0.01' de tolerância

        //FACE A
        cilindro(new THREE.Vector3(-c/2, y2, c/2), new THREE.Vector3(c/2, y2 + c + (resto/inc), c/2), diametroFace, diametroFace);
        cilindro(new THREE.Vector3(c/2, y2, c/2), new THREE.Vector3(-c/2, y2 + c + (resto/inc), c/2), diametroFace, diametroFace);
        cilindro(new THREE.Vector3(-c/2, y2 + c + (resto/inc), c/2), new THREE.Vector3(c/2, y2 + c + (resto/inc), c/2), diametroFace, diametroFace);

        //FACE B
        cilindro(new THREE.Vector3(-c/2, y2, c/2), new THREE.Vector3(-c/2, y2 + c + (resto/inc), -c/2), diametroFace, diametroFace);
        cilindro(new THREE.Vector3(-c/2, y2, -c/2), new THREE.Vector3(-c/2, y2 + c + (resto/inc), c/2), diametroFace, diametroFace);
        cilindro(new THREE.Vector3(-c/2, y2 + c + (resto/inc), -c/2), new THREE.Vector3(-c/2, y2 + c + (resto/inc), c/2), diametroFace, diametroFace);

        //FACE C
        cilindro(new THREE.Vector3(-c/2, y2, -c/2), new THREE.Vector3(c/2, y2 + c + (resto/inc), -c/2), diametroFace, diametroFace);
        cilindro(new THREE.Vector3(c/2, y2, -c/2), new THREE.Vector3(-c/2, y2 + c + (resto/inc), -c/2), diametroFace, diametroFace);
        cilindro(new THREE.Vector3(c/2, y2 + c + (resto/inc), -c/2), new THREE.Vector3(-c/2, y2 + c + (resto/inc), -c/2), diametroFace, diametroFace);

        //FACE D
        cilindro(new THREE.Vector3(c/2, y2, -c/2), new THREE.Vector3(c/2, y2 + c + (resto/inc), c/2), diametroFace, diametroFace);
        cilindro(new THREE.Vector3(c/2, y2, c/2), new THREE.Vector3(c/2, y2 + c + (resto/inc), -c/2), diametroFace, diametroFace);
        cilindro(new THREE.Vector3(c/2, y2 + c + (resto/inc), c/2), new THREE.Vector3(c/2, y2 + c + (resto/inc), -c/2), diametroFace, diametroFace);


        y2 += c + (resto/inc);

    }; 

    return torre;
}

export function createTriTower(b, c, h, h1, diametroCanto, diametroFace, diametroCantoFinal){

    let y = -h/2;
    let y2 = h1 - (h/2);
    
    let incremento = b;
    const inc = Math.floor(((h / 2) - y2) / c);
    const resto = ((h / 2) - y2) % c;

    let dif;

    const raiz3 = Math.sqrt(3);
    let checkbase = true;

    // Definir as posições dos vértices da torre
    const vertices = [

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
    const edges = [

        // Canto A
        [0, 3], [3, 6],

        // Canto B
        [1, 4], [4, 7],

        // Canto C
        [2, 5], [5, 8]

    ];

    // Adicionar os cilindros dos cantos à cena
    for (let i = 0; i < edges.length; i++) {
        const verticesIndex1 = edges[i][0];
        const verticesIndex2 = edges[i][1];

        const start = vertices[verticesIndex1];
        const end = vertices[verticesIndex2];

        if(verticesIndex1 >= 3){
            cilindro(start, end, diametroCantoFinal, diametroCantoFinal);
        }else{
            cilindro(start, end, diametroCanto, diametroCantoFinal);
        };     
    };

    while (y + incremento <= y2 + 0.01){

        const dist = (b/2) + ((((2*(y + incremento)) + h)*(c-b))/(4*h1));

        y = y + incremento;

        incremento = dist * 2;
    };

    dif = ((h1-(h/2)) - y);
    incremento = b;
    y = -h/2;

    // Adicionar os cilindros das faces à cena
    while (y + incremento + dif <= y2 + 0.01){

        let A, B, C, endk, endk1, endk2, endk3, endk4, endk5, AA1d2, BB1d2, CC1d2, x, xk, z0, z0k, z, zk;

        const x0 = (b/2) + ((((2*(y + incremento)) + h)*(c-b))/(4*h1));
        const x1 = (b/2) + ((((2*(y + incremento + dif)) + h)*(c-b))/(4*h1));
        const z1 = ((b*raiz3*h1) + ((y + incremento + dif )*(c-b)*raiz3) + ((h*(c-b)*raiz3)/2)) / ( 6 * h1);
        const z01 = -((b*raiz3)/3)- ((((y + incremento + dif)*(c-b) + ((h*(c-b))/2))*raiz3)/(3*h1));

        if (checkbase){
            x = (b/2) + ((((2*y) + h)*(c-b))/(4*h1));
            z = ((b*raiz3*h1) + (y*(c-b)*raiz3) + ((h*(c-b)*raiz3)/2)) / ( 6 * h1);
            xk = (b/2) + ((((2*(y + ((incremento + dif)/2))) + h)*(c-b))/(4*h1));
            zk = ((b*raiz3*h1) + ((y + ((incremento + dif)/2))*(c-b)*raiz3) + ((h*(c-b)*raiz3)/2)) / ( 6 * h1); 
            z0 =  -((b*raiz3)/3)- (((y*(c-b) + ((h*(c-b))/2))*raiz3)/(3*h1));  
            z0k = -((b*raiz3)/3)- ((((y + ((incremento + dif)/2))*(c-b) + ((h*(c-b))/2))*raiz3)/(3*h1));

            A = new THREE.Vector3(x,y,z);
            B = new THREE.Vector3(-x,y,z);
            C = new THREE.Vector3(0,y,z0);
            endk = new THREE.Vector3(x/2, y + ((incremento+dif)/2), zk);
            endk1 = new THREE.Vector3(-x/2, y + ((incremento+dif)/2), zk);
            endk2 = new THREE.Vector3(x1/4, y + (incremento+dif)/2,(z0-(z1/2))/2);
            endk3 = new THREE.Vector3(((2*x)+x1)/4, ((2*y)+incremento+dif)/2, ((2*z)-z1)/4);
            endk4 = new THREE.Vector3(-((2*x)+x1)/4, ((2*y)+incremento+dif)/2, ((2*z)-z1)/4);
            endk5 = new THREE.Vector3(-x1/4, y + (incremento+dif)/2,(z0-(z1/2))/2);
            AA1d2 = new THREE.Vector3(xk, y + ((incremento+dif)/2), zk);
            BB1d2 = new THREE.Vector3(-xk, y + ((incremento+dif)/2), zk);
            CC1d2 = new THREE.Vector3(0, y + ((incremento+dif)/2), z0k);

        }else{
            x = (b/2) + ((((2*(y+dif)) + h)*(c-b))/(4*h1));
            z = ((b*raiz3*h1) + ((y+dif)*(c-b)*raiz3) + ((h*(c-b)*raiz3)/2)) / ( 6 * h1);
            xk = (b/2) + ((((2*(y + ((incremento + dif*2)/2))) + h)*(c-b))/(4*h1));
            zk = ((b*raiz3*h1) + ((y + ((incremento + dif*2)/2))*(c-b)*raiz3) + ((h*(c-b)*raiz3)/2)) / ( 6 * h1);
            z0 = -((b*raiz3)/3)- ((((y + dif)*(c-b) + ((h*(c-b))/2))*raiz3)/(3*h1));
            z0k = -((b*raiz3)/3)- ((((y + ((incremento + dif*2)/2))*(c-b) + ((h*(c-b))/2))*raiz3)/(3*h1));

            A = new THREE.Vector3(x,y+dif,z);
            B = new THREE.Vector3(-x,y+dif,z);
            C = new THREE.Vector3(0,y+dif,z0);
            endk = new THREE.Vector3(x/2, y + ((incremento+dif*2)/2), zk);
            endk1 = new THREE.Vector3(-x/2, y + ((incremento+dif*2)/2), zk);
            endk2 = new THREE.Vector3(x1/4, y + (incremento+dif*2)/2,(z0-(z1/2))/2);
            endk3 = new THREE.Vector3(((2*x)+x1)/4, ((2*y)+incremento+dif*2)/2, ((2*z)-z1)/4);
            endk4 = new THREE.Vector3(-((2*x)+x1)/4, ((2*y)+incremento+dif*2)/2, ((2*z)-z1)/4);
            endk5 = new THREE.Vector3(-x1/4, y + (incremento+dif*2)/2,(z0-(z1/2))/2);
            AA1d2 = new THREE.Vector3(xk, y + ((incremento+dif*2)/2), zk);
            BB1d2 = new THREE.Vector3(-xk, y + ((incremento+dif*2)/2), zk);
            CC1d2 = new THREE.Vector3(0, y + ((incremento+dif*2)/2), z0k);
        }

        const A1 = new THREE.Vector3(x1, y + incremento + dif, z1);
        const B1 = new THREE.Vector3(-x1, y + incremento + dif, z1);
        const C1 = new THREE.Vector3(0, y + incremento + dif, z01);
        
        const A1B1d2 = new THREE.Vector3(0, y + incremento + dif, z1);        
        const A1C1d2 = new THREE.Vector3(x1/2, y + incremento + dif, -z1/2);
        const B1C1d2 = new THREE.Vector3(-x1/2, y + incremento + dif, -z1/2)
        
        // FACE A
        cilindro(A1, B1, diametroFace, diametroFace); // LINHA RETA
        cilindro(A, A1B1d2, diametroFace, diametroFace); // LINHA DIAGONAL DIREITA
        cilindro(B, A1B1d2, diametroFace, diametroFace); // LINHA DIAGONAL ESQUERDA
        cilindro(A1, endk, diametroFace, diametroFace); // LINHA 'K' DIREITA
        cilindro(endk, AA1d2, diametroFace, diametroFace); // LINHA 'K' DIREITA RETA        
        cilindro(B1, endk1, diametroFace, diametroFace); // LINHA 'K' ESQUERDA
        cilindro(endk1, BB1d2, diametroFace, diametroFace); // LINHA 'K' ESQUERDA RETA*/

        // FACE B
        cilindro(B1, C1, diametroFace, diametroFace); // LINHA RETA
        cilindro(B, B1C1d2, diametroFace, diametroFace); // LINHA DIAGONAL DIREITA 
        cilindro(C, B1C1d2, diametroFace, diametroFace); // LINHA DIAGONAL ESQUERDA
        cilindro(B1, endk4, diametroFace, diametroFace); // LINHA 'K' DIREITA
        cilindro(endk4, BB1d2, diametroFace, diametroFace); // LINHA 'K' DIREITA RETA
        cilindro(C1, endk5, diametroFace, diametroFace); // LINHA 'K' DIREITA
        cilindro(endk5, CC1d2, diametroFace, diametroFace); // LINHA 'K' DIREITA RETA 

        // FACE C
        cilindro(A1, C1, diametroFace, diametroFace); // LINHA RETA     
        cilindro(C, A1C1d2, diametroFace, diametroFace); // LINHA DIAGONAL DIREITA  
        cilindro(A, A1C1d2, diametroFace, diametroFace); // LINHA DIAGONAL ESQUERDA  
        cilindro(C1, endk2, diametroFace, diametroFace); // LINHA 'K' DIREITA
        cilindro(endk2, CC1d2, diametroFace, diametroFace); // LINHA 'K' DIREITA RETA
        cilindro(A1, endk3, diametroFace, diametroFace); // LINHA 'K' ESQUERDA
        cilindro(endk3, AA1d2, diametroFace, diametroFace); // LINHA 'K' ESQUERDA RETA
        
        y += incremento;

        incremento = x0 * 2;
        checkbase = false;

    };

    while (y2 + c + (resto/inc) <=  h/2 + 0.01){ // Trecho reto '0.01' de tolerância
        
        //FACE A
        cilindro(new THREE.Vector3(-c/2, y2 + c + (resto/inc), (c * raiz3) / 6), new THREE.Vector3(c/2, y2 + c + (resto/inc), (c * raiz3) / 6), diametroFace, diametroFace);
        cilindro(new THREE.Vector3(-c/2, y2, (c * raiz3) / 6), new THREE.Vector3(c/2, y2 + c + (resto/inc), (c * raiz3) / 6), diametroFace, diametroFace);
        cilindro(new THREE.Vector3(c/2, y2, (c * raiz3) / 6), new THREE.Vector3(-c/2, y2 + c + (resto/inc), (c * raiz3) / 6), diametroFace, diametroFace);
        
        //FACE B
        cilindro(new THREE.Vector3(-c/2, y2 + c + (resto/inc), (c * raiz3) / 6), new THREE.Vector3(0, y2 + c + (resto/inc), -((c * raiz3) / 3)), diametroFace, diametroFace);
        cilindro(new THREE.Vector3(-c/2, y2, (c * raiz3) / 6), new THREE.Vector3(0, y2 + c + (resto/inc), -((c * raiz3) / 3)), diametroFace, diametroFace);
        cilindro(new THREE.Vector3(0, y2, -((c * raiz3) / 3)), new THREE.Vector3(-c/2, y2 + c + (resto/inc), (c * raiz3) / 6), diametroFace, diametroFace);
    

        //FACE C
        cilindro(new THREE.Vector3(c/2, y2 + c + (resto/inc), (c * raiz3) / 6), new THREE.Vector3(0, y2 + c + (resto/inc), -((c * raiz3) / 3)), diametroFace, diametroFace);
        cilindro(new THREE.Vector3(c/2, y2, (c * raiz3) / 6), new THREE.Vector3(0, y2 + c + (resto/inc), -((c * raiz3) / 3)), diametroFace, diametroFace);
        cilindro(new THREE.Vector3(0, y2, -((c * raiz3) / 3)), new THREE.Vector3(c/2, y2 + c + (resto/inc), (c * raiz3) / 6), diametroFace, diametroFace);

        y2 += c + (resto/inc);
 
    };

    return torre;

}

export function createMastro(raio, h){

    cilindro(new THREE.Vector3(0, -h/2, 0), new THREE.Vector3(0, h/2, 0), raio, raio);

    return torre;

}

export function createPoste(b, c, h){

    cilindro(new THREE.Vector3(0, -h/2, 0), new THREE.Vector3(0, h/2, 0), b, c);

    return torre;

}

function cilindro(start, end, diametroFinal, diametro){
    const edgeVector = end.clone().sub(start);
    const edgeLength = edgeVector.length();

    const cylinderMaterial = new THREE.MeshStandardMaterial({ color: 0xffa500 });
    const edgeGeometry = new THREE.CylinderGeometry(diametro/2, diametroFinal/2, edgeLength, 16);
    const edge = new THREE.Mesh(edgeGeometry, cylinderMaterial);

     // Posição e Orientação do cilindro
    edge.position.set((start.x + end.x)/2 , (start.y + end.y)/2 , (start.z + end.z)/2 );
    edge.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), edgeVector.clone().normalize());

    edge.castShadow = true; // Permitir que o cilindro emita sombras
    edge.receiveShadow = true; // Permitir que o cilindro receba sombras

    torre.add(edge);
}