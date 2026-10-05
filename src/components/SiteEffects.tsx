"use client";

import { useEffect } from "react";

export default function SiteEffects() {
  useEffect(() => {
    /* =========================================
       PAGE LOADER
    ========================================= */

    const loader = document.querySelector(".page-loader");

    const loaderTimer = window.setTimeout(() => {
      loader?.classList.add("hide");
    }, 700);

    /* =========================================
       NAVBAR SCROLL
    ========================================= */

    const navbar = document.querySelector(".navbar");

    const handleScroll = () => {
      if (!navbar) return;

      if (window.scrollY > 40) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    /* =========================================
       SCROLL REVEAL
    ========================================= */

    const revealElements = document.querySelectorAll(
      [
        ".about-title",
        ".about-content",
        ".section-header",
        ".gallery-item",
        ".statement-content",
        ".contact-grid",
        ".service-card",
        ".service-item",
        ".process-item",
        ".contact-card",
        ".contact-item",
      ].join(", ")
    );

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const element = entry.target as HTMLElement;

          element.classList.add("reveal");

          const parent = element.parentElement;

          if (parent) {
            const index = Array.from(parent.children).indexOf(
              element
            );

            window.setTimeout(() => {
              element.style.transitionDelay = `${index * 80}ms`;
              element.classList.add("active");
            }, 80);
          } else {
            element.classList.add("active");
          }

          observer.unobserve(element);
        });
      },
      {
        threshold: 0.12,
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });

    /* =========================================
       SMOOTH ANCHOR
    ========================================= */

    const anchorLinks = document.querySelectorAll(
      'a[href^="#"]'
    );

    const anchorHandlers = new Map<
      HTMLAnchorElement,
      (event: Event) => void
    >();

    anchorLinks.forEach((linkElement) => {
      const link = linkElement as HTMLAnchorElement;

      const handler = (event: Event) => {
        const targetId = link.getAttribute("href");

        if (!targetId || targetId === "#") return;

        const target = document.querySelector(targetId);

        if (!target) return;

        event.preventDefault();

        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      };

      anchorHandlers.set(link, handler);
      link.addEventListener("click", handler);
    });

    /* =========================================
       POINTER EFFECTS
    ========================================= */

    const finePointer = window.matchMedia(
      "(pointer: fine)"
    ).matches;

    let cursorGlow: HTMLDivElement | null = null;
    let cursorRing: HTMLDivElement | null = null;

    let animationFrame = 0;

    if (finePointer) {
      /* -----------------------------------------
         CURSOR GLOW
      ----------------------------------------- */

      cursorGlow = document.createElement("div");

      cursorGlow.className = "cursor-glow";

      document.body.appendChild(cursorGlow);

      const handleMouseMove = (event: MouseEvent) => {
        if (!cursorGlow) return;

        cursorGlow.style.left = `${event.clientX}px`;
        cursorGlow.style.top = `${event.clientY}px`;
      };

      window.addEventListener(
        "mousemove",
        handleMouseMove
      );

      /* -----------------------------------------
         PREMIUM CURSOR RING
      ----------------------------------------- */

      cursorRing = document.createElement("div");

      cursorRing.className = "cursor-ring";

      document.body.appendChild(cursorRing);

      let mouseX = 0;
      let mouseY = 0;

      let ringX = 0;
      let ringY = 0;

      const handleRingMove = (event: MouseEvent) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
      };

      window.addEventListener(
        "mousemove",
        handleRingMove
      );

      const animateCursor = () => {
        ringX += (mouseX - ringX) * 0.12;
        ringY += (mouseY - ringY) * 0.12;

        if (cursorRing) {
          cursorRing.style.transform =
            `translate3d(${ringX}px, ${ringY}px, 0)`;
        }

        animationFrame =
          requestAnimationFrame(animateCursor);
      };

      animateCursor();

      /* -----------------------------------------
         INTERACTIVE CURSOR
      ----------------------------------------- */

      const interactiveElements =
        document.querySelectorAll(
          "a, button, .gallery-item, .service-card, .service-item"
        );

      const interactiveHandlers: Array<{
        element: Element;
        enter: () => void;
        leave: () => void;
      }> = [];

      interactiveElements.forEach((element) => {
        const enter = () => {
          cursorRing?.classList.add(
            "cursor-hover"
          );
        };

        const leave = () => {
          cursorRing?.classList.remove(
            "cursor-hover"
          );
        };

        element.addEventListener(
          "mouseenter",
          enter
        );

        element.addEventListener(
          "mouseleave",
          leave
        );

        interactiveHandlers.push({
          element,
          enter,
          leave,
        });
      });

      /* -----------------------------------------
         HERO TILT
      ----------------------------------------- */

      const heroVisual =
        document.querySelector(
          ".hero-visual"
        ) as HTMLElement | null;

      const heroMoveHandler = (event: MouseEvent) => {
        if (!heroVisual) return;

        const rect =
          heroVisual.getBoundingClientRect();

        const x =
          event.clientX - rect.left;

        const y =
          event.clientY - rect.top;

        const rotateX =
          ((y / rect.height) - 0.5) * -5;

        const rotateY =
          ((x / rect.width) - 0.5) * 5;

        heroVisual.style.transform =
          `perspective(1000px)
           rotateX(${rotateX}deg)
           rotateY(${rotateY}deg)`;
      };

      const heroLeaveHandler = () => {
        if (!heroVisual) return;

        heroVisual.style.transform = "";
      };

      heroVisual?.addEventListener(
        "mousemove",
        heroMoveHandler
      );

      heroVisual?.addEventListener(
        "mouseleave",
        heroLeaveHandler
      );

      /* -----------------------------------------
         MAGNETIC BUTTONS
      ----------------------------------------- */

      const magneticButtons =
        document.querySelectorAll(
          ".primary-button, .nav-button"
        );

      const magneticHandlers: Array<{
        element: Element;
        move: (event: Event) => void;
        leave: () => void;
      }> = [];

      magneticButtons.forEach((buttonElement) => {
        const button =
          buttonElement as HTMLElement;

        const move = (event: Event) => {
          const mouseEvent =
            event as MouseEvent;

          const rect =
            button.getBoundingClientRect();

          const x =
            mouseEvent.clientX -
            rect.left -
            rect.width / 2;

          const y =
            mouseEvent.clientY -
            rect.top -
            rect.height / 2;

          button.style.transform =
            `translate(${x * 0.08}px, ${y * 0.08}px)`;
        };

        const leave = () => {
          button.style.transform = "";
        };

        button.addEventListener(
          "mousemove",
          move
        );

        button.addEventListener(
          "mouseleave",
          leave
        );

        magneticHandlers.push({
          element: button,
          move,
          leave,
        });
      });

      /* -----------------------------------------
         GALLERY IMAGE TILT
      ----------------------------------------- */

      const galleryItems =
        document.querySelectorAll(
          ".gallery-item"
        );

      const galleryHandlers: Array<{
        element: Element;
        move: (event: Event) => void;
        leave: () => void;
      }> = [];

      galleryItems.forEach((itemElement) => {
        const item =
          itemElement as HTMLElement;

        const move = (event: Event) => {
          const mouseEvent =
            event as MouseEvent;

          const rect =
            item.getBoundingClientRect();

          const x =
            mouseEvent.clientX -
            rect.left;

          const y =
            mouseEvent.clientY -
            rect.top;

          const rotateY =
            ((x / rect.width) - 0.5) * 2;

          const rotateX =
            ((y / rect.height) - 0.5) * -2;

          item.style.transform =
            `perspective(700px)
             rotateX(${rotateX}deg)
             rotateY(${rotateY}deg)`;
        };

        const leave = () => {
          item.style.transform = "";
        };

        item.addEventListener(
          "mousemove",
          move
        );

        item.addEventListener(
          "mouseleave",
          leave
        );

        galleryHandlers.push({
          element: item,
          move,
          leave,
        });
      });

      /* -----------------------------------------
         CLEANUP POINTER EVENTS
      ----------------------------------------- */

      const cleanupPointer = () => {
        window.removeEventListener(
          "mousemove",
          handleMouseMove
        );

        window.removeEventListener(
          "mousemove",
          handleRingMove
        );

        heroVisual?.removeEventListener(
          "mousemove",
          heroMoveHandler
        );

        heroVisual?.removeEventListener(
          "mouseleave",
          heroLeaveHandler
        );

        interactiveHandlers.forEach(
          ({ element, enter, leave }) => {
            element.removeEventListener(
              "mouseenter",
              enter
            );

            element.removeEventListener(
              "mouseleave",
              leave
            );
          }
        );

        magneticHandlers.forEach(
          ({ element, move, leave }) => {
            element.removeEventListener(
              "mousemove",
              move
            );

            element.removeEventListener(
              "mouseleave",
              leave
            );
          }
        );

        galleryHandlers.forEach(
          ({ element, move, leave }) => {
            element.removeEventListener(
              "mousemove",
              move
            );

            element.removeEventListener(
              "mouseleave",
              leave
            );
          }
        );
      };

      /* -----------------------------------------
         STORE CLEANUP
      ----------------------------------------- */

      (
        window as Window & {
          __henryCleanupPointer?: () => void;
        }
      ).__henryCleanupPointer = cleanupPointer;
    }

    /* =========================================
       BACK TO TOP
    ========================================= */

    const backToTop =
      document.querySelector(
        ".back-to-top"
      );

    const handleBackToTopScroll = () => {
      if (!backToTop) return;

      if (window.scrollY > 700) {
        backToTop.classList.add("show");
      } else {
        backToTop.classList.remove("show");
      }
    };

    window.addEventListener(
      "scroll",
      handleBackToTopScroll
    );

    handleBackToTopScroll();

    const handleBackToTopClick = () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };

    backToTop?.addEventListener(
      "click",
      handleBackToTopClick
    );

    /* =========================================
       ESC
    ========================================= */

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;

      const mobileMenu =
        document.querySelector(
          ".mobile-menu"
        );

      const menuButton =
        document.querySelector(
          ".mobile-menu-button"
        );

      const bookingModal =
        document.querySelector(
          ".booking-modal"
        );

      mobileMenu?.classList.remove(
        "active"
      );

      menuButton?.classList.remove(
        "active"
      );

      bookingModal?.classList.remove(
        "active"
      );

      document.body.style.overflow = "";
    };

    document.addEventListener(
      "keydown",
      handleEscape
    );

    /* =========================================
       CLEANUP
    ========================================= */

    return () => {
      window.clearTimeout(loaderTimer);

      window.removeEventListener(
        "scroll",
        handleScroll
      );

      window.removeEventListener(
        "scroll",
        handleBackToTopScroll
      );

      backToTop?.removeEventListener(
        "click",
        handleBackToTopClick
      );

      document.removeEventListener(
        "keydown",
        handleEscape
      );

      revealObserver.disconnect();

      anchorHandlers.forEach(
        (handler, link) => {
          link.removeEventListener(
            "click",
            handler
          );
        }
      );

      if (finePointer) {
        const cleanupPointer = (
          window as Window & {
            __henryCleanupPointer?: () => void;
          }
        ).__henryCleanupPointer;

        cleanupPointer?.();

        cancelAnimationFrame(
          animationFrame
        );

        cursorGlow?.remove();
        cursorRing?.remove();

        delete (
          window as Window & {
            __henryCleanupPointer?: () => void;
          }
        ).__henryCleanupPointer;
      }

      document.body.style.overflow = "";
    };
  }, []);

  return null;
}