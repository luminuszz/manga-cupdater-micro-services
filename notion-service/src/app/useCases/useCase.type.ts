export interface UseCaseService<Input = Record<string, any>, Output = void> {
  execute: (params: Input) => Promise<Output>;
}
