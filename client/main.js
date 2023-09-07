import * as THREE from 'three';
import './style.css'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from 'gsap';
//Scene
//( light camera  action)
const scene = new THREE.Scene(); 

// Create a sphere  (actor)

const geometry = new THREE.SphereGeometry( 3, 64, 64 );
const material = new THREE.MeshStandardMaterial( {
    color: '#00ff83',
    roughness: 0.5, // Adjust the roughness to control how light interacts with the material
    metalness: 0.5, // Adjust the metalness for reflective properties
} );
const mesh = new THREE.Mesh( geometry, material );
scene.add( mesh );


//sized
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}


//light
const light = new THREE.PointLight(0xffffff,50,100);
light.color.set(0xffffff); 
light.decay = 2; 
light.position.set(0, 10, 10);
scene.add(light);


//ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.01); // Adjust intensity as needed
scene.add(ambientLight);

//camera
const camera = new THREE.PerspectiveCamera( 45, sizes.width/sizes.height,0.1,100 );
camera.position.z = 20;
scene.add( camera );



// Renderer
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(sizes.width, sizes.height);
renderer.antialias = true; // Enable antialiasing
renderer.render(scene, camera);


// controls
const controls = new OrbitControls( camera, canvas );
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 5;
//resize

window.addEventListener('resize', (e) => {
    //update size
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    //update camera
    camera.updateProjectionMatrix();
    camera.aspect = sizes.width/sizes.height;
    renderer.setSize( sizes.width,sizes.height );
});

const loop = () => {
    controls.update();
    renderer.render( scene, camera );
    window.requestAnimationFrame( loop );
}

loop();

// animations ( pop up )

const tl = gsap.timeline({
    defaults: {
        duration:1
    }
})

tl.fromTo(mesh.scale, {x:0, y:0, z:0}, {x:1, y:1, z:1})
tl.fromTo('nav',{y:-100,opacity:0}, {y:0,opacity:1} )
tl.fromTo('.title',{opacity:0}, {opacity:1} )

// mouse animation color

let mouseDown = false;
let rgb = []
window.addEventListener('mousedown', () => {
    mouseDown = true;
})
window.addEventListener('mouseup', () => {
    mouseDown = false;
})
window.addEventListener('mousemove', (e) => {
    if(mouseDown){
        rgb=[
            Math.round((e.pageX/sizes.width)*255),
            Math.round((e.pageY/sizes.height)*255),
            200
        ]
    }
    let newColor = new THREE.Color(`rgb(${rgb[0]},${rgb[1]},${rgb[2]})`)
    gsap.to(mesh.material.color,{r:newColor.r,g:newColor.g,b:newColor.b})
})