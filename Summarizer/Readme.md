# MLAI based summarization and data aggregation for generating insights from “Energy Data feed”
This is a project to generate insights from energy data feed.

The solution is deployed on Render.com. You can access the solution at [searchly-api](https://searchly-api.azurewebsites.net) (https://searchly-api.azurewebsites.net)

## Problem Statement
Develop a MLAI based summarization and data aggregation for generating insights from “Energy Data feed”
− Minimize manual curation and analysis in automated feed
− Consider data from disparate data sources such as blogs, forums, news sites, social media, and e-commerce sites

## Solution
The solution is to create a REST API service that will take the data feed as input and will return the summarized data feed as output. The summarized data feed will be used to generate insights.

## How it works
We get input query from the user. We pass the query as parameter to the 'newsapi' API. The 'newsapi' API returns the data in a JSON format. We extract the data from the JSON and pass it to the 'sumy' library. The 'sumy' library returns the summarized data.

After getting the summarized data, it is displayed to the user using fastapi's HTMLResponse method.

## Technology Stack
The project is based on the following technologies:

sumy - for summarization of the data feed. It is a python library for automatic summarization of text documents. It supports several algorithms for summarization and it is easy to use.

fastapi - for creating a REST API for the summarization service. It is a modern, fast (high-performance), web framework for building APIs with Python 3.6+ based on standard Python type hints.

uvicorn - for running the REST API service. It is a lightning-fast ASGI server implementation, using uvloop and httptools.

newsapi - for getting the data feed. It is a simple HTTP REST API for searching and retrieving live articles from all over the web.

## How to run the project
1. Clone the project
2. Install the dependencies (pip install -r requirements.txt)
3. Run the 'prerequisites.py' file to download 'punkt'
4. Run 'python -m uvicorn main:app --reload' to run the REST API service
5. Open the browser and go to 'http://127.0.0.1:8000/' to access the API
6. Enter the query and click on 'Search' to get the summarized data feed
7. To know more about the API, go to 'http://127.0.0.1:8000/docs'

## Screenshots
### Home page
![Screenshot 1](/static/screenshot1.png)

### Search results
![Screenshot 2](/static/screenshot2.png)
