import * as THREE from '../../js/three.module.js';
import { OrbitControls } from '../../js/controls/OrbitControls.js';
import { GLTFLoader } from '../../js/loaders/GLTFLoader.js';
import { updateSize } from '../modules/helpers.js'

let renderer = null,
    scene = null,
    camera = null,
    canvas = null,
    controls = null;

init();
function init()
{
    canvas = document.getElementById("c");
    // Create a new Three.js scene
    scene = new THREE.Scene();
    // Put in a camera
    camera = new THREE.PerspectiveCamera( 45,
        canvas.offsetWidth / canvas.offsetHeight, 1, 4000 );
    camera.position.z = 2;

    
    controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true

    // Create a directional light to show off the object
    let light = new THREE.DirectionalLight( 0xffffff, 0.5);
    light.position.set(0, 0, 0);
    scene.add( light );

    const loader = new GLTFLoader();
    loader.load( './models/raygun.glb', 
                ( gltf ) => { 
                    gltf.scene.scale.set(0.01, 0.01, 0.01);
                    gltf.scene.traverse(function (child) {
                        if (child.type === 'Mesh') {
                            let m = child
                            m.receiveShadow = true
                            m.castShadow = true
                        }
                        if (child.type === 'SpotLight') {
                            let l = child
                            l.castShadow = true
                            l.shadow.bias = -0.003
                            //l.shadow.mapSize.width = 2048
                            //l.shadow.mapSize.height = 2048
                        }
                        camera.lookAt(gltf.scene.position);
                    });
                    scene.add( gltf.scene ); 
                    console.log("SUCCESS");
                }, 
                undefined, 
                ( error ) => { 
                    console.error( error ); 
                }
    );
    /* Add a mouse up handler to toggle the animation */

    // Create the Three.js renderer, add it to our canvas
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    // animate our render loop
    animate(); 
}
function animate()
{
    // Render the scene
    updateSize(canvas, renderer, camera);

    controls.update();

    renderer.render( scene, camera );
    // Spin the cube for next frame
    // Ask for another frame
    requestAnimationFrame(animate);
}