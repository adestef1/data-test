import pandas as pd

data = pd.read_csv('poll03_recode.csv')

def filter_data(question, attr_col, attr_val):
    filter = data[data[attr_col] == attr_val]
    books = filter[question]
    hashed = {}
    for x in books:
        if x not in hashed:
            hashed[x] = 1
        else:
            hashed[x] += 1
    print(hashed)

filter_data('last_had_sex', 'grad_year', 2023)
