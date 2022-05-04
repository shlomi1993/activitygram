import gensim
from gensim.models import Word2Vec
from nltk.tokenize import sent_tokenize, word_tokenize
import warnings

warnings.filterwarnings(action='ignore')

sample = open("alice.txt", "r", encoding='utf-8')
s = sample.read()
f = s.replace("\n", " ")

data = []

for i in sent_tokenize(f):
    temp = []
    for j in word_tokenize(i):
        temp.append(j.lower())
    data.append(temp)

# model1 = gensim.models.Word2Vec(data, min_count=1, size=100, window=5)
#
# print("Cosine similarity between 'alice' and 'wonderland' - CBOW : ",
#       model1.similarity('alice', 'wonderland'))
#
# print("Cosine similarity between 'alice' and 'machines' - CBOW : ",
#       model1.similarity('alice', 'machines'))
#
# model2 = gensim.models.Word2Vec(data, min_count=1, size=100, window=5, sg=1)
#
# print("Cosine similarity between 'alice' and 'wonderland' - Skip Gram : ",
#       model2.similarity('alice', 'wonderland'))
#
# print("Cosine similarity between 'alice' and 'machines' - Skip Gram : ",
#       model2.similarity('alice', 'machines'))
