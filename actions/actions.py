from typing import Any, Text, Dict, List

from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher


# ---------------- LOGIN ACTION ----------------
class ActionLogin(Action):

    def name(self) -> Text:
        return "action_login"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        account = tracker.get_slot("account_number")

        if account:
            dispatcher.utter_message(
                text=f"✅ Login successful! Welcome, account {account}"
            )
        else:
            dispatcher.utter_message(
                text="❌ Please provide a valid account number to login."
            )

        return []


# ---------------- CHECK BALANCE ----------------
class ActionCheckBalance(Action):

    def name(self) -> Text:
        return "action_check_balance"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        account = tracker.get_slot("account_number")

        if account:
            dispatcher.utter_message(
                text=f"💰 Your account ({account}) balance is ₹50,000 (demo data)."
            )
        else:
            dispatcher.utter_message(
                text="⚠️ Please login first to check your balance."
            )

        return []


# ---------------- MONEY TRANSFER ----------------
class ActionTransferMoney(Action):

    def name(self) -> Text:
        return "action_transfer_money"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        account = tracker.get_slot("account_number")
        amount = tracker.get_slot("amount")

        if not account:
            dispatcher.utter_message(text="⚠️ Please login first.")
        elif not amount:
            dispatcher.utter_message(text="Please provide amount to transfer.")
        else:
            dispatcher.utter_message(
                text=f"💸 ₹{amount} transferred successfully from account {account}."
            )

        return []


# ---------------- FIND BRANCH / ATM ----------------
class ActionFindBranch(Action):

    def name(self) -> Text:
        return "action_find_branch"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        city = tracker.get_slot("city")

        if city:
            dispatcher.utter_message(
                text=f"🏦 Nearest branch in {city}: Main Branch, City Center (demo)."
            )
        else:
            dispatcher.utter_message(
                text="📍 Please provide your city to find nearest branch or ATM."
            )

        return []


# ---------------- TRANSACTION HISTORY ----------------
class ActionTransactionHistory(Action):

    def name(self) -> Text:
        return "action_transaction_history"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(
            text="📄 Last 3 transactions:\n"
                 "1. ₹2000 debited\n"
                 "2. ₹5000 credited\n"
                 "3. ₹1000 debited"
        )

        return []


# ---------------- CUSTOM FALLBACK ----------------
class ActionCustomFallback(Action):

    def name(self) -> Text:
        return "action_custom_fallback"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(
            text="🤔 Sorry, I didn't understand that. Can you please rephrase?"
        )

        return []
