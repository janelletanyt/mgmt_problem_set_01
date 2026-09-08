# PROMPTS.md - [GEEK AI]
- **Student:** [Janelle Tan] **Course:** MGMT 6110 **Problem Set 1**
- **User sentence** An enterprise seller or buyer opens this screen to list his agentic AI solution, and knows it worked when the AI concierge leads him to the marketplace. 
- **Live link** mgmt-problem-set-01.vercel.app

--

## Prompt 1 - The master prompt
```
ROLE: You are a senior front-end developer building a React web app.

GOAL: Build the front end of [GEEK AI] on the phone, an online marketplace for potential businesses who wants to use agentic AI in their workflow. They can use the marketplace as either an enterprise seller who wants to sell their agentic AI solutions, or - a customer who wants to adopt the seller’s agent. 

 1) [SCREEN 1]: Opens up to a chatbot to guide whether the user is either an enterprise seller or buyer who wants to adopt agentic AI. 
The chatbot should ask what AI software the business wants to sell, buy or explore. 
It should leave open ended questions on the purposes of the user exploring the marketplace and what role, industry or sector they are interested in. 
It should allow input for what problems the business currently faces and how they would like to solve it. 

 2) [SCREEN 2]: Opens up to a marketplace which reflects the following: 
What AI software or hardware the business is selling
how many years it has been functioning for and where is it based
it should also display recent clients or highlight well-known clients
Display any certification it has obtained
Pricing model (subscription / one-time fee)
Call to action for chat now / contact us / request a demo / watch a demo

 3) [SCREEN 3]: Opens up to a section that allows exploration by different business industries who are not sure what they require but wants to look at possible solutions. 
Customers will be able to filter by keyword search
Sort by industry or category
Sort by role of user 

*Make sure that each screen can be moved without needing to reload the page. That it can be interacted with and filter, sort, open tabs, with a form that updates what is shown and a toggle that is remembered.

OUTPUT: A running app. Keep every invented value in ONE data file of its own, with
 at least [10] rows, so the screen looks real. One component per screen or section.
 Move between screens without reloading the page. Readable on a phone at arm's
 length. When you are done, list the files you created and what each one holds.

GUARDRAILS: Screens and invented data only. Do NOT call the Gemini API or any
 other model. Do NOT call any outside service or fetch from any URL. No database,
 no login, no user accounts, no analytics. No features I did not list. No real
 company's name, logo, or trademark. Invented names and numbers only, nothing
 confidential.

CONTEXT: Individual Problem Set 1 for MGMT 6110 Human-AI Collaboration at SMU.
 Built in Google AI Studio, shared as a link, and opened on a phone by classmates
 in Week 3. I am not a programmer: when you make a choice I did not specify, say
 so in one line rather than burying it.
```

**What came back:** A running app, 8 files, preview loaded. 
It also added an annual -15% discount in the marketplace which I never asked for

## Prompt 2 - removing items I did not ask for
```
Some information that I did not ask for: 
In screen 1. Chatbot Guide
- Remove desktop toggle. The app is only meant for phone view 
- Remove Step 1 of 3. Intent & Needs profiling

In screen 2. Marketplace
- Remove monthly/annual toggle. I only want 1 fixed fee. 
- Remove detailed/compact toggle. I only want the detailed mode

In screen 3. Explore
- Make the dropdown menu swipeable. If the user does not intend to use it, they should be able to swipe away the dropdown menu so that it does not block the entire page view.
```

