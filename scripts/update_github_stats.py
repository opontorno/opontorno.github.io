#!/usr/bin/env python3
"""
Script to automatically update GitHub statistics
Uses GitHub Public API (no authentication required)
"""

import json
import os
from datetime import datetime
import requests
from pathlib import Path
from collections import Counter

# Load environment variables from .env file if it exists
env_file = Path(__file__).parent.parent / '.env'
if env_file.exists():
    with open(env_file) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                key, value = line.split('=', 1)
                os.environ[key] = value

# GitHub username
GITHUB_USERNAME = os.getenv("GITHUB_USERNAME", "opontorno")

def get_featured_projects(repos_data):
    """Get featured projects based on stars and topics"""
    featured = []
    
    # Filter and sort by stars
    sorted_repos = sorted(
        [r for r in repos_data if not r.get('fork', False)],
        key=lambda x: x.get('stargazers_count', 0),
        reverse=True
    )
    
    # Take top 6 repos
    for repo in sorted_repos[:6]:
        project = {
            'name': repo.get('name', ''),
            'description': repo.get('description', 'No description available'),
            'url': repo.get('html_url', ''),
            'stars': repo.get('stargazers_count', 0),
            'forks': repo.get('forks_count', 0),
            'language': repo.get('language', 'Unknown'),
            'topics': repo.get('topics', []),
            'updated_at': repo.get('updated_at', '')
        }
        featured.append(project)
    
    return featured

def get_github_stats():
    """Fetch statistics from GitHub API"""
    try:
        print("🐙 GitHub Stats Updater")
        print("=" * 50)
        print(f"📡 Fetching data for user: {GITHUB_USERNAME}")
        
        # Get user info
        user_url = f"https://api.github.com/users/{GITHUB_USERNAME}"
        user_response = requests.get(user_url)
        user_response.raise_for_status()
        user_data = user_response.json()
        
        # Get repositories
        repos_url = f"https://api.github.com/users/{GITHUB_USERNAME}/repos?per_page=100"
        repos_response = requests.get(repos_url)
        repos_response.raise_for_status()
        repos_data = repos_response.json()
        
        # Calculate statistics
        public_repos = user_data.get('public_repos', 0)
        followers = user_data.get('followers', 0)
        
        # Calculate total stars
        total_stars = sum(repo.get('stargazers_count', 0) for repo in repos_data)
        
        # Calculate total forks
        total_forks = sum(repo.get('forks_count', 0) for repo in repos_data)
        
        # Get languages statistics
        languages = Counter()
        total_bytes = 0
        
        for repo in repos_data:
            if not repo.get('fork', False):  # Skip forked repos
                lang_url = repo.get('languages_url')
                if lang_url:
                    try:
                        lang_response = requests.get(lang_url)
                        if lang_response.status_code == 200:
                            lang_data = lang_response.json()
                            for lang, bytes_count in lang_data.items():
                                languages[lang] += bytes_count
                                total_bytes += bytes_count
                    except:
                        pass
        
        # Get top 5 languages with percentages
        top_languages = []
        for lang, bytes_count in languages.most_common(5):
            percentage = round((bytes_count / total_bytes * 100), 1) if total_bytes > 0 else 0
            top_languages.append({
                'name': lang,
                'percentage': percentage
            })
        
        # Get featured projects
        featured_projects = get_featured_projects(repos_data)
        
        stats = {
            "public_repos": public_repos,
            "total_stars": total_stars,
            "followers": followers,
            "total_forks": total_forks,
            "top_languages": top_languages,
            "featured_projects": featured_projects,
            "last_updated": datetime.now().strftime("%Y-%m-%d"),
            "source": "GitHub API"
        }
        
        print(f"\n📊 GitHub Statistics:")
        print(f"✅ Public Repos: {stats['public_repos']}")
        print(f"✅ Total Stars: {stats['total_stars']}")
        print(f"✅ Followers: {stats['followers']}")
        print(f"✅ Total Forks: {stats['total_forks']}")
        print(f"\n💻 Top Languages:")
        for lang in top_languages:
            print(f"   - {lang['name']}: {lang['percentage']}%")
        print(f"\n🌟 Featured Projects: {len(featured_projects)} projects loaded")
        
        return stats
        
    except requests.exceptions.HTTPError as e:
        print(f"❌ HTTP Error: {e}")
        if e.response.status_code == 404:
            print("⚠️  User not found. Check GITHUB_USERNAME.")
        elif e.response.status_code == 403:
            print("⚠️  Rate limit exceeded. Wait before retrying.")
        return None
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

def update_stats_file(github_stats):
    """Update the stats.json file with GitHub data"""
    if github_stats is None:
        print("No GitHub stats to update")
        return
    
    try:
        stats_file = Path(__file__).parent.parent / 'data' / 'stats.json'
        
        # Read existing stats
        with open(stats_file, 'r') as f:
            current_stats = json.load(f)
        
        # Add GitHub stats under a separate key
        current_stats['github'] = github_stats
        
        # Write back
        with open(stats_file, 'w') as f:
            json.dump(current_stats, f, indent=2)
        
        print("\n✓ Stats file updated successfully!")
        
    except Exception as e:
        print(f"Error updating stats file: {e}")

def main():
    print("=" * 50)
    print("🐙 GitHub Stats Updater")
    print("=" * 50)
    print(f"✓ GitHub Username: {GITHUB_USERNAME}")
    
    stats = get_github_stats()
    
    if stats:
        update_stats_file(stats)
        print("\n✅ GitHub stats successfully updated!")
    else:
        print("\n❌ Failed to fetch GitHub stats")

if __name__ == "__main__":
    main()
