import { Platform } from 'react-native';

class OverlayManager {
  private static instance: OverlayManager;
  private isOverlayVisible: boolean = false;

  private constructor() {}

  static getInstance(): OverlayManager {
    if (!OverlayManager.instance) {
      OverlayManager.instance = new OverlayManager();
    }
    return OverlayManager.instance;
  }

  async requestOverlayPermission(): Promise<boolean> {
    console.log('Requesting overlay permission...');
    // No permissions needed for our new approach
    return true;
  }

  setIsVisible(visible: boolean) {
    this.isOverlayVisible = visible;
    console.log('Overlay visibility set to:', this.isOverlayVisible);
  }

  showOverlay() {
    this.isOverlayVisible = true;
    console.log('Overlay visibility set to:', this.isOverlayVisible);
  }

  hideOverlay() {
    this.isOverlayVisible = false;
    console.log('Overlay visibility set to:', this.isOverlayVisible);
  }

  isVisible(): boolean {
    return this.isOverlayVisible;
  }
}

export default OverlayManager.getInstance();
