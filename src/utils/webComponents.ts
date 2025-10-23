/**
 * Generic Web Component Loader
 * Automatically loads and registers all web components from the web-components directory
 */

interface WebComponentModule {
  default: CustomElementConstructor;
}

/**
 * Initialize all web components
 * This function automatically discovers and registers all web components
 */
export async function initializeWebComponents(): Promise<void> {
  try {
    // Load all TypeScript web component files
    const webComponents = import.meta.glob("/src/web-components/**/*.ts", {
      eager: true,
    }) as Record<string, WebComponentModule>;

    // Register each component
    Object.entries(webComponents).forEach(([path, module]) => {
      const componentName = extractComponentName(path);
      if (componentName && module.default) {
        // Check if component is already registered
        if (!customElements.get(componentName)) {
          customElements.define(componentName, module.default);
          console.debug(`Registered web component: ${componentName}`);
        }
      }
    });

    console.log("Available web components:", Object.keys(webComponents));
    
    // Store components on window for debugging
    (window as any).webComponents = webComponents;
    
  } catch (error) {
    console.error("Failed to initialize web components:", error);
  }
}

/**
 * Extract component name from file path
 * e.g., "/src/web-components/fade-scroller.ts" -> "fade-scroller"
 */
function extractComponentName(filePath: string): string | null {
  const match = filePath.match(/\/src\/web-components\/([^\/]+)\.ts$/);
  return match ? match[1] : null;
}
