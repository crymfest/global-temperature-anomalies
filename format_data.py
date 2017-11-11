import pandas as pd
from tabulate import tabulate

#Load data - https://data.giss.nasa.gov/gistemp/graphs/
df_gistemp = pd.read_csv('GISTEMP.csv',header=1)

#Reformat Year column
def fix_year(row):
	dict_month = {"04":"-01-01","13":"-02-01","21":"-03-01","29":"-04-01","38":"-05-01","46":"-06-01","54":"-07-01","63":"-08-01","71":"-09-01","79":"-10-01","88":"-11-01","96":"-12-01"}
	str_month_dig = row['Year'].astype(str)[5:]
	return row['Year'].astype(str)[:4] + dict_month[str_month_dig]

df_gistemp['Year'] = df_gistemp.apply(fix_year, axis=1)
# df_gistemp['Year'] = pd.to_datetime(df_gistemp['Year'])
# df_gistemp['Year'] = pd.to_datetime(df_gistemp['Year']).dt.normalize()
# df_gistemp['Year'] = pd.DatetimeIndex(df_gistemp['Year']).normalize()

df_gistemp.to_csv('data.csv',index=False)

print tabulate(df_gistemp.head(15), headers=list(df_gistemp.columns), tablefmt='psql')