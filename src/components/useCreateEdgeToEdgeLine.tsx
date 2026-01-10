function useCreateEdgeToEdgeLine(
    width: number,
    height: number,
    dotCount: number
) {
    const edge = Math.floor(Math.random() * 40); 

    let x1 = 0,
        y1 = 0,
        x2 = 0,
        y2 = 0;

    if (edge === 0) {
        x1 = Math.random() * width;
        y1 = 0;
        x2 = Math.random() * width;
        y2 = height;
    } else if (edge === 1) {
        x1 = width;
        y1 = Math.random() * height;
        x2 = 0;
        y2 = Math.random() * height;
    } else if (edge === 2) {
        x1 = Math.random() * width;
        y1 = height;
        x2 = Math.random() * width;
        y2 = 0;
    } else {
        x1 = 0;
        y1 = Math.random() * height;
        x2 = width;
        y2 = Math.random() * height;
    }

    return {
        x1,
        y1,
        x2,
        y2,
        dots: Array.from({ length: dotCount }, (_, i) => i / dotCount),
    };
}

function drawAnimatedLine(
    ctx: CanvasRenderingContext2D,
    line: {
        x1: number;
        y1: number;
        x2: number;
        y2: number;
        dots: number[];
    }
) {
    const { x1, y1, x2, y2, dots } = line;

    // Draw line
    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // Animate dots
    ctx.fillStyle = "#4f8cff";
    ctx.shadowBlur = 12;
    ctx.shadowColor = "#4f8cff";

    for (let i = 0; i < dots.length; i++) {
        dots[i] += 0.0012; // speed
        if (dots[i] > 1) dots[i] = 0;

        const t = dots[i];
        const x = x1 + t * (x2 - x1);
        const y = y1 + t * (y2 - y1);

        ctx.beginPath();
        ctx.arc(x, y, 2.2, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.shadowBlur = 0;
}
export { useCreateEdgeToEdgeLine, drawAnimatedLine };