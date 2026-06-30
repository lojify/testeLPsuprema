// lazy-load.js — Carregamento adiado de vídeos/iframes pesados

export function initLazyMedia() {
  const lazyVideos = document.querySelectorAll('[data-lazy-video]');
  if (!lazyVideos.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const video = entry.target;
        video.querySelectorAll('source[data-src]').forEach((source) => {
          source.src = source.dataset.src;
        });
        video.load();
        video.play().catch(() => {
          /* autoplay pode ser bloqueado; ignorar silenciosamente */
        });
        obs.unobserve(video);
      });
    },
    { rootMargin: '200px 0px' }
  );

  lazyVideos.forEach((video) => observer.observe(video));
}
