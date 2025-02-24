import pandas as pd
import numpy as np
from typing import List, Dict

class TicketAnalysisHelper:
    def __init__(self):
        self.main_data = pd.DataFrame()

    def load_main_data(self, data: List[Dict]):
        self.main_data = pd.DataFrame(data)

    def get_event_by_id(self, event_id: int) -> Dict:
        event = self.main_data[self.main_data['event_id'] == event_id]
        return event.iloc[0].to_dict() if not event.empty else None

    def analyze_price_trends(self, event_category: str = None) -> Dict:
        if event_category:
            data = self.main_data[self.main_data['category'] == event_category]
        else:
            data = self.main_data

        trends = {
            'avg_price_increase': [],
            'best_resale_timeframe': [],
            'price_volatility': [],
            'risk_score': []
        }

        for _, event in data.iterrows():
            price_increases = [
                (resale - event['original_price']) / (event['original_price'] + 1e-6) * 100
                for resale in event['resale_prices']
            ]
            trends['avg_price_increase'].append(np.mean(price_increases))

            max_price_idx = np.argmax(event['resale_prices'])
            days_to_best = (pd.to_datetime(event['dates'][max_price_idx]) - pd.to_datetime(event['dates'][0])).days
            trends['best_resale_timeframe'].append(days_to_best)

            avg_resale = np.mean(event['resale_prices']) + 1e-6
            volatility = np.std(event['resale_prices']) / avg_resale
            trends['price_volatility'].append(volatility)

            max_price_increase = max(price_increases) if price_increases else 0
            risk_score = min(100, volatility * 50 + (1 - (max_price_increase / 200)) * 50)
            trends['risk_score'].append(risk_score)

        results = {
            'avg_price_increase': np.mean(trends['avg_price_increase']),
            'typical_best_resale_time': np.median(trends['best_resale_timeframe']),
            'avg_volatility': np.mean(trends['price_volatility']),
            'avg_risk_score': np.mean(trends['risk_score'])
        }
        return results

    def get_investment_recommendation(self, event_id: int) -> Dict:
        event_data = self.get_event_by_id(event_id)
        if not event_data:
            return {"error": f"Event with ID {event_id} not found."}

        similar_events = self._find_similar_events(event_data)
        trends = self.analyze_price_trends(event_data['category'])

        expected_roi = self._calculate_expected_roi(event_data['current_price'], similar_events, trends)
        risk_level = self._assess_risk(similar_events, trends)
        holding_period = self._recommend_holding_period(similar_events, trends)
        recommendation = self._generate_recommendation(expected_roi, risk_level)

        result = {
            'event_name': event_data['event_name'],
            'recommendation': recommendation,
            'expected_roi': round(expected_roi, 2),
            'risk_level': risk_level,
            'suggested_holding_period': f"Till {holding_period}",
            'confidence_score': self._calculate_confidence(similar_events)
        }
        return result

    def _find_similar_events(self, event_data: Dict) -> pd.DataFrame:
        return self.main_data[
            (self.main_data['category'] == event_data['category']) &
            (self.main_data['venue'] == event_data['venue'])
        ]

    def _calculate_expected_roi(self, current_price: float, similar_events: pd.DataFrame, trends: Dict) -> float:
        if similar_events.empty:
            return trends['avg_price_increase']

        similar_rois = [
            (max(event['resale_prices']) - event['original_price']) / (event['original_price'] + 1e-6) * 100
            for _, event in similar_events.iterrows()
        ]
        return np.mean(similar_rois) if similar_rois else trends['avg_price_increase']

    def _assess_risk(self, similar_events: pd.DataFrame, trends: Dict) -> str:
        if similar_events.empty:
            risk_score = trends['avg_risk_score']
        else:
            risk_scores = [
                np.std(event['resale_prices']) / (np.mean(event['resale_prices']) + 1e-6) * 100
                for _, event in similar_events.iterrows()
            ]
            risk_score = np.mean(risk_scores)

        if risk_score < 30:
            return 'Low'
        elif risk_score < 70:
            return 'Medium'
        else:
            return 'High'

    def _recommend_holding_period(self, similar_events: pd.DataFrame, trends: Dict) -> str:
        if similar_events.empty:
            days = trends['typical_best_resale_time']
        else:
            days = np.median([
                (pd.to_datetime(event['dates'][-1]) - pd.to_datetime(event['dates'][0])).days
                for _, event in similar_events.iterrows()
            ])
        return f"{int(days)} days before event"

    def _calculate_confidence(self, similar_events: pd.DataFrame) -> int:
        return min(95, 50 + len(similar_events) * 5)

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
    {"event_id": 1, "event_name": "Rock Concert A", "original_price": 100, "current_price": 130, "resale_prices": [120, 150, 200, 180], "dates": ["2024-01-01", "2024-01-05", "2024-01-10", "2024-01-15"], "venue": "Stadium X", "category": "Concert"},
    {"event_id": 2, "event_name": "Football Match B", "original_price": 80, "current_price": 95, "resale_prices": [90, 100, 95, 110], "dates": ["2024-02-01", "2024-02-05", "2024-02-08", "2024-02-12"], "venue": "Arena Y", "category": "Sports"},
    {"event_id": 3, "event_name": "Jazz Night C", "original_price": 60, "current_price": 70, "resale_prices": [65, 75, 85, 90], "dates": ["2024-03-01", "2024-03-04", "2024-03-08", "2024-03-12"], "venue": "Theater Z", "category": "Music"},
    {"event_id": 4, "event_name": "Tech Conference D", "original_price": 150, "current_price": 170, "resale_prices": [160, 180, 200, 220], "dates": ["2024-04-10", "2024-04-15", "2024-04-20", "2024-04-25"], "venue": "Expo Center", "category": "Conference"},
    {"event_id": 5, "event_name": "Basketball Finals E", "original_price": 120, "current_price": 140, "resale_prices": [130, 145, 160, 175], "dates": ["2024-05-05", "2024-05-10", "2024-05-15", "2024-05-20"], "venue": "Sports Arena", "category": "Sports"},
    {"event_id": 6, "event_name": "Opera Show F", "original_price": 90, "current_price": 110, "resale_prices": [95, 105, 120, 130], "dates": ["2024-06-01", "2024-06-05", "2024-06-10", "2024-06-15"], "venue": "Grand Theater", "category": "Theater"},
    {"event_id": 7, "event_name": "Music Festival G", "original_price": 75, "current_price": 95, "resale_prices": [80, 100, 120, 140], "dates": ["2024-07-10", "2024-07-15", "2024-07-20", "2024-07-25"], "venue": "Open Grounds", "category": "Concert"},
    {"event_id": 8, "event_name": "Esports Tournament H", "original_price": 50, "current_price": 65, "resale_prices": [55, 60, 75, 85], "dates": ["2024-08-05", "2024-08-10", "2024-08-15", "2024-08-20"], "venue": "Gaming Arena", "category": "Esports"},
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
