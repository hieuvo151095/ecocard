# Allowed Component Families & Usage Rules

## 1. Action Components

### `Button`
* **Variants**: `primary`, `secondary`, `outline`, `ghost`, `danger`.
* **Sizes**: `sm` (28px height, 12px font), `md` (36px height, 14px font), `lg` (44px height, 14px font).
* **States**: `default`, `hover`, `active`, `focus`, `loading`, `disabled`.
* **Rule**: Exactly 1 primary button per visual section or form container.

### `IconButton`
* **Variants**: `ghost`, `outline`.
* **Rule**: Requires explicit `aria-label` and visual tooltip on hover.

---

## 2. Form Input Components

### `TextInput` / `TextArea`
* **Variants**: `default`, `error`, `disabled`, `read-only`.
* **Attributes**: Must include label, helper text or error message, optional required indicator (`*`).

### `Select` / `Combobox`
* **Rule**: Must support searchable filter for options $> 10$.

### `Checkbox` / `RadioGroup` / `Switch`
* **Rule**: Labels must be inline-clickable with clear focus rings (`2px` primary outline).

---

## 3. Data Presentation Components

### `DataTable`
* **Features**: Header sorting, row hover, striped/zebra option, compact vs comfortable density toggle, pagination footer.
* **Row Height**: `36px` (compact), `48px` (default).

### `Card` / `Panel`
* **Variants**: `elevated` (`--shadow-sm`), `bordered` (`1px solid --color-bg-muted`), `flat`.

### `Badge` / `Tag`
* **Variants**: `success`, `warning`, `error`, `info`, `neutral`.
* **Shape**: Pill (`--radius-full`) or rounded (`--radius-sm`).

---

## 4. Feedback & Navigation Components

### `Alert` / `Toast`
* **Variants**: `info`, `success`, `warning`, `error`.
* **Rule**: High contrast status background with matching icon and close trigger.

### `Tabs` / `Breadcrumb` / `NavPill`
* **Rule**: Active tab must have high-visibility primary indicator and ARIA selected attribute.
