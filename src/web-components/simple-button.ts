import templateHTML from "./simple-button.html?raw";

export default class SimpleButton extends HTMLElement {
  constructor() {
    super();
    console.debug("Constructing simple-button.");
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    const { shadowRoot } = this;
    
    // Create template element from imported HTML
    const template = document.createElement("template");
    template.innerHTML = templateHTML;
    
    const node = document.importNode(template.content, true).cloneNode(true);
    shadowRoot?.appendChild(node);

    // Add click handler
    const button = shadowRoot?.querySelector("button");
    if (button) {
      button.addEventListener("click", () => {
        console.log("Simple button clicked!");
        button.textContent = "Clicked!";
        setTimeout(() => {
          button.textContent = "Click me!";
        }, 1000);
      });
    }
  }
}

console.debug("Defining simple-button element.");
if (!customElements.get("simple-button")) {
  customElements.define("simple-button", SimpleButton);
}