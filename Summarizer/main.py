import fastapi
from fastapi.responses import HTMLResponse
from summarizer import getLatestArticles
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
import requests



app = fastapi.FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")

origins = [
    # all origins
    "*",
    "http://localhost:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

apiKey = '50da3993430e4169b32df2f39b01d327'

@app.get('/', response_class=HTMLResponse)
def index():
    return """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Search Summarizer</title>
        <link rel="stylesheet" href="/static/styles.css">
    </head>
    <body>
        <div class="home">
            <h1>Search Summarizer</h1>
            <form action="/search" method="get">
                <input type="text" name="query" placeholder="Search">
                <input type="submit" value="Search">
            </form>
        </div>
    </body>
    </html>
    """

def format_article(article):
    return f"""
    
    <div class='article'>
    <h1 class='title'">{article.get('title')}</h1>
    <p>{article.get('description')}</p>
    <p>{article.get('summary')}</p>
    <a href="{article.get('url')}" target="_blank" class="morebtn">
                    Read More
                    <span class="tooltip">{article.get('url')}</span>
                </a>

    </div> 
    """

@app.get('/search')
def search(query, sentences_count: int = 3, language: str = 'english'):
    if not query:
        return HTMLResponse(index())
    
    ##################

    url = "http://localhost:3000/api/search-data"  # Example API

    # Send a GET request
    response = requests.get(url)
    data={
    'carbonEmissions': {
        'total': '1300.834835'
    }}

    # Check if the request was successful
    if response.status_code == 200:
        data = response.json()  # Convert JSON response to Python dictionary
        print(data)
    else:
        print(f"Error: {response.status_code}")


    articles = getLatestArticles(sentences_count, q=query)
    
    formatted_articles = [format_article(article) for article in articles]
    formatted_articles.reverse()

    html_content = """
    
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Search Summarizer</title>
        <link rel="stylesheet" href="/static/styles.css">
    </head>
    <body>
    <div class="top">
    <div>
    <h1 style="margin-left:10px">Search Summarizer</h1>
<div class="search-container">
    <form action="/search" method="get">
        <input type="text" name="query" placeholder="Search">
        <button type="submit">Search</button>
    </form>
</div>


    </div>
            <a href="http://localhost:3000/">
            <div class="info-box">
            <svg class="circle-animation">
                <circle cx="60" cy="60" r="56" />
            </svg>
            <p class="title"><b>carbon emision:</b></p>
            <p class="value">{}</p>
            <p class="unit">kg CO<sub>2</sub></p>
            <span class="tooltip">Today's total <br /> carbon emision: <br /> <span style="color:red">click to view stats</span></span>
        </div>
        </a>
  </div>

  
    </div>

    <h1 style="margin-left:10px">Summaries of feeds on the topic of "{}"</h1>
    <script src="/static/autocomplete.js"></script>

    </body>
    </html>
    """.format( round(float(data['carbonEmissions']['total']), 2) , query) + ''.join(formatted_articles)

    return HTMLResponse(content=html_content) 

@app.get('/feed')
def feed(query, sentences_count: int = 3, language: str = 'english'):
    if not query:
        return []
    
    articles = getLatestArticles(sentences_count, q=query)
    
    return articles
