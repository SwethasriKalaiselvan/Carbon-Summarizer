from sumy.parsers.html import HtmlParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.lsa import LsaSummarizer as Summarizer
from sumy.nlp.stemmers import Stemmer
from sumy.utils import get_stop_words
import newsapi
from newsapi import NewsApiClient
import concurrent.futures

# 50da3993430e4169b32df2f39b01d327 //banu's

# 5707e0ccd82c4f92bdfbdbc731f574e8  // previous
newsapi = newsapi.NewsApiClient(api_key='50da3993430e4169b32df2f39b01d327')	

def htmlSummarizer(url: str, sentences_count: int, language: str = 'english') -> str:
    """
    Summarizes text from URL
    """
    
    try:
        parser = HtmlParser.from_url(url, Tokenizer(language))
    except:
        return ''
    
    stemmer = Stemmer(language)
    summarizer = Summarizer(stemmer)
    summarizer.stop_words = get_stop_words(language)

    summary = ''
    for sentence in summarizer(parser.document, sentences_count):
        if not summary:
            summary += str(sentence)
        else:
            summary += ' ' + str(sentence)

    return summary


def newsAPI(q) -> list:
    all_articles = newsapi.get_everything(
        q=q,
        page_size=10,
        sort_by='publishedAt'
    )
    
    return all_articles['articles']


def summarizeArticles(articles: list, sentences_count: int) -> list:
    """
    Summarizes text at each URL in articles using multiple threads
    """
    with concurrent.futures.ThreadPoolExecutor() as executor:
        futures = []
        for article in articles:
            future = executor.submit(htmlSummarizer, article.get('url'), sentences_count)
            futures.append(future)

        for i, future in enumerate(concurrent.futures.as_completed(futures)):
            summary = future.result()
            articles[i].update({'summary': summary})

    return articles


def getLatestArticles(sentences_count: int, q) -> list:
    """
    Sends GET request to News API /v2/top-headlines endpoint,
    """
    articles = newsAPI(q)
    summaries = summarizeArticles(articles, sentences_count)

    return summaries
