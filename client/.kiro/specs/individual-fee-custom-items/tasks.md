# Implementation Plan: Individual Fee Custom Items

## Overview

Extend the `IndividualAssignment.tsx` wizard's "Fee & Period" step to support ad-hoc custom fee line items. The work is scoped to two files: `IndividualAssignment.tsx` (state, inline form, list, updated handlers) and `AssignmentPreview.tsx` (custom items section + grand total). No new API endpoints or files are required.

## Tasks

- [x] 1. Add state variables and hook for custom fee items
  - Import `useGetAllFeeCategories` from `@/server-action/api/account-category.api`
  - Add `useGetAllFeeCategories` call alongside the existing `useGetAllFeeHeads` call
  - Define the `CustomFeeItem` interface locally in `IndividualAssignment.tsx`
  - Add state variables: `customFeeItems`, `customCategoryId`, `customFeeHeadId`, `customAmount`, `customDescription`, `customAmountError`
  - Add `filteredFeeHeads` useMemo (filter `feeHeads` by `customCategoryId`)
  - Add `canAddCustomItem` derived boolean (`customFeeHeadId` non-empty AND `customAmount` > 0)
  - Add `customItemsTotal` useMemo and `grandTotal` derived value
  - _Requirements: 1.1, 2.1, 3.1_

- [x] 2. Update `tabDone`, `tabEnabled`, and `canAssign` logic
  - Change `tabDone.details` to: `!!(academicYear && month && (selectedStructureIds.length > 0 || customFeeItems.length > 0))`
  - Change `tabEnabled.remarks` to: `!!(academicYear && month && (selectedStructureIds.length > 0 || customFeeItems.length > 0))`
  - Change `canAssign` to: `selectedStudentId && academicYear && month && (selectedStructureIds.length > 0 || customFeeItems.length > 0)`
  - _Requirements: 8.1, 8.2, 8.3_

  - [ ]* 2.1 Write property test for proceed condition (Property 11)
    - **Property 11: Proceed condition accepts either structures or custom items**
    - Generate random `(selectedStructureIds, customFeeItems, academicYear, month)` combinations and assert the proceed condition is enabled if and only if year + month are set AND at least one of the two lists is non-empty
    - **Validates: Requirements 8.1, 8.2, 8.3**

- [x] 3. Implement `handleAddCustomItem` and update `handleReset`
  - Add `handleAddCustomItem` function with amount validation (empty → "Amount is required"; ≤ 0 → "Amount must be greater than 0")
  - On valid add: look up `feeHeadName` and `feeCategoryName` at add-time, append to `customFeeItems`, reset all four form fields and `customAmountError`
  - Update `handleReset` to also clear `customFeeItems`, `customCategoryId`, `customFeeHeadId`, `customAmount`, `customDescription`, `customAmountError`
  - _Requirements: 3.3, 3.4, 5.2, 5.3, 9.1, 9.2_

  - [ ]* 3.1 Write property test for amount validation (Property 3)
    - **Property 3: Amount validation rejects non-positive values**
    - Generate random numbers (positive, zero, negative, fractional); assert that values ≤ 0 produce a validation error and values > 0 are accepted
    - **Validates: Requirements 3.2, 3.3, 3.4**

  - [ ]* 3.2 Write property test for add-then-list shape (Property 5)
    - **Property 5: Adding an item appends to the list with correct shape**
    - Generate random valid items; assert list grows by exactly 1 and the new entry has the correct `feeHeadId`, `amount`, and `description`
    - **Validates: Requirements 5.2, 7.3**

  - [ ]* 3.3 Write property test for form reset after add (Property 6)
    - **Property 6: Successful add resets the form**
    - Generate random valid items; assert all four form fields are empty strings after a successful add
    - **Validates: Requirements 5.3**

  - [ ]* 3.4 Write property test for reset clears all custom state (Property 10)
    - **Property 10: Reset clears all custom state**
    - Generate random form/list states; assert `customFeeItems` is `[]` and all form fields are `""` after `handleReset`
    - **Validates: Requirements 9.1, 9.2**

- [x] 4. Update `handleAssign` to include custom items in the invoice payload
  - Remove the hardcoded `customItems: []` from the existing payload
  - Map `customFeeItems` to `{ feeHeadId, amount, description }` objects and assign to `payload.customItems`
  - Update the guard clause to allow submission when `customFeeItems.length > 0` even if `selectedStructureIds` is empty
  - _Requirements: 7.1, 7.2, 7.3_

  - [ ]* 4.1 Write property test for payload customItems mapping (Property 9)
    - **Property 9: Invoice payload customItems mirrors the staged list**
    - Generate random staged custom item lists; assert `payload.customItems` contains exactly the same items (by `feeHeadId`, `amount`, `description`) in the same order with no extra fields
    - **Validates: Requirements 7.1, 7.2, 7.3**

- [x] 5. Render the Custom Item Form inline inside `renderDetailsPanel`
  - Add a "Custom Fee Items" section heading below the existing fee structures checklist
  - Render the Fee Category `<Select>` populated from `feeCategories`; disable when `isLoadingCategories` is true; show placeholder "No categories available" when list is empty
  - On category change: call `setCustomCategoryId` and reset `setCustomFeeHeadId("")`
  - Render the Fee Head `<Select>` populated from `filteredFeeHeads`; disable when no category is selected; show placeholder "No fee heads available" when `filteredFeeHeads` is empty
  - Render the Amount `<Input type="number">`; show `customAmountError` inline below the field when non-empty; clear error on change
  - Render the Description `<Input>` with `maxLength={255}`; optional
  - Render the "Add" `<Button>` disabled when `!canAddCustomItem`; call `handleAddCustomItem` on click
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3, 3.4, 4.1, 4.2, 4.3, 5.1_

  - [ ]* 5.1 Write property test for fee head filtering (Property 1)
    - **Property 1: Fee head filtering is exact**
    - Generate random fee head lists and category ids; assert the filtered result contains exactly and only the fee heads whose `feeCategoryId` equals the selected category id
    - **Validates: Requirements 2.2, 2.3**

  - [ ]* 5.2 Write property test for category change resets fee head (Property 2)
    - **Property 2: Category change resets fee head selection**
    - Generate random category selections; assert `customFeeHeadId` is reset to `""` on each category change regardless of previous state
    - **Validates: Requirements 1.4, 2.3**

  - [ ]* 5.3 Write property test for Add button disabled state (Property 4)
    - **Property 4: Add button disabled when required fields missing**
    - Generate random form states with missing or invalid fields; assert `canAddCustomItem` is `false` whenever `customFeeHeadId` is empty OR `customAmount` is empty or ≤ 0
    - **Validates: Requirements 5.1**

- [x] 6. Render the Custom Items List inline inside `renderDetailsPanel`
  - Below the Custom Item Form, render the staged `customFeeItems` list
  - Each row displays: fee head name, fee category name, amount formatted as "Rs. X,XXX", and a remove button (`<X>` icon)
  - Remove button click calls `setCustomFeeItems(prev => prev.filter((_, i) => i !== index))`
  - When `customFeeItems` is empty, render an empty-state message (e.g., "No custom items added yet")
  - _Requirements: 5.4, 6.1, 6.2_

  - [ ]* 6.1 Write property test for remove eliminates exactly the targeted item (Property 8)
    - **Property 8: Remove eliminates exactly the targeted item**
    - Generate random lists and random remove indices; assert the resulting list contains all original items except the one at the given index, preserving order
    - **Validates: Requirements 6.1**

  - [ ]* 6.2 Write property test for list display fields (Property 7)
    - **Property 7: Custom items list renders required display fields**
    - Generate random custom item lists; assert each rendered row includes fee head name, fee category name, formatted amount, and a remove button
    - **Validates: Requirements 5.4**

- [x] 7. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Update `AssignmentPreview` to show custom items and grand total
  - Add optional props `customItems?: { feeHeadName: string; feeCategoryName: string; amount: number }[]` and `grandTotal?: number` to `AssignmentPreviewProps`
  - Render a "Custom Items" section below "Included Structures" when `customItems` is non-empty, using the same card style as existing structure rows
  - Use `grandTotal ?? totalAmount` for the total amount display
  - Pass `customItems` and `grandTotal` from `IndividualAssignment` to `<AssignmentPreview>`
  - _Requirements: 5.4_

- [x] 9. Update the "Continue to Discounts" footer button
  - Change the `nextDisabled` prop on `<PanelFooter>` inside `renderDetailsPanel` to: `!academicYear || !month || (selectedStructureIds.length === 0 && customFeeItems.length === 0)`
  - _Requirements: 8.1, 8.2, 8.3_

- [x] 10. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- All property-based tests should use **fast-check** with a minimum of 100 iterations per property
- Tag each property test with: `Feature: individual-fee-custom-items, Property {N}: {property_text}`
- The Custom Item Form and Custom Items List are rendered **inline** inside `renderDetailsPanel()` — do not extract them as React sub-components, as that would cause input focus loss on every keystroke
- `feeHeadName` and `feeCategoryName` are stored at add-time for display; only `feeHeadId`, `amount`, and `description` are sent in the API payload
