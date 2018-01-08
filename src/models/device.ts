export class Device {
  constructor(
    public name: string,
    public quantity: number,
    public power: number,
    public hours: number,
    public totalHours: number,
    public daysUsed: number
    ) {
  }
}
