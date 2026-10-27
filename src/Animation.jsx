import { useEffect, useState } from 'react';
import './Animation.css';

/* Animated starfield background */
function Starfield() {
  useEffect(() => {
    const canvas = document.getElementById('stars');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    let stars = [];
    let width = 0;
    let height = 0;
    let animationFrame = 0;
    let lastFrame = 0;
    let resizeTimer;

    const buildStars = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(
        1800,
        Math.max(500, Math.round((width * height) / 720))
      );

      stars = Array.from({ length: count }, () => {
        const big = Math.random() > 0.94;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          size: big ? 1.3 + Math.random() * 0.9 : 0.45 + Math.random() * 0.75,
          alpha: big ? 0.6 + Math.random() * 0.4 : 0.2 + Math.random() * 0.6,
          twinkle: Math.random() < 0.4,
          speed: 0.6 + Math.random() * 2.2,
          phase: Math.random() * 6.28,
        };
      });
    };

    const drawStars = (now) => {
      animationFrame = requestAnimationFrame(drawStars);
      if (now - lastFrame < 50) return;
      lastFrame = now;

      ctx.globalAlpha = 1;
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = '#fff';

      for (const star of stars) {
        let alpha = star.alpha;
        if (!reducedMotion && star.twinkle) {
          alpha *= 0.45 + 0.55 * (0.5 + 0.5 * Math.sin((now / 1000) * star.speed + star.phase));
        }
        ctx.globalAlpha = alpha;
        ctx.fillRect(
          star.x - star.size / 2,
          star.y - star.size / 2,
          star.size,
          star.size
        );
      }
      ctx.globalAlpha = 1;
    };

    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(buildStars, 150);
    };

    buildStars();
    animationFrame = requestAnimationFrame(drawStars);
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrame);
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas id="stars" className="stars" aria-hidden="true" />;
}

/* The wordmark is split so the final U can have its own spacing. */
function Logo({ className }) {
  return (
    <span className={`logo ${className}`}>
      <span className="u l">U</span>
      <span className="mid">
        <span className="mid-text">nfiltered</span>
      </span>
      <span className="u r">U</span>
    </span>
  );
}

export default function Intro({ onComplete }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion) {
      setStage(4);

      const timer = window.setTimeout(() => {
        onComplete?.();
      }, 700);

      return () => window.clearTimeout(timer);
    }

    const times = [500, 1900, 4500, 5900];

    const timers = times.map((time, index) =>
      window.setTimeout(() => setStage(index + 1), time)
    );

    // Animation complete hone ke baad website show hogi.
    const finishTimer = window.setTimeout(() => {
      onComplete?.();
    }, 8600);

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      window.clearTimeout(finishTimer);
    };
  }, [onComplete]);

  const stages = [1, 2, 3, 4]
    .map((number) => (stage >= number ? ` s${number}` : ""))
    .join("");

  return (
    <>
      <Starfield />

      <main className={`intro${stages}`}>
        <h1 className="wrap" aria-label="UNFILTERED U">
          <Logo className="main" />
          <Logo className="fx red" />
          <Logo className="fx cyan" />
          <Logo className="fx b1" />
          <Logo className="fx b2" />
          <Logo className="fx b3" />
        </h1>

        <p className="tag">Because You Deserve Truth.</p>
      </main>
    </>
  );
}
