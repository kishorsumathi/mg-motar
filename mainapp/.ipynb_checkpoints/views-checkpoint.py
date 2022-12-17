from django.shortcuts import render
import pandas as pd
from rest_framework import status
from rest_framework.decorators import api_view
from .models import voicesearch
from rest_framework.response import Response
from .helper import voiceSerializer
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer
from nltk.tokenize import sent_tokenize
import spacy
import spacy
from spacy.matcher import PhraseMatcher
import numpy as np
import os
nltk.download('punkt')
nltk.download('stopwords')
nlp = spacy.load("en_core_web_sm")

# Create your views here.

def preprocess(words):
        word_tokens_1 = word_tokenize(words)
        stop_words = set(stopwords.words('english'))
        new_sent_1 = [w for w in word_tokens_1 if not w.lower() in stop_words]
        new_sent_1= ' '.join([str(elem.lower()) for elem in new_sent_1])
        words=new_sent_1
        return words
    

def checking(text,df):
        dict={}
        terms=df["part_name"].to_list()
        nlp = spacy.load("en_core_web_sm")
        matcher = PhraseMatcher(nlp.vocab)
        term_new=[]
        for term in terms:
            term=preprocess(term)
            term_new.append(term)
        patterns = [nlp.make_doc(text) for text in term_new]
        matcher.add("TerminologyList", patterns)
        for i in range(0, len(term_new)):       
            dict[term_new[i]]=[df.iloc[i,0],df.iloc[i,1],df.iloc[i,2]]
        text =preprocess(text)
        doc=nlp(text)
        output=[]
        matches = matcher(doc)
        for match_id, start, end in matches:
            span = doc[start:end]
            output.append(span.text)
        if len(output)>0:
            value=[]
            for i in output:
                value.append(dict[i])
            return  value
        else:
            return 0
@api_view(['GET', 'POST'])
def search(request):
    if request.method == 'GET':
        # db = voicesearch.objects.all()
        # serializer=voiceSerializer(db,many=True)
        return  render(request, 'index.html')
    elif request.method == 'POST':
        db = voicesearch.objects.all().values()
        df=pd.DataFrame(list(db))
        df=df.drop(["id"],axis=1)
        text_query=request.data['text']
        text=preprocess(text_query)
        final=checking(text,df)
        print(final)
        if final==0:
            final_df="Please try rephrasing or update the data"
        else:
            print
            final_df=pd.DataFrame(final,columns=["Part_Name","Location","Quantity"])
        #serializer=voiceSerializer(next(iter(final)),many=True)
        field=["Part_Name","Location","Quantity"]
        return Response({"Query_Text":text_query, "Search_Result":final_df})
