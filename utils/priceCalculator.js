/**
 * Calculate estimated mobile price based on conditions
 * @param {Number} basePrice - mobile base price from DB
 * @param {Object} conditions - phone condition object
 * @returns {Number} final estimated price
 */

export const calculatePrice = (basePrice, conditions) => {
  if (!basePrice || !conditions) return 0;

  // deduction rules (percentage)
  const rules = {
    screen: {
      perfect: 0,
      scratched: 10,
      cracked: 25
    },
    body: {
      perfect: 0,
      scratched: 10,
      damaged: 20
    },
    battery: {
      good: 0,
      average: 10,
      poor: 20
    }
  };

  let totalDeductionPercent = 0;

  if (conditions.screen && rules.screen[conditions.screen] !== undefined) {
    totalDeductionPercent += rules.screen[conditions.screen];
  }

  if (conditions.body && rules.body[conditions.body] !== undefined) {
    totalDeductionPercent += rules.body[conditions.body];
  }

  if (conditions.battery && rules.battery[conditions.battery] !== undefined) {
    totalDeductionPercent += rules.battery[conditions.battery];
  }

  // max limit (optional safety)
  if (totalDeductionPercent > 80) {
    totalDeductionPercent = 80;
  }

  const finalPrice =
    basePrice - (basePrice * totalDeductionPercent) / 100;

  return Math.round(finalPrice < 0 ? 0 : finalPrice);
};
