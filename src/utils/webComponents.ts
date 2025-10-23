/**
 * Generic Web Component Loader
 * Automatically loads and registers all web components from the web-components directory
 */

/**
 * Initialize all web components
 * This function automatically discovers and imports all web components.
 * The components self-register when imported.
 */
export async function initializeWebComponents(): Promise<void> {
  try {
    // Load all TypeScript web component files
    // Using eager: true ensures they're imported immediately
    const webComponents = import.meta.glob("/src/web-components/**/*.ts", {
      eager: true,
    });

    console.log("Web components loaded:", Object.keys(webComponents).map(path => {
      const match = path.match(/\/src\/web-components\/([^\/]+)\.ts$/);
      return match ? match[1] : path;
    }));
    
    // Store components on window for debugging
    (window as any).webComponents = webComponents;
    
  } catch (error) {
    console.error("Failed to initialize web components:", error);
  }
}