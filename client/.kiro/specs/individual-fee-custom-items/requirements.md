# Requirements Document

## Introduction

The Individual Fee Assignment wizard (Step 2: "Fee & Period") currently allows users to select pre-defined fee structures for a student. This feature adds a **Custom Fee Items** section to that step, enabling users to compose ad-hoc fee line items by choosing a Fee Category, a Fee Head (filtered by category), entering an amount, and optionally adding a description. Multiple custom items can be added before submitting. All custom items are sent in the `customItems` array of the invoice generation payload alongside the existing `feeStructureIds`.

## Glossary

- **Custom_Item_Form**: The inline form within the "Fee & Period" step used to build a single custom fee item before adding it to the list.
- **Custom_Items_List**: The ordered collection of custom fee items the user has staged for the current invoice generation request.
- **Fee_Category**: A top-level grouping of fee heads (e.g., "Tuition", "Transport", "Others"), fetched via `useGetAllFeeCategories`.
- **Fee_Head**: A specific fee line item belonging to a Fee Category (e.g., "Monthly Tuition"), fetched via `useGetAllFeeHeads` and filtered client-side by `feeCategoryId`.
- **IndividualAssignment**: The React component at `client/app/dashboard/account/fee-assignment/components/IndividualAssignment.tsx` that renders the 4-step wizard for individual student fee assignment.
- **Invoice_Payload**: The `GenerateMonthlyInvoicePayload` object sent to `useGenerateMonthlyInvoice`, which includes `feeStructureIds` and `customItems`.

---

## Requirements

### Requirement 1: Fee Category Dropdown

**User Story:** As a school administrator, I want to select a Fee Category when adding a custom fee item, so that I can narrow down the relevant fee heads for that item.

#### Acceptance Criteria

1. THE Custom_Item_Form SHALL display a "Fee Category" dropdown populated with all categories returned by `useGetAllFeeCategories`.
2. WHEN `useGetAllFeeCategories` is loading, THE Custom_Item_Form SHALL display the "Fee Category" dropdown in a disabled state.
3. IF `useGetAllFeeCategories` returns an empty list, THEN THE Custom_Item_Form SHALL display the "Fee Category" dropdown with no selectable options and a placeholder of "No categories available".
4. WHEN a Fee Category is selected, THE Custom_Item_Form SHALL reset the currently selected Fee Head to an unselected state.

---

### Requirement 2: Fee Head Dropdown Filtered by Category

**User Story:** As a school administrator, I want the Fee Head dropdown to show only heads belonging to the selected Fee Category, so that I can quickly find the correct fee head without scrolling through unrelated entries.

#### Acceptance Criteria

1. THE Custom_Item_Form SHALL display a "Fee Head" dropdown that is disabled until a Fee Category is selected.
2. WHEN a Fee Category is selected, THE Custom_Item_Form SHALL populate the "Fee Head" dropdown with only the Fee Heads whose `feeCategoryId` matches the selected category's `id`.
3. WHEN a different Fee Category is selected, THE Custom_Item_Form SHALL clear the previously selected Fee Head and repopulate the dropdown with heads for the new category.
4. IF the selected Fee Category has no associated Fee Heads, THEN THE Custom_Item_Form SHALL display the "Fee Head" dropdown with no selectable options and a placeholder of "No fee heads available".

---

### Requirement 3: Amount Input

**User Story:** As a school administrator, I want to enter a monetary amount for each custom fee item, so that the invoice reflects the correct charge for that line item.

#### Acceptance Criteria

1. THE Custom_Item_Form SHALL display an "Amount" numeric input field for every custom item, regardless of the selected Fee Category.
2. THE Custom_Item_Form SHALL accept only positive numeric values greater than 0 in the "Amount" field.
3. IF the user enters a value less than or equal to 0 in the "Amount" field, THEN THE Custom_Item_Form SHALL display an inline validation message "Amount must be greater than 0".
4. WHEN the "Add" button is clicked with an empty "Amount" field, THE Custom_Item_Form SHALL display an inline validation message "Amount is required".

---

### Requirement 4: Optional Description Field

**User Story:** As a school administrator, I want to add an optional description to a custom fee item, so that the invoice contains a human-readable note explaining the charge.

#### Acceptance Criteria

1. THE Custom_Item_Form SHALL display a "Description" text input field that is optional.
2. THE Custom_Item_Form SHALL accept a description of up to 255 characters.
3. WHEN the "Add" button is clicked with an empty "Description" field, THE Custom_Item_Form SHALL add the item without a description (sending an empty string or omitting the field).

---

### Requirement 5: Add Custom Item to List

**User Story:** As a school administrator, I want to add a composed custom fee item to a staging list, so that I can review all custom items before generating the invoice.

#### Acceptance Criteria

1. THE Custom_Item_Form SHALL display an "Add" button that is disabled when either the Fee Head or the Amount field is empty or invalid.
2. WHEN the "Add" button is clicked with a valid Fee Head and a valid Amount, THE IndividualAssignment SHALL append a new entry to the Custom_Items_List containing `feeHeadId`, `amount`, and `description`.
3. WHEN an item is successfully added, THE Custom_Item_Form SHALL reset the Fee Category, Fee Head, Amount, and Description fields to their default (empty) states.
4. THE Custom_Items_List SHALL display each added item showing the Fee Head name, the Fee Category name, the amount formatted as "Rs. X,XXX", and a remove button.

---

### Requirement 6: Remove Custom Item from List

**User Story:** As a school administrator, I want to remove a custom fee item from the staging list, so that I can correct mistakes before generating the invoice.

#### Acceptance Criteria

1. WHEN the remove button for a Custom_Items_List entry is clicked, THE IndividualAssignment SHALL remove that entry from the Custom_Items_List.
2. WHEN the last item is removed from the Custom_Items_List, THE IndividualAssignment SHALL display an empty-state message in place of the list.

---

### Requirement 7: Include Custom Items in Invoice Payload

**User Story:** As a school administrator, I want the custom fee items I have staged to be included in the invoice generation request, so that the backend creates invoice lines for each custom item.

#### Acceptance Criteria

1. WHEN `handleAssign` is invoked, THE IndividualAssignment SHALL include all entries from the Custom_Items_List in the `customItems` field of the Invoice_Payload.
2. WHEN the Custom_Items_List is empty, THE IndividualAssignment SHALL send `customItems` as an empty array in the Invoice_Payload.
3. THE Invoice_Payload `customItems` array SHALL contain objects with the shape `{ feeHeadId: number; amount: number; description: string }` matching the `CustomFeeItemDto` backend contract.

---

### Requirement 8: Wizard Step Completion Condition

**User Story:** As a school administrator, I want the "Fee & Period" step to be completable even when no custom items are added, so that the existing fee-structure-only workflow is not broken.

#### Acceptance Criteria

1. THE IndividualAssignment SHALL allow the user to proceed from the "Fee & Period" step to the "Discounts" step when at least one fee structure is selected, regardless of whether any custom items have been added.
2. THE IndividualAssignment SHALL allow the user to proceed from the "Fee & Period" step to the "Discounts" step when the Custom_Items_List contains at least one item and no fee structures are selected.
3. WHEN neither fee structures nor custom items are selected, THE IndividualAssignment SHALL keep the "Continue to Discounts" button disabled.

---

### Requirement 9: Reset Clears Custom Items

**User Story:** As a school administrator, I want the "Reset all" action to clear the custom items list along with all other form state, so that I start from a clean slate.

#### Acceptance Criteria

1. WHEN the "Reset all" button is clicked, THE IndividualAssignment SHALL clear the Custom_Items_List to an empty array.
2. WHEN the "Reset all" button is clicked, THE Custom_Item_Form SHALL reset all fields (Fee Category, Fee Head, Amount, Description) to their default empty states.
