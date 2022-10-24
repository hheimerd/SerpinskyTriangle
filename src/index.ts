import {SerpinskyTriangle} from './SerpinskyTriangle';
import {Point} from './Point';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const instruction = document.getElementById('instruction') as HTMLLabelElement;
const resetButton = document.getElementById('reset-button') as HTMLButtonElement;

enum Messages {
    DrawTriangle = 'Click in 3 sides to draw triangle',
    SelectFirstDot = 'Select first dot for start drawing',
}

enum State {
    TriangleSelection,
    PointSelection,
    Animation
}

const serpinskyTriangle = new SerpinskyTriangle(canvas);

let animationId: number;
let state = State.TriangleSelection;
let dots: Point[] = [];

function getWorldPosition(point: Point) {
    const hk = canvas.height / canvas.clientHeight;
    const wk = canvas.width / canvas.clientWidth;
    return {
        x: point.x * wk,
        y: point.y * hk,
    };
}

function onCanvasClick(e: MouseEvent | TouchEvent) {
    let point = getWorldPosition(getPointFromEvent(e));

    console.log(getPointFromEvent(e), point);
    switch (state) {
        case State.TriangleSelection:
            dots.push(point);
            serpinskyTriangle.drawCircle(point, 5);

            if (dots.length < 3) {
                return;
            }

            state = State.PointSelection;

            serpinskyTriangle.setupTriangleDots(dots);
            serpinskyTriangle.drawTriangle();
            instruction.textContent = Messages.SelectFirstDot;
            break;
        case State.PointSelection:
            serpinskyTriangle.setCurrentPosition(point);
            serpinskyTriangle.drawCurrentPosition();
            animate();
            state = State.Animation;
            break;
    }
}

canvas.addEventListener('click', onCanvasClick);
canvas.addEventListener('touchend', onCanvasClick);
resetButton.addEventListener('click', () => {
    dots = [];
    cancelAnimationFrame(animationId);
    animationId = 0;
    serpinskyTriangle.clear();
    state = State.TriangleSelection;
});

function getPointFromEvent(e: MouseEvent | TouchEvent) {
    const pointSource = e instanceof MouseEvent ? e : e.touches[0];

    const element = e.target as HTMLCanvasElement | HTMLDivElement;
    const rect = element.getBoundingClientRect();

    return {
        x: (pointSource.clientX - rect.left),
        y: (pointSource.clientY - rect.top),
    };

}


instruction.textContent = Messages.DrawTriangle;


function animate() {
    serpinskyTriangle.drawRandomCircle();
    serpinskyTriangle.drawTriangle();

    animationId = requestAnimationFrame(animate);
}