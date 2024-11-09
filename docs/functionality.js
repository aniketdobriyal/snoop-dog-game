let right, left, up, down, x = 0, shift_key, space, vy = 0;
let frameX = 0;
let frameY = 0;
let character_animation_speed = 0;
let isJumping = false;

const canvas = document.getElementById("canvas2");
const ctx = canvas.getContext("2d");
canvas.width = 1170;
canvas.height = 600;

const background = new Image();
background.src = "Wallpaper-House.com_451352.jpg";

const character_img_forward = new Image();
character_img_forward.src = "shadow_dog.png";

const character_img_backward = new Image();
character_img_backward.src = "shadow_dog - Copy.png";

const sound_1 = new Audio("mixkit-horse-fast-gallop-on-a-concrete-surface-83.wav");
const sound_2 = new Audio("mixkit-arcade-video-game-machine-alert-2821.wav");
const sound_3 = new Audio("forest-birds-sound-effect-relaxing-nature-ambience.mp3");
const sound_4 = new Audio("Untitled video - Made with Clipchamp.mp3");

const player = { x: 50, y: 320, width: 200, height: 200, speed: 5 };
const object = { x: 650, y: 465, width: 50, height: 50, speed: 1 };

function collision() {
    // Placeholder for collision detection
}

function drawobject() {
   
}

function drawplayer() {
    const spritewidth = 575;
    const spriteheight = 523;

    // If the down key is pressed, always use the forward-facing character
    if (down) {
        ctx.drawImage(character_img_forward, frameX * spritewidth, frameY * spriteheight, spritewidth, spriteheight, player.x, player.y, player.width, player.height);
    } else if (left) {
        // If the down key is not pressed, allow the character to face left
        ctx.drawImage(character_img_backward, frameX * spritewidth, frameY * spriteheight, spritewidth, spriteheight, player.x, player.y, player.width, player.height);
    } else {
        // Default: Use the forward-facing character
        ctx.drawImage(character_img_forward, frameX * spritewidth, frameY * spriteheight, spritewidth, spriteheight, player.x, player.y, player.width, player.height);
    }
}

function frameSet() {
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(background, x, -400, 2900, 1000);

    if (x <= -1730) { x = 0; }
    if (player.x + player.width >= canvas.width - 50 && right) { x -= 5; }
    if (player.x === -5 && x < 0 && left) { x += 5; }

    if (character_animation_speed % 5 === 0) {
        if (down) {
            // Animate from column 5 (index 4) to 12 (index 11) while down key is held
            frameX = (frameX < 11) ? frameX + 1 : 10; // Loop through columns 5 to 12
            frameY = 8; // Row 9 (0-based index)
        } else {
            // Reset to normal movement animation
            frameX = (frameX < 4) ? frameX + 1 : 0;
            frameY = shift_key ? 6 : (right || left) ? 3 : 0;
        }
    }
    character_animation_speed++;
}

function main() {
    gravity();
    frameSet();
    drawplayer();
    drawobject();
    move();
    window.requestAnimationFrame(main);
}

function move() {
    // If down key is pressed, block right and left movement
    if (!down) {
        if (right && player.x + player.width < canvas.width) {
            player.x += player.speed;
            if (shift_key) { player.x += player.speed; }
        }

        if (left && player.x >= 0) {
            player.x -= player.speed;
            if (shift_key) { player.x -= player.speed; }
        }
    }

    if (space && !isJumping) {
        isJumping = true;
        vy = -20;
        sound_4.currentTime = 0;
        sound_4.play();
    }

    player.y += vy;

    if (up) { player.y -= player.speed; }
    if (down) { player.y += player.speed; }
}

function down_key(event) {
    const key = event.key;
    sound_3.play();

    if (key === "ArrowRight") { right = true; sound_1.currentTime = 0; sound_1.play(); }
    if (key === "ArrowLeft") { left = true; sound_1.currentTime = 0; sound_1.play(); }
    if (key === "Shift") { shift_key = true; sound_2.currentTime = 0; sound_2.play(); }
    if (key === " ") { space = true; }
    if (key === "ArrowDown") { down = true; }  // Block other movements when down is pressed
}

function up_key(event) {
    const key = event.key;

    if (key === "ArrowRight") { right = false; sound_1.pause(); }
    if (key === "ArrowLeft") { left = false; sound_1.pause(); }
    if (key === "Shift") { shift_key = false; sound_2.pause(); }
    if (key === " ") { space = false; }
    if (key === "ArrowDown") { down = false; }  // Allow horizontal movement when down is released
}

function gravity() {
    if (player.y + player.height < canvas.height - 80) {
        vy += 1;
    } else {
        player.y = canvas.height - player.height - 80;
        vy = 0;
        isJumping = false;
    }
}

// Select control elements
const rightControl = document.getElementById('right');
const leftControl = document.getElementById('left');
const jumpControl = document.getElementById('jump');
const downControl = document.getElementById('down');
const shiftControl = document.getElementById('shift');

// Add event listeners for touch controls
rightControl.addEventListener('touchstart', () => { right = true; sound_1.currentTime = 0; sound_1.play(); });
leftControl.addEventListener('touchstart', () => { left = true; sound_1.currentTime = 0; sound_1.play(); });
jumpControl.addEventListener('touchstart', () => { space = true; });
downControl.addEventListener('touchstart', () => { down = true; });
shiftControl.addEventListener('touchstart', () => { shift_key = true; sound_2.currentTime = 0; sound_2.play(); });

// Remove the actions when touch ends
rightControl.addEventListener('touchend', () => { right = false; sound_1.pause(); });
leftControl.addEventListener('touchend', () => { left = false; sound_1.pause(); });
jumpControl.addEventListener('touchend', () => { space = false; });
downControl.addEventListener('touchend', () => { down = false; });
shiftControl.addEventListener('touchend', () => { shift_key = false; sound_2.pause(); });



document.addEventListener('contextmenu', (event) => {
    event.preventDefault();
  });

  
document.addEventListener("keydown", down_key);
document.addEventListener("keyup", up_key);
window.requestAnimationFrame(main);
