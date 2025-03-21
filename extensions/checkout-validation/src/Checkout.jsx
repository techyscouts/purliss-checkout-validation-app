import {
  reactExtension,
  useDiscountCodes,
  useBuyerJourneyIntercept,
  useCartLines,
} from "@shopify/ui-extensions-react/checkout";

// 1. Choose an extension target
export default reactExtension("purchase.checkout.block.render", () => (
  <Extension />
));

function Extension() {
  const discounts = useDiscountCodes();
  const cartLines = useCartLines();

  // Check if the product with ID 2341234223 exists in the cart
  const productInCart = cartLines.some(
    (line) => line.merchandise.product.id == "gid://shopify/Product/8406217687218"
  );


  const isDiscount = discounts.find(
    (discount) => discount.code === "GLOWINGSKIN"
  );
  let x = JSON.stringify(typeof (cartLines))

  useBuyerJourneyIntercept(({ canBlockProgress, clearValidationErrors }) => {
    if (productInCart) {
      if (discounts.length > 0) {

        return canBlockProgress && !isDiscount
          ? {
            behavior: "block",
            reason: "Invalid DiscountCode",
            errors: [
              {
                message: "Enter a valid discount code",
              },
            ],
          }
          : {
            behavior: "allow",
            perform: () => {
              clearValidationErrors();
            },
          };
      } else {
        return {
          behavior: "block",
          reason: "Null DiscountCode",
          errors: [
            {
              message: "Require a discount code",
            },
          ],
        };
      }
    } else {
      // Allow progress if the specific product is not in the cart
      return  {
            behavior: "allow",
            perform: () => {
              clearValidationErrors();
            },
          };
    }

  });

  return null;
}
