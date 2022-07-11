let canvas, renderer, camera, scene, cube;
// const scenes = [];

init();
animate();

function init()
{
    canvas = document.getElementById("c");
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, 2, 1, 1000 ); //FOV, Aspect Ratio, Near Clip, Far Clip //ONE of MANY cameras
    camera.position.z = 5;

    //NOW WE MAKE A CUBE
    const geometry = new THREE.BoxGeometry( 1, 1, 1 ); //Makes a cube
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } ); //All material take an object of properties which will be applied to them. Here we simply apply a hex color
    cube = new THREE.Mesh( geometry, material ); //A mesh is an object that takes a geometry and applies a material to it, which we can then insert in our scene and move freely around

    //ADD THE MESH TO THE SCENE
    scene.add( cube ); //By default the argument in .add(e) gets added to (0,0,0) //This would make both camera and cuber overlap so move the camera

    //RENDERER
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true}); //Has fallback for legacy browsers
    renderer.setPixelRatio(window.devicePixelRatio);
}

//RENDERING THE SCENE: To actually render we need a RENDER or ANIMATE LOOP
/*This will create a loop that causes the renderer to draw the scene everytime the screen is refreshed (typically 60 times per second)*/
function animate()
{
    requestAnimationFrame(animate); //Game programmers may want setInterval, but this is good because it pause when a user navigates away form the tab
        cube.rotation.x += 0.01; //Animates the cube: This will be run every frame (normally 60 FPS)
        cube.rotation.y += 0.01; //Basically anything you want to move or change has to go through the animate loop
    renderer.render(scene, camera);
    
}

function updateSize() {
    // look up the size the canvas is being displayed
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
  
    // adjust displayBuffer size to match
    if (canvas.width !== width || canvas.height !== height) {
      renderer.setSize(width, height, false); // you must pass false here or three.js sadly fights the browser
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
  
      // update any render target sizes here
    }
}

function render()
{
    updateSize();
    renderer.render(scene, camera);
}