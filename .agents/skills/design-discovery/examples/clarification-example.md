# Example Discovery Interaction (`clarification-example.md`)

## Input Prompt
> User: "Make a dashboard for managing orders."

## Agent Discovery Assessment
- `business_goal`: MISSING (Why manage orders? Reduce latency? Cancel orders?)
- `primary_user`: MISSING (Warehouse operator? Support agent? Customer?)
- `primary_flow`: MISSING (Filter orders? Edit line items? Refund?)
- `constraints`: MISSING (Desktop vs mobile? Mass actions?)
- `approval_criteria`: MISSING (Who reviews?)

## Agent Refusal & Asking-Back Action
The agent stops, refuses to generate HTML, and asks:

1. What specific problem does this Order Management Dashboard solve for the business (e.g. reduce order processing time from 5 mins to 1 min)?
2. Who is the primary persona using this interface (e.g. Back-office Logistics Admin vs Customer Support Agent)?
3. What is the single most important user flow (e.g. Search order by ID → View status → Process bulk refund)?
4. Are there any critical business rules or constraints (e.g. Orders over $1,000 require manager approval)?
5. What platform and density preference do you have (e.g. High-density desktop table view)?
