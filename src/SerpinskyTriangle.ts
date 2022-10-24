import {Point} from './Point';

export class SerpinskyTriangle {
    _ctx: CanvasRenderingContext2D;
    private _triangleDots: Point[] = [];
    private _currentPosition: Point = {x: 0, y: 0};

    constructor(private readonly canvas: HTMLCanvasElement) {
        const context = canvas.getContext('2d');
        if (!context)
            throw new Error('Unsupported context 2d');

        this._ctx = context;
    }

    public setCurrentPosition(position: Point) {
        this._currentPosition = position;
    }

    public drawCurrentPosition() {
        this.drawDot(this._currentPosition);
    }

    private drawDot(point: Point) {
        this._ctx.fillStyle = '#45a7fe';
        this._ctx.fillRect(point.x, point.y, 2, 2);
    }

    public drawTriangle() {
        this._ctx.beginPath();
        this._ctx.moveTo(this._triangleDots[0].x, this._triangleDots[0].y)
        this._triangleDots.forEach(dot => this._ctx.lineTo(dot.x, dot.y));
        this._ctx.closePath();
        this._ctx.stroke();
    }

    public drawRandomCircle() {
        const nextDot = this._triangleDots[Math.floor(Math.random() * 3)];
        const currentPosition = this._currentPosition;

        this._currentPosition = {
            x: currentPosition.x + (nextDot.x - currentPosition.x) / 2,
            y: currentPosition.y + (nextDot.y - currentPosition.y) / 2,
        }

        this.drawCurrentPosition();
    }

    public setupTriangleDots(dots: Point[]) {
        this._triangleDots = dots;
    }

    public drawCircle(position: {x: number, y: number}, radius: number) {
        this._ctx.beginPath();
        this._ctx.arc(position.x, position.y, radius, 0, Math.PI * 2);
        this._ctx.fillStyle = 'red';
        this._ctx.fill();
    }

    clear() {
        this._ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }
}
