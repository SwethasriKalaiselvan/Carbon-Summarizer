# Slide 1

Good afternoon to the honourable people and everyone present here. We are a team of 3 from Dr. NGP Institute of technology. I am Aravinda Kumar. And we are excited to present a solution to help fight climate change.

One of the best things we can do to help fight climate change is to keep an eye on all the happenings related to energy, such as our consumption of resources, new government policies, carbon levels, etc.

As citizens of the earth, we all have a responsibility to monitor and critique these events accordingly. So, how do we do it?

# Slide 3 - Problem Statement

Well, for one thing, we can look it up on the internet and go through all the results the search engine lists. However, with so many news sources available on the internet, it can be difficult for a human to sift through it all and curate it. 

# Slide 4 - Solution

The "Energy Data Feed Summarizer" is a viable solution. It aims to reduce the amount of time spent on data aggregation and summarization by providing an API that can take a query and return the summaries of the latest relevant articles. This solution will be of great help to people who want to keep track of the latest, like students, researchers, journalists, and even CTOs of companies.

As for the commercialization aspect, we have many options. We can make the API as a paid service which cacn be used by students, developers and companies to incorporate it into their projects. Or we can deploy it as a web application which can be used by the general public. Or we can provide customized APIs based on organizational needs.

# Slide 5 - Working of the Solution

Let me explain how the solution works.

Our solution incorporates the FastAPI framework. The user is provided with a Web interface through which they can enter a particular topic as a query.

The API sends a request with the inputted query parameters to another API called "newsapi." The "newsapi" is a simple HTTP REST API for searching and retrieving live articles from all over the web. It responds with a JSON object containing information on articles.

We then parse the response and give the list of urls for all the articles to the methods defined in the summarizer.

Finally, we output the results as an HTML response, which is rendered as a web page for the user to see and interact with.

Now, let's take look at how the summarizer works.

# Slide 6 - Working of the Summarizer

This is a diagrammatic representation showing the workings of the summarizer.

We invoke the "getLastestArticles()" method to get a collection of article urls from the "newsAPI()" function and then pass it to the "summarizeArticles()" method.

The "htmlSummarizer()" makes use of the "sumy" package to summarize the articles.

The sumy package includes a collection of classes like Parser, Stemmer, Tokenizer, Summarizer, etc., which are used to parse the article, stem the words, tokenize the sentences, and summarise the article, respectively. We employ these classes to summarise the articles.

# Slide 7 - How it works

So, we get input from the user. We fetch article URLs relevant to the input. We summarise the content of the articles. We show the user the results.

Here's adithyan to tell you more about the technology stack we used for this project.
