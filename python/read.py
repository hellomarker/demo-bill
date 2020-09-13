# coding:utf-8
import csv
csv_file = open(r'./bill.csv', mode='r', encoding='utf-8')
csv_data = csv.reader(csv_file)
csv_dict = []
header = []
for i in csv_data:
    if (len(header) == 0):
        header = i
    else:
        obj = {}
        for j in range(len(header)):
            obj[header[j]] = i[j]
        csv_dict.append(obj)
print(csv_dict)
csv_file.close()
