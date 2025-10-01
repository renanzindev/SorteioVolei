declare module 'gender-detection' {
  export function detect(name: string): 'male' | 'female' | 'unisex' | 'unknown';
}