import json
from datetime import datetime, timezone
from pathlib import Path

import feedparser
import requests

GITHUB_TRENDING_URL = "https://api.github.com/search/repositories?q=topic:ai&sort=stars&order=desc&per_page=5"
OPENAI_RSS = "https://openai.com/news/rss.xml"
HUGGINGFACE_MODELS_URL = "https://huggingface.co/api/models?sort=downloads&limit=5"


def detect_narratives(text: str):
    text = (text or "").lower()

    keyword_map = {
        "agents": ["agent", "agents", "autonomous", "multi-agent"],
        "reasoning": ["reasoning", "reason", "chain-of-thought"],
        "rag": ["rag", "retrieval", "vector database", "retrieval-augmented"],
        "copilots": ["copilot", "assistant", "workflow assistant"],
        "open-source": ["open-source", "open source", "oss"],
        "infrastructure": ["gpu", "cluster", "inference", "training", "deployment"],
        "inference_cost": ["latency", "distillation", "compression", "efficiency", "quantization"],
    }

    matched = []

    for narrative, keywords in keyword_map.items():
        if any(keyword in text for keyword in keywords):
            matched.append(narrative)

    return matched


def fetch_github_ai_repos():
    response = requests.get(GITHUB_TRENDING_URL, timeout=30)
    response.raise_for_status()

    data = response.json()
    events = []

    for repo in data.get("items", [])[:5]:
        summary = repo.get("description") or "AI repository gaining attention."
        combined_text = f"{repo.get('name', '')} {summary}"

        events.append(
            {
                "source": "GitHub",
                "category": "developer_ecosystem",
                "title": repo.get("name", "Unknown repository"),
                "url": repo.get("html_url", ""),
                "published_at": datetime.now(timezone.utc).isoformat(),
                "summary": summary,
                "signal_type": "developer_velocity",
                "importance_score": repo.get("stargazers_count", 0),
                "theme_tags": ["open-source", "ai", "developer"],
                "narratives": detect_narratives(combined_text),
            }
        )

    return events


def fetch_openai_blog():
    feed = feedparser.parse(OPENAI_RSS)
    events = []

    for entry in feed.entries[:5]:
        summary = getattr(entry, "summary", "")[:200] or "OpenAI update."
        combined_text = f"{getattr(entry, 'title', '')} {summary}"

        events.append(
            {
                "source": "OpenAI",
                "category": "core_tech",
                "title": getattr(entry, "title", "OpenAI update"),
                "url": getattr(entry, "link", ""),
                "published_at": getattr(entry, "published", datetime.now(timezone.utc).isoformat()),
                "summary": summary,
                "signal_type": "model_capability",
                "importance_score": 8,
                "theme_tags": ["models", "research", "capability"],
                "narratives": detect_narratives(combined_text),
            }
        )

    return events


def fetch_huggingface_models():
    response = requests.get(HUGGINGFACE_MODELS_URL, timeout=30)
    response.raise_for_status()

    data = response.json()
    events = []

    for model in data[:5]:
        model_id = model.get("id", "unknown-model")
        downloads = model.get("downloads", 0)
        summary = f"Trending model with {downloads} downloads."
        combined_text = f"{model_id} {summary}"

        events.append(
            {
                "source": "HuggingFace",
                "category": "model_ecosystem",
                "title": model_id,
                "url": f"https://huggingface.co/{model_id}",
                "published_at": datetime.now(timezone.utc).isoformat(),
                "summary": summary,
                "signal_type": "model_capability",
                "importance_score": downloads,
                "theme_tags": ["models", "open-source", "ml"],
                "narratives": detect_narratives(combined_text),
            }
        )

    return events


def main():
    repo_root = Path(__file__).resolve().parent.parent
    data_dir = repo_root / "data"
    data_dir.mkdir(exist_ok=True)

    events_path = data_dir / "events.json"

    events = []
    events.extend(fetch_github_ai_repos())
    events.extend(fetch_openai_blog())
    events.extend(fetch_huggingface_models())

    with open(events_path, "w", encoding="utf-8") as f:
        json.dump(events, f, indent=2, ensure_ascii=False)

    print(f"Wrote {len(events)} signals to {events_path}")


if __name__ == "__main__":
    main()
