import json
import requests
import feedparser
from datetime import datetime, timezone
from pathlib import Path

GITHUB_TRENDING_URL = "https://api.github.com/search/repositories?q=topic:ai&sort=stars&order=desc&per_page=5"
OPENAI_RSS = "https://openai.com/blog/rss/"


def fetch_github_ai_repos():
    response = requests.get(GITHUB_TRENDING_URL)
    response.raise_for_status()

    data = response.json()
    events = []

    for repo in data["items"][:5]:
        events.append({
            "source": "GitHub",
            "category": "developer_ecosystem",
            "title": repo["name"],
            "url": repo["html_url"],
            "published_at": datetime.now(timezone.utc).isoformat(),
            "summary": repo["description"] or "AI repository gaining attention.",
            "signal_type": "developer_velocity",
            "importance_score": repo["stargazers_count"],
            "theme_tags": ["open-source", "ai", "developer"]
        })

    return events


def fetch_openai_blog():
    feed = feedparser.parse(OPENAI_RSS)

    events = []

    for entry in feed.entries[:5]:
        events.append({
            "source": "OpenAI",
            "category": "core_tech",
            "title": entry.title,
            "url": entry.link,
            "published_at": entry.published,
            "summary": entry.summary[:200],
            "signal_type": "model_capability",
            "importance_score": 8,
            "theme_tags": ["models", "research", "capability"]
        })

    return events


def main():
    repo_root = Path(__file__).resolve().parent.parent
    data_dir = repo_root / "data"
    data_dir.mkdir(exist_ok=True)

    events_path = data_dir / "events.json"

    events = []

    events.extend(fetch_github_ai_repos())
    events.extend(fetch_openai_blog())

    with open(events_path, "w", encoding="utf-8") as f:
        json.dump(events, f, indent=2)

    print(f"Wrote {len(events)} signals")


if __name__ == "__main__":
    main()
