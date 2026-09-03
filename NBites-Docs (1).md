# **Document 1: Product Requirement Document (PRD)** 

## **PRD Section 1: Customer Web Storefront (Expanded & Granular Specification)** 

#### **1. Module Overview & Scope** 

The Customer Web Storefront is a ultra-lightweight, progressive web app (PWA-ready) optimized for 3G/4G network conditions in Nepal. It acts as the primary acquisition and transaction channel for end-consumers to discover restaurants, customize items, make payments via local fintech options, and track order lifecycles in real time. 

#### **2. Comprehensive Screen-by-Screen & Feature Rules** 

###### **2.1 Location Setup & Serviceability Engine** 

###### **Screen / View: Location Modal & Header Bar** 

- **Initial State (First Visit):** Block full catalog browsing until a delivery address or location pin is established. Prompt user with a location modal overlaying a blurred background. 

- **Location Acquisition Methods:** 

###### ○ **Auto-Detect (Browser GPS API):** 

- Triggers browser geolocation permission prompt. 

- Obtains latitude and longitude ($Lat, Lng$). 

- Performs reverse geocoding to resolve street/neighborhood names (e.g., _"Jhamsikhel, Lalitpur"_ ). 

###### ○ **Manual Address Search:** 

      - Autocompletion input bar querying geographic databases (OpenStreetMap/Google Maps API). 

      - Handles local address patterns in Nepal (e.g., landmarks like _"Near Bhatbhateni Supermarket, Koteshwor"_ or Ward numbers). 

   - **Saved Addresses Dropdown (Authenticated Users):** 

      - Displays saved profile addresses tagged as Home, Work, or Other. 

- **Geofencing & Service Boundary Calculations:** 

   - System calculates Haversine / Road-network distance ($D$) between Customer Location ($L_c$) and Restaurant Location ($L_r$). 

   - **Maximum Delivery Radius ($R_{\text{max}}$):** Configured per restaurant (default: $6\text{ km}$). 

   - If $D > R_{\text{max}}$, the restaurant is flagged as OUT_OF_RANGE. 

###### ● **Out-of-Service Handling:** 

- If no active restaurants fall within $R_{\text{max}}$ of $L_c$, render a global empty state: _"We don't deliver to your area yet."_ 

- Include a **Notify Me** button that captures user $Lat/Lng$ into a expansion waitlist database. 

###### **2.2 Homepage & Restaurant Discovery Feed** 

**Screen / View: Main Storefront ( / )** 

###### ● **Header Component:** 

   - Location Selector Pill (clicking re-opens Location Modal). 

   - Global Search Bar (real-time filtering for dishes, cuisines, or restaurant names). 

   - Cart Drawer Trigger (shows live item count badge and subtotal). 

   - User Profile / Login Avatar. 

- **Promotional Carousel Banner:** 

   - Dynamic banner slots controlled by Platform Super Admin (e.g., _"20% off Momo Festival"_ , _"Rainy Day Free Delivery"_ ). 

- **Cuisine & Category Filter Bar:** 

   - Horizontal scrollable pills: Nepali, Newari, Momo, Burgers, Bakery, Thali, Pure Veg, Halal. 

- **Sorting & Filtering Controls:** 

   - **Sort By:** Proximity (Default), Fastest Delivery Time, Rating (High-to-Low), Minimum Order Amount. 

   - **Quick Filters:** _Open Now Only_ , _Free Delivery_ , _Accepts eSewa/Khalti_ . 

- **Restaurant Card Spec:** 

   - Cover Image (Lazy loaded, WebP format, 16:9 ratio). 

   - Restaurant Name & Primary Cuisine tags (e.g., _"Thakkali & Indian"_ ). 

   - Operational Badge: OPEN, BUSY (adds +15 mins to ETA), or CLOSED. 

- Estimated Delivery Time ($T_{\text{eta}}$): Calculated as $\text{Prep Time} + \text{Estimated Travel Time}$. 

- Delivery Charge Tag (e.g., _"NPR 50"_ or _"Free Delivery over NPR 1,000"_ ). 

###### **2.3 Restaurant Detail & Menu Page** 

**Screen / View: Restaurant Catalog ( /restaurant/:slug )** 

- **Restaurant Header Banner:** 

   - Banner Image, Profile Picture, Official Title, Address/Landmark, Contact Number (hidden behind click-to-reveal for privacy). 

   - Live Operating Hours display (e.g., _"Open Today: 10:00 AM – 9:30 PM"_ ). 

###### ● **Menu Navigation Bar:** 

   - Sticky sub-header listing category tabs (e.g., Starters, Momo Special, Main Course, Beverages). 

   - Clicking a tab smooth-scrolls directly to that category section. 

- **Menu Item Card Structure:** 

   - Item Title & Short Description (Max 150 chars). 

   - Dietary Indicator Tag: Green Dot (Vegetarian), Red Dot (Non-Vegetarian), Yellow Dot (Contains Egg). 

   - Base Price display (e.g., _"NPR 250"_ ). 

   - Item Image (Square 1:1, lazy loaded). 

- **Action Button:** 

   - If item has no options/variants: Displays **+ ADD** button. Clicking instantly increments cart count. 

   - If item has mandatory variants/modifiers: Displays **+ CUSTOMIZE** . Clicking triggers the Option Selection Modal. 

   - If item is marked OUT_OF_STOCK by restaurant: Button disabled with text **SOLD OUT** . 

###### **Item Customization Modal (Modifier Engine)** 

- **Trigger:** Clicking **+ CUSTOMIZE** or modifying an existing customizable item in cart. 

- **Group Rules:** 

   - **Single-Select (Radio Group - Required):** User _must_ select exactly one option before adding to cart (e.g., _"Choose Momo Base: Steamed [Included] | Fried [+NPR 30] | C-Momo [+NPR 50]"_ ). 

   - **Multi-Select (Checkbox Group - Optional):** User can select $0$ to $N$ choices (e.g., _"Extra Dips: Spicy Tomato [+NPR 20], Peanut Achar [+NPR 30]"_ ). 

   - **Quantity Counter per Option:** (Optional config) Allow selecting multiple units of an add-on. 

- **Special Instructions Field:** 

   - Text area limited to 120 characters. 

   - Explicit warning label: _"Special instructions cannot be used to request extra items or changes that affect price."_ 

- **Dynamic Price Calculator:** Bottom sticky bar inside modal updates price live: 

$$\text{Final Item Price} = (\text{Base Price} + \sum \text{Selected Modifier Prices}) \times \text{Item Quantity}$$ 

###### **2.4 Cart Engine & Checkout Lifecycle** 

###### **Cart System Rules & Edge Cases** 

- **Single-Restaurant Constraint (Strict Enforcement):** 

   - A customer cart can contain items from **only one restaurant at a time** . 

   - **Trigger Event:** If User has items from _Restaurant A_ in cart and attempts to add an item from _Restaurant B_ : 

   - **System Action:** Show full-screen modal alert: 

_"Replace cart items?"_ 

_"Your cart contains items from [Restaurant A]. Do you want to clear your cart and start a new order from [Restaurant B]?"_ 

###### **[Cancel]** | **[Clear & Add New Item]** 

**Cart Drawer & Checkout View ( /checkout )** 

- **Item Breakdown List:** 

   - List of selected items, variants, applied modifiers, unit prices, and quantities. 

   - + / - incremental buttons to alter quantities. Reducing quantity to $0$ prompts item removal confirmation. 

- **Cutlery & Eco Options:** 

- Toggle Switch: _"Do not include plastic disposable cutlery"_ (Checked by default). 

###### ● **Delivery Address & Drop-Off Instructions:** 

- Address Confirmation Card displaying active street address and phone number. 

- Drop-off Instruction Selector: Hand it to me, Leave at gate / reception, Call when arrived. 

###### ● **Complete Order Price Calculation Logic:** 

Base Menu Subtotal 

+ Sum of Modifier Add-ons 

─────────────────────────────────────── 

- = Item Subtotal (Gross Food Cost) 

- Promotional Discount (Coupon / Voucher Code) 

- + Packaging Fee (Set per restaurant or item level) 

+ Delivery Fee (Calculated via distance engine) 

+ Platform Service Fee (Flat or % rate) 

─────────────────────────────────────── 

- = TOTAL PAYABLE AMOUNT (NPR) 

###### ● **Delivery Fee Calculation Formula:** 

$$\text{Delivery Fee} = \begin{cases} \text{Base Fee} & \text{if } D \le D_{\text{base}} \\ \text{Base Fee} + ((D - D_{\text{base}}) \times \text{Per KM Rate}) & \text{if } D > D_{\text{base}} \end{cases}$$ 

- _Example Configuration:_ Base Fee = NPR 40 for first 2 km ($D_{\text{base}} = 2$). Additional km = NPR 15/km. 

###### **2.5 Localized Payment Integration Engine** 

Customers can choose from 4 distinct payment methods at checkout: 

┌───> eSewa (Web / App Redirect Gateway) 

├───> Khalti (Web / SDK Gateway) Checkout Select ──┼───> Fonepay Dynamic QR / Direct Pay └───> Cash on Delivery (COD) 

###### **Detailed Payment Method Rules** 

###### 1. **eSewa Integration:** 

- Initiates POST request to eSewa payment endpoint with amt, txAmt, psc, pdc, sc, pid (Order Reference ID), su(Success Redirect URL), and fu (Failure Redirect URL). 

- Upon successful payment callback, backend verifies transaction signature directly via eSewa server-to-server Verification API before confirming order. 

###### 2. **Khalti Integration:** 

- Triggers Khalti Popup / Widget. 

- Generates transaction token. Backend completes verification via Khalti v2/payment/verify/ API payload. 

###### 3. **Fonepay QR Integration:** 

- Generates a dynamic ISO 20022 compliant QR code containing exact Order Total and Merchant ID. 

- Customer scans via any Nepalese Bank Mobile Banking App (Interoperable QR). 

- WebSockets listen for payment notification callback from Fonepay server. 

###### 4. **Cash on Delivery (COD):** 

- **Fraud Mitigation Guardrails:** 

   - COD option disabled if order subtotal exceeds **NPR 5,000** . 

   - COD option disabled if customer has $\ge 2$ previously unverified or rejected delivery attempts. 

   - Requires mandatory 4-digit SMS OTP confirmation at checkout for first-time COD users. 

###### **2.6 Order State Machine & Live Tracking Experience** 

Once payment is verified or COD is confirmed, the order moves into a persistent real-time status page (/orders/:order_id). 

###### **Complete Order State Transitions & System Actions** 

[PLACED] ──(Restaurant Accepts)──> [ACCEPTED] ──(Kitchen Starts)──> [PREPARING] 

│                                                                     │ 

├─(Restaurant Rejects / Timeout)─> [CANCELLED]                        └─(Rider Picked Up) 

- └─(Payment Timeout)─────────────> [PAYMENT_FAILED]                             │ 

v 

[DELIVERED] <──(Customer / Rider Confirms)── [ARRIVED] <──(In Transit)── [DISPATCHED] 



<!-- Start of picture text -->
State Code User Display  Visual UI State Allowed Customer<br>Title Actions<br><!-- End of picture text -->

|PLACED|Order Sent to<br>Kitchen|Progress bar at 15%.<br>Pulse animation.<br>System waiting for<br>restaurant response<br>(Max 3-min timeout).|**Cancel Order Button**<br>**Active**(Self-service<br>cancellation allowed).|
|---|---|---|---|
|ACCEPTED|Restaurant<br>Confirmed|Progress bar at 35%.<br>Shows estimated<br>prep time assigned by<br>kitchen (e.g.,_"Ready_<br>_in 20 mins"_).|Cancellation disabled.<br>"Call Support" button<br>visible.|
|PREPARING|Food Being<br>Prepared|Progress bar at 50%.<br>Kitchen animation.|Display order receipt<br>breakdown.|
|DISPATCHED|Out for<br>Delivery|Progress bar at 75%.<br>Map View activates<br>displaying delivery<br>driver info and live<br>location.|Click to Call Driver / Click<br>to Call Support.|



|ARRIVED|Driver<br>Outside|Progress bar at 90%.<br>Banner alert:_"Driver_<br>_is at your delivery_<br>_location."_|View Delivery Verification<br>PIN (if enabled).|
|---|---|---|---|
|DELIVERED|Order<br>Delivered|Progress bar at<br>100%. Success<br>animation.|Prompt Star Rating &<br>Feedback Form.|
|CANCELLED|Order<br>Cancelled|Red error card<br>displaying<br>cancellation reason<br>(e.g.,_"Restaurant Out_<br>_of Stock"_).|**Reorder Button**<br>(Repopulates items into<br>cart).|



#### **3. Detailed Business Rules & System Edge Cases** 

###### ● **BR-C01: Restaurant Operational Closure During Cart Build** 

- If a user adds items to a cart at 9:55 PM, and the restaurant officially closes at 10:00 PM, the checkout action must be blocked at 10:00:01 PM with an alert: _"This restaurant is now closed for the day. Orders can no longer be placed."_ 

###### ● **BR-C02: Price Drift Guard** 

- If a restaurant owner changes the price of an item while a customer has it sitting in their cart, the cart must re-validate prices against the database at the moment the customer clicks **Proceed to Payment** . 

- If a price change occurs, display an alert: _"Prices for some items in your cart have been updated,"_ and refresh the cart totals. 

###### ● **BR-C03: Unpaid Payment Gateway Abandonment** 

- If a user is redirected to eSewa/Khalti and fails to complete the transaction within $10\text{ minutes}$, the order status automatically transitions from PAYMENT_PENDING to PAYMENT_FAILED. 

- Reserved inventory (if any) is released, and the customer receives a notification to retry payment. 

###### ● **BR-C04: Phone Number Formatting & OTP Verification** 

- All phone inputs must enforce Nepal Mobile Number validation regex: ^(?:\+?977)?9[78]\d{8}$. 

- OTP verification tokens expire in 180 seconds, with a maximum of 3 resend attempts allowed per hour per IP/Phone number to prevent SMS gateway abuse. 

#### **4. User Acceptance Criteria (Gherkin Format)** 

###### **Scenario 1: Preventing Mixed-Restaurant Cart Creation** 

Gherkin 

Given the customer has 2 items from "Bhojmandir Restaurant" in their cart When the customer navigates to "Momo Palace" restaurant page And clicks "+ ADD" on "Buff Steam Momo" 

Then the system should display a modal warning "Replace cart items?" When the customer clicks "Clear & Add New Item" 

Then the cart should remove all items from "Bhojmandir Restaurant" And add 1 "Buff Steam Momo" from "Momo Palace" 

And update the active cart header to reflect "Momo Palace". 

###### **Scenario 2: Cancelling an Order Before Kitchen Acceptance** 

Gherkin 

Given the customer has placed an order successfully with Cash on Delivery And the current order status is "PLACED" When the customer navigates to the live tracking page Then the "Cancel Order" button should be visible and active When the customer clicks "Cancel Order" And selects a valid reason "Change of mind" Then the system updates the order status to "CANCELLED" And stops the acceptance countdown timer on the Restaurant Admin interface And shows a confirmation banner "Your order has been cancelled successfully." 

###### **Scenario 3: Attempting Self-Service Cancellation After Acceptance** 

Gherkin 

Given the customer placed an order And the restaurant manager clicked "Accept Order" (Status is now "ACCEPTED") When the customer views the live tracking page Then the "Cancel Order" button must be hidden And an informational note should state "Restaurant has started processing your order. Contact support for assistance." 

### **Section 2 & 3: Admin & Operations Portals** 

This document covers both administrative modules required to run the Web MVP: 

1. **Section 2: Restaurant Admin Portal** (Kitchen Display System & Merchant Management) 

2. **Section 3: Super Admin & Delivery Dispatch Console** (Platform Logistics, Commissions, & Control) 

# **Section 2: Restaurant Admin Portal Specification** 

### **1. Module Overview & Scope** 

The Restaurant Admin Portal is a web dashboard designed for kitchen managers and front-of-house staff. It functions as an order management center to accept incoming orders, update item availability, configure preparation times, and track daily sales metrics. 

### **2. Functional Requirements** 

##### **2.1 Order Receipt & Kitchen Processing** 

###### **Order Alert System** 

- **Visual Alert:** Persistent modal overlay with high-contrast flash state upon receiving an order in the PLACED state. 

- **Audio Alert:** Repeating 80 dB audio chime looping every 3 seconds until staff takes action (Accept or Reject). 

- **Auto-Accept Mode (Toggle):** Optional setting to automatically accept orders during non-peak operating hours. 

###### **Order Action Controls** 

###### ● **Accept Workflow:** 

   - Staff selects estimated preparation time ($T_{\text{prep}}$): 15 mins, 30 mins, 45 mins, or custom input. 

   - System updates state from PLACED $\rightarrow$ ACCEPTED and notifies the customer storefront. 

- **Reject Workflow:** 

   - Requires mandatory reason selection: Out of Stock, Kitchen Overloaded, Closing Early, or Address Unreachable. 

   - System updates state to CANCELLED, releases customer payment hold, and logs rejection for platform quality audits. 

###### **Kitchen Display System (KDS) Interface** 

- Kanban-style board divided into 4 real-time columns: 

   1. Incoming (State: PLACED — requiring action) 

   2. In Kitchen (State: ACCEPTED / PREPARING) 

   3. Ready for Pickup (State: READY — waiting for rider) 

   4. Completed (State: DISPATCHED / DELIVERED) 

- **Order Card Display:** Displays Order ID, customer name, countdown timer based on assigned $T_{\text{prep}}$, item list, variants, special instructions, and total item count. 

##### **2.2 Menu Management & Inventory Toggle** 

###### **Live Item Availability Controls** 

- Grid view of all assigned menu items grouped by category. 

- **8-Hour Toggle (Quick Disable):** One-click toggle marking an item OUT_OF_STOCK for the rest of the business day. Auto-resets to AVAILABLE at 00:00 midnight. 

- **Indefinite Disable:** Toggle setting an item to INACTIVE until manually re-enabled. 

###### **Price & Variant Editing (Read-Only Guard)** 

- Restaurant staff can edit descriptions and tag items (e.g., Veg, Non-Veg, Spicy). 

- Base price modifications require Super Admin approval to prevent unauthorized catalog changes. 

##### **2.3 Operational Control & Store Status** 

###### **Store Status Controls** 

- **Manual Override Toggle:** Switch between OPEN, BUSY (adds +15 minutes to default customer ETA), and PAUSED / CLOSED. 

- **Automatic Closing Schedule:** Automated cron job that sets store state to CLOSED based on saved operating hours. 

# **Section 3: Super Admin & Delivery Dispatch Console** 

# **Specification** 

### **1. Module Overview & Scope** 

The Super Admin Console serves as the operational command center for platform owners. It handles central order dispatch, delivery fleet routing, commission ledger tracking, restaurant onboarding, and platform configuration. 

### **2. Functional Requirements** 

##### **2.1 Dispatch & Delivery Management** 

###### **Live Logistics Map** 

- Map view showing active delivery drivers (Riders), operating restaurants, and active customer order destinations. 

- **Rider Status Indicators:** Available (Green), Assigned/In-Transit (Blue), Offline (Grey). 

###### **Order Dispatch Engine** 

- **Manual Assignment Mode:** Admin selects an unassigned order and assigns it to an active rider from a dropdown filtered by proximity. 

- **Auto-Dispatch Logic (Fallback Rule):** 

   - Identifies available riders within a $3\text{ km}$ radius of the restaurant. 

   - Assigns order to the rider with the lowest active workload (maximum 1 concurrent order during MVP phase). 

##### **2.2 Merchant & Fleet Management** 

###### **Restaurant Onboarding & Configuration** 

- Admin interface to create new restaurant profiles, set geofence coordinates, upload menus, and define commission rates. 

- **Commission Rate Setup:** Configurable flat percentage (e.g., 15% to 25%) applied to food subtotal per transaction. 

###### **Driver Fleet Onboarding** 

- Driver profile management: Full Name, Phone (+977 format), Vehicle Type (Motorbike, Scooter, Bicycle), License Plate Number, and Payout Bank Details. 

##### **2.3 Financial Ledger & Settlement Engine** 

###### **Platform Revenue & Commission Calculation** 

$$\text{Platform Net Revenue} = (\text{Food Subtotal} \times \text{Commission Rate}) + \text{Platform Service Fee} + (\text{Delivery Fee Charged} - \text{Driver Delivery Pay})$$ 

###### **Merchant Payout Ledger** 

- Generates weekly payment summaries per restaurant: 

   - $$\text{Merchant Payout} = \text{Gross Food Sales} - \text{Platform Commission} - \text{Refunds/Chargebacks}$$ 

###### **Driver Earnings Ledger** 

- Tracks total completed deliveries, distance-based delivery pay, and Cash on Delivery (COD) cash-in-hand collected by each driver. 

- **COD Settlement Block:** Automatically blocks drivers from receiving new orders if un-settled COD cash exceeds NPR 10,000. 

##### **2.4 Platform Global Settings & System Overrides** 

###### **Dynamic Fee Management** 

- Global controls for Base Delivery Fee, Per-KM Charge, Platform Service Fee, and Maximum COD Allowance. 

###### **Emergency Order Override** 

- Administrative power to manually force-update any order status (e.g., re-assigning stuck orders, issuing manual cancellations, or triggering full refunds). 

### **3. Comprehensive Business Rules (Admin & Dispatch)** 

|**Rule ID**|**Module**|**Trigger Event**|**System Action /**<br>**Rule Constraint**|
|---|---|---|---|
|**BR-A01**|Restaurant|Restaurant<br>unresponsive to<br>PLACED order for 3<br>minutes|System triggers<br>SMS alert to<br>manager phone. If<br>no response afer 5<br>minutes,<br>auto-cancels order<br>and fags store as<br>UNRESPONSIVE.|
|**BR-A02**|Dispatch|Driver collected<br>COD payment|COD balance<br>added to Driver<br>Cash-in-Hand<br>ledger. Subtracts<br>from total weekly<br>driver payout.|
|**BR-A03**|Super Admin|Manual Price Edit|All active customer<br>carts containing<br>edited item refresh<br>to display updated<br>price during<br>checkout validation.|



### **4. User Acceptance Criteria (Gherkin Format)** 

##### **Scenario 1: Kitchen Accepting Order with Custom Preparation Time** 

Gherkin 

Given a new order arrives at the Restaurant Admin Portal in state "PLACED" When the kitchen staff clicks "Accept Order" And selects "30 mins" as preparation time Then the system updates the order state to "ACCEPTED" And sets the estimated ready time to "Current Time + 30 Mins" And triggers a push event to update the customer's live tracking view. 

##### **Scenario 2: Super Admin Manual Rider Assignment** 

Gherkin 

Given an order is in state "PREPARING" and has no driver assigned When the Super Admin opens the Dispatch Console And selects Order #1042 

And selects "Rider Ramesh" from the available driver list Then the system links "Rider Ramesh" to Order #1042 And sends an active assignment alert to Ramesh's interface And updates the order state to "DISPATCHED" once pickup is confirmed. 

### **5. Summary of PRD Phase 1 Completion** 

With Section 1 (Customer Storefront), Section 2 (Restaurant Admin), and Section 3 (Super Admin & Dispatch) finalized, **Document 1** 

## **Document 2: User Flows & Real-Time Order State Machine** 

#### **1. Global Order State Machine Specification** 

The Order State Machine manages the lifecycle of an order across all three portals (Customer, Restaurant, Admin/Dispatch). Every transition is triggered by a specific actor or event and emits real-time WebSocket events to update all clients simultaneously. 

┌────────────────────────────────────────────────────────┐ │                      [PLACED]                          │ └───────────────────┬────────────────┬───────────────────┘ │                │ (Restaurant      │                │ (3-Min Timeout / Accepts)        │                │  Customer Cancels / v                │  Payment Fails) [ACCEPTED]            │ │                v (Kitchen Starts)│          [CANCELLED] v                ^ [PREPARING]           │ │                │ (Admin Force Cancel) (Rider Picked Up)│                │ v                │ [DISPATCHED] ──────────┘ │ (Rider Arrives) │ v [ARRIVED] │ (Delivery Confirmed) v 

[DELIVERED] 

###### **State Definitions & Transition Rules** 

|**Current**<br>**State**|**Target**<br>**State**|**Triggeri**<br>**ng**<br>**Actor /**<br>**Event**|**Conditions &**<br>**System Actions**|**Emitted Event**|
|---|---|---|---|---|
|INIT|PLACED|Custom<br>er|Order payload<br>created, payment<br>method selected<br>(or COD validated).|ORDER_PLACED|
|PLACED|ACCEPTE<br>D|Restaur<br>ant Staff|Staff selects<br>estimated prep<br>time<br>($T_{\text{prep}}$)<br>within 3 minutes.|ORDER_ACCEPTED|
|PLACED|CANCELL<br>ED|Custom<br>er /<br>Timeout|Customer cancels<br>manually**OR**<br>restaurant fails to<br>respond within<br>180s. Payment|ORDER_CANCELLED|



||||hold released.||
|---|---|---|---|---|
|ACCEPTE<br>D|PREPARIN<br>G|Kitchen<br>Staff|Staff clicks "Start<br>Preparing" on<br>KDS. Disables<br>self-service<br>customer<br>cancellation.|ORDER_PREPARING|
|PREPARIN<br>G|DISPATCH<br>ED|Rider /<br>Admin|Rider<br>scans/confirms<br>pickup at<br>restaurant<br>**OR**admin manually<br>dispatches.|ORDER_DISPATCHED|
|DISPATCH<br>ED|ARRIVED|Rider|Rider location pin<br>enters a 50-meter<br>geofence around<br>customer<br>coordinates.|ORDER_ARRIVED|



|ARRIVED|DELIVERE<br>D|Rider /<br>Custom<br>er|Rider collects cash<br>(if COD) and inputs<br>4-digit verification<br>PIN provided by<br>customer.|ORDER_DELIVERED|
|---|---|---|---|---|
|_Any Active_<br>_State_|CANCELL<br>ED|Super<br>Admin|Administrative<br>force-cancellation<br>override (e.g.,<br>driver accident, lost<br>order).|ORDER_CANCELLED_A<br>DMIN|



#### **2. Portal User Flow Diagrams** 

###### **2.1 Customer Portal User Flow** 

[ Entry: Landing Page / App ] 

│ 

v 

{ Location Selected? } ──── NO ───> [ Location Modal: GPS / Search Bar / Pin Drop ] │                                      │ 

YES ────────────────────────────────────┘ │ v 

- [ Restaurant List Feed ] ─── (Apply Filters / Cuisines / Sort) │ 

v 

- [ Select Restaurant Catalog ] 

|│<br>v<br>[ Select Menu Item ] ──── { Has Customizations? } ─── YES ───> [ Item Customization Modal ]<br>│                                                             │<br>NO ────────────────────────────────────────────────────────────┘<br>│<br>v<br>[ Add to Cart ] ──────── { Multi-Restaurant Cart? } ─── YES ───> [ Modal: Clear Cart & Switch? ]<br>│                                                                    │<br>NO ───────────────────────────────────────────────────────────────────┘<br>│<br>v<br>[ Open Checkout ]<br>│<br>v<br>[ Payment Method Selection ]<br>│|
|---|
|<br>┌───────┴─────────────────────────┬─────────────────────────┐<br>v                                 v                         v|
|[ Cash on Delivery ]           [ eSewa / Khalti ]          [ Fonepay Dynamic QR ]<br>│                                 │                         │<br>|
|│ (Validate COD Limit             │ (Redirect to Gateway    │ (Generate ISO QR Code<br>│  & SMS OTP if first time)       │  & Wait for Callback)   │  & Listen on WebSocket)<br>│                                 │                         │<br>└────────────────────────┬────────┴─────────────────────────┘<br>│<br>{ Payment Success? } ─── NO ───> [ Error Screen: Payment Failed / Retry ]<br>│<br>YES<br>│<br>v|



[ Live Order Tracking View ] │ ┌──────────────────┴──────────────────┐ v                                     v { Order State = PLACED }               { Order State >= ACCEPTED } │                                     │ [ Cancel Order Allowed ]               [ Cancel Disabled / Call Support ] 

###### **2.2 Restaurant Admin Portal User Flow** 

[ KDS Dashboard Active Screen ] │ v ((( Audio Alert Chime ))) ───> [ High-Contrast "New Order" Flash Modal ] │ +─────────────────────────────────┐ │                                 │ v                                 v [ Click ACCEPT ]                  [ Click REJECT ] │                                 │ [ Select Prep Time ]             [ Select Reason Dropdown ] (15m / 30m / 45m / Custom)       (Out of stock / Kitchen Busy) │                                 │ v                                 v [ Move to "In Kitchen" ]          [ Update State: CANCELLED ] │                      [ Trigger Customer Refund ] v                                 │ [ Click "Food Ready" ]                      └──────────> [ Return to KDS Screen ] │ v [ Move to "Ready for Pickup" ] 

│ { Delivery Rider Arrives } │ v [ Handover Food & Confirm ] │ v 

[ Move Order to "Completed" ] 

###### **2.3 Super Admin & Delivery Dispatch User Flow** 

[ Dispatch Board: Active Orders List & Live Map View ] │ v 

{ Select Unassigned Order } │ v [ View Nearby Active Riders ] │ ┌───────┴────────────────────────────────┐ v                                        v [ Manual Assignment ]                  [ Auto-Dispatch Algorithm ] (Select rider from list)               (Finds closest available rider │                                 within 3km radius & lowest load) │                                        │ └──────────────────┬─────────────────────┘ │ v 

[ Send Order Notification ] │ v 

{ Driver Accepts Order? } ─── NO ───> [ Re-queue for Next Driver ] │ YES │ v 

[ Driver Navigates to Restaurant ] │ v 

[ Driver Confirms Pickup ] │ v 

[ Driver Navigates to Customer ] │ v 

{ Order Payment Method = COD? } ─── YES ─> [ Collect Cash & Record Ledger ] │ NO │ v 

[ Enter Customer Verification PIN ] 

│ v 

[ State = DELIVERED ] 

#### **3. Real-Time Communication Architecture (WebSockets / Server-Sent Events)** 

To keep all three portals synchronized in real time without heavy HTTP polling, the backend exposes WebSocket channels structured as follows: 

WebSocket Server Endpoint: wss://api.yourdomain.com/ws/v1/orders 

###### **Event Payload Contracts** 

**Event 1: ORDER_PLACED (Sent to Restaurant Admin & Super Admin)** 

JSON { "event": "ORDER_PLACED", "timestamp": "2026-09-02T12:00:00Z", "data": { "order_id": "ORD-98412", "restaurant_id": "REST-004", "customer_name": "Sujan Thapa", "customer_phone": "+9779841234567", "delivery_address": "Jhamsikhel, Lalitpur (Near Bhatbhateni)", "coordinates": { "lat": 27.6782, "lng": 85.3164 }, "items": [ { "item_name": "Buff Steam Momo", "quantity": 2, "modifiers": ["Spicy Tomato Achar"] } ], "total_payable": 540.00, "payment_type": "COD", "timeout_seconds": 180 } } **Event 2: ORDER_ACCEPTED (Sent to Customer Portal & Super Admin)** JSON { "event": "ORDER_ACCEPTED", 

"timestamp": "2026-09-02T12:01:15Z", "data": { "order_id": "ORD-98412", "status": "ACCEPTED", "prep_time_minutes": 25, "estimated_delivery_time": "2026-09-02T12:35:00Z" } } 

**Event 3: DRIVER_LOCATION_UPDATE (Sent to Customer Tracking View)** JSON { "event": "DRIVER_LOCATION_UPDATE", "timestamp": "2026-09-02T12:20:00Z", "data": { "order_id": "ORD-98412", "driver_id": "DRV-102", "driver_name": "Ramesh Adhikari", "current_coordinates": { "lat": 27.6810, "lng": 85.3190 }, "bearing_degrees": 142.5, "speed_kmh": 28.4 } } 

## **Document 3: System Architecture, Tech Stack Selection, and Database Schema** 

#### **1. Tech Stack Selection & Infrastructure Blueprint** 

To support low latency, cost efficiency, high network resilience for mobile web browsers in Nepal, and real-time state synchronization, the tech stack is divided into core operational layers: 

┌─────────────────────────────────────────────────────────────────────────┐ │                           FRONTEND LAYER                                │ 

│ Next.js (React) Progressive Web App (PWA) + Tailwind CSS + Zustand     │ └────────────────────────────────────┬────────────────────────────────────┘ │ │ HTTPS / WSS v ┌─────────────────────────────────────────────────────────────────────────┐ │                          API GATEWAY / LAYER                            │ 

│ NGINX Reverse Proxy + Node.js (TypeScript) / Express.js REST & WebSockets│ └────────────────────────────────────┬────────────────────────────────────┘ │ ┌─────────────────────────┼─────────────────────────┐ │                         │                         │ v                         v                         v 

┌────────────────────┐    ┌────────────────────┐    ┌────────────────────┐ │ PRIMARY DATABASE   │    │  CACHE & PUB/SUB   │    │ THIRD-PARTY APIs   │ │ PostgreSQL 16      │    │  Redis 7           │    │ eSewa, Khalti,     │ │ + PostGIS Extension│    │  (State Cache &    │    │ Fonepay,           │ │ (Geospatial)       │    │   WS Event Bus)    │    │ OpenStreetMap/Map  │ └────────────────────┘    └────────────────────┘    └────────────────────┘ 

###### **Tech Stack Components** 

|**Layer**|**Recommended**<br>**Technology**|**Technical Rationale for Food Delivery**<br>**MVP**|
|---|---|---|
|**Frontend**<br>**Framework**|**Next.js 14+ (App**<br>**Router)**|Provides Server-Side Rendering (SSR)<br>for fast initial load and SEO<br>(restaurant/dish pages) with Client-Side<br>Rendering (CSR) for interactive<br>checkout and live tracking.|
|**State**<br>**Management**|**Zustand**|Lightweight alternative to Redux for<br>maintaining cart local persistence and<br>real-time socket updates without<br>performance overhead.|
|**Backend**<br>**Runtime**|**Node.js**<br>**(TypeScript) +**<br>**Express / Fastify**|Single language across full stack;<br>asynchronous non-blocking I/O handles<br>thousands of concurrent WebSocket<br>connection pings efficiently.|



|**Database**|**PostgreSQL 16 +**<br>**PostGIS**|Relational integrity for transactions and<br>financial ledgers paired with native<br>spatial queries (ST_DWithin,<br>ST_Distance) for delivery radius<br>calculations.|
|---|---|---|
|**Caching &**<br>**Pub/Sub**|**Redis 7**|In-memory session tracking, live rider<br>geospatial coordinates<br>(GEOADD/GEORADIUS), and<br>WebSocket message distribution across<br>server instances.|
|**Real-time**<br>**Engine**|**Socket.io / Native**<br>**WebSockets**|Bi-directional communication for<br>immediate KDS order alerts and map<br>tracking pings.|
|**Cloud Hosting**|**AWS (ap-south-1**<br>**Mumbai /**<br>**Singapore)**|Offers lowest network latency to Nepal.<br>Uses EC2/ECS for API services, S3 for<br>media storage, and RDS PostgreSQL for<br>managed data.|



#### **2. Database Schema & Entity-Relationship Diagram (ERD)** 

The database design uses PostgreSQL with structural constraints to ensure financial precision (NUMERIC(10,2)) and spatial indexing (GEOMETRY(Point, 4326)). 

###### **Entity-Relationship Architecture Diagram** 

[ USERS ] ───1:N───> [ CUSTOMER_ADDRESSES ] │ 

├───1:N───> [ ORDERS ] ───1:N───> [ ORDER_ITEMS ] ───1:N───> [ ORDER_ITEM_MODIFIERS ] │              │ 

- [ RESTAURANTS ] ──┤ 

- │              ├───1:1───> [ PAYMENTS ] 

- [ MENU_CATEGORIES ]│ 

- │              └───1:1───> [ DELIVERY_LOGS ] ───N:1───> [ DRIVER_PROFILES ] 

[ MENU_ITEMS ] ───┘ 

###### **SQL Table Schema Definitions** 

###### **1. users Table** 

SQL 

CREATE TABLE users ( 

id UUID PRIMARY KEY DEFAULT gen_random_uuid(), 

full_name VARCHAR(100) NOT NULL, 

phone_number VARCHAR(15) UNIQUE NOT NULL, -- Regex validated (+977 format) email VARCHAR(150) UNIQUE, 

role VARCHAR(20) NOT NULL CHECK (role IN ('CUSTOMER', 'RESTAURANT_STAFF', 'DRIVER', 'SUPER_ADMIN')), is_phone_verified BOOLEAN DEFAULT FALSE, 

is_active BOOLEAN DEFAULT TRUE, 

created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP ); 

CREATE INDEX idx_users_phone ON users(phone_number); 

###### **2. restaurants Table** 

SQL 

CREATE TABLE restaurants ( id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name VARCHAR(150) NOT NULL, slug VARCHAR(150) UNIQUE NOT NULL, phone_number VARCHAR(15) NOT NULL, address_line VARCHAR(255) NOT NULL, location GEOMETRY(Point, 4326) NOT NULL, -- Spatial coordinates (Lng, Lat) max_delivery_radius_km NUMERIC(4,2) DEFAULT 6.00, commission_rate_pct NUMERIC(4,2) NOT NULL DEFAULT 20.00, -- e.g. 20% is_open BOOLEAN DEFAULT TRUE, 

is_busy BOOLEAN DEFAULT FALSE, 

created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP ); 

CREATE INDEX idx_restaurants_location ON restaurants USING GIST (location); 

###### **3. menu_items Table** 

SQL 

CREATE TABLE menu_items ( 

id UUID PRIMARY KEY DEFAULT gen_random_uuid(), 

restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE, category_id UUID NOT NULL, name VARCHAR(150) NOT NULL, description TEXT, base_price NUMERIC(10,2) NOT NULL, dietary_type VARCHAR(10) CHECK (dietary_type IN ('VEG', 'NON_VEG', 'EGG')), is_available BOOLEAN DEFAULT TRUE, created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP ); CREATE INDEX idx_menu_items_restaurant ON menu_items(restaurant_id); 

###### **4. orders Table** 

###### SQL 

CREATE TABLE orders ( 

id UUID PRIMARY KEY DEFAULT gen_random_uuid(), order_number VARCHAR(20) UNIQUE NOT NULL, -- E.g., ORD-20260902-001 customer_id UUID NOT NULL REFERENCES users(id), restaurant_id UUID NOT NULL REFERENCES restaurants(id), status VARCHAR(30) NOT NULL DEFAULT 'PLACED' CHECK (status IN ('PLACED', 'ACCEPTED', 'PREPARING', 'DISPATCHED', 'ARRIVED', 'DELIVERED', 'CANCELLED', 

'PAYMENT_FAILED')), 

delivery_address JSONB NOT NULL, -- Captures full snapshot of address details delivery_location GEOMETRY(Point, 4326) NOT NULL, 

-- Financial Ledger Columns food_subtotal NUMERIC(10,2) NOT NULL, packaging_fee NUMERIC(10,2) DEFAULT 0.00, delivery_fee NUMERIC(10,2) NOT NULL, platform_fee NUMERIC(10,2) DEFAULT 0.00, discount_amount NUMERIC(10,2) DEFAULT 0.00, total_payable NUMERIC(10,2) NOT NULL, 

payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('COD', 'ESEWA', 'KHALTI', 'FONEPAY')), payment_status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'PAID', 'FAILED', 'REFUNDED')), 

prep_time_minutes INT, cancellation_reason TEXT, created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP ); 

CREATE INDEX idx_orders_customer ON orders(customer_id); 

CREATE INDEX idx_orders_restaurant ON orders(restaurant_id); CREATE INDEX idx_orders_status ON orders(status); 

###### **5. order_items & order_item_modifiers Tables** 

SQL 

CREATE TABLE order_items ( 

id UUID PRIMARY KEY DEFAULT gen_random_uuid(), order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE, menu_item_id UUID NOT NULL REFERENCES menu_items(id), item_name VARCHAR(150) NOT NULL, -- Historical snapshot unit_price NUMERIC(10,2) NOT NULL, quantity INT NOT NULL CHECK (quantity > 0), total_price NUMERIC(10,2) NOT NULL ); 

CREATE TABLE order_item_modifiers ( 

id UUID PRIMARY KEY DEFAULT gen_random_uuid(), order_item_id UUID NOT NULL REFERENCES order_items(id) ON DELETE CASCADE, modifier_name VARCHAR(100) NOT NULL, unit_price NUMERIC(10,2) NOT NULL ); 

###### **6. payments Table** 

SQL CREATE TABLE payments ( id UUID PRIMARY KEY DEFAULT gen_random_uuid(), order_id UUID UNIQUE NOT NULL REFERENCES orders(id), gateway VARCHAR(20) NOT NULL CHECK (gateway IN ('COD', 'ESEWA', 'KHALTI', 'FONEPAY')), transaction_reference VARCHAR(100) UNIQUE, -- Gateway Txn ID / Ref Code amount NUMERIC(10,2) NOT NULL, 

gateway_response JSONB, -- Complete raw API payload from provider status VARCHAR(20) NOT NULL DEFAULT 'PENDING', created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP ); 

###### **7. delivery_logs Table** 

SQL 

CREATE TABLE delivery_logs ( 

id UUID PRIMARY KEY DEFAULT gen_random_uuid(), 

order_id UUID UNIQUE NOT NULL REFERENCES orders(id), driver_id UUID REFERENCES users(id), assigned_at TIMESTAMP WITH TIME ZONE, picked_up_at TIMESTAMP WITH TIME ZONE, delivered_at TIMESTAMP WITH TIME ZONE, verification_pin VARCHAR(4) NOT NULL, -- 4-digit PIN given to customer cod_cash_collected NUMERIC(10,2) DEFAULT 0.00 

); 

#### **3. PostGIS Spatial Query Example: Restricting Restaurant Search** 

To render only active restaurants within a user's service radius, the backend executes this PostGIS query: SQL 

SELECT 

r.id, 

r.name, 

r.address_line, 

ROUND((ST_Distance(r.location::geography, ST_MakePoint($user_lng, $user_lat)::geography) / 1000)::numeric, 2) AS distance_km 

FROM restaurants r WHERE r.is_open = TRUE AND ST_DWithin( 

r.location::geography, 

ST_MakePoint($user_lng, $user_lat)::geography, r.max_delivery_radius_km * 1000 ) 

ORDER BY distance_km ASC; 

## **Document 4: API Specification & Endpoint Map** 

#### **1. Global API Standards & Architecture** 

All REST API endpoints conform to JSON format standards over HTTPS with standardized error handling and JWT-based authentication headers. 

- **Base URL:** [https://api.yourdomain.com/api/v1](https://api.yourdomain.com/api/v1) 

- **Authentication Header:** Authorization: Bearer <JWT_TOKEN> 

- **Content-Type:** application/json 

###### **Standard Error Response Format** 

JSON { "success": false, "error": { "code": "INVALID_CART_ITEMS", "message": "Cart items must belong to a single restaurant.", "details": [ { "field": "restaurant_id", "issue": "Item 'Buff Momo' belongs to a different restaurant than active cart." } ] }, "timestamp": "2026-09-02T12:30:00Z" } 

#### **2. Customer Storefront Endpoints** 

###### **2.1 Get Nearby Restaurants** 

Returns operational restaurants within the customer's spatial service boundary. 

- **Endpoint:** GET /restaurants/nearby 

- **Query Parameters:** 

   - lat (required, float): Customer latitude (e.g. 27.6782) 

   - lng (required, float): Customer longitude (e.g. 85.3164) 

   - cuisine (optional, string): Filter tag (e.g. momo) 

   - sort (optional, string): distance | rating | delivery_fee 

###### **Response ( 200 OK )** 

JSON { "success": true, "data": [ { "id": "c39a2b10-67df-4f01-9a74-9842f10b2a11", "name": "Bhojmandir Foods", "slug": "bhojmandir-foods-lalitpur", "is_open": true, "is_busy": false, 

"distance_km": 1.85, "estimated_prep_time_mins": 25, "delivery_fee": 55.00, "cover_image": "https://cdn.yourdomain.com/restaurants/bhojmandir.webp" } ] } 

###### **2.2 Create Order** 

Generates an order, validates inventory, calculates dynamic delivery fees, and locks items. 

● **Endpoint:** POST /orders 

● **Headers:** Authorization: Bearer <CUSTOMER_JWT> 

###### **Request Payload** 

JSON { "restaurant_id": "c39a2b10-67df-4f01-9a74-9842f10b2a11", "items": [ { "menu_item_id": "e81d1822-4212-42bb-a320-11234bc50123", "quantity": 2, "selected_modifiers": [ "9012a411-1234-4567-8910-abcdef123456" ], "special_instructions": "Make it extra spicy" } ], 

"delivery_address": { "landmark": "Near Bhatbhateni Supermarket", "street": "Jhamsikhel Road", "city": "Lalitpur", "phone": "+9779841234567", "latitude": 27.6782, "longitude": 85.3164 }, "payment_method": "ESEWA", "cutlery_requested": false } **Response ( 201 Created )** JSON { "success": true, "data": { "order_id": "a901f412-8812-411f-b123-019283746511", "order_number": "ORD-20260902-1082", "status": "PLACED", "financial_breakdown": { "food_subtotal": 500.00, "packaging_fee": 20.00, "delivery_fee": 55.00, "platform_fee": 10.00, "total_payable": 585.00 }, "payment_gateway": { "provider": "ESEWA", "redirect_url": "https://epay.esewa.com.np/api/epay/main/v2/form", "payload": { 

"amt": 500.00, "pdc": 55.00, "psc": 20.00, "txAmt": 0, "tAmt": 585.00, "pid": "ORD-20260902-1082" } } } } 

#### **3. Payment Verification Endpoints** 

###### **3.1 Verify Payment Callback** 

Endpoint targeted by frontend redirect or payment webhooks to verify signature and mark order paid. 

● **Endpoint:** POST /payments/verify 

###### **Request Payload (eSewa / Khalti Token)** 

JSON { "order_id": "a901f412-8812-411f-b123-019283746511", "gateway": "ESEWA", "verification_payload": { "oid": "ORD-20260902-1082", "amt": 585.00, "refId": "0003021A938" } } 

###### **Response ( 200 OK )** 

JSON 

{ 

"success": true, 

"message": "Payment verified successfully. Order routed to kitchen.", "data": { 

"order_id": "a901f412-8812-411f-b123-019283746511", 

"payment_status": "PAID", 

"order_status": "PLACED" 

} 

} 

#### **4. Restaurant Admin Endpoints** 

###### **4.1 Update Order Status (Kitchen Acceptance/Rejection)** 

Allows kitchen staff to accept, set preparation times, or reject orders. 

- **Endpoint:** PATCH /restaurant/orders/:order_id/status 

- **Headers:** Authorization: Bearer <RESTAURANT_STAFF_JWT> 

###### **Request Payload (Acceptance)** 

JSON 

{ 

"status": "ACCEPTED", "prep_time_minutes": 30 

} 

###### **Request Payload (Rejection)** 

JSON { "status": "CANCELLED", "rejection_reason": "OUT_OF_STOCK" } 

**Response ( 200 OK )** JSON { "success": true, "data": { "order_id": "a901f412-8812-411f-b123-019283746511", "status": "ACCEPTED", "estimated_ready_at": "2026-09-02T13:00:00Z" } } 

###### **4.2 Quick Inventory Toggle** 

Enables kitchen staff to toggle dynamic item availability. 

- **Endpoint:** PATCH /restaurant/menu/items/:item_id/availability 

- **Headers:** Authorization: Bearer <RESTAURANT_STAFF_JWT> 

###### **Request Payload** 

JSON { 

"is_available": false, 

"duration": "EOD" // End of day reset flag } 

###### **Response ( 200 OK )** 

JSON { "success": true, "data": { "item_id": "e81d1822-4212-42bb-a320-11234bc50123", "is_available": false } } 

#### **5. Dispatch & Admin Endpoints** 

###### **5.1 Assign Driver to Order** 

Manually dispatches an order to a driver. 

- **Endpoint:** POST /admin/dispatch/assign 

- **Headers:** Authorization: Bearer <SUPER_ADMIN_JWT> 

###### **Request Payload** 

JSON { "order_id": "a901f412-8812-411f-b123-019283746511", "driver_id": "f821d100-3001-4991-b110-827361920381" } 

###### **Response ( 200 OK )** 

JSON { 

"success": true, 

"data": { 

"order_id": "a901f412-8812-411f-b123-019283746511", 

"driver_id": "f821d100-3001-4991-b110-827361920381", "status": "DISPATCHED" 

} } 

#### **6. Summary of Engineering Documentation Completed** 

We have now written all primary execution documents: 

1. **Document 1:** Product Requirement Document (PRD) — Customer, Restaurant, Admin 

2. **Document 2:** User Flow Diagrams & Real-Time Order State Machine 

3. **Document 3:** System Architecture, Tech Stack Selection, and Database Schema (ERD) 

4. **Document 4:** API Specification & Endpoint Map 

