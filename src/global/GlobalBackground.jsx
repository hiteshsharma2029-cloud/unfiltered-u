
import { useEffect, useRef } from "react";
import { useTheme } from "./ThemeProvider";
import "./GlobalBackground.css";

export default function GlobalBackground() {
  const canvasRef = useRef(null);
  const { stars } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!canvas || !context) return;

    let width = 0;
    let height = 0;
    let frameId;
    let particles = [];
    let lastTime = 0;

    const config = {
      count: Math.max(0, Math.min(stars.count || 0, 500)),
      twinkle: stars.twinkle ?? 0.4,
      speed: stars.speed ?? 0,
      size: stars.size ?? 1,
      glow: stars.glow ?? 0.35,
      still: Boolean(stars.still),
    };

    function createParticles() {
      particles = Array.from({ length: config.count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: (Math.random() * 1.2 + 0.35) * config.size,
        alpha: Math.random() * 0.55 + 0.2,
        phase: Math.random() * Math.PI * 2,
        drift: (Math.random() - 0.5) * 0.12,
      }));
    }

    function resize() {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);

      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      createParticles();
    }

    function draw(time = 0) {
      if (!context) return;

      const delta = lastTime ? Math.min((time - lastTime) / 16.67, 2) : 1;
      lastTime = time;

      context.clearRect(0, 0, width, height);

      for (const particle of particles) {
        const pulse = config.still
          ? 1
          : 1 -
            config.twinkle *
              0.35 *
              (0.5 + 0.5 * Math.sin(time * 0.0015 + particle.phase));

        const alpha = Math.max(0.08, particle.alpha * pulse);

        context.beginPath();
        context.arc(
          particle.x,
          particle.y,
          Math.max(0.2, particle.radius),
          0,
          Math.PI * 2
        );

        context.fillStyle = `rgba(255, 255, 255, ${alpha})`;

        if (config.glow > 0.1) {
          context.shadowColor = "rgba(255, 255, 255, 0.65)";
          context.shadowBlur = config.glow * 8;
        } else {
          context.shadowBlur = 0;
        }

        context.fill();
        context.shadowBlur = 0;

        if (!config.still && config.speed > 0) {
          particle.y -= config.speed * 0.08 * delta;
          particle.x += particle.drift * delta;

          if (particle.y > height + 3) {
            particle.y = -3;
            particle.x = Math.random() * width;
          }

          if (particle.x < -3) particle.x = width + 3;
          if (particle.x > width + 3) particle.x = -3;
        }
      }

      if (!config.still) {
        frameId = window.requestAnimationFrame(draw);
      }
    }

    resize();
    draw();

    window.addEventListener("resize", resize);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
    };
  }, [stars]);

  return (
    <div className="uu-global-background" aria-hidden="true">
      <div className="uu-background-gradient" />
      <canvas ref={canvasRef} className="uu-star-canvas" />
      <div className="uu-background-vignette" />
    </div>
  );
}
