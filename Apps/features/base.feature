Feature: Home Feature
    Scenario: The component renders and a random word is fetched
        Given The user is on the Home page
        When The user inputs a word and submits it
        Then the definition of the word is fetched and displayed
        And clicking on the definition takes the user to the Details page for that word

