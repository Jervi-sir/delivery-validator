import { validateEcotrack } from "./ecotrack.validator";
import { validateYalidine } from "./yalidine.validator";
import { validateZrExpress } from "./zr-express.validator";
import { validateNoest } from "./noest.validator";
import { validateEcomdz } from "./ecom-dz.validator";

export { validateEcotrack, getEcotrackBaseUrl } from "./ecotrack.validator";
export { validateYalidine, getYalidineBaseUrl } from "./yalidine.validator";
export { validateZrExpress } from "./zr-express.validator";
export { validateNoest } from "./noest.validator";
export { validateEcomdz } from "./ecom-dz.validator";

export async function validateDeliveryAccount(
  company: string,
  field1: string,
  field2: string
): Promise<boolean> {
  try {
    switch (company.toLowerCase()) {
      case 'dhd':
        return await validateEcotrack('dhd', field2 || field1);

      case 'omexpress':
      case 'om-express':
      case 'om':
        return await validateEcotrack('omexpress', field2 || field1);

      case 'yalidine':
        return await validateYalidine(field1, field2, 'yalidine');

      case 'guepex':
        return await validateYalidine(field1, field2, 'guepex');

      case 'zr-express':
      case 'zr':
        return await validateZrExpress(field1, field2);

      case 'noest':
      case 'nordest':
        return await validateNoest(field1, field2);

      case 'ecom-dz':
      case 'ecomdz':
        return await validateEcomdz(field1, field2);

      default:
        throw new Error(`Unsupported delivery carrier: ${company}`);
    }
  } catch (error) {
    console.error(`Validation failed for carrier ${company}:`, error);
    return false;
  }
}
