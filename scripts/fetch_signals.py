import json
import requests
from datetime import datetime, timezone
from pathlib import Path


GITHUB_TRENDING_URL = "https://api.github.com/search/repositories?q=topic:ai&sort=stars&order=desc&per_page=5"


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


def main():
    repo_root = Path(__file__).resolve().parent.parent
    data_dir = repo_root / "data"
    data_dir.mkdir(exist_ok=True)

    events_path = data_dir / "events.json"

    events = fetch_github_ai_repos()

    with open(events_path, "w", encoding="utf-8") as f:
        json.dump(events, f, indent=2)

    print(f"Wrote {len(events)} GitHub AI repo signals")


if __name__ == "__main__":
    main()
