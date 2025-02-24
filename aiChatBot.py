import pandas as pd
import numpy as np
from typing import List, Dict
from sklearn.linear_model import LinearRegression

class TicketAnalysisHelper:
    def __init__(self):
        self.main_data = pd.DataFrame()
        self.model = LinearRegression()
        self._train_model()

    def load_main_data(self, data: List[Dict]):
        self.main_data = pd.DataFrame(data)
        self._train_model()

    def get_event_by_id(self, event_id: int) -> Dict:
        event = self.main_data[self.main_data['event_id'] == event_id]
        return event.iloc[0].to_dict() if not event.empty else None

    def _train_model(self):
        if self.main_data.empty:
            return
        
        X = []
        y = []
        
        for _, event in self.main_data.iterrows():
            X.append([event['original_price'], np.std(event['resale_prices'])])
            y.append(max(event['resale_prices']))
        
        X = np.array(X)
        y = np.array(y)
        
        if len(X) > 1:
            self.model.fit(X, y)
    
    def _predict_roi(self, event_data: Dict) -> float:
        X_new = np.array([[event_data['original_price'], np.std(event_data['resale_prices'])]])
        predicted_max_price = self.model.predict(X_new)[0]
        return ((predicted_max_price - event_data['original_price']) / event_data['original_price']) * 100
    
    def get_investment_recommendation(self, event_id: int) -> Dict:
        event_data = self.get_event_by_id(event_id)
        if not event_data:
            return {"error": f"Event with ID {event_id} not found."}

        predicted_roi = self._predict_roi(event_data)
        risk_level = "Low" if predicted_roi > 50 else "Medium" if predicted_roi > 20 else "High"
        recommendation = self._generate_recommendation(predicted_roi, risk_level)

        result = {
            'event_name': event_data['event_name'],
            'recommendation': recommendation,
            'expected_roi': round(predicted_roi, 2),
            'risk_level': risk_level,
            'confidence_score': round(min(100, max(30, abs(predicted_roi))), 2)
        }
        return result

    def _generate_recommendation(self, expected_roi: float, risk_level: str) -> str:
        if expected_roi > 50 and risk_level == 'Low':
            return 'Strong Buy'
        elif expected_roi > 30 and risk_level != 'High':
            return 'Buy'
        elif expected_roi > 15 and risk_level == 'Low':
            return 'Moderate Buy'
        elif expected_roi < 0:
            return 'Avoid'
        else:
            return 'Hold'

# Dummy Data (8 Events)
dummy_data = [
    {"event_id": 1, "event_name": "Rock Concert A", "original_price": 100, "current_price": 130, "resale_prices": [120, 150, 200, 180]},
    {"event_id": 2, "event_name": "Football Match B", "original_price": 80, "current_price": 95, "resale_prices": [90, 100, 95, 110]},
    {"event_id": 3, "event_name": "Jazz Night C", "original_price": 60, "current_price": 70, "resale_prices": [65, 75, 85, 90]},
    {"event_id": 4, "event_name": "Tech Conference D", "original_price": 150, "current_price": 170, "resale_prices": [160, 180, 200, 220]},
    {"event_id": 5, "event_name": "Basketball Finals E", "original_price": 120, "current_price": 140, "resale_prices": [130, 145, 160, 175]},
    {"event_id": 6, "event_name": "Opera Show F", "original_price": 90, "current_price": 110, "resale_prices": [95, 105, 120, 130]},
    {"event_id": 7, "event_name": "Music Festival G", "original_price": 75, "current_price": 95, "resale_prices": [80, 100, 120, 140]},
    {"event_id": 8, "event_name": "Esports Tournament H", "original_price": 50, "current_price": 65, "resale_prices": [55, 60, 75, 85]},
]

# Initialize Bot
ticket_helper = TicketAnalysisHelper()
ticket_helper.load_main_data(dummy_data)

# Chatbot Loop
while True:
    event_id = input("Enter Event ID (or 'exit' to quit): ")
    if event_id.lower() == 'exit':
        print("Goodbye!")
        break
    if not event_id.isdigit():
        print("Invalid input. Please enter a valid Event ID.")
        continue

    event_id = int(event_id)
    result = ticket_helper.get_investment_recommendation(event_id)

    if "error" in result:
        print(result["error"])
    else:
        print("\n💡 Investment Recommendation:")
        for key, value in result.items():
            print(f"{key.replace('_', ' ').title()}: {value}")
    print("\n")
