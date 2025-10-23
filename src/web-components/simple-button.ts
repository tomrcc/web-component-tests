import templateHTML from "./simple-button.html?raw";

export default class SimpleButton extends HTMLElement {
  constructor() {
    super();
    console.debug("Constructing simple-button.");
    this.attachShadow({ mode: "open" });
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