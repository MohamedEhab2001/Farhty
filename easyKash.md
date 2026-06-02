# EasyKash APIs — Full Documentation

> Scraped from https://easykash.gitbook.io/easykash-apis-documentation

---

## Table of Contents

1. [Direct Payment (Hosted)](#1-direct-payment-hosted)
   - [Pay API](#11-pay-api)
   - [Callback Service](#12-callback-service)
   - [Callback Response Verification](#13-callback-response-verification)
   - [Payment Inquiry](#14-payment-inquiry)
2. [Cash API (Cash-only)](#2-cash-api-cash-only)
3. [WordPress WooCommerce Plugin](#3-direct-payment-wordpress-woocommerce-plugin)
4. [Shopify Plugin](#4-direct-payment-shopify-plugin)

---

## 1. Direct Payment (Hosted)

Direct Payment is an API that allows customers to integrate EasyKash's payment methods into their website.

### Prerequisites

1. Feature must be enabled for your EasyKash business account (contact support).
2. Go to [Integration Settings](https://www.easykash.net/seller/cash-api) and retrieve:
   - **API Key** — used for authentication in the initial request.
   - **Callback URL** — URL where transaction details (status, reference number, etc.) will be sent.
   - **HMAC Secret Key** — used to verify callbacks from EasyKash.
3. You must also provide a `redirectUrl` in the initial request — the URL your user will be redirected to after completing the payment flow.

---

### 1.1 Pay API

**Create a Direct Pay Link**

| Property | Value |
|----------|-------|
| Method | `POST` |
| URL | `https://back.easykash.net/api/directpayv1/pay` |

#### Headers

| Name | Type | Required | Description |
|------|------|----------|-------------|
| authorization | String | ✅ | API Key |

#### Request Body

| Name | Type | Required | Description |
|------|------|----------|-------------|
| amount | number | ✅ | **Base** amount in the currency being sent (NOT in EGP). The end user is charged in EGP (amount × exchange rate at time of payment). |
| currency | string | ✅ | One of: `EGP`, `USD`, `SAR`, `EUR`, `GBP`, `QAR`, `AED` |
| paymentOptions | array of numbers | ❌ | Payment options to show (only appear if enabled on your account). See full list below. |
| cashExpiry | number | ❌ | Time in hours before cash payment expires. Default: `3`. |
| name | string | ✅ | Buyer's full name |
| email | string | ✅ | Buyer's email |
| mobile | string | ✅ | Buyer's mobile number |
| redirectUrl | string | ✅ | URL to redirect the buyer back to after payment |
| customerReference | number | ✅ | Your product/order reference number |

#### Payment Options Reference

| Number | Method |
|--------|--------|
| 1 | Cash through AMAN |
| 2 | Credit & Debit Card |
| 3 | Qassatly |
| 4 | Mobile Wallet |
| 5 | Cash Through Fawry |
| 6 | Meeza |
| 8 | 6 Months - NBE Installments |
| 9 | 12 Months - NBE Installments |
| 10 | 18 Months - NBE Installments |
| 17 | ValU |
| 18 | 6 Months - Banque Misr Installments |
| 19 | 12 Months - Banque Misr Installments |
| 20 | 18 Months - Banque Misr Installments |
| 21 | Aman Installments |
| 22 | Souhoula |
| 23 | Contact |
| 24 | Mogo/MidTakseet |
| 25 | Blnk |
| 26 | 6 Months - Multiple Banks Installments |
| 27 | 12 Months - Multiple Banks Installments |
| 28 | 18 Months - Multiple Banks Installments |
| 29 | Halan |
| 31 | Apple Pay |
| 32 | TRU |
| 33 | Klivvr |
| 34 | Forsa |

#### Request Body Example

```json
{
    "amount": 10,
    "currency": "EGP",
    "paymentOptions": [2, 3, 4, 5, 6],
    "cashExpiry": 3,
    "name": "John Doe",
    "email": "JohnDoe@example.com",
    "mobile": "01010101010",
    "redirectUrl": "https://www.yourshop.com/",
    "customerReference": 123
}
```

#### Response (200)

```json
{
    "redirectUrl": "https://www.easykash.net/DirectPayV1/{productCode}"
}
```

> **Important:** Redirect the user to the URL received in the response to proceed with payment.

#### After Payment — Redirect Parameters

After payment, the user is redirected back to your `redirectUrl` with query parameters:

| Parameter | Description |
|-----------|-------------|
| `status` | Payment status: `success`, `pending`, or `failed` |
| `providerRefNum` | Payment provider reference number |
| `customerReference` | The reference you provided |
| `voucher` | Voucher number (only for Aman or Fawry cash payments) |

**Example redirect URL:**
```
https://www.yourshop.com/?status=NEW&providerRefNum=2206290593680&customerReference=721227
```

---

### 1.2 Callback Service

After every successful payment, EasyKash sends an HTTP notification to your configured **Callback URL**.

**Requires:** Callback URL configured in [Integration Settings](https://www.easykash.net/seller/cash-api).

#### Callback Payload (from EasyKash → your server)

```json
{
    "ProductCode": "CHQ4668",
    "PaymentMethod": "Cash Through Fawry",
    "ProductType": "Physical Product",
    "Amount": "50.5",
    "BuyerEmail": "johndoe@domain.com",
    "BuyerMobile": "01010101010",
    "BuyerName": "John Doe",
    "Timestamp": "1626166791",
    "status": "PAID",
    "voucher": "32423432",
    "easykashRef": "3242143421",
    "VoucherData": "test",
    "customerReference": "1232",
    "signatureHash": "0bd9ce502950ffa..."
}
```

#### Field Descriptions

| Field | Description |
|-------|-------------|
| `ProductCode` | Code of the product (last part of product URL, e.g. `CHQ4668`) |
| `PaymentMethod` | Method used: `Cash Through Fawry`, `Cash Through Aman`, `Credit & Debit Card`, `Mobile Wallet`, `Meeza`, `Qassatly`, `Cash Api` |
| `ProductType` | Product type: `Physical Product`, `Invoice`, `Event`, `Quick Payment`, `Quick Cash`, `Subscription`, `Custom Payment`, `Quick Qassatly`, `Fawry Payout`, `Booking` |
| `Amount` | Amount paid |
| `BuyerEmail` | Buyer's email address |
| `BuyerMobile` | Buyer's mobile number |
| `BuyerName` | Buyer's name |
| `Timestamp` | Unix timestamp of callback (e.g. `1626166791`) |
| `status` | Always `"PAID"` for successful callbacks |
| `voucher` | Cash payment voucher number (only for cash methods) |
| `easykashRef` | EasyKash internal reference number |
| `VoucherData` | Title/description of the payment |
| `customerReference` | Your reference if provided |
| `signatureHash` | HMAC signature for verification |

---

### 1.3 Callback Response Verification

Callbacks use **HMAC-SHA512** to verify authenticity and data integrity.

**Requires:** HMAC Secret Key from [Integration Settings](https://www.easykash.net/seller/cash-api).

#### HMAC Calculation Steps

1. Sort the payload fields in this exact order:
   ```
   ProductCode, Amount, ProductType, PaymentMethod, status, easykashRef, customerReference
   ```

2. Concatenate the **values** of those fields into a single string (no separator).

3. Compute `HMAC-SHA512` using your HMAC Secret Key (HEX digest).

4. Compare the result with the `signatureHash` in the payload — if they match, the callback is authentic.

#### Example

**Payload:**
```json
{
  "ProductCode": "EDV4471",
  "Amount": "11.00",
  "ProductType": "Direct Pay",
  "PaymentMethod": "Cash Through Fawry",
  "BuyerName": "mee",
  "BuyerEmail": "test@mail.com",
  "BuyerMobile": "0123456789",
  "status": "PAID",
  "voucher": "",
  "easykashRef": "2911105009",
  "VoucherData": "Direct Pay",
  "customerReference": "TEST11111",
  "signatureHash": "0bd9ce502950ffa358314c170dace42e7ba3e0c776f5a32eb15c3d496bc9c294835036dd90d4f287233b800c9bde2f6591b6b8a1f675b6bfe64fd799da29d1d0"
}
```

**Secret Key:** `da9fe30575517d987762a859842b5631`

**Concatenated String:**
```
EDV447111.00Direct PayCash Through FawryPAID2911105009TEST11111
```

#### Sample Code — JavaScript

```javascript
function verifyCallback(payload, secretKey) {
  const {
    ProductCode, Amount, ProductType, PaymentMethod,
    status, easykashRef, customerReference, signatureHash,
  } = payload;

  const dataToSecure = [
    ProductCode, Amount, ProductType, PaymentMethod,
    status, easykashRef, customerReference,
  ];
  const dataStr = dataToSecure.join('');

  const calculatedSignature = crypto
    .createHmac('sha512', secretKey)
    .update(dataStr)
    .digest('hex');

  return calculatedSignature === signatureHash;
}
```

#### Sample Code — PHP

```php
function verifyCallback($payload, $secretKey) {
    $dataToSecure = [
        $payload->ProductCode,
        $payload->Amount,
        $payload->ProductType,
        $payload->PaymentMethod,
        $payload->status,
        $payload->easykashRef,
        $payload->customerReference,
    ];
    $dataStr = implode('', $dataToSecure);

    $calculatedSignature = hash_hmac('sha512', $dataStr, $secretKey);
    return $calculatedSignature === $payload->signatureHash;
}
```

---

### 1.4 Payment Inquiry

Inquire about the status of a specific transaction.

| Property | Value |
|----------|-------|
| Method | `POST` |
| URL | `https://back.easykash.net/api/cash-api/inquire` |

#### Headers

| Name | Type | Required | Description |
|------|------|----------|-------------|
| authorization | String | ✅ | API Key |

#### Request Body

| Name | Type | Required | Description |
|------|------|----------|-------------|
| customerReference | String | ✅ | Your order/product reference number |

#### Request Example

```json
{
    "customerReference": "111"
}
```

#### Response Fields

| Field | Description |
|-------|-------------|
| `PaymentMethod` | One of: `Cash Through Fawry`, `Cash Through Aman`, `Credit & Debit Card`, `Mobile Wallet`, `Meeza`, `Qassatly`, `Cash Api` |
| `Amount` | Amount paid |
| `BuyerEmail` | Buyer's email |
| `BuyerMobile` | Buyer's mobile |
| `BuyerName` | Buyer's name |
| `status` | `DELIVERED`, `EXPIRED`, `FAILED`, `NEW`, `PAID`, `REFUNDED`, `CANCELED` |
| `voucher` | Cash voucher number (only for cash payment methods) |
| `easykashRef` | EasyKash internal reference number |

#### Response Example

```json
{
    "PaymentMethod": "Cash Through Fawry",
    "Amount": "10.05",
    "BuyerName": "John Doe",
    "BuyerEmail": "JohnDoe@example.com",
    "BuyerMobile": "01010101010",
    "status": "PAID",
    "voucher": "32423432",
    "easykashRef": "1206102054"
}
```

---

## 2. Cash API (Cash-only)

The Cash API allows businesses with existing websites to:

1. **Create cash payments** — two types:
   - **Quick Cash** (`type: in`) — collect cash from customer
   - **Cash Out** (`type: out`) — payout to customer

2. **Receive callback notifications** to confirm pending payments (all payment methods)

### Prerequisites

Same as Direct Payment — feature must be enabled on your EasyKash account. Retrieve from [Integration Settings](https://www.easykash.net/seller/cash-api):

- API Key
- Callback URL
- HMAC Secret Key

> ⚠️ **Note:** The Cash API sub-pages (Create Payment, Callback) share the same callback structure and HMAC verification as described in Section 1.2 and 1.3 above.

---

## 3. Direct Payment (WordPress WooCommerce Plugin)

### Setup Steps

1. Ensure **WooCommerce** is installed on your WordPress site.
2. Install the **Easykash Gateway Plugin**:
   - Go to **Plugins > Add New > Upload Plugin** and upload the plugin file.
3. Go to **WooCommerce > Settings > Payments > Easykash Gateway**.
4. **Enable** the Easykash Gateway.
5. Set a **Title** for the payment label shown at checkout.
6. Set a **Description** for the payment method.
7. Enter your **Live Private Key** (from EasyKash Account > Integration Settings).
8. Copy the **Callback URL** shown in the plugin, then paste it into your EasyKash account under **Integration Settings > Callback URL** and save.

---

## 4. Direct Payment (Shopify Plugin)

### App Configuration (in Shopify)

1. Go to your Shopify admin dashboard.
2. Navigate to **Settings > Apps and Sales Channels > Develop Apps**.
3. Allow custom apps and click **Create an App**.
4. Name it **Easykash Payments** and create it.
5. Go to the **Configuration** tab > **Admin API Configuration**.
6. Scroll to **Orders** and select **Read and Write Orders**.
7. Go to the **API Credentials** tab, **install the app**, then reveal and **save the Access Token** securely.

### EasyKash Setup (in EasyKash account)

1. Go to **Settings > Integration Settings**.
2. Enter your Shopify **Shop Name** and the **Access Token** from the step above.
3. Set the **Callback URL** to:
   ```
   https://back.easykash.net/api/integrations/callback/shopify
   ```
4. Click **Show Script** to copy the script for the next step.
5. Click **Submit** to save.

### Custom Payment Method Setup (in Shopify)

1. Go to **Settings > Payments**.
2. Scroll to **Manual Payment Methods**, click **Add Manual Payment Method > Create Custom Payment Method**.
3. Name it **Easykash Payments** (add a description optionally).
4. Go to **Settings > Checkout**.
5. Make **Shipping Address Phone Number** required.
6. Scroll to **Order Status Page > Additional Scripts** and paste the script provided by EasyKash.
7. Done — EasyKash is now enabled at checkout.

---

## API Summary

| Endpoint | Method | URL | Auth |
|----------|--------|-----|------|
| Create Pay Link | POST | `https://back.easykash.net/api/directpayv1/pay` | API Key (header) |
| Payment Inquiry | POST | `https://back.easykash.net/api/cash-api/inquire` | API Key (header) |
| Shopify Callback | POST (from EasyKash) | `https://back.easykash.net/api/integrations/callback/shopify` | HMAC verified |

---

*Last scraped: June 2026*


API KEY : uyd6jftyve82hzh8
HMAC: a65873fa05224ddacaba5af43dfaf4f0