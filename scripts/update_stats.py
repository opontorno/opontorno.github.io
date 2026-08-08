#!/usr/bin/env python3
"""
Script to automatically update statistics from Semantic Scholar API
Can be run locally or via GitHub Actions
"""

import json
import os
from datetime import datetime
import requests
from pathlib import Path
import time

# Load environment variables from .env file if it exists (for local testing)
env_file = Path(__file__).parent.parent / '.env'
if env_file.exists():
    with open(env_file) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                key, value = line.split('=', 1)
                os.environ[key] = value

# Your configuration
SEMANTIC_SCHOLAR_AUTHOR_ID = os.getenv("SEMANTIC_SCHOLAR_AUTHOR_ID", "2282534052")  # Orazio Pontorno
AUTHOR_NAME = "Orazio Pontorno"  # Fallback for search if ID not provided

def find_author_id():
    """Find Semantic Scholar Author ID by name"""
    try:
        print("🔍 Searching for author on Semantic Scholar...")
        url = "https://api.semanticscholar.org/graph/v1/author/search"
        params = {
            'query': AUTHOR_NAME,
            'limit': 5
        }
        
        response = requests.get(url, params=params)
        response.raise_for_status()
        
        data = response.json()
        authors = data.get('data', [])
        
        if authors:
            # Take the first match
            author = authors[0]
            author_id = author.get('authorId')
            name = author.get('name')
            print(f"✅ Found author: {name} (ID: {author_id})")
            return author_id
        else:
            print("❌ No author found with that name")
            return None
            
    except Exception as e:
        print(f"❌ Error searching for author: {e}")
        return None

def get_semantic_scholar_stats(author_id=None):
    """Fetch statistics from Semantic Scholar API"""
    try:
        print("🔍 Semantic Scholar Stats Updater")
        print("=" * 50)
        
        # If no author ID provided, search for it
        if not author_id:
            author_id = find_author_id()
            if not author_id:
                return None
        
        # Get author details with papers
        url = f"https://api.semanticscholar.org/graph/v1/author/{author_id}"
        
        params = {
            'fields': 'name,papers,papers.title,papers.citationCount,papers.year,papers.authors,papers.influentialCitationCount,citationCount,hIndex,paperCount'
        }
        
        print(f"📡 Fetching from: {url}")
        print(f"🔎 Author ID: {author_id}")
        
        response = requests.get(url, params=params)
        
        print(f"📊 Status code: {response.status_code}")
        
        if response.status_code != 200:
            print(f"❌ Error response: {response.text[:500]}")
        
        response.raise_for_status()
        
        data = response.json()
        
        # Extract statistics
        author_name = data.get('name', AUTHOR_NAME)
        h_index = data.get('hIndex', 0)
        citation_count = data.get('citationCount', 0)
        paper_count = data.get('paperCount', 0)
        papers = data.get('papers', [])
        
        print(f"✅ Found data for: {author_name}")
        print(f"✅ Total papers: {paper_count}")
        print(f"✅ Total citations: {citation_count}")
        print(f"✅ H-index: {h_index}")
        
        # Find most cited paper
        most_cited_count = 0
        publications_details = []
        coauthors_set = set()  # Track unique co-authors
        influential_citations_total = 0  # Track influential citations
        years_set = set()  # Track unique publication years
        
        print("\n📄 Publications breakdown:")
        for i, paper in enumerate(papers[:25], 1):  # Limit to first 25 for display
            title = paper.get('title') or 'Unknown'
            title = str(title).strip()
            cited_count = paper.get('citationCount', 0)
            year = paper.get('year', 'N/A')
            authors = paper.get('authors', [])
            influential_count = paper.get('influentialCitationCount', 0)
            
            # Track years
            if year != 'N/A' and year:
                years_set.add(year)
            
            # Sum influential citations
            influential_citations_total += influential_count
            
            # Count co-authors (excluding the author itself)
            if authors:
                for author in authors:
                    if isinstance(author, dict):
                        author_id_check = author.get('authorId')
                        if author_id_check and author_id_check != author_id:
                            coauthors_set.add(author_id_check)
            
            if cited_count > most_cited_count:
                most_cited_count = cited_count
            
            publications_details.append({
                'title': title,
                'citations': cited_count,
                'year': year
            })
            
            print(f"  {i}. [{year}] {title}... → {cited_count} citations ({influential_count} influential)")
        
        # Calculate research years
        if years_set:
            years_active = max(years_set) - min(years_set) + 1 if len(years_set) > 1 else 1
        else:
            years_active = 1
        
        # Calculate average citations per paper
        avg_citations = round(citation_count / paper_count, 1) if paper_count > 0 else 0
        
        stats = {
            "publications": paper_count,
            "citations": citation_count,
            "h_index": h_index,
            "most_cited": most_cited_count,
            "coauthors": len(coauthors_set),
            "influential_citations": influential_citations_total,
            "years_active": years_active,
            "avg_citations": avg_citations,
            "publications_details": publications_details[:10],  # Keep top 10
            "last_updated": datetime.now().strftime("%Y-%m-%d"),
            "source": "Semantic Scholar API",
            "author_id": author_id
        }
        
        print(f"\n📊 Final Statistics:")
        print(f"✅ Publications: {stats['publications']}")
        print(f"✅ Citations: {stats['citations']}")
        print(f"✅ H-index: {stats['h_index']}")
        print(f"✅ Most Cited: {stats['most_cited']}")
        print(f"✅ Co-authors: {stats['coauthors']}")
        print(f"✅ Influential Citations: {stats['influential_citations']}")
        print(f"✅ Years Active: {stats['years_active']}")
        print(f"✅ Avg Citations/Paper: {stats['avg_citations']}")
        
        return stats
        
    except requests.exceptions.HTTPError as e:
        print(f"❌ HTTP Error: {e}")
        if e.response.status_code == 429:
            print("⚠️  Rate limit exceeded. Waiting 60 seconds...")
            time.sleep(60)
            return None
        return None
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
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
    print("🔍 Semantic Scholar Stats Updater")
    print("=" * 50)
    
    author_id = SEMANTIC_SCHOLAR_AUTHOR_ID if SEMANTIC_SCHOLAR_AUTHOR_ID else None
    
    if author_id:
        print(f"✓ Author ID: {author_id}")
    else:
        print(f"✓ Searching for: {AUTHOR_NAME}")
    
    stats = get_semantic_scholar_stats(author_id)
    
    if stats:
        update_stats_file(stats)
        print("\n✅ Stats successfully updated!")
    else:
        print("\n❌ Failed to fetch stats from Semantic Scholar")

if __name__ == "__main__":
    main()
