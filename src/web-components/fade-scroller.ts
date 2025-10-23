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
    
    if (!shadowRoot) {
      console.error("Shadow root not available");
      return;
    }
    
    // Create a temporary container to parse the imported HTML
    const tempContainer = document.createElement("div");
    tempContainer.innerHTML = templateHTML;
    
    // Find the template element within the imported HTML
    const template = tempContainer.querySelector("template");
    
    if (!template) {
      console.error("Template element not found in imported HTML");
      return;
    }
    
    // Clone and append the template content
    const node = document.importNode(template.content, true);
    shadowRoot.appendChild(node);

    // Query elements after appending to shadow DOM
    this.#fadeContainer = shadowRoot.querySelector(
      ".fade__container",
    ) as HTMLElement;
    this.#contentStart = shadowRoot.querySelector(
      ".fade__content__start",
    ) as HTMLElement;
    this.#contentEnd = shadowRoot.querySelector(
      ".fade__content__end",
    ) as HTMLElement;
    this.#startFader = shadowRoot.querySelector(
      ".fader.start",
    ) as HTMLElement;
    this.#endFader = shadowRoot.querySelector(
      ".fader.end",
    ) as HTMLElement;

    // Verify all elements were found
    if (!this.#fadeContainer || !this.#contentStart || !this.#contentEnd || !this.#startFader || !this.#endFader) {
      console.error("Failed to find required elements in shadow DOM", {
        fadeContainer: this.#fadeContainer,
        contentStart: this.#contentStart,
        contentEnd: this.#contentEnd,
        startFader: this.#startFader,
        endFader: this.#endFader
      });
      return;
    }

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
