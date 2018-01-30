export class Device {
  constructor(
    public name: string,
    public quantity: number,
    public power: number,
    public hours: number,
    public daysUsed: number,
    public category: string,
    public compressor: number
    ) {
  }
}
