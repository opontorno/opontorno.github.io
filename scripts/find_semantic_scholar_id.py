#!/usr/bin/env python3
"""
Helper script to find your Semantic Scholar Author ID
"""

import requests
import json

def find_author_id(author_name):
    """Find Semantic Scholar Author ID by name"""
    try:
        print(f"🔍 Searching for: {author_name}")
        print("=" * 60)
        
        url = "https://api.semanticscholar.org/graph/v1/author/search"
        params = {
            'query': author_name,
            'limit': 10
        }
        
        response = requests.get(url, params=params)
        response.raise_for_status()
        
        data = response.json()
        authors = data.get('data', [])
        
        if not authors:
            print(f"❌ No authors found for '{author_name}'")
            return
        
        print(f"✅ Found {len(authors)} potential matches:\n")
        
        for i, author in enumerate(authors, 1):
            author_id = author.get('authorId')
            name = author.get('name')
            
            # Get more details for this author
            detail_url = f"https://api.semanticscholar.org/graph/v1/author/{author_id}"
            params = {
                'fields': 'name,paperCount,citationCount,hIndex,affiliations'
            }
            
            try:
                detail_response = requests.get(detail_url, params=params)
                detail_response.raise_for_status()
                details = detail_response.json()
                
                paper_count = details.get('paperCount', 0)
                citation_count = details.get('citationCount', 0)
                h_index = details.get('hIndex', 0)
                affiliations = details.get('affiliations', [])
                
                print(f"  {i}. {name}")
                print(f"     Author ID: {author_id}")
                print(f"     📄 Papers: {paper_count}")
                print(f"     📊 Citations: {citation_count}")
                print(f"     📈 H-index: {h_index}")
                
                if affiliations:
                    aff_names = [aff for aff in affiliations if aff][:2]
                    if aff_names:
                        print(f"     🏛️  Affiliations: {', '.join(aff_names)}")
                
                print()
                
            except Exception as e:
                print(f"     (Could not fetch details: {e})")
                print()
        
        print("=" * 60)
        print("💡 Copy the Author ID that matches your profile")
        print("   and set it as SEMANTIC_SCHOLAR_AUTHOR_ID in GitHub Secrets")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    # Change this to your name
    AUTHOR_NAME = "Orazio Pontorno"
    
    print("\n🔎 Semantic Scholar Author ID Finder")
    print("=" * 60)
    
    find_author_id(AUTHOR_NAME)
