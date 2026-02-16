#!/usr/bin/env python3
"""
Script to automatically update statistics from Scopus API
"""

import json
import os
from datetime import datetime
import requests
from pathlib import Path

# Your configuration
SCOPUS_API_KEY = os.getenv("SCOPUS_API_KEY")
SCOPUS_AUTHOR_ID = os.getenv("SCOPUS_AUTHOR_ID")

def get_scopus_stats():
    """Fetch statistics from Scopus API"""
    try:
        print("🔍 Scopus Stats Updater")
        print("=" * 50)
        
        # Get ALL publications with citations data
        url = "https://api.elsevier.com/content/search/scopus"
        
        headers = {
            'X-ELS-APIKey': SCOPUS_API_KEY,
            'Accept': 'application/json'
        }
        
        params = {
            'query': f'AU-ID({SCOPUS_AUTHOR_ID})',
            'count': 25,  # API limit for basic tier
            'field': 'dc:title,citedby-count,author'
        }
        
        print(f"📡 Fetching from: {url}")
        print(f"🔎 Query: AU-ID({SCOPUS_AUTHOR_ID})")
        response = requests.get(url, headers=headers, params=params)
        
        print(f"📊 Status code: {response.status_code}")
        
        if response.status_code != 200:
            print(f"❌ Error response: {response.text[:500]}")
        
        response.raise_for_status()
        
        data = response.json()
        
        # Extract results
        search_results = data.get('search-results', {})
        total_results = int(search_results.get('opensearch:totalResults', 0))
        entries = search_results.get('entry', [])
        
        print(f"✅ Found {total_results} publications")
        
        # Calculate total citations and h-index
        citations_list = []
        total_citations = 0
        
        print("\n📄 Publications breakdown:")
        for i, entry in enumerate(entries, 1):
            title = entry.get('dc:title', 'Unknown')[:50]
            cited_count = int(entry.get('citedby-count', 0))
            citations_list.append(cited_count)
            total_citations += cited_count
            print(f"  {i}. {title}... → {cited_count} citations")
        
        # Calculate h-index
        citations_list.sort(reverse=True)
        h_index = 0
        for i, citations in enumerate(citations_list, 1):
            if citations >= i:
                h_index = i
            else:
                break
        
        # Count unique collaborators (simplified - count from author field if available)
        collaborators = set()
        for entry in entries:
            authors = entry.get('author', [])
            if isinstance(authors, list):
                for author in authors:
                    if isinstance(author, dict):
                        author_id = author.get('authid')
                        if author_id and author_id != SCOPUS_AUTHOR_ID:
                            collaborators.add(author_id)
        
        num_collaborators = len(collaborators) if collaborators else 3  # Fallback to manual count
        
        # Find most cited paper
        most_cited_count = max(citations_list) if citations_list else 0
        
        # Build publication details list for later use
        publications_details = []
        for i, entry in enumerate(entries):
            title = entry.get('dc:title', 'Unknown')
            cited_count = int(entry.get('citedby-count', 0))
            publications_details.append({
                'title': title,
                'citations': cited_count
            })
        
        stats = {
            "publications": total_results,
            "citations": total_citations,
            "h_index": h_index,
            "most_cited": most_cited_count,
            "publications_details": publications_details,
            "last_updated": datetime.now().strftime("%Y-%m-%d"),
            "source": "Scopus API (Full Metrics)"
        }
        
        print(f"\n📊 Final Statistics:")
        print(f"✅ Publications: {stats['publications']}")
        print(f"✅ Citations: {stats['citations']}")
        print(f"✅ H-index: {stats['h_index']}")
        print(f"✅ Most Cited: {stats['most_cited']}")
        
        return stats
        
    except requests.exceptions.HTTPError as e:
        print(f"❌ HTTP Error: {e}")
        if e.response.status_code == 401:
            print("⚠️  Authorization failed. Check API key.")
        elif e.response.status_code == 429:
            print("⚠️  Rate limit exceeded.")
        return None
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

def update_stats_file(stats):
    """Update the stats.json file"""
    if stats is None:
        print("No stats to update")
        return
    
    try:
        # Read existing stats
        with open('data/stats.json', 'r') as f:
            current_stats = json.load(f)
        
        # Update with new data
        current_stats.update(stats)
        
        # Write back
        with open('data/stats.json', 'w') as f:
            json.dump(current_stats, f, indent=2)
        
        print("✓ Stats file updated successfully!")
        
    except Exception as e:
        print(f"Error updating stats file: {e}")

def main():
    print("=" * 50)
    print("🔍 Scopus Stats Updater")
    print("=" * 50)
    print(f"✓ API Key: {SCOPUS_API_KEY[:8]}...")
    print(f"✓ Author ID: {SCOPUS_AUTHOR_ID}")
    
    stats = get_scopus_stats()
    
    if stats:
        update_stats_file(stats)
        print("\n✅ Stats successfully updated!")
    else:
        print("\n❌ Failed to fetch stats from Scopus")

if __name__ == "__main__":
    main()
