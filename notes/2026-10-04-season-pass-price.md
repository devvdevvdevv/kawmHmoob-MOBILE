# Season pass price: $9.99 → $7.99 (2026-10-04)

Author: *"in paywall change the 9.99 price to 7.99."*

`PASS.premiumPrice` in `src/data/battlepass.js`. It now matches Pro's monthly
price rather than sitting above it as a second, competing number.

## ⚠️ IT WAS THE ONLY LITERAL PRICE IN THE REPO, AND IT IS NOT THE PAYWALL

`app/paywall.jsx` hardcodes no price at all — every figure there is
`priceString`, read from the store through RevenueCat, which is why grepping for
"7.99" finds nothing in that file. Its own comment already named 7.99/month as
the intended launch price.

**So if a device shows the wrong price on the paywall, the fix is in Play Console
/ RevenueCat, not in this repo.** That sentence is now in the code beside the
constant, because the next person to go looking will start by grepping.

## What this string actually is

Display only, on the Season Pass page — which is itself commented out as of
2026-09-23 pending a server side (see `app/pass.jsx`'s header). Nothing charges
from here.
