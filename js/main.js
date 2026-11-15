/**
 * VYVA MASTER SCRIPTS — ANTI-SLOP ART DIRECTION
 * Preloader Choreography + Lenis Smooth Scroll + Seamless Loops +
 * Dynamic Scroll Reveals + Metric Counters + Dot Matrix Warp Canvas
 */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- 1. PRELOADER & HERO ENTRY CHOREOGRAPHY ---
  const preloader = document.getElementById('preloader');
  let pageRevealed = false;

  function revealPage() {
    if (pageRevealed) return;
    pageRevealed = true;
    if (preloader) {
      preloader.classList.add('is-hidden');
    }
    document.body.classList.add('is-loaded');
  }

  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(revealPage, 280);
    });
    // Fallback de segurança rápido e fluido
    setTimeout(revealPage, 850);
  } else {
    revealPage();
  }

  // --- 1.5. TYPEWRITER WORD ANIMATION (HERO & 3D CAROUSEL) ---
  const typewriterTargets = document.querySelectorAll('#typewriter-content, .carousel-3d__typewriter, [data-phrases]');
  typewriterTargets.forEach((typewriterTarget) => {
    const rawPhrases = typewriterTarget.getAttribute('data-phrases');
    const phrases = rawPhrases
      ? rawPhrases.split('|').map((item) => item.trim()).filter(Boolean)
      : [
          'DESENVOLVEMOS ATIVOS.',
          'OPERAMOS EXPERIÊNCIAS.',
          'CONSTRUÍMOS MARCAS.',
          'GERAMOS VALOR.',
        ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typeSpeed = 85;
    const eraseSpeed = 42;
    const holdDelay = 2000;

    // Limpa o texto inicial para iniciar a digitação sincronizada
    typewriterTarget.innerHTML = '';

    function renderTypedWords(visibleText) {
      if (!visibleText) {
        typewriterTarget.innerHTML = '';
        return;
      }

      const words = visibleText.split(' ');
      const existingSpans = typewriterTarget.querySelectorAll('.typewriter-word');

      // Se a quantidade de palavras diminuiu (durante o apagar), remove os spans excedentes
      if (existingSpans.length > words.length) {
        for (let i = existingSpans.length - 1; i >= words.length; i--) {
          const spanToRemove = existingSpans[i];
          if (spanToRemove.previousSibling && spanToRemove.previousSibling.nodeType === Node.TEXT_NODE) {
            spanToRemove.previousSibling.remove();
          }
          spanToRemove.remove();
        }
      }

      words.forEach((wordText, idx) => {
        let wordSpan = typewriterTarget.querySelectorAll('.typewriter-word')[idx];
        if (!wordSpan) {
          if (idx > 0) {
            typewriterTarget.appendChild(document.createTextNode(' '));
          }
          wordSpan = document.createElement('span');
          wordSpan.className = 'typewriter-word';
          wordSpan.style.setProperty('--word-idx', idx);
          typewriterTarget.appendChild(wordSpan);
        }
        if (wordSpan.textContent !== wordText) {
          wordSpan.textContent = wordText;
        }
        wordSpan.classList.toggle('is-typing', idx === words.length - 1 && !isDeleting);
      });
    }

    function stepTypewriter() {
      const currentPhrase = phrases[phraseIndex];

      if (isDeleting) {
        charIndex = Math.max(0, charIndex - 1);
      } else {
        charIndex = Math.min(currentPhrase.length, charIndex + 1);
      }

      renderTypedWords(currentPhrase.substring(0, charIndex));

      let nextDelay = isDeleting ? eraseSpeed : typeSpeed;

      if (!isDeleting && charIndex === currentPhrase.length) {
        nextDelay = holdDelay;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        nextDelay = 380;
      }

      setTimeout(stepTypewriter, nextDelay);
    }

    setTimeout(stepTypewriter, 550);
  });

  // --- 2. LENIS SMOOTH SCROLL ---
  let lenis;
  if (typeof Lenis !== 'undefined' && !prefersReducedMotion) {
    lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      smoothTouch: false,
    });

    window.__lenis = lenis;

    if (typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
    }

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Smooth anchor navigation
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (!targetId || targetId === '#') return;
        const targetElem = document.querySelector(targetId);
        if (targetElem) {
          e.preventDefault();
          lenis.scrollTo(targetElem, { offset: -74 });
        }
      });
    });
  }

  // --- 3. NAVBAR SCROLL EFFECT & MOBILE TOGGLE ---
  const navbar = document.getElementById('mainNavbar');
  if (navbar) {
    const handleScroll = () => {
      if (window.scrollY > 36) {
        navbar.classList.add('is-scrolled');
      } else {
        navbar.classList.remove('is-scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  const navToggle = document.getElementById('navToggle');
  const navbarExpand = document.getElementById('navbarExpand');

  if (navbar && navToggle && navbarExpand) {
    const eyebrow = navbarExpand.querySelector('.navbar__expand-eyebrow');
    const items = Array.from(navbarExpand.querySelectorAll('.navbar__expand-item'));
    const footer = navbarExpand.querySelector('.navbar__expand-footer');
    const menuLinks = Array.from(navbarExpand.querySelectorAll('a'));

    let isOpen = false;
    let menuTl = null;
    let returnTween = null;

    function getRestBg() {
      return navbar.classList.contains('is-scrolled') ? 'rgba(7, 8, 10, 0.85)' : 'rgba(7, 8, 10, 0)';
    }

    function getCollapsedHeight() {
      return navbar.classList.contains('is-scrolled') ? 74 : 88;
    }

    function finishHide() {
      if (isOpen) return;
      navbar.classList.remove('is-expanded', 'is-animating');
      navbarExpand.setAttribute('aria-hidden', 'true');
      if (typeof gsap !== 'undefined') {
        gsap.set(navbar, { clearProps: 'height,backgroundColor,backdropFilter,webkitBackdropFilter,borderBottomColor' });
        gsap.set(navbarExpand, { clearProps: 'opacity' });
        if (eyebrow) gsap.set(eyebrow, { clearProps: 'opacity,transform' });
        gsap.set(items, { clearProps: 'opacity,transform' });
        if (footer) gsap.set(footer, { clearProps: 'opacity,transform' });
      }
      if (window.__lenis) window.__lenis.start();
    }

    function buildMenuTimeline() {
      if (typeof gsap === 'undefined' || prefersReducedMotion) return;
      if (returnTween) {
        returnTween.kill();
        returnTween = null;
      }
      if (menuTl) {
        menuTl.kill();
      }

      const collapsedH = getCollapsedHeight();
      const fullH = window.innerHeight || document.documentElement.clientHeight;
      const restBg = getRestBg();

      gsap.set(navbar, {
        height: collapsedH,
        backgroundColor: restBg
      });
      gsap.set(navbarExpand, { opacity: 0 });
      if (eyebrow) gsap.set(eyebrow, { opacity: 0, y: 18 });
      gsap.set(items, { opacity: 0, y: 32 });
      if (footer) gsap.set(footer, { opacity: 0, y: 16 });

      menuTl = gsap.timeline({
        paused: true,
        onReverseComplete: finishHide,
        onComplete: finishHide
      });

      // Fase 1: Header expande suavemente até tela inteira + chegada fluida das opções
      menuTl
        .to(navbar, {
          height: fullH,
          backgroundColor: 'rgba(6, 8, 12, 0.97)',
          backdropFilter: 'blur(22px)',
          webkitBackdropFilter: 'blur(22px)',
          borderBottomColor: 'rgba(255, 255, 255, 0)',
          duration: 0.58,
          ease: 'power3.inOut'
        }, 0)
        .to(navbarExpand, {
          opacity: 1,
          duration: 0.34,
          ease: 'power2.out'
        }, 0.14);

      if (eyebrow) {
        menuTl.to(eyebrow, {
          opacity: 1,
          y: 0,
          duration: 0.44,
          ease: 'power3.out'
        }, 0.24);
      }

      menuTl.to(items, {
        opacity: 1,
        y: 0,
        duration: 0.56,
        stagger: 0.055,
        ease: 'power3.out'
      }, 0.28);

      if (footer) {
        menuTl.to(footer, {
          opacity: 1,
          y: 0,
          duration: 0.44,
          ease: 'power3.out'
        }, 0.5);
      }

      // Pausa no estado expandido (interruptible single timeline)
      menuTl.addLabel('open');
      menuTl.addPause('open');

      // Fase 2: Opções saem suavemente e a header recolhe de volta ao topo
      if (footer) {
        menuTl.to(footer, {
          opacity: 0,
          y: -12,
          duration: 0.22,
          ease: 'power2.in'
        }, 'open+=0.01');
      }

      menuTl.to(items, {
        opacity: 0,
        y: -18,
        duration: 0.26,
        stagger: { each: 0.028, from: 'end' },
        ease: 'power2.in'
      }, 'open+=0.01');

      if (eyebrow) {
        menuTl.to(eyebrow, {
          opacity: 0,
          y: -12,
          duration: 0.22,
          ease: 'power2.in'
        }, 'open+=0.04');
      }

      menuTl
        .to(navbarExpand, {
          opacity: 0,
          duration: 0.24,
          ease: 'power2.in'
        }, 'open+=0.12')
        .to(navbar, {
          height: collapsedH,
          backgroundColor: restBg,
          duration: 0.5,
          ease: 'power3.inOut'
        }, 'open+=0.14');
    }

    function setMenuState(nextOpen) {
      if (nextOpen === isOpen) return;
      isOpen = nextOpen;

      navToggle.classList.toggle('is-active', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      navToggle.setAttribute('aria-label', isOpen ? 'Fechar Menu' : 'Abrir Menu');

      if (typeof gsap === 'undefined' || prefersReducedMotion) {
        navbar.classList.toggle('is-expanded', isOpen);
        navbarExpand.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
        if (isOpen) {
          navbar.style.height = '100dvh';
          navbar.style.backgroundColor = 'rgba(6, 8, 12, 0.97)';
          navbarExpand.style.opacity = '1';
        } else {
          navbar.style.height = '';
          navbar.style.backgroundColor = '';
          navbarExpand.style.opacity = '';
        }
        if (window.__lenis) {
          if (isOpen) window.__lenis.stop();
          else window.__lenis.start();
        }
        return;
      }

      if (returnTween) {
        returnTween.kill();
        returnTween = null;
      }

      if (isOpen) {
        if (!menuTl || menuTl.time() === 0 || menuTl.time() >= menuTl.duration() - 0.01) {
          buildMenuTimeline();
        }
        navbar.classList.add('is-animating', 'is-expanded');
        navbarExpand.setAttribute('aria-hidden', 'false');
        if (window.__lenis) window.__lenis.stop();

        const openTime = menuTl.labels.open;
        if (menuTl.time() < openTime) {
          menuTl.play();
        } else if (menuTl.time() > openTime) {
          returnTween = menuTl.tweenTo('open', {
            duration: Math.max(0.2, menuTl.time() - openTime),
            ease: 'power2.out',
            onComplete: () => {
              returnTween = null;
            }
          });
        }
      } else {
        if (!menuTl) {
          finishHide();
          return;
        }
        navbar.classList.add('is-animating');
        const openTime = menuTl.labels.open;
        if (menuTl.time() < openTime) {
          menuTl.reverse();
        } else {
          menuTl.play();
        }
      }
    }

    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      setMenuState(!isOpen);
    });

    menuLinks.forEach((link) => {
      link.addEventListener('click', () => setMenuState(false));
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen) {
        setMenuState(false);
      }
    });

    window.addEventListener('resize', () => {
      if (isOpen && typeof gsap !== 'undefined' && !prefersReducedMotion) {
        navbar.style.height = `${window.innerHeight || document.documentElement.clientHeight}px`;
      }
    });
  }

  // --- 4. SEAMLESS TICKER LOOP NORMALIZER ---
  document.querySelectorAll('.ticker-strip__track').forEach((track) => {
    const children = Array.from(track.children);
    if (!children.length) return;
    const lastChild = children[children.length - 1];
    // Garante que o último item tenha um separador final para simetria exata de 50%
    if (!lastChild.classList.contains('ticker-strip__sep')) {
      const sep = document.createElement('span');
      sep.className = 'ticker-strip__sep';
      sep.textContent = '•';
      track.appendChild(sep);
    }
  });

  // --- 5. VIDEO LOOPS AUTOPLAY & VIEWPORT OBSERVER ---
  const loopVideos = document.querySelectorAll('video[autoplay], video.loop-video');
  if (loopVideos.length) {
    loopVideos.forEach((video) => {
      video.muted = true;
      video.playsInline = true;
      video.setAttribute('muted', '');
      video.setAttribute('playsinline', '');
    });

    if ('IntersectionObserver' in window) {
      const videoObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const video = entry.target;
            if (entry.isIntersecting) {
              const p = video.play();
              if (p !== undefined) {
                p.catch(() => {});
              }
            } else {
              video.pause();
            }
          });
        },
        { rootMargin: '200px 0px' }
      );

      loopVideos.forEach((video) => videoObserver.observe(video));
    }
  }

  // --- 6. LIVE UNIT COMPARATOR (GSAP SINGLE-CELL TRANSITION & SPEC CYCLE) ---
  const liveComparator = document.getElementById('liveComparator') || document.querySelector('.live-comparator');
  const panelsWrap = liveComparator?.querySelector('.comparator-panels');
  const tabButtons = document.querySelectorAll('.comparator-tab-btn');
  const panels = document.querySelectorAll('.comparator-panel');

  if (liveComparator && panelsWrap && tabButtons.length && panels.length) {
    const canAnimateSpecs = typeof gsap !== 'undefined' && !prefersReducedMotion;
    if (!canAnimateSpecs) {
      liveComparator.classList.add('is-static');
    }

    let activeUnit =
      Array.from(tabButtons).find((b) => b.getAttribute('aria-selected') === 'true')?.getAttribute('data-unit') ||
      panels[0].getAttribute('data-unit');

    let cycleTween = null;
    let isUserPaused = false;
    let isInViewport = true;
    const SPEC_DWELL_SECONDS = 2.8;

    function getActivePanel() {
      return Array.from(panels).find((p) => !p.hidden && !p.hasAttribute('data-closing'));
    }

    function stopSpecCycle() {
      if (cycleTween) {
        cycleTween.kill();
        cycleTween = null;
      }
      panels.forEach((panel) => {
        panel.querySelectorAll('.spec-card__line').forEach((line) => {
          if (typeof gsap !== 'undefined') {
            gsap.killTweensOf(line);
            gsap.set(line, { scaleX: 0 });
          } else {
            line.style.transform = '';
          }
        });
      });
    }

    const DIVIDER_POSITIONS = ['20%', '42%', '64%', '84%'];

    function setSpecSelection(panel, targetIndex, { instant = false } = {}) {
      const specCards = Array.from(panel.querySelectorAll('.spec-card'));
      if (!specCards.length) return 0;

      const safeIdx = ((targetIndex % specCards.length) + specCards.length) % specCards.length;
      const targetCard = specCards[safeIdx];
      panel.dataset.specIndex = String(safeIdx);
      panel.style.setProperty('--divider-pos', DIVIDER_POSITIONS[safeIdx] || '20%');

      specCards.forEach((c, i) => c.classList.toggle('is-focused', i === safeIdx));

      const readoutBox = panel.querySelector('.comparator-readout');
      const readoutTag = panel.querySelector('.comparator-readout__tag');
      const detailParagraph = panel.querySelector('.comparator-detail');
      const rawLabel = targetCard.querySelector('.spec-item__label')?.textContent?.trim() || '';
      const formattedTag = `0${safeIdx + 1} / ${rawLabel}`;
      const newDetail = targetCard.getAttribute('data-detail') || '';

      if (readoutTag && detailParagraph && (detailParagraph.textContent.trim() !== newDetail || readoutTag.textContent.trim() !== formattedTag)) {
        const targets = [readoutTag, detailParagraph];
        if (!instant && canAnimateSpecs) {
          gsap.killTweensOf(targets);
          if (readoutBox) {
            gsap.killTweensOf(readoutBox);
            gsap.fromTo(
              readoutBox,
              { '--readout-sheen': 1 },
              { '--readout-sheen': 0, duration: 0.55, ease: 'power2.out' }
            );
          }
          gsap.to(targets, {
            opacity: 0,
            y: 5,
            duration: 0.13,
            ease: 'power2.in',
            onComplete: () => {
              readoutTag.textContent = formattedTag;
              detailParagraph.textContent = newDetail;
              gsap.fromTo(
                targets,
                { opacity: 0, y: -5 },
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.26,
                  stagger: 0.035,
                  ease: 'power3.out',
                  clearProps: 'transform,opacity'
                }
              );
            }
          });
        } else {
          readoutTag.textContent = formattedTag;
          detailParagraph.textContent = newDetail;
        }
      }

      return safeIdx;
    }

    function runSpecCycle(panel, { sync = true } = {}) {
      if (!panel || panel.hidden || panel.hasAttribute('data-closing')) return;
      stopSpecCycle();

      const specCards = Array.from(panel.querySelectorAll('.spec-card'));
      if (!specCards.length) return;

      const currentIndex = Number.parseInt(panel.dataset.specIndex || '0', 10) || 0;
      const safeIndex = sync
        ? setSpecSelection(panel, currentIndex, { instant: true })
        : ((currentIndex % specCards.length) + specCards.length) % specCards.length;
      const activeLine = specCards[safeIndex]?.querySelector('.spec-card__line');
      if (!activeLine) return;

      if (!canAnimateSpecs || isUserPaused || !isInViewport || document.hidden) {
        if (typeof gsap !== 'undefined') gsap.set(activeLine, { scaleX: 1 });
        return;
      }

      cycleTween = gsap.fromTo(
        activeLine,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: SPEC_DWELL_SECONDS,
          ease: 'none',
          onComplete: () => {
            if (panel !== getActivePanel() || isUserPaused || !isInViewport || document.hidden) return;
            const nextIdx = (safeIndex + 1) % specCards.length;
            setSpecSelection(panel, nextIdx, { instant: false });
            runSpecCycle(panel, { sync: false });
          }
        }
      );
    }

    // 6.1. Pointer-reactive spotlight coordinates
    let comparatorRect = liveComparator.getBoundingClientRect();

    if ('ResizeObserver' in window) {
      const ro = new ResizeObserver(() => {
        comparatorRect = liveComparator.getBoundingClientRect();
      });
      ro.observe(liveComparator);
    }

    liveComparator.addEventListener(
      'pointermove',
      (e) => {
        if (!comparatorRect.width || !comparatorRect.height) {
          comparatorRect = liveComparator.getBoundingClientRect();
        }
        const x = ((e.clientX - comparatorRect.left) / comparatorRect.width) * 100;
        const y = ((e.clientY - comparatorRect.top) / comparatorRect.height) * 100;
        liveComparator.style.setProperty('--mouse-x', `${x.toFixed(2)}%`);
        liveComparator.style.setProperty('--mouse-y', `${y.toFixed(2)}%`);
      },
      { passive: true }
    );

    // 6.2. Spec Card manual inspection pauses/resumes the auto-cycle smoothly
    panels.forEach((panel) => {
      const matrix = panel.querySelector('.comparator-matrix');
      const specCards = Array.from(panel.querySelectorAll('.spec-card'));

      specCards.forEach((card, cardIdx) => {
        const inspectCard = () => {
          setSpecSelection(panel, cardIdx, { instant: false });
          if (canAnimateSpecs) {
            stopSpecCycle();
            const activeLine = card.querySelector('.spec-card__line');
            if (activeLine) gsap.set(activeLine, { scaleX: 1 });
          }
        };

        card.addEventListener('pointerenter', inspectCard);
        card.addEventListener('focus', inspectCard);
        card.addEventListener('click', inspectCard);
      });

      if (matrix) {
        matrix.addEventListener('pointerenter', () => {
          isUserPaused = true;
          stopSpecCycle();
          const currentIdx = Number.parseInt(panel.dataset.specIndex || '0', 10) || 0;
          const activeLine = specCards[currentIdx]?.querySelector('.spec-card__line');
          if (activeLine && typeof gsap !== 'undefined') gsap.set(activeLine, { scaleX: 1 });
        });

        matrix.addEventListener('pointerleave', () => {
          isUserPaused = false;
          if (panel === getActivePanel()) runSpecCycle(panel);
        });

        matrix.addEventListener('focusin', () => {
          isUserPaused = true;
          stopSpecCycle();
          const currentIdx = Number.parseInt(panel.dataset.specIndex || '0', 10) || 0;
          const activeLine = specCards[currentIdx]?.querySelector('.spec-card__line');
          if (activeLine && typeof gsap !== 'undefined') gsap.set(activeLine, { scaleX: 1 });
        });

        matrix.addEventListener('focusout', (e) => {
          if (!matrix.contains(e.relatedTarget)) {
            isUserPaused = false;
            if (panel === getActivePanel()) runSpecCycle(panel);
          }
        });
      }
    });

    if ('IntersectionObserver' in window) {
      const comparatorObserver = new IntersectionObserver(
        (entries) => {
          isInViewport = entries[0].isIntersecting;
          const activePanel = getActivePanel();
          if (isInViewport) {
            if (activePanel) runSpecCycle(activePanel);
          } else {
            stopSpecCycle();
          }
        },
        { threshold: 0.15 }
      );
      comparatorObserver.observe(liveComparator);
    }

    document.addEventListener('visibilitychange', () => {
      const activePanel = getActivePanel();
      if (document.hidden) {
        stopSpecCycle();
      } else if (activePanel && isInViewport && !isUserPaused) {
        runSpecCycle(activePanel);
      }
    });

    // 6.3. Overlap-free GSAP Sector Switcher (single-cell crossfade + smooth height tween)
    function cleanupClosingPanels(exceptPanel) {
      panels.forEach((panel) => {
        if (panel !== exceptPanel && panel.hasAttribute('data-closing')) {
          if (typeof gsap !== 'undefined') gsap.killTweensOf(panel);
          panel.removeAttribute('data-closing');
          panel.hidden = true;
          if (typeof gsap !== 'undefined') gsap.set(panel, { clearProps: 'opacity,transform' });
        }
      });
    }

    function activateUnit(targetUnit, focusTab = false) {
      if (!targetUnit) return;

      tabButtons.forEach((b) => {
        const isMatch = b.getAttribute('data-unit') === targetUnit;
        b.setAttribute('aria-selected', isMatch ? 'true' : 'false');
        b.setAttribute('tabindex', isMatch ? '0' : '-1');
        if (isMatch) {
          b.scrollIntoView({ block: 'nearest', inline: 'nearest' });
          if (focusTab) b.focus();
        }
      });

      if (targetUnit === activeUnit) return;

      const currentPanel = getActivePanel();
      const targetPanel = Array.from(panels).find((p) => p.getAttribute('data-unit') === targetUnit);
      if (!targetPanel) return;

      activeUnit = targetUnit;
      isUserPaused = false;
      stopSpecCycle();
      setSpecSelection(targetPanel, 0, { instant: true });

      if (!canAnimateSpecs) {
        panels.forEach((p) => {
          p.removeAttribute('data-closing');
          p.hidden = p !== targetPanel;
        });
        return;
      }

      gsap.killTweensOf(panelsWrap);
      cleanupClosingPanels(targetPanel);

      const startHeight = panelsWrap.getBoundingClientRect().height;

      if (currentPanel && currentPanel !== targetPanel) {
        gsap.killTweensOf(currentPanel);
        currentPanel.setAttribute('data-closing', '');
        gsap.to(currentPanel, {
          opacity: 0,
          y: -4,
          duration: 0.16,
          ease: 'power2.in',
          onComplete: () => {
            currentPanel.removeAttribute('data-closing');
            currentPanel.hidden = true;
            gsap.set(currentPanel, { clearProps: 'opacity,transform' });
          }
        });
      }

      targetPanel.removeAttribute('data-closing');
      targetPanel.hidden = false;
      gsap.killTweensOf(targetPanel);
      gsap.set(targetPanel, { opacity: 1, y: 0, clearProps: 'transform' });

      const endHeight = targetPanel.offsetHeight;
      if (Math.abs(endHeight - startHeight) > 1) {
        gsap.fromTo(
          panelsWrap,
          { height: startHeight },
          {
            height: endHeight,
            duration: 0.28,
            ease: 'power2.out',
            clearProps: 'height'
          }
        );
      } else {
        gsap.set(panelsWrap, { clearProps: 'height' });
      }

      const infoTargets = targetPanel.querySelectorAll('.comparator-panel__info > *');
      const matrixBox = targetPanel.querySelectorAll('.comparator-matrix');

      gsap.killTweensOf([...infoTargets, ...matrixBox]);
      gsap.fromTo(
        infoTargets,
        { opacity: 0, y: 8 },
        {
          opacity: 1,
          y: 0,
          duration: 0.28,
          stagger: 0.035,
          ease: 'power2.out',
          clearProps: 'transform,opacity'
        }
      );
      gsap.fromTo(
        matrixBox,
        { opacity: 0, y: 8 },
        {
          opacity: 1,
          y: 0,
          duration: 0.28,
          delay: 0.04,
          ease: 'power2.out',
          clearProps: 'transform,opacity',
          onComplete: () => {
            if (targetPanel === getActivePanel()) runSpecCycle(targetPanel);
          }
        }
      );
    }

    tabButtons.forEach((btn, idx) => {
      btn.addEventListener('click', () => {
        activateUnit(btn.getAttribute('data-unit'), false);
      });

      // Selection follows focus on Arrow/Home/End keys
      btn.addEventListener('keydown', (e) => {
        let nextIdx = null;
        if (e.key === 'ArrowRight') nextIdx = (idx + 1) % tabButtons.length;
        else if (e.key === 'ArrowLeft') nextIdx = (idx - 1 + tabButtons.length) % tabButtons.length;
        else if (e.key === 'Home') nextIdx = 0;
        else if (e.key === 'End') nextIdx = tabButtons.length - 1;

        if (nextIdx !== null) {
          e.preventDefault();
          const nextUnit = tabButtons[nextIdx].getAttribute('data-unit');
          activateUnit(nextUnit, true);
        }
      });
    });

    // Inicia ciclo automático no painel inicial ativo
    const initialPanel = getActivePanel();
    if (initialPanel) {
      runSpecCycle(initialPanel);
    }
  }

  // --- 6.5. LOCATIONS GRID (IPHONE GLASS + LIGHTING BORDER + AUTO LOOP COM RETOMADA DO ÚLTIMO) ---
  const locationsGrid = document.querySelector('.locations-grid');
  const locationCards = locationsGrid ? Array.from(locationsGrid.querySelectorAll('.location-item')) : [];

  if (locationsGrid && locationCards.length) {
    let locLoopIndex = 0;
    let locLoopTimer = null;
    let locPaused = false;
    let locInView = true;

    function clearActiveLocations() {
      locationCards.forEach((card) => {
        card.classList.remove('is-loop-active');
      });
    }

    function setActiveLocation(idx) {
      locationCards.forEach((card, i) => {
        card.classList.toggle('is-loop-active', i === idx);
      });
    }

    function stopLocationLoop() {
      if (locLoopTimer) {
        clearInterval(locLoopTimer);
        locLoopTimer = null;
      }
    }

    function startLocationLoop() {
      stopLocationLoop();
      if (prefersReducedMotion || locPaused || !locInView || document.hidden) return;
      setActiveLocation(locLoopIndex);
      locLoopTimer = setInterval(() => {
        if (locPaused || !locInView || document.hidden) return;
        locLoopIndex = (locLoopIndex + 1) % locationCards.length;
        setActiveLocation(locLoopIndex);
      }, 2600);
    }

    locationCards.forEach((card, idx) => {
      card.addEventListener('pointerenter', (e) => {
        locLoopIndex = idx;
        if (e.pointerType !== 'touch') {
          locPaused = true;
          stopLocationLoop();
          clearActiveLocations();
        } else {
          locPaused = false;
          startLocationLoop();
        }
      });

      card.addEventListener('focusin', () => {
        locLoopIndex = idx;
        locPaused = true;
        stopLocationLoop();
        clearActiveLocations();
      });
    });

    locationsGrid.addEventListener('pointerenter', (e) => {
      if (e.pointerType !== 'touch') {
        locPaused = true;
        stopLocationLoop();
        clearActiveLocations();
      }
    });

    locationsGrid.addEventListener('pointerleave', (e) => {
      if (e.pointerType !== 'touch') {
        locPaused = false;
        startLocationLoop();
      }
    });

    locationsGrid.addEventListener('focusout', (e) => {
      if (!locationsGrid.contains(e.relatedTarget) && !locationsGrid.matches(':hover')) {
        locPaused = false;
        startLocationLoop();
      }
    });

    if ('IntersectionObserver' in window) {
      const locObserver = new IntersectionObserver(
        (entries) => {
          locInView = entries[0].isIntersecting;
          if (locInView) startLocationLoop();
          else stopLocationLoop();
        },
        { threshold: 0.2 }
      );
      locObserver.observe(locationsGrid);
    } else {
      startLocationLoop();
    }

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stopLocationLoop();
      else startLocationLoop();
    });
  }

  // --- 6.6. DESTINOS RADIAL WHEEL CAROUSEL (#destinos) ---
  const destinosSection = document.getElementById('destinos');
  if (destinosSection) {
    const wheelSticky = destinosSection.querySelector('.destinos-wheel__sticky');
    const wheelStage = destinosSection.querySelector('.destinos-wheel__stage');
    const wheelTrack = destinosSection.querySelector('.destinos-wheel__track');
    const wheelCards = Array.from(destinosSection.querySelectorAll('.destinos-wheel__card'));
    const prevBtn = destinosSection.querySelector('[data-wheel-dir="prev"]');
    const nextBtn = destinosSection.querySelector('[data-wheel-dir="next"]');
    const regionBtns = Array.from(destinosSection.querySelectorAll('.destinos-wheel__region-btn'));
    const progressFill = destinosSection.querySelector('.destinos-wheel__progress-fill');
    const readoutEl = destinosSection.querySelector('.destinos-wheel__readout');
    const mouseCueEl = destinosSection.querySelector('.destinos-wheel__mouse');
    const liveStatusEl = document.getElementById('destinos-live-status');
    const tabletMobileQuery = window.matchMedia('(max-width: 1024px)');
    const isScrollLinkedWheel = () => !prefersReducedMotion && !tabletMobileQuery.matches;

    const totalCards = wheelCards.length;
    const maxIdx = Math.max(0, totalCards - 1);
    const stepDeg = totalCards > 0 ? 360 / totalCards : 12;
    const halfTotal = totalCards / 2;

    let currentFloat = 0;
    let targetFloat = 0;
    let wheelVelocity = 0;
    let activeRoundedIdx = 0;
    let wheelRafId = 0;
    let lastAnnouncedIdx = -1;
    let manualJumpUntil = 0;

    function getWheelRadius() {
      const cardW = wheelCards[0]?.offsetWidth || 200;
      return (cardW * Math.max(totalCards, 1) * 1.18) / (Math.PI * 2);
    }

    let wheelRadius = getWheelRadius();
    window.addEventListener('resize', () => {
      wheelRadius = getWheelRadius();
      renderWheel(currentFloat, currentFloat / (maxIdx || 1));
    });

    function pad2(num) {
      return String(num).padStart(2, '0');
    }

    function updateWheelUI(idx, progressVal) {
      const clampedIdx = Math.max(0, Math.min(maxIdx, idx));
      const activeCard = wheelCards[clampedIdx];
      const city = activeCard?.dataset.title || '';
      const country = activeCard?.dataset.country || '';

      if (readoutEl && city) {
        readoutEl.textContent = `${pad2(clampedIdx + 1)} / ${pad2(totalCards)} — ${city}, ${country}`;
      }

      if (progressFill) {
        const minScale = 1 / totalCards;
        const scale = Math.max(minScale, Math.min(1, (clampedIdx + 1) / totalCards));
        const ratio = typeof progressVal === 'number' && !prefersReducedMotion
          ? Math.max(minScale, Math.min(1, progressVal))
          : scale;
        progressFill.style.transform = `scaleX(${ratio.toFixed(4)})`;
      }

      regionBtns.forEach((btn) => {
        const group = btn.dataset.countryGroup;
        btn.classList.toggle('is-active', group === country);
      });

      if (prevBtn) prevBtn.disabled = clampedIdx <= 0;
      if (nextBtn) nextBtn.disabled = clampedIdx >= maxIdx;
    }

    function announceActiveSlide(idx) {
      if (!liveStatusEl || idx === lastAnnouncedIdx) return;
      const card = wheelCards[idx];
      if (!card) return;
      lastAnnouncedIdx = idx;
      liveStatusEl.textContent = `${card.dataset.title || ''}, ${card.dataset.country || ''} (${idx + 1} de ${totalCards})`;
    }

    function renderWheel(floatPos, progressVal) {
      const nearestIdx = Math.max(0, Math.min(maxIdx, Math.round(floatPos)));

      wheelCards.forEach((card, i) => {
        let delta = i - floatPos;
        if (delta > halfTotal) delta -= totalCards;
        if (delta < -halfTotal) delta += totalCards;

        const absDelta = Math.abs(delta);
        if (absDelta > 5.2) {
          card.style.setProperty('--card-opacity', '0');
          card.style.visibility = 'hidden';
          card.style.pointerEvents = 'none';
          card.classList.remove('is-active');
          return;
        }

        const angle = delta * stepDeg;
        const rad = angle * (Math.PI / 180);
        const x = Math.sin(rad) * wheelRadius;
        const y = (1 - Math.cos(rad)) * wheelRadius;

        const blur = prefersReducedMotion ? 0 : Math.min(7, (absDelta / 2.6) * 7);
        const gray = Math.min(1, absDelta * 0.92);
        const opacity = Math.max(0, 1 - absDelta / 4.25);

        // Quadro centralizado sempre expande (~1.18x) com transição elástica suave
        const centerEase = Math.max(0, 1 - Math.min(1, absDelta));
        const smoothCenter = centerEase * centerEase * (3 - 2 * centerEase);
        const baseSideScale = Math.max(0.76, 0.90 - Math.max(0, absDelta - 1) * 0.05);
        const scale = baseSideScale + smoothCenter * (1.18 - baseSideScale);

        const z = Math.max(1, Math.round(30 - absDelta * 4));
        const captionActive = Math.max(0, 1 - absDelta / 0.42);
        const captionY = prefersReducedMotion ? 0 : -18 * (1 - captionActive);

        card.style.visibility = 'visible';
        card.style.pointerEvents = 'auto';
        card.style.setProperty('--card-x', `${x.toFixed(2)}px`);
        card.style.setProperty('--card-y', `${y.toFixed(2)}px`);
        card.style.setProperty('--card-angle', `${angle.toFixed(3)}deg`);
        card.style.setProperty('--card-blur', `${blur.toFixed(2)}px`);
        card.style.setProperty('--card-gray', gray.toFixed(3));
        card.style.setProperty('--card-opacity', opacity.toFixed(3));
        card.style.setProperty('--card-scale', scale.toFixed(3));
        card.style.setProperty('--card-z', String(z));
        card.style.setProperty('--caption-opacity', captionActive.toFixed(3));
        card.style.setProperty('--caption-y', `${captionY.toFixed(1)}px`);
        card.classList.toggle('is-active', i === nearestIdx && absDelta < 0.48);
      });

      if (nearestIdx !== activeRoundedIdx || typeof progressVal === 'number') {
        activeRoundedIdx = nearestIdx;
        updateWheelUI(nearestIdx, progressVal);
      }

      if (mouseCueEl && typeof progressVal === 'number') {
        mouseCueEl.style.opacity = progressVal > 0.78 ? String(Math.max(0, 1 - (progressVal - 0.78) / 0.22)) : '1';
      }
    }

    function tickWheel() {
      const stiffness = 0.14;
      const damping = 0.72;
      const force = (targetFloat - currentFloat) * stiffness;
      wheelVelocity = (wheelVelocity + force) * damping;
      currentFloat += wheelVelocity;

      if (Math.abs(targetFloat - currentFloat) < 0.0015 && Math.abs(wheelVelocity) < 0.0015) {
        currentFloat = targetFloat;
        wheelVelocity = 0;
        renderWheel(currentFloat, currentFloat / (maxIdx || 1));
        wheelRafId = 0;
        announceActiveSlide(Math.round(currentFloat));
        return;
      }

      renderWheel(currentFloat, currentFloat / (maxIdx || 1));
      wheelRafId = requestAnimationFrame(tickWheel);
    }

    function setWheelTarget(nextFloat, immediate = false) {
      const lockedTarget = Math.max(0, Math.min(maxIdx, Math.round(nextFloat)));
      targetFloat = lockedTarget;
      if (immediate || prefersReducedMotion) {
        if (wheelRafId) {
          cancelAnimationFrame(wheelRafId);
          wheelRafId = 0;
        }
        wheelVelocity = 0;
        currentFloat = targetFloat;
        renderWheel(currentFloat, currentFloat / (maxIdx || 1));
        announceActiveSlide(Math.round(currentFloat));
        return;
      }
      if (!wheelRafId) {
        wheelRafId = requestAnimationFrame(tickWheel);
      }
    }

    let wheelST = null;

    function goToWheelIndex(nextIdx) {
      const clamped = Math.max(0, Math.min(maxIdx, nextIdx));
      manualJumpUntil = performance.now() + 850;
      setWheelTarget(clamped, prefersReducedMotion);

      const runwaySpan = wheelSticky
        ? destinosSection.offsetHeight - wheelSticky.offsetHeight
        : 0;

      if (isScrollLinkedWheel() && runwaySpan > 60) {
        const targetProgress = maxIdx > 0 ? clamped / maxIdx : 0;
        let targetScrollY;
        if (wheelST && typeof wheelST.start === 'number' && typeof wheelST.end === 'number' && wheelST.end > wheelST.start) {
          targetScrollY = wheelST.start + targetProgress * (wheelST.end - wheelST.start);
        } else {
          const sectionTop = destinosSection.getBoundingClientRect().top + window.scrollY;
          targetScrollY = sectionTop + targetProgress * runwaySpan;
        }
        if (window.__lenis) {
          window.__lenis.scrollTo(targetScrollY, { duration: 0.72 });
        } else {
          window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
        }
      }

      announceActiveSlide(clamped);
    }

    let suppressNextCardClick = false;

    if (wheelStage) {
      let dragPointerId = null;
      let dragStartX = 0;
      let dragStartY = 0;
      let dragStartFloat = 0;
      let dragLockedAxis = null;
      let lastPointerX = 0;
      let lastDragVx = 0;

      function finishHorizontalDrag() {
        if (dragPointerId === null) return;
        const wasHorizontal = dragLockedAxis === 'x';
        dragPointerId = null;
        dragLockedAxis = null;
        wheelStage.classList.remove('is-dragging');

        if (!wasHorizontal) return;

        // Impulso sutil do gesto para avançar/voltar um card em swipes rápidos
        let projected = currentFloat;
        if (Math.abs(lastDragVx) > 2.5) {
          projected += lastDragVx < 0 ? 0.55 : -0.55;
        }
        const snapped = Math.max(0, Math.min(maxIdx, Math.round(projected)));
        goToWheelIndex(snapped);
        setTimeout(() => {
          suppressNextCardClick = false;
        }, 60);
      }

      wheelStage.addEventListener('pointerdown', (e) => {
        if (e.button !== undefined && e.button !== 0 && e.pointerType === 'mouse') return;
        dragPointerId = e.pointerId;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        lastPointerX = e.clientX;
        lastDragVx = 0;
        dragStartFloat = currentFloat;
        dragLockedAxis = null;
      });

      window.addEventListener('pointermove', (e) => {
        if (dragPointerId === null || e.pointerId !== dragPointerId) return;
        const dx = e.clientX - dragStartX;
        const dy = e.clientY - dragStartY;

        if (!dragLockedAxis) {
          if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
          dragLockedAxis = Math.abs(dx) >= Math.abs(dy) ? 'x' : 'y';
          if (dragLockedAxis === 'y') {
            dragPointerId = null;
            return;
          }
          suppressNextCardClick = true;
          wheelStage.classList.add('is-dragging');
          if (wheelRafId) {
            cancelAnimationFrame(wheelRafId);
            wheelRafId = 0;
          }
          wheelVelocity = 0;
        }

        if (dragLockedAxis === 'x') {
          lastDragVx = e.clientX - lastPointerX;
          lastPointerX = e.clientX;
          const stepPx = Math.max(115, (wheelCards[0]?.offsetWidth || 165) * 0.85);
          const nextFloat = Math.max(0, Math.min(maxIdx, dragStartFloat - dx / stepPx));
          currentFloat = nextFloat;
          targetFloat = Math.round(nextFloat);
          renderWheel(currentFloat, currentFloat / (maxIdx || 1));
        }
      });

      window.addEventListener('pointerup', (e) => {
        if (e.pointerId === dragPointerId) finishHorizontalDrag();
      });

      window.addEventListener('pointercancel', (e) => {
        if (e.pointerId === dragPointerId) finishHorizontalDrag();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => goToWheelIndex(activeRoundedIdx - 1));
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => goToWheelIndex(activeRoundedIdx + 1));
    }

    regionBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.dataset.jumpIndex || 0);
        goToWheelIndex(idx);
      });
    });

    wheelCards.forEach((card, idx) => {
      card.addEventListener('click', (e) => {
        e.stopPropagation();
        if (suppressNextCardClick) return;
        if (idx !== targetFloat) {
          goToWheelIndex(idx);
        }
      });
    });

    if (wheelTrack) {
      wheelTrack.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          goToWheelIndex(activeRoundedIdx + 1);
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          goToWheelIndex(activeRoundedIdx - 1);
        } else if (e.key === 'Home') {
          e.preventDefault();
          goToWheelIndex(0);
        } else if (e.key === 'End') {
          e.preventDefault();
          goToWheelIndex(maxIdx);
        }
      });
    }

    const hasGSAP = typeof gsap !== 'undefined';
    const hasScrollTrigger = typeof ScrollTrigger !== 'undefined';

    if (!prefersReducedMotion) {
      if (hasScrollTrigger && hasGSAP) {
        gsap.registerPlugin(ScrollTrigger);
        wheelST = ScrollTrigger.create({
          trigger: destinosSection,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
          onUpdate: (self) => {
            if (!isScrollLinkedWheel()) return;
            if (performance.now() < manualJumpUntil) return;
            const snapped = Math.round(self.progress * maxIdx);
            if (snapped !== targetFloat) {
              setWheelTarget(snapped, false);
            }
          },
        });

        tabletMobileQuery.addEventListener('change', () => {
          ScrollTrigger.refresh();
        });
      } else {
        let tickingScroll = false;
        window.addEventListener(
          'scroll',
          () => {
            if (!isScrollLinkedWheel()) return;
            if (tickingScroll) return;
            tickingScroll = true;
            requestAnimationFrame(() => {
              tickingScroll = false;
              if (performance.now() < manualJumpUntil) return;
              const runwaySpan = wheelSticky
                ? destinosSection.offsetHeight - wheelSticky.offsetHeight
                : 0;
              if (runwaySpan <= 0) return;
              const rect = destinosSection.getBoundingClientRect();
              const progress = Math.max(0, Math.min(1, -rect.top / runwaySpan));
              const snapped = Math.round(progress * maxIdx);
              if (snapped !== targetFloat) {
                setWheelTarget(snapped, false);
              }
            });
          },
          { passive: true }
        );
      }
    }

    // Initial paint at index 0 (Dallas, EUA)
    renderWheel(0, 0);
    updateWheelUI(0, 0);
  }

  // --- 7. ACCORDION TRIGGER (SMOOTH EXPAND/COLLAPSE - ANIMATE-TO-INTRINSIC-SIZES) ---
  const accordionTriggers = document.querySelectorAll('.accordion-trigger');
  accordionTriggers.forEach((trigger) => {
    const parentItem = trigger.closest('.accordion-item');
    if (parentItem) {
      trigger.setAttribute('aria-expanded', parentItem.classList.contains('is-open') ? 'true' : 'false');
    }

    trigger.addEventListener('click', () => {
      if (!parentItem) return;

      const parentList = parentItem.closest('.accordion-list');
      const isOpen = parentItem.classList.contains('is-open');

      if (parentList) {
        parentList.querySelectorAll('.accordion-item.is-open').forEach((openItem) => {
          if (openItem !== parentItem) {
            openItem.classList.remove('is-open');
            const openBtn = openItem.querySelector('.accordion-trigger');
            if (openBtn) openBtn.setAttribute('aria-expanded', 'false');
          }
        });
      }

      const nextState = !isOpen;
      parentItem.classList.toggle('is-open', nextState);
      trigger.setAttribute('aria-expanded', nextState ? 'true' : 'false');
    });
  });

  // --- 7.5. INTERACTIVE STICKY STAGE EXPLORER (SUBPAGES SCROLL-SPY & NAV) ---
  document.querySelectorAll('.stage-explorer').forEach((explorer) => {
    const navLinks = explorer.querySelectorAll('.stage-nav__link');
    const stageCards = explorer.querySelectorAll('.stage-card[id]');
    const liveNote = explorer.querySelector('.stage-explorer__live-note');

    if (!navLinks.length || !stageCards.length) return;

    function activateStage(stageId) {
      navLinks.forEach((link) => {
        const isMatch = link.getAttribute('href') === `#${stageId}`;
        link.classList.toggle('is-active', isMatch);
        if (isMatch && liveNote) {
          const noteText = link.getAttribute('data-note');
          if (noteText) liveNote.textContent = noteText;
        }
      });

      stageCards.forEach((card) => {
        card.classList.toggle('is-active', card.id === stageId);
      });
    }

    navLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (!href || !href.startsWith('#')) return;
        const targetId = href.slice(1);
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          e.preventDefault();
          activateStage(targetId);
          targetEl.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
        }
      });
    });

    if ('IntersectionObserver' in window) {
      const stageObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              activateStage(entry.target.id);
            }
          });
        },
        { rootMargin: '-22% 0px -55% 0px', threshold: 0.05 }
      );

      stageCards.forEach((card) => stageObserver.observe(card));
    }
  });

  // --- 7.6. INTERACTIVE 4-FRAME VISUAL STORYTELLER (NOSSA HISTÓRIA / VISÃO) ---
  document.querySelectorAll('.story-showcase').forEach((showcase) => {
    const frames = showcase.querySelectorAll('.story-frame');
    const detailBox = showcase.querySelector('.story-showcase__detail');
    const detailTitle = showcase.querySelector('.story-showcase__detail-title');
    const detailText = showcase.querySelector('.story-showcase__detail-text');

    if (!frames.length) return;

    frames.forEach((frame) => {
      const selectFrame = () => {
        frames.forEach((f) => {
          f.classList.remove('is-active');
          f.setAttribute('aria-pressed', 'false');
        });
        frame.classList.add('is-active');
        frame.setAttribute('aria-pressed', 'true');

        const newTitle = frame.getAttribute('data-title');
        const newDetail = frame.getAttribute('data-detail');

        if (detailText && newDetail && detailText.textContent !== newDetail) {
          if (detailBox) detailBox.classList.add('is-updating');
          setTimeout(() => {
            if (detailTitle && newTitle) detailTitle.textContent = newTitle;
            detailText.textContent = newDetail;
            if (detailBox) detailBox.classList.remove('is-updating');
          }, 110);
        }
      };

      frame.addEventListener('pointerenter', selectFrame);
      frame.addEventListener('focus', selectFrame);
      frame.addEventListener('click', selectFrame);
    });
  });

  // --- 7.7. INTERACTIVE ARCHITECTURAL PERSPECTIVES DECK (BORA BEACH) ---
  document.querySelectorAll('.perspective-deck').forEach((deck) => {
    const items = deck.querySelectorAll('.perspective-deck__item');
    items.forEach((item) => {
      const activateItem = () => {
        items.forEach((i) => i.classList.remove('is-active'));
        item.classList.add('is-active');
      };
      item.addEventListener('pointerenter', activateItem);
      item.addEventListener('focus', activateItem);
      item.addEventListener('click', activateItem);
    });
  });

  // --- 8. DYNAMIC SCROLL REVEAL (STAGGERED INTERSECTION OBSERVER) ---
  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const revealSelectors = [
      '.section-header',
      '.flags-bridge__lockup',
      '.final-cta-box',
      '.chapter-split',
      '.manifesto-block',
      '.overview-split',
      '.stage-explorer__sidebar',
      '.stage-card',
      '.story-showcase',
      '.perspective-deck',
      '.live-comparator',
      '.panorama-showcase',
      '.cta-box',
      '.contact-form'
    ];

    const staggeredGrids = [
      { parent: '.tri-grid', child: '.tri-card', step: 0.1 },
      { parent: '.quad-grid', child: '.quad-card', step: 0.09 },
      { parent: '.perspective-grid', child: '.perspective-card', step: 0.09 },
      { parent: '.locations-grid', child: '.location-item', step: 0.08 },
      { parent: '.accordion-list', child: '.accordion-item', step: 0.06 },
      { parent: '.contact-direct', child: '.contact-card', step: 0.08 }
    ];

    const elementsToObserve = [];

    document.querySelectorAll(revealSelectors.join(',')).forEach((el) => {
      el.classList.add('reveal-ready');
      elementsToObserve.push(el);
    });

    staggeredGrids.forEach(({ parent, child, step }) => {
      document.querySelectorAll(parent).forEach((grid) => {
        grid.querySelectorAll(child).forEach((item, idx) => {
          item.classList.add('reveal-ready');
          item.style.setProperty('--reveal-delay', `${(idx * step).toFixed(2)}s`);
          elementsToObserve.push(item);
        });
      });
    });

    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    elementsToObserve.forEach((el) => revealObserver.observe(el));
  }

  // --- 9. DYNAMIC METRIC COUNTERS (COUNT-UP ANIMATION) ---
  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const counterElements = document.querySelectorAll('.metric-item__value, .fact-item__num');

    function parseMetricText(rawText) {
      const text = rawText.trim();
      // Preserva anos históricos exatos (ex: 2019, 2023) ou textos puros (ex: Ilhéus, Rooftop 360°)
      if (/^(19|20)\d{2}$/.test(text) || text.includes('360°')) return null;

      const match = text.match(/^([+]?)(\d+(?:\.\d+)?)(.*)$/);
      if (!match) return null;

      const prefix = match[1] || '';
      const numStr = match[2];
      const suffix = match[3] || '';
      const hasDotSeparator = numStr.includes('.') && numStr.split('.')[1].length === 3;
      const targetVal = parseInt(numStr.replace(/\./g, ''), 10);

      if (isNaN(targetVal) || targetVal <= 0) return null;
      return { prefix, targetVal, suffix, hasDotSeparator, original: text };
    }

    function formatNumber(num, useDot) {
      if (!useDot) return String(num);
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }

    const counterObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          obs.unobserve(el);

          const parsed = parseMetricText(el.textContent);
          if (!parsed) return;

          const duration = 1500;
          const startTime = performance.now();

          function updateCounter(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Curva easeOutQuart
            const eased = 1 - Math.pow(1 - progress, 4);
            const currentVal = Math.round(parsed.targetVal * eased);

            el.textContent = `${parsed.prefix}${formatNumber(currentVal, parsed.hasDotSeparator)}${parsed.suffix}`;

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              el.textContent = parsed.original;
            }
          }

          requestAnimationFrame(updateCounter);
        });
      },
      { threshold: 0.35 }
    );

    counterElements.forEach((el) => counterObserver.observe(el));
  }

  // --- 10. BLOBS GLOW CANVAS ---
  (function initBlobsGlow() {
    let canvas = document.getElementById('matrix-canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'matrix-canvas';
      document.body.prepend(canvas);
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width, height;
    let animId = null;

    const isMobileMode = () => window.matchMedia('(max-width: 768px)').matches;

    // Configuração dos Blobs com a paleta Blobs Glow (Indigo/Violet)
    const blobs = [
      {
        baseX: 0.2,
        baseY: 0.28,
        radiusRatio: 0.46,
        speedX: 0.00045,
        speedY: 0.00035,
        rangeX: 0.18,
        rangeY: 0.15,
        phase: 0,
        color: 'rgba(99,102,241,0.3)'
      },
      {
        baseX: 0.8,
        baseY: 0.24,
        radiusRatio: 0.48,
        speedX: 0.00038,
        speedY: 0.00052,
        rangeX: 0.16,
        rangeY: 0.18,
        phase: 2.1,
        color: 'rgba(99,102,241,0.3)'
      },
      {
        baseX: 0.5,
        baseY: 0.72,
        radiusRatio: 0.52,
        speedX: 0.00032,
        speedY: 0.00042,
        rangeX: 0.22,
        rangeY: 0.16,
        phase: 4.3,
        color: 'rgba(99,102,241,0.3)'
      },
      {
        baseX: 0.15,
        baseY: 0.82,
        radiusRatio: 0.40,
        speedX: 0.00055,
        speedY: 0.00038,
        rangeX: 0.15,
        rangeY: 0.14,
        phase: 1.2,
        color: 'rgba(99,102,241,0.25)'
      },
      {
        baseX: 0.85,
        baseY: 0.78,
        radiusRatio: 0.42,
        speedX: 0.00042,
        speedY: 0.00048,
        rangeX: 0.16,
        rangeY: 0.15,
        phase: 3.5,
        color: 'rgba(99,102,241,0.25)'
      }
    ];

    const targetMouse = { x: -2000, y: -2000 };
    const smoothMouse = { x: -2000, y: -2000 };
    let hasMouseInteracted = false;

    function resize() {
      const mobile = isMobileMode();
      const dpr = mobile ? 1 : Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (mobile || prefersReducedMotion) {
        if (animId) {
          cancelAnimationFrame(animId);
          animId = null;
        }
        drawStaticBlobs();
      } else {
        if (!animId) {
          animId = requestAnimationFrame(animate);
        }
      }
    }

    function drawBlob(x, y, r, color = 'rgba(99,102,241,0.3)') {
      // Blobs Glow
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, color);
      g.addColorStop(1, 'transparent');

      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    function drawStaticBlobs() {
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'screen';
      const baseDim = Math.min(width, height);
      const count = isMobileMode() ? 3 : blobs.length;

      for (let i = 0; i < count; i++) {
        const b = blobs[i];
        const x = b.baseX * width;
        const y = b.baseY * height;
        const r = b.radiusRatio * baseDim;
        drawBlob(x, y, r, b.color);
      }
      ctx.globalCompositeOperation = 'source-over';
    }

    window.addEventListener(
      'mousemove',
      (e) => {
        if (isMobileMode()) return;
        hasMouseInteracted = true;
        targetMouse.x = e.clientX;
        targetMouse.y = e.clientY;
        if (smoothMouse.x < -1000) {
          smoothMouse.x = e.clientX;
          smoothMouse.y = e.clientY;
        }
      },
      { passive: true }
    );

    window.addEventListener('mouseleave', () => {
      targetMouse.x = -2000;
      targetMouse.y = -2000;
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden && animId) {
        cancelAnimationFrame(animId);
        animId = null;
      } else if (!document.hidden && !isMobileMode() && !prefersReducedMotion && !animId) {
        animId = requestAnimationFrame(animate);
      }
    });

    function animate(time) {
      if (isMobileMode() || prefersReducedMotion) return;

      const t = time || 0;
      const baseDim = Math.min(width, height);

      // Interpolação suave do cursor (Lerp)
      smoothMouse.x += (targetMouse.x - smoothMouse.x) * 0.08;
      smoothMouse.y += (targetMouse.y - smoothMouse.y) * 0.08;

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'screen';

      // Desenha os blobs ambientais com deriva harmônica
      for (let i = 0; i < blobs.length; i++) {
        const b = blobs[i];
        const curX = (b.baseX + Math.sin(t * b.speedX + b.phase) * b.rangeX) * width;
        const curY = (b.baseY + Math.cos(t * b.speedY + b.phase) * b.rangeY) * height;
        const curR = (b.radiusRatio + Math.sin(t * 0.0004 + b.phase) * 0.05) * baseDim;

        drawBlob(curX, curY, Math.max(100, curR), b.color);
      }

      // Brilho interativo suave acompanhando o cursor (se ativo na viewport)
      if (hasMouseInteracted && smoothMouse.x > -500 && smoothMouse.x < width + 500 && smoothMouse.y > -500 && smoothMouse.y < height + 500) {
        const mouseR = Math.max(260, baseDim * 0.38);
        drawBlob(smoothMouse.x, smoothMouse.y, mouseR, 'rgba(99,102,241,0.3)');
      }

      ctx.globalCompositeOperation = 'source-over';
      animId = requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    resize();
  })();

  // --- 10. MENU FIXO DE CONTATO RADIAL (FAB GSAP) ---
  (function initRadialMenu() {
    const radialWrap = document.querySelector('#radialWrap');
    const fabBtn = document.querySelector('#fabBtn');
    if (!radialWrap || !fabBtn) return;

    const items = Array.from(radialWrap.querySelectorAll('.fab-item'));
    const pulseRing = radialWrap.querySelector('#pulseRing');
    const iconChat = radialWrap.querySelector('.icon-chat');
    const iconClose = radialWrap.querySelector('.icon-close');

    const radius = 125;
    const startAngle = 180;
    const endAngle = 270;
    const angleStep = items.length > 1 ? (endAngle - startAngle) / (items.length - 1) : 0;

    let tl = null;
    let isOpen = false;

    if (typeof gsap !== 'undefined') {
      gsap.set(items, { x: 0, y: 0, scale: 0, opacity: 0, rotation: -35 });

      tl = gsap.timeline({ paused: true });

      if (pulseRing) {
        tl.to(pulseRing, { opacity: 0, scale: 0.8, duration: 0.2 }, 0);
      }

      if (iconChat) {
        tl.to(iconChat, {
          scale: 0.2,
          rotation: -90,
          opacity: 0,
          duration: 0.3,
          ease: 'power2.inOut'
        }, 0);
      }

      if (iconClose) {
        tl.to(iconClose, {
          scale: 1,
          rotation: 0,
          opacity: 1,
          duration: 0.45,
          ease: 'back.out(2)'
        }, 0.1);
      }

      items.forEach((item, i) => {
        const rad = (startAngle + angleStep * i) * (Math.PI / 180);
        const tx = Math.cos(rad) * radius;
        const ty = Math.sin(rad) * radius;

        tl.to(item, {
          x: tx,
          y: ty,
          scale: 1,
          opacity: 1,
          rotation: 0,
          pointerEvents: 'auto',
          duration: 0.65,
          ease: 'elastic.out(1, 0.5)',
          easeReverse: 'power3.in'
        }, i * 0.055);
      });

      items.forEach((item) => {
        item.addEventListener('mouseenter', () => {
          if (!isOpen) return;
          gsap.to(item, { scale: 1.18, duration: 0.3, ease: 'back.out(2)' });
        });
        item.addEventListener('mouseleave', () => {
          if (!isOpen) return;
          gsap.to(item, { scale: 1, duration: 0.25, ease: 'power2.out' });
        });
      });
    }

    function toggleMenu() {
      if (tl) {
        if (isOpen) {
          tl.timeScale(1.75).reverse();
          fabBtn.setAttribute('aria-expanded', 'false');
        } else {
          tl.timeScale(1).play();
          fabBtn.setAttribute('aria-expanded', 'true');
        }
      } else {
        // Fallback sem CDN GSAP
        items.forEach((item, i) => {
          const rad = (startAngle + angleStep * i) * (Math.PI / 180);
          const tx = Math.cos(rad) * radius;
          const ty = Math.sin(rad) * radius;
          item.style.transition = 'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease';
          if (isOpen) {
            item.style.transform = 'translate(0px, 0px) scale(0)';
            item.style.opacity = '0';
            item.style.pointerEvents = 'none';
          } else {
            item.style.transform = `translate(${tx}px, ${ty}px) scale(1)`;
            item.style.opacity = '1';
            item.style.pointerEvents = 'auto';
          }
        });
        if (iconChat) {
          iconChat.style.opacity = isOpen ? '1' : '0';
          iconChat.style.transform = isOpen ? 'scale(1) rotate(0deg)' : 'scale(0.2) rotate(-90deg)';
        }
        if (iconClose) {
          iconClose.style.opacity = isOpen ? '0' : '1';
          iconClose.style.transform = isOpen ? 'scale(0.2) rotate(90deg)' : 'scale(1) rotate(0deg)';
        }
        if (pulseRing) {
          pulseRing.style.opacity = isOpen ? '1' : '0';
        }
        fabBtn.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
      }
      isOpen = !isOpen;
    }

    fabBtn.addEventListener('click', toggleMenu);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen) toggleMenu();
    });

    document.addEventListener('click', (e) => {
      if (isOpen && !radialWrap.contains(e.target)) {
        toggleMenu();
      }
    });
  })();

  // --- 10.4. CLIP-2 & CLIP-3 PARALLAX MEDIA (GSAP SCROLLTRIGGER) ---
  (function initClipParallax() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || prefersReducedMotion) return;
    gsap.registerPlugin(ScrollTrigger);

    document.querySelectorAll('.clip-section').forEach((section) => {
      const media = section.querySelector('.clip-grid__parallax-media');
      const clipBox = section.querySelector('.clip-grid__media-inner');
      if (!media || !clipBox) return;

      gsap.fromTo(
        media,
        { yPercent: -10, scale: 1.24 },
        {
          yPercent: 10,
          scale: 1.18,
          ease: 'none',
          scrollTrigger: {
            trigger: clipBox,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        }
      );
    });
  })();

  // --- 10.5. ECOSYSTEM PINNED PANELS WITH OVERSCROLL (GSAP SCROLLTRIGGER) ---
  (function initEcosystemPanels() {
    const panelsContainer = document.getElementById('ecoPanels');
    if (!panelsContainer || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    const panels = Array.from(panelsContainer.querySelectorAll('.eco-panel'));
    if (!panels.length) return;

    gsap.registerPlugin(ScrollTrigger);

    if (prefersReducedMotion) return;

    const mm = gsap.matchMedia();

    mm.add('(min-width: 1025px)', () => {
      panels.forEach((panel, i) => {
        panel.style.zIndex = String(i + 1);
        const card = panel.querySelector('.eco-card');
        if (!card) return;

        // Painéis 0..N-2 fixam sem pinSpacing (com overscroll caso maiores que a viewport)
        // enquanto o painel seguinte sobe e sobrepõe o anterior
        if (i < panels.length - 1) {
          const nextPanel = panels[i + 1];
          const pinStart = () => (panel.offsetHeight <= window.innerHeight ? 'top top' : 'bottom bottom');
          const nextLand = () => (nextPanel.offsetHeight <= window.innerHeight ? 'top top' : 'bottom bottom');

          ScrollTrigger.create({
            trigger: panel,
            start: pinStart,
            endTrigger: nextPanel,
            end: nextLand,
            pin: true,
            pinSpacing: false,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            refreshPriority: 20
          });

          // Enquanto o painel de baixo sobe, o de cima recua em escala e profundidade para trás dele
          const depthTl = gsap.timeline({
            scrollTrigger: {
              trigger: nextPanel,
              start: 'top bottom',
              end: nextLand,
              scrub: true,
              invalidateOnRefresh: true,
              refreshPriority: 19
            }
          });

          depthTl
            .fromTo(
              card,
              {
                scale: 1,
                y: 0,
                opacity: 1,
                filter: 'brightness(1)'
              },
              {
                scale: 0.9,
                y: 12,
                opacity: 0.35,
                filter: 'brightness(0.48)',
                duration: 0.88,
                ease: 'none'
              },
              0
            )
            .to(
              card,
              {
                scale: 0.87,
                opacity: 0,
                duration: 0.12,
                ease: 'none'
              },
              0.88
            );
        }
      });

      return () => {
        panels.forEach((panel) => {
          panel.style.zIndex = '';
          const card = panel.querySelector('.eco-card');
          if (card) gsap.set(card, { clearProps: 'all' });
        });
      };
    });
  })();

  // --- 11. GSAP SWIPE SLIDER (COUNTER-SLIDING PANELS + HERO-SECTION-3 CONTENT) ---
  (function initSwipeSlider() {
    const section = document.querySelector('.section-swipe-slider');
    if (!section) return;

    const slides = Array.from(section.querySelectorAll('.swipe-slide'));
    const outerWrappers = Array.from(section.querySelectorAll('.swipe-slide__outer'));
    const innerWrappers = Array.from(section.querySelectorAll('.swipe-slide__inner'));
    const bgs = Array.from(section.querySelectorAll('.swipe-slide__bg'));
    const cards = Array.from(section.querySelectorAll('.swipe-slide__card'));
    const dots = Array.from(section.querySelectorAll('.swipe-dot'));
    const currentCounters = section.querySelectorAll('.swipe-counter__current');
    const nextBtn = section.querySelector('.swipe-btn--next');
    const prevBtn = section.querySelector('.swipe-btn--prev');
    const mainNav = document.getElementById('mainNavbar');

    if (!slides.length || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    let currentActiveIndex = 0;
    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    slides.forEach((slide, i) => {
      gsap.set(slide, { zIndex: i + 1, autoAlpha: 1 });
      if (i === 0) {
        gsap.set(outerWrappers[i], { yPercent: 0 });
        gsap.set(innerWrappers[i], { yPercent: 0 });
        gsap.set(bgs[i], { yPercent: 0, scale: 1 });
        gsap.set(cards[i], { y: 0, opacity: 1 });
      } else {
        gsap.set(outerWrappers[i], { yPercent: 100 });
        gsap.set(innerWrappers[i], { yPercent: -100 });
        gsap.set(bgs[i], { yPercent: 15, scale: 1.14 });
        gsap.set(cards[i], { y: 36, opacity: 0 });
      }
    });

    const masterTL = gsap.timeline({
      defaults: { ease: 'none' },
      paused: isMobile
    });

    const slideRestTimes = [0];
    const transMidTimes = [0];

    masterTL.to({}, { duration: 0.3 });

    for (let i = 1; i < slides.length; i++) {
      const startTime = masterTL.duration();
      transMidTimes[i] = startTime + 0.5;

      masterTL
        .fromTo(
          outerWrappers[i],
          { yPercent: 100 },
          { yPercent: 0, duration: 1, ease: 'power2.inOut', immediateRender: false },
          startTime
        )
        .fromTo(
          innerWrappers[i],
          { yPercent: -100 },
          { yPercent: 0, duration: 1, ease: 'power2.inOut', immediateRender: false },
          startTime
        )
        .fromTo(
          bgs[i],
          { yPercent: 15, scale: 1.14 },
          { yPercent: 0, scale: 1, duration: 1, ease: 'power2.out', immediateRender: false },
          startTime
        )
        .fromTo(
          bgs[i - 1],
          { yPercent: 0, scale: 1 },
          { yPercent: -15, scale: 1.06, duration: 1, ease: 'power2.inOut', immediateRender: false },
          startTime
        )
        .fromTo(
          cards[i - 1],
          { y: 0, opacity: 1 },
          { y: -32, opacity: 0, duration: 0.45, ease: 'power2.in', immediateRender: false },
          startTime
        )
        .fromTo(
          cards[i],
          { y: 36, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.55, ease: 'power2.out', immediateRender: false },
          startTime + 0.42
        );

      const holdDuration = i === slides.length - 1 ? 0.45 : 0.35;
      masterTL.to({}, { duration: holdDuration }, startTime + 1);
      slideRestTimes[i] = startTime + 1 + holdDuration * 0.5;
    }

    function applyActiveFromTime(currentTime) {
      let activeIdx = 0;
      for (let i = 1; i < slides.length; i++) {
        if (currentTime >= transMidTimes[i]) {
          activeIdx = i;
        } else {
          break;
        }
      }
      if (activeIdx !== currentActiveIndex) {
        currentActiveIndex = activeIdx;
        dots.forEach((dot, idx) => {
          dot.classList.toggle('is-active', idx === activeIdx);
        });
        const formattedCounter = String(activeIdx + 1).padStart(2, '0');
        currentCounters.forEach((counter) => {
          counter.textContent = formattedCounter;
        });
      }
    }

    const getTotalScroll = () => (slides.length - 1) * Math.max(600, Math.round(window.innerHeight * 0.72));

    let swipeST = null;
    if (!isMobile) {
      swipeST = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: () => '+=' + getTotalScroll(),
        pin: true,
        pinSpacing: true,
        anticipatePin: 0,
        refreshPriority: 10,
        animation: masterTL,
        scrub: 0.65,
        invalidateOnRefresh: false,
        onToggle: (self) => {
          if (mainNav) {
            mainNav.classList.toggle('is-hidden', self.isActive);
          }
        },
        onUpdate: (self) => {
          if (mainNav && self.isActive) {
            mainNav.classList.add('is-hidden');
          }
          applyActiveFromTime(self.progress * masterTL.duration());
        }
      });
    }

    let mobileTargetIndex = 0;
    let mobileNavTween = null;
    function goToSlideMobile(targetIdx) {
      targetIdx = Math.max(0, Math.min(slides.length - 1, targetIdx));
      if (targetIdx === mobileTargetIndex) return;
      mobileTargetIndex = targetIdx;
      if (mobileNavTween) mobileNavTween.kill();
      mobileNavTween = gsap.to(masterTL, {
        time: slideRestTimes[targetIdx],
        duration: 0.85,
        ease: 'power2.inOut',
        overwrite: true,
        onUpdate: () => applyActiveFromTime(masterTL.time()),
        onComplete: () => {
          applyActiveFromTime(masterTL.time());
          mobileNavTween = null;
        }
      });
    }

    function scrollToSlide(targetIdx) {
      if (isMobile) {
        goToSlideMobile(targetIdx);
        return;
      }
      targetIdx = Math.max(0, Math.min(slides.length - 1, targetIdx));
      const totalDur = masterTL.duration();
      const targetProgress = totalDur > 0 ? slideRestTimes[targetIdx] / totalDur : 0;
      const targetY = swipeST.start + targetProgress * (swipeST.end - swipeST.start);

      if (window.__lenis) {
        window.__lenis.scrollTo(targetY, {
          duration: 0.9,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        });
      } else {
        window.scrollTo({ top: targetY, behavior: 'smooth' });
      }
    }

    const getBaseIndex = () => (isMobile ? mobileTargetIndex : currentActiveIndex);

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        scrollToSlide(getBaseIndex() + 1);
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        scrollToSlide(getBaseIndex() - 1);
      });
    }

    dots.forEach((dot, i) => {
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        scrollToSlide(i);
      });
    });

    if (typeof Observer !== 'undefined' || (typeof ScrollTrigger !== 'undefined' && ScrollTrigger.observe)) {
      const obs = typeof Observer !== 'undefined' ? Observer : ScrollTrigger;
      let lastSwipeAt = 0;
      const swipeGuard = (fn) => () => {
        const now = Date.now();
        if (now - lastSwipeAt < 450) return;
        lastSwipeAt = now;
        fn();
      };
      obs.create({
        target: section,
        ignore: '.swipe-slider-nav-wrap, .swipe-bottom-controls, .swipe-slide__title-link',
        type: isMobile ? 'touch,pointer' : 'pointer',
        tolerance: isMobile ? 40 : 45,
        preventDefault: false,
        onLeft: swipeGuard(() => scrollToSlide(getBaseIndex() + 1)),
        onRight: swipeGuard(() => scrollToSlide(getBaseIndex() - 1))
      });
    }

    window.addEventListener('keydown', (e) => {
      const rect = section.getBoundingClientRect();
      const isInViewport = rect.top <= 10 && rect.bottom >= window.innerHeight - 10;
      if (!isInViewport) return;

      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        scrollToSlide(getBaseIndex() + 1);
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        scrollToSlide(getBaseIndex() - 1);
      }
    });

    function refreshSwipeSlider() {
      if (isMobile) return;
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    }

    window.addEventListener('load', refreshSwipeSlider);
    window.addEventListener('resize', refreshSwipeSlider);
    setTimeout(refreshSwipeSlider, 450);
  })();

  /* ==========================================================================
     17. BUTTON HOVER RAINDOW (ORANGE SHADES CHAR STAGGER)
     ========================================================================== */
  document.querySelectorAll('.Button-hover-raindow').forEach(a => {
    const text = a.textContent.trim();
    if (!text) return;
    a.setAttribute('aria-label', text);
    a.textContent = '';

    [...text].forEach((ch, idx) => {
      const span = document.createElement('span');
      span.className = ch === ' ' ? 'nav-char nav-char--space' : 'nav-char';
      span.style.setProperty('--char-i', idx);
      span.setAttribute('aria-hidden', 'true');
      span.textContent = ch === ' ' ? '\u00A0' : ch;
      a.appendChild(span);
    });
  });

  /* ==========================================================================
     18. SHOUCASE HOME CURTAIN REVEAL (70d85785-c6e2-55e9-ba7f-315f53775819)
     ========================================================================== */
  const shoucaseHome = document.querySelector('.shoucase-home');
  if (shoucaseHome && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && !prefersReducedMotion) {
    const sectionCover = shoucaseHome.querySelector('.section-cover');
    if (sectionCover) {
      gsap.set(sectionCover, { display: 'flex', yPercent: 0 });
      gsap.to(sectionCover, {
        yPercent: -100,
        duration: 1.6,
        ease: 'quint.inOut',
        onComplete: () => gsap.set(sectionCover, { display: 'none' }),
        scrollTrigger: {
          trigger: shoucaseHome,
          start: 'top 92%',
          once: true
        }
      });
    }
  }

  /* ==========================================================================
     19. SUBPAGES INTERACTIONS (SKILLS ACCORDION, STAGE ANCHORS, COLLECTIONS)
     ========================================================================== */
  (function initSubpages() {
    if (!document.body.classList.contains('is-subpage')) return;

    // 19.1. Skills Accordion (.skills-item > .tab-top)
    const skillsItems = Array.from(document.querySelectorAll('.skills-item'));
    skillsItems.forEach((item) => {
      const top = item.querySelector('.tab-top');
      if (!top) return;
      top.setAttribute('role', 'button');
      top.setAttribute('tabindex', '0');
      top.setAttribute('aria-expanded', item.classList.contains('is-open') ? 'true' : 'false');

      const toggleItem = () => {
        const willOpen = !item.classList.contains('is-open');
        item.classList.toggle('is-open', willOpen);
        top.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
        if (typeof ScrollTrigger !== 'undefined') {
          setTimeout(() => ScrollTrigger.refresh(), 820);
        }
      };

      top.addEventListener('click', toggleItem);
      top.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleItem();
        }
      });
    });

    // 19.2. Smooth Scroll for .circle-link-2 & .anchor-link + Active Stage Spy
    const anchorLinks = Array.from(document.querySelectorAll('.anchor-link'));
    const scrollLinks = Array.from(document.querySelectorAll('.circle-link-2, .anchor-link'));

    scrollLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        const rawHref = link.getAttribute('href');
        if (!rawHref || !rawHref.startsWith('#')) return;
        const targetId = rawHref.slice(1).trim();
        const targetEl = document.getElementById(targetId);
        if (!targetEl) return;

        e.preventDefault();
        if (link.classList.contains('anchor-link')) {
          anchorLinks.forEach((a) => a.classList.remove('w--current'));
          link.classList.add('w--current');
        }

        if (window.__lenis) {
          window.__lenis.scrollTo(targetEl, { offset: -100, duration: 1.1 });
        } else {
          const y = targetEl.getBoundingClientRect().top + window.pageYOffset - 100;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      });
    });

    // Active stage spy via IntersectionObserver
    if ('IntersectionObserver' in window && anchorLinks.length) {
      const stageMap = new Map();
      anchorLinks.forEach((link) => {
        const rawHref = link.getAttribute('href') || '';
        const id = rawHref.startsWith('#') ? rawHref.slice(1).trim() : '';
        const el = id ? document.getElementById(id) : null;
        if (el) stageMap.set(el, link);
      });

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const activeLink = stageMap.get(entry.target);
              if (activeLink) {
                anchorLinks.forEach((a) => a.classList.remove('w--current'));
                activeLink.classList.add('w--current');
              }
            }
          });
        },
        { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
      );

      stageMap.forEach((_, el) => observer.observe(el));
    }

    // 19.3. Bora Beach Collections Sticky Cards Subtle Stack Effect
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && !prefersReducedMotion) {
      const collectionCards = Array.from(document.querySelectorAll('.collection_card'));
      collectionCards.forEach((card, idx) => {
        if (idx >= collectionCards.length - 1) return;
        const nextCard = collectionCards[idx + 1];
        const rot = idx % 2 === 0 ? 1.5 : -1.5;
        gsap.to(card, {
          scale: 0.95,
          rotation: rot,
          ease: 'none',
          scrollTrigger: {
            trigger: nextCard,
            start: 'top bottom',
            end: 'top 15%',
            scrub: true
          }
        });
      });
    }
  })();
});
