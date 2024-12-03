import { Package } from "./types";

export class CourierChargeCalculator {
  /** Weight ranges in grams and their corresponding charges
   * ┌────────────────────────┐
   * │     Courier Charges    │
   * ├────────────┬───────────┤
   * │ Weight(g)  │ Charge($) │
   * ├────────────┼───────────┤
   * │ 0-200g     │ 5         │
   * │ 200-500g   │ 10        │
   * │ 500-1000g  │ 15        │
   * │ 1000-5000g │ 20        │
   * └────────────┴───────────┘
   */
  private static WEIGHT_TIERS = [
    { maxWeight: 200, charge: 5 },
    { maxWeight: 500, charge: 10 },
    { maxWeight: 1000, charge: 15 },
    { maxWeight: 5000, charge: 20 },
  ];

  /**
   * Calculate shipping charge based on package weight
   * @param package_ package whose total courier charge is to be determined
   * @returns Courier charge
   */
  static calculateCourierCharge(package_: Package): number {
    for (const tier of this.WEIGHT_TIERS) {
      if (package_.totalWeight <= tier.maxWeight) {
        return tier.charge;
      }
    }
    throw new Error(
      `Package with weight ${package_.totalWeight} exceeds the package limit of ${this.WEIGHT_TIERS[this.WEIGHT_TIERS.length - 1]}g`,
    );
  }
}
