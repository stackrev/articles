"""
Scrapes tweets, a simple script.
"""
# pip install tweepy
import pandas as pd
import requests
import tweepy

api = "consumer_key"
sec = "consumer_secret"
tok = "bearer_token"
cid = "access_token"
csec = "access_token_secret"

client = tweepy.Client(bearer_token=tok,
                       consumer_key=api,
                       consumer_secret=sec,
                       access_token=cid,
                       access_token_secret=csec,
                       return_type=requests.Response,
                       wait_on_rate_limit=True)

user = client.get_user(username='NikolaTrevor7')
user_dict = user.json()
user_id = user_dict['data']['id']
next = None
while True:
    tweets = client.get_users_tweets(id=user_id, pagination_token=next)

    tweets_dict = tweets.json()
    tweets_data = tweets_dict['data']
    next = tweets_dict['meta']['next_token'] if 'next_token' in tweets_dict['meta'] else None

    df = pd.json_normalize(tweets_data)
    print(df)
    df.to_csv("tweets.csv", mode='a', header=False)
    if next is None:
        break
