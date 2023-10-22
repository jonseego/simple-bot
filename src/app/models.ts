export interface BotData {
  selectedIndeces: number[];
  predictedIndeces: number[];
}

export enum BotActions {
  ClickButton = 'Click a button',
  InputText = 'Input Text'
}