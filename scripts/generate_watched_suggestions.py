import urllib.request
import json
import os
import collections

# This script reads watched anime from watched.json (exported from the app)
# and generates recommendations based on them using AniList's API.
# It outputs the result to public/watched_suggestions.json.

url = 'https://graphql.anilist.co'
query = '''
query ($id: Int) {
  Media(id: $id, type: ANIME) {
    recommendations(sort: RATING_DESC, page: 1, perPage: 5) {
      nodes {
        mediaRecommendation {
          id
          title {
            english
            romaji
          }
          coverImage {
            large
          }
          episodes
          genres
          seasonYear
          averageScore
        }
      }
    }
  }
}
'''

def fetch_recommendations_for_anime(anime_id):
    variables = {'id': anime_id}
    req = urllib.request.Request(
        url, 
        method="POST", 
        headers={
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
    )
    body = json.dumps({'query': query, 'variables': variables}).encode('utf-8')
    try:
        with urllib.request.urlopen(req, data=body) as response:
            data = json.loads(response.read().decode('utf-8'))
            nodes = data.get('data', {}).get('Media', {}).get('recommendations', {}).get('nodes', [])
            return [n['mediaRecommendation'] for n in nodes if n.get('mediaRecommendation')]
    except Exception as e:
        print(f"Error fetching for ID {anime_id}: {e}")
        return []

def main():
    if not os.path.exists('watched.json'):
        print("watched.json not found. Please export your watched anime to watched.json first.")
        print("Expected format: [{\"id\": 123}, {\"id\": 456}]")
        return

    with open('watched.json', 'r', encoding='utf-8') as f:
        watched_data = json.load(f)
    
    watched_ids = set()
    for item in watched_data:
        # Assuming ID might be AniList ID
        if 'id' in item:
            watched_ids.add(item['id'])
    
    print(f"Found {len(watched_ids)} watched anime.")
    
    recommendation_counts = collections.defaultdict(int)
    recommendation_details = {}

    for count, anime_id in enumerate(watched_ids, 1):
        print(f"Fetching recommendations for {anime_id} ({count}/{len(watched_ids)})...")
        recs = fetch_recommendations_for_anime(anime_id)
        for r in recs:
            rid = r['id']
            if rid in watched_ids:
                continue
            recommendation_counts[rid] += 1
            recommendation_details[rid] = r

    # Sort by how many times they were recommended, then by average score
    sorted_recs = sorted(
        recommendation_counts.keys(), 
        key=lambda x: (recommendation_counts[x], recommendation_details[x].get('averageScore', 0) or 0), 
        reverse=True
    )

    top_recs = sorted_recs[:50] # Top 50 suggestions
    output_list = []
    for rid in top_recs:
        media = recommendation_details[rid]
        output_list.append({
            'id': media['id'],
            'title': media['title']['english'] or media['title']['romaji'],
            'image': media['coverImage']['large'] if media.get('coverImage') else '',
            'episodes': media['episodes'],
            'genres': media['genres'],
            'year': media['seasonYear'],
            'score': media['averageScore']
        })

    os.makedirs('public', exist_ok=True)
    with open('public/watched_suggestions.json', 'w', encoding='utf-8') as f:
        json.dump(output_list, f, ensure_ascii=False, indent=2)
    
    print(f"Saved {len(output_list)} recommendations to public/watched_suggestions.json")

if __name__ == '__main__':
    main()
