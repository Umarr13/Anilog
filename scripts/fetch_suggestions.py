import urllib.request
import json
import os

url = 'https://graphql.anilist.co'
query = '''
query ($page: Int, $perPage: Int) {
  Page(page: $page, perPage: $perPage) {
    media(type: ANIME, sort: SCORE_DESC, popularity_greater: 80000) {
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
'''

anime_list = []
for page in [1, 2]:
    variables = {
        'page': page,
        'perPage': 100
    }
    print(f"Fetching page {page}...")
    try:
        req = urllib.request.Request(
            url, 
            method="POST", 
            headers={
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        )
        body = json.dumps({'query': query, 'variables': variables}).encode('utf-8')
        
        with urllib.request.urlopen(req, data=body) as response:
            data = json.loads(response.read().decode('utf-8'))

        for media in data['data']['Page']['media']:
            anime_list.append({
                'id': media['id'],
                'title': media['title']['english'] or media['title']['romaji'],
                'image': media['coverImage']['large'],
                'episodes': media['episodes'],
                'genres': media['genres'],
                'year': media['seasonYear'],
                'score': media['averageScore']
            })
    except Exception as e:
        print(f"Error fetching data: {e}")

if anime_list:
    os.makedirs('public', exist_ok=True)
    with open('public/suggestions.json', 'w', encoding='utf-8') as f:
        json.dump(anime_list, f, ensure_ascii=False, indent=2)
    print(f"Saved {len(anime_list)} anime to public/suggestions.json")
else:
    print("Failed to fetch anime.")

