declare module 'bcryptjs' {
  export function compare(a: string, b: string): Promise<boolean>
  export function hash(a: string, saltOrRounds: number | string): Promise<string>
}
