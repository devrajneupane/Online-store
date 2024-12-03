import { CourierChargeCalculator } from "./courierCharge";
import { Item, Package } from "./types";

export class ItemDistributor {
  /*
   * Maximum allowed cost per pakckage
   */
  private static COST_LIMIT = 250;

  /**
   * Distribute items into packages based on cost and weight constraints
   * @param items - List of items to distribute
   * @returns A list of pakcages with evenly distributed weights
   */
  static distributeItems(items: Item[]): Package[] {
    const sortedItems = items.sort((a, b) => b.price - a.price);
    const packages: Package[] = [];

    // Pack items into package based on cost constraint
    for (const item of sortedItems) {
      if (item.price > this.COST_LIMIT) {
        throw new Error(
          `Item with cost ${item.price} exceeds the package limit of ${this.COST_LIMIT}`,
        );
      }

      // Try to place the item in an existing package
      let placed = false;
      for (const package_ of packages) {
        if (package_.totalPrice + item.price <= this.COST_LIMIT) {
          package_.items.push(item);
          package_.totalPrice += item.price;
          package_.totalWeight += item.weight;
          placed = true;
          break;
        }
      }

      // If item can't be placed on existing package, create a new package
      if (!placed) {
        packages.push({
          items: [item],
          totalPrice: item.price,
          totalWeight: item.weight,
          courierPrice: 0,
        });
      }
    }

    // Balance weights across packages
    this.balanceWeights(packages);

    // Calculate courirer price
    for (const package_ of packages) {
      CourierChargeCalculator.calculateCourierCharge(package_);
    }

    return packages;
  }

  /**
   * Balances weights across packages while maintaining cost constraints.
   * @param packages - List of packages to balance.
   */
  private static balanceWeights(packages: Package[]): void {
    let balanced = true;

    while (balanced) {
      balanced = false;

      // Find the heaviest and lightest packages
      const heaviestPackage = packages.reduce((itemA, itemB) =>
        itemA.totalWeight > itemB.totalWeight ? itemA : itemB,
      );
      const lightestPackage = packages.reduce((itemA, itemB) =>
        itemA.totalWeight < itemB.totalWeight ? itemA : itemB,
      );

      // Attempt to move items from heaviest to lightest package
      for (const item of heaviestPackage.items) {
        if (
          lightestPackage.totalPrice + item.price <= this.COST_LIMIT &&
          heaviestPackage.totalWeight - item.weight >
            lightestPackage.totalWeight + item.weight
        ) {
          // Move item between packages
          heaviestPackage.items = heaviestPackage.items.filter(
            (item_) => item_ !== item,
          );
          heaviestPackage.totalPrice -= item.price;
          heaviestPackage.totalWeight -= item.weight;

          lightestPackage.items.push(item);
          lightestPackage.totalPrice += item.price;
          lightestPackage.totalWeight += item.weight;

          balanced = true;
          break;
        }
      }
    }
  }
}
