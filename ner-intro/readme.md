# Intro to NER

Named Entity Recognition - used to identify keywords (or a series of) in a document and categorize these.
Example Amazon.com is a company and website.

1. Detect keyword.
2. Categorize keyword.

## Keyword Detection

E.g. the great amazon river - an entity made of 3 tokens. There are various techniques in bundling tokens to form an entity.

| **Tag** |     **Meaning**     |          **English Examples**          |
| :-----: | :-----------------: | :------------------------------------: |
|   ADJ   |      adjective      |  new, good, high, special, big, local  |
|   ADP   |     adposition      |   on, of, at, with, by, into, under    |
|   ADV   |       adverb        |   really, already, still, early, now   |
|  CONJ   |     conjunction     |   and, or, but, if, while, although    |
|   DET   | determiner, article |  the, a, some, most, every, no, which  |
|  NOUN   |        noun         |    year, home, costs, time, Africa     |
|   NUM   |       numeral       |    twenty-four, fourth, 1991, 14:24    |
|   PRT   |      particle       | at, on, out, over per, that, up, with  |
|  PRON   |       pronoun       |     he, their, her, its, my, I, us     |
|  VERB   |        verb         |  is, say, told, given, playing, would  |
|    .    |  punctuation marks  |                . , ; !                 |
|    X    |        other        | ersatz, esprit, dunno, gr8, univeristy |

NLTK tagging and catgeories.

| **POS Tag** | **Description**                                                           |
| ----------- | ------------------------------------------------------------------------- |
| CC          | CC coordinating conjunction                                               |
| CD          | CD cardinal digit                                                         |
| DT          | DT determiner                                                             |
| EX          | EX existential there (like: “there is” … think of it like “there exists”) |
| FW          | FW foreign word                                                           |
| IN          | IN preposition/subordinating conjunction                                  |
| JJ          | JJ adjective ‘big’                                                        |
| JJR         | JJR adjective, comparative ‘bigger’                                       |
| JJS         | JJS adjective, superlative ‘biggest’                                      |
| LS          | LS list marker 1)                                                         |
| MD          | MD modal could, will                                                      |
| NN          | NN noun, singular ‘desk’                                                  |
| NNS         | NNS noun plural ‘desks’                                                   |
| NNP         | NNP proper noun, singular ‘Harrison’                                      |
| NNPS        | NNPS proper noun, plural ‘Americans’                                      |
| PDT         | PDT predeterminer ‘all the kids’                                          |
| POS         | POS possessive ending parent’s                                            |
| PRP         | PRP personal pronoun I, he, she                                           |
| PRP$        | PRP$ possessive pronoun my, his, hers                                     |
| RB          | RB adverb very, silently,                                                 |
| RBR         | RBR adverb, comparative better                                            |
| RBS         | RBS adverb, superlative best                                              |
| RP          | RP particle give up                                                       |
| TO          | TO, to go ‘to’ the store.                                                 |
| UH          | UH interjection, errrrrrrrm                                               |
| VB          | VB verb, base form take                                                   |
| VBD         | VBD verb, past tense took                                                 |
| VBG         | VBG verb, gerund/present participle taking                                |
| VBN         | VBN verb, past participle taken                                           |
| VBP         | VBP verb, sing. present, non-3d take                                      |
| VBZ         | VBZ verb, 3rd person sing. present takes                                  |
| WDT         | WDT wh-determiner which                                                   |
| WP          | WP wh-pronoun who, what                                                   |
| WP$         | WP$ possessive wh-pronoun whose                                           |
| WRB         | WRB wh-abverb where, when                                                 |

## Category Creation

For example:

- Person. E.g. Donald Trump
- Organization. E.g. WHO
- Time. E.g. morning
- Art. E.g. Mona Lisa

Spacy has the following cathegories: 
| **Category**                              | **Description**                                      |
| ----------------------------------------- | ---------------------------------------------------- |
| PERSON:                                   | People, including fictional.                         |
| NORP:                                     | Nationalities or religious or political groups.      |
| FAC:                                      | Buildings, airports, highways, bridges, etc.         |
| ORG:                                      | Companies, agencies, institutions, etc.              |
| GPE:                                      | Countries, cities, states.                           |
| LOC:                                      | Non-GPE locations, mountain ranges, bodies of water. |
| PRODUCT:                                  | Objects, vehicles, foods, etc. (Not services.)       |
| EVENT:                                    | Named hurricanes, battles, wars, sports events, etc. |
| WORK_OF_ART: Titles of books, songs, etc. |                                                      |
| LAW:                                      | Named documents made into laws.                      |
| LANGUAGE:                                 | Any named language.                                  |
| DATE:                                     | Absolute or relative dates or periods.               |
| TIME:                                     | Times smaller than a day.                            |
| PERCENT:                                  | Percentage, including ”%“.                           |
| MONEY:                                    | Monetary values, including unit.                     |
| QUANTITY:                                 | Measurements, as of weight or distance.              |
| ORDINAL:                                  | “first”, “second”, etc.                              |
| CARDINAL:                                 | Numerals that do not fall under another type.        |

# Training

Model has to be trained with relevant data.
Identify entities and categories first and then train.

# Usecase

- Information summarization: NER gives a high overview of large volumes of text. E.g. categorizing a business user requests.
- Optimizing search engines: Same as the summarization, search engines run NER to recommend websites for queries.
- Medical and Science: Used in the medical and bioengineering industry to tag drugs, disseases and even DNA.
- Content recommendations: Identify what you like to stream through NER and able to provide similar content.

# Implementation and Code

spaCy is a free, open-source library for advanced Natural Language Processing (NLP) in Python.
First we would need to download the available pipelines, transforments and components:

```bash
pip install spacytextblob
python -m textblob.download_corpora
python -m spacy download en_core_web_sm
```

Note that sm there means its missing word2vec data.

Breaking down a text into undestandable components
```python
text1 = nlp("Delhi is the capital of India. Delhi has a population of 1.3 crore. Arvind Kejriwal is the Chief Minister of Delhi")
for word in text1.ents:
  print(word.text,word.label_)
```

Also can use:
```python
spacy.explain("ORG")
```

or to get a more notebook experience:

```python
from spacy import displacy

text1_spans = list(text1.sents)
displacy.render(text1_spans, style="dep",jupyter=True, options = {"compact": True, "add_lemma": True})
```

Note how we add lemmatization components to see the base of the words and break it down in sentences spans to see how the NLP pipeline breaks our text down.

 It was on VADER (Valence Aware Dictionary and Sentiment Reasoner). VADER is another Lexicon-based sentiment analyzer that has pre-defined rules for words or lexicons. VADER not only tells the lexicon is positive, negative, or neutral, it also tells how positive, negative, or neutral a sentence is. The output from VADER comes in a Python dictionary in which we have four keys and their corresponding values. ‘neg’, ‘neu’, ‘pos’, and ‘compound’ which stands for Negative, Neutral, and Positive respectively. The Compound score is an indispensable score that is calculated by normalizing the other 3 scores (neg, neu, pos) between -1 and +1. The decision criteria are similar to TextBlob -1 is for most negative and +1 is for most positive.

#  References

[Spacy](https://spacy.io/) Open-source NLP framework.