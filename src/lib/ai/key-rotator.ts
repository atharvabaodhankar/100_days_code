/**
 * Round-Robin API Key Rotator with Failure Tracking
 */

export class KeyRotator {
  private keys: string[];
  private currentIndex: number = 0;
  private name: string;

  constructor(name: string, keys: string[]) {
    this.name = name;
    this.keys = keys.filter(Boolean);
    if (this.keys.length === 0) {
      console.warn(`[KeyRotator] No keys provided for ${name}`);
    }
  }

  /**
   * Returns the count of configured keys.
   */
  get keyCount(): number {
    return this.keys.length;
  }

  /**
   * Retrieves the next key in round-robin order.
   */
  getNextKey(): string {
    if (this.keys.length === 0) {
      throw new Error(`[KeyRotator] No API keys configured for provider: ${this.name}`);
    }

    const key = this.keys[this.currentIndex];
    this.currentIndex = (this.currentIndex + 1) % this.keys.length;
    return key;
  }

  /**
   * Executes an asynchronous operation with automatic key rotation on failure.
   */
  async executeWithRotation<T>(
    operation: (key: string, attempt: number) => Promise<T>,
    maxRetries: number = this.keys.length
  ): Promise<T> {
    if (this.keys.length === 0) {
      throw new Error(`[KeyRotator] No API keys configured for ${this.name}`);
    }

    let lastError: unknown;
    const attempts = Math.min(maxRetries, this.keys.length);

    for (let attempt = 0; attempt < attempts; attempt++) {
      const key = this.getNextKey();
      try {
        return await operation(key, attempt + 1);
      } catch (err) {
        lastError = err;
        console.warn(
          `[${this.name}] Request failed with key index ${(this.currentIndex - 1 + this.keys.length) % this.keys.length} (attempt ${attempt + 1}/${attempts}). Rotating to next key...`,
          err instanceof Error ? err.message : err
        );
      }
    }

    throw lastError || new Error(`[${this.name}] All ${attempts} API keys failed.`);
  }
}
