# Data Boundary & Privacy Architecture

> [!NOTE]
> **ARCHITECTURAL INTENT**: This document defines the privacy isolation boundary between banking institution systems and the G-Core loyalty ecosystem layer. This specification describes **architectural design intent**, not a formal production compliance or security certification.

---

## 1. Privacy Boundary Overview

G-Core operates on a strict **zero-raw-data disclosure** principle. Personal Identifiable Information (PII), raw account balances, specific transaction histories, and merchant names strictly remain within the partner bank's secure infrastructure boundary.

```
┌───────────────────────────────────────────────────────────────────────────┐
│                          BANK SECURE ENVIRONMENT                          │
│                                                                           │
│  ┌───────────────────────┐         ┌───────────────────────────────────┐  │
│  │   Customer PII        │         │   Bank-Side G-Core Engine         │  │
│  │   - Name, SSN, IBAN   │         │   - Rules-based Classifier        │  │
│  │   - Account Balances  │ ──────> │   - Context Detection (Protected) │  │
│  │   - Raw Txn Log       │         │   - Anti-Gaming Transfer Filter   │  │
│  │   - Merchant Details  │         │   - Behavior Index Computation    │  │
│  └───────────────────────┘         └───────────────────────────────────┘  │
└──────────────────────────────────────────────────┬────────────────────────┘
                                                   │ Derived Pseudonymous Events Only
                                                   │ (G-Pass SHA256, GP Deltas, Reason Codes)
                                                   ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                       G-CORE ECOSYSTEM LAYER                              │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │   G-Core Shared Ledger & G-Market Platform                          │  │
│  │   - Pseudonymous G-Pass (e.g., G-8F3A9C12)                          │  │
│  │   - Accumulated G-Points (GP Balance & Lifetime)                     │  │
│  │   - Tier Status (Member -> Diamond)                                 │  │
│  │   - Marketplace Privilege Claims & Redemptions                      │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Layer Responsibilities

### Layer A: Bank Internal Environment (Private)
* **Data Retained**: Customer name, address, tax ID, account numbers, exact ledger entries, transaction timestamps, raw merchant names, MCC codes, and absolute dollar balances.
* **Access Control**: Governed by bank core banking IAM, Banking Secrecy Acts, and GDPR/local data protection regulations.

### Layer B: Bank-Side G-Core Engine (Private Execution)
* **Execution**: Executes inside the bank's VPC / infrastructure.
* **Tasks**: Runs normalization, categorizes transactions, filters internal transfer gaming attempts, identifies protected healthcare/essential expenses, and calculates the 0–1 Behavior Index.

### Layer C: Derived Event Interface (Egress Pipeline)
* **Data Emitted**:
  1. `g_pass`: Cryptographic SHA-256 hash derivative of Customer ID (`G-HEXSHA256(customerId + salt)`).
  2. `gp_delta`: Integer point adjustments (e.g., `+50 GP` for goal, `+200 GP` for tenure milestone).
  3. `reason_code`: Abstract typed reason codes (e.g., `BUDGET_WITHIN_BASELINE`, `PROTECTED_HEALTHCARE_EXPENSE`).
  4. `tier_index`: Integer tier level (0–4).
* **Data Excluded**: No merchant names, no spending amounts, no category breakdown details, and no PII ever cross this egress boundary.

### Layer D: G-Core Shared Loyalty Network (Public / Cross-Bank)
* **Data Managed**: Pseudonymous G-Pass identity, global GP balance, G-Market reward item availability, and cross-institution tenure tier.
* **Portability**: Enables users to switch or add banking relationships without losing accumulated G-Pass tier status or loyalty point equity.

---

## 3. Cryptographic Identity Generation

The G-Pass is generated deterministically within the bank boundary using:
$$\text{G-Pass} = \text{"G-"} + \text{Truncate}_{10}\left(\text{SHA256}(\text{CustomerID} + \text{Salt})\right)$$

This hash is non-reversible without the bank's private salt, ensuring that the G-Core network cannot correlate a G-Pass to a real-world individual identity.
