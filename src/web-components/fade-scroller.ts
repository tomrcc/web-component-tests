import templateHTML from "./fade-scroller.html?raw";

export default class FadeScroller extends HTMLElement {
  #startObserver!: IntersectionObserver;
  #endObserver!: IntersectionObserver;
  #fadeContainer!: HTMLElement;
  #contentStart!: HTMLElement;
  #contentEnd!: HTMLElement;
  #startFader!: HTMLElement;
  #endFader!: HTMLElement;

  constructor() {
    super();
    console.debug("Constructing fade-scroller.");
    this.attachShadow({ mode: "open" });
    this.setFadeOpacity = this.setFadeOpacity.bind(this);
    this.handleFadeStart = this.handleFadeStart.bind(this);
    this.handleFadeEnd = this.handleFadeEnd.bind(this);
  }

  connectedCallback() {
    const { shadowRoot } = this;
    
    // Create template element from imported HTML
    const template = document.createElement("template");
    template.innerHTML = templateHTML;
    
    const node = document.importNode(template.content, true).cloneNode(true);
    shadowRoot?.appendChild(node);

    this.#fadeContainer = this.shadowRoot?.querySelector(
      ".fade__container",
    ) as HTMLElement;
    this.#contentStart = this.shadowRoot?.querySelector(
      ".fade__content__start",
    ) as HTMLElement;
    this.#contentEnd = this.shadowRoot?.querySelector(
      ".fade__content__end",
    ) as HTMLElement;
    this.#startFader = this.shadowRoot?.querySelector(
      ".fader.start",
    ) as HTMLElement;
    this.#endFader = this.shadowRoot?.querySelector(
      ".fader.end",
    ) as HTMLElement;

    const observerOptions = {
      root: this.#fadeContainer,
      rootMargin: "20px",
      threshold: [0.2, 0.4, 0.6, 0.8, 1],
    };

    this.#startObserver = new IntersectionObserver(
      this.handleFadeStart,
      observerOptions,
    );
    this.#endObserver = new IntersectionObserver(
      this.handleFadeEnd,
      observerOptions,
    );

    this.#startObserver.observe(this.#contentStart);
    this.#endObserver.observe(this.#contentEnd);
  }

  disconnectedCallback() {
    console.debug("Component disconnected; removing observers.");
    this.#startObserver.disconnect();
    this.#endObserver.disconnect();
  }

  handleFadeStart(entries: IntersectionObserverEntry[]) {
    this.setFadeOpacity(this.#startFader, entries[0]);
  }

  handleFadeEnd(entries: IntersectionObserverEntry[]) {
    this.setFadeOpacity(this.#endFader, entries[0]);
  }

  setFadeOpacity(fadeElement: HTMLElement, entry: IntersectionObserverEntry) {
    const fadeOpacity = Math.max(1 - entry.intersectionRatio, 0);

    (fadeElement as HTMLElement).style.opacity = fadeOpacity.toString();
  }
}

console.debug("Defining fade-scroller element.");
if (!customElements.get("fade-scroller")) {
  customElements.define("fade-scroller", FadeScroller);
}
