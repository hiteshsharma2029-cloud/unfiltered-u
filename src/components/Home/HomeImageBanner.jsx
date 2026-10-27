import { useState } from "react";
import "./HomeImageBanner.css";

export default function HomeImageBanner({
  src = "",
  alt = "A glimpse of everyday college life",
  className = "",
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = Boolean(src) && !imageFailed;

  return (
    <section
      className={`home-image-banner ${className}`.trim()}
      aria-label="A glimpse of college life"
    >
      <figure className="home-image-banner__frame" data-solid>
        {showImage ? (
          <img
            className="home-image-banner__image"
            src={src}
            alt={alt}
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div
            className="home-image-banner__placeholder"
            role="img"
            aria-label="Decorative placeholder for a college campus image"
          >
            <div className="home-image-banner__glow" />

            <div className="home-image-banner__architecture" aria-hidden="true">
              <div className="home-image-banner__building home-image-banner__building--left">
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>

              <div className="home-image-banner__building home-image-banner__building--center">
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>

              <div className="home-image-banner__building home-image-banner__building--right">
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
            </div>

            <div className="home-image-banner__copy">
              <span className="home-image-banner__eyebrow">
                THE STUDENT PERSPECTIVE
              </span>

              <p>Life beyond the brochure.</p>

              <span className="home-image-banner__hint">
                Your campus imagery will appear here.
              </span>
            </div>

            <span className="home-image-banner__index" aria-hidden="true">
              UU / 01
            </span>
          </div>
        )}

        <figcaption className="home-image-banner__caption">
          <span>UNFILTERED U</span>
          <span>See the experience. Not just the promise.</span>
        </figcaption>
      </figure>
    </section>
  );
}