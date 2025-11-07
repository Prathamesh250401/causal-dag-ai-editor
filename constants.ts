import { DagResponse } from './types';

export const INITIAL_DAG_DATA: DagResponse = {
    "data": {
        "generationStatus": "SUCCESS",
        "nodes": [
            {
                "name": "meta_spend",
                "type": "Spend",
                "metadata": "{\"platform\": \"meta\"}"
            },
            {
                "name": "Intercept",
                "type": "Baseline",
                "metadata": "{\"platform\": \"null\"}"
            },
            {
                "name": "google_spend",
                "type": "Spend",
                "metadata": "{\"platform\": \"google\"}"
            },
            {
                "name": "Revenue",
                "type": "KPI",
                "metadata": "{\"platform\": \"null\"}"
            },
            {
                "name": "tiktok_spend",
                "type": "Spend",
                "metadata": "{\"platform\": \"tiktok\"}"
            },
            {
                "name": "branded_search_volume",
                "type": "Contextual",
                "metadata": "{\"platform\": \"null\"}"
            }
        ],
        "edges": [
            {
                "sourceNode": {
                    "name": "Intercept",
                    "type": "Baseline",
                    "metadata": "{\"platform\": \"null\"}"
                },
                "targetNode": {
                    "name": "Revenue",
                    "type": "KPI",
                    "metadata": "{\"platform\": \"null\"}"
                },
                "weight": 1.0,
                "type": "Potential (Direct)"
            },
            {
                "sourceNode": {
                    "name": "meta_spend",
                    "type": "Spend",
                    "metadata": "{\"platform\": \"meta\"}"
                },
                "targetNode": {
                    "name": "Revenue",
                    "type": "KPI",
                    "metadata": "{\"platform\": \"null\"}"
                },
                "weight": 1.0,
                "type": "Potential (Direct)"
            },
            {
                "sourceNode": {
                    "name": "google_spend",
                    "type": "Spend",
                    "metadata": "{\"platform\": \"google\"}"
                },
                "targetNode": {
                    "name": "Revenue",
                    "type": "KPI",
                    "metadata": "{\"platform\": \"null\"}"
                },
                "weight": 1.0,
                "type": "Potential (Direct)"
            },
            {
                "sourceNode": {
                    "name": "tiktok_spend",
                    "type": "Spend",
                    "metadata": "{\"platform\": \"tiktok\"}"
                },
                "targetNode": {
                    "name": "branded_search_volume",
                    "type": "Contextual",
                    "metadata": "{\"platform\": \"null\"}"
                },
                "weight": 1.0,
                "type": "Potential (Direct)"
            }
        ]
    },
    "success": true,
    "errors": []
};
