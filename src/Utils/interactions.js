import { useEffect, useRef } from "react";

export function useScrollReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll("[data-reveal]:not(.is-visible)");
    if (!("IntersectionObserver" in window)) {
      elements.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

// Pins a section and converts vertical scroll into horizontal movement of `trackRef`.
// The section's height is set to viewport + horizontal distance so the page scroll length matches.
export function useHorizontalScroll(sectionRef, trackRef, onProgress) {
  const onProgressRef = useRef(onProgress);
  useEffect(() => {
    onProgressRef.current = onProgress;
  });

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    let distance = 0;
    let frame = 0;

    const update = () => {
      frame = 0;
      const top = section.getBoundingClientRect().top;
      const progress = distance ? Math.min(Math.max(-top / distance, 0), 1) : 0;
      track.style.transform = `translate3d(${-progress * distance}px, 0, 0)`;
      onProgressRef.current?.(progress);
    };

    const measure = () => {
      const viewportWidth = track.parentElement.clientWidth;
      distance = Math.max(track.scrollWidth - viewportWidth, 0);
      section.style.height = `${window.innerHeight + distance}px`;
      update();
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(track);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      resizeObserver.disconnect();
      section.style.height = "";
    };
  }, [sectionRef, trackRef]);
}

// Feeds pointer position into --mx / --my so CSS can draw a spotlight under the cursor.
export function trackPointer(event) {
  const el = event.currentTarget;
  const rect = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${event.clientX - rect.left}px`);
  el.style.setProperty("--my", `${event.clientY - rect.top}px`);
}

// Same as trackPointer, plus a subtle 3D tilt via --rx / --ry.
export function trackTilt(event, max = 6) {
  const el = event.currentTarget;
  const rect = el.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  el.style.setProperty("--mx", `${x}px`);
  el.style.setProperty("--my", `${y}px`);
  el.style.setProperty("--ry", `${((x / rect.width) - 0.5) * max * 2}deg`);
  el.style.setProperty("--rx", `${(0.5 - (y / rect.height)) * max * 2}deg`);
}

export function resetTilt(event) {
  const el = event.currentTarget;
  el.style.setProperty("--rx", "0deg");
  el.style.setProperty("--ry", "0deg");
}
