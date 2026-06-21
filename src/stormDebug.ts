export interface StormDebugState {
  driftMultiplier: number;
  intervalMs: number;
  stormIntensity: number;
  lightningProbability: number;
}

export type StormDebugParam = keyof StormDebugState;

export class StormDebugPanel {
  private elements: {
    panel: HTMLElement;
    toggle: HTMLElement;
    driftSlider: HTMLInputElement;
    driftValue: HTMLElement;
    intervalSlider: HTMLInputElement;
    intervalValue: HTMLElement;
    rainSlider: HTMLInputElement;
    rainValue: HTMLElement;
    lightningSlider: HTMLInputElement;
    lightningValue: HTMLElement;
    resetBtn: HTMLElement;
  };

  private state: StormDebugState;
  private defaults: StormDebugState;
  private onChange: (param: StormDebugParam, value: number) => void;
  private isCollapsed: boolean = false;

  constructor(
    defaults: StormDebugState,
    onChange: (param: StormDebugParam, value: number) => void
  ) {
    this.defaults = { ...defaults };
    this.state = { ...defaults };
    this.onChange = onChange;
    this.elements = this.getElements();
    this.attachEvents();
    this.updateUI();
  }

  private getElements() {
    const get = (id: string): HTMLElement => {
      const el = document.getElementById(id);
      if (!el) throw new Error(`Element not found: ${id}`);
      return el;
    };

    return {
      panel: get('stormDebugPanel'),
      toggle: get('debugToggle'),
      driftSlider: get('driftSlider') as HTMLInputElement,
      driftValue: get('driftValue'),
      intervalSlider: get('intervalSlider') as HTMLInputElement,
      intervalValue: get('intervalValue'),
      rainSlider: get('rainSlider') as HTMLInputElement,
      rainValue: get('rainValue'),
      lightningSlider: get('lightningSlider') as HTMLInputElement,
      lightningValue: get('lightningValue'),
      resetBtn: get('debugReset')
    };
  }

  private attachEvents(): void {
    this.elements.toggle.addEventListener('click', () => {
      this.toggleCollapse();
    });

    this.elements.driftSlider.addEventListener('input', (e) => {
      const value = parseFloat((e.target as HTMLInputElement).value);
      this.state.driftMultiplier = value;
      this.elements.driftValue.textContent = `${value.toFixed(1)}x`;
      this.onChange('driftMultiplier', value);
    });

    this.elements.intervalSlider.addEventListener('input', (e) => {
      const value = parseFloat((e.target as HTMLInputElement).value);
      this.state.intervalMs = value;
      this.elements.intervalValue.textContent = `${Math.round(value)}ms`;
      this.onChange('intervalMs', value);
    });

    this.elements.rainSlider.addEventListener('input', (e) => {
      const value = parseFloat((e.target as HTMLInputElement).value);
      this.state.stormIntensity = value;
      this.elements.rainValue.textContent = value.toFixed(2);
      this.onChange('stormIntensity', value);
    });

    this.elements.lightningSlider.addEventListener('input', (e) => {
      const value = parseFloat((e.target as HTMLInputElement).value);
      this.state.lightningProbability = value;
      this.elements.lightningValue.textContent = value.toFixed(3);
      this.onChange('lightningProbability', value);
    });

    this.elements.resetBtn.addEventListener('click', () => {
      this.resetToDefaults();
    });
  }

  private updateUI(): void {
    this.elements.driftSlider.value = this.state.driftMultiplier.toString();
    this.elements.driftValue.textContent = `${this.state.driftMultiplier.toFixed(1)}x`;

    this.elements.intervalSlider.value = this.state.intervalMs.toString();
    this.elements.intervalValue.textContent = `${Math.round(this.state.intervalMs)}ms`;

    this.elements.rainSlider.value = this.state.stormIntensity.toString();
    this.elements.rainValue.textContent = this.state.stormIntensity.toFixed(2);

    this.elements.lightningSlider.value = this.state.lightningProbability.toString();
    this.elements.lightningValue.textContent = this.state.lightningProbability.toFixed(3);
  }

  private toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
    this.elements.panel.classList.toggle('collapsed', this.isCollapsed);
    this.elements.toggle.textContent = this.isCollapsed ? '+' : '−';
  }

  private resetToDefaults(): void {
    this.state = { ...this.defaults };
    this.updateUI();

    this.onChange('driftMultiplier', this.state.driftMultiplier);
    this.onChange('intervalMs', this.state.intervalMs);
    this.onChange('stormIntensity', this.state.stormIntensity);
    this.onChange('lightningProbability', this.state.lightningProbability);
  }

  getState(): StormDebugState {
    return { ...this.state };
  }

  setState(state: Partial<StormDebugState>): void {
    this.state = { ...this.state, ...state };
    this.updateUI();
  }
}
