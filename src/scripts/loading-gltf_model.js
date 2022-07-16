import * as THREE from '../../js/three.module.js';
import { OrbitControls } from '../../js/controls/OrbitControls.js';
import { GLTFLoader } from '../../js/loaders/GLTFLoader.js';
import { updateSize } from '../modules/helpers.js';
import { RenderPass } from '../../js/postprocessing/RenderPass.js';
import { ShaderPass } from '../../js/postprocessing/ShaderPass.js';
import { EffectComposer } from '../../js/postprocessing/EffectComposer.js';
import { UnrealBloomPass } from '../../js/postprocessing/UnrealBloomPass.js';

let renderer = null,
    scene = null,
    camera = null,
    canvas = null,
    controls = null,
    composer = null;

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

    const al = new THREE.AmbientLight(0xffffff, 10000);
    scene.add(al);

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
                    });
                    camera.lookAt(gltf.scene.position);
                    scene.add( gltf.scene ); 
                    console.log(gltf.scene);
                }, 
                undefined, 
                ( error ) => { 
                    console.error( error ); 
                }
    );
    /* Add a mouse up handler to toggle the animation */

    // Create the Three.js renderer, add it to our canvas
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: false } );
    renderer.setPixelRatio(window.devicePixelRatio);

    const renderScene = new RenderPass(scene, camera);
    composer = new EffectComposer(renderer);
    composer.setSize(canvas.offsetWidth, canvas.offsetHeight);
    composer.addPass(renderScene);

    const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        5,
        0.1,
        0.1
    )
    composer.addPass(bloomPass);

    // animate our render loop
    animate(); 
}
function animate()
{
    // Render the scene
    updateSize(canvas, renderer, camera);

    controls.update();

    // renderer.render( scene, camera );
    composer.render();
    // Spin the cube for next frame
    // Ask for another frame
    requestAnimationFrame(animate);
}