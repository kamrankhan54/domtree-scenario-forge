Feature: Test user story

  Scenario: Display top subcategories based on recent views
    Given that the system calculates the ranking of subcategories
    When determining the order of subcategories
    Then the ranking should include the number of recent views of products within each subcategory

  Scenario: Display top subcategories based on basket additions
    Given that the system calculates the ranking of subcategories
    When determining the order of subcategories
    Then the ranking should include the number of products added to the basket from within each subcategory

  Scenario: Display top subcategories based on demand
    Given that the system calculates the ranking of subcategories
    When determining the order of subcategories
    Then the ranking should include products demanded most often based on the query (MonotaRO)

  Scenario: Show top subcategories after search
    Given that a user has performed a search via category
    When the search results are displayed
    Then the top subcategories within that parent category should be shown as we do today

  Scenario: AB test current setup of categories
    Given that a user has performed a search via category
    When the search results are displayed
    Then the system should allow AB testing with the current setup of categories

  Scenario: Track sub-category interactions
    Given that a user interacts with subcategories in search results
    When the user adds products to the basket
    Then the system should record sub-category interactions for analytics

  Scenario: Group interactions for boost score
    Given the sub-category interactions are recorded
    When the analytics report is generated
    Then the interactions should be grouped for the category to create a boost score
```

### Summary of Scenarios
- Display top subcategories based on recent views.
- Display top subcategories based on basket additions.
- Display top subcategories based on demand.
- Show top subcategories after search.
- AB test current setup of categories.
- Track sub-category interactions.
- Group interactions for boost score.
